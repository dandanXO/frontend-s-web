/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 30097:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js
var es_string_replace = __webpack_require__(18964);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(61957);
// EXTERNAL MODULE: ./node_modules/quasar/src/vue-plugin.js
var vue_plugin = __webpack_require__(71947);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/App.vue?vue&type=template&id=4f4c840c

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_view = (0,runtime_core_esm_bundler/* resolveComponent */.up)("router-view");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_router_view);
}
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/vue-uuid/dist/index.esm.js + 12 modules
var index_esm = __webpack_require__(24695);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/App.vue?vue&type=script&lang=js




/* harmony default export */ const Appvue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "App",
  setup() {
    const $q = (0,use_quasar/* default */.Z)(); // calling here; equivalent to when component
    $q.dark.set(true);
    const checkUUID = () => {
      var uuidParam = localStorage.getItem("uuid");
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      if (!uuidParam) {
        localStorage.setItem("uuid", index_esm/* uuid.v1 */.V.v1());
        checkUUID();
      } else {
        const obj = {
          identifier: uuidParam,
          affiliateCode: affiliateItem
        };
        axios.api.post('/memberAccessLog', obj).then(res => {
          console.log(res);
        });
      }
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      checkUUID();
    });
  }
}));
;// CONCATENATED MODULE: ./src/App.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
;// CONCATENATED MODULE: ./src/App.vue




;
const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(Appvue_type_script_lang_js, [['render',render]])

/* harmony default export */ const App = (__exports__);
// EXTERNAL MODULE: ./node_modules/quasar/wrappers/index.mjs
var wrappers = __webpack_require__(23340);
// EXTERNAL MODULE: ./src/stores/index.js
var stores = __webpack_require__(23053);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
;// CONCATENATED MODULE: ./src/router/routes.js

