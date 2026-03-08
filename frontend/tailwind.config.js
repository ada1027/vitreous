/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          DEFAULT: '#324145',
          dark: '#1A1D1D',
          light: '#4A666D',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
