import { DEMO_WALLET_ADDRESS } from '../lib/env';

const STORAGE_KEY = 'yieldiz:demo-portfolio';

function nowMinus(ms) {
  return new Date(Date.now() - ms).toISOString();
}

function seedPositions(walletAddress = DEMO_WALLET_ADDRESS) {
  return [
    {
      id: 'demo-pos-001',
      walletAddress,
      vaultPubkey: 'ByYRio3rVhzEofPsckfCEfXgsWirHbgFkTKDMbMCHe4Z',
      vaultName: 'USDC Multiply',
      depositedAmount: 3000,
      depositedToken: 'USDC',
      sharesReceived: 2985.5,
      entryApy: 8.2,
      currentValue: 3028.4,
      earned: 28.4,
      txHash: '5kYmZ8R4hJDnPtVJgRFnTVbMQD6K1qLPfCaKEvR3ZABC',
      sourceChain: 'ethereum',
      createdAt: nowMinus(30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'demo-pos-002',
      walletAddress,
      vaultPubkey: '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc',
      vaultName: 'SOL-USDC LP',
      depositedAmount: 2230,
      depositedToken: 'USDC',
      sharesReceived: 2210.8,
      entryApy: 12.1,
      currentValue: 2243.78,
      earned: 13.78,
      txHash: '3xPqR7sKdVnWY5tNGhBcME9jQZFw8L2UvACpXS1TDEF1',
      sourceChain: 'arbitrum',
      createdAt: nowMinus(5 * 24 * 60 * 60 * 1000),
    },
  ];
}

function seedTransactions(walletAddress = DEMO_WALLET_ADDRESS) {
  return [
    {
      id: 'demo-tx-001',
      walletAddress,
      type: 'deposit',
      status: 'confirmed',
      amount: 1000,
      token: 'USDC',
      fromChain: 'ethereum',
      toChain: 'solana',
      txHash: '5kYmZ8R4hJDnPtVJgRFnTVbMQD6K1qLPfCaKEvR3ZABC',
      metadata: { vaultName: 'USDC Multiply', apy: 8.2, route: 'LI.FI / Stargate' },
      createdAt: nowMinus(2 * 60 * 60 * 1000),
      updatedAt: nowMinus(2 * 60 * 60 * 1000),
    },
    {
      id: 'demo-tx-002',
      walletAddress,
      type: 'bridge',
      status: 'confirmed',
      amount: 1000,
      token: 'USDC',
      fromChain: 'ethereum',
      toChain: 'solana',
      txHash: '0xa3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      metadata: { bridge: 'Stargate', route: 'LI.FI' },
      createdAt: nowMinus(2 * 60 * 60 * 1000 + 60000),
      updatedAt: nowMinus(2 * 60 * 60 * 1000),
    },
    {
      id: 'demo-tx-003',
      walletAddress,
      type: 'deposit',
      status: 'confirmed',
      amount: 2230,
      token: 'USDC',
      fromChain: 'arbitrum',
      toChain: 'solana',
      txHash: '3xPqR7sKdVnWY5tNGhBcME9jQZFw8L2UvACpXS1TDEF1',
      metadata: { vaultName: 'SOL-USDC LP', apy: 12.1 },
      createdAt: nowMinus(5 * 24 * 60 * 60 * 1000),
      updatedAt: nowMinus(5 * 24 * 60 * 60 * 1000),
    },
  ];
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readStore() {
  if (!canUseStorage()) return { positions: [], transactions: [] };

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      positions: Array.isArray(parsed.positions) ? parsed.positions : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch (error) {
    console.warn('Demo portfolio cache was invalid and has been reset:', error);
    window.localStorage.removeItem(STORAGE_KEY);
    return { positions: [], transactions: [] };
  }
}

function writeStore(store) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function byNewestCreatedAt(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function getDemoPositions(walletAddress) {
  const stored = readStore().positions.filter((position) => position.walletAddress === walletAddress);
  const seeded = walletAddress ? seedPositions(walletAddress) : [];
  return [...stored, ...seeded].sort(byNewestCreatedAt);
}

export function getDemoTransactions(walletAddress) {
  const stored = readStore().transactions.filter((transaction) => transaction.walletAddress === walletAddress);
  const seeded = walletAddress ? seedTransactions(walletAddress) : [];
  return [...stored, ...seeded].sort(byNewestCreatedAt);
}

export function recordDemoDeposit({ walletAddress, vault, amount, token, fromChain, txHashes, quote, privacyMode, benefitCampaign }) {
  const timestamp = new Date().toISOString();
  const depositHash = txHashes?.deposit || `demo-deposit-${Date.now()}`;
  const bridgeHash = txHashes?.bridge || null;
  const swapHash = txHashes?.swap || null;
  const fees = quote
    ? Number(quote.bridgeFee || 0) + Number(quote.networkFee || 0) + Number(quote.platformFee || 0)
    : 0;
  const currentValue = quote?.toAmount || amount;
  const benefitMetadata = benefitCampaign ? { benefit_campaign: benefitCampaign } : {};

  const position = {
    id: `demo-position-${depositHash}`,
    walletAddress,
    vaultPubkey: vault.pubkey,
    vaultName: vault.name,
    depositedAmount: amount,
    depositedToken: token,
    sharesReceived: Number((currentValue * 0.995).toFixed(4)),
    entryApy: vault.apy,
    currentValue,
    earned: 0,
    txHash: depositHash,
    sourceChain: fromChain,
    createdAt: timestamp,
  };

  const transactions = [
    bridgeHash
      ? {
          id: `demo-bridge-${bridgeHash}`,
          walletAddress,
          type: 'bridge',
          status: 'confirmed',
          amount,
          token,
          fromChain,
          toChain: 'solana',
          txHash: bridgeHash,
          metadata: { route: quote?.route || 'LI.FI', fees, ...benefitMetadata },
          createdAt: timestamp,
          updatedAt: timestamp,
        }
      : null,
    swapHash
      ? {
          id: `demo-swap-${swapHash}`,
          walletAddress,
          type: 'swap',
          status: 'confirmed',
          amount,
          token,
          fromChain: 'solana',
          toChain: 'solana',
          txHash: swapHash,
          metadata: { route: 'DFlow', privacy_mode: privacyMode, ...benefitMetadata },
          createdAt: timestamp,
          updatedAt: timestamp,
        }
      : null,
    {
      id: `demo-deposit-${depositHash}`,
      walletAddress,
      type: 'deposit',
      status: 'confirmed',
      amount,
      token,
      fromChain,
      toChain: 'solana',
      txHash: depositHash,
      metadata: {
        vaultName: vault.name,
        apy: vault.apy,
        route: quote?.route || null,
        privacy_mode: privacyMode,
        fees,
        ...benefitMetadata,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ].filter(Boolean);

  const store = readStore();
  writeStore({
    positions: [
      position,
      ...store.positions.filter((item) => item.id !== position.id),
    ].slice(0, 10),
    transactions: [
      ...transactions,
      ...store.transactions.filter((item) => !transactions.some((tx) => tx.id === item.id)),
    ].slice(0, 20),
  });

  return { position, transactions };
}
