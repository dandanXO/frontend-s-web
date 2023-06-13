"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[725],{

/***/ 56725:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ MailboxView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(86970);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/account/MailboxView.vue?vue&type=template&id=4a481ca2&scoped=true

const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.dD)("data-v-4a481ca2"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.Cn)(), n);
const _hoisted_1 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
  class: "menu-title-container"
}, null, -1));
const _hoisted_2 = {
  class: "mail-wrapper"
};
const _hoisted_3 = {
  class: "bottom-content"
};
const _hoisted_4 = {
  class: "left-list"
};
const _hoisted_5 = {
  class: "buttons"
};
const _hoisted_6 = {
  class: "left-btns"
};
const _hoisted_7 = {
  class: "new"
};
const _hoisted_8 = {
  class: "mail-list"
};
const _hoisted_9 = {
  key: 0
};
const _hoisted_10 = {
  key: 0,
  style: {
    "flex": "2"
  }
};
const _hoisted_11 = ["onClick"];
const _hoisted_12 = {
  class: "mailbox-title"
};
const _hoisted_13 = ["innerHTML"];
const _hoisted_14 = {
  class: "txt-right"
};
const _hoisted_15 = {
  class: "mailbox-item"
};
const _hoisted_16 = {
  class: "mailbox-title"
};
const _hoisted_17 = {
  class: "txt-right"
};
const _hoisted_18 = ["innerHTML"];
const _hoisted_19 = {
  key: 1,
  style: {
    "flex": "3"
  },
  class: "viewmail"
};
const _hoisted_20 = {
  class: "newmail-section"
};
const _hoisted_21 = {
  key: 0,
  class: "mail-list"
};
const _hoisted_22 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */._)("span", {
  class: "mailbox-list no-message"
}, "ขณะนี้ยังไม่มีข้อความ", -1));
const _hoisted_23 = [_hoisted_22];
function render(_ctx, _cache) {
  const _component_RiMailAddLine = (0,runtime_core_esm_bundler/* resolveComponent */.up)("RiMailAddLine");
  const _component_q_input = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-input");
  const _component_q_btn = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-btn");
  const _component_q_form = (0,runtime_core_esm_bundler/* resolveComponent */.up)("q-form");
  return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, [_hoisted_1, (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C_)(["inbox-btn", {
      active: !_ctx.viewSentList
    }]),
    onClick: _cache[0] || (_cache[0] = $event => _ctx.mailTabChange('inbox'))
  }, " ข้อความ ", 2), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C_)(["sent-btn", {
      active: _ctx.viewSentList
    }]),
    onClick: _cache[1] || (_cache[1] = $event => _ctx.mailTabChange('sent'))
  }, " ข้อความส่งออก ", 2)]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    class: "rounded-btn",
    onClick: _cache[2] || (_cache[2] = $event => _ctx.newMailVisible = true)
  }, [(0,runtime_core_esm_bundler/* createTextVNode */.Uk)(" เขียน "), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_7, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_RiMailAddLine)])])]), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_8, [_ctx.mailboxState.mailboxList[_ctx.mailboxState.active].list.length > 0 ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_9, [!_ctx.newMailVisible ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_10, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C_)(["mailbox-list", {
      hide: _ctx.mailOpened
    }])
  }, [((0,runtime_core_esm_bundler/* openBlock */.wg)(true), (0,runtime_core_esm_bundler/* createElementBlock */.iD)(runtime_core_esm_bundler/* Fragment */.HY, null, (0,runtime_core_esm_bundler/* renderList */.Ko)(_ctx.mailboxState.mailboxList[_ctx.mailboxState.active].list, (m, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C_)(["mailbox-item", {
        active: _ctx.selectedId === m.id,
        unread: m.status
      }]),
      key: m.id,
      onClick: $event => _ctx.selectItem(m, index)
    }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_12, (0,shared_esm_bundler/* toDisplayString */.zw)(m.title), 1), (0,runtime_core_esm_bundler/* createElementVNode */._)("p", {
      class: "mailbox-content",
      innerHTML: m.content
    }, null, 8, _hoisted_13), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_14, (0,shared_esm_bundler/* toDisplayString */.zw)(m.readTime), 1)], 10, _hoisted_11);
  }), 128))], 2)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), !_ctx.newMailVisible && _ctx.selectedId ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
    key: 1,
    style: {
      "flex": "3"
    },
    class: (0,shared_esm_bundler/* normalizeClass */.C_)(["openedmail", {
      active: _ctx.mailOpened
    }])
  }, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", {
    class: "b-button",
    onClick: _cache[3] || (_cache[3] = $event => _ctx.mailOpened = false)
  }, "ย้อนกลับ"), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_15, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_16, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.mailDetailList.title), 1), (0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_17, (0,shared_esm_bundler/* toDisplayString */.zw)(_ctx.mailDetailList.readTime), 1), (0,runtime_core_esm_bundler/* createElementVNode */._)("p", {
    class: "mailbox-content",
    innerHTML: _ctx.mailDetailList.content
  }, null, 8, _hoisted_18)])], 2)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), !_ctx.newMailVisible && !_ctx.selectedId ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", {
    key: 2,
    style: {
      "flex": "3"
    },
    class: (0,shared_esm_bundler/* normalizeClass */.C_)(["closedmail", {
      active: !_ctx.mailOpened
    }])
  }, " There are no messages selected. ", 2)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true), _ctx.newMailVisible ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_19, [(0,runtime_core_esm_bundler/* createElementVNode */._)("div", _hoisted_20, [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_form, {
    ref: "formRef",
    hideRequiredMark: true,
    model: _ctx.mailboxState.mailboxList.write,
    rules: _ctx.rules,
    colon: false,
    "label-col": {
      span: 2
    }
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.w5)(() => [(0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
      filled: "",
      rules: [val => val && val.length > 0 || 'ต้องระบุชื่อเรื่อง', val => val && val.length < 255 || 'ความยาวควรน้อยกว่า 255'],
      ref: "titleRef",
      name: "title",
      class: "q-mb-md",
      counter: "",
      "bottom-slots": "",
      maxlength: "255",
      modelValue: _ctx.mailboxState.mailboxList.write.title,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => _ctx.mailboxState.mailboxList.write.title = $event),
      placeholder: "เรื่อง"
    }, null, 8, ["rules", "modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_input, {
      ref: "contentRef",
      rules: [val => val && val.length > 0 || 'กรุณาใส่ข้อมูล', val => val && val.length < 501 || 'ความยาวควรน้อยกว่า 500'],
      name: "content",
      filled: "",
      type: "textarea",
      "auto-size": {
        minRows: 4,
        maxRows: 16
      },
      class: "mail-txtarea q-mb-md",
      counter: "",
      maxlength: "500",
      modelValue: _ctx.mailboxState.mailboxList.write.content,
      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => _ctx.mailboxState.mailboxList.write.content = $event),
      placeholder: "ข้อความไม่สามารถปล่อยว่างได้"
    }, null, 8, ["rules", "modelValue"]), (0,runtime_core_esm_bundler/* createVNode */.Wm)(_component_q_btn, {
      color: "brand",
      onClick: _ctx.onSubmit,
      label: "ส่ง"
    }, null, 8, ["onClick"])]),
    _: 1
  }, 8, ["model", "rules"])])])) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)]), _ctx.mailboxState.mailboxList[_ctx.mailboxState.active].list.length <= 0 && !_ctx.newMailVisible ? ((0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_21, _hoisted_23)) : (0,runtime_core_esm_bundler/* createCommentVNode */.kq)("", true)])])])], 64);
}
;// CONCATENATED MODULE: ./src/pages/account/MailboxView.vue?vue&type=template&id=4a481ca2&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(69665);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./node_modules/vue-remix-icons/dist/vue-remix-icons.es.js
var vue_remix_icons_es = __webpack_require__(5253);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/account/MailboxView.vue?vue&type=script&lang=js


