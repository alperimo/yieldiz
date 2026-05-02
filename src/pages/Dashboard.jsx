import React from 'react';
import { Wallet, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { PositionsTable } from '../components/dashboard/PositionsTable';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Button } from '../components/ui/Button';
import { usePositions } from '../hooks/usePositions';
import { useTransactions } from '../hooks/useTransactions';
import { STRINGS } from '../lib/constants';

const Dashboard = () => {
  const { connected, address, connect } = useWallet();
  const { data: positions, loading: posLoading, error: posError } = usePositions(address);
  const { data: transactions, loading: txLoading, error: txError } = useTransactions(address);

  if (!connected) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-black/[0.08] bg-white/[0.86] p-10 text-center shadow-[0_40px_120px_rgba(8,17,31,0.10)] backdrop-blur sm:p-16">
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-[360px] w-[360px] rounded-full opacity-[0.18] blur-3xl"
            style={{ background: 'radial-gradient(circle, #9945FF 0%, transparent 60%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full opacity-[0.16] blur-3xl"
            style={{ background: 'radial-gradient(circle, #14F195 0%, transparent 60%)' }}
          />

          <div className="relative mx-auto max-w-[44ch]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#08111F] text-[#14F195] shadow-[0_24px_60px_rgba(8,17,31,0.18)]">
              <Wallet size={26} />
            </div>
            <h1 className="mt-7 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#08111F]">
              {STRINGS.DASHBOARD_TITLE}
            </h1>
            <p className="mt-4 text-[15px] leading-[1.7] text-[#526071]">{STRINGS.WALLET_CONNECT_PROMPT}</p>
            <div className="mt-7 flex justify-center">
              <Button variant="primary" size="lg" onClick={connect}>
                {STRINGS.CONNECT_SOLFLARE}
                <ArrowUpRight size={16} />
              </Button>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#526071]">
              <ShieldCheck size={12} className="text-[#0EA56A]" />
              Self-custodial · keys never leave your wallet
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <Eyebrow>Portfolio</Eyebrow>
      </div>
      <PortfolioSummary positions={positions} loading={posLoading} error={posError} />
      <PositionsTable positions={positions} loading={posLoading} error={posError} />
      <TransactionHistory transactions={transactions} loading={txLoading} error={txError} />
    </div>
  );
};

export default Dashboard;
