// Shared Supabase client. Auth is optional and enabled via VITE_SUPABASE_AUTH_MODE=anonymous.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasUsableValue = (value) => Boolean(value) && !String(value).includes('your-');

export const isSupabaseConfigured = hasUsableValue(supabaseUrl) && hasUsableValue(supabaseAnonKey);

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
