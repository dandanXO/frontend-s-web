"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[108],{

/***/ 82108:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ WithdrawView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(61957);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/finance/WithdrawView.vue?vue&type=template&id=5257d447&scoped=true

const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-5257d447"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "menu-title-container"
}, null, -1));
const _hoisted_2 = {
  class: "account-content withdrawal q-gutter-md q-pa-md"
};
const _hoisted_3 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "text-h6"
}, "รายการที่รอดำเนินการชำระเงิน", -1));
const _hoisted_4 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("ul", null, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("li", null, " หลังจบเกม ระบบจะตรวจสอบคะแนนและประสานการจ่ายเงิน โปรดอดทนรอสักครู่ "), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("li", null, " หากการถอนล้มเหลว โปรดตรวจสอบสาเหตุที่ระบุไว้ในประกาศบนเว็บไซต์! ")], -1));
const _hoisted_5 = {
  class: "q-pa-md q-mb-xl"
};
const _hoisted_6 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "text-h6"
}, "วิธีถอนเงิน", -1));
const _hoisted_7 = {
  class: "account-content last"
};
const _hoisted_8 = {
  class: "withdrawalmethod"
};
const _hoisted_9 = ["onClick"];
const _hoisted_10 = {
  key: 0,
  class: "promo"
};
const _hoisted_11 = ["src"];
const _hoisted_12 = {
  class: "type-name"
};
const _hoisted_13 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
  style: {
    "font-size": "15px"
  }
}, "THB", -1));
const _hoisted_14 = {
  class: "q-mt-md q-mb-md"
};
const _hoisted_15 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("br", null, null, -1));
const _hoisted_16 = {
  key: 0,
  class: "q-my-md",
  label: "อัตราการแลก"
};
const _hoisted_17 = {
  style: {
    "color": "#9bffd1"
  }
};
const _hoisted_18 = ["src"];
const _hoisted_19 = ["src"];
const _hoisted_20 = {
  key: 1,
  class: "q-my-md",
  label: "จํานวนเงินโดยประมาณ"
};
const _hoisted_21 = {
  style: {
    "color": "#9bffd1"
  }
};
const _hoisted_22 = {
  class: "flex-box flex-justify-center"
};
function render(_ctx, _cache) {
  const _component_q_step = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-step");
  const _component_q_stepper = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-stepper");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_router_link = (0,runtime_core_esm_bundler/* resolveComponent */.up)("router-link");
  const _component_q_item_section = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-item-section");
  const _component_q_item = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-item");
  const _component_q_item_label = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-item-label");
  const _component_q_select = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-select");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", null, [_hoisted_1, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, [_hoisted_3, (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_stepper, {
    modelValue: _ctx.step,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.step = $event),
    vertical: "",
    "active-color": "white",
    "inactive-color": "white"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_step, {
      done: true,
      prefix: "1",
      name: 1,
      status: "process",
      title: "ยื่นคำขอ",
      icon: ""
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_step, {
      done: true,
      prefix: "2",
      name: 2,
      status: "process",
      title: "ดำเนินการ"
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_step, {
      done: true,
      prefix: "3",
      name: 3,
      status: "process",
      title: "จ่าย"
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_step, {
      done: true,
      prefix: "4",
      name: 4,
      status: "process",
      title: "สำเร็จ"
    })]),
    _: 1
  }, 8, ["modelValue"]), _hoisted_4]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_5, [_hoisted_6, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_8, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.withdrawalMethods, (method, i) => {
    return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
      key: i,
      class: (0,shared_esm_bundler/* normalizeClass */.C_)(["txt-center withdraw-type-item", {
        active: i === _ctx.activeItem
      }]),
      onClick: $event => _ctx.selectMethod(method, i)
    }, [method.recommended ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("span", _hoisted_10, "Recommended")) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
      src: _ctx.imgURL + method.icon
    }, null, 8, _hoisted_11), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_12, (0,shared_esm_bundler/* toDisplayString */.zw)(method.name), 1)], 10, _hoisted_9);
  }), 128))]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, null, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
      filled: "",
      ref: "amountRef",
      modelValue: _ctx.withdrawInfo.amount,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.withdrawInfo.amount = $event),
      label: "กรุณาใส่จำนวนเงินที่ต้องการถอน",
      color: "white",
      rules: [val => val && val.length > 0 || 'ใส่ยอดเงิน', val => val >= _ctx.selectedWithdrawalMethod.withdrawMin || 'จํานวนเงินควรเป็นไปตามที่กำหนด', val => val <= _ctx.selectedWithdrawalMethod.withdrawMax || 'จํานวนเงินควรเป็นไปตามที่กำหนด']
    }, {
      append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [_hoisted_13]),
      _: 1
    }, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_14, [_ctx.selectedWithdrawalMethod.withdrawMin && _ctx.selectedWithdrawalMethod.withdrawMin ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, {
      key: 0
    }, [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)("วงเงินต่ำสุด/วงเงินสูงสุด: " + _ctx.selectedWithdrawalMethod.withdrawMin + " - " + _ctx.selectedWithdrawalMethod.withdrawMax) + " ", 1), _hoisted_15], 64)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), _ctx.selectedWithdrawalMethod.withdrawMaxAmount ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, {
      key: 1
    }, [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)("ถอนวันนี้: " + _ctx.selectedWithdrawalMethod.withdrawMaxAmount), 1)], 64)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), _ctx.selectedWithdrawalMethod.withdrawMaxTimes ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, {
      key: 2
    }, [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)(" เหลือ: " + _ctx.selectedWithdrawalMethod.withdrawMaxTimes + " ครั้ง"), 1)], 64)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)], 512), [[runtime_dom_esm_bundler/* vShow */.F8, _ctx.selectedWithdrawalMethod]]), _ctx.isUSDT && _ctx.selectedWithdrawalMethod.exchangeRate ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_16, [(0,runtime_core_esm_bundler/* createElementVNode */._)("span", _hoisted_17, "1.00 USDT ≈ " + (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.selectedWithdrawalMethod.exchangeRate) + " THB", 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_select, {
      filled: "",
      ref: "cardRef",
      modelValue: _ctx.withdrawInfo.cardId,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.withdrawInfo.cardId = $event),
      "option-value": "id",
      "emit-value": "",
      label: "เลือกบัญชีธนาคาร",
      color: "white",
      options: _ctx.withdrawState.bankCardList,
      "map-options": "",
      rules: [val => !!val || 'โปรดเลือกบัญชีธนาคาร']
    }, {
      "no-option": (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item, null, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_section, {
          class: "text-grey"
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)("ไม่มีบัตรที่สามารถใช้งานได้ "), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_router_link, {
            to: "/account/withdraw"
          }, {
            default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)("เพิ่มบัตร")]),
            _: 1
          })]),
          _: 1
        })]),
        _: 1
      })]),
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
          }, null, 8, _hoisted_18)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)]),
          _: 2
        }, 1024), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_section, null, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_label, null, {
            default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)(scope.opt.bankName) + " - " + (0,shared_esm_bundler/* toDisplayString */.zw)(scope.opt.cardNumber), 1)]),
            _: 2
          }, 1024)]),
          _: 2
        }, 1024)]),
        _: 2
      }, 1040)]),
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
        }, null, 8, _hoisted_19)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)]),
        _: 2
      }, 1024), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_section, null, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_item_label, {
          style: {
            "text-overflow": "ellipsis",
            "overflow": "hidden",
            "white-space": "nowrap"
          }
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)(scope.opt.bankName) + " - " + (0,shared_esm_bundler/* toDisplayString */.zw)(scope.opt.cardNumber), 1)]),
          _: 2
        }, 1024)]),
        _: 2
      }, 1024)]),
      _: 1
    }, 8, ["modelValue", "options", "rules"]), _ctx.isUSDT && _ctx.selectedWithdrawalMethod.exchangeRate ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_20, [(0,runtime_core_esm_bundler/* createElementVNode */._)("span", _hoisted_21, (0,shared_esm_bundler/* toDisplayString */.zw)((_ctx.withdrawInfo.amount / _ctx.selectedWithdrawalMethod.exchangeRate).toFixed(2)) + " USDT", 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_22, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
      class: "q-mt-md",
      onClick: _ctx.submitWithdraw,
      color: "brand",
      label: "ยืนยันการถอน"
    }, null, 8, ["onClick"])])]),
    _: 1
  })])])]);
}
;// CONCATENATED MODULE: ./src/pages/finance/WithdrawView.vue?vue&type=template&id=5257d447&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(46727);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69665);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/finance/WithdrawView.vue?vue&type=script&lang=js



