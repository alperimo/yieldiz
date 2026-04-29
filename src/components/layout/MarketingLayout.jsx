import React from 'react';
import { Outlet } from 'react-router-dom';
import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';

export const MarketingLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F2] text-[#2A1A0B]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#F5F7F2]" />
      <MarketingHeader />
      <main>
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
};
