<template>
  <router-view />
  <component :is="PageModal"></component>
</template>

<script>
import { defineAsyncComponent, defineComponent, markRaw, onMounted, ref } from "vue";
import { Platform, useQuasar } from "quasar";
import { getVisitorId } from "boot/utils";
import { api } from "boot/axios";
import CsClient from "boot/csweb/client.js";
import { userStore } from "stores/index";
import isString from "lodash/isString";
import { useRouter } from "vue-router";
import { useUI } from "stores/ui";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const ui = useUI();
    const router = useRouter();
    const $q = useQuasar();
    $q.dark.set(true);
    $q.screen.setSizes({ sm: 500, md: 768, lg: 991, xl: 1280 });
    const channelValue = ref("");

    const PageModal = markRaw(defineAsyncComponent(() =>
      import('components/modal/PageModal')
    ))

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

    const store = userStore();

    const regDevice = Platform.is.mobile && Platform.is.capacitor ? "ANDROID" : Platform.is.mobile ? "H5" : "WEB";

    let csclient;
    const initCsWeb = () => {
      csclient = new CsClient("12", regDevice, "kr", "3", "prod");

      csclient.set("pageurl", "/liveChat");
      csclient.set("btnid", "cs-web-id");
      csclient.set("notification-type", {
        type: "breathing",
        color: "#FB4BFF"
      });

      csclient.set("design", {
        bottom: "40px",
        right: "20px",
        icon: require("assets/images/index/cs-icon.png")
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
        // console.log("Message received from the iframe: " + event.data); // Message received from child
        if (isString(event.data)) {
          if (event.data == "closenotice") {
            router.go(-1);
          }
        }
      });
    };

    const initStorage = () => {
      localStorage.removeItem("LINE_STICKY_OFF");
    };

    const checkAgentFrom = () => {
      var agentB = localStorage.getItem("AGENT_B");
      if (agentB) {
        ui.isAffiliateB = true;
      }
    };

    const errorHandler = (error) => {
      console.error("File error: " + error.code);
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

    onMounted(() => {
      checkSID();
      initCsWeb();
      initStorage();
      checkAgentFrom();

      document.addEventListener(
        "deviceready",
        () => {
          onDeviceReady();
        },
        false
      );
    });

    return {
      PageModal
    }
  }
});
</script>
