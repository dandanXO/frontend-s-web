export default [
  {
    path: "personal",
    name: "personal",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "personal" */ "../views/account/PersonalView.vue"
      ),
  },
  // {
  //   path: "withdrawbank",
  //   name: "withdrawbank",
  //   meta: { requiresAuth: true },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "personal" */ "../views/account/WithdrawBankView.vue"
  //     ),
  // },
  {
    path: "mailbox",
    name: "mailbox",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "mailbox" */ "../views/account/MailboxView.vue"
      ),
  },
  {
    path: "feedback",
    name: "feedback",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "feedback" */ "../views/account/FeedbackView.vue"
      ),
  },
  {
    path: "share",
    name: "share",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "share" */ "../views/account/ShareView.vue"),
  },
  {
    path: "security-verified",
    name: "security-verified",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "security-verified" */ "../views/account/SecurityView.vue"
      ),
  },
  {
    path: "voucher-code",
    name: "voucher-code",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "voucher-code" */ "../views/account/VoucherCodeView.vue"
      ),
  },
  {
    path: "transit-record",
    name: "transit-record",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "transit-record" */ "../views/account/TransitRecordView.vue"
      ),
  },
  {
    path: "deposit",
    name: "deposit",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "deposit" */ "../views/finance/DepositView.vue"
      ),
  },
  {
    path: "display",
    name: "display",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "display" */ "../views/finance/DisplayView.vue"
      ),
  },
  {
    path: "transfer",
    name: "transfer",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "transfer" */ "../views/finance/TransferView.vue"
      ),
  },
  {
    path: "withdraw",
    name: "withdraw",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "withdraw" */ "../views/finance/WithdrawView.vue"
      ),
  },
];
