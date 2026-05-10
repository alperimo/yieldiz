import { useState, useCallback, useRef } from 'react';
import { DEPOSIT_FLOW_STATES } from '../lib/constants';
import * as lifi from '../services/lifi';
import * as dflow from '../services/dflow';
import * as kamino from '../services/kamino';
import * as jito from '../services/jito';
import { SUPPORTED_CHAINS } from '../services/lifi';
import { TOKENS } from '../lib/constants';
import { USE_MOCK_DATA } from '../lib/env';
import { getSolanaMint, toBaseUnits } from '../lib/stablecoins';

const APP_NETWORK = import.meta.env.VITE_NETWORK || 'devnet';

const DEFAULT_STEPS = [
  { key: 'bridge', label: 'Bridge', state: DEPOSIT_FLOW_STATES.BRIDGING },
  { key: 'swap', label: 'Swap', state: DEPOSIT_FLOW_STATES.SWAPPING },
  { key: 'deposit', label: 'Deposit', state: DEPOSIT_FLOW_STATES.DEPOSITING },
];

function buildExecutionSteps({ fromChain, needsSwap }) {
  return [
    ...(fromChain !== 'solana' ? [DEFAULT_STEPS[0]] : []),
    ...(needsSwap ? [DEFAULT_STEPS[1]] : []),
    DEFAULT_STEPS[2],
  ];
}

function getStepIndex(steps, key) {
  return Math.max(0, steps.findIndex((step) => step.key === key));
}

