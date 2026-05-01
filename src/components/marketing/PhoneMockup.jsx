import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Shield,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { SUPPORTED_CHAINS } from '../../content/marketing';

const SOURCE_CHAINS = SUPPORTED_CHAINS.filter((chain) => chain.id !== 'solana');

const ScreenChrome = ({ children }) => (
  <div className="flex h-full flex-col overflow-hidden rounded-[38px] bg-[#F7F3EA] text-[#2A1A0B]">
    <div className="flex items-center justify-between px-7 pb-1 pt-4 text-[11px] font-semibold">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <span className="h-[7px] w-[7px] rounded-full bg-[#2A1A0B]/70" />
        <span className="h-[7px] w-[7px] rounded-full bg-[#2A1A0B]/45" />
        <span className="h-[7px] w-[7px] rounded-full bg-[#2A1A0B]/25" />
        <span className="ml-2 h-2.5 w-5 rounded-sm border border-[#2A1A0B]/65" />
      </div>
    </div>
    <div className="mx-auto -mt-6 h-5 w-24 rounded-full bg-[#2A1A0B]" />
    <div className="min-h-0 flex-1 px-5 pb-5 pt-4">{children}</div>
  </div>
);

const AppHeader = ({ eyebrow, title, caption, right }) => (
  <div className="flex items-start justify-between gap-3">
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8B6A3A]">{eyebrow}</p>
      <h3 className="mt-1 font-display text-[21px] font-semibold leading-[1.05] tracking-[-0.035em] text-[#2A1A0B]">
        {title}
      </h3>
      {caption ? <p className="mt-1 max-w-[24ch] text-[10px] leading-[1.45] text-[#654B2B]">{caption}</p> : null}
    </div>
    {right}
  </div>
);

const MiniButton = ({ children, dark = false }) => (
  <div
    className={`flex h-10 items-center justify-center rounded-full px-4 text-[11px] font-bold ${
      dark ? 'bg-[#2A1A0B] text-[#F8E6B6]' : 'border border-black/[0.08] bg-white text-[#2A1A0B]'
    }`}
  >
    {children}
  </div>
);

