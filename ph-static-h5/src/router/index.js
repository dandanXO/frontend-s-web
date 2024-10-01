import { route, store } from "quasar/wrappers";
import { userStore } from "stores/index";

import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { useUI } from "stores/ui";

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

    if (to.name === "agentCode") {
      sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
      next(`/register`);
    }
    if (to.name === "referCode") {
      sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
      next(`/register`);
    }

    if (user.hasToken()) {
      if (to.path === "/login") {
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

    let url = window.location.href;
    let agentCode = sessionStorage.getItem("AFFILIATE_CODE");

    // console.log(url);
    if (agentCode === "5D9325" || ui.isAffiliate5D9325) {
      console.log("5D9325");
      ui.isAffiliate5D9325 = true;

      fbq("init", "1561523747723504");
      fbq("track", "PageView");
    } else if (url.indexOf("p4w001.cc") > -1) {
      ui.isAffiliateA = true;

      //FOr TESTing.
      // fbq("init", "6757510457678415");

      fbq("init", "922819769626189");
      fbq("track", "PageView");
    } else if (url.indexOf("p4w002.cc") > -1) {
      ui.isAffiliateA = true;

      //FOr TESTing.
      // fbq("init", "6757510457678415");

      fbq("init", "783354910560801");
      fbq("track", "PageView");
    } else if (url.indexOf("p4w003.cc") > -1 || url.indexOf("manalo.cc") > -1) {
      ui.isAffiliateA = true;

      //FOr TESTing.
      // fbq("init", "6757510457678415");

      fbq("init", "3578831592358097");
      fbq("track", "PageView");
    } else if (url.indexOf("p4w006.cc") > -1) {
      ui.isAffiliateA = true;

      //FOr TESTing.
      // fbq("init", "6757510457678415");

      fbq("init", "1178103886933030");
      fbq("track", "PageView");
    } else if (url.indexOf("p4w007.cc") > -1) {
      ui.isAffiliateA = true;

      //FOr TESTing.
      // fbq("init", "6757510457678415");

      fbq("init", "790535672625706");
      fbq("track", "PageView");
    } else if (url.indexOf("p4w008.cc") > -1) {
      ui.isAffiliateA = true;

      //FOr TESTing.
      // fbq("init", "6757510457678415");

      fbq("init", "285327604612419");
      fbq("track", "PageView");
    }
  });

  return Router;
});
