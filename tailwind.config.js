/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 1Pavala Sovereign Forest Green (matched to official #214B30 logo)
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
        // 1Pavala Coin Silver & Metallic Accents (matched to official logo silver relief #A69F96 / #9B938A)
        silver: {
          50: '#F8FAFC',  // Platinum sheen
          100: '#F1F5F9', // Frosted silver
          200: '#E2E8F0', // Soft coin rim
          300: '#CBD5E1', // Brushed silver
          400: '#94A3B8', // Slate metallic
          500: '#64748B', // Steel silver
          600: '#475569', // Dark coin shadow
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      }
    },
  },
  plugins: [],
}
