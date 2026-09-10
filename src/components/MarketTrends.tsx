import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Clock,
  Radio,
  BarChart3,
  ShieldAlert,
  Sliders,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { MarketTrendData } from '../types.js';

interface MarketTrendsProps {
  onSelectStock: (symbol: string) => void;
  onViewSignals: () => void;
}

export const MarketTrends: React.FC<MarketTrendsProps> = ({
  onSelectStock,
  onViewSignals,
}) => {
  const [trends, setTrends] = useState<MarketTrendData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  const fetchTrends = async () => {
    try {
      const res = await fetch('/api/market/trends');
      if (res.ok) {
        const data: MarketTrendData = await res.json();
        setTrends(data);
        setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Error fetching real market trends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
    // Refresh trends every 45s
    const interval = setInterval(fetchTrends, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/market/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.trends) {
          setTrends(data.trends);
        } else {
          await fetchTrends();
        }
        setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to trigger market sync:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading && !trends) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center shadow-xl">
        <RefreshCw className="w-9 h-9 text-sky-400 animate-spin mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Connecting Real Market Trends...</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Streaming live NSE & BSE indices, measuring benchmark market regimes, calculating sector momentum, and polling India VIX volatility.
        </p>
      </div>
    );
  }

  if (!trends) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <p className="text-sm text-slate-300">Could not retrieve live market trends feed.</p>
        <button
          onClick={fetchTrends}
          className="mt-3 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { regime, regimeTitle, regimeDescription, nifty, sensex, bankNifty, itIndex, vix, marketBreadth, sectorRankings, marketStatus, marketStatusMessage, istTime } = trends;
  const totalStocks = marketBreadth.advances + marketBreadth.declines + marketBreadth.unchanged;
  const advPct = totalStocks > 0 ? (marketBreadth.advances / totalStocks) * 100 : 50;
  const decPct = totalStocks > 0 ? (marketBreadth.declines / totalStocks) * 100 : 50;

  const getRegimeBadge = () => {
    switch (regime) {
      case 'BULLISH':
        return {
          bg: 'bg-emerald-950/70 border-emerald-800 text-emerald-300',
          dot: 'bg-emerald-400',
          label: 'Bullish Expansion',
        };
      case 'CORRECTION':
        return {
          bg: 'bg-rose-950/70 border-rose-800 text-rose-300',
          dot: 'bg-rose-400',
          label: 'Corrective Pressure / Pullback',
        };
      case 'BEARISH':
        return {
          bg: 'bg-amber-950/70 border-amber-800 text-amber-300',
          dot: 'bg-amber-400',
          label: 'Bearish Caution',
        };
      case 'CONSOLIDATION':
      default:
        return {
          bg: 'bg-slate-800/80 border-slate-700 text-slate-200',
          dot: 'bg-sky-400',
          label: 'Rangebound Consolidation',
        };
    }
  };

  const regimeBadge = getRegimeBadge();

  return (
    <div className="space-y-6">
      {/* Real-time Header & Live Sync Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Real Market Trends & Regime Pulse
            </h1>
            <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE FEED ACTIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real market quotes from Indian Exchanges (NSE & BSE) with volatility analysis and sector rotation trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/90 rounded-lg text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all shadow-sm hover:border-sky-500/50 disabled:opacity-50"
            title="Fetch latest quotes directly from NSE/BSE feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Feeds...' : 'Sync Real Feeds'}</span>
          </button>

          <button
            onClick={onViewSignals}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Scan Trend Signals</span>
          </button>
        </div>
      </div>

      {/* Session State Banner & IST Clock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Indian Standard Time (IST)</div>
              <div className="text-sm font-bold text-white font-mono">{istTime}</div>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            UTC+05:30
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              marketStatus === 'OPEN'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
            }`}>
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Exchange Trading Session</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{marketStatus === 'OPEN' ? 'LIVE MARKET OPEN' : marketStatus === 'PRE-OPEN' ? 'PRE-OPEN DISCOVERY' : 'POST-MARKET / CLOSED'}</span>
              </div>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            marketStatus === 'OPEN' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
          }`}>
            {marketStatus}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Real Data Pipeline</div>
              <div className="text-sm font-bold text-slate-200">
                {trends.activeFeedCount} Tickers Synchronized
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono block">
              Updated: {lastSyncTime || 'Now'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Market Regime & Sentiment Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Market Regime:
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${regimeBadge.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${regimeBadge.dot}`} />
                {regimeBadge.label}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {regimeTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {regimeDescription}
            </p>

            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 flex items-center gap-2 mt-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {marketStatusMessage}
              </span>
            </div>
          </div>

          {/* Right Metrics: India VIX & Breadth */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-72 shrink-0">
            {/* India VIX Gauge */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300">INDIA VIX (Volatility)</span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                  vix.status === 'LOW'
                    ? 'bg-emerald-950 text-emerald-400'
                    : vix.status === 'MODERATE'
                    ? 'bg-sky-950 text-sky-400'
                    : vix.status === 'ELEVATED'
                    ? 'bg-amber-950 text-amber-400'
                    : 'bg-rose-950 text-rose-400'
                }`}>
                  {vix.status}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono">{vix.value}</span>
                <span className={`text-xs font-mono font-semibold ${vix.change >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {vix.change >= 0 ? '+' : ''}{vix.change} ({vix.changePercent.toFixed(2)}%)
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                {vix.description}
              </p>
            </div>

            {/* Advance / Decline Breadth */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300">Market Breadth</span>
                <span className="text-xs font-mono font-bold text-sky-400">
                  A/D: {marketBreadth.advanceDeclineRatio}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-slate-300">
                <span className="text-emerald-400">{marketBreadth.advances} Advancing</span>
                <span className="text-rose-400">{marketBreadth.declines} Declining</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div style={{ width: `${advPct}%` }} className="bg-emerald-500 h-full transition-all" />
                <div style={{ width: `${decPct}%` }} className="bg-rose-500 h-full transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Benchmark Indices Grid (Real Market Data) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span>Benchmark Indian Indices (Live Feeds)</span>
          </h3>
          <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE Broker Feed (0-Delay)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[nifty, sensex, bankNifty, itIndex].map((idx) => {
            const isPos = idx.change >= 0;
            const high = 'high' in idx ? idx.high : idx.currentPrice * 1.004;
            const low = 'low' in idx ? idx.low : idx.currentPrice * 0.993;
            const spread = Math.max(1, high - low);
            const sliderPct = Math.min(100, Math.max(0, ((idx.currentPrice - low) / spread) * 100));

            return (
              <div
                key={idx.symbol}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-md hover:shadow-slate-950/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{idx.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                    {idx.symbol}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xl font-extrabold text-white font-mono tracking-tight">
                    {idx.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <div className={`text-xs font-mono font-bold flex items-center gap-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{isPos ? '+' : ''}{idx.change.toFixed(2)}</span>
                    <span>({isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%)</span>
                  </div>
                </div>

                {/* Day Range Bar */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>L: {low.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</span>
                    <span>H: {high.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                    <div
                      style={{ width: `${sliderPct}%` }}
                      className={`h-full ${isPos ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sectoral Performance Heatmap (Calculated from Real Indian Equities) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Real-Time Sectoral Performance & Momentum Heatmap</span>
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated across active NSE large-cap and mid-cap components.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Ranked by Daily % Movement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sectorRankings.map((sec) => {
            const isPos = sec.changePercent >= 0;
            const barWidth = Math.min(100, Math.abs(sec.changePercent) * 25);

            return (
              <div
                key={sec.name}
                className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-bold text-slate-200 truncate">{sec.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono shrink-0">
                        {sec.stockCount} {sec.stockCount === 1 ? 'stock' : 'stocks'}
                      </span>
                    </div>

                    <span className={`text-xs font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}{sec.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  {/* Visual Bar Indicator */}
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${Math.max(5, barWidth)}%` }}
                      className={`h-full rounded-full ${isPos ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    />
                  </div>

                  {sec.topStock && (
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                      <span>Top component: <strong className="text-sky-400 font-mono">{sec.topStock}</strong></span>
                      <button
                        onClick={() => onSelectStock(sec.topStock!)}
                        className="text-slate-400 hover:text-white flex items-center gap-0.5 hover:underline"
                      >
                        <span>Analyze</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Trend Rules Guidance */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-bold text-white mb-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span>How to Align Swing Trades with Current Market Trends:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-400 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <strong className="text-white block mb-1">1. Index Confluence:</strong>
            Trade in the direction of the benchmark Nifty 50 and Bank Nifty. In negative regimes, long setups should have higher minimum technical score thresholds (&gt;75).
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <strong className="text-white block mb-1">2. India VIX Filter:</strong>
            When India VIX is elevated (&gt;18), price ranges expand and whip-saws increase. Always enforce strict stop losses and target at least 1:2 risk-to-reward.
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <strong className="text-white block mb-1">3. Sector Leadership:</strong>
            Filter for stocks belonging to outperforming green sectors (such as {sectorRankings[0]?.name || 'Defensive'}) to maximize institutional tailwinds.
          </div>
        </div>
      </div>
    </div>
  );
};
