(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[843],{

/***/ 68843:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ PromoPage)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/PromoPage.vue?vue&type=template&id=39530264&scoped=true

const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-39530264"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = {
  class: "promo-container"
};
const _hoisted_2 = {
  key: 0,
  class: "all-promotions"
};
const _hoisted_3 = {
  key: 0,
  class: "banner-container"
};
const _hoisted_4 = {
  class: "promo-main-container"
};
const _hoisted_5 = {
  class: "promo-type-wrapper"
};
const _hoisted_6 = {
  class: "type-list"
};
const _hoisted_7 = ["onClick"];
const _hoisted_8 = {
  class: "promo-list-wrapper"
};
const _hoisted_9 = ["onClick"];
const _hoisted_10 = {
  class: "promo-img-wrapper"
};
const _hoisted_11 = {
  class: "promo-bg"
};
const _hoisted_12 = ["src"];
const _hoisted_13 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "promo-info"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
  class: "viewdetail"
}, "ดูรายละเอียด")], -1));
const _hoisted_14 = {
  key: 1,
  class: "selected-promo"
};
const _hoisted_15 = {
  class: "selected-promo-wrapper"
};
const _hoisted_16 = {
  class: "banner-container"
};
const _hoisted_17 = {
  class: "inner"
};
const _hoisted_18 = {
  key: 0
};
const _hoisted_19 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "menu-title"
}, "ข้อตกลงและเงื่อนไข", -1));
const _hoisted_20 = ["innerHTML"];
function render(_ctx, _cache) {
  const _component_RiFunctionLine = (0,runtime_core_esm_bundler/* resolveComponent */.up)("RiFunctionLine");
  const _component_HotPromotion = (0,runtime_core_esm_bundler/* resolveComponent */.up)("HotPromotion");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_1, [!_ctx.isPromoDetail ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_2, [_ctx.banner && _ctx.banner.desktopImageUrl && _ctx.banner.mobileImageUrl ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    class: "promo-bg",
    style: (0,shared_esm_bundler/* normalizeStyle */.j5)('background-image: url(' + _ctx.imgURL + _ctx.banner.mobileImageUrl + ')')
  }, null, 4)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_6, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.promoTypes, p => {
    return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C_)(["type-item", {
        active: p.value === _ctx.promoTabActive
      }]),
      key: p,
      onClick: $event => _ctx.switchPromoType(p)
    }, [p && p.value === 'ALL' ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_RiFunctionLine, {
      key: 0
    })) : ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, {
      key: 1
    }, [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)((0,shared_esm_bundler/* toDisplayString */.zw)(p.label), 1)], 64))], 10, _hoisted_7);
  }), 128))])]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_8, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.filteredArray, (promo, i) => {
    return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
      class: "promo-item",
      key: i,
      "data-aos": "zoom-in",
      "data-aos-easing": "ease-out",
      "data-aos-duration": "1000"
    }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("a", {
      onClick: $event => _ctx.showPromoDetails(promo)
    }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_10, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_11, [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
      class: "promo-content",
      src: _ctx.imgURL + promo.mobileImgUrl
    }, null, 8, _hoisted_12)])]), _hoisted_13], 8, _hoisted_9)]);
  }), 128))])])])) : ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_14, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_15, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_16, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    class: "promo-bg",
    style: (0,shared_esm_bundler/* normalizeStyle */.j5)('background-image: url(' + _ctx.imgURL + _ctx.selectedPromo.mobileImgUrl + ')')
  }, null, 4)]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_17, [_ctx.selectedPromo.hasPromo ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_18, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_HotPromotion, {
    list: _ctx.selectedPromo
  }, null, 8, ["list"])])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C_)(["promo-view-container", {
      welcome: _ctx.selectedPromo.promoType.toLowerCase() === 'welcome',
      sport: _ctx.selectedPromo.promoType.toLowerCase() === 'sport',
      eSport: _ctx.selectedPromo.promoType.toLowerCase() === 'esport',
      fish: _ctx.selectedPromo.promoType.toLowerCase() === 'fish',
      liveCasino: _ctx.selectedPromo.promoType.toLowerCase() === 'livecasino',
      slot: _ctx.selectedPromo.promoType.toLowerCase() === 'slot game'
    }])
  }, [_hoisted_19, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    innerHTML: _ctx.selectedPromo.pageContent
  }, null, 8, _hoisted_20)], 2)])])]))]);
}
;// CONCATENATED MODULE: ./src/pages/PromoPage.vue?vue&type=template&id=39530264&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69665);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(46727);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
// EXTERNAL MODULE: ./node_modules/vue-remix-icons/dist/vue-remix-icons.es.js
var vue_remix_icons_es = __webpack_require__(5253);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./src/stores/ui.js
var stores_ui = __webpack_require__(24477);
// EXTERNAL MODULE: ./src/stores/index.js
var stores = __webpack_require__(23053);
// EXTERNAL MODULE: ./src/assets/images/promotion/hotpromo/22/icon.png
var icon = __webpack_require__(40446);
var icon_default = /*#__PURE__*/__webpack_require__.n(icon);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/HotPromotion.vue?vue&type=template&id=65f2ee10


