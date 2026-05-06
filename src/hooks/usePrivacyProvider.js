import { useCallback, useState } from 'react';
import { PRIVACY_MODES } from '../lib/stablecoins';

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
      const privacyProviders = await import('../services/privacyProviders');
      const loaded = mode === PRIVACY_MODES.CLOAK
        ? await privacyProviders.createCloakProvider({ wallet, connection })
        : await privacyProviders.createUmbraProvider({
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
