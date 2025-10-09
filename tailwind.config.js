/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
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
  plugins: [],
}

