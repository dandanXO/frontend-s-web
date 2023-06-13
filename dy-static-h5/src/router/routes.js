import {createRouter, createWebHistory} from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{path: "", component: () => import("pages/HomePage.vue")}]
  },
  {
    path: "/welcome",
    children: [{path: "", component: () => import("pages/WelcomePage.vue")}]
  },
  {
    path: "/login",
    component: () => import("layouts/MainLayout.vue"),
    children: [{path: "", component: () => import("pages/LoginPage.vue")}]
  },
  {
    path: "/register",
    component: () => import("layouts/MainLayout.vue"),
    children: [{path: "", component: () => import("pages/RegisterPage.vue")}]
  },
  {
    path: "/forgot-password",
    component: () => import("layouts/MainLayout.vue"),
    children: [{path: "", component: () => import("pages/ForgotPwdPage.vue")}]
  },
  // {
  //   path: "/home",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [{ path: "", component: () => import("pages/HomePage.vue") }]
  // },
  {
    path: "/promo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{path: "", component: () => import("pages/PromoPage.vue")}]
  },
  {
    path: "/liveChat",
    component: () => import("layouts/MainLayout.vue"),
    children: [{path: "", component: () => import("pages/LiveChatPage.vue")}]
  },
  {
    path: "/aviator",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "aviator",
        component: () => import("pages/games/AviatorView.vue")
      }
    ]
  },
  {
    path: "/poker",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "poker",
        component: () => import("pages/games/PokerView.vue")
      }
    ]
  },
  {
    path: "/slot",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "slot",
        component: () => import("pages/games/SlotView.vue")
      }
    ]
  },
  {
    path: "/live-casino",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "live-casino",
        component: () => import("pages/games/LiveCasinoView.vue")
      }
    ]
  },
  {
    path: "/sport",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "sport",
        component: () => import("pages/games/sportFrameView.vue")
      }
    ],
    meta: {requiresAuth: false}
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
  //   meta: { requiresAuth: false }
  // },
  {
    path: "/e-sport",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "e-sport",
        component: () => import("pages/games/E-SportView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/share",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "share",
        component: () => import("pages/ShareView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "vip",
        component: () => import("pages/games/VIPView.vue")
      }
    ]
  },
  {
    path: "/affiliate",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "affiliate",
        component: () => import("pages/AffiliateView.vue")
      }
    ]
  },
  {
    path: "/agent/:affiliateCode",
    name: "agentCode",
    component: () => {
    }
    // component: () => {},
  },
  {
    path: "/refer/:referralCode",
    name: "referCode",
    component: () => {
    }
    // component: () => {},
  },
  {
    path: "/account",
    component: () => import("layouts/MainLayout.vue"),
    children: [{path: "", component: () => import("pages/AccountPage.vue")}],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/RecordsView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/promotion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/PromotionView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/changePwd",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/ChangePwdView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/download",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/DownloadView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/invite",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/InviteView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/announcement",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/AnnouncementView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records/deposit",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/DepositRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records/withdraw",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/WithdrawRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records/transfer",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/TransferRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records/change",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/ChangeRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records/betrecord",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/BetRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records/recommend",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/RecommendRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records/help",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/HelpRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/records/bill",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/BillRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/transit",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/TransitRecordView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/personal",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/PersonalView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/withdraw",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/WithdrawBankView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/transfer",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/finance/TransferView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/mail",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/StationLettersView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/mail/inbox",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/mail/InboxView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/mail/outbox",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/mail/OutboxView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/account/mail/write",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/mail/WriteView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/finance/deposit",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/finance/DepositView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/display",
    children: [
      {
        path: "",
        component: () => import("pages/finance/DisplayView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/depositLoading",
    children: [
      {
        path: "",
        component: () => import("components/depositLoading.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  {
    path: "/finance/withdraw",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/finance/WithdrawView.vue")
      }
    ],
    meta: {requiresAuth: false}
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue")
  }
];
export default routes;
