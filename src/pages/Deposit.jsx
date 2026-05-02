import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Landmark,
  Shield,
  Waypoints,
  TrendingUp,
} from 'lucide-react';
import { DepositFlow } from '../components/deposit/DepositFlow';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { TokenBadge } from '../components/ui/DataDisplay';
import { Eyebrow } from '../components/ui/Eyebrow';
import { LiveBadge } from '../components/ui/LiveBadge';
import { AnimatedMetric } from '../components/ui/AnimatedMetric';
import { SparkLine, generateSparkPoints } from '../components/ui/SparkLine';
import { useVaults } from '../hooks/useVaults';
import { STRINGS, MOCK_PLATFORM_STATS } from '../lib/constants';
import { formatPercent, formatNumber } from '../lib/formatters';

const APP_PILLARS = [
  {
    icon: Waypoints,
    title: 'See the full route',
    description: 'Review source chain, timing, fees, and destination before money moves.',
  },
  {
    icon: Shield,
    title: 'Protect the final step',
    description: 'Jito protection helps preserve the price you were shown when the Solana deposit is sent.',
  },
  {
    icon: Landmark,
    title: 'Go straight into yield',
    description: 'Capital finishes inside Kamino vaults, ready to earn as soon as the route settles.',
  },
];

const hashSeed = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h || 1;
};

const TopVaultRow = ({ vault, onSelect }) => {
  const seed = useMemo(() => hashSeed(vault.pubkey || vault.name), [vault.pubkey, vault.name]);
  const points = useMemo(() => generateSparkPoints(seed, 12, 'up'), [seed]);

  return (
    <article
      onClick={() => onSelect(vault.pubkey)}
      className="group grid cursor-pointer gap-4 rounded-[24px] border border-black/[0.08] bg-white p-5 shadow-[0_18px_40px_rgba(8,17,31,0.05)] transition-all hover:-translate-y-0.5 hover:border-[#9945FF]/30 hover:shadow-[0_28px_70px_rgba(8,17,31,0.10)] lg:grid-cols-[1.4fr_120px_1fr_120px] lg:items-center"
    >
      <div className="flex items-center gap-3">
        <TokenBadge symbol={vault.token} size="md" className="shadow-[0_10px_24px_rgba(8,17,31,0.06)]" />
        <div>
          <p className="font-display text-[16px] font-semibold leading-tight text-[#08111F]">{vault.name}</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C8898]">
            {vault.token} · Kamino
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <SparkLine points={points} color="#14F195" height={28} />
      </div>

      <div className="flex items-center gap-6 lg:justify-end">
        <div className="text-left lg:text-right">
          <p className="font-display text-[20px] font-semibold leading-none text-[#0EA56A]">
            {formatPercent(vault.apy)}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C8898]">
            APY · ${formatNumber(vault.tvl)} TVL
          </p>
        </div>
      </div>

      <div className="lg:flex lg:justify-end">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#08111F] px-4 py-2 text-[11px] font-semibold text-white shadow-[0_14px_30px_rgba(8,17,31,0.18)] transition-transform group-hover:-translate-y-0.5">
          Start deposit
          <ArrowUpRight size={13} />
        </span>
      </div>
    </article>
  );
};

const MetricChip = ({ label, value, format, decimals, prefix, suffix, accent = '#14F195' }) => (
  <div className="flex items-center gap-3 rounded-full border border-black/[0.08] bg-white/80 px-4 py-2 shadow-[0_10px_24px_rgba(8,17,31,0.04)]">
    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7C8898]">{label}</span>
    <span className="font-display text-[14px] font-semibold text-[#08111F]">
      <AnimatedMetric value={value} format={format} decimals={decimals} prefix={prefix} suffix={suffix} />
    </span>
  </div>
);

