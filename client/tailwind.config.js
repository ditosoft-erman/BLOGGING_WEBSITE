/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'panther': "url('./src/assets/img/black.jpg')"
      }
    },
  },
  plugins: [],
}