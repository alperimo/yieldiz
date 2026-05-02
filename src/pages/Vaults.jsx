import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Landmark, ShieldCheck } from 'lucide-react';
import { VaultList } from '../components/vaults/VaultList';
import { VaultFilters } from '../components/vaults/VaultFilters';
import { Eyebrow } from '../components/ui/Eyebrow';
import { LiveBadge } from '../components/ui/LiveBadge';
import { AnimatedMetric } from '../components/ui/AnimatedMetric';
import { useVaults } from '../hooks/useVaults';
import { useVaultFilters } from '../hooks/useVaultFilters';
import { STRINGS } from '../lib/constants';

const HeroMetric = ({ icon: Icon, label, value, format, decimals, suffix, prefix, accent = '#0EA56A' }) => (
  <div className="flex-1 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
      <Icon size={13} style={{ color: accent }} />
      {label}
    </div>
    <p className="mt-3 font-display text-[32px] font-semibold leading-none tracking-[-0.03em] text-white">
      <AnimatedMetric value={value} format={format} decimals={decimals} prefix={prefix} suffix={suffix} />
    </p>
  </div>
);

const Vaults = () => {
  const navigate = useNavigate();
  const { data: vaults, loading, error, refetch } = useVaults();
  const {
    filteredVaults,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    riskFilter, setRiskFilter,
  } = useVaultFilters(vaults);

  const stats = useMemo(() => {
    if (!vaults?.length) return { tvl: 0, avgApy: 0, count: 0, topApy: 0 };
    const tvl = vaults.reduce((sum, v) => sum + (v.tvl || 0), 0);
    const avgApy = vaults.reduce((sum, v) => sum + (v.apy || 0), 0) / vaults.length;
    const topApy = vaults.reduce((max, v) => Math.max(max, v.apy || 0), 0);
    return { tvl, avgApy, count: vaults.length, topApy };
  }, [vaults]);

  const handleDeposit = (vault) => {
    navigate(`/app?vault=${vault.pubkey}`);
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-8 px-4 py-8 lg:px-8">
      <section className="relative overflow-hidden rounded-[36px] bg-[#08111F] p-8 text-white shadow-[0_40px_120px_rgba(8,17,31,0.18)] sm:p-10">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full opacity-[0.24] blur-3xl"
          style={{ background: 'radial-gradient(circle, #9945FF 0%, transparent 60%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-[360px] w-[360px] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: 'radial-gradient(circle, #14F195 0%, transparent 60%)' }}
        />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow tone="dark">Choose a destination</Eyebrow>
            <LiveBadge label={`${stats.count} live`} tone="white" />
          </div>

          <h1 className="mt-6 max-w-[18ch] font-display text-[44px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[56px]">
            {STRINGS.VAULTS_TITLE}
          </h1>
          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.7] text-white/70">
            Review live APY, TVL, and risk profile before fresh capital moves. Every vault here is audited and ready
            for cross-chain entry via SolGate&apos;s MEV-protected route.
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <HeroMetric
              icon={Landmark}
              label="Total TVL"
              value={stats.tvl}
              format="currency-compact"
              accent="#00C2FF"
            />
            <HeroMetric
              icon={TrendingUp}
              label="Average APY"
              value={stats.avgApy}
              format="percent"
              decimals={2}
              accent="#14F195"
            />
            <HeroMetric
              icon={ShieldCheck}
              label="Top APY"
              value={stats.topApy}
              format="percent"
              decimals={2}
              accent="#9945FF"
            />
          </div>
        </div>
      </section>

      <VaultFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
      />

      <VaultList
        vaults={filteredVaults}
        loading={loading}
        error={error}
        onDeposit={handleDeposit}
        onRetry={refetch}
      />
    </div>
  );
};

export default Vaults;
