import React, { useState } from 'react';
import { CheckCircle2, LockKeyhole, ShieldAlert } from 'lucide-react';
import { PRIVACY_MODES } from '../../lib/stablecoins';
import { Button } from '../ui/Button';

const MODE_COPY = {
  [PRIVACY_MODES.CLOAK]: {
    title: 'Cloak route readiness',
    action: 'Validate Cloak route',
    ready: 'Cloak SDK, wallet mode, relay config, and on-chain root check are ready.',
    setup: 'Cloak keeps treasury movement private before the public vault deposit. Validate this before recording the Cloak demo.',
  },
  [PRIVACY_MODES.UMBRA]: {
    title: 'Umbra account readiness',
    action: 'Validate Umbra account',
    ready: 'Umbra SDK, wallet signer, RPC, and account query path are ready.',
    setup: 'Umbra prepares encrypted balance mode before the public deposit route. Register only with a funded demo wallet.',
  },
};

export const PrivacyReadiness = ({ mode, provider, loading, error, connected, onLoadProvider }) => {
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [checkError, setCheckError] = useState(null);

  if (mode === PRIVACY_MODES.STANDARD) return null;

  const copy = MODE_COPY[mode];
  const ready = provider?.status === 'ready';

  const handleValidate = async () => {
    setChecking(true);
    setCheckError(null);
    setCheckResult(null);
    try {
      const loaded = ready ? provider : await onLoadProvider(mode);
      if (!loaded || loaded.status !== 'ready') {
        throw new Error(loaded?.reason || 'Privacy provider could not be prepared.');
      }
      const result = await loaded.validate();
      setCheckResult(result);
      if (!result.ok) setCheckError(result.reason || 'Privacy provider validation failed.');
    } catch (err) {
      setCheckError(err.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-[#D6A84F]/25 bg-[#F8E6B6]/25 p-4 shadow-[0_16px_35px_rgba(126,77,34,0.04)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-white/75 p-2 text-[#7E4D22]">
          {checkResult?.ok ? <CheckCircle2 size={17} /> : <LockKeyhole size={17} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-sg-text">{copy.title}</p>
          <p className="mt-1 text-xs leading-5 text-sg-text-secondary">
            {checkResult?.ok ? copy.ready : copy.setup}
          </p>
          {provider?.capabilities?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {provider.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-black/[0.06] bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-[#7E4D22]"
                >
                  {capability}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {checkResult?.ok ? (
        <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs leading-5 text-sg-text-secondary">
          Validated for {checkResult.publicKey} on {checkResult.network || 'mainnet'}.
        </p>
      ) : null}

      {error || checkError ? (
        <p className="mt-3 flex items-start gap-2 rounded-2xl border border-sg-error/15 bg-white/70 px-3 py-2 text-xs leading-5 text-sg-text-secondary">
          <ShieldAlert size={14} className="mt-0.5 shrink-0 text-sg-error" />
          {checkError || error}
        </p>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-4 w-full"
        loading={loading || checking}
        disabled={!connected}
        onClick={handleValidate}
      >
        {connected ? copy.action : 'Connect wallet to validate'}
      </Button>
    </div>
  );
};
