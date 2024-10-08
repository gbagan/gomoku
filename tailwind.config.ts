import type { Config } from 'tailwindcss';

export default {
  content: ["./src/**/*.{ts,tsx,civet}"],
  theme: {
    extend: {
      height: {
        '30': '7.5rem',
      },
      backgroundImage: {
        wood: "url('../wood.webp')",
        main: "url('../background3.webp')",
        thinking: "url('../girl_thinking.webp')",
        happy: "url('../girl_happy.webp')",
        crying: "url('../girl_crying.webp')",
        speaking: "url('../girl_speaking.webp')",
        surprised: "url('../girl_surprised.webp')",
      },
      gridTemplateColumns: {
        '20/80': '20% 80%',
      },
      boxShadow: {
        'threat': '0 0 20px red',
      },
      animation: {
        'flip-y': 'flip-y 500ms linear forwards',
        'peg': 'peg 1s ease-in-out infinite',
        'threat': 'threat 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        "flip-y": {
          '0%': { opacity: '0', transform: 'rotateY(180deg)' },
          '100%': { opacity: '1', transform: 'rotateY(0)' },
        },
        peg: {
          '0%, 100%': {
            transform: 'translateY(0)',
            filter: 'drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.7))',
          },
          '50%': {
            transform: 'translateY(-10px)',
            filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.7))',
          }
        },
        threat: {
          '0%, 100%': {opacity: '0.7'},
          '50%': {opacity: '0.35'},
        }
      }
    }
  },
  plugins: [],
} satisfies Config