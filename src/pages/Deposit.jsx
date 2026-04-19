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
import { Users, TrendingUp, Lock, ArrowRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, children, iconClassName = 'text-sg-text-tertiary' }) => (
  <Card className="text-center !p-4">
    <div className="flex items-center justify-center gap-1 mb-1">
      <Icon size={14} className={iconClassName} />
      <span className="text-caption text-sg-text-secondary">{label}</span>
    </div>
    {children}
  </Card>
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
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto pt-4 pb-2">
        <h1 className="text-display text-sg-text mb-2">{STRINGS.HERO_HEADLINE}</h1>
        <p className="text-h2 text-sg-accent-purple font-normal">{STRINGS.HERO_SUBHEADLINE}</p>
      </div>

      <DepositFlow />

      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
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

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h2 text-sg-text">{STRINGS.VAULTS_TOP_TITLE}</h2>
          <button
            onClick={() => navigate('/vaults')}
            className="text-body text-sg-accent-purple hover:underline flex items-center gap-1"
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

      <div className="text-center py-8 border-t border-sg-border">
        <p className="text-caption text-sg-text-tertiary mb-4">{STRINGS.PARTNERS_FOOTER}</p>
        <div className="flex items-center justify-center flex-wrap gap-6">
          {PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-sg-text-secondary hover:text-sg-text transition-colors"
            >
              {partner.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deposit;
