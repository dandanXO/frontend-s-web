"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[887],{

/***/ 6887:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RegisterPage)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(61957);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/RegisterPage.vue?vue&type=template&id=4d1c8a4d

const _hoisted_1 = {
  class: "page-header q-mb-md"
};
const _hoisted_2 = {
  class: "page"
};
const _hoisted_3 = {
  class: "q-gutter-y-md"
};
const _hoisted_4 = ["src"];
const _hoisted_5 = ["src"];
const _hoisted_6 = {
  class: "row justify-between items-center"
};
const _hoisted_7 = {
  class: "q-gutter-y-md"
};
const _hoisted_8 = {
  key: 0,
  class: "password-str-div"
};
const _hoisted_9 = {
  class: "row justify-between items-center"
};
const _hoisted_10 = {
  class: "text-center q-mb-md"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_icon = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-icon");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_q_select = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-select");
  const _component_q_item_section = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-item-section");
  const _component_q_item_label = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-item-label");
  const _component_q_item = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-item");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_step = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-step");
  const _component_q_stepper = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-stepper");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  const _component_router_link = (0,runtime_core_esm_bundler/* resolveComponent */.up)("router-link");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.header), 1)]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
    class: "q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md register-form",
    onSubmit: _ctx.onSubmit
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_stepper, {
      modelValue: _ctx.step,
      "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => _ctx.step = $event),
      ref: "stepper",
      "alternative-labels": "",
      color: "primary",
      animated: ""
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_step, {
        name: 1,
        title: "ข้อมูลธนาคาร",
        icon: "account_balance",
        done: _ctx.done1,
        color: "white"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("span", _hoisted_3, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          ref: "cardAccountNameRef",
          filled: "",
          modelValue: _ctx.regForm.cardAccountName,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.regForm.cardAccountName = $event),
          label: "ชื่อ - ตรงกับบัญชีธนาคาร",
          "lazy-rules": "",
          rules: [val => val && val.length > 0 || 'กรุณาใส่ชื่อบัญชีธนาคาร'],
          color: "white"
        }, {
          prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: "web"
          })]),
          _: 1
        }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          ref: "cardAccountSurnameRef",
          filled: "",
          modelValue: _ctx.regForm.cardAccountSurname,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.regForm.cardAccountSurname = $event),
          label: "นามสกุล - ตรงกับบัญชีธนาคาร",
          "lazy-rules": "",
          rules: [val => val && val.length > 0 || 'กรุณาใส่นามสกุลที่ตรงกับชื่อบัญชีธนาคาร'],
          color: "white"
        }, {
          prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: "web"
          })]),
          _: 1
        }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          ref: "cardNumberRef",
          filled: "",
          modelValue: _ctx.regForm.cardNumber,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.regForm.cardNumber = $event),
          label: "เลขบัญชี",
          "lazy-rules": "",
          rules: [val => val && val.length > 0 || 'กรุณาใส่เลขบัญชี', val => _ctx.validateBankLength(val)],
          color: "white"
        }, {
          prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: "credit_card"
          })]),
          _: 1
        }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_select, {
          modelValue: _ctx.selectedBankType,
          "onUpdate:modelValue": [_cache[3] || (_cache[3] = $event => _ctx.selectedBankType = $event), _cache[4] || (_cache[4] = $event => _ctx.selectBankType(_ctx.opt))],
          filled: "",
          options: [{
            name: 'Bank'
          }, {
            name: 'Crypto'
          }],
          label: "ช่องทางการถอน",
          color: "white",
          "label-color": "grey",
          "option-label": "name",
          "option-value": "name",
          "emit-value": "",
          "map-options": "",
          "label-slot": ""
        }, null, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_select, {
          ref: "bankCardRef",
          class: "q-mb-md",
          color: "white",
          filled: "",
          "label-color": "grey",
          modelValue: _ctx.regForm.bankId,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => _ctx.regForm.bankId = $event),
          options: _ctx.banksList,
          "option-value": "id",
          "option-label": "name",
          label: "เลือกธนาคาร (เพิ่มธนาคารต่างๆเข้าไป)",
          rules: [val => !!val || 'โปรดเลือกธนาคาร'],
          "lazy-rules": "",
          "emit-value": "",
          "map-options": "",
          "hide-dropdown-icon": ""
        }, {
          "selected-item": (0,runtime_core_esm_bundler/* withCtx */.w5)(scope => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_section, {
            avatar: ""
          }, {
            default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [scope.opt.bankIcon ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("img", {
              key: 0,
              style: {
                "width": "30px",
                "margin-top": "10px",
                "margin-bottom": "10px"
              },
              src: _ctx.imgURL + scope.opt.bankIcon
            }, null, 8, _hoisted_4)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)]),
            _: 2
          }, 1024), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_section, null, {
            default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_label, {
              style: {
                "text-overflow": "ellipsis",
                "overflow": "hidden",
                "white-space": "nowrap"
              }
            }, {
              default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)(scope.opt.name), 1)]),
              _: 2
            }, 1024)]),
            _: 2
          }, 1024)]),
          option: (0,runtime_core_esm_bundler/* withCtx */.w5)(scope => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item, (0,shared_esm_bundler/* normalizeProps */.vs)((0,runtime_core_esm_bundler/* guardReactiveProps */.F4)(scope.itemProps)), {
            default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_section, {
              avatar: ""
            }, {
              default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [scope.opt.bankIcon ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("img", {
                key: 0,
                style: {
                  "width": "30px"
                },
                src: _ctx.imgURL + scope.opt.bankIcon
              }, null, 8, _hoisted_5)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)]),
              _: 2
            }, 1024), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_section, null, {
              default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_label, null, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)(scope.opt.name), 1)]),
                _: 2
              }, 1024)]),
              _: 2
            }, 1024)]),
            _: 2
          }, 1040)]),
          _: 1
        }, 8, ["modelValue", "options", "rules"]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_6, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          onClick: (0,runtime_dom_esm_bundler/* withModifiers */.iM)(_ctx.onSubmit, ["prevent"]),
          label: "ลงทะเบียนตอนนี้",
          type: "text",
          color: "brand"
        }, null, 8, ["onClick"])])])]),
        _: 1
      }, 8, ["done"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_step, {
        name: 2,
        title: "ข้อมูลส่วนตัว",
        icon: "person",
        done: _ctx.done2,
        color: "white"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("span", _hoisted_7, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          ref: "loginNameRef",
          filled: "",
          modelValue: _ctx.regForm.loginName,
          "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => _ctx.regForm.loginName = $event),
          label: "ชื่อล็อกอิน",
          "lazy-rules": "",
          rules: [val => val && val.length > 0 || 'ใส่ชื่อผู้ใช้', val => val.length > 5 && val.length <= 12 || 'ชื่อที่ใช้ลงทะเบียน ควรมีพยัญชนะ 6-12 ตัว', val => val.match(/^[A-Za-z0-9]+$/) || 'อนุญาตเฉพาะตัวอักษรภาษาอังกฤษและตัวเลขเท่านั้น'],
          color: "white"
        }, {
          prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: "person_outline"
          })]),
          _: 1
        }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          ref: "pwdRef",
          filled: "",
          modelValue: _ctx.regForm.password,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => _ctx.regForm.password = $event),
          label: "รหัสผ่าน",
          "lazy-rules": "",
          type: _ctx.isPwd ? 'password' : 'text',
          rules: [val => val && val.length > 0 || 'ใส่รหัสผ่าน', val => val.length > 5 && val.length <= 12 || 'ความยาวของรหัสผ่านควรอยู่ระหว่าง 6-12', val => val && (_ctx.pwdStrength == 'normal' || _ctx.pwdStrength == 'strong') || 'ระดับความปลอดภัยของรหัสผ่านต้องอยู่ในเกณท์ดีเป็นอย่างน้อย'],
          color: "white"
        }, {
          prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: "lock_open"
          })]),
          append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: _ctx.isPwd ? 'visibility_off' : 'visibility',
            class: "cursor-pointer",
            onClick: _cache[7] || (_cache[7] = $event => _ctx.isPwd = !_ctx.isPwd)
          }, null, 8, ["name"])]),
          _: 1
        }, 8, ["modelValue", "type", "rules"]), _ctx.regForm.password ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_8, [(0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
          class: (0,shared_esm_bundler/* normalizeClass */.C_)({
            'weak-pwd': _ctx.pwdStrength == 'weak',
            'normal-pwd': _ctx.pwdStrength == 'normal',
            'strong-pwd': _ctx.pwdStrength == 'strong'
          })
        }, "อ่อน", 2), (0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
          class: (0,shared_esm_bundler/* normalizeClass */.C_)({
            'normal-pwd': _ctx.pwdStrength == 'normal',
            'strong-pwd': _ctx.pwdStrength == 'strong'
          })
        }, "ดี", 2), (0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
          class: (0,shared_esm_bundler/* normalizeClass */.C_)({
            'strong-pwd': _ctx.pwdStrength == 'strong'
          })
        }, "รัดกุม", 2)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          ref: "confirmPwdRef",
          filled: "",
          type: _ctx.isCfmPwd ? 'password' : 'text',
          modelValue: _ctx.regForm.confirmPwd,
          "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => _ctx.regForm.confirmPwd = $event),
          label: "ยืนยันรหัสผ่าน",
          "lazy-rules": "",
          rules: [val => val && val.length > 0 || 'กรุณายืนยันรหัสผ่าน', val => val === _ctx.regForm.password || 'รหัสผ่านไม่เหมือนกัน', val => val.length > 5 && val.length <= 12 || 'ความยาวของรหัสผ่านควรอยู่ระหว่าง 6-12'],
          color: "white"
        }, {
          prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: "lock_open"
          })]),
          append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: _ctx.isCfmPwd ? 'visibility_off' : 'visibility',
            class: "cursor-pointer",
            onClick: _cache[9] || (_cache[9] = $event => _ctx.isCfmPwd = !_ctx.isCfmPwd)
          }, null, 8, ["name"])]),
          _: 1
        }, 8, ["type", "modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          ref: "telRef",
          filled: "",
          modelValue: _ctx.regForm.telephone,
          "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => _ctx.regForm.telephone = $event),
          label: "เบอร์โทรศัพท์",
          "lazy-rules": "",
          rules: [val => val && val.length > 0 || 'กรุณายืนยันเบอร์โทรศัพท์', val => val && val.length > 7 || 'โปรดป้อนหมายเลขโทรศัพท์มือถือที่ถูกต้อง'],
          color: "white"
        }, {
          prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: "smartphone"
          })]),
          _: 1
        }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          ref: "codeAffiliate",
          filled: "",
          modelValue: _ctx.regForm.codeAffiliate,
          "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => _ctx.regForm.codeAffiliate = $event),
          label: "รหัสผู้แนะนำ",
          color: "white",
          disable: _ctx.hasAffiliate
        }, {
          prepend: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
            name: "security"
          })]),
          _: 1
        }, 8, ["modelValue", "disable"]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_9, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          onClick: _cache[13] || (_cache[13] = $event => _ctx.step = 1),
          color: "brand",
          label: "กลับ"
        }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          onClick: (0,runtime_dom_esm_bundler/* withModifiers */.iM)(_ctx.onSubmit, ["prevent"]),
          label: "ลงทะเบียนตอนนี้",
          type: "submit",
          color: "brand"
        }, null, 8, ["onClick"])])])]),
        _: 1
      }, 8, ["done"])]),
      _: 1
    }, 8, ["modelValue"])]),
    _: 1
  }, 8, ["onSubmit"]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_10, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_router_link, {
    class: "forget-pwd-tip",
    to: "/login"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" เป็นสมาชิกอยู่แล้วหรือยัง？เข้าสู่ระบบตอนนี้ ")]),
    _: 1
  })])], 64);
}
;// CONCATENATED MODULE: ./src/pages/RegisterPage.vue?vue&type=template&id=4d1c8a4d

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69665);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/RegisterPage.vue?vue&type=script&lang=js





