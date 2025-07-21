<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { AddressbarColor, Platform, useQuasar } from "quasar";
import { api } from "boot/axios";
import CsClient from "csweb-client";
import { userStore } from "src/stores";
import { cached } from "boot/cache";
import { useRouter } from "vue-router";
import { generateEventID, getRndInteger, isAndroid, isHuaweiPhone, isInPwa } from "boot/utils";
import axios from "axios";
import { getVisitorId } from "boot/utils";
import { useUI } from "stores/ui";
import { useI18n } from "vue-i18n";
import { StatusBar, Style } from "@capacitor/status-bar";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs");
    var router = useRouter();
    const ui = useUI();
    const store = userStore();
    const $q = useQuasar(); // calling here; equivalent to when component
    $q.dark.set(false);
    const { t } = useI18n();
    const affAppToken = ref("");
    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");

      (async () => {
        const visitorId = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
        store.visitorId = visitorId;

        if (store.isNotAppPromo()) {
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
        }
      })();
    };
    let csclient;
    let CSAUrl;

    const getCSA = () => {
      if (!store.isNotAppPromo()) return;
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
          // initCsWeb();
          console.log(CSAUrl);
        })
        .catch((err) => {
          console.log(err);
          CSAUrl = "csweb01.c8nhwrqx4.com";
        });
    };

    // const initCsWeb = () => {
    //   var regDevice = store.getDeviceType();
    //   // console.log("Footer OnMounted");

    //   // 'DYCS' / 4
    //   csclient = new CsClient("DYCS", regDevice, "zh-CN", "2", "prod", `https://${CSAUrl}`);
    //   // csclient = new CsClient('DYCS', regDevice, 'zh-CN', '2','local', '');

    //   csclient.set("pageurl", "/liveChat");
    //   csclient.set("btnid", "cs-web-id");
    //   csclient.set("openanimation", false);

    //   csclient.set("notification-type", {
    //     type: "none"
    //   });

    //   if (store.token) {
    //     csclient.set("token", store.token);
    //   }

    //   //客服初始化。
    //   csclient.init();

    //   csclient.receiveListener("message", function (callback) {
    //     //收到新消息。
    //     // alert(callback);
    //   });

    //   //CsClient Event Listener.
    //   window.addEventListener("message", function (event) {
    //     // console.log("HEre Message received from the iframe: " + event.data); // Message received from child
    //     if (_.isString(event.data)) {
    //       // if (event.data == 'sess_timeout') {
    //       //   router.push({path: "/liveChat"});
    //       // }
    //     }
    //   });
    // };

    const getOnlineStatApi = async () => {
      // console.log("Ok Online.");
      const sidParam = store.visitorId;
      const way = "h5";

      if (sidParam && store.isNotAppPromo()) {
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

    const checkSessStorageItem = () => {
      const checkItem = sessionStorage.getItem("ERROR_TOKEN_LOGGED");
      if (checkItem) {
        sessionStorage.removeItem("ERROR_TOKEN_LOGGED");
        $q.notify({
          color: "negative",
          position: "top",
          message: t("common.notification.tokenLogged.message"),
          icon: "report_problem"
        });
      }
    };

    const getAffiliateByDomain = () => {
      var host = window.location.host;
      var siteCode = process.env.SITE;
      // host = "www.lh56917.com";
      if (store.isNotAppPromo()) {
        api.get(`/app/getAffiliateCode?siteCode=${siteCode}&domain=${host}`).then((res) => {
          console.log(res);
          if (res.code === 0 && res.data !== "") {
            // alert(res.data)
            var agentCode = res.data;
            sessionStorage.setItem("AFFILIATE_CODE", agentCode);
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
      AddressbarColor.set("#ffffff");
      if (Platform.is.capacitor && Platform.is.android) {
        // console.log("STATUSBARR");
        await StatusBar.hide();
        setTimeout(async () => {
          await StatusBar.setOverlaysWebView({ overlay: true });
        }, 500);
        await StatusBar.setBackgroundColor({ color: "#ffffff" });
        await StatusBar.setStyle({ style: Style.Dark });

        // setTimeout(() => {
        //   getInsetHeight();
        // }, 250);
      }
    };

    const handleVisibilityChange = (status) => {
      if (Platform.is.capacitor && Platform.is.android) {
        StatusBar.hide();
      }
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
      } else if (process.env.MODE === "spa") {
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

    const getDomainWithoutSubdomain = () => {
      let hostname = window.location.hostname;
      let parts = hostname.split(".");

      // 处理 localhost 和 IP
      if (parts.length <= 2 || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname === "localhost") {
        return hostname; // 直接返回 IP 或 localhost
      }

      return parts.slice(1).join("."); // 去掉第一个 subdomain
    };

    onMounted(() => {
      console.log("lk6-static-h5 0704");

      checkServerStatus();
      checkSID();
      // initCsWeb();
      getCSA();
      if (isAndroid() && !isHuaweiPhone()) {
        window.screen.orientation.lock("portrait");
      }

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
        const timer = setInterval(() => {
          trackH5Affiliate();
        });
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // getAffiliateByDomain();
      checkSessStorageItem();

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });
  }
  /*test*/
});
</script>
