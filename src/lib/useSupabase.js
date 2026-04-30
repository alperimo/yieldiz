// useSupabase Hook - shared access to the single Supabase browser client.

import { useAuth } from './auth-context';
import { supabase, isSupabaseConfigured } from './supabase';

export function useSupabase() {
  const { session, user } = useAuth();

  return {
    supabase,
    isConfigured: isSupabaseConfigured,
    isAuthenticated: isSupabaseConfigured && !!session?.access_token && !session.access_token.startsWith('local_'),
    user,
  };
}
