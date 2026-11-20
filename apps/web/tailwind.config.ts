import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#14171D',
        neon: '#C0FF00',
        glass: 'rgba(20, 23, 29, 0.72)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        zinc: {
          950: '#09090B',
        },
      },
      fontFamily: {
        heading: ['var(--font-archivo)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        '4xl': '40px',
      },
      boxShadow: {
        'neon-glow': '0 0 24px rgba(192, 255, 0, 0.32)',
        'glass-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
