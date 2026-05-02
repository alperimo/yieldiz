import React, { useMemo } from 'react';
import { ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { TokenBadge } from '../ui/DataDisplay';
import { LiveBadge } from '../ui/LiveBadge';
import { SparkLine, generateSparkPoints } from '../ui/SparkLine';
import { RiskDots } from '../ui/RiskDots';
import { AnimatedMetric } from '../ui/AnimatedMetric';
import { STRINGS } from '../../lib/constants';
import { formatNumber } from '../../lib/formatters';

const RISK_LABELS = {
  low: STRINGS.RISK_LOW,
  medium: STRINGS.RISK_MEDIUM,
  high: STRINGS.RISK_HIGH,
};

const hashSeed = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h || 1;
};

export const VaultCard = ({ vault, onDeposit }) => {
  const seed = useMemo(() => hashSeed(vault.pubkey || vault.name), [vault.pubkey, vault.name]);
  const points = useMemo(() => generateSparkPoints(seed, 12, 'up'), [seed]);

  return (
    <article
      onClick={() => onDeposit?.(vault)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-black/[0.08] bg-white p-6 shadow-[0_20px_50px_rgba(8,17,31,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9945FF]/30 hover:shadow-[0_32px_80px_rgba(8,17,31,0.12)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <TokenBadge symbol={vault.token} size="lg" className="shadow-[0_12px_30px_rgba(8,17,31,0.08)]" />
          <div>
            <h3 className="font-display text-[20px] font-semibold leading-tight text-[#08111F]">
              {vault.name}
            </h3>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C8898]">
              {vault.token} · Kamino
            </p>
          </div>
        </div>
        <LiveBadge label="Live" />
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <AnimatedMetric
          value={vault.apy}
          format="decimal"
          decimals={2}
          className="font-display text-[44px] font-semibold leading-none tracking-[-0.03em] text-[#08111F]"
        />
        <span className="font-display text-[20px] font-semibold text-[#08111F]/50">%</span>
        <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#526071]">APY</span>
      </div>

      <div className="mt-3 -mx-1">
        <SparkLine points={points} color="#14F195" height={36} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-black/[0.06] pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#526071]">TVL</p>
          <p className="mt-1 font-display text-[17px] font-semibold text-[#08111F]">
            ${formatNumber(vault.tvl)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#526071]">
            Risk · {RISK_LABELS[vault.riskLevel] || vault.riskLevel}
          </p>
          <div className="mt-2">
            <RiskDots level={vault.riskLevel} />
          </div>
        </div>
      </div>

      {vault.description ? (
        <p className="mt-4 line-clamp-2 text-[13px] leading-[1.55] text-[#526071]">
          {vault.description}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#08111F]">
          <ShieldCheck size={13} className="text-[#0EA56A]" />
          Audited · Kamino
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#08111F] px-4 py-2 text-[11px] font-semibold text-white shadow-[0_14px_30px_rgba(8,17,31,0.18)] transition-transform group-hover:-translate-y-0.5">
          {STRINGS.VAULTS_DEPOSIT}
          <ArrowUpRight size={13} />
        </span>
      </div>
    </article>
  );
};
