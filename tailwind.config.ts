import type { Config } from 'tailwindcss';

export default {
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
        surprised: "url('../girl_surprised.webp')",
        "black-peg": "radial-gradient(closest-corner at 30% 25%, rgb(119, 119, 119), rgb(34, 34, 34))",
        "white-peg": "radial-gradient(closest-corner at 30% 25%, rgb(238, 238, 238), rgb(187, 187, 187))",
      },
      gridTemplateColumns: {
        '20/80': '20% 80%',
      },
      boxShadow: {
        'threat': '0 0 20px red',
      },
      animation: {
        'flip-anim': 'flip 500ms linear forwards',
        'peg': 'peg 1s ease-in-out infinite',
      },
      keyframes: {
        flip: {
          '0%': { opacity: '0', transform: 'rotateY(180deg)' },
          '100%': { opacity: '1', transform: 'rotateY(0)' },
        },
        peg: {
          '0%, 100%': { transform: 'translateY(0)', 'box-shadow': 'none'},
          '50%': { transform: 'translateY(-0.5rem)', 'box-shadow': '0 0.4rem 0.4rem rgba(0,0,0,0.7)' },
        }
      }
    }
  },
  plugins: [],
} satisfies Config