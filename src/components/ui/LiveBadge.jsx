import React from 'react';

export const LiveBadge = ({ label = 'Live', tone = 'green', className = '' }) => {
  const tones = {
    green: {
      bg: 'bg-[#14F195]/[0.14]',
      text: 'text-[#0EA56A]',
      dot: 'bg-[#14F195]',
    },
    purple: {
      bg: 'bg-[#9945FF]/[0.14]',
      text: 'text-[#7B2FE6]',
      dot: 'bg-[#9945FF]',
    },
    cyan: {
      bg: 'bg-[#00C2FF]/[0.14]',
      text: 'text-[#0896C7]',
      dot: 'bg-[#00C2FF]',
    },
    white: {
      bg: 'bg-white/[0.12]',
      text: 'text-white',
      dot: 'bg-[#14F195]',
    },
  };
  const t = tones[tone] || tones.green;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${t.bg} ${t.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${t.dot}`} />
      {label}
    </span>
  );
};
