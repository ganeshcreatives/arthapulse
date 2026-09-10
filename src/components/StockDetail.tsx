import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Send,
  Bookmark,
  Activity,
  Layers,
  ShieldAlert,
  Clock,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Target,
  Sliders,
  Check
} from 'lucide-react';
import {
  StockQuote,
  Candle,
  TechnicalIndicators,
  TradeSignal,
  AiExplanation
} from '../types.js';

interface StockDetailProps {
  symbol: string;
  onBack: () => void;
  onOpenTelegramModal: (signal: TradeSignal) => void;
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const StockDetail: React.FC<StockDetailProps> = ({
  symbol,
  onBack,
  onOpenTelegramModal,
  watchlistSymbols,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('3M');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');

  // Chart Overlays
  const [showEma, setShowEma] = useState(true);
  const [showSma, setShowSma] = useState(true);
  const [showVwap, setShowVwap] = useState(true);
  const [showSR, setShowSR] = useState(true);

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [signal, setSignal] = useState<TradeSignal | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AiExplanation | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  const inWatchlist = watchlistSymbols.includes(symbol);

  // Load quote, candles, indicators, signal
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setAiExplanation(null);
      try {
        const [qRes, cRes, sRes] = await Promise.all([
          fetch(`/api/stocks/${symbol}`),
          fetch(`/api/stocks/${symbol}/ohlcv?timeframe=${timeframe}`),
          fetch(`/api/stocks/${symbol}/signals?timeframe=${timeframe}`),
        ]);

        if (qRes.ok && cRes.ok && sRes.ok && isMounted) {
          const qData = await qRes.json();
          const cData = await cRes.json();
          const sData = await sRes.json();

          setQuote(qData);
          setCandles(cData.candles || []);
          setSignal(sData);
          setIndicators(sData.indicators);
        }
      } catch (err) {
        console.error('Failed to load stock detail data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [symbol, timeframe]);

  // Request AI Explanation from Gemini
  const handleGenerateAiThesis = async () => {
    if (!signal) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data);
      }
    } catch (err) {
      console.error('Error generating AI thesis:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading || !quote || !signal || !indicators) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">Computing Technical Framework...</h3>
        <p className="text-xs text-slate-400 mt-1">
          Processing {symbol} OHLCV candles, indicators, and deterministic scoring rules.
        </p>
      </div>
    );
  }

  const isBull = signal.signalType === 'BULLISH';
  const isBear = signal.signalType === 'BEARISH';
  const isPosChange = quote.change >= 0;

  // Chart Rendering Math (SVG)
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const pricePadding = (maxPrice - minPrice) * 0.08 || 5;
  const chartMin = Math.max(0, minPrice - pricePadding);
  const chartMax = maxPrice + pricePadding;
  const priceRange = chartMax - chartMin || 1;

  const chartWidth = 700;
  const chartHeight = 260;

  const getY = (price: number) => {
    return chartHeight - ((price - chartMin) / priceRange) * chartHeight;
  };

  const numCandles = candles.length;
  const candleSpacing = chartWidth / Math.max(1, numCandles);
  const candleWidth = Math.max(2, Math.min(10, candleSpacing * 0.7));

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleWatchlist(quote.symbol)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              inWatchlist
                ? 'bg-sky-950 border-sky-700 text-sky-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={inWatchlist ? 'currentColor' : 'none'} />
            <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>

          <button
            onClick={() => onOpenTelegramModal(signal)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Telegram Alert</span>
          </button>
        </div>
      </div>

      {/* Stock Quote Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                {quote.symbol}
              </h1>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                {quote.exchange}
              </span>
              <span className="text-xs bg-amber-950/60 text-amber-400 px-2 py-0.5 rounded border border-amber-800/50 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Delayed 15m
              </span>
            </div>
            <div className="text-sm text-slate-400 mt-0.5 font-medium">
              {quote.name} • <span className="text-slate-500">{quote.sector} ({quote.industry})</span>
            </div>
          </div>

          {/* Price Header */}
          <div className="text-left md:text-right">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              ₹{quote.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div
              className={`flex items-center md:justify-end gap-1.5 text-sm font-mono font-semibold ${
                isPosChange ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPosChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isPosChange ? '+' : ''}
                {quote.change.toFixed(2)} ({isPosChange ? '+' : ''}
                {quote.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Fundamental & Trading Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 text-xs font-mono">
          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">Day Range</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              ₹{quote.low.toLocaleString('en-IN')} - ₹{quote.high.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">52W Range</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              ₹{quote.low52w?.toLocaleString('en-IN')} - ₹{quote.high52w?.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">Market Cap</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              ₹{(quote.marketCapCr / 1000).toFixed(1)}k Cr
            </div>
          </div>

          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">Volume</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              {(quote.volume / 100000).toFixed(2)} Lakh
            </div>
          </div>

          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">P/E & P/B</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              {quote.peRatio || 'N/A'}x / {quote.pbRatio || 'N/A'}x
            </div>
          </div>

          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">VWAP</div>
            <div className="font-semibold text-sky-400 mt-0.5">
              ₹{indicators.vwap.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid: Chart & Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Price Chart & Sub-charts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            {/* Chart Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              {/* Timeframes */}
              <div className="flex items-center bg-slate-800/80 rounded-lg p-1 text-xs">
                {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                      timeframe === tf ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Display & Overlay Toggles */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 font-mono">
                  <button
                    onClick={() => setChartType('candles')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      chartType === 'candles' ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    Candles
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      chartType === 'line' ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    Line
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowEma(!showEma)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                      showEma ? 'bg-cyan-950 border-cyan-800 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    20 EMA
                  </button>
                  <button
                    onClick={() => setShowSma(!showSma)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                      showSma ? 'bg-amber-950 border-amber-800 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    50 SMA
                  </button>
                  <button
                    onClick={() => setShowVwap(!showVwap)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                      showVwap ? 'bg-purple-950 border-purple-800 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    VWAP
                  </button>
                  <button
                    onClick={() => setShowSR(!showSR)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                      showSR ? 'bg-emerald-950 border-emerald-800 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    S/R
                  </button>
                </div>
              </div>
            </div>

            {/* Candle Hover Stats */}
            <div className="h-6 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2">
              {hoveredCandle ? (
                <div>
                  <span className="text-slate-300 font-bold">{hoveredCandle.date}:</span>{' '}
                  <span>O: ₹{hoveredCandle.open}</span>{' '}
                  <span>H: ₹{hoveredCandle.high}</span>{' '}
                  <span>L: ₹{hoveredCandle.low}</span>{' '}
                  <span className={hoveredCandle.close >= hoveredCandle.open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    C: ₹{hoveredCandle.close}
                  </span>{' '}
                  <span>Vol: {(hoveredCandle.volume / 1000).toFixed(0)}k</span>
                </div>
              ) : (
                <div className="text-slate-500 italic">Hover over candles to view precise OHLCV values</div>
              )}
            </div>

            {/* Price Chart SVG */}
            <div className="relative w-full h-[260px] select-none my-2 overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Background Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                  const y = chartHeight * ratio;
                  const priceVal = chartMax - ratio * priceRange;
                  return (
                    <g key={ratio}>
                      <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                      <text x={chartWidth - 5} y={y - 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                        ₹{Math.round(priceVal)}
                      </text>
                    </g>
                  );
                })}

                {/* Support & Resistance Overlays */}
                {showSR && indicators.support > 0 && (
                  <g>
                    <line
                      x1="0"
                      y1={getY(indicators.support)}
                      x2={chartWidth}
                      y2={getY(indicators.support)}
                      stroke="#10b981"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />
                    <text x="10" y={getY(indicators.support) - 4} fill="#10b981" fontSize="9" fontFamily="monospace">
                      Support: ₹{indicators.support}
                    </text>
                  </g>
                )}
                {showSR && indicators.resistance > 0 && (
                  <g>
                    <line
                      x1="0"
                      y1={getY(indicators.resistance)}
                      x2={chartWidth}
                      y2={getY(indicators.resistance)}
                      stroke="#f43f5e"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />
                    <text x="10" y={getY(indicators.resistance) - 4} fill="#f43f5e" fontSize="9" fontFamily="monospace">
                      Resistance: ₹{indicators.resistance}
                    </text>
                  </g>
                )}

                {/* VWAP Horizontal Overlay */}
                {showVwap && (
                  <line
                    x1="0"
                    y1={getY(indicators.vwap)}
                    x2={chartWidth}
                    y2={getY(indicators.vwap)}
                    stroke="#a855f7"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* EMA 20 Overlay */}
                {showEma && (
                  <line
                    x1="0"
                    y1={getY(indicators.ema20)}
                    x2={chartWidth}
                    y2={getY(indicators.ema20)}
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                  />
                )}

                {/* SMA 50 Overlay */}
                {showSma && (
                  <line
                    x1="0"
                    y1={getY(indicators.sma50)}
                    x2={chartWidth}
                    y2={getY(indicators.sma50)}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                )}

                {/* Candles or Line rendering */}
                {chartType === 'line' ? (
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    points={candles
                      .map((c, i) => `${i * candleSpacing + candleSpacing / 2},${getY(c.close)}`)
                      .join(' ')}
                  />
                ) : (
                  candles.map((candle, i) => {
                    const x = i * candleSpacing + candleSpacing / 2;
                    const openY = getY(candle.open);
                    const closeY = getY(candle.close);
                    const highY = getY(candle.high);
                    const lowY = getY(candle.low);
                    const isGreen = candle.close >= candle.open;
                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(2, Math.abs(closeY - openY));

                    return (
                      <g
                        key={candle.timestamp}
                        onMouseEnter={() => setHoveredCandle(candle)}
                        className="cursor-crosshair"
                      >
                        {/* High-Low Wick */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={isGreen ? '#10b981' : '#f43f5e'}
                          strokeWidth="1.2"
                        />
                        {/* Real Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={bodyTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={isGreen ? '#10b981' : '#f43f5e'}
                          rx="0.5"
                        />
                      </g>
                    );
                  })
                )}
              </svg>
            </div>

            {/* Sub-Chart 1: RSI (14) */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400 font-sans font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  RSI (14 Wilder&apos;s)
                </span>
                <span
                  className={`font-bold ${
                    indicators.rsi >= 70
                      ? 'text-rose-400'
                      : indicators.rsi <= 30
                      ? 'text-emerald-400'
                      : 'text-sky-400'
                  }`}
                >
                  {indicators.rsi.toFixed(2)}{' '}
                  <span className="text-[10px] text-slate-500 font-sans">
                    {indicators.rsi >= 70 ? '(Overbought)' : indicators.rsi <= 30 ? '(Oversold)' : '(Healthy Momentum)'}
                  </span>
                </span>
              </div>
              <div className="relative w-full h-12 bg-slate-950/60 rounded border border-slate-800/80 overflow-hidden">
                <div className="absolute top-[30%] left-0 right-0 border-b border-rose-500/30 border-dashed" />
                <div className="absolute top-[70%] left-0 right-0 border-b border-emerald-500/30 border-dashed" />
                <div
                  className="h-full bg-gradient-to-r from-sky-500/20 to-sky-500/40 border-r-2 border-sky-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, indicators.rsi))}%` }}
                />
                <div className="absolute top-1 left-2 text-[9px] text-rose-400 font-mono">70 Overbought</div>
                <div className="absolute bottom-1 left-2 text-[9px] text-emerald-400 font-mono">30 Oversold</div>
              </div>
            </div>

            {/* Sub-Chart 2: MACD (12, 26, 9) */}
            <div className="pt-3 mt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400 font-sans font-medium">MACD (12, 26, 9)</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>Line: <strong className="text-sky-400">{indicators.macd.macdLine}</strong></span>
                  <span>Signal: <strong className="text-amber-400">{indicators.macd.signalLine}</strong></span>
                  <span>
                    Hist:{' '}
                    <strong className={indicators.macd.histogram >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {indicators.macd.histogram > 0 ? '+' : ''}{indicators.macd.histogram}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Indicator Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Deterministic Technical Indicator Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-2">Indicator</th>
                    <th className="pb-2">Calculated Value</th>
                    <th className="pb-2">Interpretation</th>
                    <th className="pb-2 text-right">Direction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-2 font-semibold text-slate-200">20 EMA</td>
                    <td className="py-2 text-sky-400">₹{indicators.ema20}</td>
                    <td className="py-2 text-slate-400 font-sans">
                      {quote.currentPrice > indicators.ema20
                        ? `Price is ${(indicators.priceVsEma20Pct).toFixed(1)}% above short-term trend`
                        : `Price is ${(indicators.priceVsEma20Pct).toFixed(1)}% below short-term trend`}
                    </td>
                    <td className="py-2 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        quote.currentPrice > indicators.ema20 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {quote.currentPrice > indicators.ema20 ? 'BULLISH' : 'BEARISH'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold text-slate-200">50 SMA</td>
                    <td className="py-2 text-amber-400">₹{indicators.sma50}</td>
                    <td className="py-2 text-slate-400 font-sans">
                      {quote.currentPrice > indicators.sma50 ? 'Intermediate institutional baseline intact' : 'Under intermediate baseline'}
                    </td>
                    <td className="py-2 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        quote.currentPrice > indicators.sma50 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {quote.currentPrice > indicators.sma50 ? 'BULLISH' : 'BEARISH'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold text-slate-200">RSI (14)</td>
                    <td className="py-2 text-purple-400">{indicators.rsi}</td>
                    <td className="py-2 text-slate-400 font-sans">
                      {indicators.rsi >= 50 ? 'Positive buying momentum' : 'Sub-50 distribution momentum'}
                    </td>
                    <td className="py-2 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        indicators.rsi >= 50 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {indicators.rsi >= 50 ? 'POSITIVE' : 'NEGATIVE'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold text-slate-200">VWAP</td>
                    <td className="py-2 text-indigo-400">₹{indicators.vwap}</td>
                    <td className="py-2 text-slate-400 font-sans">
                      {quote.currentPrice >= indicators.vwap ? 'Price holding above volume weighted benchmark' : 'Price trading under VWAP'}
                    </td>
                    <td className="py-2 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        quote.currentPrice >= indicators.vwap ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {quote.currentPrice >= indicators.vwap ? 'BUY BIAS' : 'SELL BIAS'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold text-slate-200">ATR (14 Volatility)</td>
                    <td className="py-2 text-slate-300">₹{indicators.atr}</td>
                    <td className="py-2 text-slate-400 font-sans">
                      Expected swing noise: ~{((indicators.atr / quote.currentPrice) * 100).toFixed(2)}% per session
                    </td>
                    <td className="py-2 text-right text-slate-400 font-mono text-[10px]">
                      VOLATILITY
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold text-slate-200">Support / Resistance</td>
                    <td className="py-2 text-slate-300">S: ₹{indicators.support} | R: ₹{indicators.resistance}</td>
                    <td className="py-2 text-slate-400 font-sans">
                      Structural pivot points calculated from 40-period swing extremes
                    </td>
                    <td className="py-2 text-right text-sky-400 font-mono text-[10px]">
                      KEY LEVELS
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Rule-Based Signal Setup & AI Thesis Card */}
        <div className="space-y-6">
          {/* Layer 2: Deterministic Trade Setup Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded">
                  Layer 2 Deterministic Signal
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Rule-Engine Setup
                </h3>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                    isBull
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : isBear
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isBull ? <ArrowUpRight className="w-3.5 h-3.5" /> : isBear ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
                  <span>{signal.signalType}</span>
                </span>
              </div>
            </div>

            {/* Score & Confidence */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-3.5 mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Technical Score:</span>
                <span className="font-mono font-bold text-white">
                  <strong className="text-sky-400 text-base">{signal.technicalScore}</strong> / 100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isBull ? 'bg-emerald-500' : isBear ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${signal.technicalScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span>Confidence: <strong className="text-slate-200">{signal.confidence}%</strong> ({signal.confidenceLevel})</span>
                <span>Risk:Reward: <strong className="text-emerald-400">{signal.riskReward}</strong></span>
              </div>
            </div>

            {/* Execution Targets */}
            <div className="space-y-2 mb-4 font-mono text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-800">
                <span className="text-slate-400 font-sans">Entry Range:</span>
                <span className="font-semibold text-slate-100">
                  ₹{signal.entryLow} – ₹{signal.entryHigh}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-emerald-950/30 rounded border border-emerald-900/40">
                <span className="text-emerald-400 font-sans font-medium flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  Target:
                </span>
                <span className="font-bold text-emerald-300">
                  ₹{signal.target}{' '}
                  <span className="text-[10px]">({signal.targetPercent > 0 ? '+' : ''}{signal.targetPercent}%)</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-rose-950/30 rounded border border-rose-900/40">
                <span className="text-rose-400 font-sans font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Stop Loss:
                </span>
                <span className="font-bold text-rose-300">
                  ₹{signal.stopLoss} <span className="text-[10px]">({signal.stopLossPercent}%)</span>
                </span>
              </div>
            </div>

            {/* Rule-Engine Triggers */}
            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <h4 className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Deterministic Triggers:</span>
                </h4>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  {signal.reasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Invalidation Criteria:</span>
                </h4>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  {signal.invalidation.map((inv, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Layer 3: Gemini AI Explanation Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="text-base font-bold text-white">Gemini AI Thesis</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                Layer 3 (Explanation)
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Natural language explanation generated strictly on top of deterministic technical data. AI does not invent signals.
            </p>

            {aiExplanation ? (
              <div className="space-y-3.5 text-xs text-slate-300">
                {/* Executive Thesis */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[11px] font-bold text-sky-400 mb-1 uppercase tracking-wider">
                    Executive Thesis:
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans">
                    {aiExplanation.executiveThesis}
                  </p>
                </div>

                {/* Technical Confluence */}
                <div>
                  <div className="font-semibold text-slate-300 mb-1">Technical Confluence:</div>
                  <ul className="space-y-1 text-slate-400 text-[11px]">
                    {aiExplanation.technicalConfluence.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Risks */}
                <div>
                  <div className="font-semibold text-rose-300 mb-1">Key Risk Factors:</div>
                  <ul className="space-y-1 text-slate-400 text-[11px]">
                    {aiExplanation.keyRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Macro/Sector */}
                <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                  <strong className="text-slate-300">Sector Context:</strong> {aiExplanation.macroSectorContext}
                </div>

                {/* Compliance Disclaimer in AI block */}
                <div className="bg-amber-950/40 border border-amber-800/40 p-2.5 rounded text-[10px] text-amber-300/90 font-medium">
                  {aiExplanation.disclaimer}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>Model: {aiExplanation.modelUsed}</span>
                  <span>{aiExplanation.isCached ? 'Cached Result' : 'Fresh Analysis'}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <button
                  onClick={handleGenerateAiThesis}
                  disabled={isAiLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isAiLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Confluence Thesis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Technical Explanation</span>
                    </>
                  )}
                </button>
                <span className="text-[10px] text-slate-500 block mt-2">
                  Cost-optimized: Only called on-demand and cached per indicator hash.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