const HotPromotionvue_type_template_id_65f2ee10_hoisted_1 = {
  class: "hot-promo"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_2 = {
  key: 0,
  class: "promo-4"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_3 = {
  class: "tabs"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_4 = {
  class: "tab1"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_5 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
  src: (icon_default())
}, null, -1);
const HotPromotionvue_type_template_id_65f2ee10_hoisted_6 = {
  class: "contents"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_7 = {
  class: "q-mb-md"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_8 = {
  class: "row items-center justify-end"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_9 = {
  class: "row items-center justify-end"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_10 = {
  class: "bonus-svg-div"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_11 = {
  class: "claim-amt"
};
const HotPromotionvue_type_template_id_65f2ee10_hoisted_12 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
  class: "bonus-text"
}, "โบนัส", -1);
function HotPromotionvue_type_template_id_65f2ee10_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_tab = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-tab");
  const _component_q_tabs = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-tabs");
  const _component_q_separator = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-separator");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  const _component_q_tab_panel = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-tab-panel");
  const _component_q_date = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-date");
  const _component_q_popup_proxy = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-popup-proxy");
  const _component_q_icon = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-icon");
  const _component_q_toggle = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-toggle");
  const _component_q_table = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-table");
  const _component_q_tab_panels = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-tab-panels");
  const _component_q_card_section = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-card-section");
  const _component_ClaimPromo = (0,runtime_core_esm_bundler/* resolveComponent */.up)("ClaimPromo");
  const _component_SJBPromo = (0,runtime_core_esm_bundler/* resolveComponent */.up)("SJBPromo");
  const _component_InviteFriendPromo = (0,runtime_core_esm_bundler/* resolveComponent */.up)("InviteFriendPromo");
  const _component_q_card_actions = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-card-actions");
  const _component_q_card = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-card");
  const _component_q_dialog = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-dialog");
  const _directive_close_popup = (0,runtime_core_esm_bundler/* resolveDirective */.Q2)("close-popup");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_1, [_ctx.list.id === 30 && _ctx.store.hasToken() ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_3, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_card_section, null, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tabs, {
      modelValue: _ctx.activeKey,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.activeKey = $event),
      dense: "",
      class: "text-grey",
      "active-color": "brand",
      "indicator-color": "black",
      align: "justify",
      "narrow-indicator": ""
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab, {
        name: "1",
        label: "เลือกเลขนำโชค"
      }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab, {
        name: "2",
        label: "บันทึก"
      }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab, {
        name: "3",
        label: "รายชื่อผู้ชนะ"
      })]),
      _: 1
    }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_separator), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panels, {
      modelValue: _ctx.activeKey,
      "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => _ctx.activeKey = $event),
      animated: ""
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
        name: "1"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_4, [HotPromotionvue_type_template_id_65f2ee10_hoisted_5, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_6, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
          class: "q-gutter-md"
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_7, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.selectedHotPromo.contents.tab1), 1), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
            modelValue: _ctx.lucky_number,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.lucky_number = $event),
            filled: "",
            color: "white",
            type: "number",
            rules: [val => val && val.length === 3 || 'ขีดสุด 3 ตัวเลข'],
            label: "เลขนำโชค"
          }, null, 8, ["modelValue", "rules"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
            loading: _ctx.btnLoading,
            onClick: _cache[2] || (_cache[2] = $event => _ctx.submitLuckyNumber()),
            color: "brand",
            label: "ส่ง"
          }, null, 8, ["loading"])]),
          _: 1
        })])])]),
        _: 1
      }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
        name: "2"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, null, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
            filled: "",
            modelValue: _ctx.formState.dateTime,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => _ctx.formState.dateTime = $event),
            label: "เลือกวันที่",
            readonly: "",
            color: "white"
          }, {
            append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
              name: "event",
              class: "cursor-pointer"
            }, {
              default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_popup_proxy, {
                cover: "",
                "transition-show": "scale",
                "transition-hide": "scale"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_date, {
                  modelValue: _ctx.formState.dateTime,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => _ctx.formState.dateTime = $event),
                  mask: "YYYY-MM-DD"
                }, {
                  default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_8, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
                    label: "ปิด",
                    color: "white",
                    flat: ""
                  }, null, 512), [[_directive_close_popup]])])]),
                  _: 1
                }, 8, ["modelValue"])]),
                _: 1
              })]),
              _: 1
            })]),
            after: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_toggle, {
              style: {
                "font-size": "12px"
              },
              modelValue: _ctx.formState.onlyMe,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => _ctx.formState.onlyMe = $event),
              color: "red",
              label: "เฉพาะฉันเท่านั้น",
              "left-label": "",
              size: "xs",
              val: "xs"
            }, null, 8, ["modelValue"])]),
            _: 1
          }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
            onClick: _cache[6] || (_cache[6] = $event => _ctx.filterLuckyNumber()),
            loading: _ctx.loading,
            class: "full-width q-mt-md",
            color: "brand",
            label: "คัดกรอง"
          }, null, 8, ["loading"])]),
          _: 1
        }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
          title: "เลขนำโชคบันทึกรา",
          "no-data-label": "ไม่มีข้อมูล",
          "loading-label": "กำลังโหลด...",
          "rows-per-page-label": " ",
          loading: _ctx.loading,
          class: "q-mt-md",
          columns: _ctx.filterColumn,
          rows: _ctx.dataSource
        }, null, 8, ["loading", "columns", "rows"])]),
        _: 1
      }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
        name: "3"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, null, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
            filled: "",
            modelValue: _ctx.formState.resultTime,
            "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => _ctx.formState.resultTime = $event),
            label: "เลือกวันที่",
            readonly: "",
            color: "white"
          }, {
            append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
              name: "event",
              class: "cursor-pointer"
            }, {
              default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_popup_proxy, {
                cover: "",
                "transition-show": "scale",
                "transition-hide": "scale"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_date, {
                  modelValue: _ctx.formState.resultTime,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => _ctx.formState.resultTime = $event),
                  mask: "YYYY-MM-DD"
                }, {
                  default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_9, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
                    label: "ปิด",
                    color: "white",
                    flat: ""
                  }, null, 512), [[_directive_close_popup]])])]),
                  _: 1
                }, 8, ["modelValue"])]),
                _: 1
              })]),
              _: 1
            })]),
            _: 1
          }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
            onClick: _cache[9] || (_cache[9] = $event => _ctx.filterWinnerLists()),
            loading: _ctx.loading,
            class: "full-width q-mt-md",
            color: "brand",
            label: "คัดกรอง"
          }, null, 8, ["loading"])]),
          _: 1
        }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
          class: "q-mt-md",
          "no-data-label": "ไม่มีผู้ชนะรางวัลในวันนี้",
          "loading-label": "กำลังโหลด...",
          "rows-per-page-label": " ",
          loading: _ctx.loading,
          columns: _ctx.winnerColumn,
          rows: _ctx.winnerDataSource
        }, null, 8, ["loading", "columns", "rows"])]),
        _: 1
      })]),
      _: 1
    }, 8, ["modelValue"])]),
    _: 1
  })])])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), _ctx.isCommonPromo && _ctx.store.hasToken() ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_ClaimPromo, {
    key: 1,
    "promo-id": _ctx.list.id,
    "loading-claim": _ctx.btnLoading,
    onDailySlot: _cache[11] || (_cache[11] = $event => _ctx.handleSlot())
  }, null, 8, ["promo-id", "loading-claim"])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), _ctx.list.id === 40 && !_ctx.isCommonPromo && _ctx.store.hasToken() ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_SJBPromo, {
    key: 2,
    class: "promo-sjb"
  })) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), _ctx.list.id === 35 && !_ctx.isCommonPromo ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createBlock */.j4)(_component_InviteFriendPromo, {
    key: 3,
    class: "promo-invt"
  })) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_dialog, {
    modelValue: _ctx.isClaimModal,
    "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => _ctx.isClaimModal = $event),
    persistent: ""
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_card, {
      class: "win-rebate-model"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_card_section, {
        class: "row items-center"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", HotPromotionvue_type_template_id_65f2ee10_hoisted_10, [(0,runtime_core_esm_bundler/* createElementVNode */._)("span", HotPromotionvue_type_template_id_65f2ee10_hoisted_11, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.claimMsg), 1), HotPromotionvue_type_template_id_65f2ee10_hoisted_12])]),
        _: 1
      }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_card_actions, {
        align: "center"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          flat: "",
          label: "ตกลง",
          color: "primary"
        }, null, 512), [[_directive_close_popup]])]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  }, 8, ["modelValue"])], 64);
}
;// CONCATENATED MODULE: ./src/components/HotPromotion.vue?vue&type=template&id=65f2ee10

// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(24409);
// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__(43878);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
// EXTERNAL MODULE: ./src/assets/images/promotion/hotpromo/common/extra.png
var extra = __webpack_require__(12966);
var extra_default = /*#__PURE__*/__webpack_require__.n(extra);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/hotpromo/claimPromo.vue?vue&type=template&id=7538c6ef&scoped=true


const claimPromovue_type_template_id_7538c6ef_scoped_true_withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-7538c6ef"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_1 = {
  class: "common-promo"
};
const claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_2 = ["src"];
const claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_3 = {
  class: "contents"
};
const claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_4 = {
  key: 0,
  class: "orange"
};
const claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_5 = {
  key: 1,
  class: "extra-img"
};
const claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_6 = /*#__PURE__*/claimPromovue_type_template_id_7538c6ef_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
  src: (extra_default())
}, null, -1));
const claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_7 = [claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_6];
function claimPromovue_type_template_id_7538c6ef_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */._)("img", {
    src: __webpack_require__(1143)(`./${_ctx.promoId}/icon.png`)
  }, null, 8, claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_2), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_3, [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" โบนัสรายวันจะเข้าไปยังกระเป๋าของคุณหลังจากการเติมเงินสำเร็จ "), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
    class: "claim-btn",
    loading: _ctx.loadingClaim,
    onClick: _cache[0] || (_cache[0] = $event => _ctx.$emit('daily-slot'))
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)("เคลมเงินคืนประจำวัน")]),
    _: 1
  }, 8, ["loading"]), _ctx.promoId === 32 ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_4, " *โบนัสเงินคืนต้องทำ 1 เทิร์นก่อนถอนและจะถูกริบคืนหากไม่ได้ใช้ภายใน 30 วัน ")) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), _ctx.promoId === 27 ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_5, claimPromovue_type_template_id_7538c6ef_scoped_true_hoisted_7)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)])]);
}
;// CONCATENATED MODULE: ./src/components/hotpromo/claimPromo.vue?vue&type=template&id=7538c6ef&scoped=true

;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/hotpromo/claimPromo.vue?vue&type=script&lang=js

/* harmony default export */ const claimPromovue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  props: {
    loadingClaim: {
      type: Boolean,
      default: false
    },
    promoId: {
      type: Number,
      default: null
    }
  },
  emits: ["daily-slot"],
  setup() {
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {});
    return {};
  }
}));
;// CONCATENATED MODULE: ./src/components/hotpromo/claimPromo.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/btn/QBtn.js
var QBtn = __webpack_require__(68879);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/components/hotpromo/claimPromo.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(claimPromovue_type_script_lang_js, [['render',claimPromovue_type_template_id_7538c6ef_scoped_true_render],['__scopeId',"data-v-7538c6ef"]])

/* harmony default export */ const claimPromo = (__exports__);
;

runtime_auto_import_default()(claimPromovue_type_script_lang_js, 'components', {QBtn: QBtn/* default */.Z});

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js
var es_string_replace = __webpack_require__(18964);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/hotpromo/40/shiJieBei.vue?vue&type=template&id=3055df85&scoped=true


const shiJieBeivue_type_template_id_3055df85_scoped_true_withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-3055df85"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_1 = {
  class: "center-numbers"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_2 = /*#__PURE__*/shiJieBeivue_type_template_id_3055df85_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "center-title"
}, "โบนัสรวม", -1));
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_3 = {
  class: "center-number"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_4 = {
  class: "countries-wrapper"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_5 = /*#__PURE__*/shiJieBeivue_type_template_id_3055df85_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "point"
}, " เลือกทีมโปรดของคุณยิ่งคุณได้รับคะแนนโหวดมากเท่าไหร่ ยิ่งมีสิทธิ์ได้ลุ้นรับรางวัลมากขึ้น ", -1));
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_6 = {
  class: "right-count"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_7 = {
  class: "country-list",
  id: "countrylist"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_8 = ["onClick"];
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_9 = {
  class: "c-flag"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_10 = ["src"];
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_11 = {
  class: "c-name"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_12 = {
  class: "c-price"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_13 = /*#__PURE__*/shiJieBeivue_type_template_id_3055df85_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "c-button"
}, "โหวด", -1));
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_14 = {
  class: "table-details"
};
const shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_15 = {
  class: "text-h6"
};
function shiJieBeivue_type_template_id_3055df85_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_table = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-table");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  const _component_q_card_section = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-card-section");
  const _component_q_spinner_hourglass = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-spinner-hourglass");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_card_actions = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-card-actions");
  const _component_q_card = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-card");
  const _component_q_dialog = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-dialog");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", null, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_1, [shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_2, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_3, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.prizePool.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_4, [shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_5, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_6, [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" โหวตของฉัน: "), (0,runtime_core_esm_bundler/* createElementVNode */._)("span", null, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.myVotes), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_7, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.countriesList, (country, i) => {
    return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
      key: i,
      class: "country-item",
      onClick: $event => _ctx.voteModal(country)
    }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_9, [country.countryImgUrl ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("img", {
      key: 0,
      src: `${_ctx.imgURL}${country.countryImgUrl}`
    }, null, 8, shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_10)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_11, (0,shared_esm_bundler/* toDisplayString */.zw)(country.teamNameLocal), 1), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_12, (0,shared_esm_bundler/* toDisplayString */.zw)(country.totalVotes) + " โหวด", 1), shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_13], 8, shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_8);
  }), 128))])]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_14, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
    title: "เลขนำโชคบันทึกรา",
    "no-data-label": "ไม่มีข้อมูล",
    "loading-label": "กำลังโหลด...",
    class: "q-mt-md",
    columns: _ctx.tableColumns.votesRecord,
    rows: _ctx.dataSource,
    "row-key": "id"
  }, null, 8, ["columns", "rows"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_dialog, {
    modelValue: _ctx.voteModalVisible,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.voteModalVisible = $event)
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_card, {
      class: "q-pa-md",
      style: {
        "min-width": "360px"
      }
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", shiJieBeivue_type_template_id_3055df85_scoped_true_hoisted_15, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.selectedCountry), 1), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_card_section, {
        style: {
          "width": "100%"
        },
        class: "row items-center"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
          style: {
            "width": "100%"
          }
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
            filled: "",
            style: {
              "width": "100%"
            },
            ref: "voteCountRef",
            type: "number",
            placeholder: "จํานวนคะแนนเสียง",
            modelValue: _ctx.voteForm.voteCount,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.voteForm.voteCount = $event),
            color: "white",
            rules: [val => val && val.length || 'กรุณาใส่เลขที่ต้องการโหวด', val => val && val > 0 || 'เลขที่ต้องการโหวดต้องเป็นจำนวนเต็ม']
          }, null, 8, ["modelValue", "rules"])]),
          _: 1
        })]),
        _: 1
      }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_card_actions, {
        align: "center"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          style: {
            "width": "140px"
          },
          loading: _ctx.btnLoading,
          label: "ส่ง",
          color: "deep-orange",
          onClick: _ctx.submitVotes
        }, {
          loading: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_spinner_hourglass, {
            class: "on-left"
          }), (0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" กำลังตรวจสอบ ")]),
          _: 1
        }, 8, ["loading", "onClick"])]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  }, 8, ["modelValue"])]);
}
;// CONCATENATED MODULE: ./src/components/hotpromo/40/shiJieBei.vue?vue&type=template&id=3055df85&scoped=true

