import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

const RiskDots = ({ score }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`h-1.5 w-5 rounded-full transition-colors ${
          i <= score ? 'bg-[#14F195]' : 'bg-white/10'
        }`}
      />
    ))}
  </div>
);

const SparkLine = () => (
  <svg viewBox="0 0 160 48" className="h-10 w-full" aria-hidden="true">
    <defs>
      <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14F195" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#14F195" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M 0 36 L 15 32 L 30 30 L 45 24 L 60 26 L 75 18 L 90 20 L 105 14 L 120 16 L 140 8 L 160 10 L 160 48 L 0 48 Z"
      fill="url(#sparkFill)"
    />
    <path
      d="M 0 36 L 15 32 L 30 30 L 45 24 L 60 26 L 75 18 L 90 20 L 105 14 L 120 16 L 140 8 L 160 10"
      fill="none"
      stroke="#14F195"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VaultCard = ({ vault }) => {
  const display = vault.apy.toFixed(2);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-black/[0.08] bg-white p-7 shadow-[0_24px_60px_rgba(8,17,31,0.08)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_40px_90px_rgba(8,17,31,0.14)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-[#08111F]/10 bg-[#08111F]/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#08111F]">
          {vault.badge}
        </span>
        <div className="flex items-center gap-1.5 rounded-full bg-[#14F195]/[0.14] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0EA56A]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#14F195]" />
          Live
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#526071]">{vault.pair}</p>
        <h3 className="mt-1 font-display text-[26px] font-semibold leading-tight text-[#08111F]">
          {vault.name}
        </h3>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-[52px] font-semibold leading-none tracking-[-0.04em] text-[#08111F]">
          {display}
        </span>
        <span className="font-display text-[22px] font-semibold text-[#08111F]/50">%</span>
        <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#526071]">APY</span>
      </div>

      <div className="mt-4">
        <SparkLine />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-black/[0.06] pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#526071]">TVL</p>
          <p className="mt-1 font-display text-[18px] font-semibold text-[#08111F]">{vault.tvl}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#526071]">Risk · {vault.risk}</p>
          <div className="mt-2">
            <RiskDots score={vault.riskScore} />
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-[1.6] text-[#526071]">{vault.strategy}</p>

      <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#08111F]">
          <TrendingUp size={13} className="text-[#0EA56A]" />
          Audited · Kamino
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#08111F] px-4 py-2 text-[11px] font-semibold text-white shadow-[0_14px_30px_rgba(8,17,31,0.18)] transition-transform group-hover:-translate-y-0.5">
          Deposit
          <ArrowUpRight size={13} />
        </span>
      </div>
    </article>
  );
};

export const VaultSpotlight = ({ vaults }) => (
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {vaults.map((v) => (
      <VaultCard key={v.name} vault={v} />
    ))}
  </div>
);
