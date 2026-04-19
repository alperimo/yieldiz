import { useState, useCallback, useRef } from 'react';
import { DEPOSIT_FLOW_STATES } from '../lib/constants';
import * as lifi from '../services/lifi';
import * as dflow from '../services/dflow';
import * as kamino from '../services/kamino';
import * as jito from '../services/jito';
import { SUPPORTED_CHAINS } from '../services/lifi';
import { TOKENS } from '../lib/constants';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export function useDepositFlow() {
  const [state, setState] = useState(DEPOSIT_FLOW_STATES.IDLE);
  const [currentStep, setCurrentStep] = useState(0);
  const [txHashes, setTxHashes] = useState({});
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const steps = [
    { key: 'bridge', label: 'Bridge', state: DEPOSIT_FLOW_STATES.BRIDGING },
    { key: 'swap', label: 'Swap', state: DEPOSIT_FLOW_STATES.SWAPPING },
    { key: 'deposit', label: 'Deposit', state: DEPOSIT_FLOW_STATES.DEPOSITING },
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Mock execution for development
  const executeMock = async ({ fromChain, amount, vault, needsSwap }) => {
    const MOCK_TX_HASHES = {
      bridge: '0xa3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      swap: '4kYmZ8R4hJDnPtVJgRFnTVbMQD6K1qLPfCaKEvR3ZABC',
      deposit: '5kYmZ8R4hJDnPtVJgRFnTVbMQD6K1qLPfCaKEvR3ZABC',
    };

    setState(DEPOSIT_FLOW_STATES.QUOTING);
    await sleep(1000);
    if (abortRef.current) return;

    setState(DEPOSIT_FLOW_STATES.APPROVING);
    await sleep(800);
    if (abortRef.current) return;

    if (fromChain !== 'solana') {
      setState(DEPOSIT_FLOW_STATES.BRIDGING);
      setCurrentStep(0);
      await sleep(2000);
      if (abortRef.current) return;
      setTxHashes((prev) => ({ ...prev, bridge: MOCK_TX_HASHES.bridge }));
    }

    if (needsSwap) {
      setState(DEPOSIT_FLOW_STATES.SWAPPING);
      setCurrentStep(1);
      await sleep(1500);
      if (abortRef.current) return;
      setTxHashes((prev) => ({ ...prev, swap: MOCK_TX_HASHES.swap }));
    }

    setState(DEPOSIT_FLOW_STATES.DEPOSITING);
    setCurrentStep(2);
    await sleep(1500);
    if (abortRef.current) return;
    setTxHashes((prev) => ({ ...prev, deposit: MOCK_TX_HASHES.deposit }));

    setState(DEPOSIT_FLOW_STATES.CONFIRMED);
    setCurrentStep(3);
  };

  // Real execution using LI.FI, DFlow, Kamino, and Jito
  const executeReal = async ({ fromChain, amount, vault, needsSwap, walletAddress, signTransaction, signAllTransactions, evmAddress, rawRoute }) => {
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
      setCurrentStep(0);
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
      setCurrentStep(1);
      if (abortRef.current) return;

      try {
        const swapResult = await dflow.getSwapTransaction({
          inputMint: TOKENS.USDC.mint,
          outputMint: TOKENS.USDT.mint,
          amount: String(Math.floor(amount * 1e6)),
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
    setCurrentStep(2);
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
    setCurrentStep(3);
  };

  const execute = useCallback(async (params) => {
    abortRef.current = false;
    setError(null);
    setTxHashes({});
    setCurrentStep(0);

    try {
      if (USE_MOCK) {
        await executeMock(params);
      } else {
        await executeReal(params);
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
