/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#FFFFFF',
          50:  '#F8F8F8',
          100: '#F2F2F2',
          200: '#E8E8E8',
        },
        silver: {
          DEFAULT: '#C0C0C0',
          light:  '#E8E8E8',
          dark:   '#9A9A9A',
          deep:   '#5A5A5A',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light:  '#E2C46E',
          dark:   '#9E7A28',
        },
        parchment: {
          DEFAULT: '#1A1A1A',
          muted: '#4A4A4A',
          dim:   '#7A7A7A',
        },
        dark: '#1A1A1A',
        journal: {
          red:    '#C0392B',
          green:  '#27AE60',
          blue:   '#2980B9',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E\")",
        'gold-shimmer': 'linear-gradient(135deg, #E2C46E 0%, #C9A84C 50%, #9E7A28 100%)',
        'silver-shimmer': 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 50%, #9A9A9A 100%)',
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease forwards',
        'slide-up':     'slideUp 0.5s ease forwards',
        'shimmer':      'shimmer 2s infinite',
        'pulse-gold':   'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseGold: { '0%,100%': { filter: 'drop-shadow(0 0 4px rgba(201,168,76,0.4))' }, '50%': { filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.8))' } },
      },
      boxShadow: {
        'gold-sm': '0 2px 8px rgba(201,168,76,0.18)',
        'gold-md': '0 4px 20px rgba(201,168,76,0.25)',
        'gold-lg': '0 8px 40px rgba(201,168,76,0.3)',
        'silver-sm': '0 2px 8px rgba(192,192,192,0.25)',
        'silver-md': '0 4px 20px rgba(192,192,192,0.3)',
        'card':    '0 2px 20px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
