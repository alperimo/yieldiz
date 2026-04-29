import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MARKETING_CONTENT } from '../content/marketing';
import { SolanaGlobe } from '../components/marketing/SolanaGlobe';
import { LiveMetrics } from '../components/marketing/LiveMetrics';
import { ChainMarquee } from '../components/marketing/ChainMarquee';
import { RouteDiagram } from '../components/marketing/RouteDiagram';
import { PhoneMockup, PHONE_SCREEN_KEYS } from '../components/marketing/PhoneMockup';
import { PartnerSpotlight } from '../components/marketing/PartnerSpotlight';
import { MevShield } from '../components/marketing/MevShield';
import { VaultSpotlight } from '../components/marketing/VaultSpotlight';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { usePlatformMetrics } from '../hooks/usePlatformMetrics';

gsap.registerPlugin(ScrollTrigger);

const Eyebrow = ({ children, dark = false }) => (
  <div
    className={`inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${
      dark ? 'text-white/62' : 'text-[#526071]'
    }`}
  >
    <span
      className={`h-px w-10 shrink-0 rounded-full ${
        dark
          ? 'bg-[linear-gradient(90deg,rgba(20,241,149,0.75),rgba(153,69,255,0.32))]'
          : 'bg-[linear-gradient(90deg,rgba(153,69,255,0.5),rgba(20,241,149,0.5))]'
      }`}
    />
    {children}
  </div>
);

const MarketingAsset = ({ slot, src, alt, aspect = 'aspect-[4/5]', dark = false, fit = 'cover' }) => (
  <div
    data-asset-slot={slot}
    className={`relative overflow-hidden rounded-[28px] ${aspect} ${
      dark ? 'border border-white/10 bg-[#0B1322]' : 'border border-black/[0.08] bg-[#EEF2EA]'
    }`}
  >
    {src ? (
      <img
        src={src}
        alt={alt || ''}
        className={`h-full w-full ${fit === 'contain' ? 'object-contain p-3' : 'object-cover'}`}
        loading="eager"
      />
    ) : (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: dark
            ? 'radial-gradient(circle at 30% 30%, rgba(153,69,255,0.24), transparent 45%), radial-gradient(circle at 70% 80%, rgba(20,241,149,0.18), transparent 45%), linear-gradient(135deg,#0B1322,#050A14)'
            : 'radial-gradient(circle at 30% 30%, rgba(153,69,255,0.18), transparent 45%), radial-gradient(circle at 70% 80%, rgba(20,241,149,0.18), transparent 45%), linear-gradient(135deg,#EEF2EA,#F5F7F2)',
        }}
      />
    )}
    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
  </div>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[24px] border border-black/[0.08] bg-white/80 shadow-[0_18px_40px_rgba(8,17,31,0.05)]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-display text-[18px] font-semibold text-[#08111F]">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#526071] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{ maxHeight: open ? 200 : 0, opacity: open ? 1 : 0 }}
      >
        <p className="px-6 pb-5 text-[14px] leading-[1.75] text-[#526071]">{a}</p>
      </div>
    </div>
  );
};

