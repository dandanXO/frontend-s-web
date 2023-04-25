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
    component: () =>
      import(/* webpackChunkName: "welcome" */ "../views/WelcomeView.vue"),
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
        component: HomeView,
      },
      {
        path: "login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () =>
          import(
            /* webpackChunkName: "register" */ "../views/RegisterView.vue"
          ),
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: () =>
          import(
            /* webpackChunkName: "forgot-password" */ "../views/ForgotPwdView.vue"
          ),
      },
      {
        path: "about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/about/AboutView.vue"
          ),
      },
      {
        path: "promotion",
        name: "promotion",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "promotion" */ "../views/PromoView.vue"),
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
        component: () =>
          import(
            /* webpackChunkName: "aviator" */ "../views/games/AviatorView.vue"
          ),
      },
      // {
      //   path: "poker",
      //   name: "poker",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "poker" */ "../views/games/PokerView.vue"
      //     ),
      // },
      {
        path: "slot",
        name: "slot",
        component: () =>
          import(
            /* webpackChunkName: "casino" */ "../views/games/SlotView.vue"
          ),
      },
      {
        path: "live-casino",
        name: "live-casino",
        component: () =>
          import(
            /* webpackChunkName: "live-casino" */ "../views/games/LiveCasinoView.vue"
          ),
      },
      // {
      //   path: "sport",
      //   name: "sport",
      //   component: () =>
      //     import(/* webpackChunkName: "sport" */ "../views/games/CMDView.vue"),
      // },
      {
        path: "sport",
        name: "sport",
        component: () =>
          import(/* webpackChunkName: "sport" */ "../views/games/CMDView.vue"),
      },
      {
        path: "e-sport",
        name: "e-sport",
        component: () =>
          import(
            /* webpackChunkName: "esport" */ "../views/games/E-SportView.vue"
          ),
      },
      {
        path: "vip",
        name: "vip",
        component: () =>
          import(/* webpackChunkName: "poker" */ "../views/games/VIPView.vue"),
      },
      {
        path: "affiliate",
        name: "affiliate",
        component: () =>
          import(/* webpackChunkName: "poker" */ "../views/AffiliateView.vue"),
      },
      {
        path: "getapp",
        name: "getapp",
        component: () =>
          import(/* webpackChunkName: "poker" */ "../views/GetApp.vue"),
      },
      {
        path: "/agent/:affiliateCode",
        name: "agentCode",
        component: () => {},
      },
      {
        path: "/refer/:referralCode",
        name: "referCode",
        component: () => {},
      },
      {
        path: "/center",
        name: "center",
        component: PersonalLayoutView,
        children: PersonalRouter,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/depositLoading",
    name: "loading",
    component: () =>
      import(
        /* webpackChunkName: "poker" */ "../components/depositLoading.vue"
      ),
  },
  // {
  //   path: "/sports",
  //   name: "loading",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "poker" */ "../components/CMDView.vue"
  //     ),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
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
      next(`/login?redirect=${to.path}`);
    } else {
      next();
    }
  }
});

export default router;
