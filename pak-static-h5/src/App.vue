<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref, nextTick, watch } from "vue";
import { Platform, useQuasar } from "quasar";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { userStore } from "src/stores";
import { isAndroid } from "boot/utils";
import { AddressbarColor } from "quasar";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
import { useUI } from "src/stores/ui";
import axios from "axios";
import { getVisitorId } from "boot/utils";
import { cached } from "boot/cache";

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

    // const initAdjustEventTrack = () => {
    //   if (isAndroid()) {
    //     //Android App.
    //     console.log("Init Adjust Sdk");
    //     console.log(affAppToken.value);
    //     var adjustConfig = new AdjustConfig(affAppToken.value, AdjustEnvironment.Production);
    //     adjustConfig.setLogLevel(AdjustLogLevel.Verbose);
    //     adjustConfig.setAttributionCallbackListener(function (e) {
    //       console.log("setAttributionCallbackListener");
    //       console.log(e);
    //     });
    //
    //     Adjust.create(adjustConfig);
    //     setTimeout(() => {
    //
    //       // Adjust.getAdid().then((aaid) => {
    //       //   console.log("aaid");
    //       //   console.log(aaid);
    //       //   if(store.aaid===""){
    //       //     store.aaid = aaid;
    //       //   }
    //       // });
    //
    //       Adjust.getGoogleAdId().then((googleid) => {
    //         console.log("Google AdID");
    //         console.log(googleid);
    //         if(!googleid || googleid==='00000000-0000-0000-0000-000000000000'){
    //           (async () => {
    //             Adjust.getAttribution().then((attribution) => {
    //               console.log("Attribution 2");
    //               console.log(attribution);
    //               store.aaid = attribution.adid;
    //             });
    //           })();
    //         }else{
    //           store.googleadid = googleid;
    //         }
    //       });
    //     }, 0);
    //   } else {
    //     //Normal WEb / H5 / iOS WEbclip.
    //     console.log("Init Web Adjust");
    //     console.log(affAppToken.value);
    //     const AdjustWeb = require("@adjustcom/adjust-web-sdk");
    //     AdjustWeb.initSdk({
    //       appToken: affAppToken.value,
    //       environment: "production",
    //       attributionCallback: function (e, attribution) {
    //         // e: internal event name, can be ignored
    //         // attribution: details about the changed attribution
    //         console.log("CALLBACK");
    //         console.log(attribution);
    //         store.aaid = attribution && attribution.adid ? attribution.adid : "";
    //       }
    //     });
    //     setTimeout(() => {
    //       const attribution = AdjustWeb.getAttribution();
    //       console.log("Web Adid");
    //       console.log(attribution);
    //       store.aaid = attribution ? attribution.adid : "";
    //     }, 1500);
    //   }
    // };

    const trackH5Affiliate = () => {
      const omitSites = ["bw3.genoortisy.com"];

      var affiliateCode = "";
      if (omitSites.includes(window.location.host)) {
        affiliateCode = "4F09FA";
      } else {
        // affiliateCode = "3B1BFB";
        affiliateCode = "";
      }

      sessionStorage.setItem("AFFILIATE_CODE", affiliateCode);
      // api.get(`/app/adjust/params?affiliateCode=${affiliateCode}`).then((res) => {
      //   if (res.code === 0) {
      //     sessionStorage.setItem("AFFILIATE_APP_TOKEN", res.data.adjust_app_token);
      //     sessionStorage.setItem("AFFILIATE_QUICK_REGISTER_EVENT", res.data.adjust_quick_register_event);
      //     sessionStorage.setItem("AFFILIATE_REGISTER_EVENT", res.data.adjust_register_event);
      //     affAppToken.value = res.data.adjust_app_token;
      //     // initAdjustEventTrack();
      //     // alert(affAppToken.value);
      //   }
      // });
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
                    // api.get(`/app/adjust/params?affiliateCode=${channelValue.value}`).then((res) => {
                    //   if (res.code === 0) {
                    //     sessionStorage.setItem("AFFILIATE_APP_TOKEN", res.data.adjust_app_token);
                    //     sessionStorage.setItem("AFFILIATE_QUICK_REGISTER_EVENT", res.data.adjust_quick_register_event);
                    //     sessionStorage.setItem("AFFILIATE_REGISTER_EVENT", res.data.adjust_register_event);
                    //     affAppToken.value = res.data.adjust_app_token;
                    //     // initAdjustEventTrack();
                    //     // alert(affAppToken.value);
                    //   }
                    // });
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
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setBackgroundColor({ color: "#3E1474" });
        await StatusBar.setStyle({ style: Style.Dark });

        // setTimeout(() => {
        //   getInsetHeight();
        // }, 250);
      }
    };

    const getInsetHeight = async () => {
      const ua = navigator.userAgent.toLowerCase();
      console.log(ua);
      const isAndroidPixel = ua.indexOf("android") > -1;
      // && (ua.indexOf("pixel") > -1 || ua.indexOf("samsung") > -1 || ua.indexOf("galaxy") > -1);
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

    const getOnlineStatApi = async () => {
      // console.log("Ok Online.");
      const sidParam = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
      store.visitorId = sidParam;
      const way = Platform.is.capacitor && Platform.is.android ? "ANDROID" : "H5";

      if (sidParam) {
        const res = await api.post(
          "/memberStatistics/submit",
          qs.stringify({
            way: way,
            sid: store.visitorId,
            siteCode: process.env.SITE
          })
        );
      }
    };

    const loadSocialMediaLinks = async () => {
      cached
        .get("socialMediaLinks", () =>
          api.get("/config/uiconfigs").then((res) => {
            return res;
          })
        )
        .then((data) => {
          // console.log("socialMediaLinks", data);
          ui.instagramUrl = data.instagram;
          ui.tiktokUrl = data.tiktok;
          ui.whatsappUrl = data.whatsapp;
          ui.youtubeUrl = data.youtube;
        });
    };

    onMounted(async () => {
      // const info = await App.getInfo();
      // console.log("APP Info");
      // console.log(info);
      checkSID();
      // getCSA();
      getAppInfo();
      initOrientation();
      loadSocialMediaLinks();

      if (isAndroid()) {
        document.addEventListener(
          "deviceready",
          () => {
            onDeviceReady();
            setStatusBarColor();
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

    watch(
      () => ui.shouldFetchDownloadAppUrl,
      (value) => value && ui.getTopDownloadUrl()
    );
  }
});

// document.addEventListener("deviceready", onDeviceReady, false);
</script>
