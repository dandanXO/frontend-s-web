const { defineConfig } = require("@vue/cli-service");
const defaultSettings = require("./src/settings.js");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const SitemapPlugin = require("sitemap-webpack-plugin").default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const paths = [
  { path: "/", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/login", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/register", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/forgotPwd", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/home", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/slot", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/about", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/esports", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/sports", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/live-casino", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/lottery", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/poker", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/fishing", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/others", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/cockfight", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/minigame", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/agent", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/promotion", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/app", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/vip", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/affiliate", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/center/personal", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/center/mailbox", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/center/feedback", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/center/share", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/center/transit-record", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/center/deposit", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/center/transfer", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" },
  { path: "/center/withdraw", lastmod: "2024-08-01", priority: 1.0, changefreq: "monthly" }
];

module.exports = defineConfig({
  lintOnSave: false,
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    hot: true,
    port: 8089,
    client: {
      overlay: false
    }
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
      splitChunks: process.env.NODE_ENV === "development" ? false : {
        chunks: "all"
      },
      runtimeChunk: process.env.NODE_ENV === "development" ? false : true,
      minimize: process.env.NODE_ENV === "development" ? false : true,
      minimizer: process.env.NODE_ENV === "development" ? [] : [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true // Remove console.* statements
            }
          }
        })
      ]
    },
    plugins: [
      new SitemapPlugin({
        base: process.env.VUE_APP_SERVER ? process.env.VUE_APP_SERVER : "https://www.tkeochuan88.com",
        paths
      }),
      // new BundleAnalyzerPlugin(),
      new MomentLocalesPlugin(),
    ]
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = defaultSettings.title;
      return args;
    });

    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: "true",
        __VUE_PROD_DEVTOOLS__: "false",
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false"
      });
      return definitions;
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
});
