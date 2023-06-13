"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[679],{

/***/ 29679:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ ShareView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/ShareView.vue?vue&type=template&id=58c913e2&scoped=true

const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-58c913e2"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "menu-title-container"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
  class: "menu-title"
}, "แชร์")], -1));
const _hoisted_2 = {
  class: "share-wrapper"
};
const _hoisted_3 = {
  class: "sharing-container"
};
const _hoisted_4 = {
  class: "qr-container"
};
const _hoisted_5 = {
  class: "right-container"
};
const _hoisted_6 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "share-content"
}, " รับโบนัสทุกวัน โบนัสไม่มีวันหมดอายุ ง่ายๆเพียงแค่แชร์ QR Codeหรือลิงค์ให้เพื่อน รับโบนัสไปเลยเมื่อเพื่อนลงทะเบียนหรือดาวน์โหลด ", -1));
const _hoisted_7 = {
  class: "share-link-wrapper"
};
const _hoisted_8 = {
  class: "otherlinks"
};
const _hoisted_9 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
  class: "note"
}, "หมายเหตุ: โบนัสเชิญของท่านยังไม่มีการแชร์", -1));
const _hoisted_10 = {
  class: "links"
};
const _hoisted_11 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, null, -1));
function render(_ctx, _cache) {
  const _component_VueQRCodeComponent = (0,runtime_core_esm_bundler/* resolveComponent */.up)("VueQRCodeComponent");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_RiFacebookCircleLine = (0,runtime_core_esm_bundler/* resolveComponent */.up)("RiFacebookCircleLine");
  const _component_RiWhatsappLine = (0,runtime_core_esm_bundler/* resolveComponent */.up)("RiWhatsappLine");
  const _component_RiTelegramLine = (0,runtime_core_esm_bundler/* resolveComponent */.up)("RiTelegramLine");
  const _component_RiTwitterLine = (0,runtime_core_esm_bundler/* resolveComponent */.up)("RiTwitterLine");
  const _component_RiInstagramLine = (0,runtime_core_esm_bundler/* resolveComponent */.up)("RiInstagramLine");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", null, [_hoisted_1, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_4, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_VueQRCodeComponent, {
    size: "150",
    text: _ctx.referralLink
  }, null, 8, ["text"])]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_5, [_hoisted_6, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_7, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
    style: {
      "width": "100%"
    },
    filled: "",
    color: "white",
    ref: "copyinput",
    modelValue: _ctx.referralLink,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.referralLink = $event),
    onBlur: _ctx.blurCode
  }, null, 8, ["modelValue", "onBlur"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
    color: "brand",
    class: "common-btn copy-btn",
    onBlur: _ctx.blurCode,
    onClick: _ctx.copyCode
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.copybtntxt), 1)]),
    _: 1
  }, 8, ["onBlur", "onClick"])])])]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_8, [_hoisted_9, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_10, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_RiFacebookCircleLine), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_RiWhatsappLine), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_RiTelegramLine), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_RiTwitterLine), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_RiInstagramLine)])])]), _hoisted_11]);
}
;// CONCATENATED MODULE: ./src/pages/ShareView.vue?vue&type=template&id=58c913e2&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./node_modules/vue-remix-icons/dist/vue-remix-icons.es.js
var vue_remix_icons_es = __webpack_require__(5253);
// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__(43878);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/vue-qrcode-component/src/QRCode.vue + 3 modules
var QRCode = __webpack_require__(727);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/ShareView.vue?vue&type=script&lang=js






/* harmony default export */ const ShareViewvue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "ShareView",
  components: {
    RiFacebookCircleLine: vue_remix_icons_es/* RiFacebookCircleLine */.SpX,
    RiWhatsappLine: vue_remix_icons_es/* RiWhatsappLine */.nmQ,
    RiTelegramLine: vue_remix_icons_es/* RiTelegramLine */.EPM,
    RiTwitterLine: vue_remix_icons_es/* RiTwitterLine */.HSY,
    RiInstagramLine: vue_remix_icons_es/* RiInstagramLine */.Adh,
    VueQRCodeComponent: QRCode/* default */.Z
  },
  setup() {
    const searchForm = (0,reactivity_esm_bundler/* reactive */.qj)({
      date: moment_default()('2022-03-03', 'YYYY-MM-DD')
    });
    const referralLink = (0,reactivity_esm_bundler/* ref */.iH)('');
    const copybtntxt = (0,reactivity_esm_bundler/* ref */.iH)("คัดลอก");
    const copyinput = (0,reactivity_esm_bundler/* ref */.iH)(null);
    const copyCode = () => {
      const copyText = copyinput.value;
      copyText.select();
      document.execCommand("copy");
      copybtntxt.value = 'คัดลอกแล้ว';
    };
    const blurCode = () => {
      copybtntxt.value = 'คัดลอก';
    };
    // const columns = [
    //   {
    //     title: "ชื่อ",
    //     dataIndex: "name",
    //     key: "name",
    //   },
    //   {
    //     title: "ฝาก",
    //     dataIndex: "deposit",
    //     key: "deposit",
    //   },
    // ];
    const getReferral = () => {
      axios.api.get('/session/member/referralCode').then(ret => {
        const res = ret.data;
        if (res.code === 0) {
          referralLink.value = `https://mth.jolly88.com/refer/${res.data}`;
        }
      }).catch(err => {});
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      getReferral();
    });
    return {
      searchForm,
      copybtntxt,
      copyinput,
      copyCode,
      blurCode,
      referralLink,
      VueQRCodeComponent: QRCode/* default */.Z
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/ShareView.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/input/QInput.js + 2 modules
var QInput = __webpack_require__(66611);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/btn/QBtn.js
var QBtn = __webpack_require__(68879);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/ShareView.vue




;



const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(ShareViewvue_type_script_lang_js, [['render',render],['__scopeId',"data-v-58c913e2"]])

/* harmony default export */ const ShareView = (__exports__);
;


runtime_auto_import_default()(ShareViewvue_type_script_lang_js, 'components', {QInput: QInput/* default */.Z,QBtn: QBtn/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=679.js.map