<template>
  <router-view/>
</template>

<script>
import {defineComponent, onMounted} from "vue";
import {Platform, useQuasar} from "quasar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {api} from "boot/axios";
import CsClient from "csweb-client";
import {userStore} from "src/stores";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(false);
    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      const fpPromise = FingerprintJS.load();
      (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = {value: ["timezone", "timeZoneOffset"]};
        const allComponents = {...result.components};
        excludes.value.forEach((element) => {
          delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);
        const obj = {
          identifier: sidParam,
          affiliateCode: affiliateItem
        };
        api.post("/memberAccessLog", qs.stringify(obj)).then((res) => {
          if (res.code === 0) {
          }
        });
      })();
    };
    let csclient;
    let CSAUrl;

    const getCSA = () => {
      api
          .get("/config/customerAddress")
          .then((res) => {
            // console.log(res);
            // res.data = https://csweb01.c8nhwrqx4.com/?partnerCode=DYCS&way=WEB&lang=zh-CN&token=
            // CSAUrl = res.data;
            const url = new URL(res.data);
            CSAUrl = url.hostname;
            initCsWeb();
            console.log(CSAUrl)
          })
          .catch((err) => {
            console.log(err);
            CSAUrl = "csweb01.c8nhwrqx4.com";
          });
    };

    const initCsWeb = () => {
      var regDevice = store.getDeviceType();
      // console.log("Footer OnMounted");

      // 'DYCS' / 4
      csclient = new CsClient(
          "DYCS",
          regDevice,
          "zh-CN",
          "2",
          "prod",
          `https://${CSAUrl}`
      );
      // csclient = new CsClient('DYCS', regDevice, 'zh-CN', '2','local', '');

      csclient.set("pageurl", "/liveChat");
      csclient.set("btnid", "cs-web-id");
      csclient.set("openanimation", false);

      csclient.set("notification-type", {
        type: "none"
      });

      if (store.token) {
        csclient.set("token", store.token);
      }

      //客服初始化。
      csclient.init();

      csclient.receiveListener("message", function (callback) {
        //收到新消息。
        // alert(callback);
      });

      //CsClient Event Listener.
      // window.addEventListener('message', function (event) {
      //   console.log("Message received from the iframe: " + event.data); // Message received from child
      //   if (_.isString(event.data)) {
      //     if (event.data == 'closenotice') {
      //       router.go(-1);
      //     }
      //   }
      // });
    };
    onMounted(() => {
      checkSID();
      // initCsWeb();
      getCSA();
    });
  }
});
</script>
