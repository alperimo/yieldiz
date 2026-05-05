import { PublicKey } from '@solana/web3.js';

export async function getPrimarySolDomain(connection, walletAddress) {
  if (!connection || !walletAddress) return null;

  const { getPrimaryDomain } = await import('@bonfida/spl-name-service');
  const owner = walletAddress instanceof PublicKey ? walletAddress : new PublicKey(walletAddress);
  let result;
  try {
    result = await getPrimaryDomain(connection, owner);
  } catch (error) {
    if (/not found|does not exist|not exist|favorite/i.test(String(error?.message || error))) {
      return null;
    }
    throw error;
  }
  const domain = typeof result === 'string' ? result : result?.reverse;

  if (!domain) return null;
  return domain.endsWith('.sol') ? domain : `${domain}.sol`;
}
