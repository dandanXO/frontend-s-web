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
      splitChunks: {
        chunks: "all"
      },
      runtimeChunk: true,
      minimize: true,
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

    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
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
});
