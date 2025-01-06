// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const removeCode = require("gulp-remove-code");
const versionNumber = require("gulp-version-number");
const imagemin = require("gulp-imagemin");
const clean = require("gulp-clean");
// const bump = require("gulp-bump");s
const fs = require("fs");
const rename = require("gulp-rename");
const change = require("gulp-change");
const connect = require("gulp-connect");
// const proxy = require("http-proxy-middleware");
const { createProxyMiddleware } = require("http-proxy-middleware");
const modRewrite = require("connect-modrewrite");
// const gm = require("gulp-gm");
const concat = require("gulp-concat");
const browsersync = require("browser-sync").create();

var buildVer = 0;

// Versioning Task
const versionTask = () => {
  var fs = require("fs");
  //docString is the file from which you will get your constant string
  var docString = fs.readFileSync("src/assets/version/version.js", "utf8"); //type of docString i an object here.
  var versionParts = docString.split(".");
  var vArray = {
    vMajor: versionParts[0],
    vMinor: versionParts[1],
    vPatch: versionParts[2],
  };

  vArray.vPatch = parseFloat(vArray.vPatch) + 1;
  var periodString = ".";
  var newVersionNumber =
    vArray.vMajor + periodString + vArray.vMinor + periodString + vArray.vPatch;

  require("fs").writeFileSync(
    "src/assets/version/version.js",
    newVersionNumber
  );
  buildVer = newVersionNumber;
  return src("src/assets/version/version.js")
    .pipe(versionNumber({ version: newVersionNumber }))
    .pipe(dest("dist/assets/version"));
};

// Change version num in HTML
const performChange = (content) => {
  return content.replace("-ver.min", "-" + buildVer + ".min");
};

// Sass Task
const scssTask = () => {
  return src("src/assets/scss/styles.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("src/assets/css", { sourcemaps: "." }));
};

// Sass Build
const scssBuild = () => {
  return src("src/assets/scss/styles.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: "-ver.min" }))
    .pipe(dest("dist/assets/css", { sourcemaps: "." }));
};

const scssBuildNewVer = () => {
  return src("src/assets/scss/styles.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: "-" + buildVer + ".min" }))
    .pipe(dest("build/assets/css", { sourcemaps: "." }));
};

// JavaScript Build
const jsBuild = () => {
  return src("src/assets/js/*.js", { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(rename({ suffix: "-ver.min" }))
    .pipe(dest("dist/assets/js/", { sourcemaps: "." }));
};

// const jsBuildNewVer = () => {
//   return src("src/assets/js/*.js", { sourcemaps: true })
//     .pipe(babel({ presets: ["@babel/preset-env"] }))
//     .pipe(terser())
//     .pipe(rename({ suffix: "-" + buildVer + ".min" }))
//     .pipe(dest("build/assets/js/", { sourcemaps: "." }));
// };

const jsBuildNewVer = () => {
  return src(["src/assets/js/scripts.js", "src/assets/js/i18n.js"], {
    sourcemaps: true,
  })
    .pipe(concat("bundle.js")) // Merge the files into a single file named "bundle.js"
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(
      rename((path) => {
        path.basename += "-" + buildVer + ".min";
      })
    )
    .pipe(dest("build/assets/js/", { sourcemaps: "." }));
};

// Copy Files Build
const fileCopy = () => {
  return (
    src("src/**/*.html")
      .pipe(removeCode({ production: true }))
      // .pipe(clean())
      .pipe(dest("dist/"))
  );
};

const lottieCopy = () => {
  return src("src/assets/lottie/**/*").pipe(dest("dist/assets/lottie/"));
};

const fileCopyNewVer = () => {
  return src("src/**/*.html")
    .pipe(removeCode({ production: true }))
    .pipe(change(performChange))
    .pipe(change(performChange))
    .pipe(dest("build/"));
};

const emailfileCopyNewVer = () => {
  return src("src/email/**/*").pipe(dest("build/email/"));
};

const vendorsCssCopy = () => {
  return src("src/assets/css/vendors/*").pipe(
    dest("build/assets/css/vendors/")
  );
};

const vendorsJsCopy = () => {
  return src("src/assets/js/vendors/*").pipe(dest("build/assets/js/vendors/"));
};

const lottieCopyNewVer = () => {
  return src("src/assets/lottie/**/*").pipe(dest("build/assets/lottie/"));
};

//Clean Build Files
const cleanBuild = () => {
  // return src("build/**/*.js").pipe(clean({ production: true }));
  return src("build/**/*.{map,js,css}").pipe(clean({ force: true }));
};

const cleanBuildJs = () => {
  return src("build/**/*.js").pipe(clean({ production: true }));
};

const cleanBuildCss = () => {
  return src("build/**/*.css").pipe(clean({ production: true }));
};

// Image Optimization
const imgOptimize = () => {
  return src("src/assets/images/**/*")
    .pipe(imagemin())
    .pipe(dest("dist/assets/images"));
};

const imgOptimizeNewVer = () => {
  return src("src/assets/images/**/*")
    .pipe(imagemin())
    .pipe(dest("build/assets/images"));
};

// Connect Proxy
const connectProxy = () => {
  connect.server({
    host: "0.0.0.0",
    port: 9000,
    root: ["./build/"],
    livereload: true,
    serveStaticOptions: {
      extensions: ["html"],
    },
    middleware: function (connect, opt) {
      return [
        createProxyMiddleware("/api", {
          target: "http://0.0.0.0:3040",
          // target: "http://127.0.0.1:3040",
          // target: "http://10.10.36.25:3040",
          // target: "http://10.10.100.105:3040",
          changeOrigin: true,
        }),
      ];
    },
  });
};

// Browsersync
const apiProxy = createProxyMiddleware("/api", {
  target: "http://0.0.0.0:3040",
  // target: "http://127.0.0.1:3040",
  // target: "http://10.10.36.25:3040",
  // target: "http://10.10.100.105:3040",
  changeOrigin: true, // for vhosted sites
});

const browserSyncServe = (cb) => {
  browsersync.init({
    port: 9000,
    server: {
      baseDir: "./src/",
      middleware: [apiProxy],
      serveStaticOptions: {
        extensions: ["html"],
      },
    },
  });
  cb();
};
const browserSyncReload = (cb) => {
  browsersync.reload();
  cb();
};

// Watch Task
const watchTask = () => {
  // watch("src/**/*.html", browserSyncReload);
  watch(["src/**/*.html", "src/**/*.js"], series(browserSyncReload));
  watch(["src/**/*.scss"], series(scssTask, browserSyncReload));
};

// Watch Build Task
const browserSyncServeBuild = (cb) => {
  browsersync.init({
    server: {
      baseDir: "./build/",
      serveStaticOptions: {
        extensions: ["html"],
      },
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
};
const browserSyncReloadBuild = (cb) => {
  browsersync.reload();
  cb();
};

// Default Gulp Task
exports.default = series(browserSyncServe, watchTask);

// Build Gulp Task
exports.dist = series(scssBuild, jsBuild, fileCopy, lottieCopy, imgOptimize);

// Build New Version Task
exports.build = series(
  cleanBuild,
  versionTask,
  jsBuildNewVer,
  scssBuildNewVer,
  fileCopyNewVer,
  // emailfileCopyNewVer,
  vendorsCssCopy,
  vendorsJsCopy,
  // lottieCopyNewVer,
  imgOptimizeNewVer
);

// Watch Build Task
exports.watchbuild = series(browserSyncServeBuild);

// Proxy Server Task
exports.watch = series(connectProxy);