;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/hotpromo/40/shiJieBei.vue?vue&type=script&lang=js





var qs = __webpack_require__(51470);
/* harmony default export */ const shiJieBeivue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: 'SJBPromo',
  setup() {
    const $q = (0,use_quasar/* default */.Z)();
    const btnLoading = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const loading = (0,reactivity_esm_bundler/* ref */.iH)(true);
    const imgURL = "https://xinfa-files.s3.ap-southeast-1.amazonaws.com/game" + "/";
    const pagination = (0,reactivity_esm_bundler/* reactive */.qj)({
      pageSize: 5,
      total: 5
    });
    const prizePool = (0,reactivity_esm_bundler/* ref */.iH)(0);
    const tableColumns = {
      votesRecord: [{
        label: "ชื่อทีม",
        field: "teamVotesId"
      }, {
        label: "จํานวนคะแนนเสียง",
        field: "votes"
      }, {
        label: "เวลาโหวต",
        field: "voteTime"
      }]
    };
    const dataSource = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const selectedCountry = (0,reactivity_esm_bundler/* ref */.iH)(null);
    const selectedTeamId = (0,reactivity_esm_bundler/* ref */.iH)();
    const countriesList = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const myVotes = (0,reactivity_esm_bundler/* ref */.iH)("");
    const voteModalVisible = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const voteModal = ctry => {
      voteModalVisible.value = true;
      selectedCountry.value = ctry.teamNameLocal;
      voteForm.voteCount = null;
      voteForm.teamId = ctry.id;
    };
    const loadCountryList = () => {
      axios.eventapi.get("/privi/team-votes/init").then(ret => {
        const res = ret.data;
        if (res.code === 0) {
          prizePool.value = res.data.award;
          countriesList.value = res.data.votesList;
          myVotes.value = res.data.myVotes;
          dataSource.value = res.data.votesRecord;
          updateTableItems();
          loading.value = false;
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: res.message === 'too often request' ? 'คำขอบ่อยเกินไป' : i18n.global.t('error.' + res.code),
            icon: "report_problem"
          });
        }
      });
    };
    const updateTableItems = () => {
      dataSource.value.forEach(element => {
        let teamNameEquivalent = countriesList.value.find(ctry => ctry.id === element.teamVotesId);
        if (teamNameEquivalent) {
          element.teamVotesId = teamNameEquivalent.teamNameLocal;
        }
      });
    };
    const voteCountRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const voteForm = (0,reactivity_esm_bundler/* reactive */.qj)([{
      voteCount: 0,
      teamId: null
    }]);
    const submitVotes = () => {
      btnLoading.value = true;
      voteCountRef.value.validate();
      if (voteCountRef.value.hasError) {
        btnLoading.value = false;
      } else {
        btnLoading.value = true;
        if (myVotes.value > 0) {
          const obj = {
            teamId: voteForm.teamId,
            votes: Number(voteForm.voteCount)
          };
          axios.eventapi.post(`/privi/team-votes/vote`, qs.stringify(obj)).then(res => {
            $q.notify({
              color: "positive",
              position: "top",
              message: "สำเร็จ",
              icon: "check_circle_outline"
            });
            countriesList.value.forEach(element => {
              if (Number(element.id) === Number(voteForm.teamId)) {
                if (myVotes.value >= voteForm.voteCount) {
                  element.totalVotes = Number(element.totalVotes) + Number(voteForm.voteCount);
                  myVotes.value = Number(myVotes.value) - Number(voteForm.voteCount);
                  const obj = {
                    teamVotesId: voteForm.teamId,
                    votes: voteForm.voteCount,
                    voteTime: moment_default()(new Date()).format("YYYY/MM/DD, hh:mm A")
                  };
                  dataSource.value.push(obj);
                }
              }
            });
            updateTableItems();
            voteModalVisible.value = false;
            btnLoading.value = false;
          }).catch(err => {
            console.log(err);
            btnLoading.value = false;
          });
        } else {
          btnLoading.value = false;
          $q.notify({
            color: "negative",
            position: "top",
            message: "คุณมีคะแนนโหวดไม่เพียงพอ",
            icon: "report_problem"
          });
        }
      }
    };
    const votingRules = {
      voteCount: [{
        required: true,
        message: "กรุณาใส่เลขที่ต้องการโหวด",
        trigger: "blur"
      }, {
        min: 1,
        message: "เลขที่ต้องการโหวดต้องเป็นจำนวนเต็ม"
      }]
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      loadCountryList();
    });
    return {
      prizePool,
      dataSource,
      tableColumns,
      // recordPage,
      pagination,
      countriesList,
      loading,
      voteModal,
      voteModalVisible,
      selectedCountry,
      voteForm,
      submitVotes,
      myVotes,
      voteCountRef,
      votingRules,
      loadCountryList,
      selectedTeamId,
      btnLoading,
      imgURL
    };
  }
}));
;// CONCATENATED MODULE: ./src/components/hotpromo/40/shiJieBei.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/quasar/src/components/table/QTable.js + 12 modules
var QTable = __webpack_require__(81463);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/dialog/QDialog.js
var QDialog = __webpack_require__(32074);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/card/QCard.js
var QCard = __webpack_require__(44458);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/card/QCardSection.js
var QCardSection = __webpack_require__(63190);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/form/QForm.js
var QForm = __webpack_require__(8326);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/input/QInput.js + 2 modules
var QInput = __webpack_require__(66611);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/card/QCardActions.js
var QCardActions = __webpack_require__(11821);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/spinner/QSpinnerHourglass.js
var QSpinnerHourglass = __webpack_require__(96335);
;// CONCATENATED MODULE: ./src/components/hotpromo/40/shiJieBei.vue




