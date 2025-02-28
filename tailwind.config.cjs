/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        "0b6e99": "#0b6e99",
        "b6e99": "#b6e99",
      },

    },
  },
  plugins: [],
}
