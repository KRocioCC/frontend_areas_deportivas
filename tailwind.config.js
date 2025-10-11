/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  extend: {
      fontFamily: {
        oswald: ['var(--font-Oswald)'],
        alumni: ['var(--font-Alumni)'],
        baloo: ['var(--font-Balo)'],
        josefin: ['var(--font-Josefin)'],
      },
      colors: {
        'pb-1': 'var(--color-pb-1)',
        'pb-2': 'var(--color-pb-2)',
        'pb-3': 'var(--color-pb-3)',
        'pb-4': 'var(--color-pb-4)',
        'pb-5': 'var(--color-pb-5)',
        'pb-6': 'var(--color-pb-6)',
        'pb-7': 'var(--color-pb-7)',
        'pb-8': 'var(--color-pb-8)',
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
  plugins: [],
}

