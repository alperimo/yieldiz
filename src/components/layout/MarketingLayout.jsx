import React from 'react';
import { Outlet } from 'react-router-dom';
import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';

export const MarketingLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F2] text-[#08111F]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(214,168,79,0.12),transparent_38%),radial-gradient(circle_at_top_right,rgba(126,77,34,0.08),transparent_36%),linear-gradient(180deg,#F7F8F2_0%,#EFF2EC_100%)]" />
      <MarketingHeader />
      <main>
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
};
