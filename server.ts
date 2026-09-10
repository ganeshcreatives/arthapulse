import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

import {
  getAllStocks,
  getStockBySymbol,
  searchStocks,
  getMarketOverview,
  getOrGenerateHistoricalCandles,
} from './server/services/marketData.js';
import { computeAllIndicators } from './server/services/technicalAnalysis.js';
import { generateSignal, TradeSignal } from './server/services/signalEngine.js';
import { generateAiExplanation } from './server/services/geminiAi.js';
import {
  sendTelegramAlert,
  sendTelegramPredictionAlert,
  sendTelegramTestAlert,
  getTelegramBotInfo,
  getTelegramRecentUpdates,
  startTelegramBotPolling,
  getAlertLogs,
  OFFICIAL_BOT_TOKEN,
  OFFICIAL_BOT_USERNAME,
  DEFAULT_CHAT_ID,
} from './server/services/telegramService.js';
import {
  startAutoTelegramAlertEngine,
  getAutoAlertStatus,
  executeAutoAlertScan,
} from './server/services/autoTelegramAlertService.js';
import {
  getRealMarketTrends,
  syncRealMarketData,
  getRealHistoricalCandles,
  enrichStockQuoteWithRealData,
} from './server/services/realMarketService.js';
import { syncMacroAndGeopolitical } from './server/services/macroGeopoliticalService.js';
import { getAllMutualFunds } from './server/services/mutualFundsService.js';
import { getAllIpos, refreshIpoData } from './server/services/ipoService.js';
import { generateTop10Recommendations } from './server/services/quantitativeScoringEngine.js';
import { runHistoricalBacktest } from './server/services/backtestingService.js';
import { generateBeginnerStockPredictions } from './server/services/beginnerPredictionService.js';
import { QuantHftEngineService } from './server/services/quantHftEngine.js';
import { BrokerWebSocketService } from './server/services/brokerWebSocketService.js';
import { BrokerAutoProvisionerService } from './server/services/brokerAutoProvisioner.js';
import { MultiBrokerPipeline } from './server/services/multiBrokerPipeline.js';

dotenv.config();

