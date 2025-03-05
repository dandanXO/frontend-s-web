const routes = [
  {
    path: "/",
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
    path: "/hotmatch",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/HotMatchPage.vue") }]
  },
  {
    path: "/livestream",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/livestream/LiveStreamPage.vue") }]
  },
  {
    path: "/livestream/streamplayer",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/livestream/StreamPlayerPage.vue") }]
  },
  {
    path: "/liveChat",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/LiveChatPage.vue") }]
  },
  {
    path: "/maintenance",
    children: [
      {
        path: "",
        name: "maintenance",
        component: () => import("pages/MaintenancePage.vue")
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
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/fishing",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "fishing",
        component: () => import("pages/games/AviatorView.vue")
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
    path: "/summon/:summonerCode",
    name: "summonCode",
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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
    path: "/account/withdraw/bank-card",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/BindBankCardView.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/crypto",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/BindCryptoView.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/ewallet",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/BindEWalletView.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/alipay",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/BindAlipayView.vue")
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
    path: "/account/letters",
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
    path: "/account/vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "accountvip",
        component: () => import("pages/games/VIPView.vue")
      }
    ]
  },
  {
    path: "/account/outbox",
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
    path: "/account/write",
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
    path: "/account/feedback",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/FeedbackView.vue")
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
    path: "/deposittest",
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
    path: "/privilege/invite",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PrivilegeInvite.vue") }],
    meta: { requiresAuth: true, isApp: true }
  },
  {
    path: "/app-tutorial",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/AppTutorial.vue") }]
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
  {
    path: "/promotion",
    redirect: "/promo"
  },
  // {
  //   path: "/vip",
  //   redirect: "/account/vip"
  // },
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
  feedback: { parent: "account", path: "letter" },
  share: { parent: "account", path: "invite" }
};
export default routes;
