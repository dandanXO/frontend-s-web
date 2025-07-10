import { createRouter, createWebHistory } from "vue-router";
import LayoutView from "@/views/layouts/MainLayout.vue";
import HomeView from "../views/home/index.vue";
import PersonalLayoutView from "@/views/layouts/personallayout/index.vue";
import PersonalRouter from "./personal";
import { userStore } from "@/store/index";
import { ElMessageBox } from "element-plus";
import { useDark } from "@vueuse/core";

const routes = [
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
    name: "homeRoot",
    component: LayoutView,
    redirect: "home",
    children: [
      {
        path: "home",
        name: "home",
        component: HomeView
      },
      {
        path: "/crown",
        name: "crown",
        component: () => import(/* webpackChunkName: "Game" */ "../views/SportsView.vue")
      },
      {
        path: "/panda",
        name: "panda",
        component: () => import(/* webpackChunkName: "Game" */ "../views/SportsView.vue"),
        props: { showPlayBtn: true }
      },
      {
        path: "/live-casino",
        name: "live",
        component: () => import(/* webpackChunkName: "Game" */ "../views/LiveCasinoView.vue"),
        props: { showPlayBtn: true }
      },
      {
        path: "/lottery/SGWin",
        name: "SGWin",
        component: () => import(/* webpackChunkName: "Game" */ "../views/lottery/SgwinView.vue")
      },
      {
        path: "/poker",
        name: "poker",
        component: () => import(/* webpackChunkName: "Game" */ "../views/PokerView.vue")
      },
      {
        path: "/bacarrat",
        name: "bacarrat",
        component: () => import(/* webpackChunkName: "Game" */ "../views/BacarratView.vue")
      },
      {
        path: "/fishing",
        name: "fishing",
        component: () => import(/* webpackChunkName: "Game" */ "../views/FishingView.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import(/* webpackChunkName: "Game" */ "../views/promotion/index.vue")
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
        path: "/summon/:summonCode",
        name: "summonCode",
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
        path: "/app-tutorial",
        name: "appTutorial",
        component: () => import(/* webpackChunkName: "appTutorial" */ "../views/AppTutorial.vue")
      },
      {
        path: "/mailnew",
        name: "mail",
        component: () => import(/* webpackChunkName: "appTutorial" */ "../views/Mail.vue")
      },
      {
        path: "/finance/:path",
        redirect: (to) => `/center/${to.params.path}`
      },
      {
        path: "/account/:path",
        redirect: (to) => {
          const path = to.params.path;
          if (path === "vip") return "/vip";
          if (h5RoutingMap[path]) return `/center/${h5RoutingMap[path]}`;
          return "/";
        }
      },
      {
        path: "/promo",
        redirect: "/promotion"
      },
    ]
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
    component: () => {}
  }
];

const h5RoutingMap = {
  transfer: "transfer",
  personal: "personal",
  records: "transit-record",
  inbox: "mailbox",
  letters: "feedback",
  invite: "share"
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // console.log(to);
    // console.log(savedPosition);
    if (savedPosition && savedPosition.top) {
      return { left: 0, top: savedPosition.top };
    } else if (to.path !== "/slot" && to.path !== '/home') {
      return { left: 0, top: 0 };
    }
  },
  routes
});

router.beforeEach((to, from, next) => {
  const store = userStore();
  const isDark = useDark();

  if (to.name === "agentCode") {
    sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
    sessionStorage.removeItem("REFERRAL_CODE");
    sessionStorage.removeItem("SUMMON_CODE");

    next(`/register`);
  }
  if (to.name === "referCode") {
    sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
    sessionStorage.removeItem("AFFILIATE_CODE");

    next(`/register?refer=1`);
  }
  if (to.name === "summonCode") {
    sessionStorage.setItem("SUMMON_CODE", to.params.summonCode);
    sessionStorage.removeItem("AFFILIATE_CODE");

    next(`/login?summon=1`);
  }

  if (store.token) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (store.nickName === "") {
        store.getMemberInfo().then(() => {
          next({ ...to, replace: true });
        });
      } else {
        next();
      }
    }
  } else {
    // TODO: Remove after testing is completed.
    // isDark.value = false;

    if (to.meta.requiresAuth) {
      // 账号已在其他设备登录，
      ElMessageBox.alert("请登录后再操作", "系统提示", {
        // if you want to disable its autofocus
        // autofocus: false,
        center: true,
        confirmButtonText: "确认",
        showClose: false,
        buttonSize: "large"
      }).then(() => {
        store.loginPageVisible = true;
      });
      next({ query: { redirect: to.path } });
    } else {
      next();
    }
  }
});
export default router;
