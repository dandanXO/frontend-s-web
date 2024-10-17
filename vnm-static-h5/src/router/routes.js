import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", name: "home", component: () => import("pages/HomePage.vue") },
      { path: "/homeslot", name: "homeslot", component: () => import("pages/HomePage.vue") }
    ]
  },
  {
    path: "/welcome",
    children: [{ path: "", component: () => import("pages/WelcomePage.vue") }]
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
    path: "/promotion",
    redirect: "/promo"
  },
  {
    path: "/promoapp",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }],
    meta: { requiresAuth: true, isApp: true }
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
    path: "/aviator",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "aviator", component: () => import("pages/games/AviatorView.vue") }]
  },
  {
    path: "/poker",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "poker", component: () => import("pages/games/PokerView.vue") }]
  },
  {
    path: "/slot",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "slot", component: () => import("pages/games/SlotView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/fishing",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "fishing", component: () => import("pages/games/AviatorView.vue") }]
  },
  {
    path: "/minigame",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "minigame", component: () => import("pages/games/MinigameView.vue") }]
  },
  {
    path: "/live-casino",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "live-casino", component: () => import("pages/games/LiveCasinoView.vue") }]
  },
  {
    path: "/sport",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "sport", component: () => import("pages/games/sportFrameView.vue") }],
    meta: { requiresAuth: true }
  },
  // {
  //   path: "/sports",
  //   // component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "sport",
  //       component: () => import("components/sportsOuter.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  {
    path: "/e-sport",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "e-sport", component: () => import("pages/games/E-SportView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "vip", component: () => import("pages/games/VIPView.vue") }]
  },
  {
    path: "/affiliate",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "affiliate", component: () => import("pages/AffiliateView.vue") }]
  },
  {
    path: "/:homeName?/agent/:affiliateCode",
    name: "agentCode",
    component: () => {}
    // component: () => {},
  },
  {
    path: "/refer/:referralCode",
    name: "referCode",
    component: () => {}
    // component: () => {},
  },
  {
    path: "/account",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/AccountPage.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/RecordsView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/assets",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/AssetsView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/changePwd",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/ChangePwdView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/download",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/DownloadView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/invite",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/InviteView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/invitefriend",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/InviteView.vue") }],
    meta: { requiresAuth: true, isApp: true }
  },
  {
    path: "/account/announcement",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/AnnouncementView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records/deposit",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/records/DepositRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records/withdraw",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/records/WithdrawRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records/transfer",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/records/TransferRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records/moneyChange",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/records/MoneyChangeRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records/promo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/records/PromoRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records/rebate",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/records/RebatesRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records/financeFeedBack",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/records/FeedbackRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/records/bet",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/records/BetHistoryRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/transit",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/TransitRecordView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/personal",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/PersonalView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/verifyTelephone",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/VerifyTelephone.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/verifyEmail",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/VerifyEmail.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/WithdrawBankView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/bank-card",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/BindBankCardView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/crypto",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/BindCryptoView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/ewallet",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/BindEWalletView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/alipay",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/BindAlipayView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/transfer",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/finance/TransferView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/letters",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/StationLettersView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/inbox",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/mail/InboxView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "accountvip", component: () => import("pages/games/VIPView.vue") }]
  },
  {
    path: "/account/outbox",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/mail/OutboxView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/write",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/mail/WriteView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/feedback",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/FeedbackView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/finance/deposit",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/finance/DepositView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/display",
    children: [{ path: "", component: () => import("pages/finance/DisplayView.vue") }],
    meta: { requiresAuth: false }
  },
  {
    path: "/depositLoading",
    children: [{ path: "", component: () => import("components/depositLoading.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/finance/withdraw",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/finance/WithdrawView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/deposit",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/finance/DepositView.vue") }],
    meta: { requiresAuth: false, isApp: true }
  },
  {
    path: "/invitefriend",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/InviteView.vue") }],
    meta: { requiresAuth: true, isApp: true }
  },
  {
    path: "/vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "vipapp", component: () => import("pages/games/VIPView.vue") }],
    meta: { requiresAuth: true, isApp: true }
  },
  {
    path: "/about",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", name: "about", component: () => import("pages/AboutView.vue") }]
  },
  {
    path: "/home",
    redirect: "/"
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
    component: () => import("pages/ErrorNotFound.vue")
  }
];
export default routes;
