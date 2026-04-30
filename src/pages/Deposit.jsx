import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Landmark,
  Shield,
  Waypoints,
} from 'lucide-react';
import { DepositFlow } from '../components/deposit/DepositFlow';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { TokenBadge } from '../components/ui/DataDisplay';
import { useVaults } from '../hooks/useVaults';
import { STRINGS } from '../lib/constants';
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

const TopVaultRow = ({ vault, onSelect }) => (
  <Card
    hover
    className="flex flex-col gap-4 !p-5 lg:flex-row lg:items-center lg:justify-between"
    onClick={() => onSelect(vault.pubkey)}
  >
    <div className="flex items-center gap-3">
      <TokenBadge symbol={vault.token} size="md" />
      <div>
        <p className="text-body font-semibold text-sg-text">{vault.name}</p>
        <p className="text-caption text-sg-text-tertiary">{vault.token} yield vault</p>
      </div>
    </div>
      <div className="flex items-center gap-6">
        <div className="text-left lg:text-right">
          <p className="text-money-sm text-sg-success">{formatPercent(vault.apy)} APY</p>
          <p className="text-caption text-sg-text-tertiary">${formatNumber(vault.tvl)} TVL</p>
        </div>
        <Button variant="secondary" size="sm">
          Start deposit <ArrowRight size={14} />
        </Button>
      </div>
  </Card>
);

export default function Deposit() {
  const navigate = useNavigate();
  const { data: vaults, loading: vaultsLoading } = useVaults();
  const topVaults = vaults?.slice(0, 3);

  return (
    <div className="px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
      <div className="mx-auto max-w-[1360px] space-y-14">
        <section className="grid items-start gap-8 xl:grid-cols-[0.86fr_0.76fr]">
          <div className="space-y-6 xl:sticky xl:top-16 xl:self-start xl:space-y-5">
            <div className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-sg-text-secondary">
              <span className="h-px w-8 rounded-full bg-black/[0.12]" />
              Start with a deposit
            </div>

            <div>
              <h1 className="max-w-[12ch] font-display text-[44px] font-semibold leading-[0.96] tracking-[-0.04em] text-sg-text sm:text-[64px] xl:text-[56px] 2xl:text-[64px]">
                {STRINGS.HERO_HEADLINE}
              </h1>
              <p className="mt-5 max-w-[52ch] text-base leading-8 text-sg-text-secondary lg:text-lg xl:mt-4 xl:text-base xl:leading-7 2xl:text-lg 2xl:leading-8">
                {STRINGS.HERO_SUBHEADLINE}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:gap-3 2xl:gap-4">
              {APP_PILLARS.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="feature-card h-full !rounded-[28px] !p-6 xl:!p-5 2xl:!p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7E4D22] text-sg-accent-green shadow-[0_18px_40px_rgba(126,77,34,0.12)] xl:h-10 xl:w-10 2xl:h-11 2xl:w-11">
                    <Icon size={18} />
                  </div>
                  <h2 className="mt-5 font-display text-[24px] font-semibold leading-tight text-sg-text xl:mt-4 xl:text-[22px] 2xl:mt-5 2xl:text-[24px]">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-sg-text-secondary xl:mt-2 xl:text-[13px] xl:leading-6 2xl:mt-3 2xl:text-sm 2xl:leading-7">{description}</p>
                </Card>
              ))}
            </div>

            <Card className="overflow-hidden !rounded-[30px] !p-0">
              <div className="grid gap-px bg-black/[0.06] lg:grid-cols-[0.88fr_1.12fr]">
                <div className="bg-white/[0.86] p-6 xl:p-5 2xl:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sg-text-secondary">Before you confirm</p>
                  <p className="mt-4 max-w-[28ch] font-display text-[28px] font-semibold leading-tight text-sg-text xl:text-[25px] 2xl:text-[28px]">
                    The numbers that matter stay visible.
                  </p>
                </div>
                <div className="bg-[#7E4D22] p-6 text-white xl:p-5 2xl:p-6">
                  <div className="grid gap-5 md:grid-cols-3 xl:gap-4 2xl:gap-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/[0.46]">Source chain</p>
                      <p className="mt-3 text-sm leading-7 text-white/[0.72] xl:mt-2 xl:text-[13px] xl:leading-6 2xl:mt-3 2xl:text-sm 2xl:leading-7">Choose where funds sit today, then set the token and amount you want to move.</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/[0.46]">Route cost</p>
                      <p className="mt-3 text-sm leading-7 text-white/[0.72] xl:mt-2 xl:text-[13px] xl:leading-6 2xl:mt-3 2xl:text-sm 2xl:leading-7">Bridge, swap, slippage, and estimated time stay visible before you approve.</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/[0.46]">Destination vault</p>
                      <p className="mt-3 text-sm leading-7 text-white/[0.72] xl:mt-2 xl:text-[13px] xl:leading-6 2xl:mt-3 2xl:text-sm 2xl:leading-7">Your deposit finishes inside Kamino so the position can start earning right away.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="xl:sticky xl:top-16 xl:self-start">
            <div className="rounded-[34px] border border-black/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.94))] p-3 shadow-[0_40px_120px_rgba(126,77,34,0.10)] backdrop-blur">
              <div className="mb-4 flex items-center gap-2 px-3 pt-2 text-sg-text-tertiary">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7E4D22]/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#7E4D22]/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#7E4D22]/10" />
                <div className="ml-3 rounded-full border border-black/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sg-text-secondary">
                  Deposit route
                </div>
              </div>
              <DepositFlow />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <Card className="!rounded-[32px] !bg-[#7E4D22] !p-7 text-white shadow-[0_40px_120px_rgba(126,77,34,0.14)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/[0.46]">After deposit</p>
            <h2 className="mt-5 max-w-[14ch] font-display text-[34px] font-semibold leading-[1.02]">
              Keep tracking, switch vaults, or withdraw on your schedule.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Dashboard and vault views keep the same clarity as the deposit flow, so tracking and changes stay simple after the first deposit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate('/app/dashboard')}>
                Open dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/app/vaults')} className="text-white hover:bg-white/10 hover:text-white">
                Browse vaults
              </Button>
            </div>
          </Card>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sg-text-secondary">Available today</p>
                <h2 className="mt-2 font-display text-[32px] font-semibold leading-tight text-sg-text">
                  Current Kamino vault opportunities
                </h2>
              </div>
              <button
                onClick={() => navigate('/app/vaults')}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-4 py-2.5 text-sm font-medium text-sg-text-secondary shadow-[0_14px_30px_rgba(126,77,34,0.04)] transition-colors hover:text-sg-text"
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
