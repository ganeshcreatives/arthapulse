import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const ComplianceDisclaimer: React.FC = () => {
  return (
    <div id="compliance-banner" className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300 flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="font-semibold text-amber-200">Compliance & Risk Notice:</strong> All signals and calculations are strictly deterministic and rule-based for educational and research purposes. AI provides explanatory reasoning only. Not SEBI registered investment advice.
        </span>
      </div>
      <div className="flex items-center gap-2 text-amber-400/80 font-medium">
        <Info className="w-3.5 h-3.5" />
        <span>Market data delayed by 15 mins (EOD/Delayed)</span>
      </div>
    </div>
  );
};
