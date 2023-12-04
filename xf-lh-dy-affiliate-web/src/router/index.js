import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Index.vue'
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { hidden: true },
    component: () => import('../views/xf/login/index.vue'),
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
        },
      },
    ],
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: 'manage',
        component: () =>
          import('../views/member-info/member-management/index.vue'),
        name: 'Member Management',
        meta: {
          title: 'member-management',
        },
      },
      {
        path: 'tag-setting',
        component: () =>
          import(
            '../views/member-info/member-management/tag-setting/index.vue'
          ),
        name: 'Tag Setting',
        meta: {
          title: 'tag-setting',
        },
      },
      {
        path: 'game-record',
        component: () => import('../views/member-info/game-record/index.vue'),
        name: 'Game Record',
        meta: {
          title: 'game-record',
        },
      },
    ],
  },
  {
    path: '/affiliate',
    component: Layout,
    children: [
      {
        path: 'withdraw-request',
        component: () =>
          import('../views/affiliate/withdraw-request/index.vue'),
        name: 'Withdraw Request',
        meta: {
          title: 'withdraw-request',
        },
      },
      {
        path: 'transfer',
        component: () => import('../views/affiliate/transfer/index.vue'),
        name: 'Transfer',
        meta: {
          title: 'transfer',
        },
      },
      {
        path: 'deposit',
        component: () => import('../views/affiliate/deposit/index.vue'),
        name: 'Deposit',
        meta: {
          title: 'deposit',
        },
      },
      {
        path: 'finance',
        component: () => import('../views/affiliate/finance/index.vue'),
        name: 'Finance',
        meta: {
          title: 'finance',
        },
      },
      {
        path: 'settlement',
        component: () => import('../views/affiliate/settlement/index.vue'),
        name: 'Settlement',
        meta: {
          title: 'Settlement',
        },
      },
      {
        path: 'credit-flow',
        component: () => import('../views/affiliate/credit-flow/index.vue'),
        name: 'Credit Flow',
        meta: {
          title: 'credit flow',
        },
      },
      {
        path: 'bank-card',
        component: () => import('../views/affiliate/bank-card/index.vue'),
        name: 'Bank Card',
        meta: {
          title: 'Bank Card',
        },
      },
    ],
  },
  {
    path: '/promotion',
    component: Layout,
    children: [
      {
        path: 'referral-link',
        component: () => import('../views/promotion/referral-link/index.vue'),
        name: 'Referral Link',
        meta: {
          title: 'referral-link',
        },
      },
      {
        path: 'referral-material',
        component: () =>
          import('../views/promotion/referral-material/index.vue'),
        name: 'Referral Material',
        meta: {
          title: 'referral-material',
        },
      },
      {
        path: 'channel-pack',
        component: () => import('../views/promotion/channel-pack/index.vue'),
        name: 'Channel Pack',
        meta: {
          title: 'channel-pack',
        },
      },
      {
        path: 'referral-material/poster',
        name: 'poster',
        meta: { hidden: true },
        component: () =>
          import(
            /* webpackChunkName: "registerAffiliate" */ '../views/promotion/referral-material/poster/index.vue'
          ),
      },
    ],
  },
  {
    path: '/personal',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../views/personal/index.vue'),
        name: 'Personal Info',
        meta: {
          title: 'personal',
        },
      },
      {
        path: 'vip',
        component: () => import('../views/personal/vip/index.vue'),
        name: 'VIP',
        meta: {
          title: 'vip',
        },
      },
      {
        path: 'overflow',
        component: () => import('../views/personal/overflow/index.vue'),
        name: 'Overflow',
        meta: {
          title: 'overflow',
        },
      },
      {
        path: 'announcement',
        component: () => import('../views/personal/announcement/index.vue'),
        name: 'Announcement',
        meta: {
          title: 'announcement',
        },
      },
      {
        path: 'commission-info',
        component: () => import('../views/personal/commission-info/index.vue'),
        name: 'Comission Info',
        meta: {
          title: 'commission-info',
        },
      },
      {
        path: 'contact-us',
        component: () => import('../views/personal/contact-us/index.vue'),
        name: 'Contact Us',
        meta: {
          title: 'contact-us',
        },
      },
    ],
  },
]

export const notFound = {
  path: '/:pathMatch(.*)*',
  redirect: '/error/404',
  meta: { hidden: true },
}

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 }),
})

export function resetRouter() {
  const newRouter = router
  router.matcher = newRouter.matcher // reset router
}

export default router
