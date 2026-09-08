/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'Georgia', 'serif'],
        sans: ['"Times New Roman"', 'Times', 'Georgia', 'serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      colors: {
        lavender: {
          50: '#f8f6fc',
          100: '#f1edf8',
          200: '#e3daf0',
          300: '#cebee4',
          400: '#b29ad3',
          500: '#9475c0',
          600: '#7958a9',
          700: '#63448f',
          800: '#4d3470',
          900: '#382553',
          950: '#231536',
        },
        brand: {
          bg: '#f8f6fc',
          sidebar: '#ffffff',
          card: '#ffffff',
          border: '#e3daf0',
          text: '#231536',
          muted: '#695a7e',
          accent: '#7958a9',
          accentHover: '#63448f',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(77, 52, 112, 0.04), 0 1px 2px 0 rgba(77, 52, 112, 0.02)',
        'card': '0 4px 10px -1px rgba(77, 52, 112, 0.06), 0 2px 4px -1px rgba(77, 52, 112, 0.03)',
        'elevated': '0 12px 28px -5px rgba(77, 52, 112, 0.1), 0 8px 12px -6px rgba(77, 52, 112, 0.05)',
      },
    },
  },
  plugins: [],
}
