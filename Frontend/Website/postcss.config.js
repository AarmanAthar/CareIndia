export default {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- THIS IS THE MAGIC FIX
    autoprefixer: {},
  },
}