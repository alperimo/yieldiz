import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Lock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TokenBadge } from '../ui/DataDisplay';
import { STRINGS, RISK_DOT_CLASSES } from '../../lib/constants';
import { formatPercent, formatNumber } from '../../lib/formatters';

const RISK_BADGE_VARIANTS = { low: 'success', medium: 'warning', high: 'error' };
const RISK_BADGE_LABELS = { low: STRINGS.RISK_LOW, medium: STRINGS.RISK_MEDIUM, high: STRINGS.RISK_HIGH };

const riskBadge = (level) => (
  <Badge variant={RISK_BADGE_VARIANTS[level] || 'default'}>
    <span className={`w-1.5 h-1.5 rounded-full ${RISK_DOT_CLASSES[level] || 'bg-sg-text-tertiary'}`} />
    {RISK_BADGE_LABELS[level] || level}
  </Badge>
);

export const VaultCard = ({ vault, onDeposit }) => {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <TokenBadge symbol={vault.token} size="lg" className="shadow-[0_12px_30px_rgba(126,77,34,0.06)]" />
          <div>
            <h3 className="text-h3 text-sg-text">{vault.name}</h3>
            <p className="text-caption text-sg-text-tertiary">{vault.token}</p>
          </div>
        </div>
        {riskBadge(vault.riskLevel)}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-caption text-sg-text-tertiary">APY</p>
          <p className="text-money-sm text-sg-accent-green flex items-center gap-1">
            <TrendingUp size={16} />
            {formatPercent(vault.apy)}
          </p>
        </div>
        <div>
          <p className="text-caption text-sg-text-tertiary">TVL</p>
          <p className="text-money-sm text-sg-text flex items-center gap-1">
            <Lock size={16} className="text-sg-text-tertiary" />
            ${formatNumber(vault.tvl)}
          </p>
        </div>
      </div>

      {vault.description ? (
        <p className="text-caption text-sg-text-secondary mb-4 line-clamp-2">
          {vault.description}
        </p>
      ) : null}

      <div className="mt-auto">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => onDeposit?.(vault)}
        >
          {STRINGS.VAULTS_DEPOSIT}
        </Button>
      </div>
    </Card>
  );
};
