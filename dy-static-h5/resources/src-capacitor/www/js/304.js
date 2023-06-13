"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[304],{

/***/ 32318:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ SlotView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(61957);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/games/SlotView.vue?vue&type=template&id=7120e860&scoped=true

const _withScopeId = n => (_pushScopeId("data-v-7120e860"), n = n(), _popScopeId(), n);
const _hoisted_1 = {
  key: 0,
  class: "loading-div"
};
const _hoisted_2 = {
  class: "pageitem"
};
const _hoisted_3 = {
  class: "topbar"
};
const _hoisted_4 = {
  class: "bookmarks"
};
const _hoisted_5 = ["onClick"];
const _hoisted_6 = ["src"];
const _hoisted_7 = {
  class: "slideProgress",
  style: {
    "width": "30px",
    "height": "3px",
    "border-radius": "30px",
    "position": "relative",
    "background": "#000422",
    "margin": "0 auto 10px",
    "overflow": "hidden"
  }
};
const _hoisted_8 = {
  class: "grid",
  style: {
    "padding-bottom": "20px"
  }
};
const _hoisted_9 = ["data-id", "onClick"];
const _hoisted_10 = {
  class: "slot-name"
};
const _hoisted_11 = ["src"];
function render(_ctx, _cache) {
  const _component_q_spinner_hourglass = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-spinner-hourglass");
  const _component_q_scroll_observer = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-scroll-observer");
  const _component_q_scroll_area = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-scroll-area");
  const _component_q_img = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-img");
  const _component_q_list = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-list");
  const _component_BacktoTop = (0,runtime_core_esm_bundler/* resolveComponent */.up)("BacktoTop");
  const _component_GameModal = (0,runtime_core_esm_bundler/* resolveComponent */.up)("GameModal");
  const _component_q_page = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-page");
  const _directive_intersection = (0,runtime_core_esm_bundler/* resolveDirective */.Q2)("intersection");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_q_page, null, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [_ctx.isLoading ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_spinner_hourglass, {
      color: "deep-orange",
      size: "8em"
    })])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_scroll_area, {
      style: {
        "height": "80px"
      }
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_4, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.platforms, p => {
        return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
          class: (0,shared_esm_bundler/* normalizeClass */.C_)(["plat-item", {
            active: p.id === _ctx.selectedPlatId
          }]),
          key: p,
          onClick: $event => _ctx.switchPlat(p)
        }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
          src: __webpack_require__(70178)("./" + p.code + ".png")
        }, null, 8, _hoisted_6)], 10, _hoisted_5);
      }), 128))]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_scroll_observer, {
        axis: "horizontal",
        onScroll: _ctx.onScroll
      }, null, 8, ["onScroll"])]),
      _: 1
    }), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
      class: "position",
      style: (0,shared_esm_bundler/* normalizeStyle */.j5)('width: 8px; position: absolute; height: 100%; background: #ffffff; left: ' + _ctx.scrollInfo + '%;')
    }, null, 4)])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_scroll_area, {
      ref: "scrollSlotRef",
      style: {
        "height": "calc(100% - 110px)"
      }
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_8, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.gamePage.gameList, (game, index) => {
        return (0,runtime_core_esm_bundler/* withDirectives */.wy)(((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
          key: index,
          "data-id": index,
          onClick: $event => _ctx.openGame(game.name, game.code, _ctx.selectedPlat.status),
          style: {
            "height": "140px"
          }
        }, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(runtime_dom_esm_bundler/* Transition */.uT, {
          name: "in-view"
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_list, {
            class: "q-col-gutter-none"
          }, {
            default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_img, {
              loading: "lazy",
              src: game.icon,
              "placeholder-src": game.default,
              fit: "cover",
              height: "140px",
              "spinner-color": "white",
              position: "50% 20%",
              style: {
                "border-radius": "20px",
                "overflow": "hidden"
              },
              imgClass: _ctx.selectedPlat.code === 'PG' ? 'zoomin' : ''
            }, {
              loading: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
                src: game.default,
                style: {
                  "width": "100%",
                  "height": "140px",
                  "border-radius": "15px",
                  "overflow": "hidden"
                }
              }, null, 8, _hoisted_11)]),
              default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_10, (0,shared_esm_bundler/* toDisplayString */.zw)(game.name), 1)]),
              _: 2
            }, 1032, ["src", "placeholder-src", "imgClass"])]),
            _: 2
          }, 1024)]),
          _: 2
        }, 1024)], 8, _hoisted_9)), [[_directive_intersection, _ctx.onIntersection]]);
      }), 128))]), _ctx.scrollPosition.top > 400 ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_BacktoTop, {
        key: 0,
        onClick: _ctx.scrollToTop
      }, null, 8, ["onClick"])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_scroll_observer, {
        onScroll: _ctx.scrolling
      }, null, 8, ["onScroll"])]),
      _: 1
    }, 512)]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_GameModal, {
      ref: "slotsGame"
    }, null, 512)]),
    _: 1
  });
}
;// CONCATENATED MODULE: ./src/pages/games/SlotView.vue?vue&type=template&id=7120e860&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(46727);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/components/modal/GameModal.vue + 2 modules
var GameModal = __webpack_require__(4678);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./src/boot/cache.js
var cache = __webpack_require__(53393);
// EXTERNAL MODULE: ./src/stores/ui.js
var ui = __webpack_require__(24477);
// EXTERNAL MODULE: ./src/components/backtotop.vue + 3 modules
var backtotop = __webpack_require__(49503);
// EXTERNAL MODULE: ./node_modules/quasar/src/utils/scroll.js
var utils_scroll = __webpack_require__(43701);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/SessionStorage.js
var SessionStorage = __webpack_require__(38126);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/games/SlotView.vue?vue&type=script&lang=js










