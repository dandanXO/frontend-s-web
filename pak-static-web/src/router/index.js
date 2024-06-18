import { createRouter, createWebHistory } from "vue-router";
import LayoutView from "@/views/layout/LayoutView.vue";
import HomeView from "@/views/HomeView.vue";
import PersonalLayoutView from "@/views/layout/PersonalLayoutView.vue";
import PersonalRouter from "./personal";
import { userStore } from "@/store/index";
// import { launchSessionGame } from "@/api/platform/platform";
// import { isMobile } from "@/utils/utils";
const routes = [
  {
    path: "/welcome",
    name: "welcome",
    component: () => import(/* webpackChunkName: "welcome" */ "../views/WelcomeView.vue")
  },
  {
    path: "/maintenance",
    name: "maintenance",
    component: () => import(/* webpackChunkName: "Maintenance" */ "../views/MaintenanceView.vue")
  },
  {
    path: "/",
    name: "home",
    component: LayoutView,
    redirect: "home",
    children: [
      {
        path: "home",
        name: "home",
        component: HomeView
      },
      {
        path: "login",
        name: "login",
        component: () => import(/* webpackChunkName: "login" */ "../views/LoginView.vue")
      },
      {
        path: "register",
        name: "register",
        component: () => import(/* webpackChunkName: "register" */ "../views/RegisterView.vue")
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: () => import(/* webpackChunkName: "forgot-password" */ "../views/ForgotPwdView.vue")
      },
      {
        path: "about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ "../views/about/AboutView.vue")
      },
      {
        path: "promotion",
        name: "promotion",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "promotion" */ "../views/PromoView.vue")
      },
      // {
      //   path: "promotion-details/:promotion",
      //   name: "promotion details",
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () =>
      //   import(/* webpackChunkName: "promotion" */ "../views/PromoDetailsView.vue"),
      //   props: true,
      // },
      {
        path: "aviator",
        name: "aviator",
        component: () => import(/* webpackChunkName: "aviator" */ "../views/games/AviatorView.vue")
      },
      {
        path: "poker",
        name: "poker",
        component: () => import(/* webpackChunkName: "poker" */ "../views/games/PokerView.vue")
      },
      {
        path: "slot",
        name: "slot",
        component: () => import(/* webpackChunkName: "casino" */ "../views/games/SlotView.vue")
      },
      {
        path: "bingo",
        name: "bingo",
        component: () => import(/* webpackChunkName: "casino" */ "../views/games/BingoView.vue")
      },
      {
        path: "minigame",
        name: "minigame",
        component: () => import(/* webpackChunkName: "casino" */ "../views/games/MinigameView.vue")
      },
      {
        path: "live-casino",
        name: "live-casino",
        component: () => import(/* webpackChunkName: "live-casino" */ "../views/games/LiveCasinoView.vue")
      },
      {
        path: "hot",
        name: "hot",
        component: () => import(/* webpackChunkName: "sport" */ "../views/games/HotGameView.vue")
      },
      {
        path: "sport",
        name: "sport",
        component: () => import(/* webpackChunkName: "sport" */ "../views/games/SportView.vue")
      },
      {
        path: "cockfight",
        name: "cockfight",
        component: () => import(/* webpackChunkName: "sport" */ "../views/games/CockView.vue")
      },
      {
        path: "e-sport",
        name: "e-sport",
        component: () => import(/* webpackChunkName: "esport" */ "../views/games/E-SportView.vue")
      },
      // {
      //   path: "vip",
      //   name: "vip",
      //   component: () => import(/* webpackChunkName: "poker" */ "../views/games/VIPView.vue")
      // },
      // {
      //   path: "affiliate",
      //   name: "affiliate",
      //   component: () => import(/* webpackChunkName: "poker" */ "../views/AffiliateView.vue")
      // },
      {
        path: "getapp",
        name: "getapp",
        component: () => import(/* webpackChunkName: "poker" */ "../views/GetApp.vue")
      },
      {
        path: "jackpot",
        name: "jackpot",
        component: () => import(/* webpackChunkName: "poker" */ "../views/JackpotView.vue")
      },
      {
        path: "/agent/:affiliateCode",
        name: "agentCode",
        component: () => {}
      },
      {
        path: "/refer/:referralCode",
        name: "referCode",
        component: () => {}
      },
      {
        path: "/center",
        name: "center",
        component: PersonalLayoutView,
        children: PersonalRouter,
        meta: { requiresAuth: true }
      },
      {
        path: "agent-reg-guide",
        name: "agentRegGuide",
        component: () => import(/* webpackChunkName: "agentRegGuide" */ "../views/AgentRegGuide.vue")
      },
      {
        path: "app-tutorial",
        name: "appTutorial",
        component: () => import(/* webpackChunkName: "agentRegGuide" */ "../views/AppTutorial.vue")
      },
      {
        path: "share",
        name: "share",
        component: () => import(/* webpackChunkName: "share" */ "../views/account/ShareView.vue"),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: "/depositLoading",
    name: "loading",
    component: () => import(/* webpackChunkName: "poker" */ "../components/depositLoading.vue")
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
    component: () => {}
  }
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(process.env.BASE_URL),
  routes
});
router.beforeEach((to, _, next) => {
  const store = userStore();

  if (to.path === "/index.html") {
    next({ path: "/" });
  }
  if (to.name === "agentCode") {
    sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
    next(`/register`);
  }
  if (to.name === "referCode") {
    sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
    next(`/register`);
  }
  if (store.token) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (store.nickName === "") {
        store.getMemberInfo().then(() => next({ ...to, replace: true }));
      } else {
        next();
      }
    }
  } else {
    if (to.meta.requiresAuth) {
      store.openAccountModal();
      next({ path: "/" });
    } else {
      next();
    }
  }

  let url = window.location.href;
  // console.log(url);
  // || url.indexOf("http://localhost:8089") > -1
  if (url.indexOf("p4w001.cc") > -1) {
    store.isAffiliateA = true;

    console.log("isAffiliateA");
    //FOr TESTing.
    // fbq("init", "6757510457678415");

    fbq("init", "922819769626189");
    fbq("track", "PageView");
  } else if (url.indexOf("p4w002.cc") > -1) {
    store.isAffiliate2 = true;

    console.log("isAffiliate2");

    fbq("init", "783354910560801");
    fbq("track", "PageView");
  } else if (url.indexOf("p4w003.cc") > -1 || url.indexOf("manalo.cc") > -1) {
    store.isAffiliate3 = true;

    console.log("isAffiliate3");

    fbq("init", "3578831592358097");
    fbq("track", "PageView");
  } else if (url.indexOf("p4w006.cc") > -1) {
    store.isAffiliate3 = true;

    fbq("init", "1178103886933030");
    fbq("track", "PageView");
  } else if (url.indexOf("p4w007.cc") > -1) {
    store.isAffiliate3 = true;

    fbq("init", "790535672625706");
    fbq("track", "PageView");
  } else if (url.indexOf("p4w008.cc") > -1) {
    store.isAffiliate3 = true;

    fbq("init", "1510696606147029");
    fbq("track", "PageView");
  }
});

export default router;
