<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref, nextTick, watch } from "vue";
import { Platform, SessionStorage, useQuasar } from "quasar";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { userStore } from "src/stores";
import { isAndroid, isInPwa } from "boot/utils";
import { AddressbarColor } from "quasar";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
import { useUI } from "src/stores/ui";
import axios from "axios";
import { getVisitorId } from "boot/utils";
import { cached } from "boot/cache";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    const store = userStore();
    const ui = useUI();
    const router = useRouter();
    const route = useRoute();

    const $q = useQuasar(); // calling here; equivalent to when component
    // $q.dark.set(true);
    const allowedDomains = [
      "5fwuk.cc",
      "erdqo.cc",
      "hgwpc.cc",
      "qtmjv.cc",
      "x0ezt.cc",
      "1l56s3.vip",
      "915ajq.vip",
      "hkrep8.vip",
      "mtfrqo.vip",
      "yuwriv.vip"
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
            // if (facebookId) {
            //   fbq("init", facebookId);
            //   fbq("track", "PageView");
            //   store.isFbPixel = true;
            //   sendFacebookInfo();
            // }
            // if (pushId) {
            //   initEngageLabPush(pushId);
            // }
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
          ui.footerIcon = data.footer_icon;
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

    const checkFBPixelInit = () => {
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

      const isNewUser = isInPwa() ? localStorage.getItem("newUserFtd") : sessionStorage.getItem("newUserFtd");
      if (isNewUser) {
        document.addEventListener("ftdSuccess", trackNewUserFtd);
      }
    };

    onMounted(async () => {
      handleRedirect();
      // const info = await App.getInfo();
      // console.log("APP Info");
      // console.log(info);
      checkServerStatus();
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
