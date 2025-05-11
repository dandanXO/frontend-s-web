import { route, store } from "quasar/wrappers";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";

import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { StatusBar } from "@capacitor/status-bar";
import { Platform, useQuasar } from "quasar";
import { isAndroid } from "boot/utils";
import { SessionStorage } from "quasar";
import { useGtag } from "vue-gtag-next";
import { i18n, t } from "src/boot/lang";
import { i18nStore } from "./language";
import { DEFAULT_LANG } from "src/constant/lang";
let isRedirected = false;

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const gtag = useGtag();
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: process.env.VUE_ROUTER_MODE === "history" ? createWebHistory() : createWebHashHistory()
  });

  Router.beforeEach((to, from, next) => {
    const user = userStore();
    const ui = useUI();
    const $q = useQuasar();
    const i18nStoreLanguage = i18nStore();
    const { availableLocales } = i18n.global;
    const { lang, gaid, affiliateCode } = to.query;

    if (!i18nStoreLanguage.isLangInitialized && lang) {
      const locale = availableLocales.includes(lang) ? lang : DEFAULT_LANG;
      i18nStoreLanguage.initializeLang(locale);
    }

    if (!user.isCheckGaid) {
      const isFromGooglePackage = !!gaid;
      const savedIsFromGooglePackage = SessionStorage.getItem("IS_FROM_GOOGLE_PACKAGE");
      const savedGaid = SessionStorage.getItem("GAID_FROM_GOOGLE_PACKAGE");
      if (savedIsFromGooglePackage === null) {
        SessionStorage.setItem("IS_FROM_GOOGLE_PACKAGE", isFromGooglePackage);
        user.isFromGooglePackage = isFromGooglePackage;
        if (isFromGooglePackage) {
          SessionStorage.setItem("GAID_FROM_GOOGLE_PACKAGE", gaid);
          user.aaid = gaid;
        }
        if (affiliateCode) {
          sessionStorage.setItem("AFFILIATE_CODE", affiliateCode);
        }
      } else {
        user.isFromGooglePackage = savedIsFromGooglePackage;
        if (savedGaid) {
          user.aaid = savedGaid;
        }
      }
      user.isCheckGaid = true;
    }

    if (to.query.adjust_referrer) {
      sessionStorage.setItem("ADJUST_REFERRER", to.query.adjust_referrer);
    }

    if (user.token && from && from.href) {
      user.getBalance();
    }

    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/forgot-password" ||
      to.path === "/verification" ||
      to.path === "/deposit" ||
      to.path === "/withdraw" ||
      to.path === "/promotion" ||
      to.path === "/language" ||
      to.path === "/maintenance"
    ) {
      ui.hiddenFooter();
    } else {
      ui.showFooter();
    }

    if (from.path === "/promotion") {
      // alert(to.path);
      window.location.href = "xfapp:" + to.fullPath;
    }

    if (to.path === "/promotion") {
      // debugger;
      if (isAndroid()) {
        localStorage.setItem("TOKEN", to.query.token);
      } else {
        SessionStorage.set("TOKEN", to.query.token);
      }
      user.token = to.query.token;
    }
    if (Platform.is.capacitor && Platform.is.android) {
      StatusBar.hide();
      // const isFirstTime = localStorage.getItem("isFirstTimeInApp");

      // if (!isFirstTime) { // If it's the first time
      // localStorage.setItem("isFirstTimeInApp", 'true'); // Mark as visited
      // next("/register");
      // }
    }

    const getTkPixelId = sessionStorage.getItem("TK_PIXEL_ID");
    if (getTkPixelId) {
      ttq.load(getTkPixelId);
      ttq.page();
      user.isTkPixel = true;
    } else if (window.location.href.indexOf("f9qdwgww.cc") > -1) {
      ttq.load("CSLMK0RC77U84I7KJA5G");
      ttq.page();
      user.isTkPixel = true;
    } else if (
      window.location.href.indexOf("fbiyucw0.cc") > -1 &&
      window.location.href.indexOf("MDM1NjU2NzcwMDI=") > -1
    ) {
      console.log("2");
      ttq.load("CSLMK0RC77U84I7KJA5G");
      ttq.page();
      user.isTkPixel = true;
      sessionStorage.setItem("TK_PIXEL_ID", "CSLMK0RC77U84I7KJA5G");
    }

    // if (to.name === "referCode") {
    //   sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
    //   next(`/register`);
    // }

    if (to.name === "agentCode" || to.name === "memberCode") {
      if(to.name === "memberCode") {
        sessionStorage.setItem("AFFILIATE_MEMBERTYPE", "MEMBER");
      } else if(to.name === "agentCode") {
        sessionStorage.setItem("AFFILIATE_MEMBERTYPE", "AFFILIATE");
      }

      sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
      user.isReferralReady = true;
      isRedirected = true;

      if (to.query.reg) {
        next("/register");
      } else {
        next("/");
      }
    }

    if (to.name === "referCodeSpin") {
      sessionStorage.setItem("REFERRAL_SPIN_CODE", to.params.referralSpinCode);
      localStorage.removeItem("REG_REFERRAL_CODE");
      next(`/register`);
    }
    if (to.name === "referCode") {
      sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
      localStorage.removeItem("REG_REFERRAL_CODE");
      user.isReferralReady = true;
      isRedirected = true;
      next("/register");
    }

    if (!isRedirected) {
      user.isReferralReady = true;
      isRedirected = true;
    }

    if (to.name === "RegisterPage") {
      next(`/register`);
    }

    if (user.hasToken()) {
      if (to.path === "/" || to.path === "/register" || to.path === "/login" || to.path === "//") {
        next({ path: "/home" });
      } else {
        if (user.nickName === "") {
          user.getMemberInfo().then(() => {
            if (window.location.hostname !== "localhost") {
              if (from.path === "/login" && to.path === "/home") {
                gtag.event("login", {
                  custom_user_id: user.nickName
                });
              } else if (from.path === "/register" && to.path === "/home") {
                gtag.event("register", {
                  custom_user_id: user.nickName
                });
              }
            }

            next({ ...to, replace: true });
          });
        } else {
          next();
        }
      }
    } else {
      if (to.meta.requiresAuth) {
        next(`/login`);

        $q.notify({
          color: "negative",
          position: "top",
          message: t("notify.plsLoginToContinue"),
          icon: "report_problem"
        });
      } else {
        next();
      }
    }
  });

  return Router;
});
