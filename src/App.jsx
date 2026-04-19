import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Spinner } from './components/ui/Spinner';

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
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Deposit /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="/vaults" element={<Suspense fallback={<PageLoader />}><Vaults /></Suspense>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
