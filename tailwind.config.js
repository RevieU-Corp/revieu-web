/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f5',
          100: '#ffe3e3',
          600: '#990000',
          700: '#7f0000',
        },
      },
    },
  },
  plugins: [],
};
