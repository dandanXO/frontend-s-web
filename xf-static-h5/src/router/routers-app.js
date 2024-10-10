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
    path: "/promotion",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PromoPage.vue") }],
    meta: { requiresAuth: true, isApp: true }
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
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
    component: () => import("pages/ErrorNotFound.vue")
  }
];
export default routes;
