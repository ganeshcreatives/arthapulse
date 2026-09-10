import React, { useState, useEffect } from 'react';
import {
  Globe2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  Flame,
  Droplets,
  DollarSign,
  Landmark,
  Layers,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Cpu,
  Train,
  HeartPulse
} from 'lucide-react';
import { MacroIndicator, GeopoliticalEvent } from '../types.js';

export const MacroGeopoliticsMonitor: React.FC = () => {
  const [indicators, setIndicators] = useState<MacroIndicator[]>([]);
  const [events, setEvents] = useState<GeopoliticalEvent[]>([]);
  const [threatLevel, setThreatLevel] = useState<'HIGH' | 'ELEVATED' | 'MODERATE' | 'LOW'>('MODERATE');
  const [sentimentScore, setSentimentScore] = useState<number>(50);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/macro/geopolitical');
      if (res.ok) {
        const data = await res.json();
        setIndicators(data.indicators || []);
        setEvents(data.events || []);
        setThreatLevel(data.threatLevel || 'MODERATE');
        setSentimentScore(data.macroSentimentScore || 50);
      }
    } catch (err) {
      console.error('Failed to fetch macro and geopolitical data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((e) => {
    if (activeCategory === 'ALL') return true;
    return e.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Globe2 className="w-3.5 h-3.5" />
                Global Macro & Geopolitical Radar
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  threatLevel === 'HIGH'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : threatLevel === 'ELEVATED'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                Threat Barometer: {threatLevel}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Macro Catalysts, Geopolitical Conflicts & Policy Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Monitors crude oil, gold, USD/INR, US yields, Russia-Ukraine, Middle East shipping, Trump tariffs,
              RBI monetary stance, and natural supply chain disruptions.
            </p>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Radar'}</span>
          </button>
        </div>
      </div>

      {/* Global Macro Indicators Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Core Macro Indicators (Live Pricing)</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
              Real Feeds
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {indicators.map((ind) => {
            const isPos = ind.changePercent >= 0;
            return (
              <div
                key={ind.symbol}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-2 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      {ind.category}
                    </span>
                    <span className="font-bold text-slate-100 text-sm">{ind.name}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      ind.status === 'BULLISH'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : ind.status === 'BEARISH'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {ind.status} FOR INDIA
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 font-mono">
                  <span className="text-lg font-bold text-white">
                    {ind.category === 'Currency' ? '₹' : ind.category === 'Commodity' && !ind.name.includes('Gold') ? '$' : ''}
                    {ind.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>

                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? '+' : ''}{ind.changePercent.toFixed(2)}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                  {ind.marketImpact}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Sectors Alignment Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-sky-400" />
          <span>Strategic Sectors Alignment Matrix</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-400">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Defence & Aerospace</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Heightened geopolitical friction (Russia-Ukraine, Red Sea, Taiwan Strait) accelerates domestic defence procurement for <strong>HAL, BEL, Mazagon Dock</strong>.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Train className="w-3.5 h-3.5 text-emerald-400" />
              <span>Railways & Infrastructure</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Insulated from international wars; driven by Indian domestic capex outlay for <strong>RVNL, IRFC, L&amp;T</strong> with multi-year order books.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Semiconductors & AI</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Beneficiary of US-China chip export controls and India Semiconductor Mission (ISM) subsidies for <strong>Dixon Technologies &amp; Kaynes</strong>.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>Pharma & Healthcare</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Defensive safe-haven during macro volatility with currency tailwinds from USD/INR depreciation for <strong>Sun Pharma, Cipla</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Geopolitical & Policy Live Wire Feeds */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Verified Geopolitical & Policy Intelligence Streams</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
              Live Wire
            </span>
          </h2>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'War', 'Tariff', 'Policy', 'Disaster'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {cat === 'ALL' ? 'All Intelligence' : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
            No active events in this intelligence category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                    {evt.category}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      evt.threatLevel === 'HIGH'
                        ? 'text-rose-400'
                        : evt.threatLevel === 'ELEVATED'
                        ? 'text-amber-400'
                        : 'text-sky-400'
                    }`}
                  >
                    Threat: {evt.threatLevel}
                  </span>
                </div>

                <h4 className="font-semibold text-slate-100 text-sm leading-snug">
                  {evt.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {evt.summary}
                </p>

                <div className="border-t border-slate-800 pt-2 flex flex-col gap-1 text-[11px]">
                  <div className="text-slate-300">
                    <span className="text-slate-500 font-medium">Market Implication: </span>
                    {evt.marketImplication}
                  </div>
                  <div className="text-slate-500 text-[10px] flex items-center justify-between pt-0.5">
                    <span>Source: {evt.source}</span>
                    <span>{new Date(evt.publishedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
