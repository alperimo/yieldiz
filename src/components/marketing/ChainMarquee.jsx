import React from 'react';

export const ChainMarquee = ({ items, variant = 'light' }) => {
  const loop = [...items, ...items, ...items];
  const isDark = variant === 'dark';

  return (
    <div
      className={`relative overflow-hidden py-4 ${
        isDark
          ? 'border-y border-white/10 bg-white/[0.02]'
          : 'border-y border-black/[0.08] bg-white/60'
      }`}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--fade),transparent)]"
        style={{ ['--fade']: isDark ? '#2A1A0B' : '#F5F7F2' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--fade),transparent)]"
        style={{ ['--fade']: isDark ? '#2A1A0B' : '#F5F7F2' }}
      />
      <div
        className="flex min-w-max items-center gap-14 whitespace-nowrap"
        style={{ animation: 'sgMarquee 38s linear infinite' }}
      >
        {loop.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className={`inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.3em] ${
              isDark ? 'text-white/70' : 'text-[#2A1A0B]/70'
            }`}
          >
            <span
              className={`h-1 w-1 rounded-full ${
                isDark ? 'bg-[#D6A84F] shadow-[0_0_10px_#D6A84F]' : 'bg-[#A86F24]'
              }`}
            />
            {item}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes sgMarquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-33.33%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="sgMarquee"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
