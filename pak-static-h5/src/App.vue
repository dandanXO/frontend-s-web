<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref, nextTick, watch } from "vue";
import { Platform, SessionStorage, useQuasar } from "quasar";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { userStore } from "src/stores";
import { isAndroid, isInPwa, trackNewUserFtd, getRndInteger, generateEventID } from "boot/utils";
import { AddressbarColor } from "quasar";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
import { useUI } from "src/stores/ui";
import axios from "axios";
import { getVisitorId } from "boot/utils";
import { cached } from "boot/cache";
import { useRoute, useRouter } from "vue-router";
import { App } from "@capacitor/app";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const ui = useUI();
    const router = useRouter();
    const route = useRoute();

    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(true);
    const allowedDomains = [
      "pkmagr98.cc",
      "cbrfobx1.cc",
      "xsu5qyks.cc",
      "5vh518iw.cc",
      "9o48ca3p.cc",
      "b4qn4pb8.cc",
      "gey4oewd.cc",
      "3kxkvvuk.cc",
      "936tk9nn.cc",
      "jxbma2xq.cc"
    ];

    function shouldRedirect(domain) {
      return allowedDomains.includes(domain);
    }

    function handleRedirect() {
      if (!store.isApp()) {
        const currentDomain = window.location.hostname;

        if (shouldRedirect(currentDomain)) {
          SessionStorage.setItem("REDIRECT_PATH", window.location.pathname);
          router.replace("/redirect");
        }
      }
    }

    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      (async () => {
        const visitorId = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());

        store.visitorId = visitorId;
        console.log("SID");
        console.log(visitorId);

        // const obj = {
        //   identifier: store.visitorId,
        //   affiliateCode: affiliateItem
        // };
        // api.post("/memberAccessLog", qs.stringify(obj)).then((res) => {
        //   if (res.code === 0) {
        //   }
        // });
      })();
    };

    const getAppInfo = async () => {
      const info = await Device.getId();
      // console.log("Device ID");
      // console.log(info);
      // console.log(info.identifier);
      const isPwa = process.env.IS_PWA;
      // alert(isPwa);
      if (isPwa === "1") {
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
        // adjustConfig.setAttributionCallbackListener(function (e) {
        //   console.log("setAttributionCallbackListener");
        //   console.log(e);
        // });
        Adjust.initSdk(adjustConfig);
        setTimeout(() => {
          // Adjust.getAdid().then((aaid) => {
          //   console.log("aaid");
          //   console.log(aaid);
          //   if (store.aaid === "") {
          //     store.aaid = aaid;
          //   }
          // });
          Adjust.getGoogleAdId((googleid) => {
            console.log("Google AdID");
            console.log(googleid);
            if (!googleid || googleid === "00000000-0000-0000-0000-000000000000") {
              (async () => {
                Adjust.getAdid(function (adid) {
                  console.log("Attribution 2");
                  console.log(adid);
                  store.aaid = adid;
                });
              })();
            } else {
              store.googleadid = googleid;
            }
          });
        }, 0);
      } else {
        //Normal WEb / H5 / iOS WEbclip.
        console.log("Init Web Adjust");
        console.log(affAppToken.value);
        const AdjustWeb = require("@adjustcom/adjust-web-sdk");
        const savedAdjustReferrer = sessionStorage.getItem("ADJUST_REFERRER");
        if (savedAdjustReferrer) {
          AdjustWeb.setReferrer(encodeURIComponent(savedAdjustReferrer));
        }
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
            console.log("Web UUID");
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
        linkId: parsedParams["link_id"] ?? "",
        fbclid: parsedParams["fbclid"] ?? "",
        adCode: parsedParams["adCode"] ?? ""
      };
    };

    const sendFacebookInfo = () => {
      const { fbclid, linkId } = getRbParams() || {};

      const fbclid2 = window.localStorage.getItem("fbclid");

      const fbc = fbclid;
      const siteCode = "PAK";

      const getCookie = (name) => {
        const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
        return match ? decodeURIComponent(match[1]) : null;
      };

      const getFbclid = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("fbclid");
      };

      const fbc3 = getFbclid();

      const getFbClientId = () => {
        let result = /_fbp=(fb\.1\.\d+\.\d+)/.exec(window.document.cookie);
        if (!(result && result[1])) {
          return null;
        }
        return result[1];
      };

      // const fbp = getCookie("_fbp");
      // Extract the last portion of _fbp
      const fbp = (() => {
        const rawFbp = getCookie("_fbp");
        return rawFbp ? rawFbp.split(".").pop() : null;
      })();

      const fbp2 = (() => {
        const rawFbp = getFbClientId();
        return rawFbp ? rawFbp : null;
      })();

      const randUuid = generateEventID();
      const payload = new URLSearchParams({
        fbp: fbp || fbp2 || "",
        fbc: fbc || fbclid2 || fbc3 || randUuid,
        siteCode: siteCode,
        linkId: linkId || ""
      });

      // alert(`payload: ${payload}`);

      var rstArray = Object.values(process.env.RST_API);
      var rstApi = rstArray[getRndInteger(0, rstArray.length)];

      // Make the POST request
      fetch(`${rstApi}/app/facebookInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          const randomValue = Math.floor(Math.random() * (999 - 300 + 1)) + 300;
          if (data.data.sendEvent === "ftd") {
            fbq(
              "track",
              "Purchase",
              {
                currency: "PKR",
                value: randomValue
              },
              { eventID: randUuid }
            );
          }
          // alert(JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const getDomainWithoutSubdomain = () => {
      let hostname = window.location.hostname;
      let parts = hostname.split(".");

      // 处理 localhost 和 IP
      if (parts.length <= 2 || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname === "localhost") {
        return hostname; // 直接返回 IP 或 localhost
      }

      return parts.slice(1).join("."); // 去掉第一个 subdomain
    };

    const trackH5Affiliate = async () => {
      const hostname = getDomainWithoutSubdomain();
      //FOR TESTING.
      // const hostname = "igooaa.com";

      if (isInPwa()) {
        api.get(`/app/pwa/log?step=OPEN&siteCode=${process.env.SITE}`).then((res2) => {
          console.log("OPEN");
        });

        var { adCode } = getRbParams() || {};
        if (!adCode) {
          adCode = "";
        }
        let _affiliateCode = "";
        //Use thisApi to get AffiliateCode/FbPixelId/ WebPushId for PWA.
        await api
          .get(`/app/affiliate/params?domain=${hostname}&siteCode=${process.env.SITE}&affiliateCode=${adCode}`)
          .then((res) => {
            const { affiliateCode = "", facebookId = "", pushId = "" } = res.data;
            sessionStorage.setItem("AFFILIATE_CODE", affiliateCode);
            _affiliateCode = affiliateCode;
            console.log("Init FB");
            if (facebookId) {
              fbq("init", facebookId);
              fbq("track", "PageView");
              store.isFbPixel = true;
              sendFacebookInfo();
            }
            if (pushId) {
              initEngageLabPush(pushId);
            }
          });

        api.get(`/app/adjust/params?affiliateCode=${_affiliateCode}`).then((res) => {
          if (res.code === 0) {
            sessionStorage.setItem("AFFILIATE_APP_TOKEN", res.data.adjust_app_token);
            if (res.data.adjust_register_event) {
              ui.adjust_register_event = res.data.adjust_register_event;
            }
            affAppToken.value = res.data.adjust_app_token;
            initAdjustEventTrack();
          }
        });
      } else {
        const timer = setInterval(async () => {
          if (store.isReferralReady) {
            clearInterval(timer);
          } else {
            return;
          }
          const savedAffiliateCode = sessionStorage.getItem("AFFILIATE_CODE") || "";
          let _affiliateCode = "";
          const referral = route.params.referralCode
            ? route.params.referralCode
            : sessionStorage.getItem("REFERRAL_CODE")
            ? sessionStorage.getItem("REFERRAL_CODE")
            : localStorage.getItem("REG_REFERRAL_CODE") || "";
          await api
            .get(
              `/app/affiliate/params?domain=${hostname}&siteCode=${process.env.SITE}&affiliateCode=${savedAffiliateCode}&refer=${referral}`
            )
            .then((res) => {
              console.log(res);
              const { affiliateCode = "", facebookId = "" } = res.data;
              sessionStorage.setItem("AFFILIATE_CODE", affiliateCode);
              _affiliateCode = affiliateCode;
              if (facebookId) {
                fbq("init", facebookId);
                fbq("track", "PageView");
                store.isFbPixel = true;
              }
            });

          api.get(`/app/adjust/params?affiliateCode=${_affiliateCode}`).then((res) => {
            if (res.code === 0) {
              sessionStorage.setItem("AFFILIATE_APP_TOKEN", res.data.adjust_app_token);
              if (res.data.adjust_register_event) {
                ui.adjust_register_event = res.data.adjust_register_event;
              }
              affAppToken.value = res.data.adjust_app_token;
              initAdjustEventTrack();
            }
          });
        }, 100);
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
      const sid = store.aaid || store.visitorId;

      if (sidParam) {
        const res = await api.post(
          "/memberStatistics/submit",
          qs.stringify({
            way: way,
            sid: sid,
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
          ui.charityUrl = data.charity_url;
          ui.footerIcon = data.footer_icon;

          ui.promo_exchange = data.promo_exchange;
          ui.promo_megaspin = data.promo_megaspin;
        });
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

    const checkIfVirtualMachine = async () => {
      const info = await Device.getInfo();

      const isEmulator = info.isVirtual;
      const model = info.model;
      const manufacturer = info.manufacturer;

      if (isEmulator || model.includes("sdk") || manufacturer.includes("Genymotion")) {
        console.log("This is a virtual machine or emulator.");
        App.exitApp();
      } else {
        console.log("This is a physical device.");
      }
    };

    const checkFBPixelInit = () => {
      //FOr Testing.
      // const windowLocation = "b9game0.com";
      const windowLocation = window.location.hostname;
      const pixelDataStr = sessionStorage.getItem("FB_PIXEL_CODE");
      const isNoPixel = sessionStorage.getItem("NO_FB_PIXEL_CODE");
      if (isNoPixel) {
        return;
      } else if (pixelDataStr) {
        registerFbPixel(JSON.parse(pixelDataStr));
      } else {
        api.get(`/member/fb-request?url=${windowLocation}`).then((res) => {
          if (res.code === 0) {
            registerFbPixel(res.data);
            sessionStorage.setItem("FB_PIXEL_CODE", JSON.stringify(res.data));
          } else {
            sessionStorage.setItem("NO_FB_PIXEL_CODE", "1");
          }
        });
      }
    };

    const registerFbPixel = (res) => {
      const { fbId, token } = res;
      if (fbId !== "1") {
        const fbIdList = fbId.split("|");
        fbIdList.forEach((_fbId) => fbq("init", _fbId));
      } else {
        const tokenObj = JSON.parse(token);
        const referralCode =
          route.name === "referCode" && route.params.referralCode
            ? route.params.referralCode
            : sessionStorage.getItem("REFERRAL_CODE")
            ? sessionStorage.getItem("REFERRAL_CODE")
            : localStorage.getItem("REG_REFERRAL_CODE");
        const _fbId = tokenObj[referralCode] || tokenObj.DEFAULT;
        if (!_fbId) return;
        fbq("init", _fbId);
      }
      fbq("track", "PageView");
      store.isFbPixel = true;
      store.isOldFBPixel = true;

      const isNewUser = localStorage.getItem("newUserFtd");
      if (isNewUser) {
        document.addEventListener("ftdPurchaseSuccess", trackNewUserFtd, { once: true });
      }
    };

    onMounted(async () => {
      console.log("pak-static-h5 0220");

      handleRedirect();

      //COMMENT IT FOR TESTING In EMULATOR.
      checkIfVirtualMachine();
      checkServerStatus();
      checkSID();
      // getCSA();
      getAppInfo();
      initOrientation();
      loadSocialMediaLinks();

      if (isAndroid() && !isInPwa()) {
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
      checkFBPixelInit();
    });

    watch(
      () => ui.shouldFetchDownloadAppUrl,
      (value) => value && ui.getTopDownloadUrl()
    );
    watch(
      () => window.location.hostname,
      () => {
        const currentDomain = window.location.hostname;
        const redirectKey = `redirected-${currentDomain}`;
        if (!sessionStorage.getItem(redirectKey)) {
          handleRedirect();
        }
      }
    );
  }
});

// document.addEventListener("deviceready", onDeviceReady, false);
</script>
