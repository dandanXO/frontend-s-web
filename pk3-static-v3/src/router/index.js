import { route, store } from "quasar/wrappers";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";

import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { StatusBar } from "@capacitor/status-bar";
import { Platform, SessionStorage } from "quasar";
import { isAndroid } from "boot/utils";
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

    if (user.token && from && from.href) {
      user.getBalance();
    }

    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/forgot-password" ||
      to.path === "/withdraw" ||
      to.path === "/deposit" ||
      to.path === "/promotion" ||
      to.path === "/wv-promotion" ||
      to.path === "/wv-vip" ||
      to.path === "/wv-earn-money"
    ) {
      ui.hiddenFooter();
    } else {
      ui.showFooter();
    }

    if (Platform.is.capacitor && Platform.is.android) {
      StatusBar.hide();
    }

    if (from.path === "/promotion") {
      // console.log(to);
      window.location.href = "xfapp:" + to.fullPath;
    }

    if (to.path === "/promotion" || to.path === "/wv-promotion" || to.path === "/wv-earn-money" || to.path === "/wv-vip") {
      // debugger;
      if (isAndroid()) {
        localStorage.setItem("TOKEN", to.query.token);
      } else {
        SessionStorage.set("TOKEN", to.query.token);
      }
      user.token = to.query.token;
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
      } else {
        next();
      }
    }
  });

  return Router;
});
