/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Anthropic-inspired color palette
        cream: {
          50: '#fdfcfa',
          100: '#faf8f5',
          200: '#f5f0e8',
          300: '#ede5d8',
        },
        charcoal: {
          400: '#6b6b6b',
          500: '#4a4a4a',
          600: '#3d3d3d',
          700: '#1f1f1f',
          800: '#141414',
          900: '#0a0a0a',
        },
        terracotta: {
          400: '#e8917a',
          500: '#d97757',
          600: '#c46a4d',
          700: '#a8573d',
        },
        sage: {
          100: '#f0f4f1',
          200: '#d1ddd5',
          300: '#a8c4b0',
        },
        sand: {
          100: '#f7f5f2',
          200: '#e8e4df',
          300: '#d4cfc7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};