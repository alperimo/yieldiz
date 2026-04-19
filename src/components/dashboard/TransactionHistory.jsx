import React from 'react';
import { ExternalLink, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { STRINGS } from '../../lib/constants';
import { formatCurrency, formatTimeAgo, abbreviateAddress, getExplorerUrl } from '../../lib/formatters';

const typeIcons = {
  bridge: ArrowRightLeft,
  swap: ArrowRightLeft,
  deposit: ArrowDownToLine,
  withdraw: ArrowUpFromLine,
};

const statusVariants = {
  pending: 'warning',
  confirming: 'info',
  confirmed: 'success',
  failed: 'error',
};

export const TransactionHistory = ({ transactions, loading, error }) => {
  if (error) {
    return (
      <Card>
        <h2 className="text-h2 text-sg-text mb-4">{STRINGS.DASHBOARD_RECENT_TX}</h2>
        <p className="text-body text-sg-error text-center py-4">{STRINGS.STATE_ERROR}</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <h2 className="text-h2 text-sg-text mb-4">{STRINGS.DASHBOARD_RECENT_TX}</h2>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="3.5rem" rounded="rounded-lg" className="w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-h2 text-sg-text mb-4">{STRINGS.DASHBOARD_RECENT_TX}</h2>
      {!transactions?.length ? (
        <p className="text-body text-sg-text-tertiary py-4">{STRINGS.STATE_EMPTY_TRANSACTIONS}</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const Icon = typeIcons[tx.type] || ArrowRightLeft;
            const chain = tx.type === 'bridge' ? tx.fromChain : 'solana';
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-sg-bg-elevated/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-sg-bg-elevated flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-sg-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body text-sg-text truncate">
                    {tx.type === 'deposit' && tx.metadata?.vaultName
                      ? `Deposited ${formatCurrency(tx.amount)} ${tx.token} → ${tx.metadata.vaultName}`
                      : tx.type === 'bridge'
                      ? `Bridged ${formatCurrency(tx.amount)} ${tx.token} from ${tx.fromChain}`
                      : `${tx.type} ${formatCurrency(tx.amount)} ${tx.token}`}
                  </p>
                  <p className="text-caption text-sg-text-tertiary">{formatTimeAgo(tx.createdAt)}</p>
                </div>
                <Badge variant={statusVariants[tx.status]}>
                  {tx.status}
                </Badge>
                {tx.txHash ? (
                  <a
                    href={getExplorerUrl(chain, tx.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sg-accent-purple hover:text-sg-accent-purple/80 shrink-0"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
