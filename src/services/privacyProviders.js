import { PRIVACY_MODES } from '../lib/stablecoins';

const APP_NETWORK = import.meta.env.VITE_NETWORK || 'devnet';

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
    validate: fail,
  };
}

function requireSolanaWallet(wallet) {
  if (!wallet?.publicKey || !wallet?.signTransaction) {
    throw new Error('Connect a Solana wallet before preparing a private route.');
  }
}

function normalizeUmbraNetwork(value) {
  if (value === 'mainnet-beta') return 'mainnet';
  if (value === 'mainnet' || value === 'devnet' || value === 'localnet') return value;
  return 'mainnet';
}

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = globalThis.setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => globalThis.clearTimeout(timer));
}

export async function createCloakProvider({ wallet, connection }) {
  let sdk;
  let cloak;
  const relayUrl = import.meta.env.VITE_CLOAK_RELAY_URL || 'https://api.cloak.ag';
  try {
    requireSolanaWallet(wallet);
    if (APP_NETWORK !== 'mainnet-beta') {
      return createUnavailableProvider(
        PRIVACY_MODES.CLOAK,
        `Cloak private treasury mode requires a mainnet-beta RPC and initialized Cloak shield pool. Current VITE_NETWORK is "${APP_NETWORK}", so this route is not marked ready.`
      );
    }
    cloak = await import('@cloak.dev/sdk');
    const { CloakSDK, LocalStorageAdapter } = cloak;
    sdk = new CloakSDK({
      wallet,
      network: 'mainnet',
      relayUrl,
      storage: new LocalStorageAdapter('yieldiz_cloak_keys'),
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
    capabilities: ['wallet-mode', 'relay-status', 'shield-deposit', 'full-withdraw', 'key-export'],
    async validate() {
      const publicKey = sdk.getPublicKey();
      const config = sdk.getConfig();
      let currentRoot = null;
      try {
        currentRoot = await withTimeout(sdk.getCurrentRoot(connection), 10_000, 'Cloak root check');
      } catch (error) {
        return {
          ok: false,
          publicKey: publicKey.toBase58(),
          network: config.network || 'mainnet',
          relayUrl,
          reason: `Cloak SDK loaded, but relay/on-chain root check failed: ${error.message}`,
        };
      }
      return {
        ok: true,
        publicKey: publicKey.toBase58(),
        network: config.network || 'mainnet',
        relayUrl,
        currentRoot,
      };
    },
    async deposit({ amount, mint }) {
      requireSolanaWallet(wallet);
      const {
        CLOAK_PROGRAM_ID,
        NATIVE_SOL_MINT,
        createUtxo,
        createZeroUtxo,
        generateUtxoKeypair,
        transact,
      } = cloak;
      const { PublicKey } = await import('@solana/web3.js');
      const mintAddress = mint ? new PublicKey(mint) : NATIVE_SOL_MINT;
      const baseAmount = BigInt(amount);
      const owner = await generateUtxoKeypair();
      const output = await createUtxo(baseAmount, owner, mintAddress);
      const change = await createZeroUtxo(mintAddress);
      return transact(
        {
          inputUtxos: [await createZeroUtxo(mintAddress), await createZeroUtxo(mintAddress)],
          outputUtxos: [output, change],
          externalAmount: baseAmount,
          depositor: wallet.publicKey,
        },
        {
          connection,
          programId: CLOAK_PROGRAM_ID,
          relayUrl,
          signTransaction: wallet.signTransaction,
          signMessage: wallet.signMessage,
          depositorPublicKey: wallet.publicKey,
          walletPublicKey: wallet.publicKey,
          enforceViewingKeyRegistration: false,
        }
      );
    },
    async withdraw({ utxos, recipient }) {
      requireSolanaWallet(wallet);
      if (!Array.isArray(utxos) || utxos.length === 0) {
        throw new Error('Cloak withdrawal requires at least one spendable UTXO from the shielded route.');
      }
      const { CLOAK_PROGRAM_ID, fullWithdraw } = cloak;
      const { PublicKey } = await import('@solana/web3.js');
      return fullWithdraw(utxos, new PublicKey(recipient || wallet.publicKey), {
        connection,
        programId: CLOAK_PROGRAM_ID,
        relayUrl,
        signTransaction: wallet.signTransaction,
        signMessage: wallet.signMessage,
        walletPublicKey: wallet.publicKey,
        enforceViewingKeyRegistration: false,
      });
    },
    async exportKeys() {
      return sdk.exportWalletKeys();
    },
    async loadNotes() {
      return {
        message: 'Cloak v0.1.6 stores UTXO ownership in caller-managed route state; no legacy plaintext notes are loaded.',
      };
    },
  };
}

function createWalletSigner(wallet) {
  if (!wallet?.publicKey || !wallet?.signTransaction || !wallet?.signMessage) {
    throw new Error('Connect a Solana wallet before opening private balance mode.');
  }

  return {
    address: wallet.publicKey.toBase58(),
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signTransactions: wallet.signAllTransactions || (async (transactions) => Promise.all(transactions.map((transaction) => wallet.signTransaction(transaction)))),
    signAllTransactions: wallet.signAllTransactions,
    signMessage: async (message) => ({
      message,
      signature: await wallet.signMessage(message),
      signer: wallet.publicKey.toBase58(),
    }),
  };
}

export async function createUmbraProvider({ wallet, rpcUrl, rpcSubscriptionsUrl }) {
  let umbra;
  let signer;
  let client;
  try {
    requireSolanaWallet(wallet);
    if (APP_NETWORK !== 'mainnet-beta') {
      return createUnavailableProvider(
        PRIVACY_MODES.UMBRA,
        `Umbra private balance mode requires a mainnet-beta RPC and deployed Umbra accounts. Current VITE_NETWORK is "${APP_NETWORK}", so this route is not marked ready.`
      );
    }
    umbra = await import('@umbra-privacy/sdk');
    signer = createWalletSigner(wallet);
    const network = normalizeUmbraNetwork(import.meta.env.VITE_UMBRA_NETWORK);
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
    capabilities: ['registration', 'encrypted-balance-deposit', 'encrypted-balance-withdraw', 'account-query'],
    async validate() {
      const result = { ok: true, publicKey: signer.address, network: normalizeUmbraNetwork(import.meta.env.VITE_UMBRA_NETWORK) };
      if (typeof umbra.getUserAccountQuerierFunction !== 'function') return result;
      try {
        const queryUser = umbra.getUserAccountQuerierFunction({ client });
        result.account = await queryUser(signer.address);
      } catch (error) {
        result.ok = false;
        result.reason = `Umbra SDK loaded, but account query failed: ${error.message}`;
      }
      return result;
    },
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
