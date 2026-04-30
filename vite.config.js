import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': '/src',
      assert: 'assert/',
      buffer: 'buffer/',
      crypto: fileURLToPath(new URL('./src/polyfills/nodeCrypto.js', import.meta.url)),
      process: 'process/browser.js',
      util: 'util/',
    },
  },
  optimizeDeps: {
    include: ['assert', 'buffer', 'process', 'util'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@umbra-privacy') || id.includes('@cloak.dev') || id.includes('circomlibjs') || id.includes('ffjavascript')) return 'vendor-privacy';
          if (id.includes('@lifi') || id.includes('viem') || id.includes('@ethersproject') || id.includes('@bigmi')) return 'vendor-lifi';
          if (id.includes('@solana')) return 'vendor-solana';
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('@tanstack')) return 'vendor-query';
          if (id.includes('gsap')) return 'vendor-gsap';
          if (id.includes('lucide-react')) return 'vendor-ui';
          if (id.includes('react')) return 'vendor-react';
          return undefined;
        },
      },
    },
  },
});
