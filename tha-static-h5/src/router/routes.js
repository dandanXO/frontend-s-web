import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        children: [{path: "", component: () => import("pages/HomePage.vue")}]
    },
    {
        path: "/welcome",
        children: [{path: "", component: () => import("pages/WelcomePage.vue")}]
    },
    {
        path: "/login",
        component: () => import("layouts/MainLayout.vue"),
        children: [{path: "", component: () => import("pages/LoginPage.vue")}]
    },
    {
        path: "/register",
        component: () => import("layouts/MainLayout.vue"),
        children: [{path: "", component: () => import("pages/RegisterPage.vue")}]
    },
    {
        path: "/forgot-password",
        component: () => import("layouts/MainLayout.vue"),
        children: [{path: "", component: () => import("pages/ForgotPwdPage.vue")}]
    },
    // {
    //   path: "/home",
    //   component: () => import("layouts/MainLayout.vue"),
    //   children: [{ path: "", component: () => import("pages/HomePage.vue") }]
    // },
    {
        path: "/promo",
        component: () => import("layouts/MainLayout.vue"),
        children: [{path: "", component: () => import("pages/PromoPage.vue")}]
    },
    {
        path: "/liveChat",
        component: () => import("layouts/MainLayout.vue"),
        children: [{path: "", component: () => import("pages/LiveChatPage.vue")}]
    },
    {
        path: "/aviator",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "aviator",
                component: () => import("pages/games/AviatorView.vue")
            }
        ]
    },
    {
        path: "/poker",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "poker",
                component: () => import("pages/games/PokerView.vue")
            }
        ]
    },
    {
        path: "/slot",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "slot",
                component: () => import("pages/games/SlotView.vue")
            }
        ]
    },
    {
        path: "/live-casino",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "live-casino",
                component: () => import("pages/games/LiveCasinoView.vue")
            }
        ]
    },
    {
        path: "/sport",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "sport",
                component: () => import("pages/games/sportFrameView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    // {
    //   path: "/sports",
    //   // component: () => import("layouts/MainLayout.vue"),
    //   children: [
    //     {
    //       path: "",
    //       name: "sport",
    //       component: () => import("components/sportsOuter.vue")
    //     }
    //   ],
    //   meta: { requiresAuth: true }
    // },
    {
        path: "/e-sport",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "e-sport",
                component: () => import("pages/games/E-SportView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/share",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "share",
                component: () => import("pages/ShareView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/getapp",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "getapp",
                component: () => import("pages/GetApp.vue")
            }
        ],
        meta: {requiresAuth: false}
    },
    {
        path: "/vip",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "vip",
                component: () => import("pages/games/VIPView.vue")
            }
        ]
    },
    {
        path: "/affiliate",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "affiliate",
                component: () => import("pages/AffiliateView.vue")
            }
        ]
    },
    {
        path: "/agent/:affiliateCode",
        name: "agentCode",
        component: () => {
        }
    },
    {
        path: "/refer/:referralCode",
        name: "referCode",
        component: () => {
        }
        // component: () => {},
    },
    {
        path: "/account/transit",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/account/TransitRecordView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/account/personal",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/account/PersonalView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/account/withdraw",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/account/WithdrawBankView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/account/mail",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/account/MailboxView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/finance/deposit",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/finance/DepositView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/display",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/finance/DisplayView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/depositLoading",
        children: [
            {
                path: "",
                component: () => import("components/depositLoading.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/insert-bankinfo",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("components/insertBankInfo.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    {
        path: "/finance/withdraw",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/finance/WithdrawView.vue")
            }
        ],
        meta: {requiresAuth: true}
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        redirect: '/',
        component: () => import("pages/ErrorNotFound.vue")
    }
];
export default routes;
