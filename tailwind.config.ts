import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      },
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e1ecff',
          200: '#c1d7ff',
          300: '#95b9ff',
          400: '#6696ff',
          500: '#436fff',
          600: '#2f52db',
          700: '#2540ab',
          800: '#1f3588',
          900: '#1d2f6f',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;