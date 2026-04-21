import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { MARKETING_CONTENT } from '../../content/marketing';

const LinkList = ({ title, items }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">{title}</p>
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="group inline-flex items-center gap-1 text-[14px] text-white/80 transition-colors hover:text-white"
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {item.label}
            {item.href.startsWith('http') ? (
              <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-60" />
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const MarketingFooter = () => (
  <footer className="relative overflow-hidden bg-[#08111F] text-white">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(153,69,255,0.18),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(20,241,149,0.12),transparent_38%)]" />
    <div className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#9945FF_0%,#14F195_100%)] text-[12px] font-black tracking-[0.18em] text-[#08111F] shadow-[0_18px_40px_rgba(153,69,255,0.4)]">
              SG
            </div>
            <div>
              <p className="font-display text-[18px] font-semibold leading-none">SolGate</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/50">
                Stablecoin yield on Solana
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-[44ch] text-[14px] leading-[1.7] text-white/60">
            SolGate routes stablecoin capital from Ethereum, Arbitrum, Base, Polygon and Optimism
            into audited Solana yield vaults — with route clarity, MEV protection and self-custodial
            control at every step.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Self-custodial
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
              MiCA-aware
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Audited routes
            </span>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          <LinkList title="Product" items={MARKETING_CONTENT.footer.product} />
          <LinkList title="Infrastructure" items={MARKETING_CONTENT.footer.infrastructure} />
          <LinkList title="Company" items={MARKETING_CONTENT.footer.company} />
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-8 text-[12px] text-white/50 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} SolGate. Built for the Solana Frontier Hackathon.</p>
        <p className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#14F195] shadow-[0_0_10px_#14F195]" />
          Solana mainnet · Agave 2.x · Firedancer ready
        </p>
      </div>
    </div>
  </footer>
);
