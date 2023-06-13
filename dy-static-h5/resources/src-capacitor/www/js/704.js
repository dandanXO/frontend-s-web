"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[704],{

/***/ 65704:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ sportFrameView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
// EXTERNAL MODULE: ./src/stores/index.js
var stores = __webpack_require__(23053);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/games/sportFrameView.vue?vue&type=script&setup=true&lang=js

const _withScopeId = n => (_pushScopeId("data-v-647be714"), n = n(), _popScopeId(), n);
const _hoisted_1 = ["src"];





/* harmony default export */ const sportFrameViewvue_type_script_setup_true_lang_js = ({
  __name: 'sportFrameView',
  setup(__props) {
    const $q = (0,use_quasar/* default */.Z)();
    const router = (0,vue_router/* useRouter */.tv)();
    const route = (0,vue_router/* useRoute */.yj)();
    let src = (0,reactivity_esm_bundler/* ref */.iH)("");
    const store = (0,stores/* userStore */.H)();
    const loadGame = () => {
      if (src.value !== "") {
        $q.loading.hide();
      }
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      $q.loading.show({
        message: "Loading Page"
      });
      if (store.hasToken()) {
        const isMobile = Platform/* default.is.mobile */.ZP.is.mobile;
        if (isMobile) {
          var way = null;
          if (Platform/* default.is.android */.ZP.is.android) {
            way = "ANDROID";
          } else if (Platform/* default.is.ios */.ZP.is.ios) {
            way = "IOS";
          }
        }
        axios.api.get(`/session/launch?_time=${new Date().getTime()}`, {
          params: {
            platform: "SABA",
            isMobile: isMobile,
            way: way
          }
        }).then(ret => {
          const res = ret.data;
          if (res.code === 0) {
            src.value = res.data;
          } else {}
          $q.loading.hide();
        });
      }
    });
    return (_ctx, _cache) => {
      const _component_q_page = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-page");
      return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_q_page, null, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("iframe", {
          onLoad: _cache[0] || (_cache[0] = $event => loadGame()),
          src: (0,reactivity_esm_bundler/* unref */.SU)(src),
          frameborder: "0"
        }, null, 40, _hoisted_1)]),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./src/pages/games/sportFrameView.vue?vue&type=script&setup=true&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/page/QPage.js
var QPage = __webpack_require__(69885);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/games/sportFrameView.vue



;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(sportFrameViewvue_type_script_setup_true_lang_js, [['__scopeId',"data-v-647be714"]])

/* harmony default export */ const sportFrameView = (__exports__);
;

runtime_auto_import_default()(sportFrameViewvue_type_script_setup_true_lang_js, 'components', {QPage: QPage/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=704.js.map