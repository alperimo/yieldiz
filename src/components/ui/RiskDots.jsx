import React from 'react';

const LEVEL_TO_SCORE = { low: 1, medium: 3, high: 5 };

export const RiskDots = ({ score, level, total = 5, className = '' }) => {
  const resolved = score ?? LEVEL_TO_SCORE[level] ?? 2;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-5 rounded-full transition-colors ${
            i < resolved ? 'bg-[#14F195]' : 'bg-black/10'
          }`}
        />
      ))}
    </div>
  );
};
