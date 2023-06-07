(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[342],{

/***/ 17157:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ LiveCasinoView)
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
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/games/LiveCasinoView.vue?vue&type=script&setup=true&lang=js


const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-077375d1"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = {
  class: "live-container"
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



/* harmony default export */ const LiveCasinoViewvue_type_script_setup_true_lang_js = ({
  __name: 'LiveCasinoView',
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
    const hotTrendingGames = [{
      code: "Evo",
      name: "Evolution",
      gameName: "EVO",
      bg: __webpack_require__(56588),
      main: __webpack_require__(64577),
      logo: __webpack_require__(24125),
      text: "In the Evolution live casino, there are the world's first 6-card start, VIP tables, badge baccarat, intelligent control baccarat waiting for you to enjoy non-stop."
    },
    // {
    //   code: "AWC",
    //   name: "AG Sexy",
    //   gameName: "AE Sexy",
    //   gameCode: "MX-LIVE-001",
    //   bg: require("../../assets/images/games/liveCasino/sexy.png"),
    //   main: require("../../assets/images/games/liveCasino/live2_01.png"),
    //   logo: require("../../assets/images/common/logo/ae_2.png"),
    //   text: "AE Casino, Asia's most potential live-action video. The interface is simple and easy to operate, cross-platform, download-free, and fun anytime, anywhere!"
    // },
    // {
    //   code: "EZUGI",
    //   name: "Ezugi",
    //   gameName: "Ezugi",
    //   bg: require("../../assets/images/games/liveCasino/ezugi.png"),
    //   main: require("../../assets/images/games/liveCasino/live3_01.png"),
    //   logo: require("../../assets/images/common/logo/ezugi.png"),
    //   text: "The EZUGI entertainment platform with hundreds of well-trained professional dealers, bring you just like real casino experience."
    // },
    // {
    //   code: "SA",
    //   name: "SA gaming",
    //   gameName: "SA",
    //   bg: require("../../assets/images/games/liveCasino/sa.png"),
    //   main: require("../../assets/images/games/liveCasino/live4_01.png"),
    //   logo: require("../../assets/images/common/logo/SA.png"),
    //   text: "SA Gaming has been committed to creating a mobile entertainment platform with both gameplay and creativity."
    // }
    {
      code: "AWC",
      name: "AE Sexy",
      status: "NORMAL",
      gameName: "AE Sexy",
      gameCode: "MX-LIVE-001",
      bg: __webpack_require__(1383),
      main: __webpack_require__(25840),
      logo: __webpack_require__(63193),
      text: "วิดีโอไลฟ์แอ็กชันที่มีศักยภาพสูงสุดในเอเชียผลิตภัณฑ์เกมคุณภาพสูง และวิดีโอเกมที่หลากหลาย การเชื่อมต่อข้ามแพลตฟอร์มที่ง่ายดาย ทำให้คุณสนุกได้ทุกที่ทุกเวลา!"
    }, {
      code: "WM",
      name: "WM Casino",
      gameName: "WM",
      status: "NORMAL",
      bg: __webpack_require__(53262),
      main: __webpack_require__(68041),
      logo: __webpack_require__(8850),
      text: "AE Casino วิดีโอไลฟ์แอ็กชันที่มีศักยภาพมากที่สุดในเอเชีย เชื่อมต่อและใช้งานง่าย ข้ามแพลตฟอร์ม ฟรีดาวน์โหลด และสนุกได้ทุกที่ทุกเวลา!"
    }, {
      code: "SA",
      name: "SA gaming",
      gameName: "SA",
      status: "NORMAL",
      bg: __webpack_require__(20450),
      main: __webpack_require__(48072),
      logo: __webpack_require__(96047),
      text: "แพลตฟอร์มความบันเทิง EZUGI ที่มีดีลเลอร์มืออาชีพที่ผ่านการฝึกอบรมมาอย่างดีหลายร้อยคน มอบประสบการณ์คาสิโนที่แท้จริงให้กับคุณ"
    }];
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {});
    return (_ctx, _cache) => {
      const _component_q_intersection = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-intersection");
      const _component_q_scroll_area = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-scroll-area");
      return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_scroll_area, {
        style: {
          "height": "calc(100vh - 90px)",
          "padding-bottom": "10px"
        },
        "thumb-style": {
          width: 0
        }
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_intersection, {
          transition: "scale"
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(hotTrendingGames, (p, index) => {
            return (0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
              key: index,
              class: "set aos-init aos-animate",
              "data-aos": "fade-up"
            }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
              class: "items",
              onClick: $event => playGame(p.name, p.code, p.gameCode)
            }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
              src: p.bg,
              alt: ""
            }, null, 8, _hoisted_7), (0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
              class: "logo",
              style: (0,shared_esm_bundler/* normalizeStyle */.j5)(p.name === 'Evolution' ? 'max-height:15px; bottom: 12%;' : ''),
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
;// CONCATENATED MODULE: ./src/pages/games/LiveCasinoView.vue?vue&type=script&setup=true&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/scroll-area/QScrollArea.js
var QScrollArea = __webpack_require__(66663);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/intersection/QIntersection.js
var QIntersection = __webpack_require__(30875);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/games/LiveCasinoView.vue



;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(LiveCasinoViewvue_type_script_setup_true_lang_js, [['__scopeId',"data-v-077375d1"]])

/* harmony default export */ const LiveCasinoView = (__exports__);
;


runtime_auto_import_default()(LiveCasinoViewvue_type_script_setup_true_lang_js, 'components', {QScrollArea: QScrollArea/* default */.Z,QIntersection: QIntersection/* default */.Z});


/***/ }),

/***/ 96047:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/SA.fc9b6243.png";

/***/ }),

/***/ 8850:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/WM.c3b2268c.png";

/***/ }),

/***/ 24125:
/***/ ((module) => {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 1383:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/evo.660382e6.png";

/***/ }),

/***/ 20450:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/ezugi.7aec7c62.png";

/***/ }),

/***/ 64577:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/live1_1.c42691a3.png";

/***/ }),

/***/ 25840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/live4_01.c9c5a3cc.png";

/***/ }),

/***/ 56588:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/sa.09a455d4.png";

/***/ }),

/***/ 53262:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/sexy.e0c77706.png";

/***/ })

}]);
//# sourceMappingURL=342.js.map