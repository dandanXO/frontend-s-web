import { route } from "quasar/wrappers";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { isAndroid } from "boot/utils";
import { SessionStorage } from "quasar";
import { useQuasar } from "quasar";

import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";

function isInApp() {
  const hasToken = new URLSearchParams(window.location.search).get("token");
  if (
    (window.location.pathname === "/vip" && hasToken) ||
    window.location.pathname === "/viptest" ||
    (window.location.pathname === "/promotion" && hasToken) ||
    window.location.pathname === "/deposit" ||
    window.location.pathname === "/deposittest" ||
    window.location.pathname === "/invitefriend" ||
    window.location.pathname === "/privilege/invite" ||
    window.location.pathname === "/affiliatepage"
  ) {
    return true;
  }
  return false;
}

let fullroutes;
if (isInApp()) {
  console.log("In App");
  fullroutes = require("./routers-app").default;
} else {
  console.log("Normal");
  fullroutes = require("./routes").default;
}

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: [...fullroutes],

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE)
  });

  Router.beforeEach((to, from, next) => {
    const user = userStore();
    const ui = useUI();
    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/promotion" ||
      to.path === "/promotiontest" ||
      to.path === "/deposit" ||
      to.path === "/invitefriend" ||
      to.path === "/vip" ||
      to.path === "/viptest" ||
      to.path === "/deposittest" ||
      to.path === "/privilege/invite" ||
      to.path === "/maintenance" ||
      to.path === "/affiliatepage" ||
      to.path === "/live-chat" ||
      to.path === "/live-chat/chat"
    ) {
      ui.hiddenFooter();
      ui.currentRuntime = "IN_APP_BROWSER";
    } else {
      ui.showFooter();
      ui.currentRuntime = "H5";
    }

    // if (to.name === "referCode") {
    //   sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
    //   next(`/login?register`);
    // }

    if (
      to.path === "/promotion" ||
      to.path === "/promotiontest" ||
      to.path === "/deposit" ||
      to.path === "/deposittest" ||
      to.path === "/invitefriend" ||
      to.path === "/vip" ||
      to.path === "/viptest" ||
      to.path === "/privilege/invite" ||
      to.path === "/affiliatepage"
    ) {
      if (isAndroid()) {
        localStorage.setItem("TOKEN", to.query.token);
      } else {
        SessionStorage.set("TOKEN", to.query.token);
      }

      if (to.query.dark) {
        localStorage.setItem("DARK_MODE", true);
        const $q = useQuasar();
        $q.dark.set(true);
      }

      user.token = to.query.token;
      // console.log("user", user.token);
    }

    if (to.name === "agentCode") {
      sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
      sessionStorage.removeItem("REFERRAL_CODE");
      sessionStorage.removeItem("SUMMON_CODE");
      if (to.query.reg) {
        next(`/login?register`);
      } else {
        next(`/`);
      }
    }
    if (to.name === "referCode") {
      sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
      sessionStorage.removeItem("AFFILIATE_CODE");
      next(`/login?register`);
    }

    if (to.name === "summonCode") {
      sessionStorage.setItem("SUMMON_CODE", to.params.summonerCode);
      sessionStorage.removeItem("AFFILIATE_CODE");
      next(`/login`);
    }
    // if (to.name === "RegisterPage") {
    //   next(`/login?register`);
    // }

    if (user.hasToken()) {
      if (to.path === "/login" || to.path === "/register") {
        next({ path: "/" });
      } else {
        if (user.nickName === "") {
          user.getMemberInfo().then(() => next({ ...to, replace: true }));
        } else {
          next();
        }
      }
    } else {
      if (to.meta.requiresAuth) {
        next(`/login?redirect=${to.path}`);
      } else {
        next();
      }
    }
  });

  return Router;
});
