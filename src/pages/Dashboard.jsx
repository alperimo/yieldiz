import React from 'react';
import { useWallet } from '../context/WalletContext';
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { PositionsTable } from '../components/dashboard/PositionsTable';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePositions } from '../hooks/usePositions';
import { useTransactions } from '../hooks/useTransactions';
import { STRINGS } from '../lib/constants';
import { Wallet } from 'lucide-react';

const Dashboard = () => {
  const { connected, address, connect } = useWallet();
  const { data: positions, loading: posLoading, error: posError } = usePositions(address);
  const { data: transactions, loading: txLoading, error: txError } = useTransactions(address);

  if (!connected) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Wallet size={48} className="text-sg-text-tertiary mb-4" />
          <h2 className="text-h2 text-sg-text mb-2">{STRINGS.DASHBOARD_TITLE}</h2>
          <p className="text-body text-sg-text-secondary mb-6">
            {STRINGS.WALLET_CONNECT_PROMPT}
          </p>
          <Button variant="primary" onClick={connect}>
            {STRINGS.CONNECT_SOLFLARE}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8 space-y-6">
      <PortfolioSummary positions={positions} loading={posLoading} error={posError} />
      <PositionsTable positions={positions} loading={posLoading} error={posError} />
      <TransactionHistory transactions={transactions} loading={txLoading} error={txError} />
    </div>
  );
};

export default Dashboard;
