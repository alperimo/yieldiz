import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DepositFlow } from '../components/deposit/DepositFlow';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { TokenBadge } from '../components/ui/DataDisplay';
import { useVaults } from '../hooks/useVaults';
import { STRINGS, PARTNERS, MOCK_PLATFORM_STATS } from '../lib/constants';
import { formatPercent, formatNumber } from '../lib/formatters';
import {
  Users, TrendingUp, Lock, ArrowRight, Zap,
  Layers, Shield, Landmark,
} from 'lucide-react';

const FEATURES = [
  { icon: Layers, title: STRINGS.FEATURE_CHAINS_TITLE, desc: STRINGS.FEATURE_CHAINS_DESC },
  { icon: Shield, title: STRINGS.FEATURE_MEV_TITLE, desc: STRINGS.FEATURE_MEV_DESC },
  { icon: Zap, title: STRINGS.FEATURE_RATES_TITLE, desc: STRINGS.FEATURE_RATES_DESC },
  { icon: Landmark, title: STRINGS.FEATURE_YIELD_TITLE, desc: STRINGS.FEATURE_YIELD_DESC },
];

const StatCard = ({ icon: Icon, label, children, iconClassName = 'text-sg-text-tertiary' }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1.5 mb-1">
      <Icon size={16} className={iconClassName} />
      <span className="text-caption text-sg-text-secondary font-medium uppercase tracking-wide">{label}</span>
    </div>
    <div className="stat-highlight">{children}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="feature-card bg-white border border-sg-border rounded-card p-6 lg:p-8">
    <div className="w-12 h-12 mb-5 rounded-xl bg-sg-accent-purple/10 flex items-center justify-center">
      <Icon size={24} className="text-sg-accent-purple" strokeWidth={1.5} />
    </div>
    <h3 className="text-h3 text-sg-text mb-2">{title}</h3>
    <p className="text-body text-sg-text-secondary leading-relaxed">{desc}</p>
  </div>
);

const TopVaultRow = ({ vault, onSelect }) => (
  <Card
    hover
    className="flex items-center justify-between !p-4 cursor-pointer"
    onClick={() => onSelect(vault.pubkey)}
  >
    <div className="flex items-center gap-3">
      <TokenBadge symbol={vault.token} size="md" />
      <div>
        <p className="text-body text-sg-text font-medium">{vault.name}</p>
        <p className="text-caption text-sg-text-tertiary">{vault.token}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="text-body text-sg-accent-green font-medium">{formatPercent(vault.apy)} APY</p>
        <p className="text-caption text-sg-text-tertiary">${formatNumber(vault.tvl)} TVL</p>
      </div>
      <Button variant="secondary" size="sm">
        {STRINGS.VAULTS_DEPOSIT} <ArrowRight size={14} />
      </Button>
    </div>
  </Card>
);

const Deposit = () => {
  const navigate = useNavigate();
  const { data: vaults, loading: vaultsLoading } = useVaults();
  const topVaults = vaults?.slice(0, 3);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="hero-orb" style={{ top: '-250px', right: '-150px' }} />
        <div className="hero-orb-secondary" style={{ bottom: '-150px', left: '-200px' }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 lg:px-8 pt-12 lg:pt-20 pb-16 lg:pb-24">
          <div className="text-center mb-10 lg:mb-14">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-sg-accent-green/8 border border-sg-accent-green/15 text-sg-accent-green text-caption font-medium">
              <Zap size={14} strokeWidth={2} />
              {STRINGS.HERO_BADGE}
            </div>

            {/* Hero headline */}
            <h1 className="text-[38px] lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-sg-text mb-4">
              {STRINGS.HERO_HEADLINE}
            </h1>
            <p className="text-[18px] lg:text-[22px] text-sg-text-secondary font-normal max-w-md mx-auto leading-relaxed">
              {STRINGS.HERO_SUBHEADLINE}
            </p>
          </div>

          {/* Deposit Card */}
          <DepositFlow />
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y border-sg-border bg-white">
        <div className="max-w-[800px] mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8">
            <StatCard icon={Lock} label={STRINGS.STATS_TVL}>
              <p className="text-money-sm text-sg-text">${formatNumber(MOCK_PLATFORM_STATS.tvl)}</p>
            </StatCard>
            <StatCard icon={TrendingUp} label={STRINGS.STATS_AVG_APY} iconClassName="text-sg-accent-green">
              <p className="text-money-sm text-sg-accent-green">{formatPercent(MOCK_PLATFORM_STATS.avgApy)}</p>
            </StatCard>
            <StatCard icon={Users} label={STRINGS.STATS_USERS}>
              <p className="text-money-sm text-sg-text">{MOCK_PLATFORM_STATS.users}+</p>
            </StatCard>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-16 lg:py-20">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-sg-text text-center mb-4">
            {STRINGS.FEATURES_HEADLINE}
          </h2>
          <p className="text-body text-sg-text-secondary text-center mb-12 max-w-lg mx-auto">
            Everything you need to move stablecoins cross-chain and earn yield — in one flow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Top Vaults ─── */}
      <section className="bg-sg-bg">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 py-16 lg:py-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h1 text-sg-text">{STRINGS.VAULTS_TOP_TITLE}</h2>
            <button
              onClick={() => navigate('/vaults')}
              className="text-body text-sg-accent-purple hover:underline flex items-center gap-1 font-medium"
            >
              {STRINGS.VAULTS_VIEW_ALL} <ArrowRight size={14} />
            </button>
          </div>
          {vaultsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {topVaults?.map((vault) => (
                <TopVaultRow
                  key={vault.pubkey}
                  vault={vault}
                  onSelect={(pk) => navigate(`/?vault=${pk}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Partner Footer ─── */}
      <section className="bg-white border-t border-sg-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-12">
          <p className="text-caption text-sg-text-tertiary text-center mb-5 uppercase tracking-wider font-medium">
            {STRINGS.PARTNERS_FOOTER}
          </p>
          <div className="flex items-center justify-center flex-wrap gap-8">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-sg-text-tertiary hover:text-sg-text transition-colors font-medium"
              >
                {partner.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Deposit;
