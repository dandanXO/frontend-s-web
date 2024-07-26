import { route, store } from "quasar/wrappers";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { isAndroid } from "boot/utils";
import { SessionStorage } from "quasar";

import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";
import routes from "./routes";

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
    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/deposit" ||
      to.path === "/invitefriend" ||
      to.path === "/vip" ||
      to.path === "/privilege/invite" ||
      to.path === "/maintenance" ||
      to.path === "/promoapp"
    ) {
      ui.hiddenFooter();
    } else {
      ui.showFooter();
    }

    if (to.path === "/promoapp") {
      if (isAndroid()) {
        localStorage.setItem("TOKEN", to.query.token);
      } else {
        SessionStorage.set("TOKEN", to.query.token);
      }

      user.token = to.query.token;
    }

    // if (to.name === "referCode") {
    //   sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
    //   next(`/login?register`);
    // }

    if (
      to.path === "/deposit" ||
      to.path === "/invitefriend" ||
      to.path === "/vip" ||
      to.path === "/privilege/invite"
    ) {
      if (isAndroid()) {
        localStorage.setItem("TOKEN", to.query.token);
      } else {
        SessionStorage.set("TOKEN", to.query.token);
      }

      user.token = to.query.token;
      // console.log("user", user.token);
    }

    if (to.name === "agentCode") {
      sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
      // if (to.query.reg) {
      //   next(`/register`);
      // } else {
      //   next(`/`);
      // }
      next(`/register`);
    }
    if (to.name === "referCode") {
      sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
      next(`/register`);
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

    // FB tracking
    console.log(window.location.href);
    // if (window.location.href.indexOf("tf88king.com") > -1) {
    //   fbq("init", "888951505918547");
    //   fbq("track", "PageView");
    //   user.isAffiliateA= true;
    // }
  });

  return Router;
});
