import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider, useWalletModal } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { DEMO_EVM_ADDRESS, DEMO_MODE, DEMO_WALLET_ADDRESS, SHOW_DEMO_DASHBOARD } from '../lib/env';

const WalletContext = createContext(null);

const QUICKNODE_RPC = import.meta.env.VITE_QUICKNODE_RPC_URL || 'https://api.devnet.solana.com';

function parseEvmChainId(chainId) {
  if (!chainId) return null;
  const parsed = typeof chainId === 'string' && chainId.startsWith('0x')
    ? Number.parseInt(chainId, 16)
    : Number(chainId);
  return Number.isFinite(parsed) ? parsed : null;
}

function readInjectedEvmState(provider) {
  return {
    address: provider?.selectedAddress || null,
    chainId: parseEvmChainId(provider?.chainId),
  };
}

// EVM wallet detection for cross-chain bridging
function useEVMWallet() {
  const [evmAddress, setEvmAddress] = useState(DEMO_MODE ? DEMO_EVM_ADDRESS : null);
  const [evmChainId, setEvmChainId] = useState(DEMO_MODE ? 1 : null);

  const connectEVM = useCallback(async () => {
    if (DEMO_MODE) {
      setEvmAddress(DEMO_EVM_ADDRESS);
      setEvmChainId(1);
      return DEMO_EVM_ADDRESS;
    }
    if (typeof window === 'undefined' || !window.ethereum) return null;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setEvmAddress(accounts[0] || null);
      setEvmChainId(parseEvmChainId(chainId));
      return accounts[0] || null;
    } catch (error) {
      if (error?.code !== 4001) {
        console.warn('EVM wallet connection failed:', error);
      }
      return null;
    }
  }, []);

  const disconnectEVM = useCallback(() => {
    if (DEMO_MODE) {
      setEvmAddress(DEMO_EVM_ADDRESS);
      setEvmChainId(1);
      return;
    }
    setEvmAddress(null);
    setEvmChainId(null);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) {
      setEvmAddress(DEMO_EVM_ADDRESS);
      setEvmChainId(1);
      return undefined;
    }
    if (typeof window === 'undefined' || !window.ethereum) return;
    const initialState = readInjectedEvmState(window.ethereum);
    setEvmAddress(initialState.address);
    setEvmChainId(initialState.chainId);

    const handleAccountsChanged = (accounts) => setEvmAddress(accounts[0] || null);
    const handleChainChanged = (chainId) => setEvmChainId(parseEvmChainId(chainId));
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return { evmAddress, evmChainId, connectEVM, disconnectEVM, hasEVM: DEMO_MODE || (typeof window !== 'undefined' && !!window.ethereum) };
}

// Inner provider that wraps Solana wallet adapter hooks with our context API
const WalletContextBridge = ({ children }) => {
  const { publicKey, connected, connecting, connect: connectSelectedWallet, disconnect, wallet, signMessage, signTransaction, signAllTransactions } = useSolanaWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);
  const evm = useEVMWallet();

  const address = publicKey?.toBase58() || null;
  const demoDashboardActive = DEMO_MODE || (SHOW_DEMO_DASHBOARD && !connected);

  // Fetch SOL balance when connected
  useEffect(() => {
    if (!publicKey || !connection) { setBalance(null); return; }
    let cancelled = false;
    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey);
        if (!cancelled) setBalance(lamports / 1e9);
      } catch {
        if (!cancelled) setBalance(null);
      }
    };
    fetchBalance();
    const id = connection.onAccountChange(publicKey, (info) => {
      if (!cancelled) setBalance(info.lamports / 1e9);
    });
    return () => { cancelled = true; connection.removeAccountChangeListener(id); };
  }, [publicKey, connection]);

  const connect = useCallback(async () => {
    if (wallet?.adapter) {
      try {
        await connectSelectedWallet();
        return;
      } catch (error) {
        if (error?.name !== 'WalletConnectionError') {
          console.warn('Wallet connection failed:', error);
        }
      }
    }
    setWalletModalVisible(true);
  }, [connectSelectedWallet, setWalletModalVisible, wallet?.adapter]);

  return (
    <WalletContext.Provider
      value={{
        connected: connected || demoDashboardActive,
        connecting,
        address: demoDashboardActive ? DEMO_WALLET_ADDRESS : address,
        balance: demoDashboardActive ? 4.28 : balance,
        connect,
        disconnect: demoDashboardActive ? () => {} : disconnect,
        publicKey,
        walletAdapter: wallet?.adapter || null,
        connection,
        signMessage,
        signTransaction,
        signAllTransactions,
        // EVM wallet for cross-chain bridging
        evmAddress: evm.evmAddress,
        evmChainId: evm.evmChainId,
        connectEVM: evm.connectEVM,
        disconnectEVM: evm.disconnectEVM,
        hasEVM: evm.hasEVM,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const WalletProvider = ({ children }) => {
  const wallets = useMemo(() => [], []);
  const endpoint = QUICKNODE_RPC;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextBridge>
            {children}
          </WalletContextBridge>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
