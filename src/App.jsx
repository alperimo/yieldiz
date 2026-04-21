import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/Layout';
import { MarketingLayout } from './components/layout/MarketingLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Spinner } from './components/ui/Spinner';
import { ScrollToTop } from './components/layout/ScrollToTop';

const Marketing = lazy(() => import('./pages/Marketing'));
const Deposit = lazy(() => import('./pages/Deposit'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Vaults = lazy(() => import('./pages/Vaults'));

const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <Spinner size={32} />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Marketing /></Suspense>} />
        </Route>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Suspense fallback={<PageLoader />}><Deposit /></Suspense>} />
          <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="vaults" element={<Suspense fallback={<PageLoader />}><Vaults /></Suspense>} />
        </Route>
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/vaults" element={<Navigate to="/app/vaults" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
