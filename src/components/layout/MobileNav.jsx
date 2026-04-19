import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowDownToLine, LayoutDashboard, Vault } from 'lucide-react';
import { STRINGS, NAV_ITEMS } from '../../lib/constants';

const ICON_MAP = { ArrowDownToLine, LayoutDashboard, Vault };

export const MobileNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sg-bg-secondary border-t border-sg-border">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ to, label, iconName }) => {
          const Icon = ICON_MAP[iconName];
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[56px]
                transition-colors duration-150
                ${isActive
                  ? 'text-sg-accent-purple'
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
