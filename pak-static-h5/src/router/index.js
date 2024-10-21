import { route, store } from "quasar/wrappers";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";

import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { StatusBar } from "@capacitor/status-bar";
import { Platform, useQuasar } from "quasar";
import { isAndroid } from "boot/utils";
import { SessionStorage } from "quasar";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
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
    history: createHistory(process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE)
  });
  Router.beforeEach((to, from, next) => {
    const user = userStore();
    const ui = useUI();
    const $q = useQuasar();

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
    }

    // FB tracking
    // console.log("Fb track.");
    // console.log(window.location.href);
    const getPixelId = sessionStorage.getItem("FB_PIXEL_ID");
    console.log(getPixelId);
    if (getPixelId) {
      fbq("init", getPixelId);
      fbq("track", "PageView");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("5shl8hk3.cc") > -1) {
      console.log("1");
      fbq("init", "864258358743236");
      fbq("track", "PageView");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("79hgkvfs.cc") > -1 || window.location.href.indexOf("q1qf0fa5.cc") > -1) {
      console.log("2");
      fbq("init", "1187424955646133");
      fbq("track", "PageView");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("p5jm1g90.cc") > -1) {
      console.log("3");
      fbq("init", "530500759603360");
      fbq("track", "PageView");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("zp6marm8.cc") > -1) {
      console.log("4");
      fbq("init", "404291659176444");
      fbq("init", "733054452322766");
      fbq("track", "PageView");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDE=") > -1) {
      console.log("6");
      fbq("init", "1072977007651137");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1072977007651137");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDI=") > -1) {
      console.log("7");
      fbq("init", "1254087609071881");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1254087609071881");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDM=") > -1) {
      console.log("8");
      fbq("init", "529778216442169");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "529778216442169");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDQ=") > -1) {
      console.log("9");
      fbq("init", "943006857638809");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "943006857638809");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDU=") > -1) {
      console.log("10");
      fbq("init", "555685270320864");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "555685270320864");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDY=") > -1) {
      console.log("11");
      fbq("init", "1042339097592319");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1042339097592319");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDc=") > -1) {
      console.log("12");
      fbq("init", "484509444603628");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "484509444603628");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDg=") > -1) {
      console.log("13");
      fbq("init", "443298088242926");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "443298088242926");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMDk=") > -1) {
      console.log("14");
      fbq("init", "1008797584264347");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1008797584264347");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("MDM2NjU1NDMwMTA=") > -1) {
      console.log("15");
      fbq("init", "1706878899881106");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1706878899881106");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("6enl6g7v.cc") > -1) {
      console.log("6enl6g7v + 1906929669800133");
      fbq("init", "1906929669800133");
      fbq("track", "PageView");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("wd1caof6.cc") > -1 &&
      window.location.href.indexOf("MDMzMDU5OTAwMDE") > -1
    ) {
      fbq("init", "514007094887323");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "514007094887323");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("wd1caof6.cc") > -1 &&
      window.location.href.indexOf("MDMzMDU5OTAwMDI") > -1
    ) {
      fbq("init", "2334137540252703");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "2334137540252703");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("wd1caof6.cc") > -1 &&
      window.location.href.indexOf("MDMzMDU5OTAwMDM") > -1
    ) {
      fbq("init", "527651743204705");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "527651743204705");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("wd1caof6.cc") > -1 &&
      window.location.href.indexOf("MDMzMDU5OTAwMDQ") > -1
    ) {
      fbq("init", "9489951827699569");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "9489951827699569");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("vnizsxdc.cc") > -1 &&
      window.location.href.indexOf("MDMyMjMzODkwMDE=") > -1
    ) {
      fbq("init", "529666413258940");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "529666413258940");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("vnizsxdc.cc") > -1 &&
      window.location.href.indexOf("MDMyMjMzODkwMDI=") > -1
    ) {
      fbq("init", "529666413258940");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "529666413258940");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("r3fac87x.cc") > -1 &&
      window.location.href.indexOf("MDMzMjEzMjE3MDI=") > -1
    ) {
      console.log("03321321702");
      fbq("init", "1610862879497207");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1610862879497207");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("r3fac87x.cc") > -1 &&
      window.location.href.indexOf("MDMzMjEzMjE3MDg=") > -1
    ) {
      console.log("03321321708");
      fbq("init", "1339100850394695");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1339100850394695");
      user.isFbPixel = true;
    } else if (window.location.href.indexOf("r3fac87x.cc") > -1) {
      fbq("init", "1214838756433629");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1214838756433629");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("zhdjoqzf.cc") > -1 &&
      window.location.href.indexOf("MDMxNjY1NTgwMDE=") > -1
    ) {
      fbq("init", "916960890356555");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "916960890356555");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("zhdjoqzf.cc") > -1 &&
      window.location.href.indexOf("MDMxNjY1NTgwMDI=") > -1
    ) {
      fbq("init", "1077859747261456");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1077859747261456");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("zhdjoqzf.cc") > -1 &&
      window.location.href.indexOf("MDMxNjY1NTgwMDM=") > -1
    ) {
      fbq("init", "1213446689866597");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "1213446689866597");
      user.isFbPixel = true;
    } else if (
      window.location.href.indexOf("zhdjoqzf.cc") > -1 &&
      window.location.href.indexOf("MDMxNjY1NTgwMDQ=") > -1
    ) {
      fbq("init", "2367001790353504");
      fbq("track", "PageView");
      sessionStorage.setItem("FB_PIXEL_ID", "2367001790353504");
      user.isFbPixel = true;
    }

    // if (to.name === "referCode") {
    //   sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
    //   next(`/register`);
    // }
    if (to.name === "agentCode") {
      sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
      if (to.query.reg) {
        next(`/register`);
      } else {
        next(`/`);
      }
    }
    if (to.name === "referCode") {
      sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
      next(`/register`);
    }

    if (to.name === "RegisterPage") {
      next(`/register`);
    }

    if (user.hasToken()) {
      if (to.path === "/" || to.path === "/register" || to.path === "/login" || to.path === "//") {
        next({ path: "/home" });
      } else {
        if (user.nickName === "") {
          user.getMemberInfo().then(() => next({ ...to, replace: true }));
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
          message: "Please login to continue",
          icon: "report_problem"
        });
      } else {
        next();
      }
    }
  });

  return Router;
});
