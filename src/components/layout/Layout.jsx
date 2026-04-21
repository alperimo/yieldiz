import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../ui/Toast';

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell min-h-screen bg-sg-bg text-sg-text">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <main className="flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>
      <MobileNav />
      <ToastContainer />
    </div>
  );
};
