import React from 'react';
import { BrandMark } from './BrandMark';

export const PartnerSpotlight = ({ partners }) => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {partners.map((p) => (
      <article
        key={p.partner}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-7 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.14]"
      >
        <div
          className="pointer-events-none absolute -top-16 right-[-10%] h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: p.accent }}
        />

        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center text-white/85">
            <BrandMark name={p.partner} size={36} />
          </div>

          <div className="mt-6">
            <h3 className="font-display text-[24px] font-semibold tracking-[-0.01em] text-white">{p.partner}</h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
              {p.role}
            </p>
          </div>

          <p className="mt-5 text-[14px] leading-[1.7] text-white/[0.72]">{p.description}</p>
        </div>

        <div className="relative mt-7 flex items-end justify-between border-t border-white/[0.06] pt-5">
          <div>
            <p className="font-display text-[22px] font-semibold tracking-[-0.01em] text-white">{p.metric.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{p.metric.label}</p>
          </div>
        </div>
      </article>
    ))}
  </div>
);

