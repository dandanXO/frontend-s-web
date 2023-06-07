(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[204],{

/***/ 72282:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ PokerView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/assets/images/games/liveCasino/live-bg.png
var live_bg = __webpack_require__(48957);
var live_bg_default = /*#__PURE__*/__webpack_require__.n(live_bg);
// EXTERNAL MODULE: ./src/components/modal/GameModal.vue + 2 modules
var GameModal = __webpack_require__(4678);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/games/PokerView.vue?vue&type=script&setup=true&lang=js


const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-76b41533"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = {
  class: "poker-container"
};
const _hoisted_2 = {
  class: "section-product"
};
const _hoisted_3 = {
  class: "item-group",
  "data-aos": "slide-down",
  "data-aos-easing": "ease-out",
  "data-aos-duration": "1000"
};
const _hoisted_4 = ["onClick"];
const _hoisted_5 = {
  class: "bgimg"
};
const _hoisted_6 = {
  class: "theme"
};
const _hoisted_7 = ["src"];
const _hoisted_8 = ["src"];
const _hoisted_9 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
  src: (live_bg_default())
}, null, -1));



/* harmony default export */ const PokerViewvue_type_script_setup_true_lang_js = ({
  __name: 'PokerView',
  setup(__props) {
    // import { loadPromoBanner } from "@/api/index/promo";
    const imgURL = "https://xinfa-files.s3.ap-southeast-1.amazonaws.com/game" + "/";
    const casinoGame = (0,reactivity_esm_bundler/* ref */.iH)(null);
    function playGame(gameName, platformCode, gameCode, gameStatus) {
      casinoGame.value.open(gameName, platformCode, gameCode, gameStatus);
    }
    // const banner = ref([]);

    // const loadBanner = () => {
    //   api
    //     .get("/promo/banner", {
    //       params: {
    //         category: "LIVE"
    //       }
    //     })
    //     .then((ret) => {
    //       const res = ret.data;
    //       if (res.code === 0) {
    //         banner.value = res.data[0];
    //       }
    //     });
    // };
    const pokerGames = [{
      code: "JILI",
      name: "Jili Games",
      status: "NORMAL",
      gameName: "Jili",
      gameCode: "64",
      bg: __webpack_require__(37223),
      main: __webpack_require__(73678),
      logo: __webpack_require__(51667)
    }, {
      code: "RICH88",
      name: "Rich88",
      status: "NORMAL",
      gameName: "Rich88",
      bg: __webpack_require__(28107),
      main: __webpack_require__(19558),
      logo: __webpack_require__(18989)
    }, {
      code: "KM",
      name: "KM",
      status: "NORMAL",
      gameName: "KM",
      bg: __webpack_require__(61216),
      main: __webpack_require__(84858),
      logo: __webpack_require__(81701)
    }];
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {});
    return (_ctx, _cache) => {
      const _component_q_intersection = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-intersection");
      const _component_q_scroll_area = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-scroll-area");
      return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_scroll_area, {
        style: {
          "height": "100vh",
          "padding-bottom": "10px"
        },
        "thumb-style": {
          width: 0
        }
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_intersection, {
          transition: "scale"
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(pokerGames, (p, index) => {
            return (0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
              key: index,
              class: "set aos-init aos-animate",
              "data-aos": "fade-up"
            }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
              class: "items",
              onClick: $event => playGame(p.name, p.code, p.gameCode, p.status)
            }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
              src: p.bg,
              alt: ""
            }, null, 8, _hoisted_7), (0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
              class: "logo",
              style: (0,shared_esm_bundler/* normalizeStyle */.j5)(p.name === 'KM' ? 'max-height: 5%; bottom: 15%; left: -5%;' : ''),
              src: p.logo
            }, null, 12, _hoisted_8)])])], 8, _hoisted_4)]);
          }), 64))]), (0,runtime_core_esm_bundler/* createVNode */.Wm)((0,reactivity_esm_bundler/* unref */.SU)(GameModal/* default */.Z), {
            ref_key: "casinoGame",
            ref: casinoGame
          }, null, 512)]), _hoisted_9]),
          _: 1
        })]),
        _: 1
      })]);
    };
  }
});
;// CONCATENATED MODULE: ./src/pages/games/PokerView.vue?vue&type=script&setup=true&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/scroll-area/QScrollArea.js
var QScrollArea = __webpack_require__(66663);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/intersection/QIntersection.js
var QIntersection = __webpack_require__(30875);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/games/PokerView.vue



;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(PokerViewvue_type_script_setup_true_lang_js, [['__scopeId',"data-v-76b41533"]])

/* harmony default export */ const PokerView = (__exports__);
;


runtime_auto_import_default()(PokerViewvue_type_script_setup_true_lang_js, 'components', {QScrollArea: QScrollArea/* default */.Z,QIntersection: QIntersection/* default */.Z});


/***/ }),

/***/ 37223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/jili.c160016d.png";

/***/ }),

/***/ 61216:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/kingmaker.3e792435.png";

/***/ }),

/***/ 28107:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/rich88.ade21157.png";

/***/ })

}]);
//# sourceMappingURL=204.js.map