import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useHideOnScroll } from '../../hooks/useHideOnScroll';
import { SolGateLogo } from '../brand/SolGateLogo';

const MARKETING_LINKS = [
  { href: '#product-story', label: 'Why SolGate' },
  { href: '#operating-model', label: 'How it works' },
  { href: '#execution-stack', label: 'Infrastructure' },
  { href: '#security-layer', label: 'Security' },
];

export const MarketingHeader = () => {
  const { scrolled } = useHideOnScroll();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 translate-y-0 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        scrolled
          ? 'border-black/[0.06] bg-[rgba(245,247,242,0.92)] backdrop-blur-xl shadow-[0_8px_30px_rgba(126,77,34,0.06)]'
          : 'border-transparent bg-[rgba(245,247,242,0.6)] backdrop-blur-md'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 text-[#2A1A0B]">
          <SolGateLogo size={36} className="rounded-xl bg-[#7E4D22] p-1.5 shadow-[0_14px_30px_rgba(126,77,34,0.18)]" />
          <div>
            <p className="font-display text-[17px] font-semibold leading-none">SolGate</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-sg-text-secondary">
              Stablecoin yield on Solana
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {MARKETING_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-sg-text-secondary transition-colors hover:text-[#2A1A0B]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/app"
            className="hidden items-center gap-2 rounded-full bg-[#7E4D22] px-5 py-2.5 text-sm font-semibold text-[#F8E6B6] shadow-[0_14px_30px_rgba(126,77,34,0.18)] transition-transform hover:-translate-y-0.5 lg:inline-flex"
          >
            Start earning
            <ArrowUpRight size={15} />
          </NavLink>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white/70 text-[#2A1A0B] shadow-[0_8px_20px_rgba(126,77,34,0.06)] lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-black/[0.06] bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8 lg:hidden">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-1">
            {MARKETING_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-[#2A1A0B] transition-colors hover:bg-sg-bg"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <NavLink
              to="/app"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7E4D22] px-4 py-3 text-sm font-semibold text-[#F8E6B6]"
              onClick={() => setMobileOpen(false)}
            >
              Start earning
              <ArrowUpRight size={16} />
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
};
