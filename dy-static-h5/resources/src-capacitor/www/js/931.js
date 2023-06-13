"use strict";
(globalThis["webpackChunkthai_project"] = globalThis["webpackChunkthai_project"] || []).push([[931],{

/***/ 2931:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ DisplayView)
});

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(59835);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(60499);
// EXTERNAL MODULE: ./src/boot/axios.js + 1 modules
var axios = __webpack_require__(31249);
;// CONCATENATED MODULE: ./node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use[0]!./node_modules/@quasar/app-webpack/lib/webpack/loader.vue.auto-import-quasar.js??ruleSet[0].use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./src/pages/finance/DisplayView.vue?vue&type=script&setup=true&lang=js

const _hoisted_1 = {
  id: "renderArea"
};


/* harmony default export */ const DisplayViewvue_type_script_setup_true_lang_js = ({
  __name: 'DisplayView',
  setup(__props) {
    const request = (0,reactivity_esm_bundler/* ref */.iH)({});
    const formRef = (0,reactivity_esm_bundler/* ref */.iH)();
    function getRequest(url) {
      if (!url) {
        url = window.location.search;
      }
      let theRequest = {};
      if (url.indexOf("?") != -1) {
        url = url.substr(1);
      }
      let strs = url.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
      return theRequest;
    }
    function renderOrSubmit() {
      let type = request.value.payResultType;
      switch (type) {
        case "POST_SUBMIT":
          postSubmit();
          break;
        case "IMAGE_BASE64":
          break;
        case "GENERATION_QR_CODE":
          break;
        case "RENDER_HTML":
          renderHtml();
          break;
      }
    }
    function renderHtml() {
      document.write(request.value.data);
    }
    function postSubmit() {
      formRef.value.action = request.value.requestUrl;
      delete request.value.requestUrl;
      delete request.value.payResultType;
      delete request.value.paramKey;
      for (let x in request.value) {
        let p = "<input type='text' name='" + x + "' value='" + request.value[x] + "'/>";
        formRef.value.append(p);
      }
      formRef.value.submit();
    }
    (0,runtime_core_esm_bundler/* onMounted */.bv)(async () => {
      request.value = getRequest();
      if (request.value.paramKey) {
        const d = await axios.cashier.get(`/param/key/${key}`, request.value.paramKey).then(() => {
          if (request.value.payResultType == "POST_SUBMIT") {
            request.value = Object.assign({}, getRequest(d.data.data), request.value);
          } else {
            request.value.data = d.data.data;
          }
        });
      }
      renderOrSubmit();
    });
    return (_ctx, _cache) => {
      return (0,runtime_core_esm_bundler/* openBlock */.wg)(), (0,runtime_core_esm_bundler/* createElementBlock */.iD)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */._)("form", {
        ref_key: "formRef",
        ref: formRef,
        method: "post",
        style: {
          "display": "none"
        }
      }, null, 512)]);
    };
  }
});
;// CONCATENATED MODULE: ./src/pages/finance/DisplayView.vue?vue&type=script&setup=true&lang=js
 
;// CONCATENATED MODULE: ./src/pages/finance/DisplayView.vue



const __exports__ = DisplayViewvue_type_script_setup_true_lang_js;

/* harmony default export */ const DisplayView = (__exports__);

/***/ })

}]);
//# sourceMappingURL=931.js.map