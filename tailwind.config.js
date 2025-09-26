/** @type {import('tailwindcss').Config} */
import { heroui } from '@heroui/react';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f8',
          100: '#b3e8eb',
          200: '#80d9de',
          300: '#4dcad1',
          400: '#1abbc4',
          500: '#007C88',
          600: '#006670',
          700: '#005058',
          800: '#003a40',
          900: '#002428',
        }
      }
    },
  },
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: '#e6f7f8',
            100: '#b3e8eb',
            200: '#80d9de',
            300: '#4dcad1',
            400: '#1abbc4',
            500: '#007C88',
            600: '#006670',
            700: '#005058',
            800: '#003a40',
            900: '#002428',
            DEFAULT: '#007C88',
            foreground: '#ffffff',
          },
        },
      },
    },
  })],
};