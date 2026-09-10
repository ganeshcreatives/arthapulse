import { Candle, TechnicalIndicators, computeAllIndicators } from './technicalAnalysis.js';
import { StockQuote } from './marketData.js';

export type SignalType = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface TradeSignal {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  timestamp: string;
  currentPrice: number;
  technicalScore: number; // 0 to 100
  signalType: SignalType;
  timeframe: string;
  entryLow: number;
  entryHigh: number;
  target: number;
  targetPercent: number;
  target2?: number;
  target2Percent?: number;
  stopLoss: number;
  stopLossPercent: number;
  riskReward: string; // e.g. "1:2.3"
  riskRewardRatio: number;
  confidence: number; // e.g. 84%
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
  invalidation: string[];
  indicators: TechnicalIndicators;
  indicatorHash: string;
  isDelayed: boolean;
}

/**
 * Calculates deterministic Layer 1 Technical Score (0 - 100)
 * Weights:
 * - Trend Structure (EMA20 vs SMA50 & Price alignment): 30%
 * - RSI Health & Momentum: 25%
 * - MACD Histogram & Signal crossover: 20%
 * - Volume / VWAP position: 15%
 * - Volatility / ATR positioning: 10%
 */
export function calculateTechnicalScore(indicators: TechnicalIndicators): number {
  let score = 50; // Neutral baseline

  // 1. Trend Structure (Up to +/- 20)
  if (indicators.currentPrice > indicators.ema20 && indicators.ema20 > indicators.sma50) {
    score += 18; // Strong bull trend
  } else if (indicators.currentPrice > indicators.ema20 && indicators.currentPrice > indicators.sma50) {
    score += 10;
  } else if (indicators.currentPrice < indicators.ema20 && indicators.ema20 < indicators.sma50) {
    score -= 18; // Strong bear trend
  } else if (indicators.currentPrice < indicators.ema20) {
    score -= 10;
  }

  // 2. RSI Health (Up to +/- 15)
  if (indicators.rsi >= 52 && indicators.rsi <= 68) {
    score += 15; // Sweet spot for bullish swing momentum
  } else if (indicators.rsi > 68 && indicators.rsi <= 75) {
    score += 8; // Strong but approaching overbought
  } else if (indicators.rsi > 75) {
    score -= 5; // Overbought risk
  } else if (indicators.rsi >= 35 && indicators.rsi < 48) {
    score -= 10; // Weak momentum
  } else if (indicators.rsi < 35) {
    score -= 15; // Oversold / downtrending
  }

  // 3. MACD Histogram & Signal (Up to +/- 12)
  if (indicators.macd.histogram > 0 && indicators.macd.macdLine > indicators.macd.signalLine) {
    score += 12;
  } else if (indicators.macd.histogram > 0) {
    score += 5;
  } else if (indicators.macd.histogram < 0 && indicators.macd.macdLine < indicators.macd.signalLine) {
    score -= 12;
  } else {
    score -= 5;
  }

  // 4. VWAP Position (Up to +/- 8)
  if (indicators.currentPrice >= indicators.vwap) {
    score += 8;
  } else {
    score -= 8;
  }

  // Bound score between 5 and 95
  return Math.min(95, Math.max(5, Math.round(score)));
}

/**
 * Layer 2 Rule Engine: generates trade setup, target, stop loss, reasons, and invalidations
 */
