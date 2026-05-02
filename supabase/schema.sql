-- Yieldiz Supabase Schema
-- Run this in your Supabase SQL editor to set up all required tables
-- Docs: https://supabase.com/docs/guides/database

-- User preferences (synced across devices)
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID DEFAULT auth.uid(),
  wallet_address TEXT PRIMARY KEY,
  slippage_tolerance NUMERIC DEFAULT 0.5,
  preferred_chain TEXT DEFAULT 'solana',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Portfolio position snapshots (persisted for history/dashboard)
CREATE TABLE IF NOT EXISTS positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  wallet_address TEXT NOT NULL,
  vault_pubkey TEXT NOT NULL,
  vault_name TEXT,
  deposited_amount NUMERIC NOT NULL,
  deposited_token TEXT NOT NULL,
  shares_received NUMERIC,
  entry_apy NUMERIC,
  current_value NUMERIC,
  earned NUMERIC DEFAULT 0,
  tx_hash TEXT,
  source_chain TEXT DEFAULT 'solana',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transaction log (for the status tracker and history page)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  wallet_address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bridge', 'swap', 'deposit', 'withdraw')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'confirmed', 'failed')),
  amount NUMERIC,
  token TEXT,
  from_chain TEXT,
  to_chain TEXT,
  tx_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid();
ALTER TABLE positions ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid();
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_positions_wallet ON positions (wallet_address);
CREATE INDEX IF NOT EXISTS idx_positions_user ON positions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions (wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);

-- Row Level Security: each wallet sees only its own data
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_settings" ON user_settings;
DROP POLICY IF EXISTS "own_positions" ON positions;
DROP POLICY IF EXISTS "own_transactions" ON transactions;

CREATE POLICY "own_settings" ON user_settings
  FOR ALL
  USING (
    user_id = auth.uid()
    OR wallet_address = auth.jwt()->'user_metadata'->>'wallet_address'
  )
  WITH CHECK (
    user_id = auth.uid()
    OR wallet_address = auth.jwt()->'user_metadata'->>'wallet_address'
  );

CREATE POLICY "own_positions" ON positions
  FOR ALL
  USING (
    user_id = auth.uid()
    OR wallet_address = auth.jwt()->'user_metadata'->>'wallet_address'
  )
  WITH CHECK (
    user_id = auth.uid()
    OR wallet_address = auth.jwt()->'user_metadata'->>'wallet_address'
  );

CREATE POLICY "own_transactions" ON transactions
  FOR ALL
  USING (
    user_id = auth.uid()
    OR wallet_address = auth.jwt()->'user_metadata'->>'wallet_address'
  )
  WITH CHECK (
    user_id = auth.uid()
    OR wallet_address = auth.jwt()->'user_metadata'->>'wallet_address'
  );

-- Updated_at trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
