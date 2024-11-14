import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Index.vue'
import Forbidden from '@/views/Forbidden.vue'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { hidden: true },
    component: () => import('../views/kr/login/index.vue'),
  },
  {
    path: '/403',
    name: 'Forbidden',
    meta: { hidden: true },
    component: Forbidden,
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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../views/dashboard/index.vue'),
        name: 'Dashboard',
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
        name: 'Member',
        meta: {
          title: 'member-management',
        },
      },
      {
        path: 'member-tree',
        component: () => import('../views/member-info/member-tree/index.vue'),
        name: 'MemberTree',
        meta: {
          title: 'member-tree',
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
        name: 'Affiliate',
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
        name: 'AffiliateSummary',
        meta: {
          title: 'affiliate-summary',
        },
      },
    ],
  },
  {
    path: '/bet-management',
    component: Layout,
    children: [
      {
        path: 'live-bet-history',
        component: () => import('../views/member-info/game-record/index.vue'),
        name: 'LiveBetHistory',
        meta: {
          title: 'game-record-live',
          gameType: 'live',
        },
      },
      {
        path: 'slot-bet-history',
        component: () => import('../views/member-info/game-record/index.vue'),
        name: 'SlotBetHistory',
        meta: {
          title: 'game-record-slot',
          gameType: 'slot',
        },
      },
      {
        path: 'sport-bet-history',
        component: () => import('../views/member-info/game-record/index.vue'),
        name: 'SportBetHistory',
        meta: {
          title: 'game-record-sport',
          gameType: 'sport',
        },
      },
      {
        path: 'minigame-bet-history',
        component: () => import('../views/member-info/game-record/index.vue'),
        name: 'MiniGameBetHistory',
        meta: {
          title: 'game-record-minigame',
          gameType: 'fish',
        },
      },
    ],
  },
  {
    path: '/settlement-management',
    component: Layout,
    children: [
      {
        path: 'monthly-step-by-step-settlement',
        component: () =>
          import(
            '../views/settlement-management/MonthlyStepByStepSettlement.vue'
          ),
        name: 'MonthlyStepByStep',
        meta: {
          title: 'monthly-step-by-step-settlement',
        },
      },
      {
        path: 'statistics-by-member',
        component: () =>
          import('../views/settlement-management/StatisticsByMember.vue'),
        name: 'StatisticsByMember',
        meta: {
          title: 'statistics-by-member',
        },
      },
      {
        path: 'settlement-by-casino-slot-vendor',
        component: () =>
          import(
            '../views/settlement-management/SettlementByCasinoSlotVendor.vue'
          ),
        name: 'SettlementByCasinoSlotVendor',
        meta: {
          title: 'settlement-by-casino-slot-vendor',
        },
      },
      {
        path: 'commission-history-list',
        component: () =>
          import('../views/settlement-management/CommissionHistoryList.vue'),
        name: 'CommissionHistoryList',
        meta: {
          title: 'commission-history-list',
        },
      },
      {
        path: 'member-point-record-list',
        component: () =>
          import(
            '../views/settlement-management/member-point-record/index.vue'
          ),
        name: 'MemberPointRecord',
        meta: {
          title: 'member-point-record-list',
        },
      },
      {
        path: 'deposit-withdraw-management',
        component: () =>
          import('../views/settlement-management/deposit-withdraw/index.vue'),
        name: 'DepositWithdrawManagement',
        meta: {
          title: 'deposit-withdraw-management',
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
        path: 'info',
        component: () => import('../views/personal/index.vue'),
        name: 'Personal Info',
        meta: {
          title: 'personal',
        },
      },
      {
        path: 'inquiry',
        component: () => import('../views/personal/inquiry/index.vue'),
        name: 'inquiry',
        meta: {
          title: 'inquiry',
        },
      },
      {
        path: 'message',
        component: () => import('../views/personal/message/index.vue'),
        name: 'Message',
        meta: {
          title: 'message',
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