const WalletRow = ({ wallet, active = false }) => (
  <div
    className={`flex items-center justify-between rounded-2xl border p-3 ${
      active
        ? 'border-[#7E4D22] bg-[#2A1A0B] text-[#F8E6B6]'
        : 'border-black/[0.08] bg-white/90 text-[#2A1A0B]'
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl text-[10px] font-bold text-white"
        style={{ background: wallet.color }}
      >
        {wallet.name.slice(0, 1)}
      </div>
      <div>
        <p className={`text-[12px] font-semibold ${active ? 'text-[#F8E6B6]' : 'text-[#2A1A0B]'}`}>{wallet.name}</p>
        <p className={`text-[9px] ${active ? 'text-[#F8E6B6]/62' : 'text-[#8B6A3A]'}`}>{wallet.tag}</p>
      </div>
    </div>
    {active ? <CheckCircle2 size={15} className="text-[#D6A84F]" /> : <ChevronRight size={15} className="opacity-45" />}
  </div>
);

const ConnectScreen = ({ preview }) => (
  <ScreenChrome>
    <div className="flex h-full flex-col">
      <AppHeader
        eyebrow="Yieldiz"
        title="Choose a wallet."
        caption="Self-custodial access. No account, no custody."
        right={
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F8E6B6] text-[#7E4D22]">
            <Wallet size={17} />
          </div>
        }
      />

      <div className="mt-4 rounded-[24px] bg-[#2A1A0B] p-4 text-[#F8E6B6] shadow-[0_16px_34px_rgba(42,26,11,0.15)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#F8E6B6]/55">Ready route</p>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="font-display text-[25px] font-semibold leading-none">$1,000</p>
            <p className="mt-1 text-[10px] text-[#F8E6B6]/62">USDC to Kamino</p>
          </div>
          <p className="rounded-full bg-[#D6A84F] px-3 py-1 text-[10px] font-bold text-[#2A1A0B]">8.42%</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {preview.wallets.map((wallet, index) => (
          <WalletRow key={wallet.name} wallet={wallet} active={index === 0} />
        ))}
      </div>

      <div className="mt-auto rounded-2xl border border-[#D6A84F]/35 bg-[#F8E6B6]/55 p-3">
        <div className="flex items-start gap-2">
          <Shield size={14} className="mt-0.5 shrink-0 text-[#7E4D22]" />
          <p className="text-[10px] font-medium leading-[1.45] text-[#4A3218]">
            Yieldiz requests signatures only when a route is ready to review.
          </p>
        </div>
      </div>
    </div>
  </ScreenChrome>
);

const ChooseScreen = ({ preview }) => (
  <ScreenChrome>
    <div className="flex h-full flex-col">
      <AppHeader
        eyebrow="Step 2"
        title="Select capital."
        caption="Source chain, stablecoin and amount stay visible together."
      />

      <div className="mt-4 grid grid-cols-2 gap-2">
        {SOURCE_CHAINS.map((chain, index) => (
          <div
            key={chain.id}
            className={`rounded-2xl border p-3 ${
              index === 0 ? 'border-[#7E4D22] bg-[#2A1A0B] text-[#F8E6B6]' : 'border-black/[0.08] bg-white/90 text-[#2A1A0B]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full" style={{ background: chain.color }} />
              <p className="truncate text-[10px] font-bold">{chain.label}</p>
            </div>
            <p className={`mt-2 text-[12px] font-semibold ${index === 0 ? 'text-[#F8E6B6]' : 'text-[#2A1A0B]'}`}>
              {preview.sourceBalances[chain.id] || '0.00'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[24px] border border-black/[0.08] bg-white/95 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8B6A3A]">Amount</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-[28px] font-semibold leading-none">{preview.amount.display}</span>
              <span className="text-[11px] text-[#8B6A3A]">{preview.amount.decimals}</span>
            </div>
          </div>
          <span className="rounded-full bg-[#EEF2EA] px-3 py-1 text-[10px] font-bold text-[#654B2B]">USDC</span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {preview.amount.quickActions.map((percent) => (
            <span key={percent} className="rounded-full bg-[#F8E6B6] px-3 py-1 text-[10px] font-bold text-[#7E4D22]">
              {percent}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <MiniButton>USDT ready</MiniButton>
        <MiniButton dark>Palm USD</MiniButton>
      </div>
    </div>
  </ScreenChrome>
);

const RouteScreen = ({ preview }) => (
  <ScreenChrome>
    <div className="flex h-full flex-col">
      <AppHeader
        eyebrow="Review"
        title="Know the route."
        caption="Every fee, provider and boundary is visible before signing."
      />

      <div className="mt-4 space-y-2">
        {preview.routePreview.map((route, index) => (
          <div key={route.step} className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white/95 p-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2A1A0B] text-[10px] font-bold text-[#F8E6B6]">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-[#2A1A0B]">{route.step}</p>
              <p className="truncate text-[9px] text-[#8B6A3A]">{route.via}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#2A1A0B]">{route.value}</p>
              <p className="text-[9px] text-[#8B6A3A]">{route.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-[#F8E6B6] p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#7E4D22]">Privacy</p>
          <p className="mt-1 text-[12px] font-bold">Standard route</p>
        </div>
        <div className="rounded-2xl bg-[#EEF2EA] p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#657052]">Local check</p>
          <p className="mt-1 text-[12px] font-bold">Passed</p>
        </div>
      </div>

      <div className="mt-auto rounded-[22px] bg-[#2A1A0B] p-4 text-[#F8E6B6]">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#F8E6B6]/55">You receive</p>
        <p className="mt-1 font-display text-[24px] font-semibold leading-none">{preview.quote.receive}</p>
        <p className="mt-1 text-[10px] text-[#F8E6B6]/62">{preview.quote.annualized}</p>
      </div>
    </div>
  </ScreenChrome>
);

const ConfirmScreen = ({ preview }) => (
  <ScreenChrome>
    <div className="flex h-full flex-col">
      <AppHeader
        eyebrow="Confirm"
        title="Settlement live."
        caption="Bridge, swap, bundle and vault entry update in one receipt."
      />

      <div className="mt-4 rounded-[24px] bg-[#2A1A0B] p-4 text-[#F8E6B6]">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#F8E6B6]/55">Route status</p>
          <p className="rounded-full bg-[#D6A84F] px-2.5 py-1 text-[9px] font-bold text-[#2A1A0B]">{preview.settlementEstimate}</p>
        </div>
        <p className="mt-2 font-display text-[24px] font-semibold">$1,000 USDC</p>
      </div>

      <div className="mt-4 space-y-2">
        {preview.progress.map((route) => (
          <div key={route.step} className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white/95 p-3">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                route.status === 'done'
                  ? 'bg-[#D6A84F] text-[#2A1A0B]'
                  : route.status === 'live'
                    ? 'bg-[#7E4D22] text-[#F8E6B6]'
                    : 'bg-[#EEF2EA] text-[#8B6A3A]'
              }`}
            >
              {route.status === 'done' ? <CheckCircle2 size={14} /> : <Sparkles size={14} />}
            </div>
            <p className="min-w-0 flex-1 truncate text-[11px] font-bold">{route.step}</p>
            <span className="text-[9px] font-bold uppercase text-[#8B6A3A]">
              {route.status === 'done' ? 'Done' : route.status === 'live' ? 'Live' : 'Next'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-2xl border border-[#D6A84F]/35 bg-[#F8E6B6]/60 p-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#7E4D22]">Receipt</p>
        <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
          <span>Route cost</span>
          <span>$0.94</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] font-bold">
          <span>Destination</span>
          <span>Kamino</span>
        </div>
      </div>
    </div>
  </ScreenChrome>
);

const EarningScreen = ({ preview }) => (
  <ScreenChrome>
    <div className="flex h-full flex-col">
      <AppHeader
        eyebrow="Portfolio"
        title="Yield is live."
        caption="Track positions, earnings and receipts from one place."
        right={
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2A1A0B] text-[#F8E6B6]">
            <Wallet size={17} />
          </div>
        }
      />

      <div className="mt-4 rounded-[26px] bg-[#2A1A0B] p-4 text-[#F8E6B6]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#F8E6B6]/55">Total balance</p>
            <p className="mt-1 font-display text-[29px] font-semibold leading-none">{preview.portfolio.total}</p>
          </div>
          <p className="rounded-full bg-[#EEF2EA] px-2.5 py-1 text-[10px] font-bold text-[#0B7B53]">
            {preview.portfolio.earned}
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-white/10 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#F8E6B6]/52">Best live APY</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-[26px] font-semibold">{preview.portfolio.bestApy}%</span>
            <span className="text-[10px] font-bold text-[#F8E6B6]/70">Low risk</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8B6A3A]">Active positions</p>
      <div className="mt-2 space-y-2">
        {preview.portfolio.positions.map((position) => (
          <div key={position.name} className="flex items-center justify-between rounded-2xl border border-black/[0.08] bg-white/95 p-3">
            <div className="min-w-0">
              <p className="truncate text-[12px] font-bold">{position.name}</p>
              <p className="text-[9px] text-[#8B6A3A]">{position.value} deposited</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-bold text-[#0B7B53]">{position.apy}</p>
              <p className="text-[9px] text-[#8B6A3A]">APY</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between rounded-2xl bg-[#F8E6B6] p-3">
        <span className="text-[10px] font-bold text-[#7E4D22]">{preview.portfolio.activeVault}</span>
        <ArrowRight size={14} />
      </div>
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

const AUTO_ADVANCE_MS = 10_000;

export const PhoneMockup = ({ reducedMotion = false, activeKey, onRotateChange, previewData, autoAdvance = false }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!activeKey) return;
    const nextIndex = SCREENS.findIndex((screen) => screen.key === activeKey);
    if (nextIndex >= 0) setIndex(nextIndex);
  }, [activeKey]);

  useEffect(() => {
    if (!autoAdvance || reducedMotion || isPaused) return undefined;
    const id = setInterval(() => {
      const currentIndex = activeKey
        ? Math.max(0, SCREENS.findIndex((screen) => screen.key === activeKey))
        : index;
      const nextKey = SCREENS[(currentIndex + 1) % SCREENS.length].key;
      if (onRotateChange) onRotateChange(nextKey);
      else setIndex((previous) => (previous + 1) % SCREENS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [activeKey, index, reducedMotion, isPaused, onRotateChange, autoAdvance]);

  return (
    <div
      className="relative mx-auto w-full max-w-[360px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-[9/19] w-full rounded-[50px] bg-[#2A1A0B] p-2 shadow-[0_40px_100px_rgba(126,77,34,0.2)]">
        <div className="absolute inset-[6px] rounded-[44px] border border-white/10" />
        <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-[#F7F3EA]">
          {SCREENS.map((screen, screenIndex) => (
            <div
              key={screen.key}
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                opacity: screenIndex === index ? 1 : 0,
                transform: screenIndex === index ? 'translateY(0)' : 'translateY(16px)',
                pointerEvents: screenIndex === index ? 'auto' : 'none',
              }}
            >
              <screen.Component preview={previewData} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PHONE_SCREEN_KEYS = SCREENS.map((screen) => screen.key);
