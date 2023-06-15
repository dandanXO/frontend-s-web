const { defineConfig } = require("@vue/cli-service");
const defaultSettings = require("./src/settings.js");

module.exports = defineConfig({
  lintOnSave: true,
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    hot: true,
    port: 8089
  },
  // publicPath:
  //   process.env.NODE_ENV === "production" ? "https://asdfdsa.com/" : "/",
  assetsDir: "static",
  transpileDependencies: true,
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
