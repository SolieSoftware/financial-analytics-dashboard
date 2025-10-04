import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#1a1a1a',
          secondary: '#242424',
          tertiary: '#2a2a2a',
        },
        bullish: {
          DEFAULT: '#00ff88',
          muted: '#00cc6a',
          bg: 'rgba(0, 255, 136, 0.1)',
        },
        bearish: {
          DEFAULT: '#ff4444',
          muted: '#cc3333',
          bg: 'rgba(255, 68, 68, 0.1)',
        },
        accent: {
          blue: '#4a9eff',
          purple: '#9d4eff',
          yellow: '#ffd700',
          cyan: '#00e5ff',
        },
        text: {
          primary: '#e8e8e8',
          secondary: '#a8a8a8',
          muted: '#6a6a6a',
        },
        border: {
          DEFAULT: '#3a3a3a',
          light: '#4a4a4a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
