import { useCallback, useState } from 'react';
import { PRIVACY_MODES } from '../lib/stablecoins';
import { createCloakProvider, createUmbraProvider } from '../services/privacyProviders';

export function usePrivacyProvider({ wallet, connection }) {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProvider = useCallback(async (mode) => {
    if (mode === PRIVACY_MODES.STANDARD) {
      setProvider(null);
      setError(null);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const loaded = mode === PRIVACY_MODES.CLOAK
        ? await createCloakProvider({ wallet, connection })
        : await createUmbraProvider({
          wallet,
          rpcUrl: import.meta.env.VITE_QUICKNODE_RPC_URL || 'https://api.devnet.solana.com',
          rpcSubscriptionsUrl: import.meta.env.VITE_QUICKNODE_WSS_URL || 'wss://api.devnet.solana.com',
        });
      setProvider(loaded);
      return loaded;
    } catch (err) {
      setError(err.message);
      setProvider(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [connection, wallet]);

  return { provider, loading, error, loadProvider };
}
