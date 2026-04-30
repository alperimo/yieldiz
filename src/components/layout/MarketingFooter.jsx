import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { MARKETING_CONTENT } from '../../content/marketing';
import { SolGateLogo } from '../brand/SolGateLogo';

const LinkList = ({ title, items }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F8E6B6]/78">{title}</p>
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="group inline-flex items-center gap-1 text-[15px] font-medium text-[#F8E6B6]/82 transition-colors hover:text-white"
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
  <footer className="relative overflow-hidden border-t border-[#F8E6B6]/10 bg-[#5C3418] text-[#F8E6B6]">
    <div className="relative mx-auto max-w-[1360px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-[#F8E6B6]">
            <SolGateLogo size={34} monochrome />
            <div>
              <p className="font-display text-[18px] font-semibold leading-none">SolGate</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.26em] text-[#F8E6B6]/76">
                Stablecoin yield on Solana
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-[44ch] text-[15px] font-medium leading-[1.75] text-[#F8E6B6]/78">
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

      <div className="mt-16 flex flex-col gap-4 border-t border-[#F8E6B6]/10 pt-8 text-[13px] font-medium text-[#F8E6B6]/70 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} SolGate. Stablecoin yield routing with self-custody.</p>
        <p>Transparent fees. Audited vaults. Self-custodial routing.</p>
      </div>
    </div>
  </footer>
);