;


const shiJieBei_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(shiJieBeivue_type_script_lang_js, [['render',shiJieBeivue_type_template_id_3055df85_scoped_true_render],['__scopeId',"data-v-3055df85"]])

/* harmony default export */ const shiJieBei = (shiJieBei_exports_);
;









runtime_auto_import_default()(shiJieBeivue_type_script_lang_js, 'components', {QTable: QTable/* default */.Z,QDialog: QDialog/* default */.Z,QCard: QCard/* default */.Z,QCardSection: QCardSection/* default */.Z,QForm: QForm/* default */.Z,QInput: QInput/* default */.Z,QCardActions: QCardActions/* default */.Z,QBtn: QBtn/* default */.Z,QSpinnerHourglass: QSpinnerHourglass/* default */.Z});

;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/hotpromo/35/inviteFriendPromo.vue?vue&type=template&id=1eafb912&scoped=true

const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-1eafb912"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_1 = {
  key: 0,
  class: "table-details"
};
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_2 = {
  class: "searchbar"
};
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_3 = {
  class: "left q-gutter-sm"
};
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_4 = {
  class: "row items-center justify-end"
};
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_5 = {
  class: "invitePromo"
};
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_6 = /*#__PURE__*/inviteFriendPromovue_type_template_id_1eafb912_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("p", {
  class: "menu-title",
  style: {
    "font-weight": "bold"
  }
}, " เชิญเพื่อน รับเงินรางวัล ", -1));
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_7 = /*#__PURE__*/inviteFriendPromovue_type_template_id_1eafb912_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("p", {
  class: "menu-title sub inv-title"
}, "เวลากิจกรรม", -1));
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_8 = /*#__PURE__*/inviteFriendPromovue_type_template_id_1eafb912_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("p", {
  style: {
    "margin-bottom": "30px"
  }
}, " เริ่ม 20/11/2022 เวลา 00:00:00 (GMT+8) ", -1));
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_9 = /*#__PURE__*/inviteFriendPromovue_type_template_id_1eafb912_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("p", {
  class: "menu-title sub inv-title"
}, "รายละเอียดกิจกรรม", -1));
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_10 = /*#__PURE__*/inviteFriendPromovue_type_template_id_1eafb912_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("p", {
  style: {
    "margin-bottom": "30px"
  }
}, " สมาชิก Jolly88 เปิด : ส่วนบุคคล - คลิก \"เชิญเพื่อน\" เพื่อคัดลอกลิงก์โปรโมชั่น แชร์ผ่าน Facebook, LINE, Instagram, what's app, telegram และ YouTube ฯลฯ เมื่อเชิญเพื่อนสำเร็จรับรางวัลเงินสดทันที! ", -1));
const inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_11 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createStaticVNode */.uE)("<div class=\"table-inv\" data-v-1eafb912><table style=\"width:600px;\" data-v-1eafb912><tbody data-v-1eafb912><tr data-v-1eafb912><th data-v-1eafb912>ระดับ</th><th data-v-1eafb912> เชิญเพื่อนใหม่เติมเงินครั้งแรก </th><th data-v-1eafb912>รับเงินโบนัส</th><th data-v-1eafb912>ข้อกำหนดรอบเทิร์น</th></tr><tr data-v-1eafb912><td data-v-1eafb912>Level 1</td><td data-v-1eafb912>≥฿500</td><td data-v-1eafb912>48</td><td rowspan=\"6\" colspan=\"1\" data-v-1eafb912>1เท่า/ไม่จำกัดรอบ</td></tr><tr data-v-1eafb912><td data-v-1eafb912>Level 2</td><td data-v-1eafb912>≥฿1,000</td><td data-v-1eafb912>68</td></tr><tr data-v-1eafb912><td data-v-1eafb912>Level 3</td><td data-v-1eafb912>≥฿5,000</td><td data-v-1eafb912>288</td></tr><tr data-v-1eafb912><td data-v-1eafb912>Level 4</td><td data-v-1eafb912>≥฿10,000</td><td data-v-1eafb912>688</td></tr><tr data-v-1eafb912><td data-v-1eafb912>Level 5</td><td data-v-1eafb912>≥฿50,000</td><td data-v-1eafb912>1,898</td></tr><tr data-v-1eafb912><td data-v-1eafb912>Level 6</td><td data-v-1eafb912>≥฿100,000</td><td data-v-1eafb912>3,898</td></tr></tbody></table></div><p style=\"text-align:left;color:#00ff16;margin-top:10px;\" data-v-1eafb912> ตัวอย่างเช่น: สมาชิก A ชวนเพื่อนฝากเงิน 500 บาทเป็นครั้งแรก จากนั้นเขาจะได้รับโบนัส 48 บาท หากต้องการรับระดับถัดไปเป็น 68 บาท เขาต้องฝากอีก 1,000 บาท โบนัสจะจ่ายไปยังกระเป๋าเงินของคุณโดยอัตโนมัติ หากสัปดาห์หน้า เพื่อนที่คุณเชิญยังคงมียอดเงินฝากครบ คุณจะได้รับโบนัสอีกครั้งในสัปดาห์หน้า </p>", 2);
function inviteFriendPromovue_type_template_id_1eafb912_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_date = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-date");
  const _component_q_popup_proxy = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-popup-proxy");
  const _component_q_icon = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-icon");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  const _component_q_table = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-table");
  const _directive_close_popup = (0,runtime_core_esm_bundler/* resolveDirective */.Q2)("close-popup");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", null, [_ctx.store.hasToken() ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_2, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
    layout: "inline",
    model: _ctx.searchForm
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_3, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
      clearable: "",
      placeholder: "เลือกวันที่",
      filled: "",
      modelValue: _ctx.searchForm.regTime,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.searchForm.regTime = $event)
    }, {
      append: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_icon, {
        name: "event",
        class: "cursor-pointer"
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_popup_proxy, {
          cover: "",
          "transition-show": "scale",
          "transition-hide": "scale"
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_date, {
            modelValue: _ctx.searchForm.regTime,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.searchForm.regTime = $event),
            mask: "YYYY-MM-DD"
          }, {
            default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_4, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
              label: "Close",
              color: "primary",
              flat: ""
            }, null, 512), [[_directive_close_popup]])])]),
            _: 1
          }, 8, ["modelValue"])]),
          _: 1
        })]),
        _: 1
      })]),
      _: 1
    }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
      placeholder: "ชื่อ",
      filled: "",
      modelValue: _ctx.searchForm.loginName,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.searchForm.loginName = $event)
    }, null, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
      class: "q-mt-md",
      label: "ค้นหา",
      color: "brand",
      onClick: _ctx.searchRecord,
      loading: _ctx.btnLoading
    }, null, 8, ["onClick", "loading"])]),
    _: 1
  }, 8, ["model"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
    loading: _ctx.btnLoading,
    "no-data-label": "ไม่มีข้อมูล",
    "loading-label": "กำลังโหลด...",
    class: "q-mt-md",
    columns: _ctx.tableColumns,
    rows: _ctx.dataSource,
    "row-key": "id"
  }, null, 8, ["loading", "columns", "rows"])])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_5, [inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_6, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_7, inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_8, inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_9, inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_10, (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
    color: "brand",
    class: "fit q-mb-lg",
    to: "/share"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)("แชร์ตอนนี้")]),
    _: 1
  }), inviteFriendPromovue_type_template_id_1eafb912_scoped_true_hoisted_11])])]);
}
;// CONCATENATED MODULE: ./src/components/hotpromo/35/inviteFriendPromo.vue?vue&type=template&id=1eafb912&scoped=true

