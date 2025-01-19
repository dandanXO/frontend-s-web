<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { Platform, useQuasar } from "quasar";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { userStore } from "src/stores";
import { isAndroid } from "boot/utils";
import axios from "axios";
import { getVisitorId } from "boot/utils";
import { useUI } from "src/stores/ui";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const ui = useUI();
    const router = useRouter();
    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(false);

    const getAppInfo = async () => {
      const info = await Device.getId();
      // console.log("Device ID");
      // console.log(info);
      // console.log(info.identifier);
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

        //TESTING ONLY.
        // Adjust.getSdkVersion(function(version){
        //   alert(version);
        //   alert(AdjustConfig.EnvironmentProduction);
        //   alert(AdjustConfig.LogLevelVerbose);
        //
        //   var adjEve = new AdjustEvent("123456");
        //   alert(adjEve);
        // })

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
                  trackAppStartEvent();
                });
              })();
            } else {
              store.googleadid = googleid;
              trackAppStartEvent();
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
          attributionCallback: function (e, attribution) {
            // e: internal event name, can be ignored
            // attribution: details about the changed attribution
            console.log("CALLBACK");
            console.log(attribution);
            store.aaid = attribution && attribution.adid ? attribution.adid : "";
          }
        });
        setTimeout(() => {
          const attribution = AdjustWeb.getAttribution();
          console.log("Web Adid");
          console.log(attribution);
          store.aaid = attribution ? attribution.adid : "";
        }, 500);
      }
    };

    const trackAppStartEvent = () => {
      // debugger;
      if (ui.adjust_open_app_event) {
        var adjustEvent = new AdjustEvent(ui.adjust_open_app_event);
        Adjust.trackEvent(adjustEvent);
      }
    };

    const trackH5Affiliate = () => {
      // const omitSites = ["bw3.genoortisy.com"];

      var affiliateCode = "";
      // if (omitSites.includes(window.location.host)) {
      //   affiliateCode = "E4B265";
      // } else {
      //   affiliateCode = "3B1BFB";
      // }

      if (affiliateCode) {
        sessionStorage.setItem("AFFILIATE_CODE", affiliateCode);
        api.get(`/app/adjust/params?affiliateCode=${affiliateCode}`).then((res) => {
          if (res.code === 0) {
            sessionStorage.setItem("AFFILIATE_APP_TOKEN", res.data.adjust_app_token);
            // sessionStorage.setItem("AFFILIATE_QUICK_REGISTER_EVENT", res.data.adjust_quick_register_event);
            // sessionStorage.setItem("AFFILIATE_REGISTER_EVENT", res.data.adjust_register_event);
            if (res.data.adjust_register_event) {
              ui.adjust_register_event = res.data.adjust_register_event;
            }
            if (res.data.adjust_open_app_event) {
              ui.adjust_open_app_event = res.data.adjust_open_app_event;
            }
            if (res.data.adjust_register_fail_event) {
              ui.adjust_register_fail_event = res.data.adjust_register_fail_event;
            }
            if (res.data.adjust_click_register_event) {
              ui.adjust_click_register_event = res.data.adjust_click_register_event;
            }
            affAppToken.value = res.data.adjust_app_token;
            initAdjustEventTrack();
            // alert(affAppToken.value);
          }
        });
      }
    };

    const errorHandler = (error) => {
      console.error("File error: " + error.code);
    };

    const checkSID = async () => {
      const visitorId = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
      store.visitorId = visitorId;
    };

    const getOnlineStatApi = async () => {
      const sidParam = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
      store.visitorId = sidParam;
      const way = Platform.is.capacitor && Platform.is.android ? "ANDROID" : "H5";

      const theSid = store.googleadid ? store.googleadid : store.aaid ? store.aaid : sidParam;
      console.log(theSid);

      if (sidParam) {
        const res = await api.post(
          "/memberStatistics/submit",
          qs.stringify({
            way: way,
            sid: sidParam,
            siteCode: process.env.SITE
          })
        );
      }
    };

    const checkServerStatus = () => {
      axios.get(`https://sumbtf.tebarncale.com/server/status/${process.env.SITEID}`).then((response) => {
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
                        // debugger;
                        sessionStorage.setItem("AFFILIATE_APP_TOKEN", res.data.adjust_app_token);
                        if (res.data.adjust_register_event) {
                          ui.adjust_register_event = res.data.adjust_register_event;
                        }
                        if (res.data.adjust_open_app_event) {
                          ui.adjust_open_app_event = res.data.adjust_open_app_event;
                        }
                        if (res.data.adjust_register_fail_event) {
                          ui.adjust_register_fail_event = res.data.adjust_register_fail_event;
                        }
                        if (res.data.adjust_click_register_event) {
                          ui.adjust_click_register_event = res.data.adjust_click_register_event;
                        }
                        // sessionStorage.setItem("AFFILIATE_QUICK_REGISTER_EVENT", res.data.adjust_quick_register_event);
                        // sessionStorage.setItem("AFFILIATE_REGISTER_EVENT", res.data.adjust_register_event);
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

    onMounted(() => {
      console.log("VNM0106");
      checkServerStatus();
      checkSID();
      getAppInfo();

      if (isAndroid()) {
        document.addEventListener(
          "deviceready",
          () => {
            onDeviceReady();
          },
          false
        );
      } else {
        trackH5Affiliate();
      }

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });
  }
});
</script>
