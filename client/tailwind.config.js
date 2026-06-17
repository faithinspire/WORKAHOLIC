/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'gradient-start': '#1e3a8a',
        'gradient-end': '#4f46e5',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
