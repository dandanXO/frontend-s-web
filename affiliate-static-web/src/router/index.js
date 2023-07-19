import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/Index.vue";

export const constantRoutes = [
  {
    path: "/login",
    name: "Login",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "login" */"../views/xf/login/index.vue")
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import(/* webpackChunkName: "dashboard" */ "../views/home/index.vue"),
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "index"
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    name: 'Error Pages',
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
        name: 'Page401',
        meta: {
          title: 'page401',
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import(/* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'),
        name: 'Page404',
        meta: {
          title: 'page404',
          noCache: true
        }
      }
    ]
  },
  {
    name: "Downline Info",
    path: "/team",
    component: Layout,
    meta:
    {
      title: "Downline Info",
      icon: "team",
      hidden: false
    },
    alwaysShow: true,
    redirect: "noredirect",
    children: [
      {
        name: "Member",
        path: "member",
        component: () => import('@/views/team/member/index.vue'),
        meta:
        {
          title: "member",
          icon: "team",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      },
      {
        name: "Affiliate",
        path: "affiliate",
        component: () => import('@/views/team/affiliate/index.vue'),
        meta:
        {
          title: "Affiliate",
          icon: "peoples",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      },
      {
        name: "Bet Record",
        path: "bet-record",
        component: () => import('@/views/team/bet-record/index.vue'),
        meta:
        {
          title: "Bet Record",
          icon: "money",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      },
      {
        name: "Deposit Record",
        path: "deposit-record",
        component: () => import('@/views/team/deposit-record/index.vue'),
        meta:
        {
          title: "Deposit Record",
          icon: "doc",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      }
    ]
  },
  {
    name: "Statistics",
    path: "/statistics",
    component: Layout,
    meta:
    {
      title: "Statistics",
      icon: "chart",
      hidden: false
    },
    alwaysShow: true,
    redirect: "noredirect",
    children: [
      {
        name: "Game Stats",
        path: "game",
        component: () => import('@/views/statistics/game/index.vue'),
        meta:
        {
          title: "Game Stats",
          icon: "chart",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      },
      {
        name: "Affiliate Daily Report",
        path: "affiliate-daily-report",
        component: () => import('@/views/statistics/affiliate-daily-report/index.vue'),
        meta:
        {
          title: "Affiliate Daily Report",
          icon: "excel",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      }
    ]
  },
  {
    name: "Affiliate Center",
    path: "/affiliate",
    component: Layout,
    meta:
    {
      title: "Affiliate Center",
      icon: "peoples",
      hidden: false
    },
    alwaysShow: true,
    redirect: "noredirect",
    children: [
      {
        name: "Deposit",
        path: "deposit",
        component: () => import('@/views/affiliate-center/deposit/index.vue'),
        meta:
        {
          title: "Deposit",
          icon: "bank",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      },
      {
        name: "Bind Bank Cards",
        path: "bankcard",
        component: () => import('@/views/affiliate-center/withdraw/affiliatebindcard.vue'),
        meta:
        {
          title: "member",
          icon: "bankcard",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      },
      {
        name: "Bank Withdrawal",
        path: "withdraw",
        component: () => import('@/views/affiliate-center/withdraw/withdraw.vue'),
        meta:
        {
          title: "Bank Withdrawal",
          icon: "bank",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      }
    ]
  },
  {
    name: "Referral Management",
    path: "/referral",
    component: Layout,
    meta:
    {
      title: "Referral Link",
      icon: "link",
      hidden: false
    },
    alwaysShow: true,
    redirect: "noredirect",
    children: [
      {
        name: "Referral Link",
        path: "/referral-link",
        component: () => import('@/views/referral/referral-link/index.vue'),
        meta:
        {
          title: "Referral Link",
          icon: "link",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      },
      {
        name: "Affiliate Domain",
        path: "/affiliate-domain",
        component: () => import('@/views/referral/affiliate-domain/index.vue'),
        meta:
        {
          title: "Affiliate Domain",
          icon: "web",
          hidden: false
        },
        alwaysShow: true,
        redirect: null,
      }
    ]
  },
  {
    name: "Personal Center",
    path: "/personal",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import(/* webpackChunkName: "personal" */ "../views/personal/index.vue"),
        name: "Personal Center",
        meta: {
          title: "Personal Center",
          icon: "people"
        }
      }
    ],
    alwaysShow: true,
    redirect: "noredirect"
  },
  {
    path: "/my/login",
    name: "MYS Login",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "loginAffiliate" */"../views/my/login/index.vue")
  },
  {
    path: "/my/register",
    name: "MYS Register",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "registerAffiliate" */"../views/my/register/index.vue")
  },
  {
    path: "/ph/login",
    name: "PH Login",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "loginAffiliate" */"../views/ph/login/index.vue")
  },
  {
    path: "/ph/register",
    name: "PH Register",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "registerAffiliate" */"../views/ph/register/index.vue")
  },
  {
    path: "/th/login",
    name: "THA Login",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "loginAffiliate" */"../views/th/login/index.vue")
  },
  {
    path: "/th/register",
    name: "THA Register",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "registerAffiliate" */"../views/th/register/index.vue")
  },
  {
    path: "/xf/login",
    name: "XF Login",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "loginAffiliate" */"../views/xf/login/index.vue")
  },
  {
    path: "/xf/register",
    name: "XF Register",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "registerAffiliate" */"../views/xf/register/index.vue")
  },
  {
    path: "/dy/login",
    name: "DY Login",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "loginAffiliate" */"../views/dy/login/index.vue")
  },
  {
    path: "/dy/register",
    name: "DY Register",
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "registerAffiliate" */"../views/dy/register/index.vue")
  },
];

export const notFound = {
  path: '/:pathMatch(.*)*',
  redirect: '/error/404',
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
