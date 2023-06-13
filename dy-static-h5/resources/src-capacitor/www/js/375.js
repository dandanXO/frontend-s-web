"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[375],{

/***/ 90032:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ AviatorView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/games/AviatorView.vue?vue&type=template&id=7ddf7600&scoped=true

const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-7ddf7600"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = {
  class: "fishing-container"
};
const _hoisted_2 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createStaticVNode */.uE)("<div class=\"bubbles\" data-v-7ddf7600><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div><div class=\"bubble\" data-v-7ddf7600></div></div>", 1);
const _hoisted_3 = {
  class: "margin-center game-container"
};
const _hoisted_4 = {
  class: "all-game-container"
};
const _hoisted_5 = {
  class: "plat-type-container"
};
const _hoisted_6 = {
  class: "plat-list"
};
const _hoisted_7 = ["onClick"];
const _hoisted_8 = ["src"];
const _hoisted_9 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "grid-items flex-box flex-align-center search-container web-only-box"
}, null, -1));
const _hoisted_10 = {
  key: 0,
  class: "loading-div"
};
const _hoisted_11 = {
  class: "grid fishing"
};
const _hoisted_12 = ["onClick"];
const _hoisted_13 = {
  class: "slot-img"
};
const _hoisted_14 = ["src", "alt"];
const _hoisted_15 = {
  class: "slot-name"
};
const _hoisted_16 = {
  class: "slide"
};
const _hoisted_17 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("svg", {
  class: "waves",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  viewBox: "0 24 150 28",
  preserveAspectRatio: "none",
  "shape-rendering": "auto"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("defs", null, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("path", {
  id: "gentle-wave",
  d: "M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
})]), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("g", {
  class: "parallax"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("use", {
  "xlink:href": "#gentle-wave",
  x: "48",
  y: "0",
  fill: "rgba(36,71,100,0.7"
}), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("use", {
  "xlink:href": "#gentle-wave",
  x: "48",
  y: "3",
  fill: "rgba(36,71,100,0.5)"
}), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("use", {
  "xlink:href": "#gentle-wave",
  x: "48",
  y: "5",
  fill: "rgba(36,71,100,0.3)"
}), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("use", {
  "xlink:href": "#gentle-wave",
  x: "48",
  y: "7",
  fill: "#244764"
})])])], -1));
function render(_ctx, _cache) {
  const _component_q_spinner_hourglass = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-spinner-hourglass");
  const _component_q_intersection = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-intersection");
  const _component_BacktoTop = (0,runtime_core_esm_bundler/* resolveComponent */.up)("BacktoTop");
  const _component_q_scroll_observer = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-scroll-observer");
  const _component_q_scroll_area = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-scroll-area");
  const _component_GameModal = (0,runtime_core_esm_bundler/* resolveComponent */.up)("GameModal");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_1, [_hoisted_2, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_6, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.platforms, p => {
    return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C_)(["plat-item", {
        active: p.id === _ctx.selectedPlatId
      }]),
      key: p,
      onClick: $event => _ctx.switchPlat(p)
    }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
      src: __webpack_require__(70178)("./" + p.code + ".png")
    }, null, 8, _hoisted_8)], 10, _hoisted_7);
  }), 128))])]), _hoisted_9, (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_scroll_area, {
    ref: "scrollPageRef",
    style: {
      "height": "calc(100vh - 265px)"
    },
    "thumb-style": {
      width: 0
    }
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [_ctx.isLoading ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_10, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_spinner_hourglass, {
      color: "deep-orange",
      size: "8em"
    })])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_intersection, {
      transition: "scale"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_11, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.gameListData, game => {
        return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
          class: "game-slot",
          key: game.id,
          onClick: $event => _ctx.fishGame.open(game.name, _ctx.selectedPlat.code, game.code, _ctx.selectedPlat.status)
        }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_13, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
          class: "box",
          style: (0,shared_esm_bundler/* normalizeStyle */.j5)([{
            "display": "flex",
            "justify-content": "center"
          }, `background: url(${game.default})no-repeat center center; background-size: cover`])
        }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
          src: game.icon,
          alt: game.default,
          style: {
            "height": "150px",
            "left": "-50px"
          }
        }, null, 8, _hoisted_14)], 4)]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_15, [(0,runtime_core_esm_bundler/* createElementVNode */._)("span", _hoisted_16, (0,shared_esm_bundler/* toDisplayString */.zw)(game.name), 1)])], 8, _hoisted_12);
      }), 128))])]),
      _: 1
    }), _ctx.scrollPosition.top > 400 ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_BacktoTop, {
      key: 1,
      onClick: _ctx.scrollToTop
    }, null, 8, ["onClick"])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_scroll_observer, {
      onScroll: _ctx.scrolling
    }, null, 8, ["onScroll"])]),
    _: 1
  }, 512)])]), _hoisted_17]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_GameModal, {
    ref: "fishGame"
  }, null, 512)], 64);
}
;// CONCATENATED MODULE: ./src/pages/games/AviatorView.vue?vue&type=template&id=7ddf7600&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(46727);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/components/modal/GameModal.vue + 2 modules
var GameModal = __webpack_require__(4678);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./src/boot/cache.js
var cache = __webpack_require__(53393);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
// EXTERNAL MODULE: ./src/components/backtotop.vue + 3 modules
var backtotop = __webpack_require__(49503);
// EXTERNAL MODULE: ./node_modules/quasar/src/utils/scroll.js
var utils_scroll = __webpack_require__(43701);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/games/AviatorView.vue?vue&type=script&lang=js


