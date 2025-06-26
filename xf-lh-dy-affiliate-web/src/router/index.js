import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Index.vue'
import Forbidden from '@/views/Forbidden.vue'
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { hidden: true },
    component: () => import('../views/dy/login/index.vue'),
  },
  {
    path: '/403',
    name: 'Forbidden',
    meta: { hidden: true },
    component: Forbidden
  },
  {
    path: '/xf/login',
    name: 'XF Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/xf/login/index.vue'
      ),
  },
  {
    path: '/xf/register',
    name: 'XF Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/xf/register/index.vue'
      ),
  },
  {
    path: '/dy/login',
    name: 'DY Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/dy/login/index.vue'
      ),
  },
  {
    path: '/dy/register',
    name: 'DY Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/dy/register/index.vue'
      ),
  },
  {
    path: '/ind/login',
    name: 'IND Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/ind/login/index.vue'
      ),
  },
  {
    path: '/ind/register',
    name: 'IND Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/ind/register/index.vue'
      ),
  },
  {
    path: '/ind2/login',
    name: 'IW2 Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/ind2/login/index.vue'
      ),
  },
  {
    path: '/ind2/register',
    name: 'IW2 Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/ind2/register/index.vue'
      ),
  },
  {
    path: '/vi/login',
    name: 'VNM Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/vi/login/index.vue'
      ),
  },
  {
    path: '/vi/register',
    name: 'VNM Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/vi/register/index.vue'
      ),
  },
  {
    path: '/kaka/login',
    name: 'KAKA Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/kaka/login/index.vue'
      ),
  },
  {
    path: '/kaka/register',
    name: 'KAKA Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/kaka/register/index.vue'
      ),
  },
  {
    path: '/lh/login',
    name: 'LH Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/lh/login/index.vue'
      ),
  },
  {
    path: '/lh/register',
    name: 'LH Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/lh/register/index.vue'
      ),
  },
  {
    path: '/kr/login',
    name: 'KR Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/kr/login/index.vue'
      ),
  },
  {
    path: '/kr/register',
    name: 'KR Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/kr/register/index.vue'
      ),
  },
  {
    path: '/pak/login',
    name: 'PAK Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/pak/login/index.vue'
      ),
  },
  {
    path: '/pak/register',
    name: 'PAK Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/pak/register/index.vue'
      ),
  },
  {
    path: '/br1/login',
    name: 'BR1 Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/br1/login/index.vue'
      ),
  },
  {
    path: '/br1/register',
    name: 'BR1 Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/br1/register/index.vue'
      ),
  },
  {
    path: '/br2/login',
    name: 'BR2 Login',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "loginAffiliate" */ '../views/br2/login/index.vue'
      ),
  },
  {
    path: '/br2/register',
    name: 'BR2 Register',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "registerAffiliate" */ '../views/br2/register/index.vue'
      ),
  },
  {
    path: '/ph1/summary',
    name: 'Ph1 Summary',
    meta: { hidden: true },
    component: () =>
      import(
        /* webpackChunkName: "ph1-daily-summary" */ '../views/ph1/ph1-daily-summary/index.vue'
      ),
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
    path: '/downline',
    component: Layout,
    children: [
      {
        path: 'member',
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
        path: 'affiliate',
        component: () =>
          import('../views/member-info/affiliate-management/index.vue'),
        name: 'Affiliate Management',
        meta: {
          title: 'affiliate-management',
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
      {
        path: 'summary',
        component: () => import('../views/affiliate/summary/index.vue'),
        name: 'Affiliate Summary',
        meta: {
          title: 'affiliate-summary',
        },
      },
      {
        path: 'own-summary',
        component: () => import('../views/affiliate/own-summary/index.vue'),
        name: 'Affiliate Own Summary',
        meta: {
          title: 'affiliate-own-summary',
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
        path: 'rebate',
        component: () => import('../views/affiliate/rebate/index.vue'),
        name: 'Rebate',
        meta: {
          title: 'Rebate',
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
        path: 'withdraw',
        component: () => import('../views/affiliate/withdraw/index.vue'),
        name: 'Withdraw',
        meta: {
          title: 'Withdraw',
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
      {
        path: 'google-authenticator',
        component: () => import('../views/personal/google-auth/index.vue'),
        name: 'Google Authenticator',
        meta: {
          title: 'google-auth',
        },
      },
    ],
  },
  {
    path: '/report',
    component: Layout,
    children: [
      {
        path: 'daily-detail',
        component: () => import('../views/report/daily-detail/index.vue'),
        name: 'Daily Detail',
        meta: {
          title: 'Daily Detail',
        },
      },
      {
        path: 'daily-summary',
        component: () => import('../views/report/daily-summary/index.vue'),
        name: 'Daily Summary',
        meta: {
          title: 'Daily Summary',
        },
      },
      {
        path: 'retention-report',
        component: () => import('../views/report/retention-report/index.vue'),
        name: 'Retention Report',
        meta: {
          title: 'Retention Report',
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
