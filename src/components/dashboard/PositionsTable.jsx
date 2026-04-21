import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { DataTable, TokenBadge } from '../ui/DataDisplay';
import { STRINGS } from '../../lib/constants';
import { formatCurrency, formatPercent, getExplorerUrl } from '../../lib/formatters';

const columns = [
  {
    key: 'vaultName',
    label: 'Vault',
    render: (row) => (
      <div className="flex items-center gap-2">
        <TokenBadge symbol={row.depositedToken} size="sm" />
        <span className="text-sg-text font-medium">{row.vaultName}</span>
      </div>
    ),
  },
  {
    key: 'depositedAmount',
    label: 'Deposited',
    render: (row) => (
      <span className="text-sg-text">{formatCurrency(row.depositedAmount)}</span>
    ),
  },
  {
    key: 'entryApy',
    label: 'APY',
    render: (row) => (
      <span className="text-sg-accent-green">{formatPercent(row.entryApy)}</span>
    ),
  },
  {
    key: 'earned',
    label: 'Earned',
    render: (row) => (
      <div className="flex items-center gap-2">
        <span className="text-sg-success font-medium">+{formatCurrency(row.earned)}</span>
        <a
          href={getExplorerUrl('solana', row.txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sg-accent-purple hover:text-sg-accent-purple/80"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={14} />
        </a>
      </div>
    ),
  },
];

export const PositionsTable = ({ positions, loading, error }) => {
  if (error) {
    return (
      <Card>
        <h2 className="text-h2 text-sg-text mb-4">{STRINGS.DASHBOARD_ACTIVE_POSITIONS}</h2>
        <p className="text-body text-sg-error text-center py-4">{STRINGS.STATE_ERROR}</p>
      </Card>
    );
  }

  return (
    <Card className="!rounded-[30px]">
      <h2 className="mb-4 font-display text-[28px] font-semibold text-sg-text">{STRINGS.DASHBOARD_ACTIVE_POSITIONS}</h2>
      <DataTable
        columns={columns}
        data={positions}
        loading={loading}
        emptyMessage={STRINGS.STATE_EMPTY_POSITIONS}
      />
    </Card>
  );
};
