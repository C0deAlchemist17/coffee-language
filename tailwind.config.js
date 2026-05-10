/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      colors: {
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#c4a194',
          600: '#b08578',
          700: '#9c6a5f',
          800: '#85564b',
          900: '#6d4238',
          950: '#4a2a24',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf7f0',
          200: '#f5efe4',
          300: '#efe5d6',
          400: '#e7d7c2',
          500: '#dec9ad',
          600: '#d4b791',
          700: '#c7a273',
          800: '#b68b5c',
          900: '#a0764d',
          950: '#6b4e32',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
    },
  },
  plugins: [],
}
