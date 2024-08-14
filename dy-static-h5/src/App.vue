<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { Platform, useQuasar } from "quasar";
import { api } from "boot/axios";
import CsClient from "csweb-client";
import { userStore } from "src/stores";
import { cached } from "boot/cache";
import { useRouter } from "vue-router";
import { isAndroid, isHuaweiPhone } from "boot/utils";
import axios from "axios";
import { getVisitorId } from "boot/utils";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    var router = useRouter();
    const store = userStore();
    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(false);
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
      if (!store.isNotAppPromo()) return;
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
          initCsWeb();
          console.log(CSAUrl);
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
      csclient = new CsClient("DYCS", regDevice, "zh-CN", "2", "prod", `https://${CSAUrl}`);
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
      window.addEventListener("message", function (event) {
        // console.log("HEre Message received from the iframe: " + event.data); // Message received from child
        if (_.isString(event.data)) {
          // if (event.data == 'sess_timeout') {
          //   router.push({path: "/liveChat"});
          // }
        }
      });
    };

    const getOnlineStatApi = async () => {
      // console.log("Ok Online.");
      const sidParam = store.visitorId;
      const way = "h5";

      if (sidParam && store.isNotAppPromo()) {
        const res = await api.post(
          "/memberStatistics/submit",
          qs.stringify({
            way: way,
            sid: sidParam,
            siteCode: process.env.SITE
          })
        );
      }
    };

    onMounted(() => {
      checkSID();
      // initCsWeb();
      getCSA();
      if (isAndroid() && !isHuaweiPhone()) {
        window.screen.orientation.lock("portrait");
      }

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });
  }
  /*test*/
});
</script>
