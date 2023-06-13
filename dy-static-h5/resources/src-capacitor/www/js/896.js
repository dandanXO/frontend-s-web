"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[896],{

/***/ 99896:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ LoginPage)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(61957);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/LoginPage.vue?vue&type=template&id=2556d8ff

const _hoisted_1 = {
  class: "page-header q-mb-md"
};
const _hoisted_2 = {
  class: "page"
};
const _hoisted_3 = {
  class: "row justify-between items-center"
};
const _hoisted_4 = {
  class: "txt-center"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_icon = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-icon");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_router_link = (0,runtime_core_esm_bundler/* resolveComponent */.up)("router-link");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.header), 1)]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
    class: "q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
      ref: "loginNameRef",
      filled: "",
      modelValue: _ctx.loginForm.loginName,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.loginForm.loginName = $event),
      label: "ชื่อล็อกอิน",
      rules: [val => val && val.length > 0 || 'ใส่ชื่อผู้ใช้'],
      color: "white",
      autocomplete: "username"
    }, {
      prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
        name: "person_outline"
      })]),
      _: 1
    }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
      ref: "passwordRef",
      filled: "",
      modelValue: _ctx.loginForm.password,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.loginForm.password = $event),
      label: "รหัสผ่าน",
      type: _ctx.isPwd ? 'password' : 'text',
      rules: [val => val && val.length > 0 || 'ใส่รหัสผ่าน'],
      color: "white",
      autocomplete: "current-password"
    }, {
      prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
        name: "lock_open"
      })]),
      append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
        name: _ctx.isPwd ? 'visibility_off' : 'visibility',
        class: "cursor-pointer",
        onClick: _cache[1] || (_cache[1] = $event => _ctx.isPwd = !_ctx.isPwd)
      }, null, 8, ["name"])]),
      _: 1
    }, 8, ["modelValue", "type", "rules"]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_router_link, {
      class: "forget-pwd-tip",
      to: "/forgot-password"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" ลืมรหัสผ่าน? ")]),
      _: 1
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
      onClick: (0,runtime_dom_esm_bundler/* withModifiers */.iM)(_ctx.onSubmit, ["prevent"]),
      label: "ล็อกอินตอนนี้",
      type: "submit",
      color: "brand"
    }, null, 8, ["onClick"])])]),
    _: 1
  }), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_4, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_router_link, {
    class: "forget-pwd-tip",
    to: "/register"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" ยังไม่ได้เข้าร่วม Jolly88? ลงทะเบียนตอนนี้ ")]),
    _: 1
  })])], 64);
}
;// CONCATENATED MODULE: ./src/pages/LoginPage.vue?vue&type=template&id=2556d8ff

// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/stores/index.js
var stores = __webpack_require__(23053);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/LoginPage.vue?vue&type=script&lang=js





/* harmony default export */ const LoginPagevue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "LoginPage",
  setup() {
    const store = (0,stores/* userStore */.H)();
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      // getCode();
    });
    const verificationImg = (0,reactivity_esm_bundler/* ref */.iH)("");
    const loginForm = (0,reactivity_esm_bundler/* reactive */.qj)({
      loginName: "",
      password: "",
      // captchaCode: "",
      codeId: ""
    });
    const $q = (0,use_quasar/* default */.Z)();
    const loginNameRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const passwordRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const verificationRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const router = (0,vue_router/* useRouter */.tv)();
    const route = (0,vue_router/* useRoute */.yj)();
    // const getCode = () => {
    //   api
    //     .get("/member/verificationCode")
    //     .then((res) => {
    //       const response = res.data;
    //       if (response.code === 0) {
    //         verificationImg.value =
    //           "data:image/png;base64," + response.data.img;
    //         loginForm.codeId = response.data.id;
    //       }
    //     })
    //     .catch((e) => {
    //       // $q.notify({
    //       //   color: "negative",
    //       //   position: "top",
    //       //   message: res.data.message,
    //       //   icon: "report_problem"
    //       // });
    //     });
    // };

    const onSubmit = () => {
      loginNameRef.value.validate();
      passwordRef.value.validate();
      // verificationRef.value.validate();
      $q.loading.show({
        message: "การตรวจสอบการเข้าสู่ระบบ"
      });
      if (loginNameRef.value.hasError || passwordRef.value.hasError) {
        $q.loading.hide();
      } else {
        store.memberLogin({
          loginName: loginForm.loginName,
          password: loginForm.password
          // captchaCode: loginForm.captchaCode,
          // codeId: loginForm.codeId
        }).then(() => {
          $q.loading.hide();

          // getCode();
          if (store.hasToken()) {
            const jumpUrl = route.query.redirect ? route.query.redirect : "/";
            router.go(jumpUrl);
            if (Platform/* default.is.capacitor */.ZP.is.capacitor && Platform/* default.is.ios */.ZP.is.ios) {
              location.reload();
            }
          }
        }).catch(error => {
          // loginForm.captchaCode ="";
          // getCode();
          $q.loading.hide();
        });
      }
    };
    return {
      header: "ล็อกอิน",
      loginNameRef,
      passwordRef,
      verificationRef,
      verificationImg,
      loginForm,
      onSubmit,
      store,
      isPwd: (0,reactivity_esm_bundler/* ref */.iH)(true)
      // getCode
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/LoginPage.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/form/QForm.js
var QForm = __webpack_require__(8326);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/input/QInput.js + 2 modules
var QInput = __webpack_require__(66611);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/icon/QIcon.js
var QIcon = __webpack_require__(22857);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/btn/QBtn.js
var QBtn = __webpack_require__(68879);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/field/QField.js
var QField = __webpack_require__(18149);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/LoginPage.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(LoginPagevue_type_script_lang_js, [['render',render]])

/* harmony default export */ const LoginPage = (__exports__);
;





runtime_auto_import_default()(LoginPagevue_type_script_lang_js, 'components', {QForm: QForm/* default */.Z,QInput: QInput/* default */.Z,QIcon: QIcon/* default */.Z,QBtn: QBtn/* default */.Z,QField: QField/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=896.js.map