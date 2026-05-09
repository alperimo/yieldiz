/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'sg-bg': 'var(--color-bg-primary)',
        'sg-bg-secondary': 'var(--color-bg-secondary)',
        'sg-bg-elevated': 'var(--color-bg-elevated)',
        'sg-border': 'var(--color-border)',
        'sg-accent-green': 'var(--color-accent-green)',
        'sg-accent-purple': 'var(--color-accent-purple)',
        'sg-accent-blue': 'var(--color-accent-blue)',
        'sg-brand-aurum': 'var(--color-brand-aurum)',
        'sg-brand-aurum-light': 'var(--color-brand-aurum-light)',
        'sg-brand-aurum-deep': 'var(--color-brand-aurum-deep)',
        'sg-brand-copper': 'var(--color-brand-copper)',
        'sg-brand-champagne': 'var(--color-brand-champagne)',
        'sg-text': 'var(--color-text-primary)',
        'sg-text-secondary': 'var(--color-text-secondary)',
        'sg-text-tertiary': 'var(--color-text-tertiary)',
        'sg-success': 'var(--color-success)',
        'sg-warning': 'var(--color-warning)',
        'sg-error': 'var(--color-error)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        button: 'var(--radius-button)',
        input: 'var(--radius-input)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['48px', { lineHeight: '0.98', fontWeight: '600', letterSpacing: '-0.04em' }],
        h1: ['34px', { lineHeight: '1.08', fontWeight: '600', letterSpacing: '-0.03em' }],
        h2: ['26px', { lineHeight: '1.14', fontWeight: '600', letterSpacing: '-0.02em' }],
        h3: ['19px', { lineHeight: '1.35', fontWeight: '600' }],
        body: ['15px', { lineHeight: '1.7', fontWeight: '500' }],
        caption: ['12px', { lineHeight: '1.55', fontWeight: '500', letterSpacing: '0.01em' }],
        money: ['34px', { lineHeight: '1.05', fontWeight: '600', letterSpacing: '-0.03em' }],
        'money-sm': ['22px', { lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.02em' }],
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: '0', transform: 'translate3d(-18%, -10%, 0) scale(0.82)' },
          '35%': { opacity: '0.64' },
          '100%': { opacity: '0.34', transform: 'translate3d(5%, 1%, 0) scale(1.05)' },
        },
      },
      animation: {
        spotlight: 'spotlight 7s ease-out 0.25s forwards',
      },
    },
  },
  plugins: [],
};
