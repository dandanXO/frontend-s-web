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
      path: "/logintoken/:loginToken",
      name: "loginToken",
      component: () => {},
      // component: () => {},
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
    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        redirect: '/',
        component: () => import("pages/ErrorNotFound.vue")
    }
];
export default routes;
