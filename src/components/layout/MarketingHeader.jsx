import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const MARKETING_LINKS = [
  { href: '#product-story', label: 'Story' },
  { href: '#operating-model', label: 'How it works' },
  { href: '#execution-stack', label: 'Execution stack' },
  { href: '#security-layer', label: 'Security' },
];

export const MarketingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto max-w-[1380px] rounded-[28px] border px-4 py-3 transition-all duration-300 sm:px-6 ${
          isScrolled
            ? 'border-white/40 bg-[rgba(245,247,242,0.88)] shadow-[0_24px_90px_rgba(8,17,31,0.12)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-[#08111F]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08111F] text-sm font-black tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(8,17,31,0.18)]">
              SG
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-none">SolGate</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sg-text-secondary">
                Solana Yield Routing
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {MARKETING_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-sg-text-secondary transition-colors hover:bg-white/60 hover:text-[#08111F]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#live-preview"
              className="text-sm font-medium text-sg-text-secondary transition-colors hover:text-[#08111F]"
            >
              Live preview
            </a>
            <NavLink
              to="/app"
              className="inline-flex items-center gap-2 rounded-full bg-[#08111F] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(8,17,31,0.18)] transition-transform hover:-translate-y-0.5"
            >
              Open App
              <ArrowUpRight size={16} />
            </NavLink>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/70 text-[#08111F] shadow-[0_12px_30px_rgba(8,17,31,0.08)] lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="mt-4 rounded-[24px] border border-white/50 bg-white/90 p-4 shadow-[0_24px_50px_rgba(8,17,31,0.1)] lg:hidden">
            <div className="flex flex-col gap-2">
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
                Open App
                <ArrowUpRight size={16} />
              </NavLink>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};
