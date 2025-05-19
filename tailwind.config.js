/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pokemon: ['"Luckiest Guy"', 'cursive'],
        'press-start': ["'Press Start 2P'", 'cursive'],
        vt323: ["'VT323'", 'monospace'],
      },
      colors: {
        'bg-default':   '#1E1E1E',
        'bg-secondary': '#2A2A2A',
        'accent-yellow':'#FBBF24',
        'accent-orange':'#FB923C',
        'text-default': '#E5E7EB',
      },
      boxShadow: {
        'button-blue': '0 0 6px 2px rgb(0 128 255 / 0.8)',
        'button-red': '0 0 6px 2px rgb(255 0 0 / 0.8)',
        'button-yellow': '0 0 6px 2px rgb(255 255 0 / 0.8)',
        'button-yellow-hover': '0 0 6px 2px rgb(255 255 0 / 0.4)',
        'button-green': '0 0 6px 2px rgb(0 255 0 / 0.8)',
        'button-green-hover': '0 0 4px 1px rgb(0 255 0 / 0.4)',
      },
    },
  },
  plugins: [],
};
