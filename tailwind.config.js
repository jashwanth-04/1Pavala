/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'base-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      colors: {
        // Dark mode background palette strictly from B4
        surface: {
          dark: '#000000',
          darkCard: '#181818',
          darkElevated: '#1F1F1F',
          darkBorder: '#272727',
          darkHover: '#313131',
          darkDeep: '#131209',
        },
        // 1Pavala Sovereign Forest Green (#214B30)
        brand: {
          50: '#F2F7F4',
          100: '#E1EEE6',
          200: '#C3DCCE',
          300: '#9AC3AC',
          400: '#6CA386',
          500: '#3D7D5E',
          600: '#2B6244',
          700: '#214B30', // Official 1Pavala sovereign green
          800: '#1A3B26',
          900: '#132B1C',
          950: '#0A170F',
        },
        // Silver Relief Accents
        silver: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      }
    },
  },
  plugins: [],
}
