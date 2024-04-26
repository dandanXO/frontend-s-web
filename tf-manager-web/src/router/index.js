import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/Index.vue";

export const constantRoutes = [
  {
    path: "/login",
    name: "Login",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "login" */"../views/login/index.vue")
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home/dashboard"
  },
  {
    path: "/google-auth",
    name: "GoogleAuth",
    component: Layout,
    meta: {
      title: 'Google Auth',
    },
    children: [
      {
        path: "",
        name: "Auth",
        component: () => import("../views/auth/google-auth.vue")
      }
    ]
  },
  {
    path: "/welcome",
    name: "WelcomeLayout",
    component: Layout,
    meta: {
      title: 'Welcome Page',
    },
    children: [
      {
        path: "",
        name: "Welcome",
        component: () => import("../views/error-page/welcome.vue")
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    name: 'Pages',
    redirect: 'noredirect',
    meta: {
      title: 'errorPages',
      hidden: true,
      icon: '#icon404'
    },
    children: [
      {
        path: '401',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/error-page/401.vue'),
        name: '401 Page',
        meta: {
          title: 'page401',
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import(/* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'),
        name: 'Error Page',
        meta: {
          title: 'page404',
          noCache: true
        }
      },
    ]
  },
];

export const notFound = {
  path: '/:pathMatch(.*)*',
  redirect: '/welcome',
  meta: { hidden: true }
}

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
});

export function resetRouter() {
  const newRouter = router;
  router.matcher = newRouter.matcher; // reset router
}

export default router;
