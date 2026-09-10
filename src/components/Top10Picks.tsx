import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  BarChart3,
  Globe2,
  Zap,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { Top10Recommendation } from '../types.js';

interface Top10PicksProps {
  onSelectStock: (symbol: string) => void;
  onOpenTelegramModal?: (signal: any) => void;
}

export const Top10Picks: React.FC<Top10PicksProps> = ({ onSelectStock, onOpenTelegramModal }) => {
  const [picks, setPicks] = useState<Top10Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('ALL');
  const [expandedRank, setExpandedRank] = useState<number | null>(1); // Expand #1 by default

  const fetchTop10 = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/top10');
      if (res.ok) {
        const data = await res.json();
        setPicks(data.recommendations || []);
        setLastUpdated(data.timestamp || new Date().toISOString());
      }
    } catch (err) {
      console.error('Failed to fetch Top 10:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTop10();
    const interval = setInterval(() => fetchTop10(), 60000); // 1-minute live refresh
    return () => clearInterval(interval);
  }, []);

  const filteredPicks = picks.filter((p) => {
    const matchSector =
      selectedSector === 'ALL' ||
      p.sector.toLowerCase().includes(selectedSector.toLowerCase()) ||
      (selectedSector === 'Strategic' && (
        p.sector.includes('Defence') ||
        p.sector.includes('Railways') ||
        p.sector.includes('Energy') ||
        p.sector.includes('Semiconductors') ||
        p.sector.includes('Pharma')
      ));

    const matchHorizon =
      selectedHorizon === 'ALL' ||
      p.timeHorizon.toLowerCase().includes(selectedHorizon.toLowerCase());

    return matchSector && matchHorizon;
  });

  return (
    <div className="space-y-6">
      {/* Platform Header & Live Verification Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Multi-Factor Quant Pipeline
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                <FileCheck className="w-3.5 h-3.5 text-sky-400" />
                Zero Mock Data • 100% Verified Real Feeds
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Fresh Top 10 Indian Stock Recommendations</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Screened across technical indicators (RSI, MACD, 20 EMA, VWAP), fundamental health (PE, ROE, debt),
              macro catalysts (crude, USD/INR, US yields), and real-time geopolitical intelligence (defence spending, US tariffs, capex).
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Last live calculation:</span>
              </div>
              <div className="text-xs font-mono font-semibold text-slate-200">
                {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST' : 'Live Syncing...'}
              </div>
            </div>

            <button
              id="refresh-top10-btn"
              onClick={() => fetchTop10(true)}
              disabled={refreshing}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Scanning...' : 'Re-Scan Universe'}</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-slate-400 mr-1">Sector Focus:</span>
            {['ALL', 'Strategic', 'Defence', 'Railways', 'Energy', 'Semiconductors', 'Pharma', 'Banking'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedSector === sec
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {sec === 'Strategic' ? '⚡ Strategic Sectors' : sec}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400 mr-1">Horizon:</span>
            {['ALL', 'Intraday', 'Swing', 'Medium-Term'].map((hz) => (
              <button
                key={hz}
                onClick={() => setSelectedHorizon(hz)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedHorizon === hz
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {hz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-200">Evaluating 30+ NSE Equities Through Multi-Factor Engine...</p>
          <p className="text-xs text-slate-500">Processing real-time OHLCV candles, technical indicators, and geopolitical news feeds.</p>
        </div>
      ) : filteredPicks.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 text-sm">
          No recommendations match the selected sector and horizon filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPicks.map((pick) => {
            const isExpanded = expandedRank === pick.rank;
            const isStrongBuy = pick.action === 'STRONG BUY';
            const isBuy = pick.action === 'BUY';

            return (
              <div
                key={pick.symbol}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all shadow-md hover:shadow-xl"
              >
                {/* Main Card Header Bar */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Rank, Symbol, Action */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-slate-200 font-mono flex-shrink-0">
                      #{pick.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onSelectStock(pick.symbol)}
                          className="font-bold text-base sm:text-lg text-white font-mono hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{pick.symbol}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1 ${
                            isStrongBuy || isBuy
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          <span>{isStrongBuy || isBuy ? '🟢' : '🟡'}</span>
                          <span>{isStrongBuy || isBuy ? 'Positive Outlook' : 'Wait & Watch'}</span>
                        </span>

                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 font-medium">
                          {pick.timeHorizon}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span className="truncate max-w-[200px]">{pick.name}</span>
                        <span>•</span>
                        <span className="text-sky-400/90 font-medium">{pick.sector}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Price, Target, Safety Exit */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Current Price</span>
                      <span className="font-bold text-slate-100 text-sm">
                        ₹{pick.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Potential Target</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        ₹{pick.target1.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Safety Exit Level</span>
                      <span className="font-bold text-rose-400 text-sm">
                        ₹{pick.stopLoss.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Upside / Downside</span>
                      <span className="font-bold text-sky-400 text-sm">
                        1 : {pick.riskRewardRatio}
                      </span>
                    </div>
                  </div>

                  {/* Right: Confidence Score & Expand Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</div>
                      <div className="text-base font-bold font-mono text-emerald-400">
                        {pick.confidenceScore}%
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectStock(pick.symbol)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Chart
                      </button>

                      <button
                        onClick={() => setExpandedRank(isExpanded ? null : pick.rank)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Bar */}
                <div className="bg-slate-950/40 px-4 sm:px-6 py-2.5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Technical Score</span>
                      <span className="font-mono text-slate-200">{pick.technicalScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: `${pick.technicalScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Fundamental Health</span>
                      <span className="font-mono text-slate-200">{pick.fundamentalScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pick.fundamentalScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Macro/Geopolitical</span>
                      <span className="font-mono text-slate-200">{pick.macroGeopoliticalScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pick.macroGeopoliticalScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Sentiment & Flow</span>
                      <span className="font-mono text-slate-200">{pick.sentimentScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pick.sentimentScore}%` }} />
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Evidence Breakdown */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Probabilistic Evidence Breakdown & Invalidation Model</span>
                      </h4>

                      <div className="text-[11px] text-slate-400 font-mono">
                        Source: {pick.dataSource}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                      {/* Technical Evidence */}
                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-sky-400">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>Technical Factor Justification</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{pick.evidenceFactors.technical}</p>
                      </div>

                      {/* Fundamental Health */}
                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fundamental Health & Valuation</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{pick.evidenceFactors.fundamental}</p>
                      </div>

                      {/* Macro & Geopolitical Catalyst */}
                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                          <Globe2 className="w-3.5 h-3.5" />
                          <span>Macro & Geopolitical Catalyst</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{pick.evidenceFactors.macroGeopolitical}</p>
                      </div>

                      {/* Specific Catalyst */}
                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-purple-400">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Corporate Catalyst & Orderbook</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{pick.evidenceFactors.catalyst}</p>
                      </div>
                    </div>

                    {/* Invalidation Trigger Box */}
                    <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl flex items-start gap-2.5 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-rose-300 block">Strict Risk Invalidation Rule</span>
                        <span className="text-slate-300">{pick.evidenceFactors.invalidation}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
