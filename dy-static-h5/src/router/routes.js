import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/HomePage.vue") }]
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
    children: [{ path: "", name: "RegisterPage", component: () => {} }]
  },
  {
    path: "/forgot-account",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/ForgotPwdPage.vue") }]
  },
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    redirect: "/"
  },
  {
    path: "/promo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }]
  },
  {
    path: "/privilege/invite",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PrivilegeInvite.vue") }]
  },
  {
    path: "/privilege/hongbaoyu",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/HongBaoYu2024Page.vue") }]
  },
  {
    path: "/promotion",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }],
    meta: { requiresAuth: true, isApp: true }
  },
  {
    path: "/liveChat",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/cs-client-web/pages/LoginPage.vue") },
      { path: "chat", component: () => import("src/cs-client-web/pages/ChatPage.vue") }
    ]
  },
  {
    path: "/maintenance",
    component: () => import("pages/MaintenancePage.vue")
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
    path: "/account/vip",
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
    path: "/vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "vipapp",
        component: () => import("pages/games/VIPView.vue")
      }
    ],
    meta: { requiresAuth: true, isApp: true }
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
    component: () => {}
    // component: () => {},
  },
  {
    path: "/loading",
    component: () => import("pages/LoadingPage.vue")
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
    children: [
      {
        path: "",
        component: () => import("pages/account/RecordsView.vue")
      }
    ],
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: "/invitefriend",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/InviteView.vue")
      }
    ],
    meta: { requiresAuth: true, isApp: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true, keepAlive: false }
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
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: "/account/records/moneyChange",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/MoneyChangeRecordView.vue")
      }
    ],
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: "/account/records/promo",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/PromoRecordView.vue")
      }
    ],
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: "/account/records/financeFeedBack",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/FeedbackRecordView.vue")
      }
    ],
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: "/account/records/bet",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/records/BetHistoryRecordView.vue")
      }
    ],
    meta: { requiresAuth: true, keepAlive: false }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: "/account/verifyTelephone",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/VerifyTelephone.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/verifyEmail",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/VerifyEmail.vue")
      }
    ],
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: "/account/inbox",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/mail/InboxView.vue")
      }
    ],
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: "/deposit",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/finance/DepositView.vue")
      }
    ],
    meta: { requiresAuth: false, isApp: true }
  },
  {
    path: "/display",
    children: [
      {
        path: "",
        component: () => import("pages/finance/DisplayView.vue")
      }
    ],
    meta: { requiresAuth: false }
  },
  {
    path: "/depositLoading",
    children: [
      {
        path: "",
        component: () => import("components/depositLoading.vue")
      }
    ],
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: "/center/:path",
    redirect: (to) => {
      const path = to.params.path;
      const mappedRouting = webRoutingMap[path];
      if (mappedRouting) return `/${mappedRouting.parent}/${mappedRouting.path}`;
      return "/";
    }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
    component: () => import("pages/ErrorNotFound.vue")
  }
];

const webRoutingMap = {
  deposit: { parent: "finance", path: "deposit" },
  withdraw: { parent: "finance", path: "withdraw" },
  transfer: { parent: "account", path: "transfer" },
  personal: { parent: "account", path: "personal" },
  "transit-record": { parent: "account", path: "records" },
  mailbox: { parent: "account", path: "inbox" },
  share: { parent: "account", path: "invite" },
  withdrawbank: { parent: "account", path: "withdraw" }
};
export default routes;
