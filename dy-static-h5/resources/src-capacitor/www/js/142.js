(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[142],{

/***/ 78142:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ WelcomePage)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./src/assets/welcome/logo.png
var logo = __webpack_require__(27760);
var logo_default = /*#__PURE__*/__webpack_require__.n(logo);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/WelcomePage.vue?vue&type=template&id=3438a13c&scoped=true


const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-3438a13c"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = {
  class: "welcome-page"
};
const _hoisted_2 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "logo"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
  src: (logo_default())
})], -1));
const _hoisted_3 = {
  class: "promotionlist"
};
const _hoisted_4 = ["onClick", "src"];
const _hoisted_5 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "slogan"
}, " www.jolly88.com   |   Casino Online and Slot Game Betting ", -1));
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = (0,runtime_core_esm_bundler/* resolveComponent */.up)("router-link");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_1, [_hoisted_2, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(4, i => {
    return (0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
      key: i
    }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
      onClick: $event => _ctx.checkPromo(i),
      src: __webpack_require__(9574)(`./promo-${i}.png`)
    }, null, 8, _hoisted_4)]);
  }), 64))]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_router_link, {
    to: "/register"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" สมัคร ")]),
    _: 1
  }), _hoisted_5]);
}
;// CONCATENATED MODULE: ./src/pages/WelcomePage.vue?vue&type=template&id=3438a13c&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69665);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/WelcomePage.vue?vue&type=script&lang=js



/* harmony default export */ const WelcomePagevue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  setup() {
    const router = (0,vue_router/* useRouter */.tv)();
    const promoId = (0,reactivity_esm_bundler/* ref */.iH)(null);
    const checkPromo = promo => {
      if (promo === 1) {
        promoId.value = 29;
      }
      if (promo === 2) {
        promoId.value = 28;
      }
      if (promo === 3) {
        promoId.value = 31;
      }
      if (promo === 4) {
        promoId.value = 30;
      }
      router.push(`/promo?id=${promoId.value}`);
    };
    return {
      router,
      checkPromo
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/WelcomePage.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
;// CONCATENATED MODULE: ./src/pages/WelcomePage.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(WelcomePagevue_type_script_lang_js, [['render',render],['__scopeId',"data-v-3438a13c"]])

/* harmony default export */ const WelcomePage = (__exports__);

/***/ }),

/***/ 27760:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/logo.4cdca162.png";

/***/ }),

/***/ 79049:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/promo-1.ab5da127.png";

/***/ }),

/***/ 81222:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/promo-2.7bcc6521.png";

/***/ }),

/***/ 52808:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/promo-3.3ab9cdb0.png";

/***/ }),

/***/ 30429:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/promo-4.2496e8f7.png";

/***/ }),

/***/ 9574:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./promo-1.png": 79049,
	"./promo-2.png": 81222,
	"./promo-3.png": 52808,
	"./promo-4.png": 30429
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 9574;

/***/ })

}]);
//# sourceMappingURL=142.js.map