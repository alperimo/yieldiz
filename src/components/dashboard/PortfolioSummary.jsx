import React from 'react';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { PriceDisplay } from '../ui/DataDisplay';
import { STRINGS } from '../../lib/constants';
import { formatPercent } from '../../lib/formatters';

export const PortfolioSummary = ({ positions, loading, error }) => {
  if (error) {
    return (
      <Card>
        <p className="text-body text-sg-error text-center py-4">{STRINGS.STATE_ERROR}</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <Skeleton width="40%" height="1rem" rounded="rounded" className="mb-4" />
        <Skeleton width="60%" height="2.5rem" rounded="rounded" className="mb-2" />
        <Skeleton width="30%" height="1rem" rounded="rounded" />
      </Card>
    );
  }

  const totalDeposited = positions?.reduce((sum, p) => sum + p.depositedAmount, 0) || 0;
  const totalEarned = positions?.reduce((sum, p) => sum + p.earned, 0) || 0;
  const percentGain = totalDeposited > 0 ? (totalEarned / totalDeposited) * 100 : 0;
  const daysActive = positions?.length
    ? Math.max(...positions.map((p) => Math.floor((Date.now() - new Date(p.createdAt)) / 86400000)))
    : 0;

  return (
    <Card className="!rounded-[30px]">
      <h2 className="mb-6 font-display text-[28px] font-semibold text-sg-text">{STRINGS.DASHBOARD_TITLE}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-sg-text-tertiary" />
            <span className="text-caption text-sg-text-secondary">{STRINGS.DASHBOARD_TOTAL_DEPOSITED}</span>
          </div>
          <PriceDisplay amount={totalDeposited} size="md" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-sg-accent-green" />
            <span className="text-caption text-sg-text-secondary">{STRINGS.DASHBOARD_TOTAL_EARNED}</span>
          </div>
          <PriceDisplay amount={totalEarned} size="md" change={percentGain} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-sg-text-tertiary" />
            <span className="text-caption text-sg-text-secondary">{STRINGS.DASHBOARD_ACTIVE}</span>
          </div>
          <p className="text-money text-sg-text">
            {daysActive} <span className="text-body text-sg-text-secondary">{STRINGS.DASHBOARD_DAYS_ACTIVE}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};
