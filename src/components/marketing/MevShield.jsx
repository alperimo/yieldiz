import React, { useLayoutEffect, useRef } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Visualizes "with/without MEV protection" using two contrasting panels and
// animated sandwich-attack vs atomic-bundle diagrams.

export const MevShield = ({ before, after, footnote, reducedMotion = false }) => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('[data-mev-front]', {
        x: 42,
        duration: 2.2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
      gsap.to('[data-mev-back]', {
        x: -42,
        duration: 2.2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.4,
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
      gsap.fromTo(
        '[data-mev-bundle-glow]',
        { opacity: 0.3, scale: 0.96 },
        {
          opacity: 0.9,
          scale: 1.04,
          duration: 2.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="grid gap-5 lg:grid-cols-2">
      {/* BEFORE */}
      <article className="relative overflow-hidden rounded-[32px] border border-[#EF4444]/25 bg-[linear-gradient(180deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))] p-7">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#EF4444]">
          <AlertTriangle size={14} />
          {before.label}
        </div>

        <h3 className="mt-4 font-display text-[26px] font-semibold leading-tight text-white">
          Public mempool, unprotected.
        </h3>

        {/* Sandwich attack visualization */}
        <div className="relative mt-7 h-[148px] rounded-2xl border border-white/[0.06] bg-[#0B1322] p-5">
          <div className="flex items-center gap-3">
            <div data-mev-front className="rounded-full border border-[#EF4444]/40 bg-[#EF4444]/[0.14] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FCA5A5]">
              MEV bot · buy
            </div>
          </div>
          <div className="my-3 flex items-center gap-3">
            <div className="flex-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-white">
              Your swap · 1,000 USDC
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div data-mev-back className="rounded-full border border-[#EF4444]/40 bg-[#EF4444]/[0.14] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FCA5A5]">
              MEV bot · sell
            </div>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {before.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[13px] leading-[1.65] text-white/70">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EF4444]" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/[0.06] pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">{before.lossLabel}</p>
          <p className="mt-1 font-display text-[28px] font-semibold text-[#FCA5A5]">{before.lossValue}</p>
        </div>
      </article>

      {/* AFTER */}
      <article className="relative overflow-hidden rounded-[32px] border border-[#14F195]/25 bg-[linear-gradient(180deg,rgba(20,241,149,0.1),rgba(20,241,149,0.02))] p-7">
        <div
          data-mev-bundle-glow
          className="pointer-events-none absolute -top-20 right-[-10%] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(20,241,149,0.35),transparent_70%)] blur-3xl"
        />

        <div className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#14F195]">
          <ShieldCheck size={14} />
          {after.label}
        </div>

        <h3 className="relative mt-4 font-display text-[26px] font-semibold leading-tight text-white">
          Jito bundle. Atomic. Private.
        </h3>

        {/* Bundle visualization */}
        <div className="relative mt-7 h-[148px] rounded-2xl border border-[#14F195]/20 bg-[#0B1322] p-5">
          <div className="absolute inset-3 rounded-xl border border-dashed border-[#14F195]/40" />
          <div className="relative flex h-full flex-col justify-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-white">
              <CheckCircle2 size={12} className="text-[#14F195]" />
              Swap · DFlow
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-white">
              <CheckCircle2 size={12} className="text-[#14F195]" />
              Deposit · Kamino vault
            </div>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#14F195]">
              Single slot · all-or-nothing
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {after.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[13px] leading-[1.65] text-white/80">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#14F195]" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-[#14F195]/10 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">{after.lossLabel}</p>
          <p className="mt-1 font-display text-[28px] font-semibold text-[#14F195]">{after.lossValue}</p>
        </div>
      </article>

      {footnote ? (
        <p className="lg:col-span-2 text-[11px] uppercase tracking-[0.18em] text-white/40">{footnote}</p>
      ) : null}
    </div>
  );
};
