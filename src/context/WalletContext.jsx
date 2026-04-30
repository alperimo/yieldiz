import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContext = createContext(null);

const QUICKNODE_RPC = import.meta.env.VITE_QUICKNODE_RPC_URL || 'https://api.devnet.solana.com';

function parseEvmChainId(chainId) {
  if (!chainId) return null;
  const parsed = typeof chainId === 'string' && chainId.startsWith('0x')
    ? Number.parseInt(chainId, 16)
    : Number(chainId);
  return Number.isFinite(parsed) ? parsed : null;
}

// EVM wallet detection for cross-chain bridging
function useEVMWallet() {
  const [evmAddress, setEvmAddress] = useState(null);
  const [evmChainId, setEvmChainId] = useState(null);

  const connectEVM = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return null;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setEvmAddress(accounts[0] || null);
      setEvmChainId(parseEvmChainId(chainId));
      return accounts[0] || null;
    } catch (error) {
      console.warn('EVM wallet connection failed:', error);
      return null;
    }
  }, []);

  const disconnectEVM = useCallback(() => {
    setEvmAddress(null);
    setEvmChainId(null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const handleAccountsChanged = (accounts) => setEvmAddress(accounts[0] || null);
    const handleChainChanged = (chainId) => setEvmChainId(parseEvmChainId(chainId));
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    Promise.all([
      window.ethereum.request({ method: 'eth_accounts' }),
      window.ethereum.request({ method: 'eth_chainId' }),
    ]).then(([accounts, chainId]) => {
      setEvmAddress(accounts[0] || null);
      setEvmChainId(parseEvmChainId(chainId));
    }).catch((error) => {
      console.warn('EVM wallet state could not be read:', error);
    });
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return { evmAddress, evmChainId, connectEVM, disconnectEVM, hasEVM: typeof window !== 'undefined' && !!window.ethereum };
}

// Inner provider that wraps Solana wallet adapter hooks with our context API
const WalletContextBridge = ({ children }) => {
  const { publicKey, connected, connecting, disconnect, select, wallets, wallet, signMessage, signTransaction, signAllTransactions } = useSolanaWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);
  const evm = useEVMWallet();

  const address = publicKey?.toBase58() || null;

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

  // Connect helper: select Solflare by default
  const connect = useCallback(() => {
    const solflare = wallets.find((w) => w.adapter.name === 'Solflare');
    if (solflare) select(solflare.adapter.name);
  }, [wallets, select]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        address,
        balance,
        connect,
        disconnect,
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
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
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
