import React, { useMemo } from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { TokenBadge } from '../ui/DataDisplay';
import { Skeleton } from '../ui/Skeleton';
import { Eyebrow } from '../ui/Eyebrow';
import { SparkLine, generateSparkPoints } from '../ui/SparkLine';
import { STRINGS } from '../../lib/constants';
import { formatCurrency, formatPercent, getExplorerUrl } from '../../lib/formatters';

const hashSeed = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h || 1;
};

const PositionRow = ({ position }) => {
  const seed = useMemo(() => hashSeed(position.id || position.vaultName), [position.id, position.vaultName]);
  const points = useMemo(() => generateSparkPoints(seed, 12, 'up'), [seed]);
  const returnPercent =
    position.depositedAmount > 0 ? (position.earned / position.depositedAmount) * 100 : 0;

  return (
    <article className="group grid gap-4 rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-[0_14px_36px_rgba(8,17,31,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#9945FF]/30 hover:shadow-[0_22px_60px_rgba(8,17,31,0.10)] md:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr_60px] md:items-center">
      <div className="flex items-center gap-3">
        <TokenBadge symbol={position.depositedToken} size="lg" className="shadow-[0_10px_24px_rgba(8,17,31,0.06)]" />
        <div className="min-w-0">
          <p className="truncate font-display text-[16px] font-semibold text-[#08111F]">{position.vaultName}</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C8898]">
            {position.depositedToken} · Kamino
          </p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7C8898]">Deposited</p>
        <p className="mt-1 font-display text-[18px] font-semibold text-[#08111F]">
          {formatCurrency(position.depositedAmount)}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7C8898]">Entry APY</p>
        <p className="mt-1 inline-flex items-center gap-1 font-display text-[18px] font-semibold text-[#0EA56A]">
          <TrendingUp size={14} />
          {formatPercent(position.entryApy)}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7C8898]">Earned</p>
        <p className="mt-1 font-display text-[18px] font-semibold text-[#0EA56A]">
          +{formatCurrency(position.earned)}
        </p>
        <p className="text-[11px] text-[#526071]">+{returnPercent.toFixed(2)}% return</p>
      </div>

      <div className="hidden md:flex md:flex-col md:items-end md:gap-2">
        <div className="-mr-1 w-[80px]">
          <SparkLine points={points} color="#14F195" height={28} />
        </div>
        {position.txHash ? (
          <a
            href={getExplorerUrl('solana', position.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7B2FE6] hover:underline"
            aria-label="View transaction on explorer"
          >
            View tx <ExternalLink size={11} />
          </a>
        ) : null}
      </div>
    </article>
  );
};

export const PositionsTable = ({ positions, loading, error }) => {
  if (error) {
    return (
      <section className="rounded-[28px] border border-black/[0.08] bg-white/[0.82] p-8 shadow-[0_24px_60px_rgba(8,17,31,0.06)]">
        <h2 className="mb-3 font-display text-[24px] font-semibold text-[#08111F]">
          {STRINGS.DASHBOARD_ACTIVE_POSITIONS}
        </h2>
        <p className="text-[14px] text-[#DC2626]">{STRINGS.STATE_ERROR}</p>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-black/[0.08] bg-white/[0.82] p-7 shadow-[0_24px_60px_rgba(8,17,31,0.06)] backdrop-blur sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>Positions</Eyebrow>
          <h2 className="mt-3 font-display text-[26px] font-semibold leading-tight text-[#08111F]">
            {STRINGS.DASHBOARD_ACTIVE_POSITIONS}
          </h2>
        </div>
        {positions?.length ? (
          <span className="rounded-full bg-[#08111F]/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#526071]">
            {positions.length} {positions.length === 1 ? 'vault' : 'vaults'}
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="6rem" rounded="rounded-[24px]" className="w-full" />
          ))}
        </div>
      ) : !positions?.length ? (
        <div className="rounded-[24px] border border-dashed border-black/[0.12] bg-white/60 p-12 text-center">
          <p className="text-[14px] text-[#526071]">{STRINGS.STATE_EMPTY_POSITIONS}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((position) => (
            <PositionRow key={position.id} position={position} />
          ))}
        </div>
      )}
    </section>
  );
};
