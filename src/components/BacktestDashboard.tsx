import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Award,
  Zap,
  Percent,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { BacktestResult } from '../types.js';

export const BacktestDashboard: React.FC = () => {
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBacktest = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/backtest');
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Failed to run backtest:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBacktest();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <BarChart3 className="w-3.5 h-3.5" />
                Deterministic Quantitative Backtesting Engine
              </span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-medium">
                Tested on Real NSE Daily Bars
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Strategy Verification &amp; Historical Model Accuracy
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Continuous validation of quantitative rules against historical NSE price action.
              Every recommendation is backed by empirical statistical expectancy.
            </p>
          </div>

          <button
            onClick={() => fetchBacktest(true)}
            disabled={refreshing}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Testing...' : 'Run New Backtest'}</span>
          </button>
        </div>
      </div>

      {loading || !result ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-semibold">Simulating trade rules across historical NSE candles...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Win Rate
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {result.winRatePct}%
              </div>
              <span className="text-[10px] text-slate-500">Historical hits</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Profit Factor
              </span>
              <div className="text-2xl font-bold font-mono text-sky-400">
                {result.profitFactor}
              </div>
              <span className="text-[10px] text-slate-500">Gross Win / Loss</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Avg Gain / Win
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                +{result.avgGainPct}%
              </div>
              <span className="text-[10px] text-slate-500">Per winning setup</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Avg Loss / Stop
              </span>
              <div className="text-2xl font-bold font-mono text-rose-400">
                -{result.avgLossPct}%
              </div>
              <span className="text-[10px] text-slate-500">Protected by SL</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Max Drawdown
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400">
                {result.maxDrawdownPct}%
              </div>
              <span className="text-[10px] text-slate-500">Peak-to-trough</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Total Trades
              </span>
              <div className="text-2xl font-bold font-mono text-slate-100">
                {result.totalTrades}
              </div>
              <span className="text-[10px] text-slate-500">{result.samplePeriod}</span>
            </div>
          </div>

          {/* Strategy Rules & Feedback Loop Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Quantitative Rules</span>
              </h3>

              <div className="space-y-2 text-xs">
                {result.strategyRules.map((rule, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-slate-300 leading-relaxed">
                    <span className="font-bold text-sky-400 font-mono mr-1.5">0{idx + 1}.</span>
                    {rule}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Continuous Model Optimization &amp; Feedback Loop</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Predictions are probabilistic and calibrated against realized market volatility.
                  When market regime transitions from <strong>Expansion</strong> to <strong>Correction</strong>,
                  the algorithm dynamically tightens stop-losses and prioritizes high free-cash-flow large caps.
                </p>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <Award className="w-3.5 h-3.5" />
                    <span>Evidence-Based Integrity Guarantee</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    No recommendation is output unless it satisfies mathematical confluence across
                    technical trend alignment, valuation discipline, macro tailwinds, and news verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
