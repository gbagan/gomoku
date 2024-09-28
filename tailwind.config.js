/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      height: {
        '30': '7.5rem',
      },
      backgroundImage: {
        seamless: "url('../seamless.webp')",
        main: "url('../background.webp')",
        thinking: "url('../girl_thinking.webp')",
        happy: "url('../girl_happy.webp')",
        crying: "url('../girl_crying.webp')",
        speaking: "url('../girl_speaking.webp')",
        "black-peg": "radial-gradient(closest-corner at 30% 25%, rgb(119, 119, 119), rgb(34, 34, 34))",
        "white-peg": "radial-gradient(closest-corner at 30% 25%, rgb(238, 238, 238), rgb(187, 187, 187))",
      },
      gridTemplateColumns: {
        '20/80': '20% 80%',
      }
    }
  },
  plugins: [],
}

