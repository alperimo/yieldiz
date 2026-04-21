import React from 'react';
import { Outlet } from 'react-router-dom';
import { MarketingHeader } from './MarketingHeader';

export const MarketingLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F2] text-[#08111F]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(20,241,149,0.14),transparent_38%),radial-gradient(circle_at_top_right,rgba(124,107,255,0.12),transparent_35%),linear-gradient(180deg,#F7F8F2_0%,#EFF2EC_100%)]" />
      <MarketingHeader />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-black/[0.08] px-4 py-10">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 text-sm text-sg-text-secondary md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-[#08111F]">SolGate</p>
            <p className="mt-2 max-w-lg leading-6">
              A premium Solana-native routing surface for moving stablecoin capital into yield with more clarity.
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="font-medium text-[#08111F]">Routes, execution, and vault visibility in one brand system.</p>
            <p>Product preview and live terminal available at `/app`.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
