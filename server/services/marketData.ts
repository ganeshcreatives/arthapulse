import { NSE_STOCKS, MAJOR_INDICES, SECTORS_LIST, StockInfo } from '../data/indianStocks.js';
import { Candle } from './technicalAnalysis.js';

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  industry: string;
  currentPrice: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCapCr: number;
  peRatio?: number;
  pbRatio?: number;
  high52w?: number;
  low52w?: number;
  isDelayed: boolean;
  delayMinutes: number;
  timestamp: string;
}

export interface MarketOverviewData {
  indices: typeof MAJOR_INDICES;
  marketBreadth: {
    advances: number;
    declines: number;
    unchanged: number;
    advanceDeclineRatio: number;
  };
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  sectors: typeof SECTORS_LIST;
  marketStatus: 'OPEN' | 'CLOSED' | 'PRE-OPEN';
  timestamp: string;
  isDelayed: boolean;
}

// In-memory quote state with small deterministic intraday fluctuations
const liveQuotesMap: Map<string, StockQuote> = new Map();
const historicalCandlesMap: Map<string, Record<string, Candle[]>> = new Map();

/**
 * Initializes stock quotes with realistic variance
 */
function initQuotes() {
  const now = new Date();
  const timeStr = now.toISOString();

  // Pseudo random factor seeded by symbol length
  NSE_STOCKS.forEach((stock) => {
    const symbolHash = stock.symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const dayVariancePct = (((symbolHash % 41) - 19) / 10); // Between -1.9% and +2.1%
    const change = Math.round(((stock.basePrice * dayVariancePct) / 100) * 100) / 100;
    const currentPrice = Math.round((stock.basePrice + change) * 100) / 100;
    const prevClose = stock.basePrice;
    const changePercent = Math.round((change / prevClose) * 10000) / 100;

    const high = Math.round(Math.max(currentPrice, prevClose) * (1 + (symbolHash % 15) * 0.001) * 100) / 100;
    const low = Math.round(Math.min(currentPrice, prevClose) * (1 - (symbolHash % 12) * 0.001) * 100) / 100;
    const open = Math.round((prevClose * (1 + ((symbolHash % 10) - 5) * 0.001)) * 100) / 100;
    const volume = 850000 + (symbolHash * 14500) % 5200000;

    const quote: StockQuote = {
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
      sector: stock.sector,
      industry: stock.industry,
      currentPrice,
      open,
      high,
      low,
      prevClose,
      change,
      changePercent,
      volume,
      marketCapCr: stock.marketCapCr,
      peRatio: stock.peRatio,
      pbRatio: stock.pbRatio,
      high52w: stock.high52w || Math.round(currentPrice * 1.25),
      low52w: stock.low52w || Math.round(currentPrice * 0.78),
      isDelayed: true,
      delayMinutes: 15,
      timestamp: timeStr,
    };

    liveQuotesMap.set(stock.symbol, quote);
  });
}

initQuotes();

/**
 * Generates synthetic realistic historical OHLCV data
 */
export function getOrGenerateHistoricalCandles(symbol: string, timeframe = '3M'): Candle[] {
  const cacheKey = `${symbol}_${timeframe}`;
  const existingBySymbol = historicalCandlesMap.get(symbol);
  if (existingBySymbol && existingBySymbol[timeframe]) {
    return existingBySymbol[timeframe];
  }

  const quote = liveQuotesMap.get(symbol);
  const basePrice = quote ? quote.currentPrice : 1500;
  const days = timeframe === '1D' ? 24 : timeframe === '1W' ? 35 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 250;
  const isIntraday = timeframe === '1D';

  const candles: Candle[] = [];
  const symbolSeed = symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  let currentClose = basePrice * (1 - (days * 0.0015 * ((symbolSeed % 7) - 3)));

  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const candleDate = new Date(now.getTime());
    if (isIntraday) {
      candleDate.setMinutes(candleDate.getMinutes() - i * 15);
    } else {
      candleDate.setDate(candleDate.getDate() - i);
      // Skip weekends for daily candles
      if (candleDate.getDay() === 0 || candleDate.getDay() === 6) continue;
    }

    const dayCycle = Math.sin((i + symbolSeed) * 0.2) * 0.008;
    const noise = (((i * 17 + symbolSeed) % 100) - 49) * 0.00035;
    const trendDrift = 0.0005; // Slight upward bias
    const priceChangePct = dayCycle + noise + trendDrift;

    const open = Math.round(currentClose * 100) / 100;
    const close = i === 0 ? basePrice : Math.round(open * (1 + priceChangePct) * 100) / 100;
    const high = Math.round(Math.max(open, close) * (1 + Math.abs(noise * 2) + 0.004) * 100) / 100;
    const low = Math.round(Math.min(open, close) * (1 - Math.abs(noise * 2) - 0.004) * 100) / 100;
    const volume = Math.round(600000 + Math.abs(Math.sin(i)) * 1400000 + (high - low) * 50000);

    candles.push({
      timestamp: candleDate.getTime(),
      date: isIntraday ? candleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : candleDate.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
    });

    currentClose = close;
  }

  if (!historicalCandlesMap.has(symbol)) {
    historicalCandlesMap.set(symbol, {});
  }
  historicalCandlesMap.get(symbol)![timeframe] = candles;

  return candles;
}

export function getAllStocks(): StockQuote[] {
  return Array.from(liveQuotesMap.values());
}

export function getStockBySymbol(symbol: string): StockQuote | null {
  const upper = symbol.toUpperCase().trim();
  const direct = liveQuotesMap.get(upper);
  if (direct) return direct;

  // Search case-insensitive or partial match
  const found = Array.from(liveQuotesMap.values()).find(
    (s) => s.symbol.toUpperCase() === upper || s.name.toUpperCase().includes(upper)
  );
  return found || null;
}

export function searchStocks(query: string): StockQuote[] {
  if (!query || query.trim().length === 0) {
    return Array.from(liveQuotesMap.values()).slice(0, 10);
  }
  const q = query.toLowerCase().trim();
  return Array.from(liveQuotesMap.values()).filter(
    (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q)
  );
}

export function getMarketOverview(): MarketOverviewData {
  const all = Array.from(liveQuotesMap.values());
  const sortedGainers = [...all].sort((a, b) => b.changePercent - a.changePercent);
  const sortedLosers = [...all].sort((a, b) => a.changePercent - b.changePercent);

  const advances = all.filter((s) => s.change > 0).length;
  const declines = all.filter((s) => s.change < 0).length;
  const unchanged = all.filter((s) => s.change === 0).length;

  return {
    indices: MAJOR_INDICES,
    marketBreadth: {
      advances,
      declines,
      unchanged,
      advanceDeclineRatio: declines > 0 ? Math.round((advances / declines) * 100) / 100 : advances,
    },
    topGainers: sortedGainers.slice(0, 5),
    topLosers: sortedLosers.slice(0, 5),
    sectors: SECTORS_LIST,
    marketStatus: 'OPEN',
    timestamp: new Date().toISOString(),
    isDelayed: true,
  };
}
