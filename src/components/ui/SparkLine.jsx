import React, { useMemo } from 'react';

const DEFAULT_POINTS = [36, 32, 30, 24, 26, 18, 20, 14, 16, 8, 10];

export const SparkLine = ({
  points = DEFAULT_POINTS,
  color = '#14F195',
  height = 40,
  className = '',
}) => {
  const path = useMemo(() => {
    const W = 160;
    const H = 48;
    const n = points.length - 1;
    const step = W / n;
    const coords = points.map((y, i) => `${(i * step).toFixed(1)} ${y.toFixed(1)}`);
    const line = `M ${coords.join(' L ')}`;
    const fill = `${line} L ${W} ${H} L 0 ${H} Z`;
    return { line, fill };
  }, [points]);

  const gradId = useMemo(() => `spark-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <svg
      viewBox="0 0 160 48"
      className={className}
      style={{ height, width: '100%' }}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path.fill} fill={`url(#${gradId})`} />
      <path
        d={path.line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const generateSparkPoints = (seed = 1, length = 12, trend = 'up') => {
  const result = [];
  let value = trend === 'up' ? 38 : 10;
  const rng = (n) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  for (let i = 0; i < length; i += 1) {
    const drift = trend === 'up' ? -2.1 : 2.1;
    value += drift + (rng(i) - 0.5) * 5.5;
    value = Math.max(4, Math.min(44, value));
    result.push(value);
  }
  return result;
};