// import { loadBankCards, confirmWithdraw, withdrawEntrance
// //  } from "@/api/personal/personal";
// import { message } from "ant-design-vue";


/* harmony default export */ const WithdrawViewvue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "WithdrawView",
  setup() {
    const $q = (0,use_quasar/* default */.Z)();
    const imgURL = "https://himalayas.fantasticemedia.com/images" + '/';
    const amountRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const cardRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const activeItem = (0,reactivity_esm_bundler/* ref */.iH)(0);
    const withdrawState = (0,reactivity_esm_bundler/* reactive */.qj)({
      bankCardList: []
    });
    const qs = __webpack_require__(51470);
    const withdrawInfo = (0,reactivity_esm_bundler/* reactive */.qj)({
      cardId: undefined,
      amount: ""
    });
    const withdrawalMethods = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const selectedWithdrawalMethod = (0,reactivity_esm_bundler/* ref */.iH)([]);
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      getWithdrawalMethods();
    });
    const submitWithdraw = () => {
      cardRef.value.validate();
      amountRef.value.validate();
      $q.loading.show({
        message: "Confirming Withdrawal"
      });
      if (cardRef.value.hasError || amountRef.value.hasError) {
        $q.loading.hide();
      } else {
        axios.api.post("/session/withdraw/", qs.stringify(withdrawInfo)).then(res => {
          const response = res.data;
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "สำเร็จ",
              icon: "check_circle_outline"
            });
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: response.message,
            //   icon: "report_problem"
            // });
          }
        }).catch(error => {
          console.log("error", error);
        });
        $q.loading.hide();
      }
    };
    const isUSDT = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const selectMethod = (method, index) => {
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = null;
      selectedWithdrawalMethod.value = method;
      withdrawInfo.withdrawCode = method.code;
      if (withdrawInfo.withdrawCode.includes('USDT')) {
        isUSDT.value = true;
      } else {
        isUSDT.value = false;
      }
      activeItem.value = index;
      loadCards();
    };
    const loadCards = () => {
      axios.api.get("/session/bankCard").then(res => {
        const response = res.data;
        withdrawState.bankCardList = [];
        if (response.code === 0) {
          // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
          response.data.forEach(element => {
            if (element.bankType === 'BANK') {
              if (element.bankType.includes(selectedWithdrawalMethod.value.code)) {
                withdrawState.bankCardList.push(element);
              }
            } else {
              if (element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
                withdrawState.bankCardList.push(element);
              }
            }
          });
          // else {
          //   response.data.forEach(element => {
          //     if (element.bankId !== 39) {
          //       withdrawState.bankCardList.push(element)
          //     }
          //   });
          // }
        }
      }).catch(error => {
        console.log("error", error);
      });
    };
    const getWithdrawalMethods = () => {
      axios.api.get("/session/withdraw/entrance").then(res => {
        const response = res.data;
        if (response.code === 0) {
          withdrawalMethods.value = response.data;
          //Remove this for real data
          // withdrawalMethods.value = [
          //   {"currencyId":6,"name":"withdraw_bank","code":"BANK","icon":"71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3},
          //   {"currencyId":6,"name":"withdraw_gcash","code":"GCASH","icon":"c9d92237-4e44-4ee7-92c7-ceb5214f225f.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3}]
          if (withdrawalMethods.value.length > 0) {
            selectMethod(withdrawalMethods.value[0], 0);
          }
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      });
    };
    return {
      amountRef,
      cardRef,
      withdrawInfo,
      submitWithdraw,
      withdrawState,
      withdrawalMethods,
      activeItem,
      selectMethod,
      imgURL,
      step: (0,reactivity_esm_bundler/* ref */.iH)(),
      selectedWithdrawalMethod,
      loadCards,
      isUSDT
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/finance/WithdrawView.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/stepper/QStepper.js
var QStepper = __webpack_require__(8225);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/stepper/QStep.js
var QStep = __webpack_require__(46017);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/form/QForm.js
var QForm = __webpack_require__(8326);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/input/QInput.js + 2 modules
var QInput = __webpack_require__(66611);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/select/QSelect.js + 1 modules
var QSelect = __webpack_require__(4581);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/item/QItem.js
var QItem = __webpack_require__(490);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/item/QItemSection.js
var QItemSection = __webpack_require__(76749);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/item/QItemLabel.js
var QItemLabel = __webpack_require__(33115);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/btn/QBtn.js
var QBtn = __webpack_require__(68879);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/finance/WithdrawView.vue




;



const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(WithdrawViewvue_type_script_lang_js, [['render',render],['__scopeId',"data-v-5257d447"]])

/* harmony default export */ const WithdrawView = (__exports__);
;









runtime_auto_import_default()(WithdrawViewvue_type_script_lang_js, 'components', {QStepper: QStepper/* default */.Z,QStep: QStep/* default */.Z,QForm: QForm/* default */.Z,QInput: QInput/* default */.Z,QSelect: QSelect/* default */.Z,QItem: QItem/* default */.Z,QItemSection: QItemSection/* default */.Z,QItemLabel: QItemLabel/* default */.Z,QBtn: QBtn/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=108.js.map