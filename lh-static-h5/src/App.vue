<template>
  <router-view />
  <notification-wrapper/>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { Platform, useQuasar } from "quasar";
import { api } from "boot/axios";
import CsClient from "csweb-client";
import { userStore } from "src/stores";
import axios from "axios";
import { cached } from "boot/cache";
import { getVisitorId } from "boot/utils";
import { useUI } from "stores/ui";
import { useLocalStorage } from "@vueuse/core";

import NotificationWrapper from "./components/notification/NotificationWrapper.vue";

export default defineComponent({
  name: "App",
  components: {
    NotificationWrapper
  },
  setup() {
    var qs = require("qs");
    const store = userStore();
    const ui = useUI();
    const $q = useQuasar(); // calling here; equivalent to when component

    const onlineStatTimeout = ref();
    const onlineStatInterval = ref();

    const darkModeFromStorage = useLocalStorage("DARK_MODE", false);
    if (darkModeFromStorage.value && store.hasToken()) {
      $q.dark.set(true);
    }

    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      (async () => {
        const visitorId = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
        store.visitorId = visitorId;

        if (store.isNotAppPromo()) {
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
        }
      })();
    };
    let csclient;
    let CSAUrl;

    const getCSA = () => {
      if (store.isNotAppPromo()) {
        cached
          .get("customerAddress", () =>
            api.get("/config/customerAddress/v2").then((res) => {
              return res;
            })
          )
          .then((data) => {
            var url;
            const randNum = Math.floor(Math.random() * 2) + 1;
            if (randNum === 1) {
              url = data.liveUrl1;
            } else {
              url = data.liveUrl2;
            }
            const urlData = new URL(url);

            // debugger;
            CSAUrl = urlData.hostname;
            ui.CSAUrl = urlData.hostname;

            initCsWeb();
            console.log(CSAUrl);
          })
          .catch((err) => {
            console.log(err);
            CSAUrl = "csweb01.c8nhwrqx4.com";
          });
      }
    };

    const initCsWeb = () => {
      var regDevice = store.getDeviceType();
      // console.log("Footer OnMounted");

      // 'XFCS' / 2
      // csclient = new CsClient('LHCS', regDevice, 'zh-CN', '2', 'prod', 'https://csweb01.v6kthwlug.com/');
      csclient = new CsClient("LHCS", regDevice, "zh-CN", "2", "prod", `https://${CSAUrl}`);

      csclient.set("bottom", "77");
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
      window.addEventListener("message", function (event) {
        // console.log("HEre Message received from the iframe: " + event.data); // Message received from child
        // if (typeof event.data === "string") {
        // if (event.data == 'sess_timeout') {
        //   router.push({ path: "/" });
        // }
        // }
      });
    };

    const getOnlineStatApi = async () => {
      const sidParam = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
      store.visitorId = sidParam;
      const way = Platform.is.capacitor && Platform.is.android ? "ANDROID" : "H5";

      if (sidParam && store.isNotAppPromo()) {
        const res = await api.post("/memberStatistics/submit", {
          params: {
            way: way,
            sid: sidParam,
            siteCode: "lh1"
          }
        });
      }
    };

    const getAffiliateByDomain = () => {
      var host = window.location.host;
      // host = "www.lh56917.com";
      if (store.isNotAppPromo()) {
        api.get(`/app/getAffiliateCode?siteCode=lh1&domain=${host}`).then((res) => {
          console.log(res);
          if (res.code === 0 && res.data !== "") {
            // alert(res.data)
            var agentCode = res.data;
            sessionStorage.setItem("AFFILIATE_CODE", agentCode);
          }
        });
      }
    };

    onMounted(() => {
      console.log("TEST 3");
      checkSID();
      // initCsWeb();
      getCSA();

      getAffiliateByDomain();

      onlineStatTimeout.value = setTimeout(getOnlineStatApi, 2000);
      onlineStatInterval.value = setInterval(getOnlineStatApi, 60000);
    });

    onUnmounted(() => {
      clearTimeout(onlineStatTimeout);
      clearInterval(onlineStatInterval);
    });
  }
});
</script>
