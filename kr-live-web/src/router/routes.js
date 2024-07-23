const routes = [
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        children: [{ path: "", component: () => import(/* webpackChunkName: "home" */ "pages/HomePage.vue") }]
    },
    {
        path: "/affiliate",
        component: () => import(/* webpackChunkName: "main" */"layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "affiliate",
                component: () => import(/* webpackChunkName: "affiliate" */"pages/AffiliateView.vue")
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
    },
    {
      path: "/logintoken/:loginToken",
      name: "loginToken",
      component: () => {},
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        redirect: '/',
        component: () => import(/* webpackChunkName: "error" */"pages/ErrorNotFound.vue")
    }
];
export default routes;
