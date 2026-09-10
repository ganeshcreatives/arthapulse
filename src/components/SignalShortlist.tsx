import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Send,
  Sparkles,
  ChevronRight,
  Target,
  AlertTriangle,
  Bookmark
} from 'lucide-react';
import { TradeSignal } from '../types.js';

interface SignalShortlistProps {
  signals: TradeSignal[];
  onSelectStock: (symbol: string) => void;
  onOpenTelegramModal: (signal: TradeSignal) => void;
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const SignalShortlist: React.FC<SignalShortlistProps> = ({
  signals,
  onSelectStock,
  onOpenTelegramModal,
  watchlistSymbols,
  onToggleWatchlist,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'BULLISH' | 'BEARISH' | 'HIGH_SCORE'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const filtered = signals.filter((s) => {
    if (filterType === 'BULLISH' && s.signalType !== 'BULLISH') return false;
    if (filterType === 'BEARISH' && s.signalType !== 'BEARISH') return false;
    if (filterType === 'HIGH_SCORE' && s.technicalScore < 70 && s.technicalScore > 35) return false;

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Rule-Based Signal Shortlist
            </h1>
            <span className="text-xs font-semibold bg-sky-950 text-sky-400 border border-sky-800/80 px-2 py-0.5 rounded-full font-mono">
              Layer 2 Pipeline
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Algorithmic candidates filtered by technical score thresholds, moving average alignment, and momentum triggers.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Filter candidates..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
          />

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'ALL' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({signals.length})
            </button>
            <button
              onClick={() => setFilterType('BULLISH')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'BULLISH' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Bullish ({signals.filter((s) => s.signalType === 'BULLISH').length})
            </button>
            <button
              onClick={() => setFilterType('BEARISH')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'BEARISH' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Bearish ({signals.filter((s) => s.signalType === 'BEARISH').length})
            </button>
            <button
              onClick={() => setFilterType('HIGH_SCORE')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'HIGH_SCORE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              High Conviction
            </button>
          </div>
        </div>
      </div>

      {/* Signals Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm">No signals match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((sig) => {
            const isBull = sig.signalType === 'BULLISH';
            const isBear = sig.signalType === 'BEARISH';
            const inWatchlist = watchlistSymbols.includes(sig.symbol);

            return (
              <div
                key={sig.symbol}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-slate-950/40 relative group"
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => onSelectStock(sig.symbol)}
                          className="text-base font-bold text-white font-mono cursor-pointer hover:text-sky-400 transition-colors"
                        >
                          {sig.symbol}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          {sig.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[190px]">{sig.name}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleWatchlist(sig.symbol)}
                        title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          inWatchlist
                            ? 'bg-sky-950 border-sky-700 text-sky-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={inWatchlist ? 'currentColor' : 'none'} />
                      </button>

                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isBull
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : isBear
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {isBull ? <ArrowUpRight className="w-3.5 h-3.5" /> : isBear ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
                        <span>{sig.signalType}</span>
                      </span>
                    </div>
                  </div>

                  {/* Technical Score Meter */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Deterministic Score</span>
                      <span className="font-mono font-bold text-white">
                        <span className="text-sky-400">{sig.technicalScore}</span> / 100
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isBull ? 'bg-emerald-500' : isBear ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${sig.technicalScore}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>Conf: {sig.confidence}% ({sig.confidenceLevel})</span>
                      <span>RSI: {sig.indicators.rsi.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Execution Levels */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3 font-mono">
                    <div className="bg-slate-800/60 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-sans">Entry Range</div>
                      <div className="font-semibold text-slate-100 mt-0.5 text-[11px]">
                        ₹{sig.entryLow}
                      </div>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-emerald-400 uppercase font-sans">Target</div>
                      <div className="font-semibold text-emerald-300 mt-0.5 text-[11px]">
                        ₹{sig.target}
                      </div>
                      <div className="text-[9px] text-emerald-400">
                        {sig.targetPercent > 0 ? '+' : ''}{sig.targetPercent}%
                      </div>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-rose-400 uppercase font-sans">Stop Loss</div>
                      <div className="font-semibold text-rose-300 mt-0.5 text-[11px]">
                        ₹{sig.stopLoss}
                      </div>
                      <div className="text-[9px] text-rose-400">{sig.stopLossPercent}%</div>
                    </div>
                  </div>

                  {/* Reasons Preview */}
                  <div className="space-y-1 text-xs text-slate-300 mb-4">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1">Key Triggers:</div>
                    {sig.reasons.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <span className="text-sky-400 mt-0.5">•</span>
                        <span className="line-clamp-1">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenTelegramModal(sig)}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Alert</span>
                  </button>

                  <button
                    onClick={() => onSelectStock(sig.symbol)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Inspect & AI Thesis</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
