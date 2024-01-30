const { defineConfig } = require("@vue/cli-service");
const defaultSettings = require("./src/settings.js");
const path = require('path');

module.exports = defineConfig({
  lintOnSave: true,
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    hot: true,
    port: 8089
  },
  assetsDir: "static",
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '.shared' : path.resolve(__dirname, '../.shared'),
      },
      modules: [path.resolve(__dirname, '../.shared')]
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, '../.shared')]
    }
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = defaultSettings.title;
      return args;
    });
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_variables.scss";
        `
      }
    }
  }
})
