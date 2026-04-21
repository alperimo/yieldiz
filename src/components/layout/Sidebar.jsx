import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowDownToLine, LayoutDashboard, Vault } from 'lucide-react';
import { STRINGS, NAV_ITEMS, APP_VERSION } from '../../lib/constants';

const ICON_MAP = { ArrowDownToLine, LayoutDashboard, Vault };

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-sg-bg-secondary border-r border-sg-border fixed left-0 top-0">
      <div className="p-6 pb-8">
        <NavLink to="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[image:var(--gradient-cta)] flex items-center justify-center text-[#163300] font-bold text-sm">
            {STRINGS.APP_LOGO_ABBR}
          </div>
          <span className="text-h3 text-sg-text">{STRINGS.APP_NAME}</span>
        </NavLink>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, iconName }) => {
          const Icon = ICON_MAP[iconName];
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-body
                transition-colors duration-150
                ${isActive
                  ? 'bg-sg-accent-purple/10 text-sg-accent-purple'
                  : 'text-sg-text-secondary hover:text-sg-text hover:bg-sg-bg-elevated'}
              `}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span>{STRINGS[label]}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sg-border">
        <p className="text-caption text-sg-text-tertiary text-center">
          {STRINGS.APP_NAME} v{APP_VERSION}
        </p>
      </div>
    </aside>
  );
};
