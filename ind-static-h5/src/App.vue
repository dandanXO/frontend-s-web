<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
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

    onMounted(async () => {
      // const info = await App.getInfo();
      // console.log("APP Info");
      // console.log(info);
      checkSID();
      // getCSA();
      getAppInfo();
      initOrientation();
      initAdjustEventTrack();
    });
  }
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
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
}

function errorHandler(error) {
  console.error("File error: " + error.code);
}
</script>
