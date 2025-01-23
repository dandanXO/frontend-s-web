<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref, nextTick } from "vue";
import { Platform, useQuasar } from "quasar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { userStore } from "src/stores";
import { isAndroid, isInPwa } from "boot/utils";
import { AddressbarColor } from "quasar";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useUI } from "src/stores/ui";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const ui = useUI();
    const router = useRouter();

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
      const isPwa= process.env.IS_PWA;
      // alert(isPwa);
      if(isPwa){
        sessionStorage.setItem("IS_PWA", "1");
      }
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
            store.aaid = attribution && attribution.adid ? attribution.adid : "";
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

    const getRbParams = () => {
      const params = JSON.parse(localStorage.getItem(`__rb_${process.env.ROUTER_BASE}_params`));
      // alert(params);

      if (!params) {
        console.warn("No params found in localStorage");
        return null;
      }

      const extractParams = (paramsString) => {
        const result = {};
        const pairs = paramsString.split("&");
        pairs.forEach((pair) => {
          const [key, value] = pair.split("=");
          if (key && value) {
            result[key] = decodeURIComponent(value);
          }
        });
        return result;
      };

      const parsedParams = extractParams(params);
      return {
        fbclid: parsedParams["fbclid"] ?? "",
        adCode: parsedParams["adCode"] ?? ""
      };
    };

    const sendFacebookInfo = () => {
      // const urlParams = new URLSearchParams(window.location.search);
      // const fbclid = urlParams.get("fbclid");

      const { fbclid } = getRbParams() || {};

      const fbc = fbclid;
      const siteCode = "IND";

      const getCookie = (name) => {
        const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
        return match ? decodeURIComponent(match[1]) : null;
      };

      // const fbp = getCookie("_fbp");
      // Extract the last portion of _fbp
      const fbp = (() => {
        const rawFbp = getCookie("_fbp");
        return rawFbp ? rawFbp.split(".").pop() : null;
      })();

      // alert(`fbc: ${fbc}`);

      const payload = new URLSearchParams({
        fbp: fbp || "",
        fbc: fbc || "",
        siteCode: siteCode
      });

      // alert(`payload: ${payload}`);

      // Make the POST request
      fetch("https://tljwn.plan2wtion.com/app/facebookInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // alert(JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const trackH5Affiliate = () => {
      const omitSites = ["bw3.genoortisy.com"];
      if (isInPwa()) {
        api.get(`/app/pwa/log?step=OPEN&siteCode=${process.env.SITE}`).then((res2) => {
          console.log("OPEN");
        });

        const hostname = window.location.hostname.replace("www.", "");
        const { adCode } = getRbParams() || {};
        //Use thisApi to get AffiliateCode/FbPixelId/ WebPushId for PWA.
        api
          .get(`/app/affiliate/params?domain=${hostname}&siteCode=${process.env.SITE}&affiliateCode=${adCode}`)
          .then((res) => {
            console.log(res);
            const { affiliateCode, facebookId, pushId } = res.data;
            sessionStorage.setItem("AFFILIATE_CODE", affiliateCode);
            console.log("Init FB");
            fbq("init", facebookId);
            fbq("track", "PageView");
            store.isFbPixel = true;

            initEngageLabPush(pushId);
            sendFacebookInfo();
          });
      } else {
        var affiliateCode = "";
        if (omitSites.includes(window.location.host)) {
          affiliateCode = "E4B265";
        } else {
          affiliateCode = "8999B3";
        }

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
            // alert(affAppToken.value);
          }
        });
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
        await StatusBar.hide();
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setBackgroundColor({ color: "#3E1474" });
        await StatusBar.setStyle({ style: Style.Dark });
      }
    };

    const handleVisibilityChange = (status) => {
      if (Platform.is.capacitor && Platform.is.android) {
        StatusBar.hide();
      }
    };

    const getOnlineStatApi = async () => {
      const fpPromise = FingerprintJS.load();

      if (isAndroid()) {
        const info = await App.getInfo();
        var current_version = info.version;
      } else {
        var current_version = "";
      }

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
            siteCode: process.env.SITE,
            appVersion: current_version
          })
        );
      }
    };

    // check server status
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

    // PWA
    const initEngageLabPush = (appKeyId) => {
      // Supported versions: 2.1.9+
      console.log("initEngageLabPush");

      const requestNotificationPermission = async () => {
        if (Notification.permission === "default") {
          // Prompt user to allow notifications
          try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              console.log("Notification permission granted.");
              initializePush(appKeyId);
            } else {
              console.log("Notification permission denied.");
              // alert("Please enable notifications to receive updates.");
            }
          } catch (error) {
            console.error("Failed to request notification permission:", error);
          }
        } else if (Notification.permission === "granted") {
          console.log("Notification permission already granted.");
          initializePush(appKeyId);
        } else {
          console.log("Notification permission denied.");
          // alert("Please enable notifications in your browser settings.");
        }
      };

      // Push initialization logic
      const initializePush = (appKeyId) => {
        function randomUid() {
          const keyStr = "mtWebPushRandomUid";
          let uid = window.localStorage.getItem(keyStr);
          if (!uid) {
            uid = new Date().getTime().toString(36) + Math.floor(Math.random() * 10000000).toString(36);
            window.localStorage.setItem(keyStr, uid);
          }
          return uid;
        }

        // Get push messages
        MTpushInterface.onMsgReceive((msgData) => {
          // alert("RECEIVE MSG");
          console.log("Get push Messages:", msgData);
        });

        console.log("TSET This 2");
        // Push initialization
        MTpushInterface.init({
          // appkey: "b5889158edb4a1de20f79367",
          appkey: appKeyId,
          user_str: randomUid(),
          fail(err) {
            console.log("Failed to create an online push", err);
          },
          success(data) {
            console.log("The online push is created successfully.", data);
            // alert("Success Init Engage Lab. DATA: " + data.regid);
          },
          webPushcallback(code, tip) {
            console.log("The status code and prompt obtained by the user", code, tip);
          },
          swUrl: "static/pwa/js/webpush/sw.produce.min.2.2.1.js",
          canGetInfo(data) {
            console.log(data);
            // alert("Get the RegId: " + MTpushInterface.getRegistrationID());
          },
          custom: (fuc) => {
            // Custom permission prompt logic
          }
        });

        if (isInPwa()) {
          const fbclid = window.localStorage.getItem("fbclid");
          if (fbclid && !window.location.search.includes("fbclid")) {
            const url = new URL(window.location.href);
            url.searchParams.set("fbclid", fbclid);
            window.history.replaceState({}, "", url.toString());
          }
        }
      };

      // Start the notification permission check
      requestNotificationPermission();
    };

    onMounted(async () => {
      console.log("APP Info");
      // alert("ws 4")
      checkServerStatus();
      getAppInfo();
      initOrientation();
      AOS.init();

      if (isAndroid() && !isInPwa()) {
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
