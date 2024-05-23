import { route, store } from "quasar/wrappers";
import { userStore } from "stores/index";
import { Platform, Loading } from "quasar";

import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { useUI } from "stores/ui";
import { api } from "src/boot/axios";

var qs = require("qs");
const siteId = process.env.SITEID;
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

    if (to.name === "loginToken") {
      ui.isAffiliateB = true;
      localStorage.setItem("AGENT_B", "1");
      var logintoken = atob(to.params.loginToken);
      if (logintoken) {
        sessionStorage.setItem("TOKEN", logintoken);
        next(`/`);
      } else {
        next(`/?page=register`);
      }
    }

    if (to.name === "agentCode") {
      sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
      next(`/?page=register`);
    }
    
    if (to.name === "referCode") {
      sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
      next(`/?page=register`);
    }

    // console.log(location.href);

    if (user.hasToken()) {
      if (to.path === "/login") {
        next({ path: "/" });
      } else {
        // if (user.token) {
        //   user.getMemberInfo().then(() => next({ ...to, replace: true }));
        // }
        if (to.path === "/sport" || to.path === "/insert-bankinfo") {
          ui.hiddenFooter();
        } else {
          ui.showFooter();
        }
        if (to.path === "/finance/deposit") {
          next();
          // if (user.nickName === "" || !user.nickName) {
          //   user.getMemberInfo().then(() => next({ ...to, replace: true }));
          // }
          // api.defaults.headers["token"] = user.token;
          // api.get("/session/bankCard").then((res) => {
          //   const response = res.data
          //   if (response.code === 0) {
          //     if (response.data.length === 0) {
          //       next(`/account/withdraw`);
          //     } else {
          //       next();
          //     }
          //   }
          // })
        } else {
          next();
        }
      }

      // if (user.nickName === "" || !user.nickName) {
      //   user.getMemberInfo().then(() => next({ ...to, replace: true }));
      // } else {
      //   next();
      // }
    } else {
      if (to.meta.requiresAuth) {
        next(`/login?redirect=${to.path}`);
      } else {
        next();
      }
    }

    //Add Google Analytics && FB Event Manager If Affiliate Code Matched.
    const affiliateCode = sessionStorage.getItem("AFFILIATE_CODE");
  });

  return Router;
});
