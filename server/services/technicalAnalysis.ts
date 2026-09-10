export interface Candle {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  ema20: number;
  sma50: number;
  vwap: number;
  atr: number;
  support: number;
  resistance: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  momentum: 'STRONG' | 'MODERATE' | 'WEAK' | 'NEGATIVE';
  currentPrice: number;
  priceVsEma20Pct: number;
  priceVsSma50Pct: number;
}

/**
 * Calculates Simple Moving Average (SMA)
 */
export function calculateSMA(data: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

/**
 * Calculates Exponential Moving Average (EMA)
 */
export function calculateEMA(data: number[], period: number): number[] {
  const ema: number[] = [];
  const k = 2 / (period + 1);

  let initialSMA = 0;
  for (let i = 0; i < period; i++) {
    initialSMA += data[i] || 0;
  }
  initialSMA /= period;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      ema.push(NaN);
    } else if (i === period - 1) {
      ema.push(initialSMA);
    } else {
      const prevEma = ema[i - 1];
      const currentVal = data[i];
      const val = currentVal * k + prevEma * (1 - k);
      ema.push(val);
    }
  }
  return ema;
}

/**
 * Calculates Relative Strength Index (RSI - 14) with Wilder's smoothing
 */
export function calculateRSI(closes: number[], period = 14): number[] {
  const rsi: number[] = [];
  if (closes.length <= period) {
    return closes.map(() => 50);
  }

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  let avgGain = gains.slice(0, period).reduce((acc, v) => acc + v, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((acc, v) => acc + v, 0) / period;

  // First RSI value at index `period`
  for (let i = 0; i < period; i++) {
    rsi.push(NaN);
  }

  const rsFirst = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const firstRSI = 100 - 100 / (1 + rsFirst);
  rsi.push(firstRSI);

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const currentRSI = 100 - 100 / (1 + rs);
    rsi.push(currentRSI);
  }

  return rsi;
}

/**
 * Calculates MACD (12, 26, 9)
 */
export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): { macdLine: number[]; signalLine: number[]; histogram: number[] } {
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);

  const macdLine: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (isNaN(fastEMA[i]) || isNaN(slowEMA[i])) {
      macdLine.push(NaN);
    } else {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }
  }

  // Filter valid numbers to calculate EMA of MACD
  const validMacdIndices = macdLine.map((val, idx) => (!isNaN(val) ? idx : -1)).filter((idx) => idx !== -1);
  const validMacdValues = validMacdIndices.map((idx) => macdLine[idx]);

  const rawSignalLine = calculateEMA(validMacdValues, signalPeriod);
  const signalLine: number[] = new Array(closes.length).fill(NaN);
  const histogram: number[] = new Array(closes.length).fill(NaN);

  for (let j = 0; j < validMacdIndices.length; j++) {
    const originalIndex = validMacdIndices[j];
    const sigVal = rawSignalLine[j];
    signalLine[originalIndex] = sigVal;
    if (!isNaN(sigVal) && !isNaN(macdLine[originalIndex])) {
      histogram[originalIndex] = macdLine[originalIndex] - sigVal;
    }
  }

  return { macdLine, signalLine, histogram };
}

/**
 * Calculates Average True Range (ATR 14)
 */
export function calculateATR(candles: Candle[], period = 14): number[] {
  const atr: number[] = [];
  if (candles.length < 2) return candles.map(() => 0);

  const tr: number[] = [candles[0].high - candles[0].low];
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;

    const trVal = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    tr.push(trVal);
  }

  let avgTR = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = 0; i < period - 1; i++) {
    atr.push(NaN);
  }
  atr.push(avgTR);

  for (let i = period; i < tr.length; i++) {
    avgTR = (avgTR * (period - 1) + tr[i]) / period;
    atr.push(avgTR);
  }

  return atr;
}

/**
 * Calculates VWAP (Volume Weighted Average Price)
 */
export function calculateVWAP(candles: Candle[]): number[] {
  const vwap: number[] = [];
  let cumulativeTypicalPriceVolume = 0;
  let cumulativeVolume = 0;

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    const volume = Math.max(candle.volume, 1);

    cumulativeTypicalPriceVolume += typicalPrice * volume;
    cumulativeVolume += volume;

    vwap.push(cumulativeTypicalPriceVolume / cumulativeVolume);
  }

  return vwap;
}

/**
 * Compute key Support & Resistance levels from recent swing pivots
 */
