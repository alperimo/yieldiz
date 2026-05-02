import React from 'react';

export const Eyebrow = ({ children, tone = 'light', className = '' }) => {
  const colors =
    tone === 'dark'
      ? 'text-white/70'
      : 'text-[#526071]';
  const rule =
    tone === 'dark' ? 'bg-white/25' : 'bg-[#08111F]/15';
  return (
    <span className={`inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${colors} ${className}`}>
      <span className={`h-px w-8 rounded-full ${rule}`} />
      {children}
    </span>
  );
};