const routes = [{
  path: "/",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(828)]).then(__webpack_require__.bind(__webpack_require__, 55631))
  }]
}, {
  path: "/welcome",
  children: [{
    path: "",
    component: () => __webpack_require__.e(/* import() */ 142).then(__webpack_require__.bind(__webpack_require__, 78142))
  }]
}, {
  path: "/login",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(896)]).then(__webpack_require__.bind(__webpack_require__, 99896))
  }]
}, {
  path: "/register",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(887)]).then(__webpack_require__.bind(__webpack_require__, 6887))
  }]
}, {
  path: "/forgot-password",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(992)]).then(__webpack_require__.bind(__webpack_require__, 95992))
  }]
},
// {
//   path: "/home",
//   component: () => import("layouts/MainLayout.vue"),
//   children: [{ path: "", component: () => import("pages/HomePage.vue") }]
// },
{
  path: "/promo",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(843)]).then(__webpack_require__.bind(__webpack_require__, 68843))
  }]
}, {
  path: "/liveChat",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(255)]).then(__webpack_require__.bind(__webpack_require__, 12255))
  }]
}, {
  path: "/aviator",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "aviator",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(375)]).then(__webpack_require__.bind(__webpack_require__, 90032))
  }]
}, {
  path: "/poker",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "poker",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(204)]).then(__webpack_require__.bind(__webpack_require__, 72282))
  }]
}, {
  path: "/slot",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "slot",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(23)]).then(__webpack_require__.bind(__webpack_require__, 32318))
  }]
}, {
  path: "/live-casino",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "live-casino",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(241)]).then(__webpack_require__.bind(__webpack_require__, 17157))
  }]
}, {
  path: "/sport",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "sport",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(704)]).then(__webpack_require__.bind(__webpack_require__, 65704))
  }],
  meta: {
    requiresAuth: true
  }
},
// {
//   path: "/sports",
//   // component: () => import("layouts/MainLayout.vue"),
//   children: [
//     {
//       path: "",
//       name: "sport",
//       component: () => import("components/sportsOuter.vue")
//     }
//   ],
//   meta: { requiresAuth: true }
// },
{
  path: "/e-sport",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "e-sport",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(628)]).then(__webpack_require__.bind(__webpack_require__, 67628))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/share",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "share",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(679)]).then(__webpack_require__.bind(__webpack_require__, 29679))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/vip",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "vip",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(318)]).then(__webpack_require__.bind(__webpack_require__, 85318))
  }]
}, {
  path: "/affiliate",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    name: "affiliate",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(219)]).then(__webpack_require__.bind(__webpack_require__, 83219))
  }]
}, {
  path: "/agent/:affiliateCode",
  name: "agentCode",
  component: () => {}
  // component: () => {},
}, {
  path: "/refer/:referralCode",
  name: "referCode",
  component: () => {}
  // component: () => {},
}, {
  path: "/account",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(145)]).then(__webpack_require__.bind(__webpack_require__, 52145))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/account/transit",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(714)]).then(__webpack_require__.bind(__webpack_require__, 48714))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/account/personal",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(611)]).then(__webpack_require__.bind(__webpack_require__, 73611))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/account/withdraw",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(720)]).then(__webpack_require__.bind(__webpack_require__, 93720))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/account/mail",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(725)]).then(__webpack_require__.bind(__webpack_require__, 56725))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/finance/deposit",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(64), __webpack_require__.e(613)]).then(__webpack_require__.bind(__webpack_require__, 80456))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/display",
  children: [{
    path: "",
    component: () => __webpack_require__.e(/* import() */ 931).then(__webpack_require__.bind(__webpack_require__, 2931))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/depositLoading",
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(64), __webpack_require__.e(122)]).then(__webpack_require__.bind(__webpack_require__, 27122))
  }],
  meta: {
    requiresAuth: true
  }
}, {
  path: "/finance/withdraw",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(821)]).then(__webpack_require__.bind(__webpack_require__, 29821)),
  children: [{
    path: "",
    component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(108)]).then(__webpack_require__.bind(__webpack_require__, 82108))
  }],
  meta: {
    requiresAuth: true
  }
},
// Always leave this as last one,
// but you can also remove it
{
  path: "/:catchAll(.*)*",
  component: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(524)]).then(__webpack_require__.bind(__webpack_require__, 65524))
}];
/* harmony default export */ const router_routes = (routes);
// EXTERNAL MODULE: ./src/stores/ui.js
var stores_ui = __webpack_require__(24477);
;// CONCATENATED MODULE: ./src/router/index.js







/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

/* harmony default export */ const src_router = ((0,wrappers/* route */.BC)(function /* { store, ssrContext } */
() {
  const createHistory =  false ? 0 :  false ? 0 : vue_router/* createWebHashHistory */.r5;
  const Router = (0,vue_router/* createRouter */.p7)({
    scrollBehavior: () => ({
      left: 0,
      top: 0
    }),
    routes: router_routes,
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory( false ? 0 : "")
  });
  Router.beforeEach((to, from, next) => {
    const user = (0,stores/* userStore */.H)();
    const ui = (0,stores_ui/* useUI */.l)();
    if (to.name === "agentCode") {
      sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
      next(`/welcome`);
    }
    if (to.name === "referCode") {
      sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
      next(`/register`);
    }
    if (user.hasToken()) {
      if (to.path === "/login") {
        next({
          path: "/"
        });
      } else {
        if (to.path === "/sport") {
          ui.hiddenFooter();
        } else {
          ui.showFooter();
        }
        if (user.nickName === "" || !user.nickName) {
          user.getMemberInfo().then(() => next({
            ...to,
            replace: true
          }));
        } else {
          next();
        }
      }
    } else {
      if (to.meta.requiresAuth) {
        next(`/login?redirect=${to.path}`);
      } else {
        next();
      }
    }
  });
  return Router;
}));
// EXTERNAL MODULE: ./node_modules/@capacitor/core/dist/index.js
var dist = __webpack_require__(17634);
// EXTERNAL MODULE: ./src-capacitor/node_modules/@capacitor/app/dist/esm/index.js
var esm = __webpack_require__(46000);
// EXTERNAL MODULE: ./src-capacitor/node_modules/@capacitor/splash-screen/dist/esm/index.js
var dist_esm = __webpack_require__(91067);
;// CONCATENATED MODULE: ./.quasar/app.js
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/







