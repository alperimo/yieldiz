import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { HeroGlobe } from '../components/marketing/HeroGlobe';
import { CinematicSpotlight } from '../components/marketing/CinematicSpotlight';
import { LiveMetrics } from '../components/marketing/LiveMetrics';
import { RouteDiagram } from '../components/marketing/RouteDiagram';
import { PhoneMockup, PHONE_SCREEN_KEYS } from '../components/marketing/PhoneMockup';
import { PartnerSpotlight } from '../components/marketing/PartnerSpotlight';
import { MevShield } from '../components/marketing/MevShield';
import { VaultSpotlight } from '../components/marketing/VaultSpotlight';
import { Spotlight } from '../components/ui/Spotlight';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { usePlatformMetrics } from '../hooks/usePlatformMetrics';
import { useVaults } from '../hooks/useVaults';

gsap.registerPlugin(ScrollTrigger);

const Eyebrow = ({ children, dark = false, className = '', lineClassName = '' }) => (
  <div
    className={`inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${
      dark ? 'text-white/70' : 'text-[#654B2B]'
    } ${className}`}
  >
    <span
      className={`h-px w-10 shrink-0 rounded-full ${
        dark ? 'bg-white/45' : 'bg-[#7E4D22]/45'
      } ${lineClassName}`}
    />
    {children}
  </div>
);

const MarketingAsset = ({
  slot,
  src,
  alt,
  aspect = 'aspect-[4/5]',
  dark = false,
  fit = 'cover',
  loading = 'lazy',
  sizes = '(min-width: 1024px) 44vw, 100vw',
  imageClassName = '',
}) => (
  <div
    data-cinematic-card
    data-asset-slot={slot}
    className={`relative overflow-hidden rounded-[28px] transition-transform duration-500 will-change-transform ${aspect} ${
      dark ? 'border border-white/15 bg-[#7E4D22]' : 'border border-black/[0.08] bg-[#F8E6B6]'
    }`}
    style={{ transformStyle: 'preserve-3d' }}
  >
    {src ? (
      <img
        src={src}
        alt={alt || ''}
        className={`h-full w-full ${fit === 'contain' ? 'object-contain p-3' : 'object-cover'} ${imageClassName}`}
        loading={loading}
        decoding="async"
        sizes={sizes}
      />
    ) : (
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: dark ? '#7E4D22' : '#F8E6B6',
        }}
      />
    )}
    <div
      data-cinematic-shine
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
      style={{
        background:
          'radial-gradient(circle at var(--cinematic-x, 50%) var(--cinematic-y, 50%), rgba(255,255,255,0.34), rgba(248,230,182,0.12) 22%, transparent 48%)',
      }}
    />
    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
  </div>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[24px] border border-black/[0.08] bg-white/80 shadow-[0_18px_40px_rgba(126,77,34,0.05)]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-display text-[18px] font-semibold text-[#2A1A0B]">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#654B2B] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{ maxHeight: open ? 200 : 0, opacity: open ? 1 : 0 }}
      >
        <p className="px-6 pb-5 text-[14px] leading-[1.75] text-[#654B2B]">{a}</p>
      </div>
    </div>
  );
};

const formatCompactUsd = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value || 0);

const riskScoreFor = (riskLevel) => ({ low: 1, medium: 3, high: 5 }[riskLevel] ?? 3);

const toMarketingVaults = (vaults) => {
  if (!vaults?.length) return MARKETING_CONTENT.vaultSpotlight.vaults;

  const selected = [...vaults]
    .filter((vault) => vault.tvl > 100_000 && vault.apy > 0)
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 3);

  if (!selected.length) return MARKETING_CONTENT.vaultSpotlight.vaults;

  return selected.map((vault, index) => ({
    pubkey: vault.pubkey,
    name: vault.name,
    pair: vault.token,
    apy: vault.apy,
    tvl: formatCompactUsd(vault.tvl),
    risk: vault.riskLevel === 'low' ? 'Low' : vault.riskLevel === 'high' ? 'High' : 'Medium',
    riskScore: riskScoreFor(vault.riskLevel),
    badge: index === 0 ? 'Highest live APY' : index === 1 ? 'Deep liquidity' : 'Curated vault',
    strategy: vault.description,
  }));
};

