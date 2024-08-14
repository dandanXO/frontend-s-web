<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { Platform, useQuasar } from "quasar";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import CsClient from "csweb-client";
// import CsClient from "boot/client";
import { userStore } from "src/stores";
import { isAndroid } from "boot/utils";
import axios from "axios";
import { cached } from "boot/cache";
import { getVisitorId } from "boot/utils";
import { useUI } from "src/stores/ui";
import { EDITION } from "./constant/edition";
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
    const onlineStatTimeout = ref();
    const onlineStatInterval = ref();

    let csclient;
    let CSAUrl;

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
            siteCode: "vnm"
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

    const checkEdition = () => {
      // TODO: check edition here
    };

    onMounted(() => {
      checkServerStatus();
      checkSID();
      // initCsWeb();
      getCSA();
      getAppInfo();
      checkEdition();

      // onlineStatTimeout.value = setTimeout(getOnlineStatApi, 2000);
      // onlineStatInterval.value = setInterval(getOnlineStatApi, 60000);

      if (isAndroid()) {
        document.addEventListener(
          "deviceready",
          () => {
            onDeviceReady();
            // setStatusBarColor();
          },
          false
        );
      } else {
        trackH5Affiliate();
        // addCloudWiseTrackCode();
      }

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });

    // onUnmounted(() => {
    //   clearTimeout(onlineStatTimeout);
    //   clearInterval(onlineStatInterval);
    // });
  }
});
</script>
