import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../ui/Toast';

export const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sg-bg">
      <Sidebar />
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 px-4 lg:px-8 py-6 pb-20 lg:pb-6 max-w-[1200px] w-full mx-auto page-enter">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <ToastContainer />
    </div>
  );
};
