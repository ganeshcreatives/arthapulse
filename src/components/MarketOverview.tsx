import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Layers,
  PieChart,
  SlidersHorizontal,
  Flame,
  Zap
} from 'lucide-react';
import { MarketOverviewData, StockQuote, TradeSignal } from '../types.js';

interface MarketOverviewProps {
  data: MarketOverviewData;
  shortlist: TradeSignal[];
  onSelectStock: (symbol: string) => void;
  onViewAllSignals: () => void;
  onViewTrends?: () => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  data,
  shortlist,
  onSelectStock,
  onViewAllSignals,
  onViewTrends,
}) => {
  const { indices, marketBreadth, topGainers, topLosers, sectors } = data;
  const totalStocks = marketBreadth.advances + marketBreadth.declines + marketBreadth.unchanged;
  const advPct = totalStocks > 0 ? (marketBreadth.advances / totalStocks) * 100 : 50;
  const decPct = totalStocks > 0 ? (marketBreadth.declines / totalStocks) * 100 : 50;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Market State Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Indian Market Pulse</span>
            <span className="text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Real NSE / BSE Feeds
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time algorithmic scanning with deterministic technical indicators and AI thesis generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onViewTrends && (
            <button
              onClick={onViewTrends}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real Market Trends</span>
            </button>
          )}

          <button
            onClick={onViewAllSignals}
            className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:border-sky-500/50 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>View Signals ({shortlist.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Major Indices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((idx) => {
          const isPos = idx.change >= 0;
          const rangeSpread = Math.max(0.01, idx.high - idx.low);
          const rangePct = Math.min(100, Math.max(0, ((idx.currentPrice - idx.low) / rangeSpread) * 100));

          return (
            <div
              key={idx.symbol}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-slate-950/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">{idx.name}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {idx.exchange}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl font-bold font-mono text-white">
                  ₹{idx.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <div
                  className={`flex items-center text-xs font-semibold font-mono ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>
                    {isPos ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Day range visualization */}
              <div className="space-y-1 pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                <div className="flex justify-between font-mono">
                  <span>L: ₹{idx.low.toLocaleString('en-IN')}</span>
                  <span>H: ₹{idx.high.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${isPos ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${rangePct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Market Breadth & Sector Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Breadth Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <span>Market Breadth (NSE)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                A/D: <strong className="text-slate-200">{marketBreadth.advanceDeclineRatio.toFixed(2)}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Ratio of advancing equities to declining equities in the monitored pool.
            </p>

            {/* Breadth Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
                  style={{ width: `${advPct}%` }}
                />
                <div
                  className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
                  style={{ width: `${decPct}%` }}
                />
              </div>

              <div className="grid grid-cols-3 text-center text-xs pt-1 font-mono">
                <div className="text-left">
                  <div className="text-emerald-400 font-bold text-sm">{marketBreadth.advances}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Advances</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-300 font-bold text-sm">{marketBreadth.unchanged}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Unchanged</div>
                </div>
                <div className="text-right">
                  <div className="text-rose-400 font-bold text-sm">{marketBreadth.declines}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Declines</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Market Sentiment:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                marketBreadth.advances > marketBreadth.declines
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                  : 'bg-rose-950 text-rose-400 border border-rose-800/50'
              }`}
            >
              {marketBreadth.advances > marketBreadth.declines ? 'Bullish Dominance' : 'Caution / Distribution'}
            </span>
          </div>
        </div>

        {/* Sector Snapshot */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Sector Heatmap & Trajectory</span>
            </h3>
            <span className="text-xs text-slate-400">Indian Industry Groups</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {sectors.map((sec) => {
              const isPos = sec.changePercent >= 0;
              return (
                <div
                  key={sec.name}
                  className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="text-[11px] font-medium text-slate-300 truncate mb-1" title={sec.name}>
                    {sec.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {sec.changePercent.toFixed(2)}%
                    </span>
                    <span className="text-[9px] text-slate-400 px-1 py-0.2 bg-slate-900 rounded">
                      {sec.marketStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Gainers, Top Losers, and Quick Signal Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Top NSE Gainers</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Today</span>
          </div>

          <div className="divide-y divide-slate-800">
            {topGainers.map((stk) => (
              <div
                key={stk.symbol}
                onClick={() => onSelectStock(stk.symbol)}
                className="py-2.5 flex items-center justify-between cursor-pointer group hover:bg-slate-800/40 px-1 rounded transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-100 font-mono group-hover:text-sky-400 transition-colors">
                      {stk.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded">{stk.exchange}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{stk.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-slate-100">
                    ₹{stk.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-400">
                    +{stk.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Top NSE Losers</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Today</span>
          </div>

          <div className="divide-y divide-slate-800">
            {topLosers.map((stk) => (
              <div
                key={stk.symbol}
                onClick={() => onSelectStock(stk.symbol)}
                className="py-2.5 flex items-center justify-between cursor-pointer group hover:bg-slate-800/40 px-1 rounded transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-100 font-mono group-hover:text-sky-400 transition-colors">
                      {stk.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded">{stk.exchange}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{stk.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-slate-100">
                    ₹{stk.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="font-mono text-xs font-bold text-rose-400">
                    {stk.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortlist Spotlights */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Top Filtered Signals</span>
              </h3>
              <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-1.5 py-0.5 rounded font-mono">
                Layer 2
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              High-confidence setups determined purely by technical rules before AI thesis elaboration.
            </p>

            <div className="space-y-2.5">
              {shortlist.slice(0, 3).map((sig) => {
                const isBull = sig.signalType === 'BULLISH';
                return (
                  <div
                    key={sig.symbol}
                    onClick={() => onSelectStock(sig.symbol)}
                    className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm font-mono text-white">{sig.symbol}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isBull
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {sig.signalType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Target: ₹{sig.target.toLocaleString('en-IN')} | R:R {sig.riskReward}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200">
                        Score <span className="font-mono text-sky-400">{sig.technicalScore}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Conf: {sig.confidence}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onViewAllSignals}
            className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore All Rule-Engine Setups</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