/* harmony default export */ const RegisterPagevue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "RegisterPage",
  setup() {
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      getCode();
      getAffiliateCode();
      getReferralCode();
      axios.api.options(`/session/withdraw/banks?siteId=9`).then(ret => {
        const res = ret.data;
        if (res.code === 0) {
          bankCardModalState.banks.push(...res.data);
          selectBankType();
        }
      }).catch(e => {
        console.log("error", e);
      });
    });
    const step = (0,reactivity_esm_bundler/* ref */.iH)(1);
    const done1 = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const done2 = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const imgURL = "https://xinfa-files.s3.ap-southeast-1.amazonaws.com/game" + "/";
    const verificationImg = (0,reactivity_esm_bundler/* ref */.iH)("");
    const regForm = (0,reactivity_esm_bundler/* reactive */.qj)({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      // email: "",
      // captchaCode: "",
      codeAffiliate: "",
      cardAccountName: "",
      cardAccountSurname: "",
      regHost: location.hostname
      // codeId: ""
    });

    const getCode = () => {
      // api
      //   .get("/member/verificationCode")
      //   .then((res) => {
      //     const response = res.data;
      //     if (response.code === 0) {
      //       verificationImg.value =
      //         "data:image/png;base64," + response.data.img;
      //       regForm.codeId = response.data.id;
      //     }
      //   })
      //   .catch((e) => {
      //     // $q.notify({
      //     //   color: "negative",
      //     //   position: "top",
      //     //   message: e.message,
      //     //   icon: "report_problem"
      //     // });
      //   });
    };
    const loginNameRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const pwdRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const confirmPwdRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const telRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const emailRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const verificationRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const cardAccountNameRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const cardAccountSurnameRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const cardNumberRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const bankCardRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const $q = (0,use_quasar/* default */.Z)();
    const pwdStrength = (0,reactivity_esm_bundler/* ref */.iH)("");
    const isValidEmail = () => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || "อีเมลยังไม่มีการใช้งาน";
    };
    const router = (0,vue_router/* useRouter */.tv)();
    const onSubmit = () => {
      if (step.value === 1) {
        cardNumberRef.value.validate();
        cardAccountNameRef.value.validate();
        cardAccountSurnameRef.value.validate();
        bankCardRef.value.validate();
        if (cardNumberRef.value.hasError || cardAccountNameRef.value.hasError || cardAccountSurnameRef.value.hasError || bankCardRef.value.hasError) {
          $q.loading.hide();
        } else {
          step.value = 2;
          regForm.cardAccount = regForm.cardAccountName + '-' + regForm.cardAccountSurname;
        }
        return;
      }
      if (step.value === 2) {
        loginNameRef.value.validate();
        pwdRef.value.validate();
        confirmPwdRef.value.validate();
        telRef.value.validate();
        // emailRef.value.validate();
        // verificationRef.value.validate();
        $q.loading.show({
          message: "Registering"
        });
        var qs = __webpack_require__(51470);
        if (loginNameRef.value.hasError || pwdRef.value.hasError || confirmPwdRef.value.hasError || telRef.value.hasError
        // emailRef.value.hasError ||
        // verificationRef.value.hasError
        ) {
          $q.loading.hide();
        } else {
          const acctName = regForm.cardAccountName;
          const acctSurname = regForm.cardAccountSurname;
          delete regForm.cardAccountName;
          delete regForm.cardAccountSurname;
          regForm.regDevice = Platform/* default.is.mobile */.ZP.is.mobile ? "H5" : "WEB", axios.api.post("/member/register-with-bank-card", qs.stringify(regForm)).then(ret => {
            const res = ret.data;
            if (res.code === 0) {
              router.push("/login");
              $q.notify({
                color: "positive",
                position: "top",
                message: "ลงทะเบียนสำเร็จ",
                icon: "check_circle_outline"
              });
            } else {
              regForm.cardAccountName = acctName;
              regForm.cardAccountSurname = acctSurname;
            }
            $q.loading.hide();
          }).catch(error => {
            regForm.cardAccountName = acctName;
            regForm.cardAccountSurname = acctSurname;
            $q.loading.hide();
          });
          getCode();
        }
      }
    };
    (0,runtime_core_esm_bundler/* watch */.YP)(() => regForm.password, () => {
      pwdStrength.value = "";
      var pwd = regForm.password;
      var result = 0;
      for (var i = 0, len = pwd.length; i < len; ++i) {
        result |= charType(pwd.charCodeAt(i));
      }
      var level = 0;
      for (var i = 0; i <= 4; i++) {
        if (result & 1) {
          level++;
        }
        result = result >>> 1;
      }
      if (pwd.length >= 6) {
        switch (level) {
          case 1:
            pwdStrength.value = "weak";
            break;
          case 2:
            pwdStrength.value = "normal";
            break;
          case 3:
          case 4:
            pwdStrength.value = "strong";
            break;
        }
      } else {
        pwdStrength.value = "weak";
      }
    });
    const bankCardModalState = (0,reactivity_esm_bundler/* reactive */.qj)({
      visible: false,
      banks: []
    });
    const banksList = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const selectedBankType = (0,reactivity_esm_bundler/* ref */.iH)("Bank");
    const selectBankType = () => {
      regForm.bankId = "";
      banksList.value = [];
      bankCardModalState.banks.forEach(element => {
        if (selectedBankType.value === "Bank" && element.bankType === "BANK") {
          banksList.value.push(element);
        }
        if (selectedBankType.value === "Crypto" && element.bankType === "CRYPTO") {
          const isCrypto = (0,reactivity_esm_bundler/* ref */.iH)(true);
          banksList.value.push(element);
        }
        if (selectedBankType.value === "e-Wallet" && element.bankType === "EWALLET") {
          const isEWallet = (0,reactivity_esm_bundler/* ref */.iH)(true);
          banksList.value.push(element);
        }
      });
    };
    let validateBankLength = val => {
      if (selectedBankType.value === "Bank") {
        return val.length > 5 && val.length < 13 || "ความยาวควรเป็น 6 ถึง 12 ตัว";
      } else if (selectedBankType.value === "Crypto") {
        return val.length > 33 && val.length < 38 || "ความยาวควรเป็น 34 ถึง 37 ตัว";
      }
    };
    const hasAffiliate = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true;
        regForm.codeAffiliate = affCode;
      }
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        regForm.referrer = refCode;
      }
    };
    return {
      header: "ลงทะเบียนบัญชี",
      regForm,
      verificationImg,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      telRef,
      emailRef,
      verificationRef,
      cardNumberRef,
      cardAccountNameRef,
      cardAccountSurnameRef,
      bankCardRef,
      onSubmit,
      isValidEmail,
      isPwd: (0,reactivity_esm_bundler/* ref */.iH)(true),
      isCfmPwd: (0,reactivity_esm_bundler/* ref */.iH)(true),
      getCode,
      pwdStrength,
      selectBankType,
      selectedBankType,
      validateBankLength,
      banksList,
      imgURL,
      step,
      done1,
      done2,
      hasAffiliate,
      getAffiliateCode,
      getReferralCode
    };
  }
}));
function charType(num) {
  if (num >= 48 && num <= 57) {
    return 1;
  }
  if (num >= 97 && num <= 122) {
    return 2;
  }
  if (num >= 65 && num <= 90) {
    return 4;
  }
  return 8;
}
;// CONCATENATED MODULE: ./src/pages/RegisterPage.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/form/QForm.js
var QForm = __webpack_require__(8326);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/stepper/QStepper.js
var QStepper = __webpack_require__(8225);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/stepper/QStep.js
var QStep = __webpack_require__(46017);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/input/QInput.js + 2 modules
var QInput = __webpack_require__(66611);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/icon/QIcon.js
var QIcon = __webpack_require__(22857);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/select/QSelect.js + 1 modules
var QSelect = __webpack_require__(4581);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/item/QItemSection.js
var QItemSection = __webpack_require__(76749);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/item/QItemLabel.js
var QItemLabel = __webpack_require__(33115);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/item/QItem.js
var QItem = __webpack_require__(490);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/btn/QBtn.js
var QBtn = __webpack_require__(68879);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/field/QField.js
var QField = __webpack_require__(18149);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/RegisterPage.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(RegisterPagevue_type_script_lang_js, [['render',render]])

/* harmony default export */ const RegisterPage = (__exports__);
;











runtime_auto_import_default()(RegisterPagevue_type_script_lang_js, 'components', {QForm: QForm/* default */.Z,QStepper: QStepper/* default */.Z,QStep: QStep/* default */.Z,QInput: QInput/* default */.Z,QIcon: QIcon/* default */.Z,QSelect: QSelect/* default */.Z,QItemSection: QItemSection/* default */.Z,QItemLabel: QItemLabel/* default */.Z,QItem: QItem/* default */.Z,QBtn: QBtn/* default */.Z,QField: QField/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=887.js.map