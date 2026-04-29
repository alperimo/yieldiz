import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { MARKETING_CONTENT } from '../../content/marketing';
import { SolGateLogo } from '../brand/SolGateLogo';

const LinkList = ({ title, items }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B6A3A]">{title}</p>
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="group inline-flex items-center gap-1 text-[14px] text-[#654B2B] transition-colors hover:text-[#2A1A0B]"
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
  <footer className="relative overflow-hidden border-t border-black/[0.06] bg-[#F5F7F2] text-[#2A1A0B]">
    <div className="relative mx-auto max-w-[1360px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-[#2A1A0B]">
            <SolGateLogo size={44} className="rounded-2xl bg-[#7E4D22] p-2 shadow-[0_18px_40px_rgba(126,77,34,0.16)]" />
            <div>
              <p className="font-display text-[18px] font-semibold leading-none">SolGate</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8B6A3A]">
                Stablecoin yield on Solana
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-[44ch] text-[14px] leading-[1.7] text-[#654B2B]">
            SolGate routes stablecoin capital from Ethereum, Arbitrum, Base, Polygon and Optimism
            into audited Solana yield vaults — with route clarity, MEV protection and self-custodial
            control at every step.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          <LinkList title="Product" items={MARKETING_CONTENT.footer.product} />
          <LinkList title="Infrastructure" items={MARKETING_CONTENT.footer.infrastructure} />
          <LinkList title="Company" items={MARKETING_CONTENT.footer.company} />
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-black/[0.06] pt-8 text-[12px] text-[#8B6A3A] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} SolGate. Stablecoin yield routing with self-custody.</p>
        <p>Transparent fees. Audited vaults. Self-custodial routing.</p>
      </div>
    </div>
  </footer>
);