export default function Marketing() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pageRef = useRef(null);
  const phoneFlowRef = useRef(null);
  const [phoneKey, setPhoneKey] = useState(PHONE_SCREEN_KEYS[0]);
  const [routeActiveStep, setRouteActiveStep] = useState(0);
  const routeSectionRef = useRef(null);
  const platformMetrics = usePlatformMetrics();
  const metricsLive = platformMetrics.status === 'live';
  const heroLive = platformMetrics.hero;
  const liveMetricsTiles = platformMetrics.liveGrid;

  useLayoutEffect(() => {
    if (prefersReducedMotion || !pageRef.current) return undefined;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('[data-reveal]');
      gsap.set(targets, { y: 48, autoAlpha: 0 });
      ScrollTrigger.batch(targets, {
        start: 'top 86%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.06,
            overwrite: 'auto',
          }),
      });
      ScrollTrigger.refresh();
    }, pageRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Route diagram: highlight the matching left-side step card based on scroll
  // position so the section feels alive without locking the page.
  useLayoutEffect(() => {
    if (!routeSectionRef.current) return undefined;
    if (prefersReducedMotion) return undefined;
    const stepCount = MARKETING_CONTENT.routeDiagram.steps.length;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: routeSectionRef.current,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.4,
        onUpdate: (self) => {
          const idx = Math.min(stepCount - 1, Math.floor(self.progress * stepCount));
          setRouteActiveStep((prev) => (prev === idx ? prev : idx));
        },
      });
    }, routeSectionRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Phone flow scroll-pin: while the section is in view, lock it and let the
  // wheel advance the visible app step. Releases naturally after the last step.
  useLayoutEffect(() => {
    if (!phoneFlowRef.current) return undefined;
    if (prefersReducedMotion || window.matchMedia('(max-width: 1023px)').matches) {
      return undefined;
    }
    const stepCount = PHONE_SCREEN_KEYS.length;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: phoneFlowRef.current,
        start: 'top top',
        end: () => `+=${(stepCount - 1) * window.innerHeight * 0.9}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value) => Math.round(value * (stepCount - 1)) / (stepCount - 1),
          duration: { min: 0.18, max: 0.35 },
          ease: 'power2.out',
        },
        onUpdate: (self) => {
          const idx = Math.min(stepCount - 1, Math.round(self.progress * (stepCount - 1)));
          const nextKey = PHONE_SCREEN_KEYS[idx];
          setPhoneKey((prev) => (prev === nextKey ? prev : nextKey));
        },
      });
      ScrollTrigger.refresh();
    }, phoneFlowRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={pageRef}>
      {/* ─────────────────  HERO  ───────────────── */}
      <section className="relative px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
        <div className="mx-auto grid max-w-[1360px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 lg:space-y-7">
            <Eyebrow>{MARKETING_CONTENT.hero.eyebrow}</Eyebrow>

            <div data-reveal>
              <h1 className="max-w-[18ch] font-display text-[48px] font-semibold leading-[0.96] tracking-[-0.045em] text-[#08111F] sm:text-[64px] lg:text-[78px]">
                {MARKETING_CONTENT.hero.headline}
              </h1>
              <p className="mt-5 max-w-[56ch] text-[16px] leading-[1.65] text-[#526071] lg:text-[18px]">
                {MARKETING_CONTENT.hero.subheadline}
              </p>
            </div>

            <div data-reveal className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/app"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#08111F] px-6 py-4 text-[14px] font-semibold text-white shadow-[0_24px_60px_rgba(8,17,31,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#9945FF,#14F195)] hover:shadow-[0_24px_60px_rgba(153,69,255,0.28)]"
              >
                {MARKETING_CONTENT.hero.primaryCta}
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#operating-model"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-4 text-[14px] font-semibold text-[#08111F] shadow-[0_20px_40px_rgba(8,17,31,0.06)] transition-transform hover:-translate-y-0.5"
              >
                {MARKETING_CONTENT.hero.secondaryCta}
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Live data chips — only render when a real metrics endpoint is wired. */}
            {metricsLive ? (
              <div data-reveal className="grid gap-3 rounded-[24px] border border-black/[0.08] bg-white/80 p-4 shadow-[0_24px_60px_rgba(8,17,31,0.06)] sm:grid-cols-3 sm:p-5">
                {heroLive.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#14F195] shadow-[0_0_10px_#14F195]" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7C8898]">
                        {item.label}
                      </p>
                      <p className="mt-1 font-display text-[20px] font-semibold leading-none text-[#08111F] sm:text-[22px]">
                        {item.value}
                        {item.trend ? (
                          <span className="ml-2 text-[12px] font-semibold text-[#0EA56A]">{item.trend}</span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

          </div>

          <div data-reveal className="relative flex items-center justify-center">
            <SolanaGlobe reducedMotion={prefersReducedMotion} />
          </div>
        </div>
      </section>

      {/* ─────────────────  TRUST ROW (chains only — SDKs are detailed in Infrastructure section) ───────────────── */}
      <section>
        <ChainMarquee items={MARKETING_CONTENT.marqueeChains} variant="light" />
      </section>

      {/* ─────────────────  LIVE METRICS (DARK) — only when wired to a real metrics endpoint  ───────────────── */}
      {metricsLive ? (
        <section className="relative mt-4 overflow-hidden bg-[#08111F] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(153,69,255,0.16),transparent_40%),radial-gradient(circle_at_85%_90%,rgba(20,241,149,0.12),transparent_42%)]" />
          <div className="relative mx-auto max-w-[1360px]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div data-reveal className="max-w-[640px]">
                <Eyebrow dark>Live on Solana right now</Eyebrow>
                <h2 className="mt-5 font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[52px]">
                  Real capital. Real yield. <span className="text-[#14F195]">Real time.</span>
                </h2>
              </div>
              <p data-reveal className="max-w-[420px] text-[15px] leading-[1.7] text-white/60">
                Numbers below reflect the current state of the network — total routed, best live APY, audited destinations and MEV losses prevented.
              </p>
            </div>

            <div data-reveal className="mt-12">
              <LiveMetrics metrics={liveMetricsTiles} reducedMotion={prefersReducedMotion} />
            </div>
          </div>
        </section>
      ) : null}

      {/* ─────────────────  STORY  ───────────────── */}
      <section id="product-story" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div data-reveal>
            <MarketingAsset
              slot={MARKETING_CONTENT.story.assetSlot}
              src={MARKETING_CONTENT.story.asset}
              alt={MARKETING_CONTENT.story.assetAlt}
              aspect="aspect-[4/5]"
            />
          </div>

          <div className="flex flex-col justify-center space-y-8" data-reveal>
            <Eyebrow>{MARKETING_CONTENT.story.eyebrow}</Eyebrow>
            <h2 className="max-w-[14ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#08111F] sm:text-[56px]">
              {MARKETING_CONTENT.story.title}
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.75] text-[#526071] lg:text-[17px]">
              {MARKETING_CONTENT.story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────  ROUTE DIAGRAM (DARK)  ───────────────── */}
      <section
        id="operating-model"
        ref={routeSectionRef}
        className="relative overflow-hidden bg-[#08111F] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(153,69,255,0.22),transparent_40%),radial-gradient(circle_at_90%_60%,rgba(20,241,149,0.12),transparent_44%)]" />
        <div className="relative mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center">
            <Eyebrow dark>{MARKETING_CONTENT.routeDiagram.eyebrow}</Eyebrow>
            <h2 data-reveal className="mt-6 max-w-[16ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[54px]">
              {MARKETING_CONTENT.routeDiagram.title}
            </h2>
            <p data-reveal className="mt-6 max-w-[46ch] text-[16px] leading-[1.75] text-white/70">
              {MARKETING_CONTENT.routeDiagram.subtitle}
            </p>

            <ol data-reveal className="mt-10 space-y-4">
              {MARKETING_CONTENT.routeDiagram.steps.map((s, i) => {
                const isActive = i === routeActiveStep;
                return (
                  <li
                    key={s.step}
                    className={`group flex items-start gap-4 rounded-2xl border p-5 transition-all duration-500 ${
                      isActive
                        ? 'border-[#14F195]/40 bg-white/[0.06] shadow-[0_20px_60px_rgba(20,241,149,0.12)]'
                        : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16]'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tracking-[0.18em] transition-colors duration-500 ${
                        isActive
                          ? 'border-[#14F195]/60 bg-[#14F195]/[0.14] text-[#14F195]'
                          : 'border-white/[0.1] bg-white/[0.04] text-white'
                      }`}
                    >
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <h3 className="font-display text-[18px] font-semibold text-white">{s.title}</h3>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#14F195]">
                          {s.partner}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-[1.65] text-white/70">{s.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div data-reveal className="flex flex-col justify-center">
            <div className="relative overflow-hidden rounded-[34px] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.24)] backdrop-blur">
              <RouteDiagram reducedMotion={prefersReducedMotion} />
              <div className="mt-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#14F195]" />
                  Live signal
                </span>
                <span>1 confirmation · 5 handoffs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────  PHONE FLOW (PINNED)  ───────────────── */}
      <section
        ref={phoneFlowRef}
        className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center space-y-8" data-reveal>
            <Eyebrow>{MARKETING_CONTENT.phoneFlow.eyebrow}</Eyebrow>
            <h2 className="max-w-[14ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#08111F] sm:text-[56px]">
              {MARKETING_CONTENT.phoneFlow.title}
            </h2>
            <p className="max-w-[48ch] text-[16px] leading-[1.75] text-[#526071] lg:text-[17px]">
              {MARKETING_CONTENT.phoneFlow.subtitle}
            </p>

            <ol className="mt-2 space-y-3">
              {MARKETING_CONTENT.phoneFlow.screens.map((s) => {
                const isActive = phoneKey === s.key;
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => setPhoneKey(s.key)}
                      className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${
                        isActive
                          ? 'border-[#08111F] bg-[#08111F] text-white shadow-[0_20px_40px_rgba(8,17,31,0.22)]'
                          : 'border-black/[0.08] bg-white/70 text-[#08111F] hover:-translate-y-0.5'
                      }`}
                    >
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          isActive ? 'bg-[#14F195] shadow-[0_0_10px_#14F195]' : 'bg-[#08111F]/30'
                        }`}
                      />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">{s.label}</p>
                        <p className="mt-1 text-[14px] leading-[1.55]">{s.caption}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div data-reveal className="relative flex items-center justify-center">
            <PhoneMockup
              reducedMotion={prefersReducedMotion}
              activeKey={phoneKey}
              onRotateChange={setPhoneKey}
              previewData={MARKETING_CONTENT.phoneFlow.appPreview}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────  PARTNERS (DARK)  ───────────────── */}
      <section id="execution-stack" className="relative overflow-hidden bg-[#08111F] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(153,69,255,0.14),transparent_38%),radial-gradient(circle_at_10%_80%,rgba(20,241,149,0.1),transparent_42%)]" />
        <div className="relative mx-auto max-w-[1360px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <Eyebrow dark>{MARKETING_CONTENT.partners.eyebrow}</Eyebrow>
              <h2 data-reveal className="mt-6 max-w-[16ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[54px]">
                {MARKETING_CONTENT.partners.title}
              </h2>
            </div>
            <p data-reveal className="max-w-[52ch] text-[16px] leading-[1.75] text-white/65">
              {MARKETING_CONTENT.partners.subtitle}
            </p>
          </div>

          <div data-reveal className="mt-14">
            <PartnerSpotlight partners={MARKETING_CONTENT.partners.list} />
          </div>
        </div>
      </section>

      {/* ─────────────────  VAULT SPOTLIGHT  ───────────────── */}
      <section id="vault-spotlight" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div data-reveal className="max-w-[640px]">
              <Eyebrow>{MARKETING_CONTENT.vaultSpotlight.eyebrow}</Eyebrow>
              <h2 className="mt-6 max-w-[13ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#08111F] sm:text-[56px]">
                {MARKETING_CONTENT.vaultSpotlight.title}
              </h2>
            </div>
            <p data-reveal className="max-w-[420px] text-[15px] leading-[1.7] text-[#526071]">
              {MARKETING_CONTENT.vaultSpotlight.subtitle}
            </p>
          </div>

          <div data-reveal className="mt-12">
            <VaultSpotlight
              vaults={MARKETING_CONTENT.vaultSpotlight.vaults}
              reducedMotion={prefersReducedMotion}
            />
          </div>

          <div data-reveal className="mt-10 flex justify-center">
            <Link
              to="/app/vaults"
              className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-3 text-[13px] font-semibold text-[#08111F] shadow-[0_18px_40px_rgba(8,17,31,0.06)] transition-transform hover:-translate-y-0.5"
            >
              Browse all audited vaults
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────  MEV SHIELD (DARK)  ───────────────── */}
      <section id="security-layer" className="relative overflow-hidden bg-[#08111F] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.08),transparent_38%),radial-gradient(circle_at_20%_80%,rgba(20,241,149,0.12),transparent_44%)]" />
        <div className="relative mx-auto max-w-[1360px]">
          <div className="max-w-[720px]">
            <Eyebrow dark>{MARKETING_CONTENT.mevShield.eyebrow}</Eyebrow>
            <h2 data-reveal className="mt-6 font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[54px]">
              {MARKETING_CONTENT.mevShield.title}
            </h2>
            <p data-reveal className="mt-6 text-[16px] leading-[1.75] text-white/65">
              {MARKETING_CONTENT.mevShield.subtitle}
            </p>
          </div>

          <div data-reveal className="mt-14">
            <MevShield
              before={MARKETING_CONTENT.mevShield.before}
              after={MARKETING_CONTENT.mevShield.after}
              footnote={MARKETING_CONTENT.mevShield.footnote}
              reducedMotion={prefersReducedMotion}
            />
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {MARKETING_CONTENT.security.points.map((pt) => (
              <div
                key={pt.title}
                data-reveal
                className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14F195]/[0.14] text-[#14F195]">
                  <Shield size={18} />
                </div>
                <h3 className="mt-5 font-display text-[18px] font-semibold text-white">{pt.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-white/65">{pt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section removed — fictitious quotes and avatars carry
          consumer-deception risk under FTC, EU UCPD and similar rules. Will
          be reintroduced only with real, attributed user statements. */}

      {/* ─────────────────  PERSONAS  ───────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1360px]">
          <div className="max-w-[720px]" data-reveal>
            <Eyebrow>{MARKETING_CONTENT.personas.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#08111F] sm:text-[54px]">
              {MARKETING_CONTENT.personas.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {MARKETING_CONTENT.personas.list.map((p) => (
              <article
                key={p.title}
                data-reveal
                className="overflow-hidden rounded-[36px] border border-black/[0.08] bg-white shadow-[0_30px_80px_rgba(8,17,31,0.08)]"
              >
                <MarketingAsset
                  slot={p.assetSlot}
                  src={p.asset}
                  alt={p.assetAlt}
                  aspect="aspect-[16/10]"
                  fit="contain"
                />
                <div className="p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#526071]">{p.subtitle}</p>
                  <h3 className="mt-3 font-display text-[28px] font-semibold leading-tight text-[#08111F]">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[#526071]">{p.description}</p>
                  <ul className="mt-6 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] leading-[1.6] text-[#08111F]">
                        <CheckCircle2 size={14} className="mt-1 shrink-0 text-[#14F195]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────  FAQ  ───────────────── */}
      <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal>
            <Eyebrow>Questions, answered</Eyebrow>
            <h2 className="mt-6 font-display text-[36px] font-semibold leading-[0.98] tracking-[-0.035em] text-[#08111F] sm:text-[44px]">
              What people ask us before their first deposit.
            </h2>
            <p className="mt-6 text-[15px] leading-[1.7] text-[#526071]">
              The most-asked questions before a first deposit.
            </p>
          </div>
          <div data-reveal className="space-y-3">
            {MARKETING_CONTENT.faq.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────  FINAL CTA  ───────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <div
          className="relative mx-auto grid max-w-[1360px] overflow-hidden rounded-[42px] px-6 py-10 text-white shadow-[0_40px_120px_rgba(8,17,31,0.22)] sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr]"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(153,69,255,0.34), transparent 40%), radial-gradient(circle at 90% 80%, rgba(20,241,149,0.22), transparent 40%), linear-gradient(135deg,#0B1322 0%,#08111F 60%,#030711 100%)',
          }}
        >
          <div className="relative flex flex-col justify-center space-y-8" data-reveal>
            <Eyebrow dark>{MARKETING_CONTENT.finalCta.eyebrow}</Eyebrow>
            <h2 className="max-w-[16ch] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[56px]">
              {MARKETING_CONTENT.finalCta.title}
            </h2>
            <p className="max-w-[52ch] text-[16px] leading-[1.75] text-white/68 lg:text-[17px]">
              {MARKETING_CONTENT.finalCta.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/app"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#14F195] px-6 py-4 text-[14px] font-semibold text-[#08111F] shadow-[0_24px_60px_rgba(20,241,149,0.28)] transition-transform hover:-translate-y-0.5"
              >
                {MARKETING_CONTENT.finalCta.primaryCta}
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="mailto:hello@solgate.app"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-4 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                {MARKETING_CONTENT.finalCta.secondaryCta}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div data-reveal className="relative flex items-center justify-center">
            <MarketingAsset
              slot={MARKETING_CONTENT.finalCta.assetSlot}
              src={MARKETING_CONTENT.finalCta.asset}
              alt={MARKETING_CONTENT.finalCta.assetAlt}
              aspect="aspect-[4/5]"
              dark
              fit="contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
