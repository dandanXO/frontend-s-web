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
import { AddressbarColor } from "quasar";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
import { useUI } from "src/stores/ui";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const ui = useUI();

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
        console.log(affAppToken.value);
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
                        affAppToken.value = res.data.adjust_app_token;
                        initAdjustEventTrack();
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

    const setStatusBarColor = () => {
      AddressbarColor.set("#3E1474");
      if (Platform.is.capacitor && Platform.is.android) {
        StatusBar.hide();
        StatusBar.setOverlaysWebView({ overlay: true });
        StatusBar.setBackgroundColor({ color: "#3E1474" });
        StatusBar.setStyle({ style: Style.Dark });
        // if (cordova.platformId == "android") {
        //   StatusBar.show();
        //   StatusBar.overlaysWebView(true);
        //   StatusBar.styleLightContent();
        //   StatusBar.backgroundColorByHexString("#3E1474");
        // } else {
        //   StatusBar.overlaysWebView(false);
        //   StatusBar.hide();
        // }
      }
    };

    const getInsetHeight = async () => {
      const ua = navigator.userAgent.toLowerCase();
      console.log(ua);
      const isAndroidPixel = ua.indexOf("android") > -1 && ua.indexOf("pixel") > -1;
      if (Platform.is.capacitor && Platform.is.android && isAndroidPixel) {
        const insets = await SafeArea.getSafeAreaInsets();
        console.log(insets);
        // alert(insets); // Ex. { "bottom":34, "top":47, "right":0, "left":0 }
        if (insets.bottom > 0) {
          // console.log("HERe");
          ui.bottomInsetHeight = insets.bottom;
        }
      }
    };

    const handleVisibilityChange = (status) => {
      if (Platform.is.capacitor && Platform.is.android) {
        StatusBar.hide();
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

      setStatusBarColor();

      document.addEventListener(
        "deviceready",
        () => {
          onDeviceReady();
        },
        false
      );

      document.addEventListener("visibilitychange", handleVisibilityChange);

      getInsetHeight();
    });
  }
});

// document.addEventListener("deviceready", onDeviceReady, false);
</script>
