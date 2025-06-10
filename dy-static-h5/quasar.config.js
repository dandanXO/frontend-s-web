/* eslint-env node */
const TerserPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js

const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");

const { configure } = require("quasar/wrappers");

const isImageCompress = true;

const ImageminPlugin = require("imagemin-webpack-plugin").default;

const ContextReplacementPlugin = require("webpack").ContextReplacementPlugin;

const isLiveChat = process.env.BUILD_TARGET === "livechat";


module.exports = configure(function (ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
    supportTS: false,

    // https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-webpack/boot-files
    boot: ["axios", "cache", "fingerprint", "i18n", "vue-native-websocket", "vue-shortkey"],

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-css
    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      // "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
      "material-icons-outlined"
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-build
    build: {
      vueRouterMode: "history", // available values: 'hash', 'history'
      postcss: {
        configFile: true
      },
      publicPath: "/",
      distDir: "dist/spa",
      // transpile: false,
      // publicPath: '/',

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      extendWebpack(cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          ".shared": path.resolve(__dirname, "../.shared")
        };
        cfg.resolve.modules = [...cfg.resolve.modules, path.resolve(__dirname, "../.shared")];
        cfg.resolveLoader.modules = [...cfg.resolveLoader.modules, path.resolve(__dirname, "../.shared")];

        cfg.plugins.push(
          new ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
          new ESLintPlugin({ extensions: ["js", "vue"] }),
          new CompressionWebpackPlugin({
            algorithm: "gzip",
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
          })
        );

        cfg.module.rules.push({
          test: /\.(jpe?g|png|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "img/[name].[hash:8][ext]"
          },
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024
            }
          }
        });

        cfg.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true // 移除 console.log
              }
            }
          })
        ];

        cfg.optimization = {
          splitChunks: {
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 3000,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  if (module.context) {
                    const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                    const packageName = match ? match[1] : null;
                    return packageName ? `npm.${packageName.replace("@", "")}` : null;
                  }
                  return null;
                }
              }
            }
          }
        };
      },
      chainWebpack(chain) {
        chain.module.rules.delete("images");

        if (process.env.NODE_ENV === "production" && isImageCompress) {
          chain.plugin("imagemin-webpack-plugin").use(ImageminPlugin, [
            {
              test: /\.(jpe?g|png|gif|svg)$/i,
              pngquant: {
                quality: "85"
              }
            }
          ]);
        }
        // chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js", "vue"] }]);
      },
      afterBuild({ cfg }) {
        const fs = require("fs-extra");
        const sourceDir = path.resolve(__dirname, "src/assets");
        const destinationDir = path.resolve(__dirname, "dist/spa/static");

        fs.copySync(sourceDir, destinationDir);
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-devServer
    devServer: {
      server: {
        type: "http"
      },
      port: process.env.NODE_ENV === "development" ? 9090 : 8080,
      open: true // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-framework
    framework: {
      lang: "zh-CN",
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // components: ["QPageSticky"],
      // directives: ["BackToTop"],

      // Quasar plugins
      plugins: ["LocalStorage", "SessionStorage", "Notify", "Loading", "Dialog"]
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      chainWebpackWebserver(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      middlewares: [
        ctx.prod ? "compression" : "",
        "render" // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: "GenerateSW", // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode

      chainWebpackCustomSW(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      manifest: {
        name: `东赢 App`,
        short_name: `东赢 App`,
        description: `APP`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
      // (Optional) If not present, will look for package.json > name
      appName: "东赢", // string
      backButtonExit: "*"
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
    electron: {
      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "ph-project"
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain

      chainWebpackMain(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      chainWebpackPreload(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js"] }]);
      }
    }
  };
});