;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/hotpromo/35/inviteFriendPromo.vue?vue&type=script&lang=js





var inviteFriendPromovue_type_script_lang_js_qs = __webpack_require__(51470);
/* harmony default export */ const inviteFriendPromovue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: 'SJBPromo',
  setup() {
    const $q = (0,use_quasar/* default */.Z)();
    const btnLoading = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const pagination = (0,reactivity_esm_bundler/* reactive */.qj)({
      pageSize: 5,
      total: 50
    });
    const dataSource = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const tableColumns = [{
      label: "ID",
      field: "id"
    }, {
      label: "ชื่อเข้าใช้",
      field: "loginName"
    }, {
      label: "เวลาลงทะเบียน",
      field: "regTime"
    }, {
      label: "จํานวนเงินฝาก",
      field: "depositAmount"
    }, {
      label: "ได้รับโบนัสแล้ว",
      field: "bonusReceived"
    }, {
      label: "วันที่รับ",
      field: "dateReceived"
    }];
    const recordPage = pagination => {
      searchRecord();
    };
    const store = (0,stores/* userStore */.H)();
    const searchForm = (0,reactivity_esm_bundler/* reactive */.qj)({
      regTime: null,
      loginName: null
    });
    const searchRecord = () => {
      btnLoading.value = true;
      if (searchForm.loginName === '') {
        searchForm.loginName = null;
      }
      if (searchForm.regTime === '') {
        searchForm.regTime = null;
      }
      axios.api.get("/session/referred", {
        params: {
          memberId: store.id,
          loginName: searchForm.loginName,
          regTime: searchForm.regTime
        }
      }).then(ret => {
        const res = ret.data;
        if (res.code === 0) {
          dataSource.value = res.data.records;
          btnLoading.value = false;
        }
      }).catch(err => {
        console.log(err);
        btnLoading.value = false;
      });
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      if (store.token) {
        recordPage();
      }
    });
    return {
      tableColumns,
      dataSource,
      recordPage,
      pagination,
      btnLoading,
      searchForm,
      searchRecord,
      store
    };
  }
}));
;// CONCATENATED MODULE: ./src/components/hotpromo/35/inviteFriendPromo.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/quasar/src/components/icon/QIcon.js
var QIcon = __webpack_require__(22857);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/popup-proxy/QPopupProxy.js
var QPopupProxy = __webpack_require__(52765);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/date/QDate.js + 3 modules
var QDate = __webpack_require__(34939);
// EXTERNAL MODULE: ./node_modules/quasar/src/directives/ClosePopup.js
var ClosePopup = __webpack_require__(62146);
;// CONCATENATED MODULE: ./src/components/hotpromo/35/inviteFriendPromo.vue




;


const inviteFriendPromo_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(inviteFriendPromovue_type_script_lang_js, [['render',inviteFriendPromovue_type_template_id_1eafb912_scoped_true_render],['__scopeId',"data-v-1eafb912"]])

/* harmony default export */ const inviteFriendPromo = (inviteFriendPromo_exports_);
;







runtime_auto_import_default()(inviteFriendPromovue_type_script_lang_js, 'components', {QForm: QForm/* default */.Z,QInput: QInput/* default */.Z,QIcon: QIcon/* default */.Z,QPopupProxy: QPopupProxy/* default */.Z,QDate: QDate/* default */.Z,QBtn: QBtn/* default */.Z,QTable: QTable/* default */.Z});runtime_auto_import_default()(inviteFriendPromovue_type_script_lang_js, 'directives', {ClosePopup: ClosePopup/* default */.Z});

;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/HotPromotion.vue?vue&type=script&lang=js










