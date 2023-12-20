<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { Platform, useQuasar } from "quasar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";
import CsClient from "csweb-client";
// import CsClient from "boot/client";
import { Device } from "@capacitor/device";
import { userStore } from "src/stores";
import { Adjust, AdjustConfig, AdjustEnvironment, AdjustLogLevel } from "@awesome-cordova-plugins/adjust";
import { isAndroid } from "boot/utils";
import AdjustWeb from "@adjustcom/adjust-web-sdk";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(true);
    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      const fpPromise = FingerprintJS.load();
      (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = { value: ["timezone", "timeZoneOffset"] };
        const allComponents = { ...result.components };
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
      csclient = new CsClient("INDWINCS", regDevice, "en", "2", "prod", `https://${CSAUrl}`);

      csclient.set("pageurl", "/liveChat");
      csclient.set("btnid", "cs-web-id");
      csclient.set("openanimation", false);
      csclient.set("bottom", "73");

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
          //   router.push({ path: "/" });
          // }
        }
      });
    };

    const getAppInfo = async () => {
      const info = await Device.getId();
      console.log("Device ID");
      console.log(info);
      console.log(info.identifier);
    };

    const initOrientation = () => {
      if (isAndroid()) {
        screen.orientation.lock("portrait");
      }
    };

    const initAdjustEventTrack = () => {
      if (isAndroid()) {
        //Android App.
        console.log("Init Adjust Sdk");
        var adjustConfig = new AdjustConfig("pxrvpkqs0a9s", AdjustEnvironment.Production);
        adjustConfig.setLogLevel(AdjustLogLevel.Verbose);
        Adjust.create(adjustConfig);

        setTimeout(() => {
          Adjust.getAdid().then((aaid) => {
            console.log("aaid");
            console.log(aaid);
            store.aaid = aaid;
          });
        }, 1500);
      } else {
        //Normal WEb / H5 / iOS WEbclip.
        console.log("Init Web Adjust");
        const AdjustWeb = require("@adjustcom/adjust-web-sdk");
        AdjustWeb.initSdk({
          appToken: "pxrvpkqs0a9s",
          environment: "production"
        });
        setTimeout(() => {
          const resp = AdjustWeb.getAttribution();
          console.log("Web Adid");
          // console.log(resp.adid);
          store.aaid = resp ? resp.adid : "";
        }, 1500);
      }
    };

    onMounted(() => {
      checkSID();
      getCSA();
      getAppInfo();
      initOrientation();
      initAdjustEventTrack();
    });
  }
});
</script>
