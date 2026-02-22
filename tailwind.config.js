/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Claude-inspired warm palette
        cream: {
          50: '#fdfcfa',
          100: '#faf8f5',
          200: '#f5f0e8',
          300: '#ede5d8',
          400: '#e5d9c7',
        },
        // Deep charcoal - main text
        charcoal: {
          300: '#8a8a8a',
          400: '#6b6b6b',
          500: '#4a4a4a',
          600: '#3d3d3d',
          700: '#2d2d2d',
          800: '#1f1f1f',
          900: '#141414',
        },
        // Terracotta/Copper accent - primary action
        terracotta: {
          100: '#fef2ed',
          200: '#fde4d8',
          300: '#f9c8b5',
          400: '#f2a085',
          500: '#e67e5a',
          600: '#d66842',
          700: '#b85530',
          800: '#96472b',
        },
        // Sage green - secondary accent
        sage: {
          50: '#f6f8f6',
          100: '#e8f0e9',
          200: '#d1e0d3',
          300: '#a8c4ad',
          400: '#7ba382',
          500: '#5a8261',
        },
        // Warm sand - borders, dividers
        sand: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#e8e4dd',
          300: '#d4cfc5',
          400: '#b8b0a3',
        },
      },
      fontFamily: {
        // Claude uses Inter
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'elevated': '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
