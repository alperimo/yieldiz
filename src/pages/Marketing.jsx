import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CheckCircle2, Shield, Waypoints } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MARKETING_CONTENT } from '../content/marketing';
import { AnimatedGlobe } from '../components/marketing/AnimatedGlobe';
import { DepositFlow } from '../components/deposit/DepositFlow';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const SectionEyebrow = ({ children, dark = false }) => (
  <div className={`inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-white/58' : 'text-sg-text-secondary'}`}>
    <span className={`h-px w-8 rounded-full ${dark ? 'bg-white/18' : 'bg-black/[0.12]'}`} />
    {children}
  </div>
);

const StoryStat = ({ label, value, detail }) => (
  <div className="rounded-[28px] border border-black/[0.08] bg-white/80 p-6 shadow-[0_24px_60px_rgba(8,17,31,0.06)]">
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sg-text-secondary">{label}</p>
    <p className="mt-3 font-display text-[30px] font-semibold leading-tight text-[#08111F]">{value}</p>
    <p className="mt-3 max-w-[26ch] text-sm leading-6 text-sg-text-secondary">{detail}</p>
  </div>
);

const PARTNER_MARKS = {
  Solflare: 'SF',
  'LI.FI': 'LI',
  DFlow: 'DF',
  Kamino: 'KM',
  Jito: 'JT',
  QuickNode: 'QN',
};

const PartnerCard = ({ partner, role, value, riskReduction }) => (
  <article className="flex h-full flex-col justify-between rounded-[30px] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur transition-transform duration-300 hover:-translate-y-1">
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.08] text-[11px] font-semibold uppercase tracking-[0.2em] text-white/86">
            {PARTNER_MARKS[partner] || partner.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold text-white">{partner}</h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8FEFD2]">{role}</p>
          </div>
        </div>
        <div className="h-2.5 w-2.5 rounded-full bg-[#14F195] shadow-[0_0_18px_rgba(20,241,149,0.45)]" />
      </div>
      <p className="mt-6 text-base leading-7 text-white/[0.82]">{value}</p>
    </div>
    <div className="mt-6 border-t border-white/[0.08] pt-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">What it means for you</p>
      <p className="mt-2 text-sm leading-6 text-white/80">{riskReduction}</p>
    </div>
  </article>
);

const SecurityCard = ({ title, description }) => (
  <div className="rounded-[28px] border border-black/[0.08] bg-white/80 p-6 shadow-[0_20px_50px_rgba(8,17,31,0.06)]">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08111F] text-[#14F195] shadow-[0_18px_40px_rgba(8,17,31,0.18)]">
      <Shield size={18} />
    </div>
    <h3 className="mt-5 font-display text-2xl font-semibold text-[#08111F]">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-sg-text-secondary">{description}</p>
  </div>
);

const PersonaCard = ({ title, subtitle, description, asset }) => (
  <div className="overflow-hidden rounded-[32px] border border-black/[0.08] bg-white shadow-[0_24px_70px_rgba(8,17,31,0.08)]">
    <div className="aspect-[16/11] overflow-hidden bg-[#E6ECE4]">
      <img src={asset} alt="" className="h-full w-full object-cover" />
    </div>
    <div className="p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sg-text-secondary">{subtitle}</p>
      <h3 className="mt-3 font-display text-[30px] font-semibold leading-tight text-[#08111F]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-sg-text-secondary">{description}</p>
    </div>
  </div>
);

