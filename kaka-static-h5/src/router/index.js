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
      next(`/`);
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
    console.log("Href");
    console.log(window.location.href);
    if (window.location.href.indexOf("kakaag.app") > -1) {
      fbq("init", "1163176251398453");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakaag.vip") > -1) {
      fbq("init", "836424235042431");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakaag.shop") > -1) {
      fbq("init", "1567716440818798");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakavn.app") > -1) {
      fbq("init", "463504196607854");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakagame38.app") > -1) {
      fbq("init", "342669618894591");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakagame88.vip") > -1) {
      fbq("init", "976575897104655");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakavn.vip") > -1) {
      fbq("init", "795707932732808");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakavn.shop") > -1) {
      fbq("init", "3742002766037130");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakagame6.app") > -1) {
      fbq("init", "1065055615337117");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakagame6.vip") > -1) {
      fbq("init", "3596435077285259");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakagame38.com") > -1) {
      fbq("init", "1229331245097015");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakagame38.vip") > -1) {
      fbq("init", "1163064048304297");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakagame88.app") > -1) {
      fbq("init", "1227157148415264");
      fbq("track", "PageView");
    } else if (window.location.href.indexOf("kakaad.vip") > -1) {
      fbq("init", "1150936866165559");
      fbq("track", "PageView");
    }
    // console.log(window.location.href);
    // if (window.location.href.indexOf("KAKAking.com") > -1) {
    //   fbq("init", "888951505918547");
    //   fbq("track", "PageView");
    //   user.isAffiliateA= true;
    // } else if (window.location.href.indexOf("tfgame88.com") > -1) {
    //   fbq("init", "3658633674357920");
    //   fbq("track", "PageView");
    //   user.isAffiliateA= true;
    // } else if (window.location.href.indexOf("5svn88.com") > -1 || window.location.href.indexOf("tfpromo88.com") > -1 || window.location.href.indexOf("KAKAbof.com") > -1) {
    //   otag("init", "adv10336256983680");
    // } else if (window.location.href.indexOf("tf68688.com") > -1) {
    //   fbq("init", "1123673335564806");
    //   fbq("track", "PageView");
    //   user.isAffiliateA= true;
    // }else if (window.location.href.indexOf("wintf99.com") > -1) {
    //   fbq("init", "441415921872746");
    //   fbq("track", "PageView");
    //   user.isAffiliateA= true;
    // }else if (window.location.href.indexOf("q7yxpdxwxk.com") > -1) {
    //   fbq("init", "1862869640792398");
    //   fbq("track", "PageView");
    //   user.isAffiliateA= true;
    // }
  });

  return Router;
});
