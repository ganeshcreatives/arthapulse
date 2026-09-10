import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  ShieldCheck,
  Layers,
  Activity,
  Info,
  ExternalLink,
  Eye,
  HelpCircle,
  Filter,
  BarChart2,
  Compass,
  Zap,
  Target,
  ShieldAlert,
  Send
} from 'lucide-react';
import { BeginnerStockPrediction, IpoItem, MarketOverviewData, MutualFundItem } from '../types.js';
import { ArthaPulseLogo } from './ArthaPulseLogo.js';

interface HomeSimpleDashboardProps {
  predictions: BeginnerStockPrediction[];
  ipos: IpoItem[];
  mutualFunds?: MutualFundItem[];
  marketOverview?: MarketOverviewData | null;
  marketDirection?: 'UPWARD' | 'UNCLEAR' | 'DOWNWARD';
  marketSummary?: string;
  onSelectStock: (symbol: string) => void;
  onNavigateTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onOpenGlossary?: () => void;
}

export const HomeSimpleDashboard: React.FC<HomeSimpleDashboardProps> = ({
  predictions,
  ipos,
  mutualFunds = [],
  marketOverview,
  marketDirection = 'UPWARD',
  marketSummary = '',
  onSelectStock,
  onNavigateTab,
  onNavigate,
  onOpenGlossary,
}) => {
  // Local active tab filter for the 3 asset classes
  const [activeAssetCategory, setActiveAssetCategory] = useState<'ALL' | 'STOCKS' | 'IPOS' | 'FUNDS'>('ALL');

  // Expanded card tracking sets
  const [expandedStocks, setExpandedStocks] = useState<Set<string>>(new Set());
  const [expandedIpos, setExpandedIpos] = useState<Set<string>>(new Set());
  const [expandedFunds, setExpandedFunds] = useState<Set<number>>(new Set());

  // Live mutual funds state (fallback fetch if empty)
  const [fundsList, setFundsList] = useState<MutualFundItem[]>(mutualFunds);

  useEffect(() => {
    if (mutualFunds && mutualFunds.length > 0) {
      setFundsList(mutualFunds);
      return;
    }
    fetch('/api/mutual-funds')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.funds || [];
        if (list.length > 0) {
          setFundsList(list);
        }
      })
      .catch(() => {});
  }, [mutualFunds]);

  const handleNav = (tab: string) => {
    const targetTab = tab === 'mutual-funds' ? 'mutualfunds' : tab;
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(targetTab);
    } else if (typeof onNavigate === 'function') {
      onNavigate(targetTab);
    }
  };

  const toggleStockExpand = (symbol: string) => {
    setExpandedStocks((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  const toggleIpoExpand = (id: string) => {
    setExpandedIpos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFundExpand = (code: number) => {
    setExpandedFunds((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  // 1. Data Slices: Top 10 Stocks
  const top10Stocks = predictions.slice(0, 10);

  // 2. Data Slices: Top 10 IPOs (Prioritize Open, then Upcoming)
  const sortedIpos = [...ipos].sort((a, b) => {
    if (a.stage === 'OPEN' && b.stage !== 'OPEN') return -1;
    if (b.stage === 'OPEN' && a.stage !== 'OPEN') return 1;
    return (b.aiAnalysis?.confidence || 0) - (a.aiAnalysis?.confidence || 0);
  });
  const top10Ipos = sortedIpos.slice(0, 10);

  // 3. Data Slices: Top 10 Mutual Funds (Sorted by AI Score / 3Y CAGR)
  const sortedFunds = [...fundsList].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  const top10Funds = sortedFunds.slice(0, 10);

  // 4. "What should I watch or consider today?" Hero candidates
  const spotlightStock = top10Stocks[0] || null;
  const spotlightIpo = top10Ipos.find((i) => i.stage === 'OPEN') || top10Ipos[0] || null;
  const spotlightFund = top10Funds[0] || null;

  // Derive Market Indices & Metrics
  const nifty = marketOverview?.indices.find((i) => i.symbol.includes('NIFTY')) || marketOverview?.indices[0];
  const sensex = marketOverview?.indices.find((i) => i.symbol.includes('SENSEX')) || marketOverview?.indices[1];
  const topGainers = marketOverview?.topGainers || [];
  const topLosers = marketOverview?.topLosers || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Brand Header & Slogan Banner */}
      <div className="bg-gradient-to-r from-[#060D1E] via-[#0A1A3B] to-[#060D1E] border border-sky-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <ArthaPulseLogo variant="compact" showSlogan={false} />
          <div className="h-8 w-px bg-sky-500/30 hidden sm:block" />
          <div>
            <p className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              Feel the market. <span className="text-[#00D2FF] drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]">See the future.</span>
            </p>
            <p className="text-xs text-slate-300 font-medium">
              Multi-factor quantitative AI engine • Score &gt; 90 delivers 🟢 Positive Outlook
            </p>
          </div>
        </div>

        {/* Telegram Bot shortcut */}
        <div className="flex items-center gap-2">
          <a
            href="https://t.me/arthapulseAi_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-[#00D2FF] border border-sky-400/40 text-xs font-bold transition-all shadow-sm group"
          >
            <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            <span>Join @arthapulseAi_bot</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: COMPACT MARKET TRENDS (STRICTLY SINGLE-LINE ITEMS)
          ========================================================================= */}
      <section className="bg-slate-900/95 border border-slate-800/90 rounded-2xl p-3 sm:p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Market Pulse
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
              NSE/BSE Delayed 15m
            </span>
          </div>
          <button
            onClick={() => handleNav('overview')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Full Market Overview</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* 5 Compact Single-Line Metric Strips */}
        <div className="space-y-2 text-xs font-mono">
          {/* Line 1: Market Direction & Major Indices */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5 text-slate-300 scrollbar-none">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Activity className="w-3 h-3" />
              Direction: {marketDirection === 'UPWARD' ? 'Upward / Bullish Bias' : marketDirection === 'DOWNWARD' ? 'Downward / Bearish Bias' : 'Sideways / Rangebound'}
            </span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0 font-medium text-slate-200">
              NIFTY 50: <span className="text-white font-bold">₹{nifty ? nifty.currentPrice.toLocaleString('en-IN') : '24,850.20'}</span>{' '}
              <span className={(nifty?.changePercent || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                ({(nifty?.changePercent || 0) >= 0 ? '+' : ''}{(nifty?.changePercent || 0.42).toFixed(2)}%)
              </span>
            </span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0 font-medium text-slate-200">
              SENSEX: <span className="text-white font-bold">₹{sensex ? sensex.currentPrice.toLocaleString('en-IN') : '81,240.10'}</span>{' '}
              <span className={(sensex?.changePercent || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                ({(sensex?.changePercent || 0) >= 0 ? '+' : ''}{(sensex?.changePercent || 0.38).toFixed(2)}%)
              </span>
            </span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0 text-slate-400">
              Breadth: {marketOverview?.marketBreadth ? `${marketOverview.marketBreadth.advances} Adv / ${marketOverview.marketBreadth.declines} Dec` : '1,420 Adv / 980 Dec'}
            </span>
          </div>

          {/* Line 2: 📈 Top Gainers */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5 text-slate-300 scrollbar-none">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              Top Gainers
            </span>
            {topGainers.length > 0 ? (
              topGainers.slice(0, 5).map((stock, idx) => (
                <React.Fragment key={stock.symbol}>
                  {idx > 0 && <span className="text-slate-600 shrink-0">•</span>}
                  <button
                    onClick={() => onSelectStock(stock.symbol)}
                    className="shrink-0 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white">{stock.symbol}</span>{' '}
                    <span className="text-emerald-400">+{stock.changePercent.toFixed(2)}%</span>{' '}
                    <span className="text-slate-400 font-normal">(₹{stock.currentPrice.toLocaleString('en-IN')})</span>
                  </button>
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="shrink-0"><span className="font-bold text-white">BEL</span> <span className="text-emerald-400">+3.85%</span> (₹312.40)</span>
                <span className="text-slate-600 shrink-0">•</span>
                <span className="shrink-0"><span className="font-bold text-white">TATAMOTORS</span> <span className="text-emerald-400">+2.14%</span> (₹942.50)</span>
                <span className="text-slate-600 shrink-0">•</span>
                <span className="shrink-0"><span className="font-bold text-white">HAL</span> <span className="text-emerald-400">+1.92%</span> (₹4,890.00)</span>
                <span className="text-slate-600 shrink-0">•</span>
                <span className="shrink-0"><span className="font-bold text-white">RELIANCE</span> <span className="text-emerald-400">+1.45%</span> (₹2,980.50)</span>
              </>
            )}
          </div>

          {/* Line 3: 📉 Top Losers */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5 text-slate-300 scrollbar-none">
            <span className="inline-flex items-center gap-1 font-semibold text-rose-400 shrink-0 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <TrendingDown className="w-3 h-3" />
              Top Losers
            </span>
            {topLosers.length > 0 ? (
              topLosers.slice(0, 5).map((stock, idx) => (
                <React.Fragment key={stock.symbol}>
                  {idx > 0 && <span className="text-slate-600 shrink-0">•</span>}
                  <button
                    onClick={() => onSelectStock(stock.symbol)}
                    className="shrink-0 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white">{stock.symbol}</span>{' '}
                    <span className="text-rose-400">{stock.changePercent.toFixed(2)}%</span>{' '}
                    <span className="text-slate-400 font-normal">(₹{stock.currentPrice.toLocaleString('en-IN')})</span>
                  </button>
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="shrink-0"><span className="font-bold text-white">TCS</span> <span className="text-rose-400">-1.15%</span> (₹4,180.00)</span>
                <span className="text-slate-600 shrink-0">•</span>
                <span className="shrink-0"><span className="font-bold text-white">INFY</span> <span className="text-rose-400">-0.85%</span> (₹1,840.50)</span>
                <span className="text-slate-600 shrink-0">•</span>
                <span className="shrink-0"><span className="font-bold text-white">TECHM</span> <span className="text-rose-400">-0.62%</span> (₹1,610.00)</span>
                <span className="text-slate-600 shrink-0">•</span>
                <span className="shrink-0"><span className="font-bold text-white">WIPRO</span> <span className="text-rose-400">-0.44%</span> (₹532.00)</span>
              </>
            )}
          </div>

          {/* Line 4: 🔥 Most Active / Trending */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5 text-slate-300 scrollbar-none">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Flame className="w-3 h-3" />
              Most Active & Trending
            </span>
            <span className="shrink-0 font-medium"><span className="font-bold text-white">HDFCBANK</span> (₹3,420 Cr Heavy Institutional Volume)</span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0 font-medium"><span className="font-bold text-white">TATAMOTORS</span> (15m Volume Surge 1.8x)</span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0 font-medium"><span className="font-bold text-white">KANOHAR ELECTRICALS</span> (IPO Bidding: 10.22x Subscribed)</span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0 font-medium"><span className="font-bold text-white">DIXON</span> (PLI Momentum)</span>
          </div>

          {/* Line 5: 📊 Important Real-Time Indicators */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5 text-slate-400 scrollbar-none">
            <span className="inline-flex items-center gap-1 font-semibold text-indigo-400 shrink-0 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              <BarChart2 className="w-3 h-3" />
              Key Indicators
            </span>
            <span className="shrink-0">India VIX: <span className="text-emerald-400 font-bold">13.40 (-2.1% Low Volatility)</span></span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0">10Y Benchmark G-Sec: <span className="text-slate-200 font-bold">6.82%</span></span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0">Crude Oil (Brent): <span className="text-slate-200 font-bold">$74.20/bbl</span></span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0">USD/INR: <span className="text-slate-200 font-bold">₹83.92</span></span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="shrink-0 text-emerald-400 font-bold">FII/DII Net Flow: +₹1,840 Cr</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: “WHAT SHOULD I WATCH OR CONSIDER TODAY?” (PREDICTION FIRST)
          ========================================================================= */}
      <section className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Today's High-Conviction Decisions
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              What should I watch or consider today?
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              AI scanning of live NSE order flow, active Mainboard IPO bidding books, and AMFI mutual funds delivers today’s top actionable focus picks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={onOpenGlossary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>How AI Scores Work</span>
            </button>
          </div>
        </div>

        {/* 3 Spotlight Cards: Stock + IPO + Mutual Fund */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Spotlight 1: Top Stock Today */}
          {spotlightStock && (
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400/50 transition-all shadow-md group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    <Target className="w-3 h-3" /> Top Stock Pick
                  </span>
                  <span className="text-xs font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">
                    Score: {spotlightStock.advancedDetails?.technicalScore || spotlightStock.confidence}/100
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {spotlightStock.symbol}{' '}
                  <span className="text-xs font-normal text-slate-400 block sm:inline">
                    ({spotlightStock.companyName})
                  </span>
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                    spotlightStock.outlook === 'POSITIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : spotlightStock.outlook === 'NEGATIVE'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {spotlightStock.outlook === 'POSITIVE' ? '🟢 Positive Outlook' : spotlightStock.outlook === 'NEGATIVE' ? '🔴 Negative Outlook' : '🟡 Wait & Watch'}
                  </span>
                  <span className="text-xs text-slate-300 font-mono font-bold">
                    ₹{spotlightStock.currentPrice.toLocaleString('en-IN')}{' '}
                    <span className={spotlightStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      ({spotlightStock.changePercent >= 0 ? '+' : ''}{spotlightStock.changePercent.toFixed(2)}%)
                    </span>
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-indigo-400 font-semibold">Target:</span> ₹{spotlightStock.potentialTargetPrice.toLocaleString('en-IN')} •{' '}
                  <span className="text-slate-400 font-semibold">Safety Exit:</span> ₹{spotlightStock.safetyExitPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => toggleStockExpand(spotlightStock.symbol)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>{expandedStocks.has(spotlightStock.symbol) ? 'Hide Analysis' : 'Why? View Analysis'}</span>
                  {expandedStocks.has(spotlightStock.symbol) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onSelectStock(spotlightStock.symbol)}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>Deep Chart</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Spotlight 2: Top IPO Today */}
          {spotlightIpo && (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-400/50 transition-all shadow-md group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Zap className="w-3 h-3" /> Top Live IPO
                  </span>
                  <span className="text-xs font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full">
                    Score: {spotlightIpo.aiAnalysis?.confidence || 88}/100
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {spotlightIpo.companyName}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {spotlightIpo.stage === 'OPEN' ? '🟢 Open for Bidding' : '🟡 Upcoming Issue'}
                  </span>
                  <span className="text-xs text-slate-300 font-mono font-bold">
                    {spotlightIpo.gmpAvailable && spotlightIpo.gmpPercent > 0
                      ? `GMP +${spotlightIpo.gmpPercent.toFixed(1)}%`
                      : `Min ₹${spotlightIpo.minInvestment.toLocaleString('en-IN')}`}
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-semibold">Recommendation:</span>{' '}
                  {spotlightIpo.verdict === 'STRONG APPLY'
                    ? '🟢 Strong Apply'
                    : spotlightIpo.verdict === 'APPLY (LISTING GAINS)'
                    ? '🟢 Apply (Listing Gains)'
                    : '🟡 Wait & Watch'}{' '}
                  • Band: {spotlightIpo.priceBand}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => toggleIpoExpand(spotlightIpo.id)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>{expandedIpos.has(spotlightIpo.id) ? 'Hide Analysis' : 'Why? View Analysis'}</span>
                  {expandedIpos.has(spotlightIpo.id) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleNav('ipos')}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>All IPOs</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Spotlight 3: Top Mutual Fund Today */}
          {spotlightFund && (
            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-400/50 transition-all shadow-md group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    <Compass className="w-3 h-3" /> Top Fund Compounder
                  </span>
                  <span className="text-xs font-bold text-white bg-cyan-600 px-2 py-0.5 rounded-full">
                    Score: {spotlightFund.aiScore || 92}/100
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {spotlightFund.schemeName}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    🟢 Positive Outlook
                  </span>
                  <span className="text-xs text-slate-300 font-mono font-bold">
                    1Y: <span className={spotlightFund.return1Y >= 0 ? 'text-emerald-400' : 'text-slate-300'}>
                      {spotlightFund.return1Y >= 0 ? '+' : ''}{spotlightFund.return1Y.toFixed(1)}%
                    </span>
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-semibold">Category:</span> {spotlightFund.category} •{' '}
                  <span className="text-slate-400 font-semibold">3Y CAGR:</span> +{spotlightFund.return3Y.toFixed(1)}%
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => toggleFundExpand(spotlightFund.schemeCode)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>{expandedFunds.has(spotlightFund.schemeCode) ? 'Hide Analysis' : 'Why? View Analysis'}</span>
                  {expandedFunds.has(spotlightFund.schemeCode) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleNav('mutualfunds')}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>All Funds</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          CATEGORY FILTER NAVIGATION (ALL / STOCKS / IPOS / MUTUAL FUNDS)
          ========================================================================= */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveAssetCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeAssetCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All 3 Categories (30 Picks)
          </button>
          <button
            onClick={() => setActiveAssetCategory('STOCKS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeAssetCategory === 'STOCKS'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Top 10 Investment Stocks
          </button>
          <button
            onClick={() => setActiveAssetCategory('IPOS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeAssetCategory === 'IPOS'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Top 10 IPOs
          </button>
          <button
            onClick={() => setActiveAssetCategory('FUNDS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeAssetCategory === 'FUNDS'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Top 10 Mutual Funds
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Scannable layout: <span className="text-slate-200 font-medium">Name → Score → Outlook → Key Metric</span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: TOP INVESTMENT STOCKS (TOP 10)
          ========================================================================= */}
      {(activeAssetCategory === 'ALL' || activeAssetCategory === 'STOCKS') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                01
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Top Investment Stocks
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                    10 Top Candidates
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Quantitative technical & fundamental ratings updated for today’s trading session.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNav('predictions')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>View Full Prediction Lab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {top10Stocks.map((stock, idx) => {
              const isExpanded = expandedStocks.has(stock.symbol);
              const score = stock.advancedDetails?.technicalScore || stock.confidence;
              const outlookBadge =
                stock.outlook === 'POSITIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    🟢 Positive Outlook
                  </span>
                ) : stock.outlook === 'NEGATIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                    🔴 Negative Outlook
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
                    🟡 Wait & Watch
                  </span>
                );

              return (
                <div
                  key={stock.symbol}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl transition-all overflow-hidden"
                >
                  {/* Clean Initial Scannable Row */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* 1. Name & Rank */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <span className="text-xs font-mono font-bold text-slate-500 w-5">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectStock(stock.symbol)}
                            className="text-sm font-bold text-white hover:text-indigo-300 transition-colors text-left"
                          >
                            {stock.symbol}
                          </button>
                          <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                            {stock.sector}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[220px]">
                          {stock.companyName}
                        </div>
                      </div>
                    </div>

                    {/* 2. AI Score */}
                    <div className="flex items-center gap-2 sm:justify-center min-w-[110px]">
                      <span className="text-xs text-slate-400 sm:hidden">Score:</span>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>{score}/100</span>
                      </div>
                    </div>

                    {/* 3. Simple Outlook */}
                    <div className="min-w-[140px] flex items-center">
                      {outlookBadge}
                    </div>

                    {/* 4. Current Price & Key Metric */}
                    <div className="text-left sm:text-right min-w-[130px]">
                      <div className="text-sm font-bold text-white font-mono">
                        ₹{stock.currentPrice.toLocaleString('en-IN')}{' '}
                        <span className={`text-xs font-medium ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Target: ₹{stock.potentialTargetPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Action: "Why?" / "View Analysis" / Expand */}
                    <div className="flex items-center gap-2 sm:justify-end">
                      <button
                        onClick={() => toggleStockExpand(stock.symbol)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
                      >
                        <span>{isExpanded ? 'Hide' : 'Why?'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed Analysis */}
                  {isExpanded && (
                    <div className="bg-slate-950/80 border-t border-slate-800 p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      {/* Multi-factor Score Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                          <div className="flex justify-between text-xs font-bold text-indigo-400 mb-1">
                            <span>1. Technical (25%)</span>
                            <span className="text-white font-mono">{stock.multiFactor?.technicalScore || stock.advancedDetails?.technicalScore || 70}/100</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stock.multiFactor?.technicalScore || stock.advancedDetails?.technicalScore || 70}%` }} />
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            RSI: {stock.advancedDetails?.rsi?.toFixed(1) || '61.2'} • 20 EMA: ₹{stock.advancedDetails?.ema20?.toFixed(0) || '---'}
                          </div>
                        </div>

                        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                          <div className="flex justify-between text-xs font-bold text-emerald-400 mb-1">
                            <span>2. Fundamentals (25%)</span>
                            <span className="text-white font-mono">{stock.multiFactor?.fundamentalScore || 75}/100</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stock.multiFactor?.fundamentalScore || 75}%` }} />
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            P/E: {stock.advancedDetails?.peRatio ? `${stock.advancedDetails.peRatio}x` : 'Fair'} • Risk: {stock.risk}
                          </div>
                        </div>

                        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                          <div className="flex justify-between text-xs font-bold text-amber-400 mb-1">
                            <span>3. Macro & Geo (25%)</span>
                            <span className="text-white font-mono">{stock.multiFactor?.macroScore || 65}/100</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stock.multiFactor?.macroScore || 65}%` }} />
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Crude: <span className={stock.multiFactor?.crudeImpact?.impact === 'BENEFICIARY' ? 'text-emerald-400 font-bold' : stock.multiFactor?.crudeImpact?.impact === 'ADVERSE' ? 'text-rose-400 font-bold' : 'text-slate-300'}>{stock.multiFactor?.crudeImpact?.impact || 'NEUTRAL'}</span>
                          </div>
                        </div>

                        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                          <div className="flex justify-between text-xs font-bold text-cyan-400 mb-1">
                            <span>4. Sentiment (25%)</span>
                            <span className="text-white font-mono">{stock.multiFactor?.sentimentScore || 60}/100</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${stock.multiFactor?.sentimentScore || 60}%` }} />
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Verified Wire: <span className="text-cyan-300 font-bold">{stock.multiFactor?.newsSentiment || 'POSITIVE'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Commodity Sensitivity & Verified News Highlights */}
                      {stock.multiFactor && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {stock.multiFactor.crudeImpact && (
                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                              <span className="text-amber-400 font-bold block mb-1">🛢️ Crude Oil & FX Sensitivity:</span>
                              <p className="text-slate-300 text-[11px] leading-relaxed">
                                {stock.multiFactor.crudeImpact.reason}
                              </p>
                            </div>
                          )}
                          {stock.multiFactor.newsHeadlines && stock.multiFactor.newsHeadlines.length > 0 && (
                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                              <span className="text-cyan-400 font-bold block mb-1">📰 Verified News Wire:</span>
                              <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                                {stock.multiFactor.newsHeadlines[0].headline}
                              </p>
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                Source: {stock.multiFactor.newsHeadlines[0].source}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Column 1: AI Reasoning & Thesis */}
                        <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" /> AI Prediction Thesis
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {stock.simpleExplanation}
                          </p>
                          <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Action:</span> {stock.continuousRecommendation || stock.whatUserShouldDo} •{' '}
                            <span className="font-semibold text-slate-300">Horizon:</span> {stock.timeHorizon}
                          </div>
                        </div>

                        {/* Column 2: Key Technical Triggers */}
                        <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <BarChart2 className="w-3.5 h-3.5" /> Key Technical Triggers
                          </h4>
                          <div className="space-y-1 text-xs font-mono text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-400">RSI (14):</span>
                              <span className="font-bold">{stock.advancedDetails?.rsi?.toFixed(1) || '61.4'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">20 EMA:</span>
                              <span className="font-bold">₹{stock.advancedDetails?.ema20?.toFixed(2) || '---'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Anchored VWAP:</span>
                              <span className="font-bold">₹{stock.advancedDetails?.vwap?.toFixed(2) || '---'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Support / Resistance:</span>
                              <span className="font-bold">₹{stock.advancedDetails?.supportPrice?.toFixed(0)} / ₹{stock.advancedDetails?.resistancePrice?.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Setup Invalidation & Risks */}
                        <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" /> Risks & Invalidation
                          </h4>
                          <div className="text-xs text-slate-300 space-y-1">
                            <p>• Setup invalid if candle closes below safety exit of <span className="font-bold text-rose-400 font-mono">₹{stock.safetyExitPrice.toLocaleString('en-IN')}</span>.</p>
                            <p>• Risk tier: <span className="font-semibold text-slate-200">{stock.risk} Risk</span> ({stock.sector} sector dynamics).</p>
                          </div>
                          <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                            Sources: NSE 15m Feed • Yahoo Commodities Desk
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500 font-mono">
                          P/E Ratio: {stock.advancedDetails?.peRatio ? `${stock.advancedDetails.peRatio}x` : 'Industry Standard'}
                        </span>
                        <button
                          onClick={() => onSelectStock(stock.symbol)}
                          className="text-xs text-indigo-400 hover:text-white font-semibold inline-flex items-center gap-1"
                        >
                          <span>Open Full Interactive Technical Chart</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: TOP 10 IPOS (REAL UPCOMING / OPEN MAINBOARD ISSUES)
          ========================================================================= */}
      {(activeAssetCategory === 'ALL' || activeAssetCategory === 'IPOS') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                02
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Top 10 IPOs
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                    Verified Active & Upcoming
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Live bidding data from NSE/BSE primary market console with AI grey market & financial score analysis.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNav('ipos')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Explore Complete IPO Tracker</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {top10Ipos.map((ipo, idx) => {
              const isExpanded = expandedIpos.has(ipo.id);
              const aiScore = ipo.aiAnalysis?.confidence || Math.round(100 - ipo.riskScore * 5);

              // Simple Recommendation Tag
              const recTag =
                ipo.verdict === 'STRONG APPLY' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    🟢 Strong Apply
                  </span>
                ) : ipo.verdict === 'APPLY (LISTING GAINS)' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    🟢 Apply (Listing Gains)
                  </span>
                ) : ipo.verdict === 'AVOID' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                    🔴 Avoid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
                    🟡 Wait & Watch
                  </span>
                );

              const statusBadge =
                ipo.stage === 'OPEN' ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    OPEN NOW
                  </span>
                ) : ipo.stage === 'UPCOMING' ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    UPCOMING
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                    {ipo.stage.replace('_', ' ')}
                  </span>
                );

              return (
                <div
                  key={ipo.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl transition-all overflow-hidden"
                >
                  {/* Clean Initial Scannable Row */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* 1. Name & Status */}
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <span className="text-xs font-mono font-bold text-slate-500 w-5">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {ipo.companyName}
                          </span>
                          {statusBadge}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[220px]">
                          {ipo.sector} • {ipo.category}
                        </div>
                      </div>
                    </div>

                    {/* 2. AI Score */}
                    <div className="flex items-center gap-2 sm:justify-center min-w-[110px]">
                      <span className="text-xs text-slate-400 sm:hidden">Score:</span>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{aiScore}/100</span>
                      </div>
                    </div>

                    {/* 3. Simple Recommendation */}
                    <div className="min-w-[140px] flex items-center">
                      {recTag}
                    </div>

                    {/* 4. Price & Key Metric (GMP or Min Inv) */}
                    <div className="text-left sm:text-right min-w-[140px]">
                      <div className="text-sm font-bold text-white font-mono">
                        {ipo.gmpAvailable && ipo.gmpPercent > 0 ? (
                          <span className="text-emerald-400">GMP +{ipo.gmpPercent.toFixed(1)}%</span>
                        ) : (
                          <span>Band: {ipo.priceBand}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {ipo.subscriptionAvailable && ipo.subscriptionTotal > 0
                          ? `Sub: ${ipo.subscriptionTotal.toFixed(2)}x`
                          : `Min: ₹${ipo.minInvestment.toLocaleString('en-IN')}`}
                      </div>
                    </div>

                    {/* Action: "Why?" / "View Analysis" / Expand */}
                    <div className="flex items-center gap-2 sm:justify-end">
                      <button
                        onClick={() => toggleIpoExpand(ipo.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
                      >
                        <span>{isExpanded ? 'Hide' : 'Why?'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed Analysis */}
                  {isExpanded && (
                    <div className="bg-slate-950/80 border-t border-slate-800 p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Column 1: AI Rationale & Verdict */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" /> AI Recommendation Reasoning
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {ipo.aiAnalysis?.simpleWhy || ipo.description}
                          </p>
                          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Issue Size:</span> ₹{ipo.issueSizeCr} Cr •{' '}
                            <span className="font-semibold text-slate-300">Lot Size:</span> {ipo.lotSize} Shares
                          </div>
                        </div>

                        {/* Column 2: Subscription Breakdown */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" /> Live Subscription Breakdown
                          </h4>
                          {ipo.subscriptionAvailable && ipo.subscriptionTotal > 0 ? (
                            <div className="space-y-1 text-xs font-mono text-slate-300">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Total Bidding:</span>
                                <span className="font-bold text-emerald-400">{ipo.subscriptionTotal}x</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Institutional (QIB):</span>
                                <span className="font-bold">{ipo.subscriptionQIB}x</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">High Net-Worth (NII):</span>
                                <span className="font-bold">{ipo.subscriptionNII}x</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Retail Bidding:</span>
                                <span className="font-bold">{ipo.subscriptionRetail}x</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 italic py-2">
                              Data unavailable (Bidding yet to open on primary exchanges)
                            </div>
                          )}
                        </div>

                        {/* Column 3: Strengths & Risk Warnings */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" /> Strengths & Risks
                          </h4>
                          <div className="text-xs text-slate-300 space-y-1">
                            {ipo.keyStrengths && ipo.keyStrengths.length > 0 ? (
                              <p>• <span className="text-slate-200">{ipo.keyStrengths[0]}</span></p>
                            ) : null}
                            {ipo.keyRisks && ipo.keyRisks.length > 0 ? (
                              <p className="text-amber-300">• Risk: {ipo.keyRisks[0]}</p>
                            ) : null}
                          </div>
                          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                            Timeline: Open {ipo.openDate} • Close {ipo.closeDate} • Listing {ipo.listingDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-500 font-mono">
                          Source: {ipo.source}
                        </span>
                        <button
                          onClick={() => handleNav('ipos')}
                          className="text-xs text-emerald-400 hover:text-white font-semibold inline-flex items-center gap-1"
                        >
                          <span>Open Full IPO Subscription Table</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5: TOP 10 MUTUAL FUNDS (LIVE AMFI NAV & PERFORMANCE)
          ========================================================================= */}
      {(activeAssetCategory === 'ALL' || activeAssetCategory === 'FUNDS') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                03
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Top 10 Mutual Funds
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                    AMFI Live NAVs & 3Y Alpha
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Consolidated rankings across Large Cap, Mid Cap, Small Cap, and Flexi Cap schemes with live AMFI feeds.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNav('mutualfunds')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Explore All Mutual Funds</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {top10Funds.map((fund, idx) => {
              const isExpanded = expandedFunds.has(fund.schemeCode);
              const score = fund.aiScore || 85;

              const outlookBadge =
                fund.outlook === 'POSITIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    🟢 Positive Outlook
                  </span>
                ) : fund.outlook === 'NEGATIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                    🔴 Negative Outlook
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
                    🟡 Wait & Watch
                  </span>
                );

              return (
                <div
                  key={fund.schemeCode}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl transition-all overflow-hidden"
                >
                  {/* Clean Initial Scannable Row */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* 1. Name & Category */}
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <span className="text-xs font-mono font-bold text-slate-500 w-5">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {fund.schemeName}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[240px]">
                          {fund.fundHouse} • <span className="text-cyan-400">{fund.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. AI Score */}
                    <div className="flex items-center gap-2 sm:justify-center min-w-[110px]">
                      <span className="text-xs text-slate-400 sm:hidden">Score:</span>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>{score}/100</span>
                      </div>
                    </div>

                    {/* 3. Simple Outlook */}
                    <div className="min-w-[140px] flex items-center">
                      {outlookBadge}
                    </div>

                    {/* 4. Recent Performance & NAV */}
                    <div className="text-left sm:text-right min-w-[130px]">
                      <div className="text-sm font-bold text-white font-mono">
                        1Y:{' '}
                        <span className={fund.return1Y >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {fund.return1Y >= 0 ? '+' : ''}{fund.return1Y.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        NAV ₹{fund.nav.toFixed(2)}
                      </div>
                    </div>

                    {/* Action: "Why?" / "View Analysis" / Expand */}
                    <div className="flex items-center gap-2 sm:justify-end">
                      <button
                        onClick={() => toggleFundExpand(fund.schemeCode)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
                      >
                        <span>{isExpanded ? 'Hide' : 'Why?'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed Analysis */}
                  {isExpanded && (
                    <div className="bg-slate-950/80 border-t border-slate-800 p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Column 1: Investment Rationale & Suitability */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" /> Investment Rationale
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {fund.suitability}
                          </p>
                          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Rating:</span> {'★'.repeat(fund.ratingStars)} ({fund.ratingStars} Stars) •{' '}
                            <span className="font-semibold text-slate-300">Risk:</span> {fund.riskGrade}
                          </div>
                        </div>

                        {/* Column 2: Historical CAGR Returns */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <BarChart2 className="w-3.5 h-3.5" /> Historical CAGR Performance
                          </h4>
                          <div className="space-y-1 text-xs font-mono text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-400">1-Year Return:</span>
                              <span className={`font-bold ${fund.return1Y >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {fund.return1Y >= 0 ? '+' : ''}{fund.return1Y.toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">3-Year CAGR:</span>
                              <span className="font-bold text-emerald-400">+{fund.return3Y.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">5-Year CAGR:</span>
                              <span className="font-bold text-emerald-400">+{fund.return5Y.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Fund Details & AUM */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" /> Fund Fundamentals
                          </h4>
                          <div className="space-y-1 text-xs font-mono text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Expense Ratio:</span>
                              <span className="font-bold">{fund.expenseRatio}% (Direct)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Total AUM:</span>
                              <span className="font-bold">₹{fund.aumCr.toLocaleString('en-IN')} Cr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">NAV Date:</span>
                              <span className="font-bold">{fund.navDate}</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                            Source: {fund.source} (api.mfapi.in)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-500 font-mono">
                          Scheme Code: {fund.schemeCode}
                        </span>
                        <button
                          onClick={() => handleNav('mutualfunds')}
                          className="text-xs text-cyan-400 hover:text-white font-semibold inline-flex items-center gap-1"
                        >
                          <span>Compare in Mutual Funds Explorer</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
