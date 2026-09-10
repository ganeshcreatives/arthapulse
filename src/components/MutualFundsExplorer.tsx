import React, { useState, useEffect } from 'react';
import {
  Layers,
  TrendingUp,
  Star,
  ShieldCheck,
  Calculator,
  RefreshCw,
  FileCheck,
  Percent,
  Coins,
  ChevronRight,
  Info
} from 'lucide-react';
import { MutualFundItem } from '../types.js';

export const MutualFundsExplorer: React.FC = () => {
  const [funds, setFunds] = useState<MutualFundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState<number>(10000);
  const [sipYears, setSipYears] = useState<number>(5);
  const [selectedFundForSip, setSelectedFundForSip] = useState<MutualFundItem | null>(null);

  const fetchFunds = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/mutual-funds');
      if (res.ok) {
        const data = await res.json();
        setFunds(data.funds || []);
        if (data.funds && data.funds.length > 0 && !selectedFundForSip) {
          setSelectedFundForSip(data.funds[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch mutual funds:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const filteredFunds = funds.filter((f) => {
    if (selectedCategory === 'ALL') return true;
    return f.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // SIP Calculator Math: M = P * ((1 + i)^n - 1) / i * (1 + i)
  const expectedRate = selectedFundForSip ? Math.max(8, selectedFundForSip.return3Y) / 100 : 0.15;
  const monthlyRate = expectedRate / 12;
  const totalMonths = sipYears * 12;
  const totalInvested = sipAmount * totalMonths;
  const futureValue =
    sipAmount *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);
  const estimatedReturns = Math.max(0, futureValue - totalInvested);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                AMFI Official Live Feeds
              </span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-medium">
                Real Daily NAV Feeds
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Indian Mutual Funds Intelligence & Direct Growth Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Real-time NAV data connected directly to the Association of Mutual Funds in India (AMFI).
              Evaluating CAGR performance, expense ratios, AUM, and portfolio suitability.
            </p>
          </div>

          <button
            onClick={() => fetchFunds(true)}
            disabled={refreshing}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Live NAVs'}</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 mr-1">Category:</span>
          {['ALL', 'Flexi Cap', 'Small Cap', 'Mid Cap', 'Large Cap', 'Hybrid', 'ELSS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Funds Grid & Interactive SIP Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Funds List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
              <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-300 font-semibold">Fetching live NAVs from AMFI API...</p>
            </div>
          ) : (
            filteredFunds.map((fund) => {
              const isSelected = selectedFundForSip?.schemeCode === fund.schemeCode;
              return (
                <div
                  key={fund.schemeCode}
                  onClick={() => setSelectedFundForSip(fund)}
                  className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 ring-1 ring-sky-500/50 shadow-lg'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {fund.category}
                        </span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: fund.ratingStars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Code: {fund.schemeCode}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                        {fund.schemeName}
                      </h3>
                      <p className="text-xs text-slate-400">{fund.fundHouse}</p>
                    </div>

                    <div className="text-left sm:text-right bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 sm:bg-transparent sm:p-0 sm:border-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Live NAV</span>
                      <div className="text-base font-bold font-mono text-emerald-400">
                        ₹{fund.nav.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Date: {fund.navDate}
                      </span>
                    </div>
                  </div>

                  {/* Returns & Fund Stats */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">1Y Return</span>
                      <span className={`font-bold ${fund.return1Y >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {fund.return1Y > 0 ? '+' : ''}{fund.return1Y}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">3Y CAGR</span>
                      <span className="font-bold text-emerald-400">
                        +{fund.return3Y}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">5Y CAGR</span>
                      <span className="font-bold text-emerald-400">
                        +{fund.return5Y}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Expense</span>
                      <span className="font-bold text-slate-200">
                        {fund.expenseRatio}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">AUM</span>
                      <span className="font-bold text-slate-200">
                        ₹{(fund.aumCr / 1000).toFixed(1)}k Cr
                      </span>
                    </div>
                  </div>

                  {/* Fund Suitability */}
                  <p className="mt-3 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                    <strong className="text-slate-300">Suitability: </strong>
                    {fund.suitability}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Col: Interactive SIP Calculator */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 sticky top-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Systematic Investment Plan (SIP) Calculator
              </h3>
            </div>

            {selectedFundForSip && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Selected Scheme</span>
                <div className="font-bold text-slate-100 truncate">{selectedFundForSip.schemeName}</div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  Using 3Y CAGR baseline: +{selectedFundForSip.return3Y}% p.a.
                </div>
              </div>
            )}

            {/* Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly Contribution:</span>
                <span className="font-bold text-white font-mono">
                  ₹{sipAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹1k</span>
                <span>₹50k</span>
                <span>₹100k</span>
              </div>
            </div>

            {/* Years Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Investment Horizon:</span>
                <span className="font-bold text-white font-mono">
                  {sipYears} {sipYears === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Year</span>
                <span>7 Years</span>
                <span>15 Years</span>
              </div>
            </div>

            {/* Projected Outputs */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Total Invested</span>
                <span className="font-bold text-slate-200">
                  ₹{Math.round(totalInvested).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Estimated Returns</span>
                <span className="font-bold text-emerald-400">
                  +₹{Math.round(estimatedReturns).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                <span className="font-bold text-white font-sans">Projected Maturity</span>
                <span className="font-bold text-sky-400">
                  ₹{Math.round(futureValue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              *Projections are computed using historical compounding returns from AMFI data for educational illustration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
