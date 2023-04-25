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
  // {
  //   name: "permission",
  //   path: "/permission",
  //   component: Layout,
  //   meta:
  //   {
  //     title: "permission",
  //     icon: "system",
  //     hidden: false
  //   },
  //   alwaysShow: true,
  //   redirect: "noredirect",
  //   children: [
  //     {
  //       name: "menu",
  //       path: "menu",
  //       component: () => import('../views/permission/menu/index.vue'),
  //       meta:
  //       {
  //         title: "menu",
  //         icon: "menu",
  //         hidden: false
  //       },
  //       alwaysShow: true,
  //       redirect: null,
  //     },
  //     {
  //       name: "Roles",
  //       path: "roles",
  //       component: () => import('@/views/permission/roles'),
  //       meta:
  //       {
  //         title: "roles",
  //         icon: "role",
  //         hidden: false
  //       },
  //       alwaysShow: true,
  //       redirect: null,
  //     },
  //     {
  //       name: "User",
  //       path: "user",
  //       component: () => import('@/views/permission/user'),
  //       meta:
  //       {
  //         title: "user",
  //         icon: "user",
  //         hidden: false
  //       },
  //       alwaysShow: true,
  //       redirect: null,
  //     },
  //   ]
  // },
  // {
  //   name: "system",
  //   path: "/system",
  //   component: Layout,
  //   meta:
  //   {
  //     title: "system",
  //     icon: "system",
  //     hidden: false
  //   },
  //   alwaysShow: true,
  //   redirect: "noredirect",
  //   children:
  //     [
  //       {
  //         name: "Site",
  //         path: "site",
  //         component: () => import('@/views/system/site'),
  //         meta:
  //         {
  //           title: "Site",
  //           icon: "visits",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Config",
  //         path: "config",
  //         component: () => import('@/views/system/config'),
  //         meta:
  //         {
  //           title: "Config",
  //           icon: "develop",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Currency",
  //         path: "currency",
  //         component: () => import('@/views/system/currency'),
  //         meta:
  //         {
  //           title: "currency",
  //           icon: "money",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Platform",
  //         path: "platform",
  //         component: () => import('@/views/system/platform'),
  //         meta:
  //         {
  //           title: "platform",
  //           icon: "zujian",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Risk Level",
  //         path: "riskLevel",
  //         component: () => import('@/views/system/risk-level'),
  //         meta:
  //         {
  //           title: "riskLevel",
  //           icon: "skill",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Site Platform",
  //         path: "sitePlatform",
  //         component: () => import('@/views/system/site-platform'),
  //         meta:
  //         {
  //           title: "site platform",
  //           icon: "develop",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Schedule",
  //         path: "schedule",
  //         component: () => import('@/views/system/schedule'),
  //         meta:
  //           {
  //             title: "Schedule",
  //             icon: "money",
  //             hidden: false
  //           },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Platform Account",
  //         path: "platformAccount",
  //         component: () => import('@/views/system/system-platform-account'),
  //         meta:
  //         {
  //           title: "platform account",
  //           icon: "develop",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //     ]
  // },
  // {
  //   name: "Promotion",
  //   path: "/promotion",
  //   component: Layout,
  //   meta:
  //   {
  //     title: "promotion",
  //     icon: "tree",
  //     hidden: false
  //   },
  //   alwaysShow: true,
  //   redirect: "noredirect",
  //   children:
  //     [
  //       {
  //         name: "Privilege Info",
  //         path: "privilegeInfo",
  //         component: () => import('@/views/promotion-display/privilege-info'),
  //         meta:
  //         {
  //           title: "privilegeInfo",
  //           icon: "user",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Home Banner",
  //         path: "home_banner",
  //         component: () => import('@/views/promotion-display/home-banner'),
  //         meta:
  //         {
  //           title: "home banner",
  //           icon: "tree",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Promotion pages",
  //         path: "promo_page",
  //         component: () => import('@/views/promotion-display/promo-page'),
  //         meta:
  //         {
  //           title: "promo_page",
  //           icon: "tree",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: "/promotion/promo_page/list",
  //         children:
  //           [
  //             {
  //               name: "Promo List",
  //               path: "/promotion/promo_page/list",
  //               component: () => import('@/views/promotion-display/promo-page/promo-list'),
  //               meta:
  //               {
  //                 title: "promo add",
  //                 hidden: true
  //               },
  //               alwaysShow: false,
  //               redirect: null,
  //             },
  //             {
  //               name: "Add Promo",
  //               path: "/promotion/promo_page/add",
  //               component: () => import('@/views/promotion-display/promo-page/promo-add'),
  //               meta:
  //               {
  //                 title: "promo add",
  //                 hidden: true
  //               },
  //               alwaysShow: false,
  //               redirect: null,
  //             },
  //             {
  //               name: "Edit Promo",
  //               path: "/promotion/promo_page/edit/:id",
  //               component: () => import('@/views/promotion-display/promo-page/promo-add'),
  //               meta:
  //               {
  //                 title: "promo edit",
  //                 hidden: true
  //               },
  //               alwaysShow: false,
  //               redirect: null,
  //             },

  //           ]
  //       }
  //     ]
  // },
  // {
  //   name: "Member",
  //   path: "/member",
  //   component: Layout,
  //   meta:
  //   {
  //     title: "member",
  //     icon: "tree",
  //     hidden: false
  //   },
  //   alwaysShow: true,
  //   redirect: "noredirect",
  //   children:
  //     [
  //       {
  //         name: "Member List",
  //         path: "list",
  //         component: () => import('@/views/member/list/index.vue'),
  //         meta:
  //         {
  //           title: "memberList",
  //           icon: "user",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Member Details",
  //         path: "details/:id",
  //         component: () => import(/* webpackChunkName: "details" */ '@/views/member/details/index.vue'),
  //         meta:
  //         {
  //           title: "memberDetails",
  //           hidden: true
  //         },
  //         redirect: null,
  //       },
  //       {
  //         name: "Member Edit Log",
  //         path: "memberEditLog",
  //         component: () => import('@/views/member/member-edit-log'),
  //         meta:
  //         {
  //           title: "memberEditLog",
  //           icon: "user",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Member Freeze Record",
  //         path: "freezeRecord",
  //         component: () => import('@/views/Management/freeze-record'),
  //         meta:
  //           {
  //             title: "Freeze Record",
  //             icon: "unlock",
  //             hidden: false
  //           },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Member Amount Adjust",
  //         path: "memberAmountAdjust",
  //         component: () => import('@/views/member/member-amount-adjust'),
  //         meta:
  //           {
  //             title: "memberAmountAdjust",
  //             icon: "money",
  //             hidden: false
  //           },
  //         alwaysShow: true,
  //         redirect: null,
  //       }
  //     ]
  // },
  // // {
  // //   path: "/",
  // //   component: Layout,
  // //   meta:
  // //   {
  // //     title: "management",
  // //     icon: "develop",
  // //     hidden: false
  // //   },
  // //   alwaysShow: true,
  // //   redirect: "noredirect",
  // //   children:
  // //     [
  // //       {
  // //         name: "Member Transfer Record",
  // //         path: "transferRecord",
  // //         component: () => import('@/views/Management/transfer-record'),
  // //         meta:
  // //         {
  // //           title: "Transfer Record",
  // //           icon: "people",
  // //           hidden: false
  // //         },
  // //         alwaysShow: true,
  // //         redirect: null,
  // //       }
  // //     ]
  // // },
  // {
  //   name: "Deposit Management",
  //   path: "/deposit",
  //   component: Layout,
  //   meta:
  //   {
  //     title: "depositManagement",
  //     icon: "money",
  //     hidden: false
  //   },
  //   alwaysShow: true,
  //   redirect: "noredirect",
  //   children:
  //     [
  //       {
  //         name: "Online Deposit",
  //         path: "online",
  //         component: () => import('@/views/member-deposit-record/online-deposit/index.vue'),
  //         meta:
  //         {
  //           title: "onlineDeposit",
  //           icon: "list",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Deposit Record",
  //         path: "record",
  //         component: () => import('@/views/member-deposit-record/deposit-record/index.vue'),
  //         meta:
  //         {
  //           title: "DepositRecord",
  //           icon: "money",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       }
  //     ]
  // },
  // {
  //   name: "Withdrawal Management",
  //   path: "/withdraw",
  //   component: Layout,
  //   meta:
  //   {
  //     title: "withdrawalManagement",
  //     icon: "money",
  //     hidden: false
  //   },
  //   alwaysShow: true,
  //   redirect: "noredirect",
  //   children:
  //     [
  //       {
  //         name: "Withdrawal Process",
  //         path: "process",
  //         component: () => import('@/views/member-withdraw-record/withdraw-process/index.vue'),
  //         meta:
  //         {
  //           title: "withdrawalProcess",
  //           icon: "list",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Withdrawal Record",
  //         path: "record",
  //         component: () => import('@/views/member-withdraw-record/withdraw-record/index.vue'),
  //         meta:
  //         {
  //           title: "withdrawalRecord",
  //           icon: "money",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       }
  //     ]
  // },
  // {
  //   name: "Site Management",
  //   path: "/site-management",
  //   component: Layout,
  //   meta:
  //   {
  //     title: "Site-Management",
  //     icon: "international",
  //     hidden: false
  //   },
  //   alwaysShow: true,
  //   redirect: "noredirect",
  //   children:
  //     [
  //       {
  //         name: "Message",
  //         path: "message",
  //         component: () => import('../views/site-management/message/index.vue'),
  //         meta:
  //         {
  //           title: "message",
  //           icon: "email",
  //           hidden: false
  //         },
  //         alwaysShow: false,
  //         redirect: null,
  //       },
  //       {
  //         name: "Announcement",
  //         path: "announcement-menu",
  //         component: () => import('@/views/site-management/announcement-menu/index.vue'),
  //         meta:
  //         {
  //           title: "announcement",
  //           icon: "gonggao",
  //           hidden: false
  //         },
  //         alwaysShow: false,
  //         redirect: "/site-management/announcement-menu/announcement",
  //         children:
  //           [
  //             {
  //               name: "Announcement",
  //               path: "announcement",
  //               component: () => import('@/views/site-management/announcement-menu/announcement/index.vue'),
  //               meta:
  //               {
  //                 title: "announcement",
  //                 icon: "gonggao",
  //                 hidden: false
  //               },
  //               alwaysShow: false,
  //               redirect: null,
  //             },
  //             {
  //               name: "Announcement Type",
  //               path: "announcementType",
  //               component: () => import('@/views/site-management/announcement-menu/announcement-type/index'),
  //               meta:
  //               {
  //                 title: "announcementType",
  //                 icon: "gonggao",
  //                 hidden: false
  //               },
  //               alwaysShow: false,
  //               redirect: null,
  //             }
  //           ]
  //       },
  //       {
  //         name: "VIP",
  //         path: "vip",
  //         component: () => import('@/views/site-management/vip/index'),
  //         meta:
  //         {
  //           title: "vip",
  //           icon: "user",
  //           hidden: false
  //         },
  //         alwaysShow: false,
  //         redirect: null,
  //       },
  //       {
  //         name: "Game",
  //         path: "game",
  //         component: () => import('@/views/site-management/game'),
  //         meta:
  //         {
  //           title: "game",
  //           icon: "source",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       }
  //     ]
  // },
  // {
  //   name: "Payment Management",
  //   path: "/payment-management",
  //   component: Layout,
  //   meta:
  //   {
  //     title: "Payment-Management",
  //     icon: "alipay",
  //     hidden: false
  //   },
  //   alwaysShow: true,
  //   redirect: "noredirect",
  //   children:
  //     [

  //       // {
  //       // name: "Bank",
  //       // path: "/bank",
  //       // component: Layout,
  //       // meta:
  //       // {
  //       //   title: "bank",
  //       //   icon: "money",
  //       //   hidden: false
  //       // },
  //       // alwaysShow: true,
  //       // redirect: "noredirect",
  //       // children:
  //       //   [
  //       {
  //         name: "Bank Info",
  //         path: "bank_info",
  //         component: () => import('@/views/payment-management/bank/bank-info'),
  //         meta:
  //         {
  //           title: "bank info",
  //           icon: "money",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Bank Card",
  //         path: "bank_card",
  //         component: () => import('@/views/payment-management/bank/bank-card'),
  //         meta:
  //         {
  //           title: "bank card",
  //           icon: "money",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       // ]
  //       // },
  //       {
  //         name: "Payment Type",
  //         path: "paymentType",
  //         component: () => import('@/views/payment-management/payment-type'),
  //         meta:
  //         {
  //           title: "Payment Type",
  //           icon: "alipay",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Payment",
  //         path: "payment",
  //         component: () => import('@/views/payment-management/system-payment'),
  //         meta:
  //         {
  //           title: "payment",
  //           icon: "alipay",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: "/payment-management/payment/list",
  //         children:
  //           [
  //             {
  //               name: "Payment List",
  //               path: "/payment-management/payment/list",
  //               component: () => import('@/views/payment-management/system-payment/system-payment-list'),
  //               meta:
  //               {
  //                 title: "payment list",
  //                 hidden: true
  //               },
  //               alwaysShow: false,
  //               redirect: null,
  //             },
  //             {
  //               name: "Add Payment",
  //               path: "/payment-management/payment/add",
  //               component: () => import('@/views/payment-management/system-payment/system-payment-action'),
  //               meta:
  //               {
  //                 title: "payment add",
  //                 hidden: true
  //               },
  //               alwaysShow: false,
  //               redirect: null,
  //             },
  //             {
  //               name: "Edit Payment",
  //               path: "/payment-management/payment/edit/:id",
  //               component: () => import('@/views/payment-management/system-payment/system-payment-action'),
  //               meta:
  //               {
  //                 title: "payment edit",
  //                 hidden: true
  //               },
  //               alwaysShow: false,
  //               redirect: null,
  //             },

  //           ]
  //       },
  //       {
  //         name: "Payment Display",
  //         path: "paymentDisplay",
  //         component: () => import('@/views/payment-management/payment-display'),
  //         meta:
  //           {
  //             title: "Payment Type",
  //             icon: "alipay",
  //             hidden: false
  //           },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Withdraw Platform",
  //         path: "withdrawPlatform",
  //         component: () => import('@/views/payment-management/withdraw-platform'),
  //         meta:
  //         {
  //           title: "Withdraw Platform",
  //           icon: "develop",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Withdraw Setting",
  //         path: "withdrawSetting",
  //         component: () => import('@/views/payment-management/withdraw-setting'),
  //         meta:
  //         {
  //           title: "withdraw setting",
  //           icon: "develop",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Site Withdraw Platform",
  //         path: "siteWithdrawPlatform",
  //         component: () => import('@/views/payment-management/system-site-withdraw-platform'),
  //         meta:
  //         {
  //           title: "site withdraw Platform",
  //           icon: "list",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //       {
  //         name: "Deposit Setting",
  //         path: "depositSetting",
  //         component: () => import('@/views/payment-management/deposit-setting'),
  //         meta:
  //         {
  //           title: "deposit setting",
  //           icon: "money",
  //           hidden: false
  //         },
  //         alwaysShow: true,
  //         redirect: null,
  //       },
  //     ]
  // },
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
