export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {
      ignoreAtRules: ['-ms-viewport', 'viewport', '-webkit-viewport'],
      grid: true,
      flexbox: true,
      remove: false
    },
  },
}
