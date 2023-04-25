"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[628],{

/***/ 67628:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ E_SportView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(61957);
// EXTERNAL MODULE: ./src/stores/index.js
var stores = __webpack_require__(23053);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/games/E-SportView.vue?vue&type=script&setup=true&lang=js

const _withScopeId = n => (_pushScopeId("data-v-21356aa0"), n = n(), _popScopeId(), n);
const _hoisted_1 = {
  class: "esport-container"
};
const _hoisted_2 = ["src"];




/* harmony default export */ const E_SportViewvue_type_script_setup_true_lang_js = ({
  __name: 'E-SportView',
  setup(__props) {
    const $q = (0,use_quasar/* default */.Z)();
    let src = (0,reactivity_esm_bundler/* ref */.iH)("");
    const store = (0,stores/* userStore */.H)();
    const logoShow = (0,reactivity_esm_bundler/* ref */.iH)(true);
    const loadGame = () => {
      if (src.value !== "") {
        logoShow.value = false;
      }
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      $q.loading.show({
        message: "Loading Page"
      });
      if (store.token) {
        const isMobile = Platform/* default.is.mobile */.ZP.is.mobile;
        // launchSessionGame("TFGaming").then((ret) => {
        //   src.value = ret.data;
        // });
        axios.api.get(`/session/launch?_time=${new Date().getTime()}`, {
          params: {
            platform: "TFGaming",
            gameCode: null,
            isMobile: isMobile
          }
        }).then(ret => {
          const res = ret.data;
          if (res.code === 0) {
            src.value = res.data;
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: res.message,
            //   icon: "report_problem"
            // });
          }
          $q.loading.hide();
        });
      } else {
        axios.api.get(`/session/launch`, {
          params: {
            platform: "TFGaming",
            gameCode: null,
            isMobile: isMobile
          }
        }).then(ret => {
          const res = ret.data;
          src.value = res.data;
        });
      }
      //  else {
      //   launchGame("TFGaming").then((ret) => {
      //     src.value = ret.data;
      //   });
      // }
    });

    return (_ctx, _cache) => {
      const _component_q_scroll_area = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-scroll-area");
      return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_q_scroll_area, {
        style: {
          "height": "90vh"
        }
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createElementVNode */._)("iframe", {
          onLoad: _cache[0] || (_cache[0] = $event => loadGame()),
          src: (0,reactivity_esm_bundler/* unref */.SU)(src),
          id: "esportsForm",
          allowfullscreen: "true",
          scrolling: "no",
          frameborder: "0",
          class: "esports-iframe animate__animated animate__fadeIn"
        }, null, 40, _hoisted_2), [[runtime_dom_esm_bundler/* vShow */.F8, !logoShow.value]])])]),
        _: 1
      });
    };
  }
});
;// CONCATENATED MODULE: ./src/pages/games/E-SportView.vue?vue&type=script&setup=true&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/scroll-area/QScrollArea.js
var QScrollArea = __webpack_require__(66663);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/games/E-SportView.vue



;



const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(E_SportViewvue_type_script_setup_true_lang_js, [['__scopeId',"data-v-21356aa0"]])

/* harmony default export */ const E_SportView = (__exports__);
;

runtime_auto_import_default()(E_SportViewvue_type_script_setup_true_lang_js, 'components', {QScrollArea: QScrollArea/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=628.js.map