import React from 'react';

const formatValue = (value, format) => {
  if (format === 'compact') {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
    return Math.round(value).toString();
  }
  if (format === 'decimal') return value.toFixed(2);
  return Math.round(value).toString();
};

const MetricTile = ({ metric }) => {
  const display = formatValue(metric.value, metric.format);

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] px-6 py-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20"
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#14F195] shadow-[0_0_10px_#14F195]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/60">
          {metric.label}
        </span>
      </div>
      <div className="flex items-baseline gap-1 font-display text-[40px] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[48px]">
        {metric.prefix ? <span className="text-white/70">{metric.prefix}</span> : null}
        <span>{display}</span>
        {metric.suffix ? <span className="text-white/70">{metric.suffix}</span> : null}
      </div>
      <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(20,241,149,0.55),transparent)] opacity-60 transition-opacity group-hover:opacity-100" />
    </div>
  );
};

export const LiveMetrics = ({ metrics }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
    {metrics.map((metric) => (
      <MetricTile key={metric.key} metric={metric} />
    ))}
  </div>
);
