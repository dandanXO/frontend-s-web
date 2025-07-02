<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import axios from "axios";
import CsClient from "csweb-client";
import { userStore } from "src/stores";
import { getVisitorId } from "boot/utils";
import { useRouter } from "vue-router";
import { useUI } from "stores/ui";
export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const router = useRouter();
    const ui = useUI();
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
          // initCsWeb();
          console.log(CSAUrl);
        })
        .catch((err) => {
          console.log(err);
          CSAUrl = "csweb01.v6kthwlug.com";
        });
    };

    // const initCsWeb = () => {
    //   var regDevice = store.getDeviceType();
    //   // console.log("Footer OnMounted");

    //   // 'XFCS' / 2
    //   // csclient = new CsClient('XFCS', regDevice, 'zh-CN', '2', 'prod', 'https://csweb01.v6kthwlug.com/');
    //   csclient = new CsClient("XFCS", regDevice, "zh-CN", "2", "prod", `https://${CSAUrl}`);

    //   csclient.set("pageurl", "/liveChat");
    //   csclient.set("btnid", "cs-web-id");
    //   csclient.set("bottom", "81px");
    //   csclient.set("openanimation", false);

    //   csclient.set("notification-type", {
    //     type: "none"
    //   });

    //   if (store.token) {
    //     csclient.set("token", store.token);
    //   }

    //   //客服初始化。
    //   csclient.init();

    //   csclient.receiveListener("message", function (callback) {
    //     //收到新消息。
    //     // alert(callback);
    //   });

    //   //CsClient Event Listener.
    //   window.addEventListener("message", function (event) {
    //     // console.log("HEre Message received from the iframe: " + event.data); // Message received from child
    //     if (_.isString(event.data)) {
    //       // if (event.data == 'sess_timeout') {
    //       //   router.push({ path: "/" });
    //       // }
    //     }
    //   });
    // };

    const checkServerStatus = () => {
      axios.get(`https://sumbtf.tebarncale.com/server/status/${process.env.SITEID}`).then((response) => {
        if (response.data.code === 0) {
          console.log("responseStatus:", response.data.data.status);
          if (response.data.data.status === "CLOSED") {
            router.replace(`/maintenance`);
            ui.maintenanceStartTime = response.data.data.maintenanceStartTime;
            ui.maintenanceEndTime = response.data.data.maintenanceEndTime;
          }
        }
      });
    };

    const getOnlineStatApi = async () => {
      const sidParam = store.visitorId;
      const way = "h5";

      if (sidParam) {
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

    const checkSessStorageItem = () => {
      const checkItem = sessionStorage.getItem("ERROR_TOKEN_LOGGED");
      if (checkItem) {
        sessionStorage.removeItem("ERROR_TOKEN_LOGGED");
        $q.notify({
          color: "negative",
          position: "top",
          message: "您账户已在其他设备登录。请注意是否由本人登录，如有异常请及时修改密码。",
          icon: "report_problem"
        });
      }
    };

    const getAffiliateByDomain = () => {
      var host = window.location.host;
      var siteCode = process.env.SITE;
      // host = "www.lh56917.com";
      if (store.isNotAppPromo()) {
        api.get(`/app/getAffiliateCode?siteCode=${siteCode}&domain=${host}`).then((res) => {
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
      console.log("XF H5 0207");

      checkServerStatus();
      checkSID();
      // initCsWeb();
      getCSA();
      checkSessStorageItem();
      getAffiliateByDomain();

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });
  }
});
</script>