export function generateSignal(quote: StockQuote, candles: Candle[], timeframe = '3M'): TradeSignal {
  const indicators = computeAllIndicators(candles);
  const technicalScore = calculateTechnicalScore(indicators);
  const currentPrice = quote.currentPrice;
  const atr = indicators.atr || currentPrice * 0.015;

  let signalType: SignalType = 'NEUTRAL';
  let confidence = 50;
  const reasons: string[] = [];
  const invalidation: string[] = [];

  // Rules for Bullish Swing Setup
  if (technicalScore >= 65) {
    signalType = 'BULLISH';
    confidence = Math.min(92, Math.round(technicalScore * 0.95 + 10));

    // Reasons
    if (indicators.currentPrice > indicators.ema20 && indicators.ema20 > indicators.sma50) {
      reasons.push(`Price holding above 20 EMA (₹${indicators.ema20}) and 50 SMA (₹${indicators.sma50})`);
    } else if (indicators.currentPrice > indicators.ema20) {
      reasons.push(`Price holding above key 20 EMA support at ₹${indicators.ema20}`);
    }

    if (indicators.rsi >= 50 && indicators.rsi <= 68) {
      reasons.push(`RSI at ${indicators.rsi.toFixed(1)} showing sustained upward momentum without overbought fatigue`);
    }

    if (indicators.macd.histogram > 0) {
      reasons.push(`Positive MACD histogram (+${indicators.macd.histogram.toFixed(2)}) confirming buyer control`);
    }

    if (indicators.currentPrice >= indicators.vwap) {
      reasons.push(`Trading above VWAP (₹${indicators.vwap}), indicating institutional volume support`);
    }

    if (reasons.length < 2) {
      reasons.push(`Consolidation near support with favorable swing risk-to-reward`);
    }

    // Invalidation conditions
    invalidation.push(`Daily closing breakdown below 20 EMA (₹${indicators.ema20})`);
    invalidation.push(`RSI falling below 48 or negative MACD crossover`);
    if (indicators.support > 0) {
      invalidation.push(`Loss of structural swing support at ₹${indicators.support}`);
    }

  } else if (technicalScore <= 40) {
    signalType = 'BEARISH';
    confidence = Math.min(90, Math.round((100 - technicalScore) * 0.9 + 10));

    // Reasons
    if (indicators.currentPrice < indicators.ema20) {
      reasons.push(`Price trading below 20 EMA (₹${indicators.ema20}), indicating seller dominance`);
    }
    if (indicators.rsi < 45) {
      reasons.push(`RSI weak at ${indicators.rsi.toFixed(1)}, showing persistent downward pressure`);
    }
    if (indicators.macd.histogram < 0) {
      reasons.push(`Negative MACD histogram (${indicators.macd.histogram.toFixed(2)}) signaling bearish momentum`);
    }
    if (indicators.currentPrice < indicators.vwap) {
      reasons.push(`Trading below VWAP (₹${indicators.vwap}), reflecting distribution`);
    }

    // Invalidation conditions
    invalidation.push(`Daily close above 20 EMA (₹${indicators.ema20})`);
    invalidation.push(`RSI breakout above 52 with positive MACD divergence`);
    if (indicators.resistance > 0) {
      invalidation.push(`Breakout above key overhead resistance at ₹${indicators.resistance}`);
    }

  } else {
    // Neutral
    signalType = 'NEUTRAL';
    confidence = 50;
    reasons.push(`Mixed technical signals: RSI at ${indicators.rsi.toFixed(1)} and price hovering near 20 EMA`);
    reasons.push(`Awaiting clear breakout above resistance ₹${indicators.resistance} or breakdown below ₹${indicators.support}`);
    invalidation.push(`Sustained move out of range [₹${indicators.support} - ₹${indicators.resistance}] on high volume`);
  }

  // Calculate Entry, Target, Stop Loss with math derived from ATR and Support/Resistance
  let entryLow = currentPrice;
  let entryHigh = currentPrice;
  let target = currentPrice;
  let stopLoss = currentPrice;

  if (signalType === 'BULLISH') {
    // Entry low is slightly below or at current price (pullback to EMA or -0.5 ATR)
    entryLow = Math.round(Math.max(indicators.ema20, currentPrice - atr * 0.4) * 100) / 100;
    entryHigh = Math.round((currentPrice + atr * 0.2) * 100) / 100;

    // Target is minimum of 1.8x ATR or next resistance
    const atrTarget = currentPrice + atr * 2.2;
    target = Math.round(Math.max(atrTarget, indicators.resistance > currentPrice ? indicators.resistance : atrTarget) * 100) / 100;

    // Stop loss below support or 1.2x ATR
    const atrStop = currentPrice - atr * 1.3;
    stopLoss = Math.round(Math.min(atrStop, indicators.support < currentPrice && indicators.support > 0 ? indicators.support * 0.995 : atrStop) * 100) / 100;
  } else if (signalType === 'BEARISH') {
    entryLow = Math.round((currentPrice - atr * 0.2) * 100) / 100;
    entryHigh = Math.round(Math.min(indicators.ema20, currentPrice + atr * 0.4) * 100) / 100;

    const atrTarget = currentPrice - atr * 2.2;
    target = Math.round(Math.min(atrTarget, indicators.support < currentPrice ? indicators.support : atrTarget) * 100) / 100;

    const atrStop = currentPrice + atr * 1.3;
    stopLoss = Math.round(Math.max(atrStop, indicators.resistance > currentPrice ? indicators.resistance * 1.005 : atrStop) * 100) / 100;
  } else {
    // Neutral range trade
    entryLow = indicators.support || Math.round((currentPrice - atr) * 100) / 100;
    entryHigh = currentPrice;
    target = indicators.resistance || Math.round((currentPrice + atr) * 100) / 100;
    stopLoss = Math.round((entryLow - atr * 0.8) * 100) / 100;
  }

  const targetDiff = Math.abs(target - currentPrice);
  const stopDiff = Math.max(0.1, Math.abs(currentPrice - stopLoss));
  const rrRatio = Math.round((targetDiff / stopDiff) * 10) / 10;
  const riskReward = `1:${rrRatio.toFixed(1)}`;

  const targetPercent = Math.round(((target - currentPrice) / currentPrice) * 10000) / 100;
  const stopLossPercent = Math.round(((stopLoss - currentPrice) / currentPrice) * 10000) / 100;

  // Extended Target 2 (e.g. runner target based on 1.9x target expansion)
  const target2 = signalType === 'BEARISH'
    ? Math.round((currentPrice - targetDiff * 1.9) * 100) / 100
    : Math.round((currentPrice + targetDiff * 1.9) * 100) / 100;
  const target2Percent = Math.round(((target2 - currentPrice) / currentPrice) * 10000) / 100;

  const confidenceLevel = confidence >= 75 ? 'HIGH' : confidence >= 60 ? 'MEDIUM' : 'LOW';

  // Indicator hash for caching AI explanations
  const indicatorHash = `${quote.symbol}_${Math.round(currentPrice)}_${Math.round(indicators.rsi)}_${indicators.trend}_${Math.round(indicators.ema20)}`;

  return {
    symbol: quote.symbol,
    name: quote.name,
    exchange: quote.exchange,
    timestamp: new Date().toISOString(),
    currentPrice,
    technicalScore,
    signalType,
    timeframe,
    entryLow,
    entryHigh,
    target,
    targetPercent,
    target2,
    target2Percent,
    stopLoss,
    stopLossPercent,
    riskReward,
    riskRewardRatio: rrRatio,
    confidence,
    confidenceLevel,
    reasons,
    invalidation,
    indicators,
    indicatorHash,
    isDelayed: true,
  };
}
