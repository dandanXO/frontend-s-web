import { createRouter, createWebHistory } from "vue-router";
import LayoutView from "@/views/layouts/MainLayout.vue";
import HomeView from "../views/HomeView.vue";
import PersonalLayoutView from "@/views/layouts/PersonalLayoutView.vue";
import PersonalRouter from "./personal";
import { userStore } from "@/store/index";
import { ElMessageBox } from "element-plus";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "Login" */ "../views/LoginView.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import(/* webpackChunkName: "Register" */ "../views/RegisterView.vue")
  },
  {
    path: "/forgotPwd",
    name: "forgotPwd",
    component: () => import(/* webpackChunkName: "ForgotPwd" */ "../views/ForgotPwdView.vue")
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
        path: "/welcome",
        name: "welcome",
        component: () => import(/* webpackChunkName: "Welcome" */ "../views/WelcomeView.vue")
      },
      {
        path: "/slot",
        name: "slot",
        component: () => import(/* webpackChunkName: "Game" */ "../views/SlotView.vue")
      },
      {
        path: "/about",
        name: "about",
        component: () => import(/* webpackChunkName: "About" */ "../views/AboutView.vue")
      },
      {
        path: "/esports",
        name: "esports",
        component: () => import(/* webpackChunkName: "Game" */ "../views/eSportsView.vue")
      },
      {
        path: "/sports",
        name: "sports",
        component: () => import(/* webpackChunkName: "Game" */ "../views/SportsView.vue")
      },
      {
        path: "/live-casino",
        name: "live",
        component: () => import(/* webpackChunkName: "Game" */ "../views/LiveCasinoView.vue")
      },
      {
        path: "/lottery",
        name: "lottery",
        component: () => import(/* webpackChunkName: "Game" */ "../views/LotteryView.vue")
      },
      {
        path: "/poker",
        name: "poker",
        component: () => import(/* webpackChunkName: "Game" */ "../views/PokerView.vue")
      },
      {
        path: "/fishing",
        name: "fishing",
        component: () => import(/* webpackChunkName: "Game" */ "../views/FishingView.vue")
      },
      {
        path: "/others",
        name: "others",
        component: () => import(/* webpackChunkName: "Game" */ "../views/FishingView.vue")
      },
      {
        path: "/cockfight",
        name: "cockfight",
        component: () => import(/* webpackChunkName: "Game" */ "../views/CockfightView.vue")
      },
      {
        path: "/minigame",
        name: "minigame",
        component: () => import(/* webpackChunkName: "Game" */ "../views/MinigameView.vue")
      },
      {
        path: "/agent",
        name: "agent",
        component: () => import(/* webpackChunkName: "Game" */ "../views/AgentView.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import(/* webpackChunkName: "Game" */ "../views/PromotionView.vue")
      },
      {
        path: "/app",
        name: "app",
        component: () => import(/* webpackChunkName: "Game" */ "../views/AppView.vue")
      },
      {
        path: "/vip",
        name: "vip",
        component: () => import(/* webpackChunkName: "Game" */ "../views/VIPView.vue")
      },
      {
        path: "/maintenance",
        name: "maintenance",
        component: () => import(/* webpackChunkName: "Maintenance" */ "../views/MaintenanceView.vue")
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
        path: "/depositLoading",
        name: "loading",
        component: () => import(/* webpackChunkName: "depositLoading" */ "../components/depositLoading.vue")
      },
      {
        path: "/agent/:affiliateCode",
        name: "agentCode",
        component: () => {}
      },
      {
        path: "/affiliate",
        name: "affiliate",
        component: () => import(/* webpackChunkName: "affiliate" */ "../views/AgentView.vue")
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
    component: () => {}
  }
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // console.log(to);
    // console.log(savedPosition);
    if (savedPosition && savedPosition.top) {
      return { left: 0, top: savedPosition.top };
    } else if (to.path !== "/slot") {
      return { left: 0, top: 0 };
    }
  },
  routes
});

router.beforeEach((to, from, next) => {
  const store = userStore();
  if (to.name === "agentCode") {
    sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
    next(`/register`);
  }
  if (to.name === "referCode") {
    sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
    next(`/register?refer=1`);
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
    // if (to.query.name) {
    //   store.loginPageVisible = true;
    //   next({ query: { redirect: to.path } });
    // }
    if (to.meta.requiresAuth) {
      // ElMessageBox.alert("账号已在其他设备登录，请登录后再操作", $t('common.systemError'), {
      //   // if you want to disable its autofocus
      //   // autofocus: false,
      //   center: true,
      //   confirmButtonText: 'Confirm',
      //   showClose: false,
      //   buttonSize: "large"
      // }).then(() => {
      //   store.loginPageVisible = true;
      // });

      store.loginPageVisible = true;
      next({ query: { redirect: to.path } });
    } else {
      next();
    }
  }

  // FB tracking
  // console.log(window.location.href)
  // if (window.location.href.indexOf("tf88king.com") > -1) {
  //   fbq("init", "888951505918547");
  //   fbq("track", "PageView");
  //   store.isAffiliateA= true;
  // }
});
export default router;
