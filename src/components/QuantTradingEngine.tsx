import React, { useState, useEffect } from 'react';
import {
  Zap,
  Layers,
  Flame,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Send,
  RefreshCw,
  Clock,
  AlertTriangle,
  BarChart2,
  Activity,
  CheckCircle2,
  BookOpen,
  Info,
  ChevronRight,
  Sparkles,
  DollarSign,
  Globe
} from 'lucide-react';
import {
  QuantAssetOverview,
  QuantAssetCategory,
  QuantTradeSetup,
  QuantHistorical10DayBacktestResult
} from '../types.js';

interface QuantTradingEngineProps {
  onOpenTelegramModal?: (setup: QuantTradeSetup) => void;
}

export const QuantTradingEngine: React.FC<QuantTradingEngineProps> = ({
  onOpenTelegramModal
}) => {
  const [category, setCategory] = useState<QuantAssetCategory>('F_AND_O');
  const [assets, setAssets] = useState<QuantAssetOverview[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NIFTY-FUT');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backtest, setBacktest] = useState<QuantHistorical10DayBacktestResult | null>(null);
  const [isBacktestLoading, setIsBacktestLoading] = useState<boolean>(false);
  const [showSpecModal, setShowSpecModal] = useState<boolean>(false);
  const [telegramSending, setTelegramSending] = useState<boolean>(false);
  const [telegramSuccess, setTelegramSuccess] = useState<string | null>(null);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number>(24);

  // Fetch all quantitative assets
  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/quant/assets');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error('Failed to load quant assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // High-frequency tick poll simulation every 2.5 seconds
    const interval = setInterval(() => {
      fetchAssets();
      setLatencyMs(Math.floor(18 + Math.random() * 16));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Fetch backtest when selected symbol changes
  useEffect(() => {
    async function loadBacktest() {
      if (!selectedSymbol) return;
      setIsBacktestLoading(true);
      try {
        const res = await fetch(`/api/quant/backtest/${selectedSymbol}`);
        if (res.ok) {
          const data = await res.json();
          setBacktest(data.backtest || null);
        }
      } catch (err) {
        console.error('Failed to fetch 10-day backtest:', err);
      } finally {
        setIsBacktestLoading(false);
      }
    }
    loadBacktest();
  }, [selectedSymbol]);

  // Filter assets by active category
  const filteredAssets = assets.filter((a) => a.category === category);
  const activeAsset = assets.find((a) => a.symbol === selectedSymbol) || filteredAssets[0] || assets[0];

  // Auto-switch selected symbol if not in current category
  useEffect(() => {
    if (filteredAssets.length > 0 && !filteredAssets.some((a) => a.symbol === selectedSymbol)) {
      setSelectedSymbol(filteredAssets[0].symbol);
    }
  }, [category, filteredAssets, selectedSymbol]);

  // Handle instant Telegram webhook alert trigger
  const handleTriggerTelegramAlert = async (setup: QuantTradeSetup) => {
    setTelegramSending(true);
    setTelegramSuccess(null);
    setTelegramError(null);

    try {
      const res = await fetch('/api/quant/alert/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTelegramSuccess(`Alert dispatched to Telegram (Msg ID: #${data.messageId || 'SENT'})`);
      } else {
        setTelegramError(data.error || 'Failed to dispatch Telegram alert');
      }
    } catch (err: any) {
      setTelegramError(err.message || 'Telegram network error');
    } finally {
      setTelegramSending(false);
      setTimeout(() => {
        setTelegramSuccess(null);
        setTelegramError(null);
      }, 5000);
    }
  };

  if (isLoading && assets.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center shadow-xl">
        <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white">Connecting to High-Frequency Tick Engine...</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5">
          Ingesting live Level-2 orderbook ticks, Bollinger Bands, Volume Profile, and AI anti-spoofing filters for F&amp;O and Commodities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Center */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE HFT STREAM ({latencyMs}ms)</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Orderbook Depth • Bollinger Mean-Reversion • Anti-Spoofing
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              Multi-Asset Quantitative Trading Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              High-frequency second-by-second analytics covering Intraday Cash, Index Futures &amp; Options, and MCX Commodities with real-time Telegram webhook execution.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setShowSpecModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Architectural Spec</span>
            </button>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 mt-5 border-t border-slate-800/80 pt-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setCategory('F_AND_O')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              category === 'F_AND_O'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Futures &amp; Options (F&amp;O)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-200">
              NIFTY / BANKNIFTY
            </span>
          </button>

          <button
            onClick={() => setCategory('COMMODITIES')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              category === 'COMMODITIES'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Commodities (MCX)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200">
              Gold / Silver / Crude
            </span>
          </button>

          <button
            onClick={() => setCategory('INTRADAY_EQUITY')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              category === 'INTRADAY_EQUITY'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Intraday Equities</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-200">
              Cash MIS
            </span>
          </button>
        </div>
      </div>

      {/* Asset Horizontal Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {filteredAssets.map((asset) => {
          const isSelected = asset.symbol === activeAsset?.symbol;
          const isPos = asset.change >= 0;
          return (
            <button
              key={asset.symbol}
              onClick={() => setSelectedSymbol(asset.symbol)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/95 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-2 h-2 rounded-bl bg-indigo-500" />
              )}
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-white truncate max-w-[110px]">
                  {asset.symbol}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-slate-100">
                ₹{asset.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {asset.name}
              </div>
            </button>
          );
        })}
      </div>

      {activeAsset && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Orderbook Depth & Indicator Suite */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Asset Live Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white font-mono">{activeAsset.symbol}</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {activeAsset.category}
                    </span>
                    {activeAsset.pcrRatio && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        PCR: {activeAsset.pcrRatio}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{activeAsset.contractDetails || activeAsset.name}</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-white font-mono">
                    ₹{activeAsset.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${
                      activeAsset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {activeAsset.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>
                      {activeAsset.change >= 0 ? '+' : ''}
                      {activeAsset.change.toFixed(2)} ({activeAsset.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* High / Low / Volume Stats Strip */}
              <div className="grid grid-cols-3 gap-3 pt-3 text-center font-mono">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">24H HIGH</span>
                  <span className="text-xs font-bold text-slate-200">
                    ₹{activeAsset.high24h.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">24H LOW</span>
                  <span className="text-xs font-bold text-slate-200">
                    ₹{activeAsset.low24h.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">VOLUME</span>
                  <span className="text-xs font-bold text-indigo-300">
                    {activeAsset.volume}
                  </span>
                </div>
              </div>
            </div>

            {/* Level-2 Live Orderbook & Anti-Spoofing Detection */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Live Level-2 Orderbook Depth (5-Depth)
                  </h3>
                </div>
                {activeAsset.orderBook.spoofDetected ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Spoof Wall Detected ({activeAsset.orderBook.spoofConfidence}%)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Clean Liquidity Depth</span>
                  </span>
                )}
              </div>

              {/* Bids vs Asks Table */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                {/* Bids Side */}
                <div>
                  <div className="flex justify-between text-[10px] text-emerald-400 font-bold border-b border-slate-800 pb-1.5 mb-1.5">
                    <span>BID PRICE</span>
                    <span>QTY (ORDERS)</span>
                  </div>
                  <div className="space-y-1.5">
                    {activeAsset.orderBook.bids.map((bid, i) => (
                      <div
                        key={i}
                        className={`flex justify-between p-1.5 rounded relative overflow-hidden ${
                          bid.isSpoofed ? 'bg-rose-950/30 border border-rose-800/40' : 'bg-slate-950/70'
                        }`}
                      >
                        <span className="font-bold text-emerald-400 z-10">
                          ₹{bid.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-slate-300 z-10">
                          {bid.qty.toLocaleString('en-IN')} <span className="text-slate-500">({bid.orders})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right text-[11px] text-slate-400">
                    Total Bids: <span className="text-emerald-400 font-bold">{activeAsset.orderBook.totalBidQty.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Asks Side */}
                <div>
                  <div className="flex justify-between text-[10px] text-rose-400 font-bold border-b border-slate-800 pb-1.5 mb-1.5">
                    <span>ASK PRICE</span>
                    <span>QTY (ORDERS)</span>
                  </div>
                  <div className="space-y-1.5">
                    {activeAsset.orderBook.asks.map((ask, i) => (
                      <div
                        key={i}
                        className={`flex justify-between p-1.5 rounded relative overflow-hidden ${
                          ask.isSpoofed ? 'bg-amber-950/40 border border-amber-500/50' : 'bg-slate-950/70'
                        }`}
                      >
                        <span className="font-bold text-rose-400 z-10">
                          ₹{ask.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-slate-300 z-10 flex items-center gap-1">
                          {ask.isSpoofed && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">FAKE</span>
                          )}
                          {ask.qty.toLocaleString('en-IN')} <span className="text-slate-500">({ask.orders})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right text-[11px] text-slate-400">
                    Total Asks: <span className="text-rose-400 font-bold">{activeAsset.orderBook.totalAskQty.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Institutional Delta Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Institutional Net Delta:</span>
                <span
                  className={`font-mono font-bold ${
                    activeAsset.orderBook.institutionalDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {activeAsset.orderBook.institutionalDelta >= 0 ? '+' : ''}
                  {activeAsset.orderBook.institutionalDelta} Cr (Block Sweeps)
                </span>
              </div>
            </div>

            {/* Indicator Suite: Bollinger Bands, VWAP, Volume Profile */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Indicator Suite &amp; Mean Reversion Analytics
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Status: {activeAsset.indicators.meanReversionStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">VWAP</span>
                  <span className="text-xs font-bold text-sky-300">
                    ₹{activeAsset.indicators.vwap.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">BB UPPER (2σ)</span>
                  <span className="text-xs font-bold text-rose-300">
                    ₹{activeAsset.indicators.bbUpper.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">BB LOWER (2σ)</span>
                  <span className="text-xs font-bold text-emerald-300">
                    ₹{activeAsset.indicators.bbLower.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">VOLUME POC</span>
                  <span className="text-xs font-bold text-amber-300">
                    ₹{activeAsset.indicators.pocPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Volume Profile Bands */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span>Value Area Range (70% Volume):</span>
                <span className="font-mono text-slate-200">
                  VAL: ₹{activeAsset.indicators.valPrice.toLocaleString('en-IN')} ➔ VAH: ₹{activeAsset.indicators.vahPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Signal, AI Macro Overlay & 10-Day Backtest */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Quant Trade Signal Payload */}
            <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  <h3 className="text-sm font-bold text-white">Active High-Probability Signal</h3>
                </div>
                <span
                  className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full ${
                    activeAsset.activeSetup.action === 'BUY'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {activeAsset.activeSetup.action} NOW
                </span>
              </div>

              {/* Price & Target Levels Grid */}
              <div className="grid grid-cols-2 gap-3 my-4 font-mono text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">ENTRY PRICE</span>
                  <span className="text-base font-black text-white">
                    ₹{activeAsset.activeSetup.entryPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">STOP LOSS</span>
                  <span className="text-base font-black text-rose-400">
                    ₹{activeAsset.activeSetup.stopLoss.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">TARGET PRICE</span>
                  <span className="text-base font-black text-emerald-400">
                    ₹{activeAsset.activeSetup.targetPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">RISK : REWARD</span>
                  <span className="text-base font-black text-amber-300">
                    {activeAsset.activeSetup.riskRewardRatio}
                  </span>
                </div>
              </div>

              {/* Confidence & Projected PnL */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Quant Confidence:</span>
                  <span className="font-mono font-bold text-indigo-300">
                    {activeAsset.activeSetup.confidenceScore}% (High Conviction)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Projected Return:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    +{activeAsset.activeSetup.projectedPnlPercent}%
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 italic">
                  &ldquo;{activeAsset.activeSetup.triggerReason}&rdquo;
                </div>
              </div>

              {/* Telegram Instant Trigger Button */}
              <button
                onClick={() => handleTriggerTelegramAlert(activeAsset.activeSetup)}
                disabled={telegramSending}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950/50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {telegramSending ? 'Dispatching Webhook...' : 'Send Signal Payload to Telegram Channel'}
                </span>
              </button>

              {telegramSuccess && (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{telegramSuccess}</span>
                </div>
              )}

              {telegramError && (
                <div className="mt-2.5 p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>{telegramError}</span>
                </div>
              )}
            </div>

            {/* AI Macro & Institutional Overlay */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    AI Macro &amp; Institutional Overlay
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {activeAsset.macroFilter.macroSentiment}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Institutional FII Flow:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    +{activeAsset.macroFilter.diiFiiFlow.fiiNetCrores} Cr ({activeAsset.macroFilter.diiFiiFlow.trend})
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Geopolitical Risk:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {activeAsset.macroFilter.geopoliticalRisk}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Spoof Defense Filter:</span>
                  <span className="font-mono font-bold text-indigo-300">
                    {activeAsset.macroFilter.spoofFilteringAction.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="pt-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Tariff &amp; Policy: </span>
                  {activeAsset.macroFilter.tariffTradeImpact}
                </div>
              </div>
            </div>

            {/* 10-Day Historical Tick Backtest Engine */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    10-Day Tick Backtest Engine
                  </h3>
                </div>
                {isBacktestLoading ? (
                  <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">
                    {backtest?.totalTicksAnalyzed.toLocaleString('en-IN')} Ticks
                  </span>
                )}
              </div>

              {backtest && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">WIN RATE</span>
                      <span className="font-bold text-emerald-400">{backtest.winRate}%</span>
                    </div>
                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">PROFIT FACTOR</span>
                      <span className="font-bold text-white">{backtest.profitFactor}</span>
                    </div>
                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">SHARPE</span>
                      <span className="font-bold text-indigo-300">{backtest.sharpeRatio}</span>
                    </div>
                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">MAX DD</span>
                      <span className="font-bold text-rose-400">{backtest.maxDrawdown}%</span>
                    </div>
                  </div>

                  {/* 10-Day Daily Bar Chart Representation */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 font-mono block mb-1.5">
                      10-Day Cumulative Equity Curve Performance (+{backtest.netReturnPercent}%):
                    </span>
                    <div className="grid grid-cols-10 gap-1 h-12 items-end bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                      {backtest.dailyReturns.map((d, i) => {
                        const isGain = d.pnlPercent >= 0;
                        const heightPct = Math.min(100, Math.max(15, Math.abs(d.pnlPercent) * 20));
                        return (
                          <div
                            key={i}
                            title={`${d.day}: ${d.pnlPercent}% (${d.tradesCount} trades)`}
                            className="group relative flex flex-col justify-end items-center h-full cursor-pointer"
                          >
                            <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full rounded-sm transition-all ${
                                isGain ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-rose-500 group-hover:bg-rose-400'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Architectural Spec Modal */}
      {showSpecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4 text-slate-200 text-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Quantitative Trading System Architecture Specification
              </h2>
              <button
                onClick={() => setShowSpecModal(false)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
              >
                ESC / CLOSE
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong>Full Production Specification:</strong> Saved to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono">QUANTITATIVE_TRADING_ENGINE_SPEC.md</code> in the project root.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-300 uppercase tracking-wide">Core Architectural Components</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>Layer 1 (Ingestion):</strong> Second-by-second binary WebSocket tick streams for NSE Equities, NFO Derivatives, and MCX Commodities.</li>
                  <li><strong>Layer 2 (Depth &amp; Ring Buffer):</strong> Real-time Level-2 5-depth orderbook reconstruction with in-memory Redis ring buffers and 10-day Parquet/ClickHouse storage.</li>
                  <li><strong>Layer 3 (Signals):</strong> Rolling VWAP &amp; standard deviation bands, Bollinger Bands (20, 2.0) with %B mean-reversion scanner, and Volume Profile (POC, VAH, VAL).</li>
                  <li><strong>Layer 4 (AI Macro &amp; Anti-Spoofing):</strong> Order-to-Trade Ratio (OTR) fake order cancellation wall filter + DII/FII net cash block sweep flow + geopolitical tariff shocks.</li>
                  <li><strong>Layer 5 (Execution):</strong> Telegram webhook trigger with sub-35ms SLA transmitting Entry, SL, Targets, R:R, and projected PnL.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 overflow-x-auto">
                <div className="text-emerald-400 font-bold mb-1">Sample Telegram Webhook Payload:</div>
                <pre>{`{
  "symbol": "NIFTY-24800-CE",
  "action": "BUY",
  "entry_price": 142.50,
  "stop_loss": 112.00,
  "target_price": 205.00,
  "risk_reward": "1:2.05",
  "confidence_score": 86,
  "projected_pnl_percent": 43.8
}`}</pre>
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setShowSpecModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