export default function Deposit() {
  const navigate = useNavigate();
  const { data: vaults, loading: vaultsLoading } = useVaults();
  const topVaults = vaults?.slice(0, 3);

  return (
    <div className="px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
      <div className="mx-auto max-w-[1280px] space-y-14">
        <section className="grid gap-8 xl:grid-cols-[0.86fr_0.76fr]">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>Start with a deposit</Eyebrow>
              <LiveBadge label="Solana mainnet" />
            </div>

            <div>
              <h1 className="max-w-[12ch] font-display text-[44px] font-semibold leading-[0.96] tracking-[-0.04em] text-[#08111F] sm:text-[64px]">
                {STRINGS.HERO_HEADLINE}
              </h1>
              <p className="mt-5 max-w-[52ch] text-base leading-8 text-[#526071] lg:text-lg">
                {STRINGS.HERO_SUBHEADLINE}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <MetricChip
                label="Routed today"
                value={MOCK_PLATFORM_STATS.tvl}
                format="currency-compact"
                accent="#14F195"
              />
              <MetricChip
                label="Avg APY"
                value={MOCK_PLATFORM_STATS.avgApy}
                format="percent"
                decimals={1}
                accent="#9945FF"
              />
              <MetricChip
                label="Live vaults"
                value={vaults?.length || 0}
                format="integer"
                accent="#00C2FF"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {APP_PILLARS.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="feature-card h-full !rounded-[28px] !p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08111F] text-[#14F195] shadow-[0_18px_40px_rgba(8,17,31,0.12)]">
                    <Icon size={18} />
                  </div>
                  <h2 className="mt-5 font-display text-[22px] font-semibold leading-tight text-[#08111F]">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#526071]">{description}</p>
                </Card>
              ))}
            </div>

            <Card className="overflow-hidden !rounded-[30px] !p-0">
              <div className="grid gap-px bg-black/[0.06] lg:grid-cols-[0.88fr_1.12fr]">
                <div className="bg-white/[0.86] p-6">
                  <Eyebrow>Before you confirm</Eyebrow>
                  <p className="mt-4 max-w-[28ch] font-display text-[26px] font-semibold leading-tight text-[#08111F]">
                    The numbers that matter stay visible.
                  </p>
                </div>
                <div className="bg-[#08111F] p-6 text-white">
                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/[0.46]">Source chain</p>
                      <p className="mt-3 text-sm leading-7 text-white/[0.72]">Choose where funds sit today, then set the token and amount you want to move.</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/[0.46]">Route cost</p>
                      <p className="mt-3 text-sm leading-7 text-white/[0.72]">Bridge, swap, slippage, and estimated time stay visible before you approve.</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/[0.46]">Destination vault</p>
                      <p className="mt-3 text-sm leading-7 text-white/[0.72]">Your deposit finishes inside Kamino so the position can start earning right away.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-[34px] border border-black/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.94))] p-3 shadow-[0_40px_120px_rgba(8,17,31,0.10)] backdrop-blur">
              <div className="mb-4 flex items-center gap-2 px-3 pt-2 text-[#7C8898]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <div className="ml-3 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#526071]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#14F195]" />
                  Deposit route
                </div>
              </div>
              <DepositFlow />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative overflow-hidden rounded-[34px] bg-[#08111F] p-7 text-white shadow-[0_40px_120px_rgba(8,17,31,0.18)]">
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full opacity-[0.22] blur-3xl"
              style={{ background: 'radial-gradient(circle, #9945FF 0%, transparent 60%)' }}
            />
            <div className="relative">
              <Eyebrow tone="dark">After deposit</Eyebrow>
              <h2 className="mt-5 max-w-[14ch] font-display text-[32px] font-semibold leading-[1.02]">
                Keep tracking, switch vaults, or withdraw on your schedule.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/70">
                Dashboard and vault views keep the same clarity as the deposit flow, so tracking and changes stay simple after the first deposit.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => navigate('/app/dashboard')}>
                  Open dashboard
                  <ArrowRight size={14} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/app/vaults')}
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  Browse vaults
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <Eyebrow>Available today</Eyebrow>
                <h2 className="mt-3 font-display text-[28px] font-semibold leading-tight text-[#08111F]">
                  Current Kamino vault opportunities
                </h2>
              </div>
              <button
                onClick={() => navigate('/app/vaults')}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-4 py-2.5 text-sm font-medium text-[#526071] shadow-[0_14px_30px_rgba(8,17,31,0.04)] transition-colors hover:text-[#08111F]"
              >
                View all vaults
                <ArrowRight size={15} />
              </button>
            </div>

            {vaultsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topVaults?.map((vault) => (
                  <TopVaultRow
                    key={vault.pubkey}
                    vault={vault}
                    onSelect={(pubkey) => navigate(`/app?vault=${pubkey}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
