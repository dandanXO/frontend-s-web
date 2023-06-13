"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[992],{

/***/ 95992:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ ForgotPwdPage)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(61957);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/ForgotPwdPage.vue?vue&type=template&id=001e21e8

const _hoisted_1 = {
  class: "page-header"
};
const _hoisted_2 = {
  class: "page"
};
const _hoisted_3 = {
  class: "q-pa-md"
};
const _hoisted_4 = {
  class: "q-gutter-y-md"
};
const _hoisted_5 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "white q-px-md"
}, " รับบัญชีทางอีเมลล์ ", -1);
const _hoisted_6 = ["src"];
const _hoisted_7 = {
  class: "row justify-between items-center"
};
const _hoisted_8 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("p", null, "รหัส OTP ถูกส่งไปยังอีเมล์ของคุณแล้ว กรุณาใส่รหัส OTP และพาสเวิรด์ใหม่", -1);
const _hoisted_9 = ["src"];
const _hoisted_10 = {
  class: "row justify-between items-center"
};
const _hoisted_11 = {
  class: "text-center q-mb-md"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_icon = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-icon");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  const _component_q_card = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-card");
  const _component_router_link = (0,runtime_core_esm_bundler/* resolveComponent */.up)("router-link");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.header), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_4, [_hoisted_5, (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_card, null, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [!_ctx.isEmailSent ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_q_form, {
      key: 0,
      class: "q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
        ref: "loginNameRef",
        filled: "",
        modelValue: _ctx.passwordForm.loginName,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.passwordForm.loginName = $event),
        label: "ชื่อล็อกอิน",
        "lazy-rules": "",
        rules: [val => val && val.length > 0 || 'ใส่ชื่อผู้ใช้'],
        color: "white"
      }, {
        prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
          name: "person_outline"
        })]),
        _: 1
      }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
        ref: "emailRef",
        type: "email",
        filled: "",
        modelValue: _ctx.passwordForm.email,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.passwordForm.email = $event),
        label: "อีเมลล์",
        "lazy-rules": "",
        rules: [val => val && val.length > 0 || 'กรุณาใส่ที่อยู่อีเมลล์', _ctx.isValidEmail],
        color: "white"
      }, {
        prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
          name: "mail_outline"
        })]),
        _: 1
      }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
        ref: "ftCaptchaRef",
        filled: "",
        type: "text",
        modelValue: _ctx.passwordForm.captchaCode,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => _ctx.passwordForm.captchaCode = $event),
        label: "รหัสยืนยัน",
        "lazy-rules": "",
        color: "white",
        rules: [val => val && val.length > 3 || 'ใส่รหัสยืนยัน']
      }, {
        append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
          src: _ctx.verificationImg,
          onClick: _cache[2] || (_cache[2] = $event => _ctx.getCode())
        }, null, 8, _hoisted_6)]),
        prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
          name: "security"
        })]),
        _: 1
      }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_7, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
        onClick: (0,runtime_dom_esm_bundler/* withModifiers */.iM)(_ctx.onSubmitForgotPwd, ["prevent"]),
        label: "ส่ง",
        type: "submit",
        color: "brand"
      }, null, 8, ["onClick"])])]),
      _: 1
    })) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), _ctx.isEmailSent ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_q_form, {
      key: 1,
      class: "q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [_hoisted_8, (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
        ref: "codeRef",
        filled: "",
        modelValue: _ctx.verificationForm.code,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => _ctx.verificationForm.code = $event),
        label: "รหัส OTP",
        "lazy-rules": "",
        rules: [val => val && val.length > 0 || 'ใส่รหัส OTP'],
        color: "white"
      }, {
        prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
          name: "qr_code"
        })]),
        _: 1
      }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
        ref: "newPwdRef",
        type: "password",
        filled: "",
        modelValue: _ctx.verificationForm.newPassword,
        "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => _ctx.verificationForm.newPassword = $event),
        label: "รหัสผ่าน",
        "lazy-rules": "",
        rules: [val => val && val.length > 0 || 'ใส่รหัสผ่านใหม่'],
        color: "white"
      }, {
        prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
          name: "lock_open"
        })]),
        _: 1
      }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
        ref: "captchaRef",
        filled: "",
        type: "text",
        modelValue: _ctx.verificationForm.captchaCode,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => _ctx.verificationForm.captchaCode = $event),
        label: "รหัสยืนยัน",
        "lazy-rules": "",
        color: "white",
        rules: [val => val && val.length > 3 || 'ใส่รหัสยืนยัน']
      }, {
        append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
          src: _ctx.verificationImg,
          onClick: _cache[6] || (_cache[6] = $event => _ctx.getCode())
        }, null, 8, _hoisted_9)]),
        prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
          name: "security"
        })]),
        _: 1
      }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_10, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
        onClick: (0,runtime_dom_esm_bundler/* withModifiers */.iM)(_ctx.onVerifyForgotPassword, ["prevent"]),
        label: "ส่ง",
        type: "submit",
        color: "brand"
      }, null, 8, ["onClick"])])]),
      _: 1
    })) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)]),
    _: 1
  })])]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_11, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_router_link, {
    class: "forget-pwd-tip",
    to: "/login"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" กลับสู่เข้าสู่ระบบ ")]),
    _: 1
  })])], 64);
}
;// CONCATENATED MODULE: ./src/pages/ForgotPwdPage.vue?vue&type=template&id=001e21e8

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69665);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/SessionStorage.js
var SessionStorage = __webpack_require__(38126);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/ForgotPwdPage.vue?vue&type=script&lang=js






