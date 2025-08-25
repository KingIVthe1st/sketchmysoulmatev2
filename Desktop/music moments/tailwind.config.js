/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',    // iPhone SE and smaller phones
      'sm': '640px',    // Small tablets and larger phones
      'md': '768px',    // Tablets
      'lg': '1024px',   // Small laptops
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Large desktops
    },
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'screen-ios': '-webkit-fill-available',
      },
      animation: {
        'shimmer': 'shimmer 3s infinite',
        'float-up': 'float-up 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)', opacity: '0' },
        },
        'float-up': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-10px) translateX(5px)' },
          '66%': { transform: 'translateY(-5px) translateX(-3px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        wave: {
          '0%': { borderRadius: '50% 60% / 50% 70%', transform: 'rotate(0deg)' },
          '25%': { borderRadius: '60% 50% / 70% 50%', transform: 'rotate(90deg)' },
          '50%': { borderRadius: '50% 60% / 50% 70%', transform: 'rotate(180deg)' },
          '75%': { borderRadius: '60% 50% / 70% 50%', transform: 'rotate(270deg)' },
          '100%': { borderRadius: '50% 60% / 50% 70%', transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}