import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Index.vue'
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { hidden: true },
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/xf/login/index.vue'),
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import(/* webpackChunkName: "dashboard" */ "../views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "index"
        }
      }
    ]
  },
  {
    path: '/member-management',
    component: Layout,
    children: [
      {
        path: "",
        component: () => import(/* webpackChunkName: "member-management" */"../views/member-info/member-management/index.vue"),
        name: "Member Management",
        meta: {
          title: "member-management",
          icon: "index"
        }
      }
    ]
  },
  {
    path: '/game-record',
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("../views/member-info/game-record/index.vue"),
        name: "Game Record",
        meta: {
          title: "game-record",
          icon: "index"
        }
      }
    ]
  }
]

export const notFound = {
  path: '/:pathMatch(.*)*',
  redirect: '/error/404',
  meta: { hidden: true },
}

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

export function resetRouter() {
  const newRouter = router
  router.matcher = newRouter.matcher // reset router
}

export default router
