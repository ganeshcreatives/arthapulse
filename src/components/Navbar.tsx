import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Activity,
  TrendingUp,
  Bookmark,
  Send,
  Clock,
  ChevronRight,
  ShieldCheck,
  Compass,
  X,
  Sparkles,
  Rocket,
  Layers,
  Globe2,
  BarChart3,
  Home,
  HelpCircle
} from 'lucide-react';
import { MarketIndex, StockQuote } from '../types.js';
import { ArthaPulseLogo } from './ArthaPulseLogo.js';

export type NavTabType =
  | 'home'
  | 'predictions'
  | 'ipos'
  | 'top10'
  | 'overview'
  | 'trends'
  | 'shortlist'
  | 'mutualfunds'
  | 'macro'
  | 'backtest'
  | 'stock'
  | 'watchlist'
  | 'telegram';

interface NavbarProps {
  indices: MarketIndex[];
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  onSelectStock: (symbol: string) => void;
  watchlistCount: number;
  onOpenGlossary?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  indices,
  activeTab,
  setActiveTab,
  onSelectStock,
  watchlistCount,
  onOpenGlossary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockQuote[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/stocks?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setIsDropdownOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      {/* Ticker Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-1.5 px-4 overflow-x-auto no-scrollbar text-xs">
        <div className="flex items-center gap-6 min-w-max">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium pr-2 border-r border-slate-800">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-semibold">NSE/BSE</span>
            <span className="text-amber-400 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-800/40 text-[10px]">
              Delayed 15m
            </span>
          </div>

          {indices.map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <div key={idx.symbol} className="flex items-center gap-2">
                <span className="font-medium text-slate-300">{idx.name}:</span>
                <span className="font-mono text-slate-100 font-semibold">
                  {idx.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`font-mono text-[11px] font-medium flex items-center ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {idx.change.toFixed(2)} ({isPos ? '+' : ''}
                  {idx.changePercent.toFixed(2)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div
            id="nav-brand"
            onClick={() => setActiveTab('home')}
            className="cursor-pointer select-none shrink-0 transition-opacity hover:opacity-95"
            title="ArthaPulse — Feel the Market. See the Future."
          >
            <ArthaPulseLogo variant="compact" showSlogan={true} />
          </div>

          {/* Search Box */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="stock-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
                placeholder="Search NSE/BSE stock (e.g., RELIANCE, TCS, HDFCBANK)..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400">Searching Indian Equities...</div>
                ) : searchResults.length > 0 ? (
                  <div className="py-1">
                    {searchResults.map((stock) => {
                      const isPos = stock.change >= 0;
                      return (
                        <button
                          key={stock.symbol}
                          onClick={() => handleSelect(stock.symbol)}
                          className="w-full px-3.5 py-2.5 text-left hover:bg-slate-800/80 flex items-center justify-between transition-colors border-b border-slate-800/50 last:border-0"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100 text-sm font-mono">{stock.symbol}</span>
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                                {stock.exchange}
                              </span>
                              <span className="text-xs text-slate-400 truncate max-w-[170px]">{stock.name}</span>
                            </div>
                            <span className="text-[11px] text-slate-500">{stock.sector}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm font-semibold text-slate-100">
                              ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                            <div className={`text-xs font-mono font-medium ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isPos ? '+' : ''}
                              {stock.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No stocks matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
            <button
              id="tab-btn-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                  : 'bg-indigo-950/40 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900/50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Today's Market</span>
            </button>

            <button
              id="tab-btn-predictions"
              onClick={() => setActiveTab('predictions')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'predictions'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Stock Predictions</span>
            </button>

            <button
              id="tab-btn-ipos"
              onClick={() => setActiveTab('ipos')}
              className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'ipos'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              <span>IPOs &amp; GMP</span>
            </button>

            <button
              id="tab-btn-top10"
              onClick={() => setActiveTab('top10')}
              className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'top10'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>Top 10 Picks</span>
            </button>

            <button
              id="tab-btn-mutualfunds"
              onClick={() => setActiveTab('mutualfunds')}
              className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'mutualfunds'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Mutual Funds</span>
            </button>

            <button
              id="tab-btn-macro"
              onClick={() => setActiveTab('macro')}
              className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'macro'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Macro</span>
            </button>

            <button
              id="tab-btn-backtest"
              onClick={() => setActiveTab('backtest')}
              className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'backtest'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              <span>Backtest</span>
            </button>

            <button
              id="tab-btn-watchlist"
              onClick={() => setActiveTab('watchlist')}
              className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden xl:inline">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-800 text-sky-400 text-[9px] font-bold flex items-center justify-center border border-slate-700">
                  {watchlistCount}
                </span>
              )}
            </button>

            <button
              id="tab-btn-telegram"
              onClick={() => setActiveTab('telegram')}
              className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === 'telegram'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Telegram Alerts Bot (@arthapulseAi_bot)"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram Bot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
            </button>

            {onOpenGlossary && (
              <button
                onClick={onOpenGlossary}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60 transition-all flex items-center gap-1 flex-shrink-0 ml-1"
                title="Beginner Guide to Stock Terms"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Beginner Guide</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
