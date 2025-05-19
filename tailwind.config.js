/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pokemon: ['"Luckiest Guy"', 'cursive'],
        'press-start': ["'Press Start 2P'", 'cursive'],
        vt323: ["'VT323'", 'monospace'],
      },
      colors: {
        'bg-primary': '#1E1E1E',
        'bg-secondary': '#2A2A2A',
        'text-default': '#E5E7EB',
        'accent-yellow': '#FBBF24',
        'accent-orange': '#FB923C',
      },
      boxShadow: {
        'button-blue': '0 0 6px 2px rgb(0 128 255 / 0.8)',
        'button-red': '0 0 6px 2px rgb(255 0 0 / 0.8)',
        'button-yellow': '0 0 6px 2px rgb(255 255 0 / 0.8)',
        'button-yellow-hover': '0 0 6px 2px rgb(255 255 0 / 0.4)',
        'button-green': '0 0 6px 2px rgb(0 255 0 / 0.8)',
        'button-green-hover': '0 0 4px 1px rgb(0 255 0 / 0.4)',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      },
      animation: {
        'breathing': 'breathing 1s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
