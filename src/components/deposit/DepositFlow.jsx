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
import { StablecoinSelector } from './StablecoinSelector';
import { PrivacySelector } from './PrivacySelector';
import { RouteConfidence } from './RouteConfidence';
import { LocalRouteReview } from './LocalRouteReview';
import { useVaults } from '../../hooks/useVaults';
import { useBridgeQuote } from '../../hooks/useBridgeQuote';
import { useDepositFlow } from '../../hooks/useDepositFlow';
import { usePalmUsdCirculation } from '../../hooks/usePalmUsd';
import { useRouteConfidence } from '../../hooks/useRouteConfidence';
import { usePrivacyProvider } from '../../hooks/usePrivacyProvider';
import { useLocalRouteReview } from '../../hooks/useLocalRouteReview';
import { useWallet } from '../../context/WalletContext';
import { STRINGS, DEPOSIT_FLOW_STATES } from '../../lib/constants';
import { createRouteIntent } from '../../lib/routeIntent';
import { getPrivacyBoundary, PRIVACY_MODES } from '../../lib/stablecoins';
import { formatPercent, formatCurrency } from '../../lib/formatters';

export const DepositFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { connected, connect, address, signTransaction, signAllTransactions, evmAddress, walletAdapter, connection } = useWallet();
  const { data: vaults } = useVaults();
  const { data: quote, loading: quoteLoading, error: quoteError, getQuote } = useBridgeQuote();
  const depositFlow = useDepositFlow();

  const [fromChain, setFromChain] = useState('ethereum');
  const [fromToken, setFromToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [selectedVault, setSelectedVault] = useState('');
  const [privacyMode, setPrivacyMode] = useState(PRIVACY_MODES.STANDARD);
  const [showTxModal, setShowTxModal] = useState(false);
  const selectedVaultParam = searchParams.get('vault');
  const routeConfidence = useRouteConfidence();
  const localRouteReview = useLocalRouteReview();
  const privacyProvider = usePrivacyProvider({
    wallet: walletAdapter || { publicKey: address ? { toBase58: () => address } : null, signTransaction, signAllTransactions },
    connection,
  });
  const { data: pusdCirculation } = usePalmUsdCirculation({ enabled: fromToken === 'PUSD' });
  const vault = vaults?.find((v) => v.pubkey === selectedVault);
  const toToken = vault?.depositToken || 'USDC';

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
        getQuote({
          fromChain,
          fromToken,
          toChain: 'solana',
          toToken: vault?.depositToken || 'USDC',
          amount,
          fromAddress: evmAddress,
          toAddress: address,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [address, amount, evmAddress, fromChain, fromToken, getQuote, toToken]);
  const routeIntent = createRouteIntent({
    fromChain,
    fromToken,
    toToken,
    amount,
    vault: selectedVault,
    privacyMode,
    quote,
  });

  const handlePrivacyChange = useCallback(async (mode) => {
    setPrivacyMode(mode);
    if (mode === PRIVACY_MODES.STANDARD) return;
    if (!connected) return;
    await privacyProvider.loadProvider(mode);
  }, [connected, privacyProvider]);

  const handleConfidenceCheck = useCallback(() => {
    const walletAddress = fromChain === 'solana' ? address : evmAddress;
    routeConfidence.checkRoute({ chain: fromChain, walletAddress, tokenSymbol: fromToken });
  }, [address, evmAddress, fromChain, fromToken, routeConfidence]);

  const handleLocalReview = useCallback(() => {
    localRouteReview.review(routeIntent);
  }, [localRouteReview, routeIntent]);

  const handleDeposit = useCallback(async () => {
    if (!connected) {
      connect();
      return;
    }
    setShowTxModal(true);
    await depositFlow.execute({
      fromChain,
      fromToken,
      toToken,
      amount: Number(amount),
      vault: selectedVault,
      needsSwap: fromToken !== toToken,
      walletAddress: address,
      signTransaction,
      signAllTransactions,
      evmAddress,
      rawRoute: quote?.rawRoute || null,
    });
  }, [connected, connect, fromChain, fromToken, toToken, amount, selectedVault, depositFlow, address, signTransaction, signAllTransactions, evmAddress, quote]);

  const estimatedYield = vault && amount ? (Number(amount) * (vault.apy / 100)).toFixed(2) : null;
  const canDeposit = amount && Number(amount) > 0 && selectedVault && (!connected || (quote && !quoteError && !quoteLoading));

  return (
    <>
      <Card className="mx-auto max-w-lg !rounded-[30px] !p-6 lg:!p-7">
        {/* From section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body text-sg-text-secondary">{STRINGS.DEPOSIT_FROM}</span>
            <div className="flex items-center gap-2">
              <StablecoinSelector value={fromToken} onChange={setFromToken} />
              <ChainSelector value={fromChain} onChange={setFromChain} />
            </div>
          </div>
          <AmountInput
            value={amount}
            onChange={setAmount}
            token={fromToken}
            balance={null}
          />
          {fromToken === 'PUSD' && pusdCirculation ? (
            <p className="px-1 text-xs leading-5 text-sg-text-tertiary">
              Palm USD circulation: {formatCurrency(pusdCirculation.total, 0)}
            </p>
          ) : null}
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
                  ~{formatCurrency(quote.toAmount)} {toToken}
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
          {quoteError ? (
            <p className="mt-3 rounded-2xl border border-[#D6A84F]/30 bg-[#F8E6B6]/40 px-4 py-3 text-sm leading-6 text-[#654B2B]">
              {quoteError}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3">
          <PrivacySelector
            value={privacyMode}
            onChange={handlePrivacyChange}
            boundary={getPrivacyBoundary(privacyMode)}
            loading={privacyProvider.loading}
            error={privacyProvider.error}
          />
          <RouteConfidence
            confidence={routeConfidence.data}
            loading={routeConfidence.loading}
            onCheck={handleConfidenceCheck}
            disabled={!amount || !(fromChain === 'solana' ? address : evmAddress)}
          />
          <LocalRouteReview
            review={localRouteReview.data}
            loading={localRouteReview.loading}
            error={localRouteReview.error}
            onReview={handleLocalReview}
            disabled={!quote || !amount}
          />
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
             privacyMode,
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
