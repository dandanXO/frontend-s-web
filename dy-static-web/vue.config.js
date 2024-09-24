const { defineConfig } = require("@vue/cli-service");
const defaultSettings = require("./src/settings.js");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = defineConfig({
  lintOnSave: true,
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    hot: true,
    compress: true,
    port: 8089
  },
  assetsDir: "static",
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        ".shared": path.resolve(__dirname, "../.shared")
      },
      modules: [path.resolve(__dirname, "../.shared")]
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, "../.shared")]
    },
    optimization: {
      splitChunks:
        process.env.NODE_ENV === "development"
          ? false
          : {
              chunks: "all"
            },
      runtimeChunk: "single",
      minimize: process.env.NODE_ENV === "development" ? false : true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true // Remove console.* statements
            }
          }
        })
      ]
    }
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = defaultSettings.title;
      return args;
    });
  },
  css: {
    extract: process.env.NODE_ENV === "development" ? false : true,
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_variables.scss";
        `
      }
    }
  }
});