const qs = __webpack_require__(51470);
/* harmony default export */ const SlotViewvue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  components: {
    GameModal: GameModal/* default */.Z,
    BacktoTop: backtotop/* default */.Z
  },
  setup() {
    const $q = (0,use_quasar/* default */.Z)();
    const route = (0,vue_router/* useRoute */.yj)();
    const slotsGame = (0,reactivity_esm_bundler/* ref */.iH)(null);
    const jpNumber = "123,456,789.88";
    const platforms = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const selectedPlatId = (0,reactivity_esm_bundler/* ref */.iH)();
    const selectedPlat = (0,reactivity_esm_bundler/* ref */.iH)(platforms.value[0]);
    const gamePage = (0,reactivity_esm_bundler/* reactive */.qj)({
      gameList: [],
      currentPage: 1,
      pageSize: 40,
      searchType: "",
      searchKey: "",
      total: 0
    });
    const gameListData = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const isLoading = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const scrollInfo = (0,reactivity_esm_bundler/* ref */.iH)({});
    const switchPlat = plat => {
      isLoading.value = true;
      scrollSlotRef.value.setScrollPosition('vertical', 0);
      selectedPlat.value = plat;
      selectedPlatId.value = plat.id;
      loadGameList();
      gamePage.searchKey = "";
    };
    const getPlatList = () => {
      cache.cached.get("PLATFORMS", () => axios.api.get("/platform").then(res => {
        const response = res.data;
        return response;
      })).then(data => {
        platforms.value = data.filter(element => element.gameType.includes("SLOT"));
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

    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter(game => {
          return game.name.toLowerCase().includes(gamePage.searchKey.toLowerCase());
        });
      } else {
        changePage(1, gamePage.pageSize);
      }
    };
    const loadGameList = () => {
      const regDevice = Platform/* default.is.mobile */.ZP.is.mobile ? "MOBILE" : "WEB";
      const code = selectedPlatId.value;
      const gameType = "SLOT";
      const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
      var way = null;
      if (Platform/* default.is.android */.ZP.is.android) {
        way = "ANDROID";
      } else if (Platform/* default.is.ios */.ZP.is.ios) {
        way = "IOS";
      }
      cache.cached.get(key, () => axios.api.get("/platformGames", {
        params: {
          platformId: code,
          gameType: gameType,
          device: regDevice,
          way: way
        }
      }).then(ret => {
        const res = ret.data;
        if (res.code === 0) {
          isLoading.value = false;
          return res;
        }
      }).catch(err => {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "Loading failed",
        //   icon: "report_problem"
        // });
      })).then(res => {
        res.forEach(element => {
          element.default = __webpack_require__(47419);
          element.icon = `${"https://himalayas.fantasticemedia.com/images"}/slot/${selectedPlat.value.code}/${element.icon}.png`;
        });
        gameListData.value = res;
        isLoading.value = false;
        // res.forEach(element => {
        //   console.log(gameListData.value[0].)
        //   if (!gameListData.value[0] || !gameListData.value[0].icon) {
        //   }
        // });
        gamePage.total = res.length;
        changePage(1, gamePage.pageSize);
      });
    };
    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value;

      // gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
    };

    const onShowSizeChange = (current, size) => {
      current = 1;
      gamePage.currentPage = 1;
      changePage(current, size);
    };
    const openGame = (gameName, gameCode, gameStatus) => {
      slotsGame.value.open(gameName, selectedPlat.value.code, gameCode, gameStatus);
    };
    const isShowBtt = (0,reactivity_esm_bundler/* ref */.iH)(false);
    // const scrolling = (e) => {
    //   const clientHeight = e.verticalContainerSize
    //   const scrollHeight = e.verticalSize
    //   const scrollTop = e.verticalPosition
    //   console.log(e)
    //   e.ref.setScrollPosition('y', 50, 300)
    //   if (e.verticalPosition > 90) {
    //     isShowBtt.value = true
    //   } else {
    //     isShowBtt.value = false
    //   }
    //   if (scrollTop + clientHeight >= scrollHeight) {
    //     console.log('Yay!')
    //   } else {
    //     console.log('scrolling?')
    //   }

    //   }

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
    const scrollSlotRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const position = (0,reactivity_esm_bundler/* ref */.iH)(0);
    const scrollToTop = el => {
      scrollSlotRef.value.setScrollPosition('vertical', position);
      isShowBtt.value = false;
      // const target = getScrollTarget(el[0])
      // const duration = 1000
      // console.log(target)
    };

    const onIntersection = entry => {
      // if (entry.isIntersecting === true) {
      //   add(entry.target.dataset.id)
      // }
      // else {
      //   remove(entry.target.dataset.id)
      // }
    };

    // function add (i) {
    //   remove(i)
    //   console.log(i)
    //   gamePage.gameList.findIndex(obj => {
    //     obj.hello = i
    //   })
    // }

    // function remove (i) {
    //   // let index
    //   // while ((index = inView.value.indexOf(i)) > -1) {
    //   //   splice(index, 1)
    //   // }
    //   // gamePage.gameList.findIndex(obj => {
    //   //   if (obj.hello === i) {
    //   //     gamePage.gameList.splice(obj, 1)
    //   //   }
    //   // })
    // }
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      getPlatList();
    });
    return {
      jpNumber,
      platforms,
      selectedPlatId,
      selectedPlat,
      switchPlat,
      gamePage,
      openGame,
      loadGameList,
      changePage,
      searchList,
      gameListData,
      onShowSizeChange,
      slotsGame,
      scrolling,
      isShowBtt,
      scrollSlotRef,
      scrollToTop,
      scroll: utils_scroll/* default */.ZP,
      scrollPosition,
      isLoading,
      scrollInfo,
      onIntersection,
      onScroll(info) {
        scrollInfo.value = info.position.left / platforms.value.length + 8;
        // scrollInfo.value = (info.position.left / 100) * 50
        // scrollInfo.value = 50 / 100 * info.position.left / 10
      }
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/games/SlotView.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/page/QPage.js
var QPage = __webpack_require__(69885);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/spinner/QSpinnerHourglass.js
var QSpinnerHourglass = __webpack_require__(96335);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/scroll-area/QScrollArea.js
var QScrollArea = __webpack_require__(66663);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/scroll-observer/QScrollObserver.js
var QScrollObserver = __webpack_require__(71868);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/item/QList.js
var QList = __webpack_require__(13246);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/img/QImg.js + 1 modules
var QImg = __webpack_require__(70335);
// EXTERNAL MODULE: ./node_modules/quasar/src/directives/Intersection.js
var Intersection = __webpack_require__(79205);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/games/SlotView.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(SlotViewvue_type_script_lang_js, [['render',render],['__scopeId',"data-v-7120e860"]])

/* harmony default export */ const SlotView = (__exports__);
;






runtime_auto_import_default()(SlotViewvue_type_script_lang_js, 'components', {QPage: QPage/* default */.Z,QSpinnerHourglass: QSpinnerHourglass/* default */.Z,QScrollArea: QScrollArea/* default */.Z,QScrollObserver: QScrollObserver/* default */.Z,QList: QList/* default */.Z,QImg: QImg/* default */.Z});runtime_auto_import_default()(SlotViewvue_type_script_lang_js, 'directives', {Intersection: Intersection/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=304.js.map