// importing it so it can install itself (used by Quasar UI)



const RootComponent = (0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: 'AppWrapper',
  setup(props) {
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      dist_esm/* SplashScreen.hide */.c.hide();
    });
    return () => (0,runtime_core_esm_bundler.h)(App, props);
  }
});
/* harmony default export */ async function app(createAppFn, quasarUserOptions) {
  // Create the app instance.
  // Here we inject into it the Quasar UI, the router & possibly the store.
  const app = createAppFn(RootComponent);
  app.config.performance = true;
  app.use(vue_plugin/* default */.Z, quasarUserOptions);
  app.config.globalProperties.$q.capacitor = window.Capacitor;
  const router = (0,reactivity_esm_bundler/* markRaw */.Xl)(typeof src_router === 'function' ? await src_router({}) : src_router);

  // Expose the app, the router and the store.
  // Note that we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
    router
  };
}
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/LocalStorage.js
var LocalStorage = __webpack_require__(3833);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/SessionStorage.js
var SessionStorage = __webpack_require__(38126);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Notify.js
var Notify = __webpack_require__(6827);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Loading.js
var Loading = __webpack_require__(26950);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Dialog.js + 4 modules
var Dialog = __webpack_require__(97286);
;// CONCATENATED MODULE: ./.quasar/quasar-user-options.js
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/


/* harmony default export */ const quasar_user_options = ({
  config: {},
  plugins: {
    LocalStorage: LocalStorage/* default */.Z,
    SessionStorage: SessionStorage/* default */.Z,
    Notify: Notify/* default */.Z,
    Loading: Loading/* default */.Z,
    Dialog: Dialog/* default */.Z
  }
});
;// CONCATENATED MODULE: ./.quasar/client-entry.js

/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/




// We load Quasar stylesheet file




const publicPath = ``;
async function start({
  app,
  router
}, bootFiles) {
  let hasRedirected = false;
  const getRedirectUrl = url => {
    try {
      return router.resolve(url).href;
    } catch (err) {}
    return Object(url) === url ? null : url;
  };
  const redirect = url => {
    hasRedirected = true;
    if (typeof url === 'string' && /^https?:\/\//.test(url)) {
      window.location.href = url;
      return;
    }
    const href = getRedirectUrl(url);

    // continue if we didn't fail to resolve the url
    if (href !== null) {
      window.location.href = href;
      window.location.reload();
    }
  };
  const urlPath = window.location.href.replace(window.location.origin, '');
  for (let i = 0; hasRedirected === false && i < bootFiles.length; i++) {
    try {
      await bootFiles[i]({
        app,
        router,
        ssrContext: null,
        redirect,
        urlPath,
        publicPath
      });
    } catch (err) {
      if (err && err.url) {
        redirect(err.url);
        return;
      }
      console.error('[Quasar] boot error:', err);
      return;
    }
  }
  if (hasRedirected === true) {
    return;
  }
  app.use(router);
  app.mount('#q-app');
}
app(runtime_dom_esm_bundler/* createApp */.ri, quasar_user_options).then(app => {
  // eventually remove this when Cordova/Capacitor/Electron support becomes old
  const [method, mapFn] = Promise.allSettled !== void 0 ? ['allSettled', bootFiles => bootFiles.map(result => {
    if (result.status === 'rejected') {
      console.error('[Quasar] boot error:', result.reason);
      return;
    }
    return result.value.default;
  })] : ['all', bootFiles => bootFiles.map(entry => entry.default)];
  return Promise[method]([Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 31249)), Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 53393))]).then(bootFiles => {
    const boot = mapFn(bootFiles).filter(entry => typeof entry === 'function');
    start(app, boot);
  });
});

