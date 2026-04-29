import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowDownToLine, LayoutDashboard, Vault } from 'lucide-react';
import { STRINGS, NAV_ITEMS } from '../../lib/constants';

const ICON_MAP = { ArrowDownToLine, LayoutDashboard, Vault };

export const MobileNav = () => {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-[24px] border border-white/50 bg-[rgba(245,247,242,0.88)] shadow-[0_24px_50px_rgba(126,77,34,0.12)] backdrop-blur lg:hidden">
      <div className="flex h-[72px] items-center justify-around px-2">
        {NAV_ITEMS.map(({ to, label, iconName }) => {
          const Icon = ICON_MAP[iconName];
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              className={({ isActive }) => `
                flex min-w-[76px] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all duration-150
                ${isActive
                  ? 'bg-[#2A1A0B] text-white shadow-[0_14px_30px_rgba(126,77,34,0.12)]'
                  : 'text-sg-text-tertiary hover:text-sg-text-secondary'}
              `}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[11px] leading-none">{STRINGS[label]}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
