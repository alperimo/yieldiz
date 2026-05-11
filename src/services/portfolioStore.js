function toCamelPosition(row) {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    vaultPubkey: row.vault_pubkey,
    vaultName: row.vault_name,
    depositedAmount: Number(row.deposited_amount || 0),
    depositedToken: row.deposited_token,
    sharesReceived: row.shares_received == null ? null : Number(row.shares_received),
    entryApy: row.entry_apy == null ? null : Number(row.entry_apy),
    currentValue: row.current_value == null ? null : Number(row.current_value),
    earned: Number(row.earned || 0),
    txHash: row.tx_hash,
    sourceChain: row.source_chain,
    createdAt: row.created_at,
  };
}

function toCamelTransaction(row) {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    type: row.type,
    status: row.status,
    amount: row.amount == null ? null : Number(row.amount),
    token: row.token,
    fromChain: row.from_chain,
    toChain: row.to_chain,
    txHash: row.tx_hash,
    metadata: row.metadata || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getStoredPositions(supabase, walletAddress) {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(toCamelPosition);
}

export async function getStoredTransactions(supabase, walletAddress) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(toCamelTransaction);
}

export async function recordDepositSnapshot(supabase, { walletAddress, vault, amount, token, fromChain, txHashes, quote, privacyMode, benefitCampaign }) {
  const depositHash = txHashes?.deposit || null;
  const benefitMetadata = benefitCampaign ? { benefit_campaign: benefitCampaign } : {};

  const { error: txError } = await supabase.from('transactions').insert({
    wallet_address: walletAddress,
    type: 'deposit',
    status: 'confirmed',
    amount,
    token,
    from_chain: fromChain,
    to_chain: 'solana',
    tx_hash: depositHash,
    metadata: {
      bridge_hash: txHashes?.bridge || null,
      swap_hash: txHashes?.swap || null,
      route: quote?.route || null,
      privacy_mode: privacyMode,
      fees: quote
        ? Number(quote.bridgeFee || 0) + Number(quote.networkFee || 0) + Number(quote.platformFee || 0)
        : null,
      ...benefitMetadata,
    },
  });
  if (txError) throw new Error(txError.message);

  const { error: positionError } = await supabase.from('positions').insert({
    wallet_address: walletAddress,
    vault_pubkey: vault.pubkey,
    vault_name: vault.name,
    deposited_amount: amount,
    deposited_token: token,
    entry_apy: vault.apy,
    current_value: quote?.toAmount || amount,
    earned: 0,
    tx_hash: depositHash,
    source_chain: fromChain,
  });
  if (positionError) throw new Error(positionError.message);
}