// import { mailInbox, mailOutbox, wirteMail } from "@/api/personal/mailbox";



var qs = __webpack_require__(51470);
/* harmony default export */ const MailboxViewvue_type_script_lang_js = ((0,runtime_core_esm_bundler/* defineComponent */.aZ)({
  name: "MailboxView",
  components: {
    RiMailAddLine: vue_remix_icons_es/* RiMailAddLine */.ge_
  },
  setup() {
    const mailboxState = (0,reactivity_esm_bundler/* reactive */.qj)({
      active: "inbox",
      mailboxList: {
        inbox: {
          list: [],
          pageNum: null,
          pageSize: null,
          total: 0
        },
        sent: {
          list: [],
          pageNum: null,
          pageSize: null,
          total: 0,
          orderBy: 'createTime'
        },
        write: {
          title: "",
          content: ""
        }
      }
    });
    const $q = (0,use_quasar/* default */.Z)();
    const mailboxData = (0,reactivity_esm_bundler/* ref */.iH)({});
    const mailOpened = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const viewSentList = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const newMailVisible = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const selectedIndex = (0,reactivity_esm_bundler/* ref */.iH)(null);
    const selectedId = (0,reactivity_esm_bundler/* ref */.iH)(false);
    const selectItem = (item, index) => {
      selectedId.value = item.id;
      mailOpened.value = true;
      newMailVisible.value = false;
      selectedIndex.value = index;
      mailDetailList.value = item;
      item.status = '';
    };
    const loadPersonalMailbox = () => {
      mailboxState.mailboxList[mailboxState.active].list = [];
      if (mailboxState.active === 'inbox') {
        mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList[mailboxState.active].pageNum,
          size: mailboxState.mailboxList[mailboxState.active].pageSize,
          orderBy: "sendTime"
        };
        $q.loading.show({
          message: 'กำลังโหลด...'
        });
        axios.api.get("/session/inbox", {
          params: {
            type: mailboxData.value.type,
            current: mailboxData.value.current,
            size: mailboxData.value.size,
            orderBy: mailboxData.value.orderBy
          }
        }).then(res => {
          $q.loading.hide();
          const response = res.data;
          if (response.code === 0) {
            mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
          }
        }).catch(error => {
          $q.loading.hide();
          console.log("error", error);
        });
      }
      if (mailboxState.active === 'sent') {
        mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList[mailboxState.active].pageNum,
          size: mailboxState.mailboxList[mailboxState.active].pageSize,
          orderBy: "createTime"
        };
        $q.loading.show({
          message: 'กำลังโหลด...'
        });
        axios.api.get("/session/outbox", {
          params: {
            type: mailboxData.value.type,
            current: mailboxData.value.current,
            size: mailboxData.value.size,
            orderBy: mailboxData.value.orderBy
          }
        }).then(res => {
          $q.loading.hide();
          const response = res.data;
          if (response.code === 0) {
            mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
            mailboxState.mailboxList[mailboxState.active].total = response.data.total;
          }
        }).catch(error => {
          $q.loading.hide();
          console.log("error", error);
        });
      }
    };
    const changePage = (page, pageSize) => {
      loadPersonalMailbox(page, pageSize);
      // const pageSize = 2
    };

    const mailTabChange = nk => {
      selectedId.value = null;
      mailOpened.value = false;
      mailboxData.value = {
        type: null,
        current: mailboxState.mailboxList[nk].pageNum,
        size: mailboxState.mailboxList[nk].pageSize,
        orderBy: 'createTime'
      };
      if (nk === 'sent') {
        mailboxState.active = 'sent';
        viewSentList.value = true;
        loadPersonalMailbox();
      } else if (nk === 'inbox') {
        mailboxState.active = 'inbox';
        viewSentList.value = false;
        loadPersonalMailbox();
      }
      newMailVisible.value = false;
    };
    (0,runtime_core_esm_bundler/* onMounted */.bv)(() => {
      loadPersonalMailbox();
    });
    const formRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const mailDetailList = (0,reactivity_esm_bundler/* ref */.iH)({});
    const rules = {
      title: [{
        required: true,
        message: "ต้องระบุชื่อเรื่อง",
        trigger: "blur"
      }, {
        max: 255,
        message: "Length should less then 255",
        trigger: "change"
      }],
      content: [{
        required: true,
        message: "content is required",
        trigger: "blur"
      }, {
        max: 500,
        message: "Length should less then 500",
        trigger: "change"
      }]
    };
    const titleRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const contentRef = (0,reactivity_esm_bundler/* ref */.iH)();
    const onSubmit = () => {
      titleRef.value.validate();
      contentRef.value.validate();
      if (titleRef.value.hasError || contentRef.value.hasError) {
        $q.loading.hide();
      } else {
        axios.api.post("/session/writeOutbox", qs.stringify(mailboxState.mailboxList.write)).then(ret => {
          const response = ret.data;
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "สำเร็จ",
              icon: "check_circle_outline"
            });
            mailboxState.mailboxList.write.title = "";
            mailboxState.mailboxList.write.content = "";
            newMailVisible.value = false;
            mailTabChange('sent');
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
      }
    };
    return {
      mailboxState,
      loadPersonalMailbox,
      mailTabChange,
      changePage,
      formRef,
      rules,
      onSubmit,
      viewSentList,
      newMailVisible,
      selectItem,
      selectedIndex,
      mailDetailList,
      mailOpened,
      selectedId,
      mailboxData,
      titleRef,
      contentRef
    };
  }
}));
;// CONCATENATED MODULE: ./src/pages/account/MailboxView.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(11639);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/form/QForm.js
var QForm = __webpack_require__(8326);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/input/QInput.js + 2 modules
var QInput = __webpack_require__(66611);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/btn/QBtn.js
var QBtn = __webpack_require__(68879);
// EXTERNAL MODULE: ./node_modules/quasar/src/components/pagination/QPagination.js
var QPagination = __webpack_require__(80996);
// EXTERNAL MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/runtime.auto-import.js
var runtime_auto_import = __webpack_require__(69984);
var runtime_auto_import_default = /*#__PURE__*/__webpack_require__.n(runtime_auto_import);
;// CONCATENATED MODULE: ./src/pages/account/MailboxView.vue




;




const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(MailboxViewvue_type_script_lang_js, [['render',render],['__scopeId',"data-v-4a481ca2"]])

/* harmony default export */ const MailboxView = (__exports__);
;




runtime_auto_import_default()(MailboxViewvue_type_script_lang_js, 'components', {QForm: QForm/* default */.Z,QInput: QInput/* default */.Z,QBtn: QBtn/* default */.Z,QPagination: QPagination/* default */.Z});


/***/ })

}]);
//# sourceMappingURL=725.js.map