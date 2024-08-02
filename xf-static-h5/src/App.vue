<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";
import axios from "axios";
import CsClient from "csweb-client";
// import CsClient from "boot/client";
import { userStore } from "src/stores";
import { getVisitorId } from "boot/utils";
export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(true);
    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      (async () => {
        const visitorId = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
        store.visitorId = visitorId;

        console.log("SID");
        console.log(visitorId);

        const obj = {
          identifier: store.visitorId,
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
          const url = new URL(res.data);
          CSAUrl = url.hostname;
          initCsWeb();
          console.log(CSAUrl);
        })
        .catch((err) => {
          console.log(err);
          CSAUrl = "csweb01.v6kthwlug.com";
        });
    };

    const initCsWeb = () => {
      var regDevice = store.getDeviceType();
      // console.log("Footer OnMounted");

      // 'XFCS' / 2
      // csclient = new CsClient('XFCS', regDevice, 'zh-CN', '2', 'prod', 'https://csweb01.v6kthwlug.com/');
      csclient = new CsClient(
        "XFCS",
        regDevice,
        "zh-CN",
        "2",
        "prod",
        `https://${CSAUrl}`
      );

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
      window.addEventListener('message', function (event) {
        // console.log("HEre Message received from the iframe: " + event.data); // Message received from child
        if (_.isString(event.data)) {
          // if (event.data == 'sess_timeout') {
          //   router.push({ path: "/" });
          // }
        }
      });
    };

    const getOnlineStatApi = async () => {
      const sidParam = store.visitorId;
      const way = "h5";

      if (sidParam) {
        const res = await api.post("/memberStatistics/submit", {
          params: {
            way: way,
            sid: sidParam,
            siteCode: "xf1"
          }
        });
      }
    };

    onMounted(() => {
      checkSID();
      // initCsWeb();
      getCSA();


      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });
  }
});
</script>
