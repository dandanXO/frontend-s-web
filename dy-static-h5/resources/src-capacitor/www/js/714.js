"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[714],{

/***/ 48714:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ TransitRecordView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/account/TransitRecordView.vue?vue&type=template&id=ae5b647e&scoped=true

const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-ae5b647e"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  className: "menu-title-container"
}, null, -1));
const _hoisted_2 = {
  class: "account-content transit"
};
const _hoisted_3 = {
  class: "left"
};
const _hoisted_4 = {
  class: "row items-center justify-end"
};
const _hoisted_5 = {
  class: "row items-center justify-end"
};
const _hoisted_6 = {
  class: "left"
};
const _hoisted_7 = {
  class: "row items-center justify-end"
};
const _hoisted_8 = {
  class: "row items-center justify-end"
};
const _hoisted_9 = {
  class: "left"
};
const _hoisted_10 = {
  class: "row items-center justify-end"
};
const _hoisted_11 = {
  class: "row items-center justify-end"
};
const _hoisted_12 = {
  class: "left"
};
const _hoisted_13 = {
  class: "row items-center justify-end"
};
const _hoisted_14 = {
  class: "row items-center justify-end"
};
const _hoisted_15 = {
  class: "my-table-details"
};
const _hoisted_16 = {
  class: "left"
};
const _hoisted_17 = {
  class: "row items-center justify-end"
};
const _hoisted_18 = {
  class: "row items-center justify-end"
};
const _hoisted_19 = {
  class: "payout-total"
};
const _hoisted_20 = {
  class: "left"
};
const _hoisted_21 = {
  class: "row items-center justify-end"
};
const _hoisted_22 = {
  class: "row items-center justify-end"
};
const _hoisted_23 = {
  class: "left"
};
function render(_ctx, _cache) {
  const _component_q_tab = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-tab");
  const _component_q_tabs = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-tabs");
  const _component_q_separator = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-separator");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_date = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-date");
  const _component_q_popup_proxy = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-popup-proxy");
  const _component_q_icon = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-icon");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  const _component_q_td = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-td");
  const _component_q_table = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-table");
  const _component_q_tab_panel = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-tab-panel");
  const _component_q_badge = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-badge");
  const _component_q_select = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-select");
  const _component_q_tab_panels = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-tab-panels");
  const _component_q_dialog = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-dialog");
  const _directive_close_popup = (0,runtime_core_esm_bundler/* resolveDirective */.Q2)("close-popup");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", null, [_hoisted_1, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tabs, {
    modelValue: _ctx.recordActive,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.recordActive = $event),
    class: "form-wrapped"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab, {
      name: "deposit",
      label: "ฝาก"
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab, {
      name: "turnover",
      label: "กำไร"
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab, {
      name: "withdraw",
      label: "ถอน"
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab, {
      name: "rebates",
      label: "เงินคืน"
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab, {
      name: "gameBetRecord",
      label: "บันทึกการเดิมพัน"
    })]),
    _: 1
  }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_separator), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panels, {
    modelValue: _ctx.recordActive,
    "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => _ctx.recordActive = $event),
    animated: ""
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
      name: "deposit"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
        layout: "inline",
        model: _ctx.searchForm.deposit
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.deposit.startDate,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.searchForm.deposit.startDate = $event)
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
                modelValue: _ctx.searchForm.deposit.startDate,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.searchForm.deposit.startDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_4, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.deposit.endDate,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => _ctx.searchForm.deposit.endDate = $event)
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
                modelValue: _ctx.searchForm.deposit.endDate,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => _ctx.searchForm.deposit.endDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_5, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          class: "q-mb-md",
          label: "ค้นหา",
          color: "brand",
          onClick: _ctx.searchRecord
        }, null, 8, ["onClick"])]),
        _: 1
      }, 8, ["model"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
        loading: _ctx.loading,
        columns: _ctx.tableColumns.deposit,
        rows: _ctx.dataState.deposit,
        "no-data-label": _ctx.noDataLabel,
        "rows-per-page-label": _ctx.rowPerPageLabel,
        "row-key": "serialNumber"
      }, {
        "body-cell-status": (0,runtime_core_esm_bundler/* withCtx */.w5)(props => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_td, {
          props: props
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.getDepositStatus(props.value)), 1)]),
          _: 2
        }, 1032, ["props"])]),
        _: 1
      }, 8, ["loading", "columns", "rows", "no-data-label", "rows-per-page-label"])]),
      _: 1
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
      name: "turnover"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
        layout: "inline",
        model: _ctx.searchForm.turnover
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_6, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.turnover.startDate,
          "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => _ctx.searchForm.turnover.startDate = $event)
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
                modelValue: _ctx.searchForm.turnover.startDate,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => _ctx.searchForm.turnover.startDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_7, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.turnover.endDate,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => _ctx.searchForm.turnover.endDate = $event)
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
                modelValue: _ctx.searchForm.turnover.endDate,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => _ctx.searchForm.turnover.endDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_8, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          class: "q-mb-md",
          label: "ค้นหา",
          color: "brand",
          onClick: _ctx.searchRecord
        }, null, 8, ["onClick"])]),
        _: 1
      }, 8, ["model"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
        loading: _ctx.loading,
        columns: _ctx.tableColumns.turnover,
        rows: _ctx.dataState.turnover,
        "no-data-label": _ctx.noDataLabel,
        "rows-per-page-label": _ctx.rowPerPageLabel,
        "row-key": "serialNumber"
      }, {
        "body-cell-type": (0,runtime_core_esm_bundler/* withCtx */.w5)(props => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_td, {
          props: props
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.getTurnoverType(props.value)), 1)]),
          _: 2
        }, 1032, ["props"])]),
        _: 1
      }, 8, ["loading", "columns", "rows", "no-data-label", "rows-per-page-label"])]),
      _: 1
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
      name: "withdraw"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
        layout: "inline",
        model: _ctx.searchForm.withdraw
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_9, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.withdraw.startDate,
          "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => _ctx.searchForm.withdraw.startDate = $event)
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
                modelValue: _ctx.searchForm.withdraw.startDate,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => _ctx.searchForm.withdraw.startDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_10, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.withdraw.endDate,
          "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => _ctx.searchForm.withdraw.endDate = $event)
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
                modelValue: _ctx.searchForm.withdraw.endDate,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => _ctx.searchForm.withdraw.endDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_11, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          class: "q-mb-md",
          label: "ค้นหา",
          color: "brand",
          onClick: _ctx.searchRecord
        }, null, 8, ["onClick"])]),
        _: 1
      }, 8, ["model"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
        loading: _ctx.loading,
        columns: _ctx.tableColumns.withdraw,
        rows: _ctx.dataState.withdraw,
        "no-data-label": _ctx.noDataLabel,
        "rows-per-page-label": _ctx.rowPerPageLabel,
        "row-key": "serialNumber"
      }, {
        "body-cell-status": (0,runtime_core_esm_bundler/* withCtx */.w5)(props => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_td, {
          props: props
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.getWithdrawStatus(props.value)), 1)]),
          _: 2
        }, 1032, ["props"])]),
        _: 1
      }, 8, ["loading", "columns", "rows", "no-data-label", "rows-per-page-label"])]),
      _: 1
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
      name: "transfer"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
        layout: "inline",
        model: _ctx.searchForm.transfer
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_12, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.transfer.startDate,
          "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => _ctx.searchForm.transfer.startDate = $event)
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
                modelValue: _ctx.searchForm.transfer.startDate,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => _ctx.searchForm.transfer.startDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_13, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.transfer.endDate,
          "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => _ctx.searchForm.transfer.endDate = $event)
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
                modelValue: _ctx.searchForm.transfer.endDate,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => _ctx.searchForm.transfer.endDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_14, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          class: "q-mb-md",
          label: "ค้นหา",
          color: "brand",
          onClick: _ctx.searchRecord
        }, null, 8, ["onClick"])]),
        _: 1
      }, 8, ["model"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
        loading: _ctx.loading,
        columns: _ctx.tableColumns.transfer,
        rows: _ctx.dataState.transfer,
        "no-data-label": _ctx.noDataLabel,
        "rows-per-page-label": _ctx.rowPerPageLabel,
        "row-key": "serialNumber"
      }, {
        "body-cell-serialNumber": (0,runtime_core_esm_bundler/* withCtx */.w5)(props => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_td, {
          props: props
        }, {
          default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_badge, {
            color: "purple",
            label: props.value
          }, null, 8, ["label"])]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_15, (0,shared_esm_bundler/* toDisplayString */.zw)(props.row.details), 1)]),
          _: 2
        }, 1032, ["props"])]),
        _: 1
      }, 8, ["loading", "columns", "rows", "no-data-label", "rows-per-page-label"])]),
      _: 1
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
      name: "rebates"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
        layout: "inline",
        model: _ctx.searchForm.rebates
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_16, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.rebates.startDate,
          "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => _ctx.searchForm.rebates.startDate = $event)
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
                modelValue: _ctx.searchForm.rebates.startDate,
                "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => _ctx.searchForm.rebates.startDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_17, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.rebates.endDate,
          "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => _ctx.searchForm.rebates.endDate = $event)
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
                modelValue: _ctx.searchForm.rebates.endDate,
                "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => _ctx.searchForm.rebates.endDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_18, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          class: "q-mb-md",
          label: "ค้นหา",
          color: "brand",
          onClick: _ctx.searchRecord
        }, null, 8, ["onClick"])]),
        _: 1
      }, 8, ["model"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
        loading: _ctx.loading,
        columns: _ctx.tableColumns.rebates,
        rows: _ctx.dataState.rebates,
        "no-data-label": _ctx.noDataLabel,
        "rows-per-page-label": _ctx.rowPerPageLabel,
        "row-key": "serialNumber"
      }, null, 8, ["loading", "columns", "rows", "no-data-label", "rows-per-page-label"])]),
      _: 1
    }), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_tab_panel, {
      name: "gameBetRecord"
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_19, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, "ยอดเดิมพัน: " + (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.totalBetRecord.totalBet), 1), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, "ยอดเงินที่จ่าย: " + (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.totalBetRecord.totalPayout), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", null, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
        layout: "inline",
        model: _ctx.searchForm.gameBetRecord
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_20, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.gameBetRecord.startDate,
          "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => _ctx.searchForm.gameBetRecord.startDate = $event)
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
                modelValue: _ctx.searchForm.gameBetRecord.startDate,
                "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => _ctx.searchForm.gameBetRecord.startDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_21, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
          filled: "",
          modelValue: _ctx.searchForm.gameBetRecord.endDate,
          "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => _ctx.searchForm.gameBetRecord.endDate = $event)
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
                modelValue: _ctx.searchForm.gameBetRecord.endDate,
                "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => _ctx.searchForm.gameBetRecord.endDate = $event),
                mask: "YYYY-MM-DD"
              }, {
                default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_22, [(0,runtime_core_esm_bundler/* withDirectives */.wy)((0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
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
        }, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_23, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_select, {
          style: {
            "width": "100%"
          },
          modelValue: _ctx.searchForm.gameBetRecord.platform,
          "onUpdate:modelValue": _cache[25] || (_cache[25] = $event => _ctx.searchForm.gameBetRecord.platform = $event),
          filled: "",
          clearable: "",
          options: _ctx.platformsList,
          label: "แพลตฟอร์มเกม",
          color: "white",
          "label-color": "grey",
          "option-label": "name",
          "option-value": "name",
          "emit-value": "",
          "map-options": ""
        }, null, 8, ["modelValue", "options"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
          class: "q-mb-md",
          label: "ค้นหา",
          color: "brand",
          onClick: _ctx.searchRecord
        }, null, 8, ["onClick"])]),
        _: 1
      }, 8, ["model"])]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
        loading: _ctx.loading,
        columns: _ctx.tableColumns.gameBetRecord,
        rows: _ctx.dataState.gameBetRecord,
        "no-data-label": _ctx.noDataLabel,
        "rows-per-page-label": _ctx.rowPerPageLabel,
        "row-key": "serialNumber"
      }, null, 8, ["loading", "columns", "rows", "no-data-label", "rows-per-page-label"])]),
      _: 1
    })]),
    _: 1
  }, 8, ["modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_dialog, {
    style: {
      "margin": "20px"
    },
    modelValue: _ctx.betRecordDialog,
    "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => _ctx.betRecordDialog = $event)
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_table, {
      loading: _ctx.loading,
      columns: _ctx.tableColumns.betRecord,
      rows: _ctx.dataState.betRecord,
      "no-data-label": _ctx.noDataLabel,
      "rows-per-page-label": _ctx.rowPerPageLabel,
      "row-key": "serialNumber"
    }, null, 8, ["loading", "columns", "rows", "no-data-label", "rows-per-page-label"])]),
    _: 1
  }, 8, ["modelValue"])])]);
}
;// CONCATENATED MODULE: ./src/pages/account/TransitRecordView.vue?vue&type=template&id=ae5b647e&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69665);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./src/stores/index.js
var stores = __webpack_require__(23053);
// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__(43878);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/account/TransitRecordView.vue?vue&type=script&lang=js