/* harmony default export */ const ForgotPwdPagevue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "LoginPage",
  setup() {
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      getCode();
    });
    const verificationImg = (0,reactivity_esm_bundler/* ref */.iH)("");
    const passwordForm = (0,reactivity_esm_bundler/* reactive */.qj)({
      loginName: "",
      email: "",
      captchaCode: ""
    });
    const verificationForm = (0,reactivity_esm_bundler/* reactive */.qj)({
      email: "",
      code: "",
      codeId: SessionStorage/* default.getItem */.Z.getItem('emailCodeId'),
      newPassword: ""
    });
    const activeTab = (0,reactivity_esm_bundler/* ref */.iH)("phone");
    const getCode = () => {
      axios.api.get("/member/verificationCode").then(res => {
        const response = res.data;
        if (response.code === 0) {
          verificationImg.value = "data:image/png;base64," + response.data.img;
          passwordForm.codeId = response.data.id;
        }
      }).catch(e => {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: e.message,
        //   icon: "report_problem"
        // });
      });
    };
    const loginNameRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const emailRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const ftCaptchaRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const codeRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const newPwdRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const captchaRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const $q = (0,use_quasar/* default */.Z)();
    const isValidEmail = () => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(passwordForm.email) || "อีเมลยังไม่มีการใช้งาน";
    };
    var qs = __webpack_require__(51470);
    const route = (0,vue_router/* useRoute */.yj)();
    const router = (0,vue_router/* useRouter */.tv)();
    const isEmailSent = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const isEmailSending = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const onSubmitForgotPwd = () => {
      loginNameRef.value.validate();
      emailRef.value.validate();
      ftCaptchaRef.value.validate();
      $q.loading.show({
        message: "กำลังตรวจสอบ"
      });
      if (loginNameRef.value.hasError || emailRef.value.hasError || ftCaptchaRef.value.hasError) {
        $q.loading.hide();
      } else {
        axios.api.post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm)).then(ret => {
          const res = ret.data;
          if (res.code === 0) {
            isEmailSent.value = true;
            SessionStorage/* default.set */.Z.set("emailCodeId", res.data.codeId);
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: res.message,
            //   icon: "report_problem"
            // });
          }
          $q.loading.hide();
        }).catch(error => {
          $q.loading.hide();
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });

        getCode();
      }
    };
    const onVerifyForgotPassword = () => {
      codeRef.value.validate();
      newPwdRef.value.validate();
      captchaRef.value.validate();
      $q.loading.show({
        message: "กำลังตรวจสอบ"
      });
      if (codeRef.value.hasError || newPwdRef.value.hasError || captchaRef.value.hasError) {
        $q.loading.hide();
      } else {
        verificationForm.codeId = SessionStorage/* default.getItem */.Z.getItem('emailCodeId');
        verificationForm.email = passwordForm.email;
        axios.api.post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm)).then(ret => {
          const res = ret.data;
          if (res.code === 0) {
            // $q.notify({
            //   color: "positive",
            //   position: "top",
            //   message: "สำเร็จ",
            //   icon: "check_circle_outline"
            // });
            router.push("/login");
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: res.message,
            //   icon: "report_problem"
            // });
          }
          $q.loading.hide();
        }).catch(error => {
          $q.loading.hide();
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });

        getCode();
      }
    };
    return {
      header: "ลืมรหัสผ่าน",
      passwordForm,
      verificationForm,
      verificationImg,
      activeTab,
      getCode,
      isValidEmail,
      isEmailSent,
      onSubmitForgotPwd,
      onVerifyForgotPassword,
      loginNameRef,
      emailRef,
      ftCaptchaRef,
      codeRef,
      newPwdRef,
      captchaRef
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/ForgotPwdPage.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/card/QCard.js
var QCard = __webpack_require__(44458);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/form/QForm.js
var QForm = __webpack_require__(8326);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/input/QInput.js + 2 modules
var QInput = __webpack_require__(66611);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/icon/QIcon.js
var QIcon = __webpack_require__(22857);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/btn/QBtn.js
var QBtn = __webpack_require__(68879);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/tabs/QTabs.js
var QTabs = __webpack_require__(47817);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/tabs/QTab.js
var QTab = __webpack_require__(57661);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/separator/QSeparator.js
var QSeparator = __webpack_require__(50926);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/tab-panels/QTabPanels.js
var QTabPanels = __webpack_require__(89800);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/tab-panels/QTabPanel.js
var QTabPanel = __webpack_require__(84106);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/ForgotPwdPage.vue




;
const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(ForgotPwdPagevue_type_script_lang_js, [['render',render]])

/* harmony default export */ const ForgotPwdPage = (__exports__);
;










runtime_auto_import_default()(ForgotPwdPagevue_type_script_lang_js, 'components', {QCard: QCard/* default */.Z,QForm: QForm/* default */.Z,QInput: QInput/* default */.Z,QIcon: QIcon/* default */.Z,QBtn: QBtn/* default */.Z,QTabs: QTabs/* default */.Z,QTab: QTab/* default */.Z,QSeparator: QSeparator/* default */.Z,QTabPanels: QTabPanels/* default */.Z,QTabPanel: QTabPanel/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=992.js.map