export default function Marketing() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pageRef = useRef(null);
  const phoneFlowRef = useRef(null);
  const [phoneKey, setPhoneKey] = useState(PHONE_SCREEN_KEYS[0]);
  const [routeActiveStep, setRouteActiveStep] = useState(0);
  const routeSectionRef = useRef(null);
  const platformMetrics = usePlatformMetrics();
  const { data: liveVaults } = useVaults();
  const metricsLive = platformMetrics.status === 'live';
  const heroLive = platformMetrics.hero;
  const liveMetricsTiles = platformMetrics.liveGrid;
  const spotlightVaults = useMemo(() => toMarketingVaults(liveVaults), [liveVaults]);

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

  useLayoutEffect(() => {
    if (prefersReducedMotion || !pageRef.current) return undefined;

    const cleanup = [];
    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray('[data-hero-cinematic]');
      gsap.fromTo(
        heroItems,
        { y: 34, rotationX: -16, filter: 'blur(10px)' },
        {
          y: 0,
          rotationX: 0,
          filter: 'blur(0px)',
          duration: 1.05,
          delay: 0.08,
          ease: 'power3.out',
          stagger: 0.08,
        },
      );

      const heroSection = pageRef.current.querySelector('[data-hero-section]');
      const heroVisual = pageRef.current.querySelector('[data-hero-visual]');
      if (heroSection && heroVisual) {
        gsap.to(heroVisual, {
          yPercent: 6,
          scale: 0.985,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      gsap.utils.toArray('[data-cinematic-card]').forEach((card) => {
        const shine = card.querySelector('[data-cinematic-shine]');
        const rotateXTo = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3.out' });
        const rotateYTo = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3.out' });
        const scaleTo = gsap.quickTo(card, 'scale', { duration: 0.45, ease: 'power3.out' });
        const shineTo = shine ? gsap.quickTo(shine, 'opacity', { duration: 0.25, ease: 'power2.out' }) : null;

        const handleMove = (event) => {
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          card.style.setProperty('--cinematic-x', `${x * 100}%`);
          card.style.setProperty('--cinematic-y', `${y * 100}%`);
          rotateYTo((x - 0.5) * 8);
          rotateXTo((0.5 - y) * 7);
          scaleTo(1.018);
          shineTo?.(1);
        };

        const handleLeave = () => {
          rotateXTo(0);
          rotateYTo(0);
          scaleTo(1);
          shineTo?.(0);
        };

        card.addEventListener('pointermove', handleMove);
        card.addEventListener('pointerleave', handleLeave);
        cleanup.push(() => {
          card.removeEventListener('pointermove', handleMove);
          card.removeEventListener('pointerleave', handleLeave);
        });
      });

      gsap.utils.toArray('[data-magnetic]').forEach((node) => {
        const xTo = gsap.quickTo(node, 'x', { duration: 0.34, ease: 'power3.out' });
        const yTo = gsap.quickTo(node, 'y', { duration: 0.34, ease: 'power3.out' });

        const handleMove = (event) => {
          const bounds = node.getBoundingClientRect();
          xTo((event.clientX - bounds.left - bounds.width / 2) * 0.16);
          yTo((event.clientY - bounds.top - bounds.height / 2) * 0.16);
        };

        const handleLeave = () => {
          xTo(0);
          yTo(0);
        };

        node.addEventListener('pointermove', handleMove);
        node.addEventListener('pointerleave', handleLeave);
        cleanup.push(() => {
          node.removeEventListener('pointermove', handleMove);
          node.removeEventListener('pointerleave', handleLeave);
        });
      });
    }, pageRef);

    return () => {
      cleanup.forEach((dispose) => dispose());
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  // Route diagram: highlight the matching left-side step card based on scroll
  // position so the section feels alive without locking the page. We start
  // when the section is roughly centered (top 35%) and end when its bottom
  // is well past the viewport, so each card has time to read before the
  // next one lights up.
  useLayoutEffect(() => {
    if (!routeSectionRef.current) return undefined;
    if (prefersReducedMotion) return undefined;
    const stepCount = MARKETING_CONTENT.routeDiagram.steps.length;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: routeSectionRef.current,
        start: 'top 30%',
        end: 'bottom 80%',
        scrub: 0.6,
        onUpdate: (self) => {
          // Slight inner margin so 0.0..0.1 stays on step 0 and 0.9..1 stays
          // on the last step rather than flipping mid-gesture.
          const t = Math.max(0, Math.min(1, (self.progress - 0.05) / 0.9));
          const idx = Math.min(stepCount - 1, Math.floor(t * stepCount));
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

  const handleSectionLinkClick = (event, href) => {
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    window.history.replaceState(null, '', href);
  };

  return (
    <div ref={pageRef}>
      {/* ─────────────────  HERO  ───────────────── */}
      <section
        data-hero-section
        data-header-theme="light"
        className="relative isolate overflow-hidden px-4 pb-3 pt-2 sm:px-6 lg:px-8 lg:pb-4 lg:pt-3"
      >
        <Spotlight className="animate-spotlight -top-[44%] left-[-22%] md:left-[30%] md:-top-[38%]" fill="#F8E6B6" />
        <CinematicSpotlight reducedMotion={prefersReducedMotion} size={620} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-18%] z-0 h-[54%] bg-[radial-gradient(circle_at_52%_34%,rgba(248,230,182,0.62),rgba(214,168,79,0.16)_38%,transparent_70%)] blur-3xl" />
        <div className="relative z-[3] mx-auto grid min-h-[calc(100svh-68px)] max-w-[1360px] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="space-y-5 lg:-translate-y-6 lg:space-y-5">
            <Eyebrow className="text-[12px] tracking-[0.2em]" lineClassName="w-8">
              {MARKETING_CONTENT.hero.eyebrow}
            </Eyebrow>

            <div data-reveal>
              <h1 data-hero-cinematic className="font-display text-[48px] font-semibold leading-[0.96] tracking-[-0.045em] text-[#2A1A0B] sm:text-[64px] lg:text-[88px]">
                <span className="sm:whitespace-nowrap">Move stablecoins</span>
                {' into Solana yield with clarity.'}
              </h1>
              <p data-hero-cinematic className="mt-5 max-w-[52ch] text-[17px] leading-[1.65] text-[#654B2B] lg:text-[19px]">
                {MARKETING_CONTENT.hero.subheadline}
              </p>
            </div>

            <div data-reveal data-hero-cinematic className="flex flex-col gap-3 sm:flex-row">
              <Link
                data-magnetic
                to="/app"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#7E4D22] px-6 py-4 text-[14px] font-semibold text-[#F8E6B6] shadow-[0_24px_60px_rgba(126,77,34,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#65401F] hover:shadow-[0_24px_60px_rgba(126,77,34,0.22)]"
              >
                {MARKETING_CONTENT.hero.primaryCta}
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                data-magnetic
                href="#operating-model"
                onClick={(event) => handleSectionLinkClick(event, '#operating-model')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-4 text-[14px] font-semibold text-[#2A1A0B] shadow-[0_20px_40px_rgba(126,77,34,0.06)] transition-transform hover:-translate-y-0.5"
              >
                {MARKETING_CONTENT.hero.secondaryCta}
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Live data chips — only render when a real metrics endpoint is wired. */}
            {metricsLive ? (
              <div data-reveal className="grid gap-3 rounded-[24px] border border-black/[0.08] bg-white/80 p-4 shadow-[0_24px_60px_rgba(126,77,34,0.06)] sm:grid-cols-3 sm:p-5">
                {heroLive.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#D6A84F] shadow-[0_0_10px_#D6A84F]" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B6A3A]">
                        {item.label}
                      </p>
                      <p className="mt-1 font-display text-[20px] font-semibold leading-none text-[#2A1A0B] sm:text-[22px]">
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

          <div data-reveal data-hero-visual className="relative flex items-center justify-center lg:-translate-y-4">
            <HeroGlobe reducedMotion={prefersReducedMotion} />
          </div>
        </div>
      </section>

      {/* ─────────────────  LIVE METRICS (DARK) — only when wired to a real metrics endpoint  ───────────────── */}
      {metricsLive ? (
        <section data-header-theme="gold" className="relative mt-4 overflow-hidden bg-[#D6A84F] px-4 py-24 text-[#2A1A0B] sm:px-6 lg:px-8 lg:py-28">
          <div className="relative mx-auto max-w-[1360px]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div data-reveal className="max-w-[640px]">
            <Eyebrow>Live on Solana right now</Eyebrow>
                <h2 className="mt-5 font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[52px]">
                  Real capital. Real yield. <span className="text-[#7E4D22]">Real time.</span>
                </h2>
              </div>
              <p data-reveal className="max-w-[420px] text-[15px] leading-[1.7] text-[#3B2A16]/75">
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
      <section id="product-story" data-header-theme="light" className="px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-32 lg:pt-16">
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div data-reveal>
            <MarketingAsset
              slot={MARKETING_CONTENT.story.assetSlot}
              src={MARKETING_CONTENT.story.asset}
              alt={MARKETING_CONTENT.story.assetAlt}
              aspect="aspect-[2/3]"
            />
          </div>

          <div className="flex flex-col justify-center space-y-8" data-reveal>
            <Eyebrow>{MARKETING_CONTENT.story.eyebrow}</Eyebrow>
            <h2 className="max-w-[14ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#2A1A0B] sm:text-[56px]">
              {MARKETING_CONTENT.story.title}
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.75] text-[#654B2B] lg:text-[17px]">
              {MARKETING_CONTENT.story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────  ROUTE DIAGRAM  ───────────────── */}
      <section
        id="operating-model"
        ref={routeSectionRef}
        data-header-theme="copper"
        className="relative overflow-hidden bg-[#7E4D22] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="relative mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="flex flex-col justify-center">
            <Eyebrow dark>{MARKETING_CONTENT.routeDiagram.eyebrow}</Eyebrow>
            <h2 data-reveal className="mt-6 max-w-[16ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[54px]">
              {MARKETING_CONTENT.routeDiagram.title}
            </h2>
            <p data-reveal className="mt-6 max-w-[46ch] text-[16px] leading-[1.75] text-white/72">
              {MARKETING_CONTENT.routeDiagram.subtitle}
            </p>

            <ol data-reveal className="mt-10 space-y-4">
              {MARKETING_CONTENT.routeDiagram.steps.map((s, i) => {
                const isActive = i === routeActiveStep;
                return (
                  <li
                    key={s.step}
                    className={`group flex items-start gap-4 rounded-2xl border p-5 transition-colors duration-300 ${
                      isActive
                        ? 'border-transparent bg-[#F8E6B6] text-[#2A1A0B]'
                        : 'border-transparent bg-white/[0.075] text-white hover:bg-white/[0.11]'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tracking-[0.18em] transition-colors duration-500 ${
                        isActive
                          ? 'border-[#7E4D22]/50 bg-[#7E4D22] text-[#F8E6B6]'
                          : 'border-white/20 bg-white/10 text-white'
                      }`}
                    >
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <h3 className={`font-display text-[18px] font-semibold ${isActive ? 'text-[#2A1A0B]' : 'text-white'}`}>{s.title}</h3>
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${isActive ? 'text-[#7E4D22]' : 'text-[#F8E6B6]'}`}>
                          {s.partner}
                        </span>
                      </div>
                      <p className={`mt-1 text-[13px] leading-[1.65] ${isActive ? 'text-[#4A3218]/80' : 'text-white/70'}`}>{s.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div data-reveal className="flex flex-col justify-center">
            <div data-cinematic-card className="relative overflow-hidden rounded-[34px] border border-[#F8E6B6]/30 bg-[#F8E6B6] p-6 will-change-transform">
              <RouteDiagram reducedMotion={prefersReducedMotion} />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────  PHONE FLOW (PINNED)  ───────────────── */}
      <section
        ref={phoneFlowRef}
        data-header-theme="light"
        className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center space-y-8" data-reveal>
            <Eyebrow>{MARKETING_CONTENT.phoneFlow.eyebrow}</Eyebrow>
            <h2 className="max-w-[14ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#2A1A0B] sm:text-[56px]">
              {MARKETING_CONTENT.phoneFlow.title}
            </h2>
            <p className="max-w-[48ch] text-[16px] leading-[1.75] text-[#654B2B] lg:text-[17px]">
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
                          ? 'border-[#7E4D22] bg-[#7E4D22] text-[#F8E6B6] shadow-[0_20px_40px_rgba(126,77,34,0.22)]'
                          : 'border-black/[0.08] bg-white/70 text-[#2A1A0B] hover:-translate-y-0.5'
                      }`}
                    >
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          isActive ? 'bg-[#D6A84F] shadow-[0_0_10px_#D6A84F]' : 'bg-[#7E4D22]/30'
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

      {/* ─────────────────  ROUTE CONTROLS  ───────────────── */}
      <section id="route-controls" data-header-theme="light" className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div data-reveal>
              <Eyebrow>{MARKETING_CONTENT.routeControls.eyebrow}</Eyebrow>
              <h2 className="mt-6 max-w-[14ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#2A1A0B] sm:text-[54px]">
                {MARKETING_CONTENT.routeControls.title}
              </h2>
            </div>
            <p data-reveal className="max-w-[560px] text-[16px] leading-[1.75] text-[#654B2B]">
              {MARKETING_CONTENT.routeControls.subtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {MARKETING_CONTENT.routeControls.cards.map((card) => (
              <article
                key={card.title}
                data-reveal
                data-cinematic-card
                className="relative overflow-hidden rounded-[28px] border border-black/[0.08] bg-white/80 p-6 shadow-[0_24px_60px_rgba(126,77,34,0.06)] will-change-transform"
              >
                <div
                  data-cinematic-shine
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    background:
                      'radial-gradient(circle at var(--cinematic-x, 50%) var(--cinematic-y, 50%), rgba(255,255,255,0.44), rgba(248,230,182,0.18) 25%, transparent 52%)',
                  }}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8E6B6] text-[#7E4D22]">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="mt-5 font-display text-[20px] font-semibold tracking-[-0.02em] text-[#2A1A0B]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-[#654B2B]">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────  PARTNERS  ───────────────── */}
      <section id="execution-stack" data-header-theme="champagne" className="relative overflow-hidden bg-[#F8E6B6] px-4 py-24 text-[#2A1A0B] sm:px-6 lg:px-8 lg:py-32">
        <div className="relative mx-auto max-w-[1360px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <Eyebrow>{MARKETING_CONTENT.partners.eyebrow}</Eyebrow>
              <h2 data-reveal className="mt-6 max-w-[16ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[54px]">
                {MARKETING_CONTENT.partners.title}
              </h2>
            </div>
            <p data-reveal className="max-w-[52ch] text-[16px] leading-[1.75] text-[#3B2A16]/75">
              {MARKETING_CONTENT.partners.subtitle}
            </p>
          </div>

          <div data-reveal className="mt-14">
            <PartnerSpotlight partners={MARKETING_CONTENT.partners.list} />
          </div>
        </div>
      </section>

      {/* ─────────────────  VAULT SPOTLIGHT  ───────────────── */}
      <section id="vault-spotlight" data-header-theme="light" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div data-reveal className="max-w-[640px]">
              <Eyebrow>{MARKETING_CONTENT.vaultSpotlight.eyebrow}</Eyebrow>
              <h2 className="mt-6 max-w-[13ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#2A1A0B] sm:text-[56px]">
                {MARKETING_CONTENT.vaultSpotlight.title}
              </h2>
            </div>
            <p data-reveal className="max-w-[420px] text-[15px] leading-[1.7] text-[#654B2B]">
              {MARKETING_CONTENT.vaultSpotlight.subtitle}
            </p>
          </div>

          <div data-reveal className="mt-12">
            <VaultSpotlight
              vaults={spotlightVaults}
              reducedMotion={prefersReducedMotion}
            />
          </div>

          <div data-reveal className="mt-10 flex justify-center">
            <Link
              data-magnetic
              to="/app/vaults"
              className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-3 text-[13px] font-semibold text-[#2A1A0B] shadow-[0_18px_40px_rgba(126,77,34,0.06)] transition-transform hover:-translate-y-0.5"
            >
              Browse all audited vaults
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────  MEV SHIELD  ───────────────── */}
      <section id="security-layer" data-header-theme="copper" className="relative overflow-hidden bg-[#7E4D22] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32">
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
                data-cinematic-card
                className="relative overflow-hidden rounded-[24px] border border-white/15 bg-white/10 p-6 will-change-transform"
              >
                <div
                  data-cinematic-shine
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    background:
                      'radial-gradient(circle at var(--cinematic-x, 50%) var(--cinematic-y, 50%), rgba(248,230,182,0.16), transparent 52%)',
                  }}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8E6B6] text-[#7E4D22]">
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
      <section data-header-theme="light" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1360px]">
          <div className="max-w-[720px]" data-reveal>
            <Eyebrow>{MARKETING_CONTENT.personas.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#2A1A0B] sm:text-[54px]">
              {MARKETING_CONTENT.personas.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {MARKETING_CONTENT.personas.list.map((p) => (
              <article
                key={p.title}
                data-reveal
                data-cinematic-card
                className="overflow-hidden rounded-[36px] border border-black/[0.08] bg-white shadow-[0_30px_80px_rgba(126,77,34,0.08)] will-change-transform"
              >
                <MarketingAsset
                  slot={p.assetSlot}
                  src={p.asset}
                  alt={p.assetAlt}
                  aspect="aspect-[16/10]"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#654B2B]">{p.subtitle}</p>
                  <h3 className="mt-3 font-display text-[28px] font-semibold leading-tight text-[#2A1A0B]">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[#654B2B]">{p.description}</p>
                  <ul className="mt-6 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] leading-[1.6] text-[#2A1A0B]">
                        <CheckCircle2 size={14} className="mt-1 shrink-0 text-[#D6A84F]" />
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
      <section id="faq" data-header-theme="light" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal>
            <Eyebrow>Questions, answered</Eyebrow>
            <h2 className="mt-6 font-display text-[36px] font-semibold leading-[0.98] tracking-[-0.035em] text-[#2A1A0B] sm:text-[44px]">
              What people ask us before their first deposit.
            </h2>
            <p className="mt-6 text-[15px] leading-[1.7] text-[#654B2B]">
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
      <section
        data-header-theme="deepCopper"
        className="bg-[#5C3418] px-4 py-24 text-[#F8E6B6] sm:px-6 lg:px-8 lg:py-32"
      >
        <div
          className="relative mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative flex flex-col justify-center space-y-8" data-reveal>
            <Eyebrow dark>{MARKETING_CONTENT.finalCta.eyebrow}</Eyebrow>
            <h2 className="max-w-[16ch] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[56px]">
              {MARKETING_CONTENT.finalCta.title}
            </h2>
            <p className="max-w-[52ch] text-[16px] font-medium leading-[1.75] text-[#F8E6B6]/82 lg:text-[17px]">
              {MARKETING_CONTENT.finalCta.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                data-magnetic
                to="/app"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#F8E6B6] px-6 py-4 text-[14px] font-semibold text-[#5C3418] shadow-[0_24px_60px_rgba(42,26,11,0.28)] transition-transform hover:-translate-y-0.5 hover:bg-white"
              >
                {MARKETING_CONTENT.finalCta.primaryCta}
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                data-magnetic
                href="mailto:hello@yieldiz.app"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F8E6B6]/30 bg-white/8 px-6 py-4 text-[14px] font-semibold text-[#F8E6B6] transition-colors hover:bg-white/12"
              >
                {MARKETING_CONTENT.finalCta.secondaryCta}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div data-reveal className="relative flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[420px]">
              <MarketingAsset
                slot={MARKETING_CONTENT.finalCta.assetSlot}
                src={MARKETING_CONTENT.finalCta.asset}
                alt={MARKETING_CONTENT.finalCta.assetAlt}
                aspect="aspect-[2/3]"
                dark
                loading="lazy"
                sizes="(min-width: 1024px) 420px, 100vw"
                imageClassName="scale-[1.015]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