/***/ }),

/***/ 31249:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "api": () => (/* binding */ api),
  "axios": () => (/* reexport */ (axios_default())),
  "cashier": () => (/* binding */ cashier),
  "default": () => (/* binding */ boot_axios),
  "eventapi": () => (/* binding */ eventapi)
});

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.error.cause.js
var es_error_cause = __webpack_require__(6822);
// EXTERNAL MODULE: ./node_modules/quasar/wrappers/index.mjs
var wrappers = __webpack_require__(23340);
// EXTERNAL MODULE: ./node_modules/pinia/dist/pinia.mjs + 1 modules
var pinia = __webpack_require__(22858);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Loading.js
var Loading = __webpack_require__(26950);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Notify.js
var Notify = __webpack_require__(6827);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/SessionStorage.js
var SessionStorage = __webpack_require__(38126);
;// CONCATENATED MODULE: ./src/api/response.js
const ResponseCode = {
  SUCCESS: 0,
  ERROR_SYSTEM: 500,
  TOO_OFTEN_REQUEST: 504,
  ERROR_BAD_REQUEST: 400,
  ERROR_UNAUTHORIZED: 401,
  ERROR_FORBIDDEN: 403,
  ERROR_NOT_FOUND: 404,
  ERROR_METHOD_NOT_SUPPORT: 405,
  ERROR_LOGIN_INVALID_SESSION: 501,
  ERROR_LOGIN_EXPIRED_SESSION: 502,
  ERROR_PASS_REPEAT: 600,
  ERROR_NAME_EXIST: 601,
  ERROR_TOKEN_EXPIRED: 602,
  ERROR_TOKEN_LOGGED: 604,
  ERROR_AMOUNT_DEPOSIT: 11003
};
// EXTERNAL MODULE: ./node_modules/qs/lib/index.js
var lib = __webpack_require__(51470);
// EXTERNAL MODULE: ./src/i18n/index.js + 1 modules
var i18n = __webpack_require__(95490);
// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(39981);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
;// CONCATENATED MODULE: ./src/boot/axios.js








const crArray = "https://tvzv.xtremespeedy.com";
const api = axios_default().create({
  baseURL: "https://fwkk.xtremespeedy.com"
});
const cashier = axios_default().create({
  baseURL: crArray
});
const eventapi = axios_default().create({
  baseURL: "https://fnvv.xtremespeedy.com/"
});
/* harmony default export */ const boot_axios = ((0,wrappers/* boot */.xr)(({
  app,
  router
}) => {
  const onRequest = config => {
    if (wrappers/* store.token */.h.token) {
      api.defaults.headers["token"] = wrappers/* store.token */.h.token;
      cashier.defaults.headers["TOKEN"] = wrappers/* store.token */.h.token;
      eventapi.defaults.headers["token"] = wrappers/* store.token */.h.token;
    }
    // config.headers["Authorization"] = process.env.SITE;

    if (config.data) {
      config.data = config.data;
    }
    return config;
  };
  const onResponseError = error => {
    // message.error(error.message);
    Notify/* default.create */.Z.create({
      type: 'negative',
      timeout: 1000,
      position: 'top',
      message: error.message
    });
    Loading/* default.hide */.Z.hide();
    return Promise.reject(error);
  };
  const onResponse = response => {
    let res = response.data;
    if (typeof response.data === "string") {
      res = JSON.parse(response.data);
    }
    if (res.code !== ResponseCode.SUCCESS) {
      if (res.code === ResponseCode.TOO_OFTEN_REQUEST || res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT) {
        return response;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
        location.reload();
      } else {
        if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED) {
          SessionStorage/* default.remove */.Z.remove("TOKEN");
          // router.push("/")
          window.location.href = "/";
        }
        if (res.code === ResponseCode.ERROR_TOKEN_LOGGED) {
          SessionStorage/* default.remove */.Z.remove("TOKEN");
          // router.push("/")
          window.location.href = "/";
        }
        Notify/* default.create */.Z.create({
          type: 'negative',
          timeout: 1000,
          position: 'top',
          message: i18n/* default.global.t */.Z.global.t('error.' + res.code) + (res.data && res.data.parameter ? res.data.parameter : "") || "Error"
        });
        Loading/* default.hide */.Z.hide();
      }
      throw new Error(res.message || "Error");
    } else {
      return response;
    }
  };
  app.use((0,pinia/* createPinia */.WB)());
  api.defaults.headers["Authorization"] = "THA";
  cashier.defaults.headers["Authorization"] = "THA";
  eventapi.defaults.headers["Authorization"] = "THA";
  app.config.globalProperties.$axios = (axios_default());
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$cashier = cashier;
  app.config.globalProperties.$eventapi = eventapi;
  api.interceptors.request.use(onRequest);
  api.interceptors.response.use(onResponse, onResponseError);
  cashier.interceptors.request.use(onRequest);
  cashier.interceptors.response.use(onResponse, onResponseError);
  eventapi.interceptors.request.use(onRequest);
  eventapi.interceptors.response.use(onResponse, onResponseError);
}));


