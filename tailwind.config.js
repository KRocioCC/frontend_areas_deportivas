/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  safelist: [
    'max-w-lg',
    'max-w-2xl',
    'max-w-4xl',
    'max-w-6xl',
    'max-w-[95vw]'
  ],
  theme: {
    extend: {
      animation: {
        'path-draw': 'draw 2s ease-out forwards',
      },
      fontFamily: {
        oswald: ['var(--font-Oswald)'],
        alumni: ['var(--font-Alumni)'],
        baloo: ['var(--font-Balo)'],
        josefin: ['var(--font-Josefin)'],
      },
      colors: {
        'p-1': 'var(--color-p-1)',
        'p-2': 'var(--color-p-2)',
        'p-3': 'var(--color-p-3)',
        'p-4': 'var(--color-p-4)',
        'p-5': 'var(--color-p-5)',
        'p-6': 'var(--color-p-6)',
        'p-7': 'var(--color-p-7)',
        'pb-1': 'var(--color-pb-1)',
        'pb-2': 'var(--color-pb-2)',
        'pb-3': 'var(--color-pb-3)',
        'pb-4': 'var(--color-pb-4)',
        'pb-5': 'var(--color-pb-5)',
        'pb-6': 'var(--color-pb-6)',
        'pb-7': 'var(--color-pb-7)',
        'pb-8': 'var(--color-pb-8)',
        'pb-10': 'var(--color-pb-10)',
        'b-1': 'var(--color-b-1)',
        'b-2': 'var(--color-b-2)',
        'b-3': 'var(--color-b-3)',
        'b-4': 'var(--color-b-4)',
        'b-5': 'var(--color-b-5)',
        'b-6': 'var(--color-b-6)',
        't-1': 'var(--color-t-1)',
        't-2': 'var(--color-t-2)',
        't-3': 'var(--color-t-3)',
        't-4': 'var(--color-t-4)',
      },
    },
  },
  plugins: [],
}
