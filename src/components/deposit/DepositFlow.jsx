import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowDown, X, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AmountInput } from './AmountInput';
import { ChainSelector } from './ChainSelector';
import { VaultSelector } from './VaultSelector';
import { RouteDetails } from './RouteDetails';
import { TransactionTracker } from './TransactionTracker';
import { StablecoinSelector } from './StablecoinSelector';
import { PrivacySelector } from './PrivacySelector';
import { PrivacyReadiness } from './PrivacyReadiness';
import { RouteConfidence } from './RouteConfidence';
import { LocalRouteReview } from './LocalRouteReview';
import { BenefitCampaignCard } from './BenefitCampaignCard';
import { useVaults } from '../../hooks/useVaults';
import { useBridgeQuote } from '../../hooks/useBridgeQuote';
import { useDepositFlow } from '../../hooks/useDepositFlow';
import { usePalmUsdCirculation } from '../../hooks/usePalmUsd';
import { useRouteConfidence } from '../../hooks/useRouteConfidence';
import { usePrivacyProvider } from '../../hooks/usePrivacyProvider';
import { useLocalRouteReview } from '../../hooks/useLocalRouteReview';
import { useWallet } from '../../context/WalletContext';
import { useSupabase } from '../../lib/useSupabase';
import * as portfolioStore from '../../services/portfolioStore';
import { STRINGS, DEPOSIT_FLOW_STATES } from '../../lib/constants';
import { createRouteIntent } from '../../lib/routeIntent';
import { getPrivacyBoundary, PRIVACY_MODES } from '../../lib/stablecoins';
import { formatPercent, formatCurrency } from '../../lib/formatters';
import { DEMO_MODE, USE_MOCK_DATA } from '../../lib/env';
import { getBenefitCampaignFromSearchParams, serializeBenefitCampaign } from '../../lib/benefitCampaign';
import * as demoPortfolio from '../../services/demoPortfolio';

