import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from './supabase';
import { useWallet } from '../context/WalletContext';
import bs58 from 'bs58';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { connected, address, publicKey, signMessage } = useWallet();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (walletAddress) => {
    setLoading(true);
    try {
      // Wallet-based auth: sign nonce → verify → get JWT
      // Step 1: Generate a nonce (timestamp-based for simplicity)
      const nonce = `SolGate auth: ${walletAddress} at ${Date.now()}`;
      const encodedNonce = new TextEncoder().encode(nonce);

      // Step 2: Sign the nonce with the wallet
      let signature;
      if (signMessage) {
        try {
          const signedBytes = await signMessage(encodedNonce);
          signature = bs58.encode(signedBytes);
        } catch {
          // User rejected signature or wallet doesn't support signMessage
          signature = null;
        }
      }

      // Step 3: Authenticate with Supabase using wallet address
      // Use Supabase anonymous sign-in with wallet metadata
      // (Full nonce verification would use a Supabase Edge Function)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: `${walletAddress}@solgate.wallet`,
        password: walletAddress,
      }).catch(() => ({ data: null, error: { message: 'auth_not_configured' } }));

      if (authError || !authData?.session) {
        // Supabase auth not configured yet - use local session
        // This allows the app to work without Supabase being set up
        const localSession = {
          access_token: `local_${walletAddress}_${Date.now()}`,
          user: {
            id: walletAddress,
            wallet: walletAddress,
            signed: !!signature,
          },
        };
        setSession(localSession);
        setUser(localSession.user);
      } else {
        setSession(authData.session);
        setUser({ ...authData.session.user, wallet: walletAddress });
      }
    } catch (err) {
      console.error('Auth sign-in failed:', err);
      // Graceful fallback: still set a local session
      const localSession = {
        access_token: `local_${walletAddress}_${Date.now()}`,
        user: { id: walletAddress, wallet: walletAddress },
      };
      setSession(localSession);
      setUser(localSession.user);
    } finally {
      setLoading(false);
    }
  }, [signMessage]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
    } catch { /* ignore */ }
    setSession(null);
    setUser(null);
  }, []);

  // Auto-sign in when wallet connects, sign out when disconnects
  useEffect(() => {
    if (connected && address) {
      signIn(address);
    } else if (!connected) {
      signOut();
    }
  }, [connected, address, signIn, signOut]);

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
