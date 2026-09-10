import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface ExplainTermProps {
  term: string;
  explanation: string;
  children?: React.ReactNode;
  inline?: boolean;
}

export const ExplainTerm: React.FC<ExplainTermProps> = ({
  term,
  explanation,
  children,
  inline = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center group">
      {children ? (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="border-b border-dotted border-slate-400 dark:border-slate-500 cursor-help"
        >
          {children}
        </span>
      ) : (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-slate-700 dark:text-slate-300 font-medium cursor-help"
        >
          {term}
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="ml-1 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-0.5"
        title="Click to understand this term"
        aria-label={`Explain ${term}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {/* Tooltip on hover or click */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl z-50 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
        }`}
      >
        <div className="font-semibold text-amber-300 mb-1 flex items-center justify-between">
          <span>💡 {term}</span>
        </div>
        <p className="text-slate-200 leading-relaxed">{explanation}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </div>
    </span>
  );
};

export const COMMON_EXPLANATIONS: Record<string, string> = {
  'Positive Outlook': 'AI sees more reasons for the price to rise based on current market trends and buyer demand.',
  'Wait & Watch': 'AI does not see a clear direction yet. Buyers and sellers are evenly matched right now.',
  'Negative Outlook': 'AI sees more reasons for the price to fall as sellers are actively pushing the price down.',
  'May Go Up': 'Strong buyer support suggests the price has a higher probability of moving upward.',
  'May Go Down': 'Selling pressure suggests the price has a higher probability of moving downward.',
  'Unclear': 'The price is moving sideways. Best to wait for a clear trend before making a decision.',
  'AI Confidence': 'A score from 0 to 100 showing how strongly the historical and real-time patterns agree. Not a guarantee.',
  'Risk Level': 'How quickly or dramatically this stock can fluctuate. Low risk means steadier moves; High risk means sharp swings.',
  'GMP': 'Grey Market Premium: The estimated extra price traders are unofficially willing to pay before the stock lists.',
  'Lot Size': 'The fixed minimum number of shares you must purchase together in an IPO.',
  'Price Band': 'The official price range (e.g. ₹400 - ₹425) set by the company for accepting IPO bids.',
  'Minimum Investment': 'The exact rupee amount needed to apply for 1 single lot of this IPO.',
  'Subscription': 'How many times the total demand for shares exceeds what the company is offering.',
  'Safety Exit': 'A protective price level (stop-loss). If the stock falls below this, exiting protects your money from deeper losses.',
  'Target Price': 'A realistic price level where buyers may pause and take profits.',
};
