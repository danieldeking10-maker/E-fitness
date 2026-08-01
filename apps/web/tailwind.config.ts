import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#1A1D24',
        neon: '#C0FF00',
        glass: 'rgba(26, 29, 36, 0.6)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        zinc: {
          950: '#09090B',
        }
      },
      fontFamily: {
        heading: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '40px',
      },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(192, 255, 0, 0.4)',
        'glass-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.7', transform: 'scale(1.05)' },
        },
      },
    }
  },
  plugins: []
};

export default config;