/***/ }),

/***/ 53393:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GOT_EXPIRED": () => (/* binding */ GOT_EXPIRED),
/* harmony export */   "TIME_EXPIRED": () => (/* binding */ TIME_EXPIRED),
/* harmony export */   "cached": () => (/* binding */ cached),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var quasar_wrappers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23340);
/* harmony import */ var quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38126);


const TIME_EXPIRED = "TIME_EXPIRED";
const GOT_EXPIRED = "GOT_EXPIRED";
const DEFAULT_EXPIRED_TIME = 60;
function getStorageData(key) {
  const s_data = quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].getItem */ .Z.getItem(key);
  return s_data == undefined || s_data == null ? null : JSON.parse(s_data);
}
function setStorageData(key, value) {
  value = JSON.stringify(value);
  quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].set */ .Z.set(key, value);
}
function removeStorageData(key) {
  quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].remove */ .Z.remove(key);
}
class CachedNode {
  constructor(key, value, expired_type, expired_value) {
    this.key = key;
    this.value = value;
    this.expired_type = expired_type;
    this.expired_value = expired_value;
    this.gotTimes = 1;
    this.expired_time = new Date().getTime() + this.expired_value * 1000;
  }
}
class Cached {
  get(key, fn, {
    expired_type = TIME_EXPIRED,
    expired_value = DEFAULT_EXPIRED_TIME
  } = {}) {
    let value = this.getAndCheck(key);
    if (value) {
      return Promise.resolve(value);
    } else {
      if (fn) {
        return fn().then(d => {
          let node = new CachedNode(key, d.data, expired_type, expired_value);
          setStorageData(key, node);
          return d.data;
        });
      }
    }
  }
  getAndCheck(key) {
    try {
      let node = getStorageData(key);
      if (node) {
        if (this.isExpired(node)) {
          setStorageData(key, node);
          return node.value;
        } else {
          removeStorageData(key);
          return null;
        }
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
  isExpired(node) {
    node.gotTimes++;
    if (node.expired_type === TIME_EXPIRED && this.currentTime() <= node.expired_time) {
      return true;
    } else if (node.expired_type === GOT_EXPIRED && node.gotTimes <= node.expired_value) {
      return true;
    } else {
      return false;
    }
  }
  currentTime() {
    return new Date().getTime();
  }
}
const cached = new Cached();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,quasar_wrappers__WEBPACK_IMPORTED_MODULE_1__/* .boot */ .xr)(({
  app
}) => {
  app.config.globalProperties.$cached = cached;
}));


/***/ }),

/***/ 95490:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ src_i18n)
});

