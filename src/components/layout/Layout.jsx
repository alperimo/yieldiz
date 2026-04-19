import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../ui/Toast';

export const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sg-bg">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <MobileNav />
      <ToastContainer />
    </div>
  );
};
