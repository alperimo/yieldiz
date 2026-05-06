import React from 'react';
import { Outlet } from 'react-router-dom';
import { WalletProvider } from '../../context/WalletContext';
import { AuthProvider } from '../../lib/auth-context';

// App-only providers stay behind the /app route boundary so the marketing page
// does not download wallet/auth SDKs on first paint.
export default function AppShell() {
  return (
    <WalletProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </WalletProvider>
  );
}
