import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-solana': ['@solana/kit', '@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui', '@solana/wallet-adapter-wallets'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-lifi': ['@lifi/sdk'],
          'vendor-ui': ['lucide-react'],
        },
      },
    },
  },
});
