import { PRIVACY_MODES } from '../lib/stablecoins';

function createUnavailableProvider(id, reason) {
  const fail = async () => {
    throw new Error(reason);
  };

  return {
    id,
    status: 'unavailable',
    reason,
    deposit: fail,
    withdraw: fail,
    exportKeys: fail,
    loadNotes: fail,
    register: fail,
  };
}

export async function createCloakProvider({ wallet, connection }) {
  let sdk;
  try {
    const { CloakSDK } = await import('@cloak.dev/sdk');
    sdk = new CloakSDK({
      wallet,
      network: 'mainnet',
      relayUrl: import.meta.env.VITE_CLOAK_RELAY_URL || 'https://api.cloak.ag',
    });
  } catch (error) {
    return createUnavailableProvider(
      PRIVACY_MODES.CLOAK,
      `Private treasury route is not available in this browser session: ${error.message}`
    );
  }

  return {
    id: PRIVACY_MODES.CLOAK,
    status: 'ready',
    async deposit({ amount, mint }) {
      return sdk.deposit(connection, amount, { mint });
    },
    async withdraw({ note, recipient }) {
      return sdk.withdraw(connection, note, recipient);
    },
    async exportKeys() {
      return sdk.exportWalletKeys();
    },
    async loadNotes() {
      return sdk.loadNotes();
    },
  };
}

function createWalletSigner(wallet) {
  if (!wallet?.publicKey || !wallet?.signTransaction) {
    throw new Error('Connect a Solana wallet before opening private balance mode.');
  }

  return {
    address: wallet.publicKey.toBase58(),
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };
}

export async function createUmbraProvider({ wallet, rpcUrl, rpcSubscriptionsUrl }) {
  let umbra;
  let signer;
  let client;
  try {
    umbra = await import('@umbra-privacy/sdk');
    signer = createWalletSigner(wallet);
    const network = import.meta.env.VITE_UMBRA_NETWORK || 'mainnet-beta';
    client = await umbra.getUmbraClient({
      signer,
      network,
      rpcUrl,
      rpcSubscriptionsUrl,
      indexerApiEndpoint: import.meta.env.VITE_UMBRA_INDEXER_API || 'https://utxo-indexer.api.umbraprivacy.com',
    });
  } catch (error) {
    return createUnavailableProvider(
      PRIVACY_MODES.UMBRA,
      `Private balance route is not available in this browser session: ${error.message}`
    );
  }

  return {
    id: PRIVACY_MODES.UMBRA,
    status: 'ready',
    async register(options = { confidential: true, anonymous: true }) {
      const register = umbra.getUserRegistrationFunction({ client });
      return register(options);
    },
    async deposit({ destinationAddress = signer.address, mint, amount }) {
      const deposit = umbra.getPublicBalanceToEncryptedBalanceDirectDepositorFunction({ client });
      return deposit(destinationAddress, mint, BigInt(amount));
    },
    async withdraw({ destinationAddress = signer.address, mint, amount }) {
      const withdraw = umbra.getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction({ client });
      return withdraw(destinationAddress, mint, BigInt(amount));
    },
  };
}