// import { getPlatformGames, getPlatformList } from "@/api/platform/platform";

// import { message } from "ant-design-vue";
// import { loadPromoBanner } from "@/api/index/promo";






/* harmony default export */ const AviatorViewvue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  components: {
    GameModal: GameModal/* default */.Z,
    BacktoTop: backtotop/* default */.Z
  },
  setup() {
    const $q = (0,use_quasar/* default */.Z)();
    const route = (0,vue_router/* useRoute */.yj)();
    const platforms = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const selectedPlatId = (0,reactivity_esm_bundler/* ref */.iH)();
    const selectedPlat = (0,reactivity_esm_bundler/* ref */.iH)(platforms.value[0]);
    const fishGame = (0,reactivity_esm_bundler/* ref */.iH)(null);
    const gameListData = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const isLoading = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const gamePage = (0,reactivity_esm_bundler/* reactive */.qj)({
      gameList: []
    });
    const switchPlat = plat => {
      selectedPlat.value = plat;
      selectedPlatId.value = plat.id;
      loadGameList();
    };
    const getPlatList = () => {
      isLoading.value = true;
      cache.cached.get("PLATFORMS", () => axios.api.get("/platform").then(res => {
        const response = res.data;
        return response;
      })).then(data => {
        isLoading.value = false;
        platforms.value = data.filter(element => element.gameType.includes("FISH"));
        platforms.value.forEach((e, i) => {
          if (e.code === 'AWS') {
            platforms.value.splice(i, 1);
          }
        });
        if (!route.query.plat) {
          switchPlat(platforms.value[0]);
        } else {
          platforms.value.forEach(element => {
            if (parseInt(route.query.plat) === element.id) {
              switchPlat(element);
            }
          });
        }
      }).catch(err => {
        isLoading.value = false;
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "Loading failed",
        //   icon: "report_problem"
        // });
      });
    };

    const isShowBtt = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const {
      getScrollTarget,
      getVerticalScrollPosition,
      setVerticalScrollPosition
    } = utils_scroll/* default */.ZP;
    const scrollPosition = (0,reactivity_esm_bundler/* ref */.iH)(0);
    const scrolling = e => {
      scrollPosition.value = e.position;
      if (e.position.top > 400) {
        isShowBtt.value = true;
      }
    };
    const scrollPageRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const position = (0,reactivity_esm_bundler/* ref */.iH)(0);
    const scrollToTop = el => {
      scrollPageRef.value.setScrollPosition('vertical', position);
      isShowBtt.value = false;
    };
    const loadGameList = () => {
      isLoading.value = true;
      const regDevice = Platform/* default.is.mobile */.ZP.is.mobile ? "MOBILE" : "WEB";
      var way = null;
      if (Platform/* default.is.android */.ZP.is.android) {
        way = "ANDROID";
      } else if (Platform/* default.is.ios */.ZP.is.ios) {
        way = "IOS";
      }
      const code = selectedPlatId.value;
      const gameType = "FISH";
      const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
      cache.cached.get(key, () => axios.api.get("/platformGames", {
        params: {
          platformId: code,
          gameType: gameType,
          device: regDevice,
          way: way
        }
      }).then(ret => {
        isLoading.value = false;
        const res = ret.data;
        if (res.code === 0) {
          return res;
        }
      }).catch(err => {
        isLoading.value = false;
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "Loading failed",
        //   icon: "report_problem"
        // });
      })).then(res => {
        isLoading.value = false;
        res.forEach(element => {
          element.default = __webpack_require__(47419);
          element.icon = `${"https://himalayas.fantasticemedia.com/images"}/fish/${selectedPlat.value.code}/${element.icon}.png`;
        });
        gameListData.value = res;
      });
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      getPlatList();
    });
    return {
      platforms,
      selectedPlatId,
      selectedPlat,
      switchPlat,
      loadGameList,
      fishGame,
      gameListData,
      scrolling,
      isShowBtt,
      scrollPageRef,
      scrollToTop,
      scroll: utils_scroll/* default */.ZP,
      scrollPosition,
      isLoading
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/games/AviatorView.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/scroll-area/QScrollArea.js
var QScrollArea = __webpack_require__(66663);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/spinner/QSpinnerHourglass.js
var QSpinnerHourglass = __webpack_require__(96335);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/intersection/QIntersection.js
var QIntersection = __webpack_require__(30875);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/img/QImg.js + 1 modules
var QImg = __webpack_require__(70335);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/scroll-observer/QScrollObserver.js
var QScrollObserver = __webpack_require__(71868);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/games/AviatorView.vue




;



const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(AviatorViewvue_type_script_lang_js, [['render',render],['__scopeId',"data-v-7ddf7600"]])

/* harmony default export */ const AviatorView = (__exports__);
;





runtime_auto_import_default()(AviatorViewvue_type_script_lang_js, 'components', {QScrollArea: QScrollArea/* default */.Z,QSpinnerHourglass: QSpinnerHourglass/* default */.Z,QIntersection: QIntersection/* default */.Z,QImg: QImg/* default */.Z,QScrollObserver: QScrollObserver/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=375.js.map