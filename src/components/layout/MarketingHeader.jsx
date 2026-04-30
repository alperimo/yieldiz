import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useHideOnScroll } from '../../hooks/useHideOnScroll';
import { SolGateLogo } from '../brand/SolGateLogo';

const MARKETING_LINKS = [
  { href: '#product-story', label: 'Overview' },
  { href: '#operating-model', label: 'Route' },
  { href: '#execution-stack', label: 'Platform' },
  { href: '#security-layer', label: 'Security' },
];

const HEADER_THEMES = {
  light: {
    header: 'border-black/[0.025] bg-[rgba(245,247,242,0.92)] text-[#2A1A0B] backdrop-blur-2xl shadow-[0_8px_30px_rgba(126,77,34,0.045)]',
    logo: 'text-[#2A1A0B]',
    sub: 'text-[#8B6A3A]',
    nav: 'text-[#654B2B] hover:text-[#2A1A0B] hover:bg-white/55',
    menu: 'border-black/[0.08] bg-white/70 text-[#2A1A0B]',
    cta: 'bg-[#7E4D22] text-[#F8E6B6] shadow-[0_14px_30px_rgba(126,77,34,0.18)] hover:bg-[#65401F]',
    mobile: 'border-black/[0.06] bg-white/95',
    mobileLink: 'text-[#2A1A0B] hover:bg-[#F8E6B6]/45',
  },
  champagne: {
    header: 'border-[#7E4D22]/[0.04] bg-[rgba(248,230,182,0.9)] text-[#2A1A0B] backdrop-blur-2xl shadow-[0_8px_30px_rgba(126,77,34,0.04)]',
    logo: 'text-[#2A1A0B]',
    sub: 'text-[#8B6A3A]',
    nav: 'text-[#654B2B] hover:text-[#2A1A0B] hover:bg-white/35',
    menu: 'border-[#7E4D22]/10 bg-white/35 text-[#2A1A0B]',
    cta: 'bg-[#7E4D22] text-[#F8E6B6] shadow-[0_14px_30px_rgba(126,77,34,0.16)] hover:bg-[#65401F]',
    mobile: 'border-[#7E4D22]/[0.06] bg-[rgba(248,230,182,0.96)]',
    mobileLink: 'text-[#2A1A0B] hover:bg-white/35',
  },
  copper: {
    header: 'border-[#F8E6B6]/[0.08] bg-[rgba(126,77,34,0.94)] text-[#F8E6B6] backdrop-blur-2xl shadow-[0_10px_36px_rgba(42,26,11,0.14)]',
    logo: 'text-[#F8E6B6]',
    sub: 'text-[#F8E6B6]/68',
    nav: 'text-[#F8E6B6]/78 hover:text-white hover:bg-white/10',
    menu: 'border-white/15 bg-white/10 text-[#F8E6B6]',
    cta: 'bg-[#F8E6B6] text-[#7E4D22] shadow-[0_14px_30px_rgba(42,26,11,0.18)] hover:bg-white',
    mobile: 'border-[#F8E6B6]/15 bg-[rgba(126,77,34,0.96)]',
    mobileLink: 'text-[#F8E6B6] hover:bg-white/10',
  },
  gold: {
    header: 'border-[#7E4D22]/[0.07] bg-[rgba(214,168,79,0.92)] text-[#2A1A0B] backdrop-blur-2xl shadow-[0_10px_36px_rgba(126,77,34,0.08)]',
    logo: 'text-[#2A1A0B]',
    sub: 'text-[#654B2B]',
    nav: 'text-[#4A3218]/80 hover:text-[#2A1A0B] hover:bg-[#F8E6B6]/30',
    menu: 'border-[#7E4D22]/15 bg-[#F8E6B6]/35 text-[#2A1A0B]',
    cta: 'bg-[#7E4D22] text-[#F8E6B6] shadow-[0_14px_30px_rgba(126,77,34,0.18)] hover:bg-[#65401F]',
    mobile: 'border-[#7E4D22]/15 bg-[rgba(214,168,79,0.96)]',
    mobileLink: 'text-[#2A1A0B] hover:bg-[#F8E6B6]/30',
  },
};

export const MarketingHeader = () => {
  const { scrolled } = useHideOnScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const activeTheme = HEADER_THEMES[theme];

  useEffect(() => {
    let retry;
    let frame = 0;
    let sections = [];

    const setupObserver = () => {
      sections = Array.from(document.querySelectorAll('[data-header-theme]'));
      if (!sections.length) {
        retry = window.setTimeout(setupObserver, 100);
        return;
      }
      updateTheme();
    };

    const updateTheme = () => {
      const sampleY = 4;
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= sampleY && rect.bottom > sampleY;
      });
      if (current?.dataset.headerTheme) {
        setTheme((previous) => (previous === current.dataset.headerTheme ? previous : current.dataset.headerTheme));
      } else {
        setTheme('light');
      }
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateTheme();
      });
    };

    setupObserver();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', setupObserver);

    return () => {
      window.clearTimeout(retry);
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', setupObserver);
    };
  }, []);

  const handleAnchorClick = (event, href) => {
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    setMobileOpen(false);
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
    window.history.replaceState(null, '', href);
  };

  return (
    <header
      className={`sticky top-0 z-50 translate-y-0 border-b transition-shadow duration-200 ease-out ${
        scrolled ? activeTheme.header : `${activeTheme.header} shadow-none`
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-4">
        <Link to="/" className={`flex items-center gap-3 ${activeTheme.logo}`}>
          <SolGateLogo size={32} />
          <div>
            <p className="font-display text-[17px] font-semibold leading-none">SolGate</p>
            <p className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.26em] ${activeTheme.sub}`}>
              Stablecoin yield on Solana
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {MARKETING_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleAnchorClick(event, item.href)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${activeTheme.nav}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/app"
            className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 lg:inline-flex ${activeTheme.cta}`}
          >
            Start earning
            <ArrowUpRight size={15} />
          </NavLink>

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_8px_20px_rgba(126,77,34,0.06)] lg:hidden ${activeTheme.menu}`}
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      </div>

      {mobileOpen ? (
        <div className={`border-t px-4 py-4 backdrop-blur-xl transition-colors duration-300 sm:px-6 lg:px-8 lg:hidden ${activeTheme.mobile}`}>
          <div className="mx-auto flex max-w-[1360px] flex-col gap-1">
            {MARKETING_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${activeTheme.mobileLink}`}
                onClick={(event) => handleAnchorClick(event, item.href)}
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
