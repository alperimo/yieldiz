import React from 'react';
import { ExternalLink, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { Eyebrow } from '../ui/Eyebrow';
import { STRINGS } from '../../lib/constants';
import { formatCurrency, formatTimeAgo, getExplorerUrl } from '../../lib/formatters';

const typeIcons = {
  bridge: ArrowRightLeft,
  swap: ArrowRightLeft,
  deposit: ArrowDownToLine,
  withdraw: ArrowUpFromLine,
};

const typeAccent = {
  bridge: '#9945FF',
  swap: '#00C2FF',
  deposit: '#14F195',
  withdraw: '#7C8898',
};

const STATUS_META = {
  pending: { label: 'Pending', accent: '#D97706', Icon: Clock },
  confirming: { label: 'Confirming', accent: '#00C2FF', Icon: Clock },
  confirmed: { label: 'Confirmed', accent: '#0EA56A', Icon: CheckCircle },
  failed: { label: 'Failed', accent: '#DC2626', Icon: AlertTriangle },
};

const txDescription = (tx) => {
  if (tx.type === 'deposit' && tx.metadata?.vaultName) {
    return `Deposited ${formatCurrency(tx.amount)} ${tx.token} → ${tx.metadata.vaultName}`;
  }
  if (tx.type === 'bridge') {
    return `Bridged ${formatCurrency(tx.amount)} ${tx.token} from ${tx.fromChain}`;
  }
  if (tx.type === 'swap') {
    return `Swapped ${formatCurrency(tx.amount)} ${tx.token}`;
  }
  if (tx.type === 'withdraw') {
    return `Withdrew ${formatCurrency(tx.amount)} ${tx.token}`;
  }
  return `${tx.type} ${formatCurrency(tx.amount)} ${tx.token}`;
};

export const TransactionHistory = ({ transactions, loading, error }) => {
  return (
    <section className="rounded-[32px] border border-black/[0.08] bg-white/[0.82] p-7 shadow-[0_24px_60px_rgba(8,17,31,0.06)] backdrop-blur sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>Activity</Eyebrow>
          <h2 className="mt-3 font-display text-[26px] font-semibold leading-tight text-[#08111F]">
            {STRINGS.DASHBOARD_RECENT_TX}
          </h2>
        </div>
      </div>

      {error ? (
        <p className="text-[14px] text-[#DC2626]">{STRINGS.STATE_ERROR}</p>
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="3.5rem" rounded="rounded-[20px]" className="w-full" />
          ))}
        </div>
      ) : !transactions?.length ? (
        <div className="rounded-[24px] border border-dashed border-black/[0.12] bg-white/60 p-10 text-center">
          <p className="text-[14px] text-[#7C8898]">{STRINGS.STATE_EMPTY_TRANSACTIONS}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx) => {
            const Icon = typeIcons[tx.type] || ArrowRightLeft;
            const accent = typeAccent[tx.type] || '#526071';
            const status = STATUS_META[tx.status] || STATUS_META.pending;
            const StatusIcon = status.Icon;
            const chain = tx.type === 'bridge' ? tx.fromChain : 'solana';
            return (
              <li
                key={tx.id}
                className="group flex items-center gap-4 rounded-[20px] border border-transparent px-3 py-3 transition-all hover:border-black/[0.06] hover:bg-white"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `${accent}1A`, color: accent }}
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-[#08111F]">{txDescription(tx)}</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#7C8898]">
                    {formatTimeAgo(tx.createdAt)}
                  </p>
                </div>
                <span
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ background: `${status.accent}1A`, color: status.accent }}
                >
                  <StatusIcon size={11} />
                  {status.label}
                </span>
                {tx.txHash ? (
                  <a
                    href={getExplorerUrl(chain, tx.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[#7B2FE6] opacity-60 transition-opacity hover:opacity-100"
                    aria-label="View on explorer"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
