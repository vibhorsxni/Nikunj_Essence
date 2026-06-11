/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A1C12',
          green: '#123524',
          greenMid: '#1a4a32',
          light: '#F8F5E9',
          cream: '#FDF8EC',
          gold: '#E05D26',       // Vibrant Burnt Orange (replacing gold)
          goldLight: '#FF8A50',  // Light Orange Accent
          goldDark: '#B03A08',   // Deep Terracotta/Orange
          rose: '#d63447',
          oud: '#5c3a21',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-gold': 'pulse 3s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #E05D26, #FF8A50, #E05D26)',
      },
    },
  },
  plugins: [],
}
