const routes = [
  {
    path: "/",
    redirect: "/b9-charity",
  },
  {
    path: "/b9-charity",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/B9CharityPage.vue") },
    ],
  },
  {
    path: "/b9-style",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/B9StylePage.vue") },
    ],
  },
  {
    path: "/event-sponsorship",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/EventSponsorshipPage.vue"),
      },
    ],
  },
  {
    path: "/partners",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/PartnersPage.vue") },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
