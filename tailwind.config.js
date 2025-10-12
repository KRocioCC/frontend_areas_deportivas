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
      fontFamily: {
        alumni: ['"Alumni Sans"', 'sans-serif'],
        baloo: ['"Baloo Tamma 2"', 'sans-serif'],
        josefin: ['"Josefin Slab"', 'serif'],
        oswald: ['"Oswald"', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        light: 'var(--light)',
        accent1: 'var(--accent1)',
        accent2: 'var(--accent2)',
      },
    },
  },
  plugins: [],
}
