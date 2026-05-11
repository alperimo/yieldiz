import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { MARKETING_CONTENT } from '../../content/marketing';
import { YieldizLogo } from '../brand/YieldizLogo';

const LinkList = ({ title, items }) => {
  const location = useLocation();

  const resolveHref = (href) => {
    if (href.startsWith('#') && location.pathname !== '/') return `/${href}`;
    return href;
  };

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F8E6B6]/78">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => {
          const href = resolveHref(item.href);
          const isExternal = href.startsWith('http') || href.startsWith('mailto:');
          const isRoute = href.startsWith('/') && !href.startsWith('//');

          return (
            <li key={item.label}>
              {isRoute ? (
                <Link
                  to={href}
                  className="group inline-flex items-center gap-1 text-[15px] font-medium text-[#F8E6B6]/82 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={href}
                  className="group inline-flex items-center gap-1 text-[15px] font-medium text-[#F8E6B6]/82 transition-colors hover:text-white"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                  {href.startsWith('http') ? (
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-60" />
                  ) : null}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const MarketingFooter = () => (
  <footer className="relative overflow-hidden border-t border-[#F8E6B6]/10 bg-[#5C3418] text-[#F8E6B6]">
    <div className="relative mx-auto max-w-[1360px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-[#F8E6B6]">
            <YieldizLogo size={42} monochrome className="shrink-0" />
            <div>
              <p className="font-display text-[18px] font-semibold leading-none">Yieldiz</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.26em] text-[#F8E6B6]/76">
                Stablecoin yield on Solana
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-[44ch] text-[15px] font-medium leading-[1.75] text-[#F8E6B6]/78">
            Yieldiz routes stablecoin capital from Ethereum, Arbitrum, Base, Polygon and Optimism
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
        <p>© {new Date().getFullYear()} Yieldiz. Stablecoin yield routing with self-custody.</p>
        <p>Transparent fees. Audited vaults. Self-custodial routing.</p>
      </div>
    </div>
  </footer>
);