/* harmony default export */ const HotPromotionvue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo: claimPromo,
    SJBPromo: shiJieBei,
    InviteFriendPromo: inviteFriendPromo
  },
  props: {
    list: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      isCommonPromo: null,
      activeKey: "1",
      hotPromoList: [
        // {
        //   id: 19,
        //   bg: require("../assets/images/promotion/hotpromo/19/bg.png"),
        //   contents:
        //     "*The rebate bonus needs 1 times rollover before withdrawing and will be returned if not used within 30 days."
        // },
        // {
        //   id: 20,
        //   bg: require("../assets/images/promotion/hotpromo/20/bg.png"),
        //   contents: "Hello hello"
        // },
        // {
        //   id: 21,
        //   bg: "",
        //   contents: "Hello hello"
        // },
        // {
        //   id: 22,
        //   bg: require("../assets/images/promotion/hotpromo/22/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day."
        //   }
        // },
        // {
        //   id: 23,
        //   bg: require("../assets/images/promotion/hotpromo/23/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day."
        //   }
        // },
        // {
        //   id: 24,
        //   bg: require("../assets/images/promotion/hotpromo/24/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day."
        //   }
        // }
      ],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      }
    };
  },
  methods: {
    handleSlot() {
      const bonusItem = this.list.promoCode;
      const eventUrl = "/bonus/claim/" + bonusItem;
      this.btnLoading = true;
      axios.eventapi.put(eventUrl).then(res => {
        this.btnLoading = false;
        var responseCode = res.data;
        if (responseCode.code === 0) {
          var rebatePoint = responseCode.data;
          this.claimMsg = "$" + rebatePoint;
          this.isClaimModal = true;
        } else {
          this.btnLoading = false;
        }
      }).catch(error => {
        this.btnLoading = false;
      });
    }
  },
  mounted() {
    this.hotPromoList.forEach(element => {
      if (this.list.id === element.id) {
        this.selectedHotPromo = element;
      }
    });
    if (this.list.id === 30 || this.list.id === 40 || this.list.id === 35) {
      this.isCommonPromo = false;
    } else {
      this.isCommonPromo = true;
    }
    const store = (0,stores/* userStore */.H)();
    if (this.list.id == 30) {
      // console.log("Iphone promo");
      // this.loadLNWinnerList();
      if (store.hasToken()) {
        this.filterWinnerLists();
      }
    }
  },
  setup() {
    const $q = (0,use_quasar/* default */.Z)();
    const store = (0,stores/* userStore */.H)();
    var qs = __webpack_require__(51470);
    const lucky_number = (0,reactivity_esm_bundler/* ref */.iH)('');
    const loading = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const btnLoading = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const isClaimModal = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const claimMsg = (0,reactivity_esm_bundler/* ref */.iH)('');
    const formState = (0,reactivity_esm_bundler/* ref */.iH)({
      dateTime: "",
      onlyMe: false,
      resultTime: ""
    });
    const filterColumn = (0,reactivity_esm_bundler/* ref */.iH)([{
      name: 'number',
      label: 'เบอร์',
      field: 'number',
      align: 'left',
      sortable: true
    }, {
      name: 'name',
      label: 'ชื่อ',
      field: 'loginName',
      align: 'left',
      sortable: true
    }, {
      name: 'status',
      label: 'สถานะ',
      field: 'winStatus',
      align: 'left',
      sortable: true
    }, {
      name: 'date',
      label: 'วันที่',
      field: 'date',
      align: 'left',
      sortable: true
    }]);
    const dataSource = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const winnerDataSource = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const winnerColumn = [{
      name: 'number',
      label: 'เบอร์',
      field: 'number',
      align: 'left',
      sortable: true
    }, {
      name: 'name',
      label: 'ชื่อ',
      field: 'loginName',
      align: 'left',
      sortable: true
    }, {
      name: 'status',
      label: 'สถานะ',
      field: 'winStatus',
      align: 'left',
      sortable: true
    }, {
      name: 'date',
      label: 'วันที่',
      field: 'date',
      align: 'left',
      sortable: true
    }];
    const filterWinnerLists = () => {
      var resultTime = formState.value.resultTime;
      var winnerUrl = "/privi/winners";
      if (resultTime) {
        winnerUrl += "?resultTime=" + resultTime;
      }

      // console.log(winnerUrl);

      winnerDataSource.value = [];
      loading.value = true;
      axios.eventapi.get(winnerUrl).then(res => {
        loading.value = false;
        var data = res.data.data;
        for (let i in data) {
          lodash.each(data[i].winners, function (winner, index) {
            winner.date = moment_default()(data[i].resultTime).format("DD/MM/YYYY");
            winnerDataSource.value.push(winner);
          });
        }
      });
    };

    // const loadLNWinnerList = () => {
    //   const winnerUrl = "/privi/winners";
    //   winnerDataSource.value = [];
    //   loading.value = true;
    //   eventapi
    //     .get(winnerUrl)
    //     .then((res) => {
    //       loading.value = false;
    //       var data = res.data.data;

    //       for (let i in data) {
    //         _.each(data[i].winners, function (winner, index) {

    //           winner.date = moment(data[i].resultTime).format("DD/MM/YYYY");
    //           console.log(winner);

    //           winnerDataSource.value.push(winner);
    //         })
    //       }
    //     });
    // }

    const filterLuckyNumber = () => {
      loading.value = true;
      dataSource.value = [];
      var filterDate = formState.value.dateTime;
      var onlyMe = formState.value.onlyMe;
      var onlyMeParam = "";
      if (onlyMe) {
        var user_id = store.id;
        onlyMeParam = "&memberId=" + user_id;
      }
      var filterUrl = "/privi/selectedNumbers?recordTime=" + filterDate + onlyMeParam;

      // console.log(filterDate);
      axios.eventapi.get(filterUrl).then(res => {
        loading.value = false;
        var data = res.data.data;
        lodash.each(data, function (item, index) {
          item.date = moment_default()(item.recordTime).format("DD/MM/YYYY");
          dataSource.value.push(item);
        });
        console.log(dataSource.value);
      }).catch(error => {
        loading.value = false;
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: error.message,
        //   icon: "report_problem"
        // });
      });
    };
    // const ClaimDailyRebate = (id) => {
    //   if (!store.hasToken()) {
    //   } else {
    //     // var user_id = store.id;
    //     var claim_id = '';
    //     if (id == 27) {
    //       claim_id = 'jolly88-daily-rebate';
    //     } else if (id == 32) {
    //       claim_id = 'jolly88-daily-slot';
    //     } else if (id == 31) {
    //       claim_id = 'jolly88-refund';
    //     }

    //     // console.log(eventapi);

    // }
    // }

    const submitLuckyNumber = () => {
      console.log(lucky_number.value);
      var submit_number = lucky_number.value.toString();
      if (submit_number.length !== 3) {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "ขีดสุด 3 ตัวเลข",
        //   icon: "report_problem"
        // });
      } else {
        var user_id = store.id;
        var postData = {};
        postData.number = submit_number;
        postData.promoCode = 'jolly88-iphone';
        var luckyNumberUrl = "/privi/lotteryNumber";
        btnLoading.value = true;
        axios.eventapi.post(luckyNumberUrl, qs.stringify(postData)).then(res => {
          btnLoading.value = false;
          var responseCode = res.data;
          console.log(responseCode);
          if (responseCode.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "ส่งหมายเลข",
              icon: "check_circle_outline"
            });
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: responseCode.message,
            //   icon: "report_problem"
            // });
          }
        }).catch(error => {
          btnLoading.value = false;
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });
      }
    };

    return {
      store,
      lucky_number,
      submitLuckyNumber,
      // loadLNWinnerList,
      filterLuckyNumber,
      filterWinnerLists,
      formState,
      dataSource,
      winnerDataSource,
      winnerColumn,
      filterColumn,
      loading,
      btnLoading,
      isClaimModal,
      claimMsg
    };
  }
}));
;// CONCATENATED MODULE: ./src/components/HotPromotion.vue?vue&type=script&lang=js
 
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
// EXTERNAL MODULE: ./node_modules/quasar/src/components/toggle/QToggle.js
var QToggle = __webpack_require__(23175);
;// CONCATENATED MODULE: ./src/components/HotPromotion.vue




