import React from 'react';

interface ArthaPulseLogoProps {
  variant?: 'compact' | 'full' | 'icon-only' | 'badge';
  className?: string;
  showSlogan?: boolean;
}

export const ArthaPulseLogo: React.FC<ArthaPulseLogoProps> = ({
  variant = 'compact',
  className = '',
  showSlogan = true,
}) => {
  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 128 128"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="128" height="128" rx="28" fill="#071329" />
          <rect width="126" height="126" x="1" y="1" rx="27" stroke="#00D2FF" strokeWidth="1.5" strokeOpacity="0.4" />
          {/* Heartbeat pulse wave */}
          <path
            d="M 12 76 L 24 76 L 28 66 L 33 88 L 39 42 L 45 92 L 50 68 L 56 76 L 62 76"
            stroke="#00E5FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Rising bars */}
          <rect x="62" y="74" width="5.5" height="14" rx="1.5" fill="#00D2FF" />
          <rect x="71" y="66" width="5.5" height="22" rx="1.5" fill="#00D2FF" />
          <rect x="80" y="56" width="5.5" height="32" rx="1.5" fill="#00E5FF" />
          <rect x="89" y="44" width="6" height="44" rx="2" fill="#38BDF8" />
          <rect x="99" y="30" width="6.5" height="58" rx="2" fill="#38BDF8" />
          {/* Arrow */}
          <path d="M 58 74 Q 75 62 92 42 T 112 20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <polygon points="116,16 102,23 109,30" fill="#00E5FF" />
        </svg>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center select-none text-center ${className}`}>
        {/* Vector Artwork Illustration */}
        <div className="w-full max-w-[420px] aspect-[16/9] relative rounded-2xl overflow-hidden shadow-2xl shadow-sky-950/60 border border-sky-500/20 bg-[#060D1E] p-4 flex items-center justify-center">
          <img
            src="/logo.svg"
            alt="ArthaPulse — Feel the Market. See the Future."
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }

  // Default: 'compact' (Used in Navbar, header modals, etc.)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Pulse + Chart Icon */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#060D1E] via-[#0A162D] to-[#071329] border border-sky-500/40 p-1 flex items-center justify-center shadow-lg shadow-sky-500/25 shrink-0 group">
        <svg
          viewBox="0 0 128 128"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(0,210,255,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pulse line */}
          <path
            d="M 10 76 L 24 76 L 28 66 L 33 88 L 39 42 L 45 92 L 50 68 L 56 76 L 62 76"
            stroke="#00E5FF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Chart Bars */}
          <rect x="62" y="74" width="6" height="14" rx="1.5" fill="#00D2FF" />
          <rect x="71" y="64" width="6" height="24" rx="1.5" fill="#00D2FF" />
          <rect x="80" y="52" width="6" height="36" rx="1.5" fill="#00E5FF" />
          <rect x="90" y="38" width="6.5" height="50" rx="2" fill="#38BDF8" />
          <rect x="101" y="24" width="7" height="64" rx="2" fill="#38BDF8" />
          {/* Arrow */}
          <path d="M 58 74 Q 78 60 94 40 T 114 18" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="118,14 103,21 110,28" fill="#00E5FF" />
        </svg>
      </div>

      {/* Brand & Slogan */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-xl font-black tracking-tight text-white font-sans">
            Artha<span className="text-[#00D2FF] drop-shadow-[0_0_10px_rgba(0,210,255,0.5)]">Pulse</span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider bg-sky-950/80 text-[#00D2FF] border border-sky-500/40 px-1.5 py-0.5 rounded shadow-sm">
            AI
          </span>
        </div>

        {showSlogan && (
          <span className="text-[10px] text-slate-300 font-medium tracking-wide mt-0.5">
            Feel the Market. See the Future.
          </span>
        )}
      </div>
    </div>
  );
};
