"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[255],{

/***/ 12255:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ LiveChatPage)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/LiveChatPage.vue?vue&type=template&id=bf50e308&scoped=true

const _withScopeId = n => (_pushScopeId("data-v-bf50e308"), n = n(), _popScopeId(), n);
const _hoisted_1 = ["src"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_page = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-page");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_q_page, null, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("iframe", {
      src: 'https://csweb01.amv4xjcbd.com/?partnerId=5&lang=th&way=' + _ctx.regDevice + '&token=' + _ctx.store.token,
      title: "description"
    }, null, 8, _hoisted_1)]),
    _: 1
  });
}
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./src/stores/index.js
var stores = __webpack_require__(23053);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/LiveChatPage.vue?vue&type=script&lang=js



/* harmony default export */ const LiveChatPagevue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  setup() {
    const $q = (0,use_quasar/* default */.Z)();
    const store = (0,stores/* userStore */.H)();
    const regDevice = Platform/* default.is.mobile */.ZP.is.mobile ? "H5" : "WEB";
    return {
      regDevice,
      store
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/LiveChatPage.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/page/QPage.js
var QPage = __webpack_require__(69885);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/LiveChatPage.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(LiveChatPagevue_type_script_lang_js, [['render',render],['__scopeId',"data-v-bf50e308"]])

/* harmony default export */ const LiveChatPage = (__exports__);
;

runtime_auto_import_default()(LiveChatPagevue_type_script_lang_js, 'components', {QPage: QPage/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=255.js.map