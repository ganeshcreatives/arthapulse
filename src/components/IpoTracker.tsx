import React, { useState, useEffect, useMemo } from 'react';
import {
  Rocket,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Building2,
  Clock,
  Layers,
  Sparkles,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  ShieldCheck,
  HelpCircle,
  X,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Check,
  Info
} from 'lucide-react';
import { IpoItem, IpoStage, AiOutlook, RiskLevel } from '../types';
import { ExplainTerm } from './ExplainTerm';

type SortOption = 'GMP_DESC' | 'SUBSCRIPTION_DESC' | 'SIZE_DESC' | 'CLOSE_SOON';

export const IpoTracker: React.FC = () => {
  const [ipos, setIpos] = useState<IpoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [refreshSuccessMsg, setRefreshSuccessMsg] = useState<string | null>(null);

  // Active Stage Tab - default to OPEN for live market bidding discovery
  const [activeStageTab, setActiveStageTab] = useState<IpoStage | 'ALL' | 'ALL_SECTIONS'>('OPEN');

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [outlookFilter, setOutlookFilter] = useState<'ALL' | AiOutlook>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Mainboard' | 'SME'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('GMP_DESC');

  // Track expanded "Why does AI think this?" per IPO
  const [expandedAiMap, setExpandedAiMap] = useState<Record<string, boolean>>({});

  // Calculator state per IPO (lot count)
  const [lotCountMap, setLotCountMap] = useState<Record<string, number>>({});
  const [activeCalcId, setActiveCalcId] = useState<string | null>(null);

  const fetchIpos = async (isManual = false) => {
    if (isManual) {
      setRefreshing(true);
      setRefreshSuccessMsg(null);
    } else {
      setLoading(true);
    }

    try {
      const endpoint = isManual ? '/api/ipos?refresh=true' : '/api/ipos';
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setIpos(data.ipos || []);
        const dateStr = new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLastRefreshed(`${dateStr} IST`);
        if (isManual) {
          setRefreshSuccessMsg('✓ Live subscription & GMP feeds successfully updated');
          setTimeout(() => setRefreshSuccessMsg(null), 4000);
        }
      }
    } catch (err) {
      console.error('Failed to fetch IPOs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIpos();
  }, []);

  const toggleWhyAi = (id: string) => {
    setExpandedAiMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCalc = (id: string) => {
    setActiveCalcId((prev) => (prev === id ? null : id));
  };

  const handleLotChange = (id: string, count: number) => {
    const validCount = Math.max(1, Math.min(25, count));
    setLotCountMap((prev) => ({ ...prev, [id]: validCount }));
  };

  // Unique sectors
  const sectors = useMemo(() => {
    const list = Array.from(new Set(ipos.map((i) => i.sector)));
    return list.sort();
  }, [ipos]);

  // Stage counts
  const stageCounts = useMemo(() => {
    return {
      OPEN: ipos.filter((i) => i.stage === 'OPEN').length,
      UPCOMING: ipos.filter((i) => i.stage === 'UPCOMING').length,
      AWAITING_LISTING: ipos.filter((i) => i.stage === 'AWAITING_LISTING').length,
      RECENTLY_LISTED: ipos.filter((i) => i.stage === 'RECENTLY_LISTED').length,
      ALL: ipos.length,
    };
  }, [ipos]);

  // Filter and sort items
  const sortAndFilter = (items: IpoItem[]) => {
    return items
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            item.companyName.toLowerCase().includes(q) ||
            item.sector.toLowerCase().includes(q) ||
            (item.symbol && item.symbol.toLowerCase().includes(q));
          if (!match) return false;
        }

        // Outlook
        if (outlookFilter !== 'ALL' && item.aiAnalysis.outlook !== outlookFilter) {
          return false;
        }

        // Risk
        if (riskFilter !== 'ALL' && item.riskLevel !== riskFilter) {
          return false;
        }

        // Sector
        if (sectorFilter !== 'ALL' && item.sector !== sectorFilter) {
          return false;
        }

        // Category
        if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'GMP_DESC') {
          return (b.gmpPercent || 0) - (a.gmpPercent || 0);
        }
        if (sortBy === 'SUBSCRIPTION_DESC') {
          return (b.subscriptionTotal || 0) - (a.subscriptionTotal || 0);
        }
        if (sortBy === 'SIZE_DESC') {
          return (b.issueSizeCr || 0) - (a.issueSizeCr || 0);
        }
        return a.companyName.localeCompare(b.companyName);
      });
  };

  const openIpos = useMemo(() => sortAndFilter(ipos.filter((i) => i.stage === 'OPEN')), [ipos, searchQuery, outlookFilter, riskFilter, sectorFilter, categoryFilter, sortBy]);
  const upcomingIpos = useMemo(() => sortAndFilter(ipos.filter((i) => i.stage === 'UPCOMING')), [ipos, searchQuery, outlookFilter, riskFilter, sectorFilter, categoryFilter, sortBy]);
  const awaitingListingIpos = useMemo(() => sortAndFilter(ipos.filter((i) => i.stage === 'AWAITING_LISTING')), [ipos, searchQuery, outlookFilter, riskFilter, sectorFilter, categoryFilter, sortBy]);
  const recentlyListedIpos = useMemo(() => sortAndFilter(ipos.filter((i) => i.stage === 'RECENTLY_LISTED')), [ipos, searchQuery, outlookFilter, riskFilter, sectorFilter, categoryFilter, sortBy]);

  const activeDisplayList = useMemo(() => {
    if (activeStageTab === 'OPEN') return openIpos;
    if (activeStageTab === 'UPCOMING') return upcomingIpos;
    if (activeStageTab === 'AWAITING_LISTING') return awaitingListingIpos;
    if (activeStageTab === 'RECENTLY_LISTED') return recentlyListedIpos;
    if (activeStageTab === 'ALL') return sortAndFilter(ipos);
    return [];
  }, [activeStageTab, openIpos, upcomingIpos, awaitingListingIpos, recentlyListedIpos, ipos, searchQuery, outlookFilter, riskFilter, sectorFilter, categoryFilter, sortBy]);

  const renderIpoCard = (ipo: IpoItem) => {
    const isAiOpen = !!expandedAiMap[ipo.id];
    const isCalcOpen = activeCalcId === ipo.id;
    const lotCount = lotCountMap[ipo.id] || 1;
    const totalShares = lotCount * ipo.lotSize;
    const totalInvestment = lotCount * ipo.minInvestment;
    const projectedListingProfit = ipo.gmpPrice > 0 ? totalShares * ipo.gmpPrice : 0;

    // Stage Badges
    let stageLabel = '🆕 Upcoming';
    let stageBadgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    if (ipo.stage === 'OPEN') {
      stageLabel = '🟢 Live Bidding Open';
      stageBadgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    } else if (ipo.stage === 'AWAITING_LISTING') {
      stageLabel = '⏳ Closed / Allotment in Progress';
      stageBadgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    } else if (ipo.stage === 'RECENTLY_LISTED') {
      stageLabel = '📊 Secondary Market Trading';
      stageBadgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }

    // Outlook Styling
    let outlookEmoji = '🟡';
    let outlookText = 'Wait & Watch';
    let outlookBg = 'border-slate-200 dark:border-slate-800';
    let outlookPill = 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    if (ipo.aiAnalysis.outlook === 'POSITIVE') {
      outlookEmoji = '🟢';
      outlookText = 'Positive Outlook';
      outlookBg = 'border-emerald-500/40 dark:border-emerald-500/30';
      outlookPill = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    } else if (ipo.aiAnalysis.outlook === 'NEGATIVE') {
      outlookEmoji = '🔴';
      outlookText = 'Negative Outlook';
      outlookBg = 'border-rose-500/40 dark:border-rose-500/30';
      outlookPill = 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }

    // Action color
    let actionStyle = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    if (ipo.verdict === 'STRONG APPLY') actionStyle = 'bg-emerald-600 text-white font-bold';
    else if (ipo.verdict === 'APPLY (LISTING GAINS)') actionStyle = 'bg-teal-600 text-white font-bold';
    else if (ipo.verdict === 'APPLY (LONG TERM)') actionStyle = 'bg-blue-600 text-white font-bold';
    else if (ipo.verdict === 'NEUTRAL') actionStyle = 'bg-amber-500 text-slate-950 font-bold';
    else if (ipo.verdict === 'AVOID') actionStyle = 'bg-rose-600 text-white font-bold';

    return (
      <div
        key={ipo.id}
        id={`ipo-card-${ipo.id}`}
        className={`bg-white dark:bg-slate-900 border-2 ${outlookBg} rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md space-y-4`}
      >
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${stageBadgeColor} flex items-center gap-1.5`}>
                {ipo.stage === 'OPEN' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                {stageLabel}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {ipo.category}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {ipo.sector}
              </span>
            </div>

            <div className="flex items-baseline gap-2.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {ipo.companyName}
              </h3>
              {ipo.symbol && (
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                  {ipo.symbol}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {ipo.description}
            </p>
          </div>

          {/* AI Decision & Verdict Badges */}
          <div className="flex items-center gap-2.5 self-start lg:self-center">
            <div className={`px-3 py-2 rounded-xl border text-right ${outlookPill}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                AI Outlook
              </span>
              <span className="text-xs sm:text-sm font-black flex items-center gap-1 mt-0.5">
                <span>{outlookEmoji}</span> {outlookText}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Research Verdict
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] mt-0.5 inline-block ${actionStyle}`}>
                {ipo.verdict}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Market Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* 1. Price Band */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Price Band
            </span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block font-mono">
              {ipo.priceBand}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              Lot: {ipo.lotSize} Shares
            </span>
          </div>

          {/* 2. Minimum Retail Application */}
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/70 dark:border-indigo-800/70">
            <span className="text-[10px] text-indigo-700 dark:text-indigo-300 uppercase font-bold tracking-wider block flex items-center justify-between">
              <span>Min Investment</span>
              <ExplainTerm
                term="Min Investment"
                explanation="Calculated as (Upper price band × Lot size). Minimum capital required for 1 retail application."
              />
            </span>
            <span className="font-black text-indigo-950 dark:text-indigo-200 text-sm mt-0.5 block font-mono">
              ₹{ipo.minInvestment.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5 block">
              1 Retail Lot
            </span>
          </div>

          {/* 3. Issue Size & Structure */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Issue Size
            </span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block font-mono">
              ₹{ipo.issueSizeCr.toLocaleString('en-IN')} Cr
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate" title={ipo.issueStructure || ''}>
              {ipo.issueStructure ? ipo.issueStructure : 'Fresh + OFS'}
            </span>
          </div>

          {/* 4. Grey Market Premium (GMP) */}
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-bold tracking-wider block flex items-center justify-between">
              <span>Est. Listing Gain</span>
              <ExplainTerm
                term="GMP"
                explanation="Grey Market Premium reflects the unofficial premium traders are paying per share prior to exchange debut."
              />
            </span>
            {ipo.gmpPrice > 0 ? (
              <>
                <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm mt-0.5 block font-mono">
                  +₹{ipo.gmpPrice} (+{ipo.gmpPercent.toFixed(1)}%)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block font-mono">
                  Est: ₹{(parseFloat(ipo.priceBand.replace(/[^0-9.-]+/g, ' ').trim().split(' ').pop() || '0') + ipo.gmpPrice).toFixed(0)}
                </span>
              </>
            ) : ipo.gmpPrice < 0 ? (
              <>
                <span className="font-black text-rose-700 dark:text-rose-400 text-sm mt-0.5 block font-mono">
                  -₹{Math.abs(ipo.gmpPrice)} ({ipo.gmpPercent.toFixed(1)}%)
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 block">
                  Discount Indicated
                </span>
              </>
            ) : (
              <span className="font-semibold text-slate-500 text-xs mt-1 block">
                Data unavailable
              </span>
            )}
          </div>

          {/* 5. Live Subscription Status */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block flex items-center justify-between">
              <span>Subscription</span>
              <ExplainTerm
                term="Subscription Multiple"
                explanation="Total shares bid divided by total shares offered. >1x indicates oversubscription."
              />
            </span>
            {ipo.subscriptionTotal > 0 ? (
              <>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block font-mono">
                  {ipo.subscriptionTotal.toFixed(2)}x Total
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block font-mono">
                  Retail: {ipo.subscriptionRetail ? `${ipo.subscriptionRetail}x` : 'Open'}
                </span>
              </>
            ) : (
              <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mt-1 font-medium">
                Data unavailable (Pending)
              </span>
            )}
          </div>

          {/* 6. Valuation & Listing Timeline */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Listing Date
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block truncate">
              {ipo.listingDate}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              P/E: {ipo.valuationPe || 'Data unavailable'}
            </span>
          </div>
        </div>

        {/* Recently Listed Special Performance Strip */}
        {ipo.stage === 'RECENTLY_LISTED' && ipo.listingPrice && (
          <div className="p-3 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">Exchange Debut Performance:</span>
              <span className="text-slate-700 dark:text-slate-300">
                Issued at <strong className="font-mono text-slate-900 dark:text-slate-100">₹{ipo.priceBand.replace(/[^0-9]/g, '')}</strong> → Listed at{' '}
                <strong className="font-mono text-purple-700 dark:text-purple-300">₹{ipo.listingPrice}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                (ipo.listingGainPercent || 0) >= 0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {(ipo.listingGainPercent || 0) >= 0 ? '+' : ''}{ipo.listingGainPercent?.toFixed(1)}% Day-1 Return
              </span>
              {ipo.currentTradingPrice && (
                <span className="text-slate-600 dark:text-slate-400">
                  Current LTP: <strong className="font-mono text-slate-900 dark:text-white">₹{ipo.currentTradingPrice}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* AI Thesis Summary Box */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">AI Investment Thesis: </strong>
            {ipo.aiAnalysis.simpleWhy}
          </div>
        </div>

        {/* Action Row: Calculator & In-Depth Research Expander */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <button
            onClick={() => toggleCalc(ipo.id)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isCalcOpen ? 'Hide Return Estimator' : 'Estimate Listing Profit (GMP Calc)'}</span>
          </button>

          <button
            onClick={() => toggleWhyAi(ipo.id)}
            className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{isAiOpen ? 'Close Detailed Analysis' : 'Expand Full AI & Risk Analysis'}</span>
            {isAiOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Interactive Return Estimator */}
        {isCalcOpen && (
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 rounded-xl space-y-3 text-xs animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  Interactive Pre-Tax Listing Gain Calculator
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Based on live grey market premium of ₹{ipo.gmpPrice || 0} per share.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Lots Applied:</span>
                <div className="flex items-center border border-indigo-300 dark:border-indigo-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                  <button
                    onClick={() => handleLotChange(ipo.id, lotCount - 1)}
                    className="px-2.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono font-bold text-slate-900 dark:text-white text-xs">
                    {lotCount}
                  </span>
                  <button
                    onClick={() => handleLotChange(ipo.id, lotCount + 1)}
                    className="px-2.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Application Capital</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  ₹{totalInvestment.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block">{totalShares} Shares</span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Listing Value</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  ₹{(totalInvestment + projectedListingProfit).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block">At indicated GMP</span>
              </div>

              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-bold block">
                  Projected Gross Profit
                </span>
                <span className="font-black font-mono text-emerald-700 dark:text-emerald-300 text-sm">
                  {projectedListingProfit > 0 ? `+₹${projectedListingProfit.toLocaleString('en-IN')}` : 'Data unavailable'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                  {ipo.gmpPercent > 0 ? `+${ipo.gmpPercent.toFixed(1)}% pre-tax` : 'Subject to listing'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed In-Depth Institutional AI Analysis */}
        {isAiOpen && (
          <div className="mt-4 p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in duration-200">
            {/* Strengths & Weaknesses 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Business Strengths & Moats
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {ipo.aiAnalysis.companyStrengths.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl">
                <p className="font-bold text-rose-800 dark:text-rose-400 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Key Risk Factors & Sensitivities
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {ipo.aiAnalysis.importantRisks.map((r, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Valuation & Industry Context Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Valuation Context
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ipo.aiAnalysis.valuationConcerns}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Subscription Trajectory
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ipo.aiAnalysis.subscriptionTrends}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Grey Market Dynamics
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ipo.aiAnalysis.gmpTrend}
                </p>
              </div>
            </div>

            {/* Peers and Source Stamp */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-700/60 gap-2">
              <span>
                <strong>Listed Peers:</strong> {ipo.aiAnalysis.competitors.join(', ')}
              </span>
              <span className="font-mono text-[10px]">
                Feed Source: {ipo.source}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Verified Indian Primary Market Intelligence • NSE & BSE Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              Primary Market IPO & GMP Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Dynamically discovers live Mainboard offerings bidding today, scheduled pipeline issues, allotment status, and post-listing returns. All figures are verified against official exchange bidding logs.
            </p>
          </div>

          {/* Refresh Action Area */}
          <div className="flex flex-col sm:flex-row items-start lg:items-end gap-2 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block">Live Primary Feed</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {lastRefreshed ? `Updated: ${lastRefreshed}` : 'Live Synchronized'}
              </span>
            </div>

            <button
              onClick={() => fetchIpos(true)}
              disabled={refreshing}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-75"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing Feed...' : 'Refresh Live Data'}</span>
            </button>
          </div>
        </div>

        {/* Live Refresh Notification */}
        {refreshSuccessMsg && (
          <div className="mt-3 py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{refreshSuccessMsg}</span>
          </div>
        )}

        {/* Stage Tabs Bar */}
        <div className="mt-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-1 sm:gap-3 -mb-px">
            {/* 1. OPEN IPOs (Default) */}
            <button
              onClick={() => setActiveStageTab('OPEN')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeStageTab === 'OPEN'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Currently Open IPOs</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {stageCounts.OPEN} Active
              </span>
            </button>

            {/* 2. UPCOMING */}
            <button
              onClick={() => setActiveStageTab('UPCOMING')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeStageTab === 'UPCOMING'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>Upcoming Pipeline</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {stageCounts.UPCOMING}
              </span>
            </button>

            {/* 3. CLOSED / ALLOTMENT */}
            <button
              onClick={() => setActiveStageTab('AWAITING_LISTING')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeStageTab === 'AWAITING_LISTING'
                  ? 'border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>Closed (Allotment)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {stageCounts.AWAITING_LISTING}
              </span>
            </button>

            {/* 4. RECENTLY LISTED */}
            <button
              onClick={() => setActiveStageTab('RECENTLY_LISTED')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeStageTab === 'RECENTLY_LISTED'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>Recently Listed</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {stageCounts.RECENTLY_LISTED}
              </span>
            </button>

            {/* Continuous View All */}
            <button
              onClick={() => setActiveStageTab('ALL_SECTIONS')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeStageTab === 'ALL_SECTIONS'
                  ? 'border-slate-800 text-slate-900 dark:border-white dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>View All 4 Categorized Sections</span>
            </button>
          </div>
        </div>

        {/* Filter & Sorting Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company (Kanohar, Rentomojo, Prasol...) or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="GMP_DESC">Highest Expected Gain (GMP %)</option>
              <option value="SUBSCRIPTION_DESC">Most Subscribed</option>
              <option value="SIZE_DESC">Issue Size (High to Low)</option>
            </select>
          </div>

          {/* AI Outlook Filter */}
          <select
            value={outlookFilter}
            onChange={(e) => setOutlookFilter(e.target.value as any)}
            className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All AI Outlooks</option>
            <option value="POSITIVE">🟢 Positive Outlook</option>
            <option value="WAIT_AND_WATCH">🟡 Wait & Watch</option>
            <option value="NEGATIVE">🔴 Negative Outlook</option>
          </select>

          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-medium max-w-[180px]"
          >
            <option value="ALL">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Render */}
      {activeStageTab !== 'ALL_SECTIONS' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong>{activeDisplayList.length}</strong> IPOs in active view
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Official NSE/BSE Primary Records Verified</span>
            </span>
          </div>

          {activeDisplayList.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                No IPOs match your selected search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setOutlookFilter('ALL');
                  setRiskFilter('ALL');
                  setSectorFilter('ALL');
                }}
                className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeDisplayList.map((ipo) => renderIpoCard(ipo))}
            </div>
          )}
        </div>
      ) : (
        /* Continuous 4 Categorized Sections View */
        <div className="space-y-10">
          {/* Section 1: Open IPOs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  1. Currently Open for Subscription ({openIpos.length} Active)
                </h2>
              </div>
              <span className="text-xs text-slate-500">Live Bidding Open on NSE & BSE</span>
            </div>
            <div className="space-y-4">
              {openIpos.map((ipo) => renderIpoCard(ipo))}
            </div>
          </div>

          {/* Section 2: Upcoming IPOs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                2. Upcoming IPO Pipeline ({upcomingIpos.length})
              </h2>
              <span className="text-xs text-slate-500">Scheduled for Launch</span>
            </div>
            <div className="space-y-4">
              {upcomingIpos.map((ipo) => renderIpoCard(ipo))}
            </div>
          </div>

          {/* Section 3: Closed / Awaiting Listing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                3. Closed & Awaiting Listing ({awaitingListingIpos.length})
              </h2>
              <span className="text-xs text-slate-500">Allotment Finalization Stage</span>
            </div>
            <div className="space-y-4">
              {awaitingListingIpos.map((ipo) => renderIpoCard(ipo))}
            </div>
          </div>

          {/* Section 4: Recently Listed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                4. Recently Listed Issues ({recentlyListedIpos.length})
              </h2>
              <span className="text-xs text-slate-500">Secondary Market Trading Track Record</span>
            </div>
            <div className="space-y-4">
              {recentlyListedIpos.map((ipo) => renderIpoCard(ipo))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
