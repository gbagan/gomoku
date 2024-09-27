/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      height: {
        '30': '7.5rem',
      },
      backgroundImage: {
        seamless: "url('./seamless.webp')",
        main: "url('./background.jpg')",
      }
    }
  },
  plugins: [],
}

