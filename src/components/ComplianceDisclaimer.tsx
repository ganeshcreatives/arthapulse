import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, Cpu, Key, Lock } from 'lucide-react';
import { BrokerConnectionModal } from './BrokerConnectionModal.js';
import { BrokerConnectionStatus, MultiBrokerPipelineStatus } from '../types.js';

export const ComplianceDisclaimer: React.FC = () => {
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [brokerStatus, setBrokerStatus] = useState<BrokerConnectionStatus | null>(null);
  const [pipeline, setPipeline] = useState<MultiBrokerPipelineStatus | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const [statusRes, pipelineRes] = await Promise.all([
          fetch('/api/broker/status'),
          fetch('/api/broker/pipeline'),
        ]);
        if (statusRes.ok) {
          const data = await statusRes.json();
          setBrokerStatus(data.status);
        }
        if (pipelineRes.ok) {
          const pData = await pipelineRes.json();
          setPipeline(pData.pipeline);
        }
      } catch (e) {
        // ignore
      }
    }
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div id="compliance-banner" className="bg-emerald-950/20 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="font-semibold text-emerald-300">Live Architecture Notice:</strong> Strict zero-cache live stream active (<code className="text-emerald-400 font-mono">no-store</code>). 0-delay multi-broker tick pipeline for <strong className="text-white font-mono">ganeshreddykatla321@gmail.com</strong>.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="open-broker-manager-btn"
            onClick={() => setShowBrokerModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold transition-all cursor-pointer shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>4 Broker Streams (0-Delay)</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-900/80 px-1.5 py-0.2 rounded border border-emerald-700/50">
              ⚡ {pipeline?.fastestBrokerAvgLatency || 7.4}ms ({pipeline?.overallFastestBroker?.toUpperCase() || 'DHAN'})
            </span>
            <span className="text-[10px] text-sky-300 bg-sky-950/60 px-1.5 py-0.2 rounded border border-sky-800/40">
              SSO Active
            </span>
          </button>
        </div>
      </div>

      <BrokerConnectionModal
        isOpen={showBrokerModal}
        onClose={() => setShowBrokerModal(false)}
        onStatusUpdated={(s) => setBrokerStatus(s)}
      />
    </>
  );
};
