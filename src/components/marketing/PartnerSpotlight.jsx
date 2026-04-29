import React from 'react';
import { BrandMark } from './BrandMark';

export const PartnerSpotlight = ({ partners }) => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {partners.map((p) => (
      <article
        key={p.partner}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-[#7E4D22]/15 bg-white/55 p-7 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#7E4D22]/30"
      >
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center text-[#7E4D22]">
            <BrandMark name={p.partner} size={36} />
          </div>

          <div className="mt-6">
            <h3 className="font-display text-[24px] font-semibold tracking-[-0.01em] text-[#2A1A0B]">{p.partner}</h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7E4D22]/70">
              {p.role}
            </p>
          </div>

          <p className="mt-5 text-[14px] leading-[1.7] text-[#3B2A16]/78">{p.description}</p>
        </div>

        <div className="relative mt-7 flex items-end justify-between border-t border-[#7E4D22]/12 pt-5">
          <div>
            <p className="font-display text-[22px] font-semibold tracking-[-0.01em] text-[#2A1A0B]">{p.metric.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7E4D22]/70">{p.metric.label}</p>
          </div>
        </div>
      </article>
    ))}
  </div>
);
