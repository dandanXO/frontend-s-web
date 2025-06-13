<template>
  <router-view />
</template>

<script>
import { AddressbarColor, Platform, useQuasar } from "quasar";
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { api } from "@/boot/axios";
import { isAndroid, isInPwa } from "@/boot/utils";
import { userStore } from "@/stores";
import { useUI } from "@/stores/ui";
import { Device } from "@capacitor/device";
import { StatusBar, Style } from "@capacitor/status-bar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { domainLists } from "./constant";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const ui = useUI();

    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(true);
    const checkSID = () => {
      // const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      // const fpPromise = FingerprintJS.load();
      // (async () => {
      //   const fp = await fpPromise;
      //   const result = await fp.get();
      //   const excludes = { value: ["timezone", "timeZoneOffset"] };
      //   const allComponents = { ...result.components };
      //   excludes.value.forEach((element) => {
      //     delete allComponents[element];
      //   });
      //   const sidParam = FingerprintJS.hashComponents(allComponents);
      //   const obj = {
      //     identifier: sidParam,
      //     affiliateCode: affiliateItem
      //   };
      //   api.post("/memberAccessLog", qs.stringify(obj)).then((res) => {
      //     if (res.code === 0) {
      //     }
      //   });
      // })();
    };

    const getAppInfo = async () => {
      const info = await Device.getId();
      // console.log("Device ID");
      // console.log(info);
      // console.log(info.identifier);
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
        var adjustConfig = new AdjustConfig(affAppToken.value, AdjustConfig.EnvironmentProduction);
        adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
        adjustConfig.setAttributionCallbackListener(function (e) {
          console.log("setAttributionCallbackListener");
          console.log(e);
        });

        Adjust.create(adjustConfig);
        setTimeout(() => {
          Adjust.getGoogleAdId(function (googleid) {
            console.log("Google AdID");
            console.log(googleid);
            if (!googleid || googleid === "00000000-0000-0000-0000-000000000000") {
              (async () => {
                Adjust.getAdid(function (adid) {
                  console.log("Attribution 2");
                  console.log(adid);
                  store.aaid = adid;
                  // trackAppStartEvent();
                });
              })();
            } else {
              store.googleadid = googleid;
              // trackAppStartEvent();
            }
          });
        }, 100);
      } else {
        //Normal WEb / H5 / iOS WEbclip.
        console.log("Init Web Adjust");
        console.log(affAppToken.value);
        const AdjustWeb = require("@adjustcom/adjust-web-sdk");
        AdjustWeb.initSdk({
          appToken: affAppToken.value,
          environment: "production",
          logLevel: "verbose",
          attributionCallback: function (e, attribution) {
            // e: internal event name, can be ignored
            // attribution: details about the changed attribution
            console.log("CALLBACK");
            console.log(attribution);
            // store.aaid = attribution && attribution.adid ? attribution.adid : "";
          }
        });
        setTimeout(() => {
          AdjustWeb.waitForWebUUID().then((webUuid) => {
            console.log("Web UUid");
            console.log(webUuid);
            store.aaid = webUuid ? webUuid : "";
          });
        }, 100);
      }
    };

    const trackH5Affiliate = () => {
      const hostname = window.location.hostname.replace("www.", "");
      const affiliateCodeFromDomain = domainLists[hostname]?.affiliateCode;
      var affiliateCode = sessionStorage.getItem("AFFILIATE_CODE") || affiliateCodeFromDomain || "5E2D65";

      const track = () => {
        sessionStorage.setItem("AFFILIATE_CODE", affiliateCode);
        api.get(`/app/adjust/params?affiliateCode=${affiliateCode}`).then((res) => {
          if (res.code === 0) {
            sessionStorage.setItem("AFFILIATE_APP_TOKEN", res.data.adjust_app_token);
            // sessionStorage.setItem("AFFILIATE_QUICK_REGISTER_EVENT", res.data.adjust_quick_register_event);
            // sessionStorage.setItem("AFFILIATE_REGISTER_EVENT", res.data.adjust_register_event);
            if (res.data.adjust_register_event) {
              ui.adjust_register_event = res.data.adjust_register_event;
            }
            affAppToken.value = res.data.adjust_app_token;
            initAdjustEventTrack();
          }
        });
      };

      const isRefreshed = sessionStorage.getItem("PWA_REFRESH_PAGE");
      if (isInPwa() && !isRefreshed) {
        document.addEventListener(
          "pwaEvent",
          () => {
            // affiliateCode = sessionStorage.getItem("AFFILIATE_CODE");
            // track();
          },
          { once: true }
        );
      } else {
        track();
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
                        if (res.data.adjust_register_event) {
                          ui.adjust_register_event = res.data.adjust_register_event;
                        }
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

    const setStatusBarColor = async () => {
      AddressbarColor.set("#3E1474");
      if (Platform.is.capacitor && Platform.is.android) {
        // console.log("STATUSBARR");
        await StatusBar.hide();
        setTimeout(async () => {
          await StatusBar.setOverlaysWebView({ overlay: true });
        }, 500);
        await StatusBar.setBackgroundColor({ color: "#3E1474" });
        await StatusBar.setStyle({ style: Style.Dark });
        // setTimeout(() => {
        //   getInsetHeight();
        // }, 250);
      }
    };

    const router = useRouter();
    const checkServerStatus = () => {
      axios.get(`https://sumbtf.tebarncale.com/server/status/${process.env.SITE}`).then((response) => {
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

    // const getInsetHeight = async () => {
    //   const ua = navigator.userAgent.toLowerCase();
    //   console.log(ua);
    //   const isAndroidPixel = ua.indexOf("android") > -1;
    //   // && (ua.indexOf("pixel") > -1 || ua.indexOf("samsung") > -1 || ua.indexOf("galaxy") > -1);
    //   if (Platform.is.capacitor && Platform.is.android && isAndroidPixel) {
    //     const insets = await SafeArea.getSafeAreaInsets();
    //     console.log(insets);
    //     // alert(insets); // Ex. { "bottom":34, "top":47, "right":0, "left":0 }
    //     if (insets.bottom > 0) {
    //       // console.log("HERe");
    //       ui.bottomInsetHeight = insets.bottom;
    //     }
    //   }
    // };

    const handleVisibilityChange = (status) => {
      if (Platform.is.capacitor && Platform.is.android) {
        StatusBar.hide();
      }
    };

    const getOnlineStatApi = async () => {
      // console.log("Ok Online.");
      const fpPromise = FingerprintJS.load();

      const fp = await fpPromise;
      const result = await fp.get();
      const excludes = { value: ["timezone", "timeZoneOffset"] };
      const allComponents = { ...result.components };
      excludes.value.forEach((element) => {
        delete allComponents[element];
      });
      const sidParam = FingerprintJS.hashComponents(allComponents);
      const way = Platform.is.capacitor && Platform.is.android ? "ANDROID" : "H5";
      const theSid = store.googleadid ? store.googleadid : store.aaid ? store.aaid : sidParam;
      console.log(theSid);

      if (theSid) {
        const res = await api.post(
          "/memberStatistics/submit",
          qs.stringify({
            way: way,
            sid: theSid,
            siteCode: process.env.SITE
          })
        );
      }
    };

    onMounted(async () => {
      console.log("TH2 0212");
      checkServerStatus();
      getAppInfo();
      initOrientation();
      AOS.init();

      if (isAndroid()) {
        document.addEventListener(
          "deviceready",
          () => {
            onDeviceReady();
            setTimeout(() => {
              setStatusBarColor();
            }, 1000);
          },
          false
        );
      } else {
        trackH5Affiliate();
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });
  }
});

// document.addEventListener("deviceready", onDeviceReady, false);
</script>
