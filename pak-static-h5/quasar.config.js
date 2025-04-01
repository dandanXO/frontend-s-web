/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js

const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");

const { configure } = require("quasar/wrappers");
const fs = require("fs-extra");

const isImageCompress = true;

const ImageminPlugin = require("imagemin-webpack-plugin").default;
const IgnorePlugin = require("webpack").IgnorePlugin;
const NormalModuleReplacementPlugin = require("webpack").NormalModuleReplacementPlugin;

module.exports = configure(function (ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
    supportTS: false,

    // https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-webpack/boot-files
    boot: ["axios", "cache", "lang", "fingerprint", "google-analytics"],

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
      "material-icons" // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-build
    build: {
      env: {
        IS_PWA: process.env.ROUTER_BASE ? "1" : "0",
        ROUTER_BASE: process.env.ROUTER_BASE
      },
      vueRouterMode: process.env.VUE_ROUTER_MODE === "hash" || "history", // available values: 'hash', 'history'

      nativeMobile: false, // or any other value you want
      nativeMobileWrapper: "", // or any other value you want
      // transpile: false,
      // publicPath: '/',
      // transpile: false,
      publicPath: process.env.ROUTER_BASE ? `/${process.env.ROUTER_BASE}/` : "",

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      analyze: false,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain

      // chainWebpack(chain) {
      //   chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js", "vue"] }]);
      // }
      minify: true,
      uglifyOptions: {
        compress: {
          drop_console: true // Removes all console logs
        }
      },
      // Options below are automatically set depending on the env, set them if you want to override
      extractCSS: true,
      sourceMap: false,

      chainWebpack(chain) {
        chain.plugin("eslint-webpack-plugin").use(ESLintPlugin, [{ extensions: ["js", "vue"] }]);
        chain.plugin("ignore-plugin").use(IgnorePlugin, [
          {
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
          }
        ]);
        chain
          .plugin("normal-module-replacement-plugin")
          .use(NormalModuleReplacementPlugin, [
            /moment-timezone\/data\/packed\/latest.json/,
            require.resolve(path.resolve(__dirname, "misc/timezone.json"))
          ]);

        // Add Image Compression
        if (process.env.NODE_ENV === "production" && isImageCompress) {
          chain.plugin("imagemin-webpack-plugin").use(ImageminPlugin, [
            {
              test: /\.(jpe?g|png|gif|svg)$/i,
              pngquant: {
                quality: "70"
              }
            }
          ]);
        }
      },
      extendWebpack(chain) {
        if (ctx.mode.capacitor) {
          chain.plugins.forEach((plugin) => {
            if (plugin.constructor.name === "CopyPlugin") {
              const publicPath = path.resolve(__dirname, "public");
              plugin.patterns.forEach((pattern) => {
                if (pattern.from === publicPath) {
                  pattern.globOptions.ignore = [
                    ...pattern.globOptions.ignore,
                    "**/public/static/**",
                    "**/public/*.ico"
                  ];
                }
              });
            }
          });
        }
      },

      // Add a hook to copy assets after the build
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
      lang: "en-US",
      config: {
        dark: true
      },

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
      plugins: ["LocalStorage", "SessionStorage", "Notify", "Loading", "Dialog", "AddressbarColor"]
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: "all",

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
        name: `B9.GAME`,
        short_name: `B9.GAME`,
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
      appName: "B9.GAME", // string
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
