/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ret-main": "#050DEB",
        "ret-dark": "#1B1464",
        "ret-purple": "#8906E6",
        "ret-pink": "#FF00E2",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
}