const store = (0,stores/* userStore */.H)();
const recordActive = (0,reactivity_esm_bundler/* ref */.iH)("deposit");
const totalBetRecord = (0,reactivity_esm_bundler/* reactive */.qj)({
  totalBet: 0,
  totalPayout: 0
});
const searchForm = (0,reactivity_esm_bundler/* reactive */.qj)({
  turnover: {
    startDate: "",
    endDate: ""
  },
  rebates: {
    startDate: "",
    endDate: ""
  },
  transfer: {
    startDate: "",
    endDate: ""
  },
  withdraw: {
    startDate: "",
    endDate: ""
  },
  deposit: {
    startDate: "",
    endDate: ""
  },
  gameBetRecord: {
    startDate: "",
    endDate: "",
    platform: "",
    memberId: store.id
  },
  betRecord: {
    platform: "",
    gameType: "",
    memberId: store.id
  }
});
const dataState = (0,reactivity_esm_bundler/* reactive */.qj)({
  deposit: [],
  rebates: [],
  transfer: [],
  withdraw: [],
  turnover: [],
  betRecord: [],
  gameBetRecord: []
});
const commonColumns = [{
  label: "Serial Number",
  field: "serialNumber"
}];
const tableColumns = {
  deposit: [...commonColumns, {
    label: "ยอดเงิน",
    field: "depositAmount"
  }, {
    label: "สถานะ",
    field: "status",
    name: "status"
  }, {
    label: "วันที่ฝาก",
    field: "depositDate"
    // slots: { customRender: "depositDate" }
  }],

  withdraw: [...commonColumns, {
    label: "ยอดเงิน",
    field: "withdrawAmount"
  }, {
    label: "สถานะ",
    field: "status",
    name: "status"
  }, {
    label: "วันที่ถอน",
    field: "withdrawDate"
    // slots: { customRender: "withdrawDate" }
  }],

  transfer: [...commonColumns, {
    label: "รายละเอียดการโอน",
    field: "type",
    key: "type"
    // slots: { customRender: "type" }
  }, {
    label: "ยอดเงิน",
    field: "amount",
    key: "withdrawAmount"
  }, {
    label: "สถานะ",
    field: "status",
    key: "status"
    // slots: { customRender: "status" }
  }, {
    label: "เวลาโอน",
    field: "transferDate",
    key: "transferDate"
    // slots: { customRender: "transferDate" }
  }],

  rebates: [...commonColumns, {
    label: "ชื่อผู้มีสิทธิ์สูง",
    field: "privilegeName"
  }, {
    label: "ยอดเงิน",
    field: "amount"
  }, {
    label: "เวลาบันทึก",
    field: "recordTime"
    // slots: { customRender: "recordTime" }
  }],

  turnover: [...commonColumns, {
    label: "รูปแบบ",
    field: "type",
    name: "type"
  }, {
    label: "ยอดเงิน",
    field: "amount"
  }, {
    label: "รูปแบบ",
    field: "subType"
  }, {
    label: "เวลาบันทึก",
    field: "recordTime"
    // slots: { customRender: "recordTime" }
  }],

  betRecord: [{
    label: "รหัสเดิมพัน",
    field: "betId"
  }, {
    label: "รหัสธุรกรรม",
    field: "transactionId"
  }, {
    label: "แพลตฟอร์ม",
    field: "platform"
  }, {
    label: "เดิมพัน",
    field: "bet"
  }, {
    label: "การจ่ายเงิน",
    field: "payout"
  }, {
    label: "วงเงินก่อนหน้า",
    field: "beforeBalance"
  }, {
    label: "วงเงินหลังจาก",
    field: "afterBalance"
  }, {
    label: "สถานะการเดิมพัน",
    field: "betStatus"
  }, {
    label: "ประเภทของเกม",
    field: "gameType"
  }, {
    label: "เวลาเดิมพัน",
    field: "betTime"
    // slots: { customRender: "betTime" }
  }, {
    label: "เวลาชำระเงิน",
    field: "settleTime"
    // slots: { customRender: "settleTime" }
  }, {
    label: "ผลลัพท์",
    field: "result"
  }],
  gameBetRecord: [
  // {
  //   label: "รหัสเดิมพัน",
  //   field: "betId"
  // },
  // {
  //   label: "รหัสธุรกรรม",
  //   field: "transactionId"
  // },
  {
    label: "เกมใหม่",
    field: "gameName"
  }, {
    label: "แพลตฟอร์ม",
    field: "platform"
  }, {
    label: "เดิมพัน",
    field: "bet"
  }, {
    label: "การจ่ายเงิน",
    field: "payout"
  },
  // {
  //   label: "วงเงินก่อนหน้า",
  //   field: "beforeBalance"
  // },
  // {
  //   label: "วงเงินหลังจาก",
  //   field: "afterBalance"
  // },
  // {
  //   label: "สถานะการเดิมพัน",
  //   field: "betStatus"
  // },
  {
    label: "ประเภทของเกม",
    field: "gameType"
  }, {
    name: 'actions',
    label: '',
    field: ''
  }
  // {
  //   label: "เวลาเดิมพัน",
  //   field: "betTime",
  //   // slots: { customRender: "betTime" }
  // },
  // {
  //   label: "เวลาชำระเงิน",
  //   field: "settleTime",
  //   // slots: { customRender: "settleTime" }
  // },
  // {
  //   label: "ผลลัพท์",
  //   field: "result"
  // },
  ]
};

