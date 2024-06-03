const { defineConfig } = require("@vue/cli-service");
const defaultSettings = require("./src/settings.js");

const isProduction = process.env.NODE_ENV === "production";

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
  transpileDependencies: isProduction,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = defaultSettings.title;
      return args;
    });
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => ({
        ...options,
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("swiper-")
        }
      }));
  },
  css: {
    loaderOptions: {
      // 全局使用的一些scss样式
      scss: {
        additionalData: `
                @import "@/assets/css/variables.scss";
                @import "@/assets/css/mixin.scss";
                `
      }
    }
  }
});
