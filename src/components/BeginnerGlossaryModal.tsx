import React from 'react';
import { X, BookOpen, CheckCircle, HelpCircle, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface BeginnerGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGlossaryModal: React.FC<BeginnerGlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Beginner's Guide to ArthaPulse
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simple words for everything you see on this dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-700 dark:text-slate-300">
          {/* Section 1: The 3 Main AI Views */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              1. The Three AI Outlook Labels
            </h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl">
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <span>🟢 Positive Outlook</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                  AI sees more reasons for the price to rise. Buyer demand is strong, and company fundamentals or industry conditions look favorable.
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl">
                <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
                  <span>🟡 Wait & Watch</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                  AI doesn't see a clear direction yet. Buyers and sellers are evenly matched right now, or the market is waiting for upcoming quarterly results or news.
                </p>
              </div>

              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl">
                <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400">
                  <span>🔴 Negative Outlook</span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-300 mt-1">
                  AI sees more reasons for the price to fall. Sellers are active, or the sector is facing industry headwinds. Caution is advised.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: What Every Prediction Answers */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              2. The 3 Questions Every Prediction Answers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  Question 1
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs mb-1">
                  WHAT is happening?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Explains price action and whether buyers or sellers are in control today.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  Question 2
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs mb-1">
                  WHY does AI think so?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Clear business catalysts, earnings health, or market demand behind the move.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  Question 3
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs mb-1">
                  WHAT should you consider?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Simple guidance: Invest, Watch, Wait, or Avoid based on risk and probabilities.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: IPO Terms Made Simple */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              3. IPO Terms Made Simple
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-slate-100">Minimum Investment</span>
                <span className="text-slate-600 dark:text-slate-400 text-right">The exact cash needed to apply for 1 lot (e.g. ₹14,850).</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-slate-100">GMP (Grey Market Premium)</span>
                <span className="text-slate-600 dark:text-slate-400 text-right">Estimated extra profit per share traded before listing.</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-slate-100">Subscription Total (e.g. 4.2x)</span>
                <span className="text-slate-600 dark:text-slate-400 text-right">4.2 times more demand than shares available from the company.</span>
              </div>
            </div>
          </div>

          {/* Section 4: Golden Rule for Beginners */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <p className="font-bold mb-1">Important Safety Notice for Beginners</p>
              <p>
                AI predictions in ArthaPulse are based on mathematical probabilities and historical market data. They are NOT guaranteed outcomes. Never invest money you cannot afford to lose, and always check the risk level before making decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Got it, take me back
          </button>
        </div>
      </div>
    </div>
  );
};
