"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[122],{

/***/ 27122:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ depositLoading)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./src/boot/action.js
var action = __webpack_require__(54540);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
// EXTERNAL MODULE: ./node_modules/quasar/src/composables/use-quasar.js
var use_quasar = __webpack_require__(19302);
// EXTERNAL MODULE: ./node_modules/quasar/src/plugins/Platform.js
var Platform = __webpack_require__(47506);
// EXTERNAL MODULE: ./src/i18n/index.js + 1 modules
var i18n = __webpack_require__(95490);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.mjs
var vue_router = __webpack_require__(28339);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/components/depositLoading.vue?vue&type=script&setup=true&lang=js

const _hoisted_1 = {
  style: {
    "display": "flex",
    "justify-content": "center",
    "align-items": "center",
    "height": "100vh"
  }
};





// import {Preferences} from "@capacitor/preferences";

/* harmony default export */ const depositLoadingvue_type_script_setup_true_lang_js = ({
  __name: 'depositLoading',
  setup(__props) {
    const qs = __webpack_require__(51470);
    async function pDepo(deposit) {
      const obj = {
        bankCardId: deposit.bankCardId,
        localAmount: deposit.localAmount,
        paymentId: deposit.paymentId
      };
      if (deposit.privilegeId) {
        obj.privilegeId = deposit.privilegeId;
      }
      await axios.cashier.post("/session/payment/submit", qs.stringify(obj)).then(d => {
        const res = d.data;
        if (res.code === 0) {
          (0,action/* doIt */.I)(res).then(() => {
            if (!Platform/* default.is.desktop */.ZP.is.desktop) {
              setTimeout(() => {
                router.go(-1);
              }, 1000);
            }
            $q.loading.hide();
            postMessage({
              msg: "success"
            }, "*");
          });
        } else {
          postMessage({
            msg: res.message === 'too often request' ? 'คำขอบ่อยเกินไป' : i18n/* default.global.t */.Z.global.t('error.' + res.code)
          }, "*");
          closeWindowOrBack();
        }
      }).catch(error => {
        postMessage({
          msg: error.message === "too often request" ? "คำขอบ่อยเกินไป" : error.message
        }, "*");
        closeWindowOrBack();
      });
    }
    function closeWindowOrBack() {
      if ((Platform/* default.is.desktop */.ZP.is.desktop || Platform/* default.is.webkit */.ZP.is.webkit) && !Platform/* default.is.capacitor */.ZP.is.capacitor && Platform/* default.is.name */.ZP.is.name !== 'webkit') {
        window.close();
      } else {
        router.go(-1);
      }
    }
    function postMessage(item1, item2) {
      if ((Platform/* default.is.desktop */.ZP.is.desktop || Platform/* default.is.webkit */.ZP.is.webkit) && !Platform/* default.is.capacitor */.ZP.is.capacitor && Platform/* default.is.name */.ZP.is.name !== 'webkit') {
        window.opener.postMessage(item1, item2);
      } else {
        window.postMessage(item1, item2);
      }
    }

    // function pDepo(data) {
    //   postDeposit(data)
    //     .then((d) => {
    //       if (d.code === 0) {
    //         doIt(d);
    //         window.opener.postMessage({ msg: "success" }, "*");
    //       }
    //       return d;
    //     })
    //     .catch((error) => {
    //       window.opener.postMessage({ msg: error.message }, "*");
    //       window.close();
    //     });
    // }
    const $q = (0,use_quasar/* default */.Z)();
    const router = (0,vue_router/* useRouter */.tv)();
    (0,runtime_core_esm_bundler/* onMounted */.bv)(async () => {
      $q.loading.show({
        message: "กำลังโหลด..."
      });
      if ((Platform/* default.is.desktop */.ZP.is.desktop || Platform/* default.is.webkit */.ZP.is.webkit) && !Platform/* default.is.capacitor */.ZP.is.capacitor && Platform/* default.is.name */.ZP.is.name !== 'webkit') {
        let params = localStorage.getItem("formDetails");
        params = params ? JSON.parse(params) : "";
        var form = params;
      } else {
        // const {value} = await Preferences.get({key: 'formDetails'});
        let value = localStorage.getItem("formDetails");
        let params = value ? JSON.parse(value) : "";
        // console.log(params);
        var form = params;
      }
      // console.log(form);

      axios.cashier.get("/session/payment/" + form.paymentId + "/amount/" + form.localAmount + "/verify").then(res => {
        const d = res.data;
        if (d.code === 0) {
          const copy = {
            ...form
          };
          const data = {};
          Object.entries(copy).forEach(([key, value]) => {
            if (value) {
              data[key] = value;
            }
          });
          data.bankCardId = 0;
          pDepo(data);
        } else {
          postMessage({
            msg: d.message
          }, "*");
          closeWindowOrBack();
        }
      }).catch(error => {
        postMessage({
          msg: error.message
        }, "*");
        closeWindowOrBack();
      });
    });
    return (_ctx, _cache) => {
      return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_1);
    };
  }
});
;// CONCATENATED MODULE: ./src/components/depositLoading.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./src/components/depositLoading.vue



const __exports__ = depositLoadingvue_type_script_setup_true_lang_js;

/* harmony default export */ const depositLoading = (__exports__);

/***/ })

}]);
//# sourceMappingURL=122.js.map