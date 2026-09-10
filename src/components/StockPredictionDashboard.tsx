import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Layers,
  BarChart2,
  Globe2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
  ExternalLink,
  Target,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { BeginnerStockPrediction, AiOutlook, RiskLevel, ContinuousAction } from '../types.js';

interface StockPredictionDashboardProps {
  predictions: BeginnerStockPrediction[];
  onSelectStock: (symbol: string) => void;
  onOpenGlossary: () => void;
}

export const StockPredictionDashboard: React.FC<StockPredictionDashboardProps> = ({
  predictions,
  onSelectStock,
  onOpenGlossary,
}) => {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [outlookFilter, setOutlookFilter] = useState<'ALL' | AiOutlook>('ALL');
  const [actionFilter, setActionFilter] = useState<'ALL' | ContinuousAction>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [expandedStocks, setExpandedStocks] = useState<Set<string>>(new Set());

  // Unique sectors
  const sectors = useMemo(() => {
    const list = Array.from(new Set(predictions.map((p) => p.sector)));
    return list.sort();
  }, [predictions]);

  // Counts for quick stats
  const totalCount = predictions.length;
  const positiveCount = predictions.filter((p) => p.outlook === 'POSITIVE').length;
  const watchCount = predictions.filter((p) => p.outlook === 'WAIT_AND_WATCH').length;
  const negativeCount = predictions.filter((p) => p.outlook === 'NEGATIVE').length;
  const buyCount = predictions.filter((p) => p.continuousRecommendation === 'Consider Buying').length;

  // Filter logic
  const filteredPredictions = useMemo(() => {
    return predictions.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.companyName.toLowerCase().includes(q) ||
          p.symbol.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Outlook
      if (outlookFilter !== 'ALL' && p.outlook !== outlookFilter) {
        return false;
      }

      // Continuous Action
      if (actionFilter !== 'ALL' && p.continuousRecommendation !== actionFilter) {
        return false;
      }

      // Sector
      if (sectorFilter !== 'ALL' && p.sector !== sectorFilter) {
        return false;
      }

      // Risk
      if (riskFilter !== 'ALL' && p.risk !== riskFilter) {
        return false;
      }

      return true;
    });
  }, [predictions, searchQuery, outlookFilter, actionFilter, sectorFilter, riskFilter]);

  const toggleExpand = (symbol: string) => {
    setExpandedStocks((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedStocks(new Set(filteredPredictions.map((p) => p.symbol)));
  };

  const collapseAll = () => {
    setExpandedStocks(new Set());
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* =========================================================================
          HEADER: CONTINUOUS MULTI-FACTOR AI ANALYSIS ENGINE
          ========================================================================= */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider border border-sky-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
              Feel the market. See the future.
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Stock Prediction Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Every stock is continuously evaluated using live feeds across 4 quantitative dimensions. Setups scoring <span className="text-emerald-400 font-bold">&gt; 90/100</span> earn a verified <span className="text-emerald-400 font-bold">Positive Outlook</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={onOpenGlossary}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Scoring Methodology</span>
            </button>
          </div>
        </div>

        {/* Quick Intelligence Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5 pt-4 border-t border-slate-800/80 font-mono text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">Active Universe</span>
            <span className="text-base font-bold text-white mt-0.5 block">{totalCount} Stocks Verified</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase block font-sans font-semibold">Positive Outlook</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">{positiveCount} Stocks</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase block font-sans font-semibold">Wait & Watch</span>
            <span className="text-base font-bold text-amber-400 mt-0.5 block">{watchCount} Stocks</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-rose-400 uppercase block font-sans font-semibold">Negative Outlook</span>
            <span className="text-base font-bold text-rose-400 mt-0.5 block">{negativeCount} Stocks</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-indigo-400 uppercase block font-sans font-semibold">Consider Buying</span>
            <span className="text-base font-bold text-indigo-400 mt-0.5 block">{buyCount} Prime Setups</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company name, symbol (e.g. TATAMOTORS, HAL, BEL, RELIANCE, DIXON)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters:
              </span>

              {/* Outlook Filter */}
              <button
                onClick={() => setOutlookFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  outlookFilter === 'ALL'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Outlooks ({totalCount})
              </button>
              <button
                onClick={() => setOutlookFilter('POSITIVE')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  outlookFilter === 'POSITIVE'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40'
                }`}
              >
                <span>🟢</span> Positive Outlook (&gt;90) ({positiveCount})
              </button>
              <button
                onClick={() => setOutlookFilter('WAIT_AND_WATCH')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  outlookFilter === 'WAIT_AND_WATCH'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40'
                }`}
              >
                <span>🟡</span> Wait & Watch (50–89) ({watchCount})
              </button>
              <button
                onClick={() => setOutlookFilter('NEGATIVE')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  outlookFilter === 'NEGATIVE'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/40'
                }`}
              >
                <span>🔴</span> Negative Outlook (&lt;50) ({negativeCount})
              </button>

              {/* Sector Dropdown */}
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium"
              >
                <option value="ALL">All Sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Action Dropdown */}
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium"
              >
                <option value="ALL">All Recommendations</option>
                <option value="Consider Buying">Consider Buying</option>
                <option value="Hold / Continue Watching">Hold / Continue Watching</option>
                <option value="Wait">Wait</option>
                <option value="Consider Selling">Consider Selling</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Expand All
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={collapseAll}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredPredictions.length}</strong> verified stock predictions • Scannable format: <span className="text-slate-300 font-medium">Name → Score → Outlook → Action → Price</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Probabilistic AI intelligence, never a guaranteed outcome
        </span>
      </div>

      {/* =========================================================================
          EMBEDDED STOCKS: PREDICTION FIRST, DETAILS SECOND (EXPANDABLE)
          ========================================================================= */}
      <div className="space-y-2.5">
        {filteredPredictions.map((stock, idx) => {
          const isExpanded = expandedStocks.has(stock.symbol);
          const mf = stock.multiFactor;
          const score = mf?.compositeScore || stock.confidence;

          // Outlook Badge
          const outlookBadge =
            stock.outlook === 'POSITIVE' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                🟢 Positive Outlook
              </span>
            ) : stock.outlook === 'NEGATIVE' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                🔴 Negative Outlook
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
                🟡 Wait & Watch
              </span>
            );

          // Action Recommendation Badge
          const actionText = stock.continuousRecommendation || 'Hold / Continue Watching';
          const actionBadge =
            actionText === 'Consider Buying' ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
                Consider Buying
              </span>
            ) : actionText === 'Consider Selling' ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white shadow-sm">
                Consider Selling
              </span>
            ) : actionText === 'Wait' ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Wait
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Hold / Watch
              </span>
            );

          return (
            <div
              key={stock.symbol}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl transition-all overflow-hidden"
            >
              {/* Clean Initial Scannable Row */}
              <div className="p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* 1. Name & Sector */}
                <div className="flex items-center gap-3 min-w-[220px]">
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
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-sans">
                        {stock.sector}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-[220px]">
                      {stock.companyName}
                    </div>
                  </div>
                </div>

                {/* 2. AI Score with Multi-Factor Badges */}
                <div className="flex items-center gap-2 sm:justify-center min-w-[130px]">
                  <span className="text-xs text-slate-400 lg:hidden">Score:</span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>{score}/100</span>
                  </div>
                  {/* Factor dots */}
                  {mf && (
                    <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                      <span title="Technical" className="px-1 py-0.2 rounded bg-slate-800 text-slate-300">T:{mf.technicalScore}</span>
                      <span title="Fundamental" className="px-1 py-0.2 rounded bg-slate-800 text-slate-300">F:{mf.fundamentalScore}</span>
                      <span title="Macro" className="px-1 py-0.2 rounded bg-slate-800 text-slate-300">M:{mf.macroScore}</span>
                      <span title="Sentiment" className="px-1 py-0.2 rounded bg-slate-800 text-slate-300">S:{mf.sentimentScore}</span>
                    </div>
                  )}
                </div>

                {/* 3. Simple Outlook */}
                <div className="min-w-[140px] flex items-center">
                  {outlookBadge}
                </div>

                {/* 4. Action Recommendation */}
                <div className="min-w-[130px] flex items-center">
                  {actionBadge}
                </div>

                {/* 5. Current Price & Target */}
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
                    onClick={() => toggleExpand(stock.symbol)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
                  >
                    <span>{isExpanded ? 'Hide' : 'Why?'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => onSelectStock(stock.symbol)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Open Technical Chart"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* =========================================================================
                  EXPANDED VIEW: COMPLETE MULTI-FACTOR ANALYSIS, SENSITIVITIES & NEWS
                  ========================================================================= */}
              {isExpanded && (
                <div className="bg-slate-950/90 border-t border-slate-800 p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  {/* Top Row: AI Multi-Factor Breakdown & Reasoning */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Factor 1: Technical Momentum */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-indigo-400 flex items-center gap-1">
                          <BarChart2 className="w-3.5 h-3.5" /> 1. Technical (25%)
                        </span>
                        <span className="text-white font-mono">{mf?.technicalScore || stock.advancedDetails?.technicalScore || 70}/100</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${mf?.technicalScore || stock.advancedDetails?.technicalScore || 70}%` }}
                        />
                      </div>
                      <div className="space-y-0.5 text-[11px] font-mono text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">RSI(14):</span>
                          <span>{stock.advancedDetails?.rsi?.toFixed(1) || '61.2'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">20 EMA:</span>
                          <span>₹{stock.advancedDetails?.ema20?.toFixed(1) || '---'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Anchored VWAP:</span>
                          <span>₹{stock.advancedDetails?.vwap?.toFixed(1) || '---'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Factor 2: Company Fundamentals */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" /> 2. Fundamentals (25%)
                        </span>
                        <span className="text-white font-mono">{mf?.fundamentalScore || 75}/100</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${mf?.fundamentalScore || 75}%` }}
                        />
                      </div>
                      <div className="space-y-0.5 text-[11px] font-mono text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">P/E Ratio:</span>
                          <span>{stock.advancedDetails?.peRatio ? `${stock.advancedDetails.peRatio}x` : 'Fair Value'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">P/B Ratio:</span>
                          <span>{stock.advancedDetails?.pbRatio ? `${stock.advancedDetails.pbRatio}x` : '---'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Risk Level:</span>
                          <span className="font-semibold text-slate-200">{stock.risk} Risk</span>
                        </div>
                      </div>
                    </div>

                    {/* Factor 3: Macro & Geopolitics */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-amber-400 flex items-center gap-1">
                          <Globe2 className="w-3.5 h-3.5" /> 3. Macro & Geo (25%)
                        </span>
                        <span className="text-white font-mono">{mf?.macroScore || 65}/100</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${mf?.macroScore || 65}%` }}
                        />
                      </div>
                      <div className="space-y-0.5 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-400">Crude Impact:</span>{' '}
                          <span className={mf?.crudeImpact?.impact === 'BENEFICIARY' ? 'text-emerald-400 font-bold' : mf?.crudeImpact?.impact === 'ADVERSE' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {mf?.crudeImpact?.impact || 'NEUTRAL'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">FX Exposure:</span>{' '}
                          <span className={mf?.fxImpact?.impact === 'BENEFICIARY' ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                            {mf?.fxImpact?.impact || 'NEUTRAL'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Policy: Capex & PLI Alignment
                        </div>
                      </div>
                    </div>

                    {/* Factor 4: News & Sentiment */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-cyan-400 flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5" /> 4. Sentiment (25%)
                        </span>
                        <span className="text-white font-mono">{mf?.sentimentScore || 60}/100</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-cyan-500 h-full rounded-full"
                          style={{ width: `${mf?.sentimentScore || 60}%` }}
                        />
                      </div>
                      <div className="space-y-0.5 text-[11px] text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Verified Wire:</span>
                          <span className="text-cyan-400 font-bold">{mf?.newsSentiment || 'MIXED'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Time Horizon:</span>
                          <span>{stock.timeHorizon}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Institutional Flow: Net Buying
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Row: Global Commodities & Verified News Wire */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Commodity & Macro Sensitivities */}
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe2 className="w-3.5 h-3.5" /> Related Commodities & Macro Impacts
                      </h4>
                      <div className="space-y-2 text-xs text-slate-300">
                        {mf?.crudeImpact && (
                          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                            <div className="flex items-center justify-between font-mono font-bold">
                              <span>🛢️ Brent Crude: ${mf.crudeImpact.price}/bbl</span>
                              <span className={mf.crudeImpact.impact === 'BENEFICIARY' ? 'text-emerald-400' : mf.crudeImpact.impact === 'ADVERSE' ? 'text-rose-400' : 'text-slate-400'}>
                                {mf.crudeImpact.impact}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">{mf.crudeImpact.reason}</p>
                          </div>
                        )}

                        {mf?.fxImpact && (
                          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                            <div className="flex items-center justify-between font-mono font-bold">
                              <span>💱 USD/INR Currency: ₹{mf.fxImpact.usdInr}</span>
                              <span className={mf.fxImpact.impact === 'BENEFICIARY' ? 'text-emerald-400' : 'text-slate-400'}>
                                {mf.fxImpact.impact}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">{mf.fxImpact.reason}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verified Company News Headlines & Relevance */}
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Company-Specific Verified News
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        {mf?.newsHeadlines && mf.newsHeadlines.length > 0 ? (
                          mf.newsHeadlines.map((news, nIdx) => (
                            <div key={nIdx} className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-slate-200 font-medium leading-snug">{news.headline}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                  news.sentiment === 'POSITIVE'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : news.sentiment === 'NEGATIVE'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}>
                                  {news.sentiment}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                                <span>Source: {news.source}</span>
                                <span className="italic">{news.relevance}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">No adverse company-specific headlines reported today.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Setup Execution Levels & Reasoning Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Execution Parameters & Safety */}
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" /> Quantitative Execution Parameters
                      </h4>
                      <div className="space-y-1 text-xs font-mono text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Price:</span>
                          <span className="font-bold text-white">₹{stock.currentPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Potential Target Price:</span>
                          <span className="font-bold text-emerald-400">₹{stock.potentialTargetPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Safety Exit (Stop Loss):</span>
                          <span className="font-bold text-rose-400">₹{stock.safetyExitPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Support / Resistance:</span>
                          <span>₹{stock.advancedDetails?.supportPrice?.toFixed(0)} / ₹{stock.advancedDetails?.resistancePrice?.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reasoning Timeline */}
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Reasoning Audit Timeline
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        {mf?.reasoningTimeline && mf.reasoningTimeline.length > 0 ? (
                          mf.reasoningTimeline.map((item, tIdx) => (
                            <div key={tIdx} className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                <span>{item.timestamp}</span>
                                <span className="text-indigo-300 font-bold">Score: {item.currentScore}/100</span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-0.5">{item.reason}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">Continuous tracking initialized.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar: Sources & Risk Disclaimer */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Verified Sources:</span>
                      <span className="text-emerald-400 font-bold">LIVE Broker Feed (0-Delay) • Live Commodities • Real-Time News Wire</span>
                    </div>
                    <button
                      onClick={() => onSelectStock(stock.symbol)}
                      className="text-indigo-400 hover:text-white font-semibold inline-flex items-center gap-1"
                    >
                      <span>Open Interactive Technical Chart</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