// EXTERNAL MODULE: ./node_modules/vue-i18n/dist/vue-i18n.esm-bundler.js + 5 modules
var vue_i18n_esm_bundler = __webpack_require__(15332);
;// CONCATENATED MODULE: ./src/i18n/th.js
/* harmony default export */ const th = ({
  error: {
    101: "ไม่พบแพลตฟอร์ม",
    102: "แพลตฟอร์มถูกปิด",
    104: "ไม่ใช่แพลตฟอร์มสำหรับการโอนเงิน",
    105: "ไม่พบเว็บไซต์",
    400: "คำขอไม่สำเร็จ",
    403: "ไม่อนุญาติ",
    405: "วิธีการไม่ได้รับอนุญาต",
    500: "ระบบขัดข้อง",
    501: "รหัสคําขอถูกใช้ไปแล้ว",
    502: "ไม่พบเซิร์ฟเวอร์นี้",
    504: "คำขอบ่อยเกินไป",
    601: "ข้อผิดพลาดในการตรวจสอบโทเค็น",
    603: "ไม่มีโทเคน",
    604: "เข้าระบบเรียบร้อยแล้ว",
    707: "ยอดเงินไม่เพียงพอ",
    800: "รหัสยืนยันไม่ถูกต้อง",
    801: "รหัสผ่านแคปช่าหมดอายุแล้ว",
    900: "ไม่พบรายชื่อสมาชิก",
    901: "ไม่พบบันทึก",
    902: "อีเมลไม่ตรงกับสมาชิกของเรา",
    903: "อีเมลไม่ตรงกับบัญชีที่ใช้สมัคร",
    904: "อีเมลยังไม่ได้รับการตรวจสอบ",
    905: "ยังไม่ได้ใส่ชื่อจริงของสมาชิก",
    1000: "ชื่อล็อกอินหรือรหัสผ่านเกิดข้อผิดพลาด",
    1001: "บัญชีถูกปิดการใช้งาน",
    1002: "บัญชีสำหรับการเป็นพันธมิตร",
    1300: "จํานวนเงินต้องเป็นตัวเลขและมากกว่า 0",
    1301: "ไม่รองรับการ์ดนี้",
    1302: "ไม่รองรับสกุลเงินนี้",
    1304: "หมายเลขนี้ถูกใช้งานไปแล้ว",
    1305: "ไม่พบธนาคารนี้",
    1306: "เกินขีดจํากัดเวลาถอนรายวัน",
    1307: "เกินขีดจํากัดการถอนรายวัน",
    1308: "ยอดเงินของคุณไม่เพียงพอ",
    1309: "บัญชีบัตรไม่ตรงกับชื่อสมาชิก",
    1401: "เกินกำหนดเวลาส่ง OTP",
    1402: "เกิดกำหนดการส่ง OTP กรุณาส่ง OTP อีกครั้ง",
    1403: "ข้อผิดพลาดการตรวจสอบ OTP",
    1404: "การส่งรหัส OTP ล้มเหลว",
    10000: "เกิดข้อผิดพลาดของยอดเงินคนเหลือ",
    10001: "เกิดข้อผิดพลาดในการถอน",
    10002: "เกิดข้อผิดพลาดในการฝากเงิน",
    10005: "ยูสเซอร์นี้ถูกใช้ไปแล้ว",
    10006: "ไม่สามารถใช้ชื่อนี้ได้",
    10007: "เกิดข้อผิดพลาดในการเข้าห้องเกม",
    10008: "เกิดข้อผิดพลาด",
    11003: "การเติมเงินไม่สำเร็จ",
    13000: "ไม่มีชื่อโดเมนอยู่",
    13001: "ไม่สามารถสอบถามข้อมูลที่มีอายุเกินกว่า 3 เดือน",
    13002: "ต้องไม่เกิน 7 วัน",
    13003: "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น",
    14000: "ชื่อล็อกอินนี้ได้ถูกลงทะเบียนไปแล้ว",
    14001: "หมายเลขโทรศัพท์นี้ได้ถูกลงทะเบียนไปแล้ว",
    14002: "อีเมลนี้ได้ถูกลงทะเบียนไปแล้ว",
    14003: "ไม่มีรหัสพันธมิตรอยู่",
    15201: "รหัสเดิมไม่ถูกต้อง",
    15202: "รหัสใหม่ต้องตรงกับรหัสเดิม",
    30000: "ไม่พบข้อมูลของสมาชิก",
    30001: "สมาชิกได้รับโปรโมชั่นไปแล้ว",
    30002: "วันนี้สมาชิกได้ส่งหมายเลขไปแล้ว",
    30003: "ยอดสมาชิกไม่ตรงตามข้อกำหนด",
    30004: "เงินฝากสมาชิกไม่ตรงตามข้อกําหนด",
    30005: "เทิร์นโอเวอร์ยังไม่ครบตามข้อกําหนด",
    30006: "สมาชิกถูกขึ้นรายชื่อเป็นบัญชีต้องห้ามรับสิทธิ์พิเศษนี้",
    31000: "ไม่มีโปรโมชั่นนี้",
    32000: "ไม่มีระดับวีไอพีนี้",
    33000: "ต้องใช้หมายเลข 3 หลัก",
    33001: "ต้องเป็นหมายเลข 3 หลัก",
    34000: "วันเกิดของสมาชิกไม่ได้อยู่ในเดือนนี้",
    34001: "ไม่พบวันเกิดของสมาชิก",
    35000: "สมาชิกไม่สามารถรับสิทธิ์นี้ได้",
    35001: "สมาชิกได้รับสิทธิ์นี้ไปแล้ว",
    35002: "ไม่พบสิทธิพิเศษที่สามารถรับได้",
    35003: "สิทธิพิเศษและสมาชิกไม่ตรงกัน"
    // 34000: "เดือนเกิดของสมาชิกไม่ใช่เดือนนี้",
    // 35000: "สมาชิกไม่สามารถรับสิทธิ์ได้",
    // 35001: "สมาชิกได้รับสิทธิ์นี้ไปแล้ว",
  }
});
;// CONCATENATED MODULE: ./src/i18n/index.js