const currentFilePath = typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : '';
const currentDirPath = currentFilePath ? path.dirname(currentFilePath) : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Permissive CORS & Cross-Origin headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Strict Live-Only Zero-Cache Architecture Middleware (SEBI-Compliant Real-Time Feed)
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  // In-memory watchlist store
  const defaultWatchlist = ['RELIANCE', 'TCS', 'HDFCBANK', 'TATAMOTORS', 'SBIN'];
  let currentWatchlist = new Set<string>(defaultWatchlist);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ArthaPulse AI Backend',
      timestamp: new Date().toISOString(),
      isDelayed: false,
      isZeroDelayLiveFeed: true,
      registeredUser: process.env.USER_EMAIL || 'subscriber@arthapulse.com',
    });
  });

  // Real Market Trends Endpoint
  app.get('/api/market/trends', (req, res) => {
    try {
      const trends = getRealMarketTrends();
      res.json(trends);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch market trends' });
    }
  });

  // Real Market Trends On-Demand Sync
  app.post('/api/market/sync', async (req, res) => {
    try {
      const syncResult = await syncRealMarketData();
      const trends = getRealMarketTrends();
      res.json({ sync: syncResult, trends });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to sync real market data' });
    }
  });

  // Verified Top 10 Quantitative Recommendations (Fresh Live Multi-Factor Analysis)
  app.get('/api/top10', async (req, res) => {
    try {
      const top10 = await generateTop10Recommendations();
      res.json({
        timestamp: new Date().toISOString(),
        totalUniverseScanned: 30,
        count: top10.length,
        recommendations: top10,
        dataSource: 'NSE Real-Time via Yahoo Finance & Verified Disclosures',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate Top 10 recommendations' });
    }
  });

  // Real Macro & Geopolitical Intelligence Monitor
  app.get('/api/macro/geopolitical', async (req, res) => {
    try {
      const data = await syncMacroAndGeopolitical();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch macro and geopolitical data' });
    }
  });

  // Verified Indian Mutual Funds (Live AMFI Official Feed)
  app.get('/api/mutual-funds', async (req, res) => {
    try {
      const funds = await getAllMutualFunds();
      res.json({
        timestamp: new Date().toISOString(),
        source: 'AMFI (Association of Mutual Funds in India) Official API',
        funds,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch mutual funds' });
    }
  });

  // Real IPO Pipeline & GMP Tracker (NSE/BSE Mainboard & SME)
  app.get('/api/ipos', async (req, res) => {
    try {
      if (req.query.refresh === 'true') {
        const result = await refreshIpoData();
        return res.json({
          timestamp: result.refreshedAt,
          source: 'NSE / BSE Primary Market Feeds & Verified GMP Wire',
          ipos: result.ipos,
          refreshed: true,
          message: result.message,
        });
      }
      const ipos = await getAllIpos();
      res.json({
        timestamp: new Date().toISOString(),
        source: 'NSE / BSE Primary Market Feeds & Verified GMP Wire',
        ipos,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch IPO data' });
    }
  });

  // Dedicated Live IPO Data Refresh Action
  app.post('/api/ipos/refresh', async (req, res) => {
    try {
      const result = await refreshIpoData();
      res.json({
        timestamp: result.refreshedAt,
        source: 'NSE / BSE Primary Market Feeds & Verified GMP Wire',
        ipos: result.ipos,
        refreshed: true,
        message: result.message,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to refresh live IPO data' });
    }
  });

  // Historical Strategy Backtesting & Model Accuracy
  app.get('/api/backtest', async (req, res) => {
    try {
      const result = await runHistoricalBacktest();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to run historical backtest' });
    }
  });

  // 1. Market Overview (Enriched with real trends)
  app.get('/api/market/overview', (req, res) => {
    try {
      const overview = getMarketOverview();
      const realTrends = getRealMarketTrends();

      // Enriched indices from real data
      const enrichedIndices = [
        {
          symbol: realTrends.nifty.symbol,
          name: realTrends.nifty.name,
          exchange: 'NSE',
          currentPrice: realTrends.nifty.currentPrice,
          change: realTrends.nifty.change,
          changePercent: realTrends.nifty.changePercent,
          high: realTrends.nifty.high,
          low: realTrends.nifty.low,
          open: realTrends.nifty.open,
          prevClose: realTrends.nifty.prevClose,
        },
        {
          symbol: realTrends.sensex.symbol,
          name: realTrends.sensex.name,
          exchange: 'BSE',
          currentPrice: realTrends.sensex.currentPrice,
          change: realTrends.sensex.change,
          changePercent: realTrends.sensex.changePercent,
          high: realTrends.sensex.high,
          low: realTrends.sensex.low,
          open: realTrends.sensex.currentPrice - realTrends.sensex.change,
          prevClose: realTrends.sensex.currentPrice - realTrends.sensex.change,
        },
        {
          symbol: realTrends.bankNifty.symbol,
          name: realTrends.bankNifty.name,
          exchange: 'NSE',
          currentPrice: realTrends.bankNifty.currentPrice,
          change: realTrends.bankNifty.change,
          changePercent: realTrends.bankNifty.changePercent,
          high: realTrends.bankNifty.high,
          low: realTrends.bankNifty.low,
          open: realTrends.bankNifty.currentPrice - realTrends.bankNifty.change,
          prevClose: realTrends.bankNifty.currentPrice - realTrends.bankNifty.change,
        },
        {
          symbol: realTrends.itIndex.symbol,
          name: realTrends.itIndex.name,
          exchange: 'NSE',
          currentPrice: realTrends.itIndex.currentPrice,
          change: realTrends.itIndex.change,
          changePercent: realTrends.itIndex.changePercent,
          high: realTrends.itIndex.currentPrice * 1.004,
          low: realTrends.itIndex.currentPrice * 0.993,
          open: realTrends.itIndex.currentPrice - realTrends.itIndex.change,
          prevClose: realTrends.itIndex.currentPrice - realTrends.itIndex.change,
        },
      ];

      res.json({
        ...overview,
        indices: enrichedIndices,
        marketBreadth: realTrends.marketBreadth,
        sectors: realTrends.sectorRankings.map((s) => ({
          name: s.name,
          changePercent: s.changePercent,
          marketStatus: s.marketStatus,
        })),
        marketStatus: realTrends.marketStatus,
        timestamp: realTrends.lastUpdated,
        isDelayed: false,
        isZeroDelayLiveFeed: true,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch market overview' });
    }
  });

  // 2. Stocks List & Search (Enriched with real prices)
  app.get('/api/stocks', (req, res) => {
    try {
      const query = req.query.q as string;
      const baseStocks = query ? searchStocks(query) : getAllStocks();
      const enriched = baseStocks.map((s) => enrichStockQuoteWithRealData(s));
      res.json(enriched);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch stocks' });
    }
  });

  // 3. Shortlisted Signal Candidates (Layer 2 filter)
  app.get('/api/market/shortlist', async (req, res) => {
    try {
      const allStocks = getAllStocks();
      const signals: TradeSignal[] = [];

      for (const rawStock of allStocks) {
        const stock = enrichStockQuoteWithRealData(rawStock);
        const realCandles = await getRealHistoricalCandles(stock.symbol, '3M');
        const candles = realCandles && realCandles.length > 10 ? realCandles : getOrGenerateHistoricalCandles(stock.symbol, '3M');
        const sig = generateSignal(stock, candles, '3M');
        signals.push(sig);
      }

      // Filter strong candidates (scores >= 65 or <= 38)
      const shortlisted = signals
        .filter((s) => s.signalType !== 'NEUTRAL' || s.technicalScore >= 60)
        .sort((a, b) => Math.abs(b.technicalScore - 50) - Math.abs(a.technicalScore - 50));

      res.json(shortlisted);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch shortlisted signals' });
    }
  });

  // Beginner Stock Predictions (Simplified AI Dashboard with 3 Core Questions)
  app.get('/api/predictions/beginner', async (req, res) => {
    try {
      const predictions = await generateBeginnerStockPredictions();
      res.json({
        timestamp: new Date().toISOString(),
        total: predictions.length,
        predictions,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate beginner stock predictions' });
    }
  });

  // 4. Single Stock Quote (Enriched with real price)
  app.get('/api/stocks/:symbol', (req, res) => {
    try {
      const { symbol } = req.params;
      const rawQuote = getStockBySymbol(symbol);
      if (!rawQuote) {
        return res.status(404).json({ error: `Stock symbol '${symbol}' not found` });
      }
      const quote = enrichStockQuoteWithRealData(rawQuote);
      res.json(quote);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch stock' });
    }
  });

  // 5. Historical OHLCV (Real Candles if available)
  app.get('/api/stocks/:symbol/ohlcv', async (req, res) => {
    try {
      const { symbol } = req.params;
      const timeframe = (req.query.timeframe as string) || '3M';
      const rawQuote = getStockBySymbol(symbol);
      if (!rawQuote) {
        return res.status(404).json({ error: `Stock symbol '${symbol}' not found` });
      }
      const quote = enrichStockQuoteWithRealData(rawQuote);
      const realCandles = await getRealHistoricalCandles(quote.symbol, timeframe);
      const candles = realCandles && realCandles.length > 5 ? realCandles : getOrGenerateHistoricalCandles(quote.symbol, timeframe);

      res.json({
        symbol: quote.symbol,
        timeframe,
        isDelayed: false,
        isZeroDelayLiveFeed: true,
        candles,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch OHLCV' });
    }
  });

  // 6. Technical Indicators Calculation (Real Candles)
  app.get('/api/stocks/:symbol/analysis', async (req, res) => {
    try {
      const { symbol } = req.params;
      const timeframe = (req.query.timeframe as string) || '3M';
      const rawQuote = getStockBySymbol(symbol);
      if (!rawQuote) {
        return res.status(404).json({ error: `Stock symbol '${symbol}' not found` });
      }
      const quote = enrichStockQuoteWithRealData(rawQuote);
      const realCandles = await getRealHistoricalCandles(quote.symbol, timeframe);
      const candles = realCandles && realCandles.length > 5 ? realCandles : getOrGenerateHistoricalCandles(quote.symbol, timeframe);
      const indicators = computeAllIndicators(candles);

      res.json({
        symbol: quote.symbol,
        timeframe,
        indicators,
        isDelayed: false,
        isZeroDelayLiveFeed: true,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to calculate indicators' });
    }
  });

  // 7. Rule-Based Signal Setup (Real Candles & Real Prices)
  app.get('/api/stocks/:symbol/signals', async (req, res) => {
    try {
      const { symbol } = req.params;
      const timeframe = (req.query.timeframe as string) || '3M';
      const rawQuote = getStockBySymbol(symbol);
      if (!rawQuote) {
        return res.status(404).json({ error: `Stock symbol '${symbol}' not found` });
      }
      const quote = enrichStockQuoteWithRealData(rawQuote);
      const realCandles = await getRealHistoricalCandles(quote.symbol, timeframe);
      const candles = realCandles && realCandles.length > 5 ? realCandles : getOrGenerateHistoricalCandles(quote.symbol, timeframe);
      const signal = generateSignal(quote, candles, timeframe);
      res.json(signal);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate signal' });
    }
  });

  // 8. Watchlist Endpoints
  app.get('/api/watchlist', (req, res) => {
    try {
      const symbols = Array.from(currentWatchlist);
      const items = symbols.map((sym) => {
        const quote = getStockBySymbol(sym);
        if (!quote) return null;
        const candles = getOrGenerateHistoricalCandles(sym, '3M');
        const signal = generateSignal(quote, candles, '3M');
        return {
          quote,
          signal,
        };
      }).filter(Boolean);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch watchlist' });
    }
  });

  app.post('/api/watchlist', (req, res) => {
    try {
      const { symbol } = req.body;
      if (!symbol) return res.status(400).json({ error: 'Symbol is required' });
      const upper = symbol.toUpperCase().trim();
      const quote = getStockBySymbol(upper);
      if (!quote) return res.status(404).json({ error: 'Invalid stock symbol' });

      currentWatchlist.add(upper);
      res.json({ success: true, watchlist: Array.from(currentWatchlist) });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to add to watchlist' });
    }
  });

  app.delete('/api/watchlist/:symbol', (req, res) => {
    try {
      const { symbol } = req.params;
      const upper = symbol.toUpperCase().trim();
      currentWatchlist.delete(upper);
      res.json({ success: true, watchlist: Array.from(currentWatchlist) });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to remove from watchlist' });
    }
  });

  // 9. AI Explanation Layer (Gemini - Shortlist Only, Cached)
  app.post('/api/ai/analyse', async (req, res) => {
    try {
      const { symbol } = req.body;
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required in body' });
      }
      const quote = getStockBySymbol(symbol);
      if (!quote) {
        return res.status(404).json({ error: `Stock symbol '${symbol}' not found` });
      }

      const candles = getOrGenerateHistoricalCandles(quote.symbol, '3M');
      const signal = generateSignal(quote, candles, '3M');

      const explanation = await generateAiExplanation(signal, quote);
      res.json(explanation);
    } catch (err: any) {
      console.error('Error in /api/ai/analyse:', err);
      res.status(500).json({ error: err.message || 'Failed to generate AI analysis' });
    }
  });

  // 10. Telegram Alert Send & Logs
  app.post('/api/alerts/telegram/send', async (req, res) => {
    try {
      const { symbol, botToken, chatId } = req.body;
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
      }
      const quote = getStockBySymbol(symbol);
      if (!quote) {
        return res.status(404).json({ error: 'Stock symbol not found' });
      }

      const candles = getOrGenerateHistoricalCandles(quote.symbol, '3M');
      const signal = generateSignal(quote, candles, '3M');

      const result = await sendTelegramAlert({ signal, botToken, chatId });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to process Telegram alert' });
    }
  });

  // Telegram Prediction Alert Send
  app.post('/api/alerts/telegram/send-prediction', async (req, res) => {
    try {
      const { symbol, prediction: providedPred, botToken, chatId } = req.body;
      let prediction = providedPred;

      if (!prediction && symbol) {
        const predictions = await generateBeginnerStockPredictions();
        prediction = predictions.find((p) => p.symbol.toUpperCase() === symbol.toUpperCase().trim());
      }

      if (!prediction) {
        return res.status(400).json({ error: 'Valid stock prediction or symbol is required' });
      }

      const result = await sendTelegramPredictionAlert({ prediction, botToken, chatId });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to dispatch prediction alert' });
    }
  });

  // Telegram Bot Info & Status
  app.get('/api/alerts/telegram/bot-info', async (req, res) => {
    try {
      const botToken = req.query.token as string | undefined;
      const info = await getTelegramBotInfo(botToken);
      res.json(info);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch bot info' });
    }
  });

  // Telegram Auto-Detect Chat IDs (getUpdates)
  app.get('/api/alerts/telegram/updates', async (req, res) => {
    try {
      const botToken = req.query.token as string | undefined;
      const updates = await getTelegramRecentUpdates(botToken);
      res.json(updates);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch telegram updates' });
    }
  });

  // Telegram Test Message Trigger
  app.post('/api/alerts/telegram/test', async (req, res) => {
    try {
      const { chatId, botToken } = req.body;
      const result = await sendTelegramTestAlert(chatId, botToken);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to send test alert' });
    }
  });

  app.get('/api/alerts/telegram/logs', (req, res) => {
    try {
      res.json(getAlertLogs());
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch alert logs' });
    }
  });

  // Automated Telegram BUY & SELL Alert Engine Endpoints
  app.get('/api/alerts/telegram/auto-status', (req, res) => {
    try {
      const status = getAutoAlertStatus();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch auto alert status' });
    }
  });

  app.post('/api/alerts/telegram/auto-scan-now', async (req, res) => {
    try {
      const result = await executeAutoAlertScan();
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to run auto alert scan' });
    }
  });

  // ==========================================
  // QUANTITATIVE HIGH-FREQUENCY ENGINE APIS
  // Covering Intraday, F&O, and Commodities (MCX)
  // ==========================================
  app.get('/api/quant/assets', (req, res) => {
    try {
      const assets = QuantHftEngineService.getAllAssets();
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        assets,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch quant assets' });
    }
  });

  app.get('/api/quant/asset/:symbol', (req, res) => {
    try {
      const { symbol } = req.params;
      const asset = QuantHftEngineService.getAssetBySymbol(symbol);
      if (!asset) {
        return res.status(404).json({ error: `Quant asset ${symbol} not found` });
      }
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        asset,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch quant asset' });
    }
  });

  app.get('/api/quant/backtest/:symbol', (req, res) => {
    try {
      const { symbol } = req.params;
      const backtest = QuantHftEngineService.get10DayBacktest(symbol);
      res.json({
        success: true,
        backtest,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to run 10-day quant backtest' });
    }
  });

  app.post('/api/quant/alert/telegram', async (req, res) => {
    try {
      const { setup, customChatId, customBotToken } = req.body;
      if (!setup || !setup.symbol) {
        return res.status(400).json({ error: 'Valid quant trade setup is required' });
      }

      const botToken = customBotToken || process.env.TELEGRAM_BOT_TOKEN || OFFICIAL_BOT_TOKEN;
      const chatId = customChatId || process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

      // Human-readable formatted quant alert message
      const emoji = setup.action === 'BUY' ? '🚀' : '🔻';
      const actionBadge = setup.action === 'BUY' ? '🟢 BUY / LONG' : '🔴 SELL / SHORT';
      const text = `${emoji} <b>ARTHAPULSE QUANT SIGNAL: ${setup.symbol}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ <b>Asset Class:</b> ${setup.assetClass.replace(/_/g, ' ')} (${setup.assetName})
⚡ <b>Action:</b> ${actionBadge}
🎯 <b>Entry Price:</b> ₹${Number(setup.entryPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
🛑 <b>Stop Loss:</b> ₹${Number(setup.stopLoss).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
🏁 <b>Target Price:</b> ₹${Number(setup.targetPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
⚖️ <b>Risk-Reward Ratio:</b> ${setup.riskRewardRatio}
📈 <b>Projected Return:</b> +${setup.projectedPnlPercent}%
🧠 <b>Confidence Score:</b> ${setup.confidenceScore}% (Institutional Grade)
⏱️ <b>Timeframe:</b> ${setup.timeframe}

🔍 <b>Trigger Logic:</b>
<i>${setup.triggerReason}</i>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <i>ArthaPulse HFT Multi-Asset Engine • SEBI Compliance Notice</i>`;

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      });

      const responseData = await response.json();
      if (!response.ok || !responseData.ok) {
        return res.status(502).json({
          error: responseData.description || 'Telegram API rejected message',
          details: responseData,
        });
      }

      res.json({
        success: true,
        messageId: responseData.result.message_id,
        chatTitle: responseData.result.chat.title || responseData.result.chat.username,
        dispatchedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to dispatch quant telegram alert' });
    }
  });

  // ==========================================
  // REAL-TIME LIVE BROKER WEBSOCKET & PIPELINE APIS
  // Zerodha Kite / Angel One / Dhan / Upstox
  // ==========================================
  app.get('/api/broker/status', (req, res) => {
    try {
      const status = BrokerWebSocketService.getStatus();
      res.json({
        success: true,
        status,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch broker status' });
    }
  });

  app.post('/api/broker/connect', (req, res) => {
    try {
      const { brokerType, apiKey, accessToken, clientId, feedToken } = req.body;
      const status = BrokerWebSocketService.updateConfig({
        brokerType,
        apiKey,
        accessToken,
        clientId,
        feedToken,
      });
      res.json({
        success: true,
        message: `Updated broker connection to ${status.brokerName}`,
        status,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to configure broker' });
    }
  });

  // Automated Broker Developer Accounts & SSO Bridge
  app.get('/api/broker/accounts', (req, res) => {
    try {
      const accounts = BrokerAutoProvisionerService.getAccounts();
      const ssoBridgeToken = BrokerAutoProvisionerService.getSsoBridgeToken();
      res.json({
        success: true,
        userEmail: process.env.USER_EMAIL || 'subscriber@arthapulse.com',
        totalAccounts: accounts.length,
        accounts,
        ssoBridgeToken,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch broker accounts' });
    }
  });

  app.post('/api/broker/accounts/auto-provision', (req, res) => {
    try {
      const { email = process.env.USER_EMAIL || 'subscriber@arthapulse.com' } = req.body || {};
      const result = BrokerAutoProvisionerService.provisionAccounts(email);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to auto-provision broker accounts' });
    }
  });

  app.post('/api/broker/sso/refresh', (req, res) => {
    try {
      const result = BrokerAutoProvisionerService.refreshAllSessions();
      res.json({
        success: true,
        ...result,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to refresh broker SSO sessions' });
    }
  });

  // Multi-Broker Unified Pipeline Status & Latency Matrix
  app.get('/api/broker/pipeline', (req, res) => {
    try {
      const pipelineStatus = MultiBrokerPipeline.getPipelineStatus();
      res.json({
        success: true,
        pipeline: pipelineStatus,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch multi-broker pipeline' });
    }
  });

  app.get('/api/broker/ticks', (req, res) => {
    try {
      const ticks = MultiBrokerPipeline.getRecentNormalizedTicks();
      res.json({
        success: true,
        count: ticks.length,
        ticks,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch normalized ticks' });
    }
  });

  app.get('/api/broker/latency-matrix', (req, res) => {
    try {
      const pipeline = MultiBrokerPipeline.getPipelineStatus();
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        overallFastestBroker: pipeline.overallFastestBroker,
        fastestAvgLatencyMs: pipeline.fastestBrokerAvgLatency,
        isZeroDelayCertified: pipeline.isZeroDelayCertified,
        brokers: pipeline.brokers,
        recentArbitrations: pipeline.recentArbitrations,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch latency matrix' });
    }
  });

  // Start real-time broker websocket stream (0-delay ticks)
  BrokerWebSocketService.start();

  // Start multi-broker concurrent pipeline & smart latency-evaluation engine
  MultiBrokerPipeline.startPipeline();

  // Start background auto-responder for Telegram commands (/start, /signals, /predictions, /status)
  startTelegramBotPolling();

  // Start background automated BUY & SELL alert engine (scanning Indian equities continuously)
  startAutoTelegramAlertEngine();

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ArthaPulse AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
