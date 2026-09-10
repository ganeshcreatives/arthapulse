import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  TrendingUp,
  TrendingDown,
  Trash2,
  ExternalLink,
  Send,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { WatchlistItem, TradeSignal } from '../types.js';

interface WatchlistProps {
  onSelectStock: (symbol: string) => void;
  onOpenTelegramModal: (signal: TradeSignal) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
  allStockSymbols: string[];
}

export const Watchlist: React.FC<WatchlistProps> = ({
  onSelectStock,
  onOpenTelegramModal,
  onRemoveFromWatchlist,
  onAddToWatchlist,
  allStockSymbols,
}) => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');
  const [addError, setAddError] = useState('');

  const fetchWatchlist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/watchlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    const sym = newSymbol.toUpperCase().trim();

    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: sym }),
      });
      if (res.ok) {
        onAddToWatchlist(sym);
        setNewSymbol('');
        setAddError('');
        fetchWatchlist();
      } else {
        const err = await res.json();
        setAddError(err.error || 'Failed to add stock');
      }
    } catch (err: any) {
      setAddError(err.message || 'Error adding stock');
    }
  };

  const handleRemove = async (symbol: string) => {
    try {
      const res = await fetch(`/api/watchlist/${symbol}`, { method: 'DELETE' });
      if (res.ok) {
        onRemoveFromWatchlist(symbol);
        setItems((prev) => prev.filter((item) => item.quote.symbol !== symbol));
      }
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-sky-400" />
            <span>Personal Stock Watchlist</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time score tracking and fast trigger for technical alert dispatches.
          </p>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add ticker (e.g., INFY)"
            value={newSymbol}
            onChange={(e) => {
              setNewSymbol(e.target.value);
              setAddError('');
            }}
            className="bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {addError && (
        <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-lg">
          {addError}
        </div>
      )}

      {/* Watchlist Content */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-400" />
          <p className="text-xs">Loading watchlist items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium">Your watchlist is currently empty.</p>
          <p className="text-xs text-slate-500 mt-1">
            Search any Indian equity or select one from the Market Overview to monitor.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Equity</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Day Change</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Active Signal</th>
                  <th className="py-3 px-4">Target / Stop</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map(({ quote, signal }) => {
                  const isPos = quote.change >= 0;
                  const isBull = signal.signalType === 'BULLISH';
                  const isBear = signal.signalType === 'BEARISH';

                  return (
                    <tr key={quote.symbol} className="hover:bg-slate-800/40 transition-colors">
                      {/* Equity Name */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => onSelectStock(quote.symbol)}
                          className="font-bold text-white font-mono hover:text-sky-400 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{quote.symbol}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1 rounded font-normal">
                            {quote.exchange}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{quote.name}</div>
                      </td>

                      {/* Current Price */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-100 text-sm">
                        ₹{quote.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Day Change */}
                      <td className="py-3 px-4 font-mono font-semibold">
                        <div className={`flex items-center gap-1 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>
                            {isPos ? '+' : ''}{quote.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isPos ? '+' : ''}₹{quote.change.toFixed(2)}
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sky-400 text-sm">
                            {signal.technicalScore}
                          </span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isBull ? 'bg-emerald-500' : isBear ? 'bg-rose-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${signal.technicalScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Signal */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                            isBull
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : isBear
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {signal.signalType}
                        </span>
                      </td>

                      {/* Target / Stop */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="text-emerald-400">T: ₹{signal.target}</div>
                        <div className="text-rose-400">SL: ₹{signal.stopLoss}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenTelegramModal(signal)}
                            title="Send Telegram Alert"
                            className="p-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onSelectStock(quote.symbol)}
                            title="Full Stock Analysis"
                            className="p-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleRemove(quote.symbol)}
                            title="Remove from Watchlist"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
