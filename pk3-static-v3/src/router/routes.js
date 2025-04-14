import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home"
    // children: [{ path: "", component: () => import("pages/LandingPage.vue") }],
  },
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/HomePage.vue") }]
  },
  {
    path: "/login",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }]
  },

  {
    path: "/register",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/RegisterPage.vue") }]
  },
  {
    path: "/forgot-password",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/ForgotPwdPage.vue") }]
  },
  {
    path: "/promo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }]
  },
  {
    path: "/activities-details",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/ActivitiesDetailsPage.vue") }]
  },
  {
    path: "/earn-money",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/EarnMoneyPage.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/wv-earn-money",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/EarnMoneyPage.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/language",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/LanguagePage.vue") }],
    meta: { requiresAuth: false }
  },
  {
    path: "/liveChat",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/LiveChatPage.vue") }]
  },
  {
    path: "/maintenance",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "maintenance", component: () => import("pages/MaintenancePage.vue") }]
  },
  {
    path: "/vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "vip", component: () => import("pages/games/VIPView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/wv-vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "vip", component: () => import("pages/games/VIPView.vue") }],
    meta: { requiresAuth: true }
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
    path: "/account",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/SettingsPage.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/profile",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/AccountPage.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/bank",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/BankView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/message",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/MessageView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/message-detail",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/MessageDetailView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/order",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/OrderView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/discount",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/DiscountView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/record",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/RecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/promotion",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/PromotionView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/deposit",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/TransactionLandingView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/promotion",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }],
    meta: { requiresAuth: true, isApp: true }
  },
  {
    path: "/wv-promotion",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/withdraw",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/TransactionLandingView.vue") }],
    meta: { requiresAuth: true }
  },
  // {
  //   path: "/account/transit",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [{ path: "", component: () => import("pages/account/TransitRecordView.vue") }],
  //   meta: { requiresAuth: true }
  // },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    redirect: "/home",
    component: () => import("pages/ErrorNotFound.vue")
  }
];
export default routes;
