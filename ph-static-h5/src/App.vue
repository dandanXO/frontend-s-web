<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";
import { isAndroid } from "boot/utils";
import { App } from "@capacitor/app";
import { Adjust, AdjustConfig, AdjustEnvironment, AdjustLogLevel } from "@awesome-cordova-plugins/adjust";
import { userStore } from "src/stores";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const $q = useQuasar(); // calling here; equivalent to when component
    const channelValue = ref("");
    const store = userStore();

    if (sessionStorage.getItem("ISDARK") === "true" || sessionStorage.getItem("ISDARK") === null) {
      $q.dark.set(true);
    }

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

    const initOrientation = () => {
      if (isAndroid()) {
        screen.orientation.lock("portrait");
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

    const affAppToken = ref("");
    const initAdjustEventTrack = async () => {
      if (isAndroid()) {
        const info = await App.getInfo();
        console.log("APP Info");
        console.log(info);

        // alert(info.id);
        if (info.id === "com.dfgrood") {
          // alert("yes");

          affAppToken.value = "8xdqa42gpxc0";
          console.log("Init Adjust Sdk");
          console.log(affAppToken.value);
          var adjustConfig = new AdjustConfig(affAppToken.value, AdjustEnvironment.Production);
          adjustConfig.setLogLevel(AdjustLogLevel.Verbose);
          adjustConfig.setAttributionCallbackListener(function (e) {
            console.log("setAttributionCallbackListener");
            console.log(e);
          });

          Adjust.create(adjustConfig);
          setTimeout(() => {
            Adjust.getAdid().then((aaid) => {
              console.log("aaid");
              console.log(aaid);
              store.aaid = aaid;
            });

            Adjust.getAttribution().then((attribution) => {
              console.log("GeT attribution");
              console.log(attribution);
              store.aaid = attribution.adid;
            });

            Adjust.getGoogleAdId().then((googleid) => {
              console.log("Google AdID");
              console.log(googleid);
              store.googleadid = googleid;
            });
          }, 1500);
        }
      }
    };

    onMounted(() => {
      checkSID();
      initOrientation();

      document.addEventListener(
        "deviceready",
        () => {
          onDeviceReady();
          initAdjustEventTrack();
        },
        false
      );
    });
  }
});
</script>
