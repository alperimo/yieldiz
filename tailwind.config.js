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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        h1: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h2: ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        money: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'money-sm': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