export const DepositFlow = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    connected,
    connect,
    address,
    signTransaction,
    signAllTransactions,
    evmAddress,
    connectEVM,
    hasEVM,
    walletAdapter,
    connection,
    demoSourceBalances,
    setDemoSourceToken,
    debitDemoSourceBalance,
  } = useWallet();
  const { supabase, isAuthenticated } = useSupabase();
  const { data: vaults } = useVaults();
  const { data: quote, loading: quoteLoading, error: quoteError, getQuote } = useBridgeQuote();
  const depositFlow = useDepositFlow();

  const [fromChain, setFromChain] = useState('ethereum');
  const [fromToken, setFromToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [selectedVault, setSelectedVault] = useState('');
  const [privacyMode, setPrivacyMode] = useState(PRIVACY_MODES.STANDARD);
  const [showTxModal, setShowTxModal] = useState(false);
  const [persistenceError, setPersistenceError] = useState(null);
  const persistedSnapshotKey = useRef(null);
  const txPanelRef = useRef(null);
  const selectedVaultParam = searchParams.get('vault');
  const routeConfidence = useRouteConfidence();
  const localRouteReview = useLocalRouteReview();
  const benefitCampaign = useMemo(
    () => getBenefitCampaignFromSearchParams(searchParams),
    [searchParams],
  );
  const benefitMetadata = useMemo(
    () => serializeBenefitCampaign(benefitCampaign),
    [benefitCampaign],
  );
  const privacyProvider = usePrivacyProvider({
    wallet: walletAdapter || { publicKey: address ? { toBase58: () => address } : null, signTransaction, signAllTransactions },
    connection,
  });
  const { data: pusdCirculation } = usePalmUsdCirculation({ enabled: fromToken === 'PUSD' });
  const vault = vaults?.find((v) => v.pubkey === selectedVault);
  const toToken = vault?.depositToken || 'USDC';

  // Auto-select vault from URL on first load, otherwise preserve explicit user selection.
  useEffect(() => {
    if (!vaults?.length) return;

    const selectedVaultStillExists = selectedVault && vaults.some((vault) => vault.pubkey === selectedVault);
    if (selectedVaultStillExists) return;

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

  useEffect(() => {
    if (!DEMO_MODE || !connected) return;
    setDemoSourceToken(fromToken);
  }, [connected, fromToken, setDemoSourceToken]);

  // Fetch quote when params change
  useEffect(() => {
    if (!amount || Number(amount) <= 0 || !fromChain) {
      getQuote({ fromChain, amount });
      return undefined;
    }

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
  }, [address, amount, evmAddress, fromChain, fromToken, getQuote, toToken]);
  const routeIntent = createRouteIntent({
    fromChain,
    fromToken,
    toToken,
    amount,
    vault: selectedVault,
    privacyMode,
    quote,
    benefitCampaign: benefitMetadata,
  });

  useEffect(() => {
    if (depositFlow.state !== DEPOSIT_FLOW_STATES.CONFIRMED) return;
    if (!address || !vault || !amount) return;

    const snapshotKey = `${address}:${depositFlow.txHashes.deposit || 'mock'}:${selectedVault}:${amount}:${fromToken}`;
    if (persistedSnapshotKey.current === snapshotKey) return;
    persistedSnapshotKey.current = snapshotKey;
    setPersistenceError(null);

    if (DEMO_MODE || USE_MOCK_DATA) {
      try {
        if (DEMO_MODE) {
          const totalDebit = Number(amount) + Number(quote?.bridgeFee || 0) + Number(quote?.networkFee || 0) + Number(quote?.platformFee || 0);
          debitDemoSourceBalance(fromToken, totalDebit);
        }
        demoPortfolio.recordDemoDeposit({
          walletAddress: address,
          vault,
          amount: Number(amount),
          token: fromToken,
          fromChain,
          txHashes: depositFlow.txHashes,
          quote,
          privacyMode,
          benefitCampaign: benefitMetadata,
        });
      } catch (error) {
        setPersistenceError(error.message);
        console.error('Failed to persist demo deposit snapshot:', error);
      }
      return;
    }

    if (!isAuthenticated || !supabase) return;

    portfolioStore.recordDepositSnapshot(supabase, {
      walletAddress: address,
      vault,
      amount: Number(amount),
      token: fromToken,
      fromChain,
      txHashes: depositFlow.txHashes,
      quote,
      privacyMode,
      benefitCampaign: benefitMetadata,
    }).catch((error) => {
      setPersistenceError(error.message);
      console.error('Failed to persist deposit snapshot:', error);
    });
  }, [address, amount, benefitMetadata, debitDemoSourceBalance, depositFlow.state, depositFlow.txHashes, fromChain, fromToken, isAuthenticated, privacyMode, quote, selectedVault, supabase, vault]);

  useEffect(() => {
    if (!showTxModal) return undefined;
    const frame = window.requestAnimationFrame(() => {
      txPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [depositFlow.state, showTxModal]);

  const handlePrivacyChange = useCallback(async (mode) => {
    setPrivacyMode(mode);
    if (mode === PRIVACY_MODES.STANDARD) return;
    if (!connected) return;
    await privacyProvider.loadProvider(mode);
  }, [connected, privacyProvider]);

  const handleConfidenceCheck = useCallback(async () => {
    let walletAddress = fromChain === 'solana' ? address : evmAddress;
    if (fromChain !== 'solana' && !walletAddress && hasEVM) {
      walletAddress = await connectEVM();
    }
    routeConfidence.checkRoute({ chain: fromChain, walletAddress, tokenSymbol: fromToken });
  }, [address, connectEVM, evmAddress, fromChain, fromToken, hasEVM, routeConfidence]);

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
  const privacyRouteNeedsSetup = privacyMode !== PRIVACY_MODES.STANDARD;
  const canDeposit = amount && Number(amount) > 0 && selectedVault && !privacyRouteNeedsSetup && (!connected || (quote && !quoteError && !quoteLoading));
  const sourceBalance = DEMO_MODE && connected ? demoSourceBalances?.[fromToken] ?? null : null;

  return (
    <>
      <Card className="relative mx-auto max-w-lg overflow-hidden !rounded-[30px] !p-6 lg:!p-7">
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
            balance={sourceBalance}
            onMax={sourceBalance ? () => setAmount(String(sourceBalance)) : undefined}
          />
          <BenefitCampaignCard
            campaign={benefitCampaign}
            connected={connected}
            amount={amount}
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
          {persistenceError ? (
            <p className="mt-3 rounded-2xl border border-sg-warning/30 bg-sg-warning/10 px-4 py-3 text-sm leading-6 text-sg-text-secondary">
              Deposit confirmed, but portfolio history could not be saved: {persistenceError}
            </p>
          ) : null}
          {privacyRouteNeedsSetup ? (
            <p className="mt-3 rounded-2xl border border-[#D6A84F]/30 bg-[#F8E6B6]/40 px-4 py-3 text-sm leading-6 text-[#654B2B]">
              Privacy mode is prepared separately before the public vault deposit. Use the standard route for direct deposits until the selected privacy provider flow is validated in your demo network.
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3">
          <PrivacySelector
            value={privacyMode}
            onChange={handlePrivacyChange}
            boundary={getPrivacyBoundary(privacyMode)}
            loading={privacyProvider.loading}
            error={privacyProvider.error || privacyProvider.provider?.reason}
          />
          <PrivacyReadiness
            mode={privacyMode}
            provider={privacyProvider.provider}
            loading={privacyProvider.loading}
            error={privacyProvider.error || privacyProvider.provider?.reason}
            connected={connected}
            onLoadProvider={privacyProvider.loadProvider}
          />
          <RouteConfidence
            confidence={routeConfidence.data}
            loading={routeConfidence.loading}
            onCheck={handleConfidenceCheck}
            disabled={!connected || !amount || (fromChain === 'solana' ? !address : !hasEVM)}
          />
          <LocalRouteReview
            review={localRouteReview.data}
            loading={localRouteReview.loading}
            error={localRouteReview.error}
            onReview={handleLocalReview}
            disabled={!amount}
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

        {showTxModal ? (
          <div className="absolute inset-0 z-20 overflow-y-auto rounded-[30px] bg-white/62 p-4 backdrop-blur-[10px]">
            <div
              ref={txPanelRef}
              className="mx-auto my-4 max-w-[440px] rounded-[26px] border border-black/[0.08] bg-white/[0.96] p-4 shadow-[0_28px_90px_rgba(42,26,11,0.20)]"
              aria-live="polite"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sg-text-secondary">Deposit status</p>
                  <h2 className="mt-1 font-display text-[22px] font-semibold text-sg-text">{STRINGS.TX_IN_PROGRESS}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowTxModal(false);
                    depositFlow.reset();
                  }}
                  disabled={depositFlow.isActive}
                  className="rounded-full border border-black/[0.08] bg-white p-2 text-sg-text-tertiary transition-colors hover:text-sg-text disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Close deposit status"
                >
                  <X size={16} />
                </button>
              </div>
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
                  totalFees: quote ? quote.bridgeFee + quote.networkFee + Number(quote.platformFee || 0) : 0,
                  apy: vault?.apy || 0,
                  steps: quote?.steps || [],
                }}
                error={depositFlow.error}
                onBackToDashboard={() => navigate('/app/dashboard')}
              />
            </div>
          </div>
        ) : null}
      </Card>
    </>
  );
};
