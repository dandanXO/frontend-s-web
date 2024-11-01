import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/RegisterPage.vue") }]
  },
  {
    path: "/refer/:referralCode",
    name: "referCode",
    component: () => {}
    // component: () => {},
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    redirect: "/home",
    component: () => import("pages/ErrorNotFound.vue")
  }
];
export default routes;
