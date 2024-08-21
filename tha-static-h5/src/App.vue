<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { Platform, useQuasar } from "quasar";
import { getVisitorId, isAndroid } from "boot/utils";
import { api } from "boot/axios";
import CsClient from "csweb-client";
// import CsClient from "boot/client";
import { userStore } from "stores/index";
import * as _ from "lodash";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";
import { useUI } from "stores/ui";
import axios from "axios";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const ui = useUI();
    const router = useRouter();
    const $q = useQuasar();
    $q.dark.set(true);
    $q.screen.setSizes({ sm: 500, md: 768, lg: 991, xl: 1280 });
    const store = userStore();

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

    const regDevice = Platform.is.mobile && Platform.is.capacitor ? "ANDROID" : Platform.is.mobile ? "H5" : "WEB";

    let csclient;
    const initCsWeb = () => {
      csclient = new CsClient("5", regDevice, "th", "2", "prod");

      csclient.set("pageurl", "/liveChat");
      csclient.set("btnid", "cs-web-id");
      csclient.set("notification-type", {
        type: "breathing",
        color: "#FB4BFF"
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
        if (_.isString(event.data)) {
          if (event.data == "closenotice") {
            router.go(-1);
          }
        }
      });
    };

    // const getCSA = () => {
    //   cached.get("customerAddress", () => api.get("/config/customerAddress").then((res) => {
    //     return res
    //   })).then((data) => {
    //     // console.log("here");
    //     // console.log(data);
    //     const url = new URL(data);
    //     CSAUrl = url.hostname;
    //     initCsWeb();
    //     console.log(CSAUrl)
    //   }).catch((err) => {
    //     console.log(err);
    //     CSAUrl = "csweb01.c8nhwrqx4.com";
    //   });
    // };

    const initStorage = () => {
      localStorage.removeItem("LINE_STICKY_OFF");
    };

    const initListenApp = () => {
      App.addListener("appUrlOpen", function (event) {
        // Example url: https://beerswift.app/tabs/tabs2
        // slug = /tabs/tabs2
        const slug = event.url.split(".com").pop();

        // alert(slug);
        console.log(slug);
        // We only push to the route if there is a slug present
        if (slug) {
          // alert("GO");
          // alert(slug);
          router.push({
            path: slug
          });
        }
      });
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
      var affiliateCode = "4DF2C4";

      // sessionStorage.setItem("AFFILIATE_CODE", affiliateCode);
      api.get(`/app/adjust/params?affiliateCode=${affiliateCode}`).then((ret) => {
        const res = ret.data;
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
                    api.get(`/app/adjust/params?affiliateCode=${channelValue.value}`).then((ret) => {
                      const res = ret.data;
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

    const getOnlineStatApi = async () => {
      // console.log("Ok Online.");
      const way = Platform.is.capacitor && Platform.is.android ? "ANDROID" : "H5";
      const theSid = store.googleadid ? store.googleadid : store.aaid ? store.aaid : store.visitorId;
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

    onMounted(() => {
      checkSID();
      initCsWeb();
      initStorage();
      checkAgentFrom();
      // initListenApp();
      // getCSA();

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
