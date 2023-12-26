<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { Platform, useQuasar } from "quasar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { userStore } from "src/stores";
import { Adjust, AdjustConfig, AdjustEnvironment, AdjustLogLevel } from "@awesome-cordova-plugins/adjust";
import { isAndroid } from "boot/utils";
import { App } from "@capacitor/app";

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

    const channelValue = ref("");
    const affAppToken = ref("");

    const initAdjustEventTrack = () => {
      if (isAndroid()) {
        //Android App.
        console.log("Init Adjust Sdk");
        var adjustConfig = new AdjustConfig(affAppToken.value, AdjustEnvironment.Production);
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
        // AdjustWeb.initSdk({
        //   appToken: affAppToken.value,
        //   environment: "production"
        // });
        setTimeout(() => {
          const resp = AdjustWeb.getAttribution();
          console.log("Web Adid");
          // console.log(resp.adid);
          store.aaid = resp ? resp.adid : "";
        }, 1500);
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
                    api.get(`/app/adjust/params?affiliateCode=${channelValue.value}`).then((res) => {
                      if (res.code === 0) {
                        sessionStorage.setItem("AFFILIATE_APP_TOKEN", res.data.adjust_app_token);
                        sessionStorage.setItem("AFFILIATE_QUICK_REGISTER_EVENT", res.data.adjust_quick_register_event);
                        sessionStorage.setItem("AFFILIATE_REGISTER_EVENT", res.data.adjust_register_event);
                        affAppToken.value = sessionStorage.getItem("AFFILIATE_APP_TOKEN");
                        // alert(affAppToken.value);
                      }
                    });
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

    onMounted(async () => {
      // const info = await App.getInfo();
      // console.log("APP Info");
      // console.log(info);
      checkSID();
      // getCSA();
      getAppInfo();
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

// document.addEventListener("deviceready", onDeviceReady, false);
</script>
