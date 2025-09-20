/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bt-purple': '#5e2750',
        'bt-purple-dark': '#4a1e3f',
        'bt-blue': '#3b82f6',
        'bt-orange': '#f97316',
      },
      backgroundImage: {
        'bt-gradient': 'linear-gradient(135deg, #5e2750 0%, #3b82f6 100%)',
      }
    },
  },
  plugins: [],
}