const i18n = (0,vue_i18n_esm_bundler/* createI18n */.o)({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "th",
  // allowComposition: true,
  messages: {
    th: th
  },
  globalInjection: true
});
/* harmony default export */ const src_i18n = (i18n);

/***/ }),

/***/ 23053:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "H": () => (/* binding */ userStore)
/* harmony export */ });
/* harmony import */ var pinia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(22858);
/* harmony import */ var boot_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31249);
/* harmony import */ var quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38126);
/* harmony import */ var quasar_src_plugins_Notify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6827);
/* harmony import */ var quasar_src_plugins_Platform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(47506);



var qs = __webpack_require__(51470);
const TOKEN_KEY = "TOKEN";
const userStore = (0,pinia__WEBPACK_IMPORTED_MODULE_4__/* .defineStore */ .Q_)("userStore", {
  state: () => {
    return {
      id: 0,
      nickName: "",
      realName: "",
      birthday: "",
      phone: "",
      email: "",
      memberType: "",
      balance: 0,
      token: quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getItem */ .Z.getItem("TOKEN") || "",
      vip: "",
      currency: {
        value: "฿",
        label: "บาท"
      }
    };
  },
  actions: {
    hasToken() {
      return !!quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getItem */ .Z.getItem("TOKEN");
    },
    memberLogin(loginInfo) {
      const regDevice = quasar_src_plugins_Platform_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"].is.mobile */ .ZP.is.mobile ? "H5" : "WEB";
      loginInfo.way = regDevice;
      var string = qs.stringify(loginInfo);
      return boot_axios__WEBPACK_IMPORTED_MODULE_0__.api.post("/member/login", string).then(ret => {
        if (ret.data.code === 0) {
          quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].set */ .Z.set("TOKEN", ret.data.data);
        } else {
          quasar_src_plugins_Notify_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].create */ .Z.create({
            color: "negative",
            position: "top",
            message: ret.data.message,
            icon: "report_problem"
          });
        }
      });
    },
    getMemberInfo() {
      boot_axios__WEBPACK_IMPORTED_MODULE_0__.api.interceptors.request.use(async req => {
        const token = quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getItem */ .Z.getItem("TOKEN");
        req.headers.token = token;
        return req;
      });
      boot_axios__WEBPACK_IMPORTED_MODULE_0__.cashier.interceptors.request.use(async req => {
        const token = quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getItem */ .Z.getItem("TOKEN");
        req.headers.TOKEN = token;
        return req;
      });
      boot_axios__WEBPACK_IMPORTED_MODULE_0__.eventapi.interceptors.request.use(async req => {
        const token = quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getItem */ .Z.getItem("TOKEN");
        req.headers.TOKEN = token;
        return req;
      });
      return boot_axios__WEBPACK_IMPORTED_MODULE_0__.api.get("/session/member").then(res => {
        const ret = res.data;
        if (ret.code === 0) {
          this.id = ret.data.id;
          this.nickName = ret.data.loginName;
          this.realName = ret.data.realName;
          this.birthday = ret.data.birthday;
          this.email = ret.data.email;
          this.phone = ret.data.telephone;
          this.memberType = ret.data.memberType;
          this.vip = ret.data.vip;
        } else {
          this.memberLogout();
        }
      });
    },
    getBalance() {
      if (this.token) {
        boot_axios__WEBPACK_IMPORTED_MODULE_0__.api.get("/session/balance?v=123", {
          params: {
            platform: "MAIN"
          }
        }).then(ret => {
          const res = ret.data;
          if (res.code === 0) {
            this.balance = res.data;
          } else {
            this.balance = 0;
          }
        });
      }
    },
    memberLogout() {
      return boot_axios__WEBPACK_IMPORTED_MODULE_0__.api.post("/session/logout").then(() => quasar_src_plugins_SessionStorage_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].remove */ .Z.remove("TOKEN"));
    }
  }
});