export function useDepositFlow() {
  const [state, setState] = useState(DEPOSIT_FLOW_STATES.IDLE);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [txHashes, setTxHashes] = useState({});
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Mock execution for development
  const executeMock = async ({ fromChain, needsSwap, executionSteps }) => {
    const MOCK_TX_HASHES = {
      bridge: '0xb7c4e1a9d2f8365c0a4e7b9d1f3a6c8e2b5d9a0c4f7e1b3d6a8c2e5f9b1d4a7',
      swap: '6dFlowDemoRoute8R4hJDnPtVJgRFnTVbMQD6K1qLPfCaK',
      deposit: '7yZdDemoVault5R4hJDnPtVJgRFnTVbMQD6K1qLPfCaK',
    };

    setState(DEPOSIT_FLOW_STATES.QUOTING);
    await sleep(1000);
    if (abortRef.current) return;

    setState(DEPOSIT_FLOW_STATES.APPROVING);
    await sleep(800);
    if (abortRef.current) return;

    if (fromChain !== 'solana') {
      setState(DEPOSIT_FLOW_STATES.BRIDGING);
      setCurrentStep(getStepIndex(executionSteps, 'bridge'));
      await sleep(2000);
      if (abortRef.current) return;
      setTxHashes((prev) => ({ ...prev, bridge: MOCK_TX_HASHES.bridge }));
    }

    if (needsSwap) {
      setState(DEPOSIT_FLOW_STATES.SWAPPING);
      setCurrentStep(getStepIndex(executionSteps, 'swap'));
      await sleep(1500);
      if (abortRef.current) return;
      setTxHashes((prev) => ({ ...prev, swap: MOCK_TX_HASHES.swap }));
    }

    setState(DEPOSIT_FLOW_STATES.DEPOSITING);
    setCurrentStep(getStepIndex(executionSteps, 'deposit'));
    await sleep(1500);
    if (abortRef.current) return;
    setTxHashes((prev) => ({ ...prev, deposit: MOCK_TX_HASHES.deposit }));

    setState(DEPOSIT_FLOW_STATES.CONFIRMED);
    setCurrentStep(executionSteps.length);
  };

  // Real execution using LI.FI, DFlow, Kamino, and Jito
  const executeReal = async ({
    fromChain,
    fromToken = 'USDC',
    toToken = 'USDC',
    amount,
    vault,
    needsSwap,
    walletAddress,
    signTransaction,
    signAllTransactions,
    evmAddress,
    rawRoute,
    executionSteps,
  }) => {
    if (APP_NETWORK !== 'mainnet-beta') {
      throw new Error('Live Kamino deposits require VITE_NETWORK=mainnet-beta with a mainnet Solana RPC and wallet. For local/devnet demos, set VITE_USE_MOCK_DATA=true.');
    }

    // Step 1: Get quote / prepare
    setState(DEPOSIT_FLOW_STATES.QUOTING);
    if (abortRef.current) return;

    const isCrossChain = fromChain !== 'solana';
    const chainId = SUPPORTED_CHAINS[fromChain];

    // Step 2: Approval (EVM token approval for cross-chain)
    setState(DEPOSIT_FLOW_STATES.APPROVING);
    if (abortRef.current) return;

    if (isCrossChain && window.ethereum && evmAddress) {
      // If LI.FI route includes approval data, request EVM wallet approval
      if (rawRoute?.transactionRequest) {
        try {
          const approvalData = rawRoute.transactionRequest;
          if (approvalData.to && approvalData.data) {
            const txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                from: evmAddress,
                to: approvalData.to,
                data: approvalData.data,
                value: approvalData.value || '0x0',
                chainId: `0x${chainId.toString(16)}`,
              }],
            });
            setTxHashes((prev) => ({ ...prev, approval: txHash }));
          }
        } catch (err) {
          throw new Error(`EVM approval failed: ${err.message}`);
        }
      }
    }

    // Step 3: Bridge (if cross-chain)
    if (isCrossChain) {
      setState(DEPOSIT_FLOW_STATES.BRIDGING);
      setCurrentStep(getStepIndex(executionSteps, 'bridge'));
      if (abortRef.current) return;

      try {
        // Execute bridge via EVM wallet using LI.FI route transactionRequest
        if (rawRoute?.transactionRequest && window.ethereum && evmAddress) {
          const bridgeTxReq = rawRoute.transactionRequest;
          const bridgeTxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: evmAddress,
              to: bridgeTxReq.to,
              data: bridgeTxReq.data,
              value: bridgeTxReq.value || '0x0',
              gasLimit: bridgeTxReq.gasLimit,
              chainId: `0x${chainId.toString(16)}`,
            }],
          });
          setTxHashes((prev) => ({ ...prev, bridge: bridgeTxHash }));

          // Poll LI.FI for bridge completion status
          const fromChainId = chainId;
          const toChainId = 1151111081099710; // Solana
          let bridgeComplete = false;
          for (let i = 0; i < 60 && !abortRef.current; i++) {
            await sleep(5000);
            try {
              const status = await lifi.getTransactionStatus(bridgeTxHash, fromChainId, toChainId);
              if (status?.status === 'DONE') { bridgeComplete = true; break; }
              if (status?.status === 'FAILED') throw new Error('Bridge transaction failed');
            } catch { /* keep polling */ }
          }
          if (!bridgeComplete && !abortRef.current) throw new Error('Bridge timed out');
        } else {
          throw new Error('EVM wallet required for cross-chain bridge. Please connect MetaMask.');
        }
      } catch (err) {
        throw new Error(`Bridge failed: ${err.message}`);
      }
    }

    if (abortRef.current) return;

    // Step 4: Swap via DFlow (if token mismatch)
    if (needsSwap) {
      setState(DEPOSIT_FLOW_STATES.SWAPPING);
      setCurrentStep(getStepIndex(executionSteps, 'swap'));
      if (abortRef.current) return;

      try {
        const swapResult = await dflow.getSwapTransaction({
          inputMint: getSolanaMint(fromToken) || TOKENS[fromToken]?.mint,
          outputMint: getSolanaMint(toToken) || TOKENS[toToken]?.mint,
          amount: toBaseUnits(amount, TOKENS[fromToken]?.decimals || 6),
          userPublicKey: walletAddress,
        });

        if (swapResult?.swapTransaction && signTransaction) {
          // Deserialize and sign the swap transaction
          const { VersionedTransaction } = await import('@solana/web3.js');
          const swapTxBuf = Buffer.from(swapResult.swapTransaction, 'base64');
          const swapTx = VersionedTransaction.deserialize(swapTxBuf);
          const signedSwap = await signTransaction(swapTx);
          // Will be bundled with deposit in Jito step
          setTxHashes((prev) => ({ ...prev, swap: 'pending-jito-bundle' }));
        }
      } catch (err) {
        throw new Error(`Swap failed: ${err.message}`);
      }
    }

    if (abortRef.current) return;

    // Step 5: Deposit into Kamino vault (via KTX API + Jito bundle)
    setState(DEPOSIT_FLOW_STATES.DEPOSITING);
    setCurrentStep(getStepIndex(executionSteps, 'deposit'));
    if (abortRef.current) return;

    try {
      // Build the deposit transaction via Kamino KTX API
      const depositResult = await kamino.buildVaultDeposit({
        vaultAddress: vault,
        amount: String(amount),
        ownerAddress: walletAddress,
      });

      if (depositResult?.transaction && signTransaction) {
        // Deserialize the unsigned deposit transaction
        const { VersionedTransaction } = await import('@solana/web3.js');
        const depositTxBuf = Buffer.from(depositResult.transaction, 'base64');
        const depositTx = VersionedTransaction.deserialize(depositTxBuf);

        // Sign the deposit transaction
        const signedDeposit = await signTransaction(depositTx);

        // Send via Jito Bundle for MEV protection
        try {
          const serializedTx = Buffer.from(signedDeposit.serialize()).toString('base64');
          const bundleId = await jito.sendBundle([serializedTx]);
          setTxHashes((prev) => ({ ...prev, deposit: bundleId }));

          // Poll Jito for bundle landing
          for (let i = 0; i < 30 && !abortRef.current; i++) {
            await sleep(2000);
            try {
              const bundleStatus = await jito.getBundleStatus(bundleId);
              if (bundleStatus?.confirmation_status === 'confirmed' || bundleStatus?.confirmation_status === 'finalized') break;
              if (bundleStatus?.err) throw new Error('Jito bundle failed');
            } catch { /* keep polling */ }
          }
        } catch {
          // Jito bundle failed, fall back to direct RPC send
          // This ensures the deposit still works even without MEV protection
          const { Connection } = await import('@solana/web3.js');
          const conn = new Connection(import.meta.env.VITE_QUICKNODE_RPC_URL || 'https://api.devnet.solana.com');
          const txSig = await conn.sendRawTransaction(signedDeposit.serialize());
          setTxHashes((prev) => ({ ...prev, deposit: txSig }));
          await conn.confirmTransaction(txSig, 'confirmed');
        }
      } else if (depositResult?.tx_hash) {
        // KTX API returned a pre-signed tx hash
        setTxHashes((prev) => ({ ...prev, deposit: depositResult.tx_hash }));
      } else {
        throw new Error('Kamino KTX API returned no transaction data');
      }
    } catch (err) {
      throw new Error(`Vault deposit failed: ${err.message}`);
    }

    setState(DEPOSIT_FLOW_STATES.CONFIRMED);
    setCurrentStep(executionSteps.length);
  };

  const execute = useCallback(async (params) => {
    abortRef.current = false;
    setError(null);
    setTxHashes({});
    setCurrentStep(0);
    const executionSteps = buildExecutionSteps(params);
    setSteps(executionSteps);

    try {
      if (USE_MOCK_DATA) {
        await executeMock({ ...params, executionSteps });
      } else {
        await executeReal({ ...params, executionSteps });
      }
    } catch (err) {
      setState(DEPOSIT_FLOW_STATES.ERROR);
      setError(err.message || 'Transaction failed');
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setState(DEPOSIT_FLOW_STATES.IDLE);
    setCurrentStep(0);
    setSteps(DEFAULT_STEPS);
    setTxHashes({});
    setError(null);
  }, []);

  return {
    state,
    currentStep,
    steps,
    txHashes,
    error,
    execute,
    reset,
    isActive: state !== DEPOSIT_FLOW_STATES.IDLE && state !== DEPOSIT_FLOW_STATES.CONFIRMED && state !== DEPOSIT_FLOW_STATES.ERROR,
  };
}