export default function Marketing() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pageRef = useRef(null);
  const flowSectionRef = useRef(null);
  const flowPinRef = useRef(null);
  const flowProgressRef = useRef(null);
  const stepRefs = useRef([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !pageRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((element, index) => {
        gsap.from(element, {
          y: 52,
          scale: 0.985,
          autoAlpha: 0,
          duration: 1,
          delay: index === 0 ? 0.08 : 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom-=14%',
          },
        });
      });

      const steps = stepRefs.current.filter(Boolean);
      if (steps.length && flowPinRef.current && flowSectionRef.current) {
        gsap.set(steps, { opacity: 0, y: 20, pointerEvents: 'none' });
        gsap.set(steps[0], { opacity: 1, y: 0, pointerEvents: 'auto' });
        gsap.set(flowProgressRef.current, { scaleY: 1 / steps.length, transformOrigin: 'top center' });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: flowSectionRef.current,
            start: 'top top',
            end: `+=${(steps.length - 1) * 260}`,
            scrub: 0.5,
            pin: flowPinRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        steps.forEach((step, index) => {
          if (index === 0) return;
          const prev = steps[index - 1];
          const slot = (index - 1) * 1.0;
          // 1) Fade prev OUT first (no overlap)
          timeline.to(prev, { opacity: 0, y: -16, duration: 0.4, pointerEvents: 'none', ease: 'power2.in' }, slot);
          // 2) Then fade NEW in
          timeline.fromTo(
            step,
            { opacity: 0, y: 20, pointerEvents: 'none' },
            { opacity: 1, y: 0, duration: 0.4, pointerEvents: 'auto', ease: 'power2.out' },
            slot + 0.4,
          );
          // Progress bar grows in sync with new card arriving
          timeline.to(
            flowProgressRef.current,
            { scaleY: (index + 1) / steps.length, duration: 0.8, ease: 'none' },
            slot,
          );
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={pageRef}>
      <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32 lg:pt-10">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <SectionEyebrow>{MARKETING_CONTENT.hero.eyebrow}</SectionEyebrow>
            <div data-reveal>
              <p className="max-w-[18ch] font-display text-[56px] font-semibold leading-[0.94] tracking-[-0.05em] text-[#08111F] sm:text-[74px] lg:text-[96px]">
                {MARKETING_CONTENT.hero.headline}
              </p>
              <p className="mt-6 max-w-[58ch] text-lg leading-8 text-sg-text-secondary lg:text-[20px]">
                {MARKETING_CONTENT.hero.subheadline}
              </p>
            </div>

            <div data-reveal className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08111F] px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_60px_rgba(8,17,31,0.18)] transition-transform hover:-translate-y-0.5"
              >
                {MARKETING_CONTENT.hero.primaryCta}
                <ArrowUpRight size={16} />
              </Link>
              <a
                href="#operating-model"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/75 px-6 py-4 text-sm font-semibold text-[#08111F] shadow-[0_20px_40px_rgba(8,17,31,0.06)] transition-transform hover:-translate-y-0.5"
              >
                {MARKETING_CONTENT.hero.secondaryCta}
                <ArrowRight size={16} />
              </a>
            </div>

            <div data-reveal className="grid gap-3 rounded-[32px] border border-black/[0.08] bg-white/72 p-6 shadow-[0_24px_60px_rgba(8,17,31,0.06)] sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sg-text-secondary">Why people choose SolGate</p>
                <p className="mt-3 max-w-[28ch] font-display text-2xl font-semibold leading-tight text-[#08111F]">
                  {MARKETING_CONTENT.hero.trustLine}
                </p>
              </div>
              <div className="space-y-3">
                {MARKETING_CONTENT.hero.trustPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm leading-6 text-sg-text-secondary">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-[#14F195]" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal className="relative">
            <AnimatedGlobe reducedMotion={prefersReducedMotion} />
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-3">
          {MARKETING_CONTENT.proofPoints.map((point) => (
            <StoryStat key={point.label} {...point} />
          ))}
        </div>
      </section>

      <section id="product-story" className="px-4 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="relative overflow-hidden rounded-[38px] border border-black/[0.08] bg-[#0C1628] p-6 shadow-[0_40px_120px_rgba(8,17,31,0.16)] sm:p-8" data-reveal>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,241,149,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(0,194,255,0.24),transparent_36%)]" />
            <img
              src={MARKETING_CONTENT.story.featuredAsset}
              alt=""
              className="relative h-full w-full rounded-[28px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-8" data-reveal>
            <SectionEyebrow>{MARKETING_CONTENT.story.eyebrow}</SectionEyebrow>
            <div>
              <h2 className="max-w-[12ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#08111F] sm:text-[56px]">
                {MARKETING_CONTENT.story.title}
              </h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-sg-text-secondary lg:text-lg">
              {MARKETING_CONTENT.story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="rounded-[30px] border border-black/[0.08] bg-[#08111F] p-6 text-white shadow-[0_26px_80px_rgba(8,17,31,0.14)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14F195]/[0.12] text-[#14F195]">
                  <Waypoints size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">Our promise</p>
                  <p className="mt-3 max-w-[48ch] text-base leading-7 text-white/[0.78]">
                    See the route, see the fees, keep your keys, and move into yield without second-guessing the next step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="operating-model"
        ref={flowSectionRef}
        className={`relative overflow-hidden bg-[#0C1628] px-4 py-20 text-white sm:px-6 lg:px-8 ${prefersReducedMotion ? '' : 'min-h-screen'}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,241,149,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(124,107,255,0.2),transparent_34%),linear-gradient(180deg,#0C1628_0%,#08111F_100%)]" />
        <div
          ref={flowPinRef}
          className={`mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr] ${prefersReducedMotion ? '' : 'min-h-[calc(100vh-6rem)] items-center'}`}
        >
          <div className="relative z-10 flex flex-col justify-center">
            <SectionEyebrow dark>How it works</SectionEyebrow>
            <h2 className="mt-6 max-w-[14ch] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[58px]">
              From your wallet to Solana yield in five steps.
            </h2>
            <p className="mt-6 max-w-[44ch] text-base leading-8 text-white/[0.68] lg:text-lg">
              No multi-tab juggling, no manual bridges. Connect, choose a vault, confirm — and watch your stablecoins start earning.
            </p>

            <div className="mt-10 flex items-start gap-6">
              <div className="relative hidden h-[280px] w-1 rounded-full bg-white/10 lg:block">
                <div ref={flowProgressRef} className="absolute inset-x-0 top-0 h-full rounded-full bg-[linear-gradient(180deg,#14F195_0%,#00C2FF_50%,#7C6BFF_100%)]" />
              </div>
              <div className="relative w-full" style={{ minHeight: prefersReducedMotion ? 'auto' : '320px' }}>
                {MARKETING_CONTENT.howItWorks.map((step, index) => (
                  <article
                    key={step.step}
                    ref={(node) => {
                      stepRefs.current[index] = node;
                    }}
                    className={`rounded-[32px] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-8 shadow-[0_30px_80px_rgba(8,17,31,0.34)] backdrop-blur-sm ${
                      prefersReducedMotion ? 'mt-4 first:mt-0' : 'absolute inset-x-0 top-0'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/90">
                        {step.step}
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8FEFD2]">{step.callout}</p>
                    </div>
                    <h3 className="mt-5 font-display text-[30px] font-semibold">{step.title}</h3>
                    <p className="mt-3 max-w-[54ch] text-sm leading-7 text-white/[0.78]">{step.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10" data-reveal>
            <div className="overflow-hidden rounded-[34px] border border-white/[0.12] bg-[linear-gradient(180deg,rgba(245,247,242,0.1),rgba(255,255,255,0.02))] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.2)] backdrop-blur">
              <img
                src="/marketing/route-explainer.svg"
                alt=""
                className="h-full w-full rounded-[28px] border border-white/10 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="live-preview" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col justify-center space-y-7" data-reveal>
            <SectionEyebrow>The earn flow</SectionEyebrow>
            <div>
              <h2 className="max-w-[12ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#08111F] sm:text-[58px]">
                Three taps. Money working.
              </h2>
              <p className="mt-6 max-w-[48ch] text-base leading-8 text-sg-text-secondary lg:text-lg">
                Choose the chain you hold on. Pick a vault. Confirm the amount. SolGate routes your stablecoins across the bridge, swap and deposit — you only sign once.
              </p>
            </div>
            <div className="rounded-[28px] border border-black/[0.08] bg-white/75 p-6 shadow-[0_24px_70px_rgba(8,17,31,0.08)]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14F195]/[0.16] text-[#08111F]">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-[#08111F]">Earning in minutes</p>
                  <p className="mt-3 text-sm leading-7 text-sg-text-secondary">
                    From wallet connect to first yield, the average deposit settles in under three minutes — with full visibility on every step.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div data-reveal className="rounded-[36px] border border-black/[0.08] bg-[#08111F] p-4 shadow-[0_40px_120px_rgba(8,17,31,0.18)]">
            <div className="mb-4 flex items-center gap-2 px-3 py-2 text-white/[0.56]">
              <span className="h-3 w-3 rounded-full bg-white/[0.18]" />
              <span className="h-3 w-3 rounded-full bg-white/[0.12]" />
              <span className="h-3 w-3 rounded-full bg-white/[0.08]" />
              <div className="ml-3 rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
                solgate.app · Earn
              </div>
            </div>
            <div className="overflow-hidden rounded-[28px] bg-[#F5F7F2] px-2 pb-2 pt-5">
              <div className="pointer-events-none origin-top scale-[0.78] sm:scale-[0.86] lg:scale-[0.92]">
                <DepositFlow />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="execution-stack" className="bg-[#08111F] px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-8">
            <div className="max-w-[720px]" data-reveal>
              <SectionEyebrow dark>Execution network</SectionEyebrow>
              <h2 className="mt-6 font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[60px]">
                Trusted at every handoff.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/[0.66] lg:text-lg">
                Every deposit moves through established partners for access, routing, execution, and vault entry — so the path from wallet to yield stays visible and controlled.
              </p>
            </div>

            <div data-reveal className="overflow-hidden rounded-[34px] border border-white/[0.12] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.2)] backdrop-blur">
              <img
                src="/marketing/execution-network.svg"
                alt=""
                className="h-full w-full rounded-[28px] border border-white/10 object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-3" data-reveal>
              {MARKETING_CONTENT.partnerStack.map((item) => (
                <div
                  key={item.partner}
                  className="rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/72"
                >
                  {item.partner}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {MARKETING_CONTENT.partnerStack.map((item) => (
              <div key={item.partner} data-reveal className="h-full">
                <PartnerCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security-layer" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="order-2 flex flex-col justify-center lg:order-1" data-reveal>
            <SectionEyebrow>{MARKETING_CONTENT.security.eyebrow}</SectionEyebrow>
            <h2 className="mt-6 max-w-[12ch] font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#08111F] sm:text-[58px]">
              {MARKETING_CONTENT.security.title}
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {MARKETING_CONTENT.security.points.map((item) => (
                <SecurityCard key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="order-1 overflow-hidden rounded-[38px] border border-black/[0.08] bg-[#08111F] p-6 shadow-[0_40px_120px_rgba(8,17,31,0.16)] lg:order-2" data-reveal>
            <img
              src={MARKETING_CONTENT.security.featuredAsset}
              alt=""
              className="h-full w-full rounded-[28px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-[700px]" data-reveal>
            <SectionEyebrow>Built for everyone with stablecoins</SectionEyebrow>
            <h2 className="mt-6 font-display text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#08111F] sm:text-[58px]">
              Whether it&rsquo;s your savings or your treasury, the path is the same.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {MARKETING_CONTENT.personas.map((persona) => (
              <div key={persona.title} data-reveal>
                <PersonaCard {...persona} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <div className="mx-auto grid max-w-[1280px] gap-10 overflow-hidden rounded-[42px] bg-[#08111F] px-6 py-8 text-white shadow-[0_40px_120px_rgba(8,17,31,0.2)] sm:px-8 sm:py-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center space-y-8" data-reveal>
            <SectionEyebrow dark>{MARKETING_CONTENT.finalCta.eyebrow}</SectionEyebrow>
            <div>
              <h2 className="max-w-[11ch] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[58px]">
                {MARKETING_CONTENT.finalCta.title}
              </h2>
              <p className="mt-6 max-w-[48ch] text-base leading-8 text-white/[0.68] lg:text-lg">
                {MARKETING_CONTENT.finalCta.description}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#14F195] px-6 py-4 text-sm font-semibold text-[#08111F] shadow-[0_20px_60px_rgba(20,241,149,0.24)] transition-transform hover:-translate-y-0.5"
              >
                {MARKETING_CONTENT.finalCta.primaryCta}
                <ArrowUpRight size={16} />
              </Link>
              <a
                href="#operating-model"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.14] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {MARKETING_CONTENT.finalCta.secondaryCta}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-white/[0.12] bg-white/[0.06] p-4 backdrop-blur" data-reveal>
            <img
              src={MARKETING_CONTENT.finalCta.featuredAsset}
              alt=""
              className="h-full w-full rounded-[26px] object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
