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
    },
  },
  plugins: [],
};
