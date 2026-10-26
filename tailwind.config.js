/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0E14',
        cardBg: '#1E222D',
        cardSec: '#262B38',
        primary: '#2962FF',
        success: '#089981',
        danger: '#F23645',
        borderCol: '#2A2E39',
      }
    },
  },
  plugins: [],
}
