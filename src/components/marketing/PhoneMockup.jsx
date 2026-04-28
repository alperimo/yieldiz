import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Shield, Sparkles, Wallet } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../../content/marketing';

// Realistic iPhone-style mockup with rotating app screens.
// Each screen is rendered directly in the DOM — crisp at any size.

const ScreenChrome = ({ children }) => (
  <div className="flex h-full flex-col overflow-hidden rounded-[38px] bg-[#F5F7F2]">
    {/* Status bar */}
    <div className="flex items-center justify-between px-7 pb-1 pt-4 text-[11px] font-semibold text-[#08111F]">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <span className="h-[7px] w-[7px] rounded-full bg-[#08111F]/70" />
        <span className="h-[7px] w-[7px] rounded-full bg-[#08111F]/50" />
        <span className="h-[7px] w-[7px] rounded-full bg-[#08111F]/30" />
        <span className="ml-2 h-2.5 w-5 rounded-sm border border-[#08111F]/70" />
      </div>
    </div>
    {/* Notch */}
    <div className="mx-auto -mt-6 h-5 w-24 rounded-full bg-[#08111F]" />
    <div className="flex-1 px-5 pt-5">{children}</div>
  </div>
);

const ConnectScreen = ({ preview }) => (
  <ScreenChrome>
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#526071]">SolGate</p>
      <h3 className="mt-1 font-display text-[22px] font-semibold leading-tight text-[#08111F]">
        Connect your wallet to begin.
      </h3>
      <p className="mt-2 text-[11px] leading-[1.5] text-[#526071]">
        Self-custodial from the first tap. Your keys stay on your device.
      </p>

      <div className="mt-5 space-y-2.5">
        {preview.wallets.map((w) => (
          <div
            key={w.name}
            className="flex items-center justify-between rounded-2xl border border-black/[0.08] bg-white p-3 shadow-[0_4px_14px_rgba(8,17,31,0.05)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[10px] font-bold text-white"
                style={{ background: w.color }}
              >
                {w.name.slice(0, 1)}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#08111F]">{w.name}</p>
                <p className="text-[10px] text-[#7C8898]">{w.tag}</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-[#08111F]/50" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#14F195]/[0.12] p-3 text-[10px] leading-[1.5] text-[#08111F]">
        <Shield size={13} className="shrink-0" />
        <span>We never store keys or seed phrases. Disconnect anytime.</span>
      </div>
    </div>
  </ScreenChrome>
);

const ChooseScreen = ({ preview }) => (
  <ScreenChrome>
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#526071]">Step 2 of 4</p>
    <h3 className="mt-1 font-display text-[20px] font-semibold leading-tight text-[#08111F]">
      From which chain?
    </h3>

    <div className="mt-4 grid grid-cols-2 gap-2">
      {SUPPORTED_CHAINS.filter((c) => c.id !== 'solana').map((chain, i) => (
        <div
          key={chain.id}
          className={`rounded-2xl border p-3 ${
            i === 0 ? 'border-[#08111F] bg-[#08111F] text-white' : 'border-black/[0.08] bg-white text-[#08111F]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full" style={{ background: chain.color }} />
            <p className="text-[11px] font-semibold">{chain.label}</p>
          </div>
          <p className={`mt-2 text-[14px] font-semibold ${i === 0 ? 'text-white' : 'text-[#08111F]'}`}>
            {preview.sourceBalances[chain.id] || '0.00'} USDC
          </p>
        </div>
      ))}
    </div>

    <div className="mt-4 rounded-2xl border border-black/[0.08] bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#526071]">Amount</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-[26px] font-semibold text-[#08111F]">{preview.amount.display}</span>
        <span className="text-[12px] text-[#7C8898]">{preview.amount.decimals}</span>
      </div>
      <div className="mt-2 flex gap-1">
        {preview.amount.quickActions.map((p) => (
          <span
            key={p}
            className="rounded-full border border-black/[0.08] bg-[#EEF2EA] px-2 py-1 text-[10px] font-semibold text-[#08111F]"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  </ScreenChrome>
);

const RouteScreen = ({ preview }) => (
  <ScreenChrome>
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#526071]">Preview</p>
    <h3 className="mt-1 font-display text-[20px] font-semibold leading-tight text-[#08111F]">
      Your route to yield.
    </h3>

    <div className="mt-4 space-y-2">
      {preview.routePreview.map((r, i) => (
        <div
          key={r.step}
          className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white p-3 shadow-[0_3px_10px_rgba(8,17,31,0.04)]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#08111F] text-[10px] font-bold text-white">
            {i + 1}
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-[#08111F]">{r.step}</p>
            <p className="text-[10px] text-[#7C8898]">{r.via}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-[#08111F]">{r.value}</p>
            <p className="text-[9px] text-[#7C8898]">{r.time}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-4 rounded-2xl bg-[#08111F] p-3 text-white">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">You will receive</p>
      <p className="mt-1 font-display text-[22px] font-semibold">{preview.quote.receive}</p>
      <p className="text-[10px] text-white/60">{preview.quote.annualized}</p>
    </div>
  </ScreenChrome>
);

const ConfirmScreen = ({ preview }) => (
  <ScreenChrome>
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#526071]">In progress</p>
    <h3 className="mt-1 font-display text-[20px] font-semibold leading-tight text-[#08111F]">
      Routing $1,000 USDC…
    </h3>

    <div className="mt-4 space-y-2">
      {preview.progress.map((r) => (
        <div key={r.step} className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white p-3">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              r.status === 'done'
                ? 'bg-[#14F195] text-[#08111F]'
                : r.status === 'live'
                  ? 'bg-[#9945FF] text-white'
                  : 'bg-[#EEF2EA] text-[#7C8898]'
            }`}
          >
            {r.status === 'done' ? <CheckCircle2 size={13} /> : <Sparkles size={13} />}
          </div>
          <p className="flex-1 text-[11px] font-semibold text-[#08111F]">{r.step}</p>
          <span className="text-[10px] text-[#7C8898]">
            {r.status === 'done' ? '✓' : r.status === 'live' ? 'live' : '—'}
          </span>
        </div>
      ))}
    </div>

    <div className="mt-4 rounded-2xl bg-[#14F195]/[0.14] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#08111F]">Estimated settlement</p>
      <p className="mt-1 font-display text-[18px] font-semibold text-[#08111F]">{preview.settlementEstimate}</p>
    </div>
  </ScreenChrome>
);

const EarningScreen = ({ preview }) => (
  <ScreenChrome>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#526071]">Portfolio</p>
        <p className="mt-1 font-display text-[26px] font-semibold text-[#08111F]">{preview.portfolio.total}</p>
        <p className="text-[11px] text-[#0EA56A]">{preview.portfolio.earned} <span className="text-[#7C8898]">earned</span></p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08111F] text-white">
        <Wallet size={16} />
      </div>
    </div>

    <div className="mt-4 rounded-2xl bg-[#08111F] p-4 text-white">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">Best live APY</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-[28px] font-semibold">{preview.portfolio.bestApy}</span>
        <span className="text-[14px] text-white/70">%</span>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
        <span className="h-1.5 w-1.5 rounded-full bg-[#14F195]" />
        {preview.portfolio.activeVault}
      </div>
    </div>

    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#526071]">Active positions</p>
    <div className="mt-2 space-y-2">
      {preview.portfolio.positions.map((r) => (
        <div key={r.name} className="flex items-center justify-between rounded-2xl border border-black/[0.08] bg-white p-3">
          <div>
            <p className="text-[12px] font-semibold text-[#08111F]">{r.name}</p>
            <p className="text-[10px] text-[#7C8898]">{r.value} deposited</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#0EA56A]">{r.apy}</p>
            <p className="text-[10px] text-[#7C8898]">APY</p>
          </div>
        </div>
      ))}
    </div>
  </ScreenChrome>
);

const SCREENS = [
  { key: 'connect', Component: ConnectScreen },
  { key: 'choose', Component: ChooseScreen },
  { key: 'route', Component: RouteScreen },
  { key: 'confirm', Component: ConfirmScreen },
  { key: 'earning', Component: EarningScreen },
];

export const PhoneMockup = ({ reducedMotion = false, activeKey, onRotateChange, previewData }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (activeKey) {
      const i = SCREENS.findIndex((s) => s.key === activeKey);
      if (i >= 0) setIndex(i);
      return undefined;
    }
    if (reducedMotion) return undefined;
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % SCREENS.length;
        if (onRotateChange) onRotateChange(SCREENS[next].key);
        return next;
      });
    }, 3600);
    return () => clearInterval(id);
  }, [activeKey, reducedMotion, onRotateChange]);

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* Phone body */}
      <div
        className="relative aspect-[9/19] w-full rounded-[48px] bg-[#08111F] p-2 shadow-[0_60px_120px_rgba(8,17,31,0.32),0_20px_40px_rgba(153,69,255,0.18)]"
        style={{
          backgroundImage:
            'linear-gradient(160deg,#11192B 0%,#08111F 60%,#050A14 100%)',
        }}
      >
        <div className="absolute inset-[6px] rounded-[42px] border border-white/10" />
        <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-[#F5F7F2]">
          {SCREENS.map((s, i) => (
            <div
              key={s.key}
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                opacity: i === index ? 1 : 0,
                transform: i === index ? 'translateY(0)' : 'translateY(16px)',
                pointerEvents: i === index ? 'auto' : 'none',
              }}
            >
              <s.Component preview={previewData} />
            </div>
          ))}
        </div>
      </div>

      {/* Ambient glow behind phone */}
      <div
        className="pointer-events-none absolute inset-[-20%] -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(153,69,255,0.38), rgba(20,241,149,0.22) 50%, transparent 72%)',
        }}
      />
    </div>
  );
};

export const PHONE_SCREEN_KEYS = SCREENS.map((s) => s.key);
