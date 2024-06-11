<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { Platform, useQuasar } from "quasar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";
import CsClient from "csweb-client";
// import CsClient from "boot/client";
import { userStore } from "src/stores";
import axios from "axios";
import { cached } from "boot/cache";
import { getVisitorId } from "boot/utils";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(false);
    const onlineStatTimeout = ref();
    const onlineStatInterval = ref();
    const channelValue = ref("");

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

      // 'XFCS' / 2
      // csclient = new CsClient('LHCS', regDevice, 'zh-CN', '2', 'prod', 'https://csweb01.v6kthwlug.com/');
      csclient = new CsClient("TF88", regDevice, "vn", "2", "prod", `https://${CSAUrl}`);

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
        if (_.isString(event.data)) {
          // if (event.data == 'sess_timeout') {
          //   router.push({ path: "/" });
          // }
        }
      });
    };

    const getOnlineStatApi = async () => {
      const sidParam = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
      store.visitorId = sidParam;
      const way = Platform.is.capacitor && Platform.is.android ? "ANDROID" : "H5";

      if (sidParam) {
        const res = await axios.get("https://memsta.thilhe946li.com/memberStatistics/submit", {
          params: {
            way: way,
            sid: sidParam,
            siteCode: "vnm"
          }
        });
      }
    };

    const onDeviceReady = () => {
      // Get the file system
      window.resolveLocalFileSystemURL(
        cordova.file.applicationDirectory,
        function (applicationDirectory) {
          applicationDirectory.getFile(
            "channel.json",
            { create: false, exclusive: false },
            function (fileEntry) {
              // Read the file
              fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (evt) {
                  console.log("Read as text: ", evt.target.result);
                  const jsonData = evt.target.result;
                  const json = JSON.parse(jsonData);
                  if (json && json.channel) {
                    sessionStorage.setItem("AFFILIATE_CODE", json.channel);
                    channelValue.value = sessionStorage.getItem("AFFILIATE_CODE");
                  }
                };

                // Read the file as text
                reader.readAsText(file);
              }, errorHandler);
            },
            errorHandler
          );
        },
        errorHandler
      );
    };

    const errorHandler = (error) => {
      console.error("File error: " + error.code);
    };

    onMounted(() => {
      checkSID();
      // initCsWeb();
      getCSA();

      onlineStatTimeout.value = setTimeout(getOnlineStatApi, 2000);
      onlineStatInterval.value = setInterval(getOnlineStatApi, 60000);

      document.addEventListener(
        "deviceready",
        () => {
          onDeviceReady();
        },
        false
      );
    });

    onUnmounted(() => {
      clearTimeout(onlineStatTimeout);
      clearInterval(onlineStatInterval);
    });
  }
});
</script>
