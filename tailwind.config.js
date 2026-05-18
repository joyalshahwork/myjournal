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
          DEFAULT: '#0F0E0D',
          50:  '#2A2825',
          100: '#1E1C1A',
          200: '#161412',
        },
        parchment: {
          DEFAULT: '#F5F0E8',
          muted: '#C9C2B4',
          dim:   '#8A8278',
        },
        gold: {
          DEFAULT: '#D4A853',
          light:  '#E8C87A',
          dark:   '#A87D30',
        },
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
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
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
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(212,168,83,0)' }, '50%': { boxShadow: '0 0 0 8px rgba(212,168,83,0.15)' } },
      },
      boxShadow: {
        'gold-sm': '0 2px 8px rgba(212,168,83,0.15)',
        'gold-md': '0 4px 20px rgba(212,168,83,0.2)',
        'gold-lg': '0 8px 40px rgba(212,168,83,0.25)',
        'ink':     '0 4px 24px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