const loading = (0,reactivity_esm_bundler/* ref */.iH)(false);
const pagination = (0,reactivity_esm_bundler/* reactive */.qj)({
  pageSize: 10,
  total: 0
});
/* harmony default export */ const TransitRecordViewvue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "TransitRecordView",
  setup() {
    (0,runtime_core_esm_bundler/* watch */.YP)(recordActive, (currentValue, oldValue) => {
      searchRecord();
    });
    const $q = (0,use_quasar/* default */.Z)();
    const recordUrl = {
      deposit: "/session/member/deposit",
      turnover: "/session/member/moneyChange",
      withdraw: "/session/member/withdraw",
      rebates: "/session/member/privilege",
      gameBetRecord: "/session/member/gameBetRecord"
    };
    const searchRecord = () => {
      loading.value = true;
      if (recordActive.value === 'gameBetRecord') {
        getPlatList();
      }
      axios.api.get(recordUrl[recordActive.value], {
        params: searchForm[recordActive.value]
      }).then(ret => {
        const response = ret.data;
        const dataSource = dataState[recordActive.value];
        dataSource.value = [];
        if (response.code === 0) {
          pagination.total = response.data.length;
          //clear array and then push new record
          dataSource.splice(0);
          dataSource.push(...response.data.records);
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: response.message,
          //   icon: "report_problem"
          // });
        }
      }).catch(error => {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: error.message,
        //   icon: "report_problem"
        // });
        // console.log("error", error);
      }).then(() => {
        loading.value = false;
      });
    };
    const recordPage = pagination => {
      searchForm[recordActive.value].current = pagination.current;
      searchRecord();
    };
    const chgDate = val => {
      var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
      var oldDate = new Date(gapDate);
      var newDate = {
        Y: oldDate.getFullYear() + "-",
        M: oldDate.getMonth() + 1 < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : oldDate.getMonth() + 1 + "-",
        D: oldDate.getDate() < 10 ? "0" + (oldDate.getDate() + "") : oldDate.getDate() + ""
      };
      var useDate = newDate.Y + newDate.M + newDate.D;
      return useDate;
    };
    const getTime = () => {
      ["deposit", "rebates", "transfer", "turnover", "withdraw", "gameBetRecord"].forEach(function (v) {
        if (v in searchForm) {
          searchForm[v].startDate = chgDate(7);
          searchForm[v].endDate = chgDate(0);
        }
      });
      searchRecord();
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      getTime();
    });
    const platformsList = (0,reactivity_esm_bundler/* ref */.iH)([]);
    const getPlatList = () => {
      axios.api.get("/platform").then(res => {
        const ret = res.data;
        if (ret.code === 0) {
          platformsList.value = ret.data;
        }
      });
      const obj = {
        memberId: searchForm.gameBetRecord.memberId,
        platform: searchForm.gameBetRecord.platform,
        startDate: searchForm.gameBetRecord.startDate,
        endDate: searchForm.gameBetRecord.endDate
      };
      axios.api.get("/session/member/gameBetRecordTotal", {
        params: obj
      }).then(res => {
        const ret = res.data;
        if (ret.code === 0) {
          totalBetRecord.totalBet = ret.data.totalBet;
          totalBetRecord.totalPayout = ret.data.totalPayout;
        }
      });
    };
    const betRecordDialog = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const getTurnoverType = turnoverType => {
      if (turnoverType === 'WITHDRAW_FAIL') {
        return 'การถอนเงินล้มเหลว'; // Fail Withdrawal
      } else if (turnoverType === 'WITHDRAW') {
        return 'ถอนเงิน'; // Withdraw
      } else {
        return turnoverType;
      }
    };
    const getWithdrawStatus = withdrawStatus => {
      if (withdrawStatus === 'APPLY') {
        return 'ส่งดำเนินการ'; //Applying
      } else if (withdrawStatus === 'FAIL') {
        return 'ล้มเหลว'; // Failed
      } else if (withdrawStatus === 'SUCCESS') {
        return 'สำเร็จ'; // Success
      } else if (withdrawStatus === 'STEP_1') {
        return 'กำลังตรวจสอบ'; //Under review
      } else if (withdrawStatus === 'STEP_2') {
        return 'กำลังดำเนินการจ่าย'; // To be paid
      } else if (withdrawStatus === 'STEP_3') {
        return 'กำลังดำเนินการโอน'; // Payment on going
      } else if (withdrawStatus === 'STEP_4') {
        return 'ชำระอัตโนมัติ'; // Automatic Payment
      } else if (withdrawStatus === 'STEP_5') {
        return 'ระงับ'; //Suspend
      } else {
        return withdrawStatus;
      }
    };
    const getDepositStatus = depositStatus => {
      if (depositStatus === 'PENDING') {
        return 'รอดำเนินการ'; // Pending
      } else if (depositStatus === 'SUCCESS') {
        return 'สำเร็จ'; // Success
      } else if (depositStatus === 'SUPPLEMENT_SUCCESS') {
        return 'เสริมความสำเร็จ'; // Supplement Success
      } else if (depositStatus === 'CLOSED') {
        return 'ปิด'; // Closed
      } else {
        return depositStatus;
      }
    };
    const betDetails = row => {
      const obj = {
        gameName: row.gameName,
        platform: row.platform,
        betTime: moment_default()(row.betTime).format('yyyy-MM-DD'),
        memberId: searchForm.betRecord.memberId,
        current: searchForm.betRecord.current
      };
      axios.api.get("/session/member/betRecord", {
        params: obj
      }).then(res => {
        const ret = res.data;
        if (ret.code === 0) {
          betRecordDialog.value = true;
          dataState.betRecord = ret.data.records;
        }
      });
    };
    return {
      recordActive,
      searchForm,
      dataState,
      tableColumns,
      commonColumns,
      searchRecord,
      recordPage,
      loading,
      pagination,
      getTime,
      chgDate,
      noDataLabel: "ไม่มีข้อมูล",
      rowPerPageLabel: "บันทึกต่อหน้า",
      humanDatetime(ts) {
        return moment_default()(ts).format("DD-MM-YYYY HH:mm:ss");
      },
      getPlatList,
      platformsList,
      betDetails,
      betRecordDialog,
      totalBetRecord,
      getTurnoverType,
      getWithdrawStatus,
      getDepositStatus
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/account/TransitRecordView.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
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
// EXTERNAL MODULE: ./node_modules/quasar/src/components/form/QForm.js
var QForm = __webpack_require__(8326);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/input/QInput.js + 2 modules
var QInput = __webpack_require__(66611);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/icon/QIcon.js
var QIcon = __webpack_require__(22857);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/popup-proxy/QPopupProxy.js
var QPopupProxy = __webpack_require__(52765);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/date/QDate.js + 3 modules
var QDate = __webpack_require__(34939);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/btn/QBtn.js
var QBtn = __webpack_require__(68879);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/table/QTable.js + 12 modules
var QTable = __webpack_require__(81463);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/table/QTd.js
var QTd = __webpack_require__(67220);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/badge/QBadge.js
var QBadge = __webpack_require__(20990);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/select/QSelect.js + 1 modules
var QSelect = __webpack_require__(4581);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/dialog/QDialog.js
var QDialog = __webpack_require__(32074);
// EXTERNAL MODULE: ./node_modules/quasar/src/directives/ClosePopup.js
var ClosePopup = __webpack_require__(62146);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/account/TransitRecordView.vue




;



const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(TransitRecordViewvue_type_script_lang_js, [['render',render],['__scopeId',"data-v-ae5b647e"]])

/* harmony default export */ const TransitRecordView = (__exports__);
;
















runtime_auto_import_default()(TransitRecordViewvue_type_script_lang_js, 'components', {QTabs: QTabs/* default */.Z,QTab: QTab/* default */.Z,QSeparator: QSeparator/* default */.Z,QTabPanels: QTabPanels/* default */.Z,QTabPanel: QTabPanel/* default */.Z,QForm: QForm/* default */.Z,QInput: QInput/* default */.Z,QIcon: QIcon/* default */.Z,QPopupProxy: QPopupProxy/* default */.Z,QDate: QDate/* default */.Z,QBtn: QBtn/* default */.Z,QTable: QTable/* default */.Z,QTd: QTd/* default */.Z,QBadge: QBadge/* default */.Z,QSelect: QSelect/* default */.Z,QDialog: QDialog/* default */.Z});runtime_auto_import_default()(TransitRecordViewvue_type_script_lang_js, 'directives', {ClosePopup: ClosePopup/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=714.js.map