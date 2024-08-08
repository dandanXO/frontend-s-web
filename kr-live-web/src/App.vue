<template>
  <router-view />
  <component :is="PageModal"></component>
</template>

<script>
import { defineAsyncComponent, defineComponent, markRaw, onUnmounted, onMounted, ref } from "vue";
import { useQuasar, Platform } from "quasar";
import { getVisitorId } from "boot/utils";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { useUI } from "stores/ui";
import axios from "axios";
import dayjs from 'dayjs';

require('dayjs/locale/ko');
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const ui = useUI();
    const router = useRouter();
    const $q = useQuasar();

    const onlineStatTimeout = ref();
    const onlineStatInterval = ref();

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

    const getOnlineStatApi = async () => {
      const sidParam = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
      store.visitorId = sidParam;
      const way = Platform.is.capacitor && Platform.is.android ? "ANDROID" : "H5";

      if (sidParam) {
        const sidPass = store.token ? "mid-" + store.memberId : sidParam
        const res = await axios.get("https://memsta.eatrhaquke.com/memberStatistics/submit", {
          params: {
            way: way,
            sid: sidPass,
            siteCode: "krw"
          }
        });
      }
    };

    onMounted(() => {
      checkSID();
      // initCsWeb();
      initStorage();
      checkAgentFrom();

      document.addEventListener(
        "deviceready",
        () => {
          onDeviceReady();
        },
        false
      );

      onlineStatTimeout.value = setTimeout(getOnlineStatApi, 2000);
      onlineStatInterval.value = setInterval(getOnlineStatApi, 60000);
    });

    onUnmounted(() => {
      clearTimeout(onlineStatTimeout.value);
      clearInterval(onlineStatInterval.value);
    });

    return {
      PageModal
    }
  }
});
</script>
