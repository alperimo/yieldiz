import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const PartnerSpotlight = ({ partners }) => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {partners.map((p) => (
      <article
        key={p.partner}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.18]"
      >
        {/* Accent glow on hover */}
        <div
          className="pointer-events-none absolute -top-16 right-[-10%] h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: p.accent }}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-[13px] font-black tracking-[0.14em] text-[#08111F]"
              style={{ background: p.accent, boxShadow: `0 20px 40px ${p.accent}33` }}
            >
              {p.logoMark}
            </div>
            <ArrowUpRight className="text-white/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" size={18} />
          </div>

          <div className="mt-6">
            <h3 className="font-display text-[26px] font-semibold text-white">{p.partner}</h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: p.accent }}>
              {p.role}
            </p>
          </div>

          <p className="mt-5 text-[14px] leading-[1.65] text-white/[0.78]">{p.description}</p>
        </div>

        <div className="relative mt-7 flex items-center justify-between border-t border-white/[0.08] pt-5">
          <div>
            <p className="font-display text-[22px] font-semibold text-white">{p.metric.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{p.metric.label}</p>
          </div>
          <div
            className="rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{
              background: `${p.accent}22`,
              color: p.accent,
              border: `1px solid ${p.accent}44`,
            }}
          >
            Integrated
          </div>
        </div>
      </article>
    ))}
  </div>
);
