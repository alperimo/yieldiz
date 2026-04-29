import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { AmountInput } from './AmountInput';
import { ChainSelector } from './ChainSelector';
import { VaultSelector } from './VaultSelector';
import { RouteDetails } from './RouteDetails';
import { TransactionTracker } from './TransactionTracker';
import { useVaults } from '../../hooks/useVaults';
import { useBridgeQuote } from '../../hooks/useBridgeQuote';
import { useDepositFlow } from '../../hooks/useDepositFlow';
import { useWallet } from '../../context/WalletContext';
import { STRINGS, DEPOSIT_FLOW_STATES } from '../../lib/constants';
import { formatPercent, formatCurrency } from '../../lib/formatters';

export const DepositFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { connected, connect, address, balance, signTransaction, signAllTransactions, evmAddress } = useWallet();
  const { data: vaults } = useVaults();
  const { data: quote, loading: quoteLoading, getQuote } = useBridgeQuote();
  const depositFlow = useDepositFlow();

  const [fromChain, setFromChain] = useState('ethereum');
  const [fromToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [selectedVault, setSelectedVault] = useState('');
  const [showTxModal, setShowTxModal] = useState(false);
  const selectedVaultParam = searchParams.get('vault');

  // Auto-select vault from URL when available, otherwise fall back to the top vault.
  useEffect(() => {
    if (!vaults?.length) return;

    const hasParamMatch = selectedVaultParam && vaults.some((vault) => vault.pubkey === selectedVaultParam);

    if (hasParamMatch) {
      setSelectedVault(selectedVaultParam);
      return;
    }

    if (!selectedVault) {
      setSelectedVault(vaults[0].pubkey);
    }
  }, [vaults, selectedVault, selectedVaultParam]);

  useEffect(() => {
    if (!selectedVault || searchParams.get('vault') === selectedVault) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('vault', selectedVault);
    setSearchParams(nextParams, { replace: true });
  }, [selectedVault, searchParams, setSearchParams]);

  // Fetch quote when params change
  useEffect(() => {
    if (amount && Number(amount) > 0 && fromChain) {
      const timer = setTimeout(() => {
        getQuote({ fromChain, fromToken, toChain: 'solana', toToken: 'USDC', amount });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [amount, fromChain, fromToken, getQuote]);

  const vault = vaults?.find((v) => v.pubkey === selectedVault);

  const handleDeposit = useCallback(async () => {
    if (!connected) {
      connect();
      return;
    }
    setShowTxModal(true);
    await depositFlow.execute({
      fromChain,
      amount: Number(amount),
      vault: selectedVault,
      needsSwap: false,
      walletAddress: address,
      signTransaction,
      signAllTransactions,
      evmAddress,
      rawRoute: quote?.rawRoute || null,
    });
  }, [connected, connect, fromChain, amount, selectedVault, depositFlow, address, signTransaction, signAllTransactions, evmAddress, quote]);

  const estimatedYield = vault && amount ? (Number(amount) * (vault.apy / 100)).toFixed(2) : null;
  const canDeposit = amount && Number(amount) > 0 && selectedVault;

  return (
    <>
      <Card className="mx-auto max-w-lg !rounded-[30px] !p-6 lg:!p-7">
        {/* From section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body text-sg-text-secondary">{STRINGS.DEPOSIT_FROM}</span>
            <ChainSelector value={fromChain} onChange={setFromChain} />
          </div>
          <AmountInput
            value={amount}
            onChange={setAmount}
            token={fromToken}
            balance={balance ?? 0}
            onMax={() => setAmount(String(balance ?? 0))}
          />
        </div>

        {/* Arrow divider */}
        <div className="flex justify-center py-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.08] bg-white ${quoteLoading ? 'pulse-glow' : ''}`}>
            <ArrowDown size={18} className="text-sg-accent-purple" />
          </div>
        </div>

        {/* To section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body text-sg-text-secondary">{STRINGS.DEPOSIT_TO}</span>
            <Badge variant="purple">Solana</Badge>
          </div>
          <div className="rounded-[24px] border border-black/[0.06] bg-[rgba(255,255,255,0.92)] p-4 shadow-[0_16px_35px_rgba(126,77,34,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <VaultSelector
                vaults={vaults}
                value={selectedVault}
                onChange={setSelectedVault}
              />
              {vault ? (
                <Badge variant="green">
                  APY: {formatPercent(vault.apy)}
                </Badge>
              ) : null}
            </div>
            {quote && amount ? (
              <div className="space-y-1">
                <p className="text-money-sm text-sg-text">
                  ~{formatCurrency(quote.toAmount)} {fromToken}
                </p>
                {estimatedYield ? (
                  <p className="text-caption text-sg-accent-green">
                    {STRINGS.DEPOSIT_ESTIMATED_YIELD}: ~{formatCurrency(Number(estimatedYield))}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-body text-sg-text-tertiary">
                {STRINGS.DEPOSIT_AMOUNT_PLACEHOLDER}
              </p>
            )}
          </div>
        </div>

        {/* Route details */}
        <div className="mt-4">
          <RouteDetails quote={quote} />
        </div>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full mt-6"
          onClick={handleDeposit}
          disabled={!canDeposit || depositFlow.isActive}
          loading={depositFlow.isActive}
        >
          <Zap size={18} />
          {!connected ? STRINGS.CONNECT_WALLET : STRINGS.HERO_CTA}
        </Button>
      </Card>

      {/* Transaction Status Modal */}
      <Modal
        isOpen={showTxModal}
        onClose={() => {
          if (!depositFlow.isActive) {
            setShowTxModal(false);
            depositFlow.reset();
          }
        }}
        title={STRINGS.TX_IN_PROGRESS}
      >
        <TransactionTracker
          flowState={depositFlow.state}
          currentStep={depositFlow.currentStep}
          steps={depositFlow.steps}
          txHashes={depositFlow.txHashes}
          depositInfo={{
            fromChain,
            amount: Number(amount),
            token: fromToken,
            totalFees: quote ? quote.bridgeFee + quote.networkFee : 0,
            apy: vault?.apy || 0,
            steps: quote?.steps || [],
          }}
          onClose={() => {
            setShowTxModal(false);
            depositFlow.reset();
          }}
        />
      </Modal>
    </>
  );
};