/***/ }),

/***/ 24477:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": () => (/* binding */ useUI)
/* harmony export */ });
/* harmony import */ var pinia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22858);

const useUI = (0,pinia__WEBPACK_IMPORTED_MODULE_0__/* .defineStore */ .Q_)("ui-store", {
  state: () => {
    return {
      footer: true,
      orientation: 'landscape'
    };
  },
  actions: {
    setScrollPosition: (axis = "vertical", offset = 0, duration = 0) => null,
    hiddenFooter() {
      this.footer = false;
    },
    showFooter() {
      this.footer = true;
    },
    orientationPotrait() {
      this.orientation = 'portrait';
    },
    orientationLandscape() {
      this.orientation = 'landscape';
    }
  }
});

/***/ }),

/***/ 24654:
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "js/" + (chunkId === 64 ? "chunk-common" : chunkId) + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "css/" + ({"143":"app","736":"vendor"}[chunkId] || chunkId) + ".css";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "thai-project:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		var createStylesheet = (chunkId, fullhref, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// object to store loaded CSS chunks
/******/ 		var installedCssChunks = {
/******/ 			143: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.miniCss = (chunkId, promises) => {
/******/ 			var cssChunks = {"23":1,"108":1,"142":1,"145":1,"204":1,"219":1,"241":1,"255":1,"318":1,"375":1,"611":1,"613":1,"628":1,"679":1,"704":1,"714":1,"720":1,"725":1,"821":1,"828":1,"843":1,"887":1,"896":1};
/******/ 			if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);
/******/ 			else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {
/******/ 				promises.push(installedCssChunks[chunkId] = loadStylesheet(chunkId).then(() => {
/******/ 					installedCssChunks[chunkId] = 0;
/******/ 				}, (e) => {
/******/ 					delete installedCssChunks[chunkId];
/******/ 					throw e;
/******/ 				}));
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no hmr
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			143: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [736], () => (__webpack_require__(30097)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=app.js.map