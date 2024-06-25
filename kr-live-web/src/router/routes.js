const routes = [
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        children: [{path: "", component: () => import("pages/HomePage.vue")}]
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
    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        redirect: '/',
        component: () => import("pages/ErrorNotFound.vue")
    }
];
export default routes;
