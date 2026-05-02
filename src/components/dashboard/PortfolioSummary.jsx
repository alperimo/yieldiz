import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, Activity } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { Eyebrow } from '../ui/Eyebrow';
import { LiveBadge } from '../ui/LiveBadge';
import { AnimatedMetric } from '../ui/AnimatedMetric';
import { SparkLine, generateSparkPoints } from '../ui/SparkLine';
import { STRINGS } from '../../lib/constants';

const MetricTile = ({ icon: Icon, label, accent, children, sub }) => (
  <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 shadow-[0_18px_40px_rgba(8,17,31,0.05)]">
    <div className="flex items-center gap-2">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-xl"
        style={{ background: `${accent}1F`, color: accent }}
      >
        <Icon size={14} />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#526071]">{label}</span>
    </div>
    <div className="mt-5">{children}</div>
    {sub ? <p className="mt-2 text-[12px] text-[#7C8898]">{sub}</p> : null}
  </div>
);

export const PortfolioSummary = ({ positions, loading, error }) => {
  const totals = useMemo(() => {
    const totalDeposited = positions?.reduce((sum, p) => sum + p.depositedAmount, 0) || 0;
    const totalEarned = positions?.reduce((sum, p) => sum + p.earned, 0) || 0;
    const percentGain = totalDeposited > 0 ? (totalEarned / totalDeposited) * 100 : 0;
    const daysActive = positions?.length
      ? Math.max(...positions.map((p) => Math.floor((Date.now() - new Date(p.createdAt)) / 86400000)))
      : 0;
    const avgApy = positions?.length
      ? positions.reduce((s, p) => s + (p.entryApy || 0), 0) / positions.length
      : 0;
    const projectedAnnual = (totalDeposited * avgApy) / 100;
    return { totalDeposited, totalEarned, percentGain, daysActive, avgApy, projectedAnnual };
  }, [positions]);

  const sparkPoints = useMemo(() => generateSparkPoints(7, 16, 'up'), []);

  if (error) {
    return (
      <div className="rounded-[28px] border border-black/[0.08] bg-white/[0.82] p-8 text-center text-[#DC2626] shadow-[0_24px_60px_rgba(8,17,31,0.06)]">
        {STRINGS.STATE_ERROR}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-black/[0.08] bg-white/[0.82] p-8 shadow-[0_24px_60px_rgba(8,17,31,0.06)]">
        <Skeleton width="40%" height="1rem" rounded="rounded" className="mb-4" />
        <Skeleton width="60%" height="2.5rem" rounded="rounded" className="mb-2" />
        <Skeleton width="30%" height="1rem" rounded="rounded" />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[34px] bg-[#08111F] p-7 text-white shadow-[0_40px_120px_rgba(8,17,31,0.18)] sm:p-9">
      <div
        className="pointer-events-none absolute -top-24 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.20] blur-3xl"
        style={{ background: 'radial-gradient(circle, #9945FF 0%, transparent 65%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-[340px] w-[340px] rounded-full opacity-[0.18] blur-3xl"
        style={{ background: 'radial-gradient(circle, #14F195 0%, transparent 65%)' }}
      />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow tone="dark">{STRINGS.DASHBOARD_TITLE}</Eyebrow>
          <LiveBadge label={`${positions?.length || 0} active`} tone="white" />
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              {STRINGS.DASHBOARD_TOTAL_DEPOSITED}
            </p>
            <p className="mt-3 font-display text-[56px] font-semibold leading-none tracking-[-0.04em]">
              <AnimatedMetric value={totals.totalDeposited} format="currency" decimals={2} />
            </p>
            <div className="mt-3 flex items-center gap-3 text-[13px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#14F195]/[0.16] px-3 py-1 text-[#14F195]">
                <TrendingUp size={13} />
                +<AnimatedMetric value={totals.totalEarned} format="currency" decimals={2} /> earned
              </span>
              <span className="text-white/60">
                <AnimatedMetric value={totals.percentGain} format="percent" decimals={2} prefix="+" /> total return
              </span>
            </div>
          </div>

          <div className="w-full max-w-[240px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">14d trend</p>
            <SparkLine points={sparkPoints} color="#14F195" height={56} />
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          <MetricTile icon={DollarSign} label="Projected annual" accent="#14F195">
            <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#08111F]">
              <AnimatedMetric value={totals.projectedAnnual} format="currency" decimals={0} />
            </p>
          </MetricTile>
          <MetricTile icon={Activity} label="Average APY" accent="#9945FF">
            <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#08111F]">
              <AnimatedMetric value={totals.avgApy} format="percent" decimals={2} />
            </p>
          </MetricTile>
          <MetricTile icon={Calendar} label={STRINGS.DASHBOARD_ACTIVE} accent="#00C2FF">
            <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#08111F]">
              <AnimatedMetric value={totals.daysActive} format="integer" />
              <span className="ml-2 text-[14px] font-semibold text-[#526071]">{STRINGS.DASHBOARD_DAYS_ACTIVE}</span>
            </p>
          </MetricTile>
        </div>
      </div>
    </section>
  );
};
