const routes = [
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
    path: "/viptest",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "viptest",
        component: () => import("pages/games/VIPView.vue")
      }
    ]
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
    path: "/promotion",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }],
    meta: { requiresAuth: true, isApp: true }
  },
  {
    path: "/promotiontest",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }],
    meta: { requiresAuth: true, isApp: true }
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
    path: "/affiliatepage",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "affiliatepage",
        component: () => import("pages/AffiliateView.vue")
      }
    ]
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
    path: "/livestreampage",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/livestream/LiveStreamPage.vue") }]
  },
  {
    path: "/livestreampage/streamplayer",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/livestream/StreamPlayerPage.vue") }]
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
