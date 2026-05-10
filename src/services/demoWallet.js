import { DEMO_SOURCE_BALANCES } from '../lib/env';

const STORAGE_KEY = 'yieldiz:demo-wallet';
const DEFAULT_TOKEN = 'USDC';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function createDefaultState() {
  return {
    selectedToken: DEFAULT_TOKEN,
    balances: { ...DEMO_SOURCE_BALANCES },
  };
}

function readAllStates() {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('Demo wallet state was invalid and has been reset:', error);
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

function writeAllStates(states) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

export function getDemoWalletState(walletAddress) {
  if (!walletAddress) return createDefaultState();

  const states = readAllStates();
  const current = states[walletAddress];

  return {
    ...createDefaultState(),
    ...(current && typeof current === 'object' ? current : {}),
    balances: {
      ...DEMO_SOURCE_BALANCES,
      ...(current?.balances && typeof current.balances === 'object' ? current.balances : {}),
    },
  };
}

export function setDemoWalletState(walletAddress, nextState) {
  if (!walletAddress) return createDefaultState();

  const states = readAllStates();
  const merged = {
    ...createDefaultState(),
    ...nextState,
    balances: {
      ...DEMO_SOURCE_BALANCES,
      ...(nextState?.balances && typeof nextState.balances === 'object' ? nextState.balances : {}),
    },
  };

  writeAllStates({
    ...states,
    [walletAddress]: merged,
  });

  return merged;
}

export function setDemoSelectedToken(walletAddress, token) {
  const state = getDemoWalletState(walletAddress);
  return setDemoWalletState(walletAddress, {
    ...state,
    selectedToken: token || DEFAULT_TOKEN,
  });
}

export function debitDemoBalance(walletAddress, token, amount) {
  const state = getDemoWalletState(walletAddress);
  const numericAmount = Number(amount || 0);
  const safeAmount = Number.isFinite(numericAmount) && numericAmount > 0 ? numericAmount : 0;
  const nextBalance = Math.max(0, Number((Number(state.balances[token] || 0) - safeAmount).toFixed(6)));

  return setDemoWalletState(walletAddress, {
    ...state,
    balances: {
      ...state.balances,
      [token]: nextBalance,
    },
  });
}
