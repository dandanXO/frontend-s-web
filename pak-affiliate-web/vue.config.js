const { resolve } = require("path");
const path = require("path");
const WebpackBar = require("webpackbar");
const dayjs = require("dayjs");
const time = dayjs().format("YYYY-M-D HH:mm:ss");
process.env.VUE_APP_UPDATE_TIME = time;
const {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  devPort
} = require("./src/config/vue.custom.config");
module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true
    },
    // proxy: {
    //   "/api": {
    //     target: "http://45.77.250.199:9999", //API服务器的地址
    //     ws: true,  //代理websockets
    //     changeOrigin: true, // 虚拟的站点需要更管origin
    //     pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
    //       "^/api": ""
    //     }
    //   }
    // }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "src/styles/_variables.scss"),
        path.resolve(__dirname, "src/styles/_mixins.scss")
      ]
    }
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          "@": resolve("src"),
          "*": resolve(""),
          "Assets": resolve("src/assets")
        }
      },
      plugins: [
        new WebpackBar({
          name: title
        })
      ]
    };
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
    config.resolve.alias
      .set('@', resolve('src'))
      .end();
  }
};
