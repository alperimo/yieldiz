import React from 'react';
import { Quote } from 'lucide-react';

// Tasteful quote cards. Avatar slot uses initials on a soft gradient tile —
// swap to real portraits via the ASSET_PROMPTS spec.

const gradientFor = (i) =>
  [
    'linear-gradient(135deg,#9945FF 0%,#14F195 100%)',
    'linear-gradient(135deg,#00C2FF 0%,#9945FF 100%)',
    'linear-gradient(135deg,#14F195 0%,#00C2FF 100%)',
  ][i % 3];

export const Testimonials = ({ quotes }) => (
  <div className="grid gap-5 lg:grid-cols-3">
    {quotes.map((t, i) => {
      const initials = t.author
        .split(' ')
        .map((w) => w.charAt(0))
        .slice(0, 2)
        .join('');
      return (
        <article
          key={t.author}
          className="relative flex h-full flex-col gap-6 rounded-[32px] border border-black/[0.08] bg-white/90 p-7 shadow-[0_24px_60px_rgba(8,17,31,0.08)] backdrop-blur"
        >
          <Quote size={22} className="text-[#9945FF]/60" />
          <p className="font-display text-[20px] leading-[1.4] text-[#08111F]">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="mt-auto flex items-center gap-4 border-t border-black/[0.06] pt-5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-[15px] font-bold text-white"
              style={{ backgroundImage: gradientFor(i), boxShadow: '0 14px 30px rgba(8,17,31,0.14)' }}
              data-asset-slot={t.avatarSlot}
              aria-label={`Portrait of ${t.author}`}
            >
              {initials}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#08111F]">{t.author}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7C8898]">{t.role}</p>
            </div>
          </div>
        </article>
      );
    })}
  </div>
);
