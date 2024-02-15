/* eslint-disable */
// https://github.com/michael-ciniawsky/postcss-load-config

const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("autoprefixer"),
    // ...(process.env.NODE_ENV === "production"
    //   ? [
    purgecss({
      content: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.js"],
      safelist: [/^q-/, /^absolute/, /^relative/, /^overflow/, /^no/, /^fixed-/, /^material-icons/, /^mdi-/],
      whitelistPatterns: [/^q-/, /^absolute/, /^relative/, /^overflow/, /^no/, /^fixed-/, /^material-icons/, /^mdi-/],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
  // : [])
  // ]
};
