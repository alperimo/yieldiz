import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useHideOnScroll } from '../../hooks/useHideOnScroll';

const MARKETING_LINKS = [
  { href: '#product-story', label: 'Why SolGate' },
  { href: '#operating-model', label: 'How it works' },
  { href: '#execution-stack', label: 'Infrastructure' },
  { href: '#security-layer', label: 'Security' },
];

export const MarketingHeader = () => {
  const { hidden, scrolled } = useHideOnScroll();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ease-out ${
        hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
      } ${
        scrolled
          ? 'border-black/[0.06] bg-[rgba(245,247,242,0.92)] backdrop-blur-xl shadow-[0_8px_30px_rgba(8,17,31,0.06)]'
          : 'border-transparent bg-[rgba(245,247,242,0.6)] backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-4 px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-[#08111F]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08111F] text-[12px] font-black tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(8,17,31,0.18)]">
            SG
          </div>
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
              className="rounded-full px-4 py-2 text-sm font-medium text-sg-text-secondary transition-colors hover:text-[#08111F]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/app"
            className="hidden items-center gap-2 rounded-full bg-[#08111F] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(8,17,31,0.18)] transition-transform hover:-translate-y-0.5 lg:inline-flex"
          >
            Start earning
            <ArrowUpRight size={15} />
          </NavLink>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white/70 text-[#08111F] shadow-[0_8px_20px_rgba(8,17,31,0.06)] lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-black/[0.06] bg-white/95 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1">
            {MARKETING_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-[#08111F] transition-colors hover:bg-sg-bg"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <NavLink
              to="/app"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#08111F] px-4 py-3 text-sm font-semibold text-white"
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