export function calculateSupportResistance(candles: Candle[]): { support: number; resistance: number } {
  if (candles.length === 0) return { support: 0, resistance: 0 };
  const recent = candles.slice(-40);
  const currentPrice = candles[candles.length - 1].close;

  const swingLows: number[] = [];
  const swingHighs: number[] = [];

  for (let i = 2; i < recent.length - 2; i++) {
    const low = recent[i].low;
    const high = recent[i].high;

    if (
      low <= recent[i - 1].low &&
      low <= recent[i - 2].low &&
      low <= recent[i + 1].low &&
      low <= recent[i + 2].low
    ) {
      swingLows.push(low);
    }

    if (
      high >= recent[i - 1].high &&
      high >= recent[i - 2].high &&
      high >= recent[i + 1].high &&
      high >= recent[i + 2].high
    ) {
      swingHighs.push(high);
    }
  }

  // Find closest support below current price
  const supportsBelow = swingLows.filter((l) => l < currentPrice).sort((a, b) => b - a);
  const resistancesAbove = swingHighs.filter((h) => h > currentPrice).sort((a, b) => a - b);

  const support = supportsBelow.length > 0 ? supportsBelow[0] : Math.min(...recent.map((c) => c.low));
  const resistance = resistancesAbove.length > 0 ? resistancesAbove[0] : Math.max(...recent.map((c) => c.high));

  return {
    support: Math.round(support * 100) / 100,
    resistance: Math.round(resistance * 100) / 100,
  };
}

/**
 * Computes all technical indicators for the latest candle
 */
export function computeAllIndicators(candles: Candle[]): TechnicalIndicators {
  const closes = candles.map((c) => c.close);
  const currentPrice = closes[closes.length - 1];

  const rsiSeries = calculateRSI(closes, 14);
  const macdSeries = calculateMACD(closes, 12, 26, 9);
  const ema20Series = calculateEMA(closes, 20);
  const sma50Series = calculateSMA(closes, 50);
  const vwapSeries = calculateVWAP(candles);
  const atrSeries = calculateATR(candles, 14);
  const sr = calculateSupportResistance(candles);

  const lastRSI = rsiSeries[rsiSeries.length - 1] || 50;
  const lastMacdLine = macdSeries.macdLine[macdSeries.macdLine.length - 1] || 0;
  const lastSignalLine = macdSeries.signalLine[macdSeries.signalLine.length - 1] || 0;
  const lastHistogram = macdSeries.histogram[macdSeries.histogram.length - 1] || 0;

  const lastEma20 = ema20Series[ema20Series.length - 1] || currentPrice;
  const lastSma50 = sma50Series[sma50Series.length - 1] || currentPrice;
  const lastVwap = vwapSeries[vwapSeries.length - 1] || currentPrice;
  const lastAtr = atrSeries[atrSeries.length - 1] || currentPrice * 0.015;

  const priceVsEma20Pct = ((currentPrice - lastEma20) / lastEma20) * 100;
  const priceVsSma50Pct = ((currentPrice - lastSma50) / lastSma50) * 100;

  // Trend determination:
  // Bullish if price > EMA20 and EMA20 > SMA50 (or price > SMA50 by comfortable margin)
  let trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
  if (currentPrice > lastEma20 && lastEma20 >= lastSma50 && lastRSI > 50) {
    trend = 'BULLISH';
  } else if (currentPrice < lastEma20 && lastEma20 <= lastSma50 && lastRSI < 50) {
    trend = 'BEARISH';
  }

  // Momentum determination:
  let momentum: 'STRONG' | 'MODERATE' | 'WEAK' | 'NEGATIVE' = 'MODERATE';
  if (lastRSI >= 60 && lastHistogram > 0) {
    momentum = 'STRONG';
  } else if (lastRSI <= 40 || lastHistogram < 0) {
    momentum = lastRSI < 35 && lastHistogram < 0 ? 'NEGATIVE' : 'WEAK';
  }

  return {
    rsi: Math.round(lastRSI * 100) / 100,
    macd: {
      macdLine: Math.round(lastMacdLine * 100) / 100,
      signalLine: Math.round(lastSignalLine * 100) / 100,
      histogram: Math.round(lastHistogram * 100) / 100,
    },
    ema20: Math.round(lastEma20 * 100) / 100,
    sma50: Math.round(lastSma50 * 100) / 100,
    vwap: Math.round(lastVwap * 100) / 100,
    atr: Math.round(lastAtr * 100) / 100,
    support: sr.support,
    resistance: sr.resistance,
    trend,
    momentum,
    currentPrice,
    priceVsEma20Pct: Math.round(priceVsEma20Pct * 100) / 100,
    priceVsSma50Pct: Math.round(priceVsSma50Pct * 100) / 100,
  };
}