;


const HotPromotion_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(HotPromotionvue_type_script_lang_js, [['render',HotPromotionvue_type_template_id_65f2ee10_render]])

/* harmony default export */ const HotPromotion = (HotPromotion_exports_);
;

















runtime_auto_import_default()(HotPromotionvue_type_script_lang_js, 'components', {QBtn: QBtn/* default */.Z,QForm: QForm/* default */.Z,QInput: QInput/* default */.Z,QCardSection: QCardSection/* default */.Z,QTabs: QTabs/* default */.Z,QTab: QTab/* default */.Z,QSeparator: QSeparator/* default */.Z,QTabPanels: QTabPanels/* default */.Z,QTabPanel: QTabPanel/* default */.Z,QIcon: QIcon/* default */.Z,QPopupProxy: QPopupProxy/* default */.Z,QDate: QDate/* default */.Z,QToggle: QToggle/* default */.Z,QTable: QTable/* default */.Z,QDialog: QDialog/* default */.Z,QCard: QCard/* default */.Z,QCardActions: QCardActions/* default */.Z});runtime_auto_import_default()(HotPromotionvue_type_script_lang_js, 'directives', {ClosePopup: ClosePopup/* default */.Z});

;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/PromoPage.vue?vue&type=script&lang=js









// import { loadPromo } from "src/api/index/promo.js";
// import { loadPromoBanner } from "src/api/index/promo";


// import HotPromotion from 'components/HotPromotion'
/* harmony default export */ const PromoPagevue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "PromoView",
  components: {
    RiFunctionLine: vue_remix_icons_es/* RiFunctionLine */.yTT,
    HotPromotion: HotPromotion
  },
  setup() {
    const store = (0,stores/* userStore */.H)();
    const imgURL = "https://xinfa-files.s3.ap-southeast-1.amazonaws.com/game" + '/';
    const banner = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const promoState = (0,reactivity_esm_bundler/* reactive */.qj)({
      active: {
        value: 'ALL',
        label: 'ทั้งหมด'
      },
      promoList: []
    });
    const promoTypes = (0,reactivity_esm_bundler/* ref */.iH)([{
      value: "ALL",
      label: "ทั้งหมด"
    }, {
      value: "WELCOME",
      label: "ยินดีต้อนรับ"
    }, {
      value: "SPORT",
      label: "กีฬา"
    }, {
      value: "LIVE CASINO",
      label: "ไลฟ์คาสิโน"
    }, {
      value: "SLOT",
      label: "สล็อต"
    }]);
    const promoTabActive = (0,reactivity_esm_bundler/* ref */.iH)(promoTypes.value[0].value);
    const filteredArray = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const isPromoDetail = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const selectedPromo = (0,reactivity_esm_bundler/* ref */.iH)({});
    const route = (0,vue_router/* useRoute */.yj)();
    const router = (0,vue_router/* useRouter */.tv)();
    const $q = (0,use_quasar/* default */.Z)();
    const ui = (0,stores_ui/* useUI */.l)();
    (0,runtime_core_esm_bundler/* watch */.YP)(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false;
      } else {
        isPromoDetail.value = route.query.id;
        ui.setScrollPosition("vertical", 0, 200);
      }
    });
    const loadBanner = () => {
      // loadPromoBanner("PROMO").then((res) => {
      //   if (res.code === 0) {
      //       banner.value = res.data[0]
      //   }
      // })
      axios.api.get("/promo/banner?category=PROMO").then(res => {
        const ret = res.data;
        if (ret.code === 0) {
          banner.value = ret.data[0];
          console.log(banner);
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: ret.message,
          //   icon: "report_problem"
          // });
        }
        // banners.value = response.data;
      });
    };

    const showPromoDetails = promo => {
      router.push({
        path: '/promo',
        query: {
          id: promo.id
        }
      });
      isPromoDetail.value = true;
      selectedPromo.value = promo;
    };
    const switchPromoType = type => {
      promoTabActive.value = type.value;
      if (type.value !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function (promo) {
          return promo.promoType.toLowerCase().includes(type.value.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList;
      }
    };
    const loadAll = () => {
      axios.api.get("/promo/page").then(ret => {
        const res = ret.data;
        if (res.code === 0) {
          promoState.promoList.push(...res.data);
          if (route.query.id) {
            promoState.promoList.forEach(element => {
              if (String(element.id) === route.query.id) {
                showPromoDetails(element);
              }
            });
          }
        }
      }).catch(e => {
        console.log("error", e);
      });

      // loadPromo().then((res) => {
      //   if(res.code === 0) {
      //     promoState.promoList.push(...res.data);
      //   }
      // }).catch((e) => { console.log("error", e); });
      switchPromoType(promoState.active);
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      loadBanner();
      loadAll();
    });
    return {
      promoState,
      promoTypes,
      promoTabActive,
      switchPromoType,
      filteredArray,
      isPromoDetail,
      showPromoDetails,
      selectedPromo,
      banner,
      imgURL,
      store
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/PromoPage.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/pages/PromoPage.vue




;




const PromoPage_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(PromoPagevue_type_script_lang_js, [['render',render],['__scopeId',"data-v-39530264"]])

/* harmony default export */ const PromoPage = (PromoPage_exports_);

/***/ }),

/***/ 40446:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/icon.ef2dd405.png";

/***/ }),

/***/ 15970:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/icon.6929a517.png";

/***/ }),

/***/ 16856:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/icon.a42a7775.png";

/***/ }),

/***/ 7392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/icon.3df1e978.png";

/***/ }),

/***/ 1897:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/icon.8c0560bf.png";

/***/ }),

/***/ 39666:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/icon.4fbd250c.png";

/***/ }),

/***/ 30410:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/icon.53b2cabd.png";

/***/ }),

/***/ 12966:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "img/extra.59b65cab.png";

/***/ }),

/***/ 1143:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./22/icon.png": 40446,
	"./23/icon.png": 15970,
	"./27/icon.png": 16856,
	"./31/icon.png": 7392,
	"./32/icon.png": 1897,
	"./35/icon.png": 39666,
	"./39/icon.png": 30410
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
webpackContext.id = 1143;

/***/ })

}]);
//# sourceMappingURL=843.js.map