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
    path: "/verification",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/VerificationCodePage.vue") }]
  },
  {
    path: "/forgot-password",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/ForgotPwdPage.vue") }]
  },
  // {
  //   path: "/home",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [{ path: "", component: () => import("pages/HomePage.vue") }]
  // },
  {
    path: "/promo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }]
  },
  {
    path: "/promotion",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }],
    meta: { requiresAuth: true, isApp: true }
  },
  {
    path: "/earn-money",
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
    path: "/agency-policy",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/AgencyPolicyPage.vue") }]
  },
  {
    path: "/liveChat",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/LiveChatPage.vue") }]
  },
  {
    path: "/interest-profit",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/InterestProfitPage.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/faq-page",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/FAQPage.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/cs-verifier",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/CsVerifierPage.vue") }],
    meta: { requiresAuth: false }
  },

  // {
  //   path: "/bonus",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [{ path: "", component: () => import("pages/BonusPage.vue") }],
  //   meta: { requiresAuth: true }
  // },
  {
    path: "/maintenance",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "maintenance",
        component: () => import("pages/MaintenancePage.vue")
      }
    ]
  },

  {
    path: "/side-menu",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("components/SideMenu.vue") }],
    meta: { requiresAuth: true }
  },
  // {
  //   path: "/aviator",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "aviator",
  //       component: () => import("pages/games/AviatorView.vue")
  //     }
  //   ]
  // },
  // {
  //   path: "/poker",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "poker",
  //       component: () => import("pages/games/PokerView.vue")
  //     }
  //   ]
  // },
  // {
  //   path: "/slot",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "slot",
  //       component: () => import("pages/games/SlotView.vue")
  //     }
  //   ]
  // },
  // {
  //   path: "/live-casino",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "live-casino",
  //       component: () => import("pages/games/LiveCasinoView.vue")
  //     }
  //   ]
  // },
  // {
  //   path: "/sport",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "sport",
  //       component: () => import("pages/games/sportFrameView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
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
  // {
  //   path: "/e-sport",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "e-sport",
  //       component: () => import("pages/games/E-SportView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/share",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "share",
  //       component: () => import("pages/ShareView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  {
    path: "/vip",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "vip",
        component: () => import("pages/games/VIPView.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  // {
  //   path: "/affiliate",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "affiliate",
  //       component: () => import("pages/AffiliateView.vue")
  //     }
  //   ]
  // },
  {
    path: "/share-affiliate",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "share-affiliate",
        component: () => import("pages/ShareAffiliateView.vue")
      }
    ],
    meta: { requiresAuth: true }
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
    path: "/referSpin/:referralSpinCode",
    name: "referCodeSpin",
    component: () => {}
    // component: () => {},
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
    // children: [{ path: "", component: () => import("pages/account/BankView.vue") }],
    children: [{ path: "", component: () => import("pages/account/WithdrawBankView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/ewallet",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/BindEWalletView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/crypto",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/BindCryptoView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/withdraw/bank-card",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/BindBankCardView.vue") }],
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
    path: "/account/feedback",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/mail/OutboxView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/feedback-detail",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/FeedbackDetailView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/write",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/mail/WriteView.vue") }],
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
    children: [
      {
        path: "",
        component: () => import("pages/account/RecordView.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/dividend",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/DividendView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/dividend/my-dividend",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/DividendView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/dividend/contract-management",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/DividendView.vue") }],
    meta: { requiresAuth: true }
  },
  {
    path: "/account/dividend/dividend-record",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/account/DividendView.vue") }],
    meta: { requiresAuth: true }
  },
  // {
  //   path: "/account/promotion",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/PromotionView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  {
    path: "/deposit",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/TransactionLandingView.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/withdraw",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/account/TransactionLandingView.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/spinnerRules",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/hotpromo/deposit-spinner-rewards/DepositSpinnerRules.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/spinnerHistory",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/hotpromo/deposit-spinner-rewards/DepositSpinnerHistory.vue")
      }
    ],
    meta: { requiresAuth: true }
  },
  // {
  //   path: "/account/changePwd",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/ChangePwdView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/download",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/DownloadView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/invite",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/InviteView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/announcement",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/AnnouncementView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/deposit",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/DepositRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/withdraw",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/WithdrawRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/transfer",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/TransferRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/moneyChange",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/MoneyChangeRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/promo",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/PromoRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/financeFeedBack",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/FeedbackRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/bet",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/BetHistoryRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/change",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/ChangeRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/betrecord",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/BetRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/recommend",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/RecommendRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/help",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/HelpRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/records/bill",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/records/BillRecordView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
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
  // {
  //   path: "/account/personal",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/PersonalView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/verifyTelephone",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/VerifyTelephone.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/verifyEmail",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/VerifyEmail.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/withdraw",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/WithdrawBankView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/transfer",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/finance/TransferView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/mail",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/account/StationLettersView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/mail/inbox",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/mail/InboxView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/vip",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "accountvip",
  //       component: () => import("pages/games/VIPView.vue")
  //     }
  //   ]
  // },
  // {
  //   path: "/account/mail/outbox",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/mail/OutboxView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/account/mail/write",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/mail/WriteView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/finance/deposit",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/finance/DepositView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/display",
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/finance/DisplayView.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path: "/depositLoading",
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("components/depositLoading.vue")
  //     }
  //   ],
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/finance/withdraw",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("pages/finance/WithdrawView.vue")
  //     }
  //   ],
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

if (process.env.MODE === "spa") {
  routes.push({
    path: "/redirect",
    component: () => import("pages/RedirectPage.vue") // Your new redirect page
  });
}

export default routes;
