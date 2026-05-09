import React from 'react';
import { useWallet } from '../context/WalletContext';
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { PositionsTable } from '../components/dashboard/PositionsTable';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePositions } from '../hooks/usePositions';
import { useTransactions } from '../hooks/useTransactions';
import { useSnsIdentity } from '../hooks/useSnsIdentity';
import { STRINGS } from '../lib/constants';
import { abbreviateAddress } from '../lib/formatters';
import { Wallet } from 'lucide-react';

const Dashboard = () => {
  const { connected, address, connect, connection } = useWallet();
  const { data: positions, loading: posLoading, error: posError } = usePositions(address);
  const { data: transactions, loading: txLoading, error: txError } = useTransactions(address);
  const { domain } = useSnsIdentity(address, connection);

  if (!connected) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-black/[0.08] bg-white/80 py-24 shadow-[0_24px_70px_rgba(126,77,34,0.06)]">
            <Wallet size={48} className="text-sg-text-tertiary mb-4" />
            <h2 className="font-display text-[34px] font-semibold text-sg-text mb-2">{STRINGS.DASHBOARD_TITLE}</h2>
            <p className="text-body text-sg-text-secondary mb-6">
              {STRINGS.WALLET_CONNECT_PROMPT}
            </p>
            <Button variant="primary" onClick={connect}>
              {STRINGS.CONNECT_SOLFLARE}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-8 rounded-[34px] border border-black/[0.08] bg-white/[0.82] p-8 shadow-[0_24px_70px_rgba(126,77,34,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sg-text-secondary">Your positions</p>
          <h1 className="mt-3 font-display text-[42px] font-semibold leading-[1.02] tracking-[-0.03em] text-sg-text">
            Your Solana yield positions.
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-8 text-sg-text-secondary">
            Track deposited capital, earned yield, and the recent routes that brought funds into Solana.
          </p>
          <div className="mt-5 inline-flex rounded-full border border-black/[0.08] bg-white/70 px-3 py-2 text-sm font-semibold text-[#7E4D22]">
            Treasury profile: {domain || abbreviateAddress(address)}
          </div>
        </div>
        <div className="space-y-6">
          <PortfolioSummary positions={positions} loading={posLoading} error={posError} />
          <PositionsTable positions={positions} loading={posLoading} error={posError} />
          <TransactionHistory transactions={transactions} loading={txLoading} error={txError} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
