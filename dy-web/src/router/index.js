import {createRouter, createWebHistory} from 'vue-router';
import LayoutView from "@/views/layouts/MainLayout.vue";
import HomeView from '../views/HomeView.vue';
import PersonalLayoutView from "@/views/layouts/PersonalLayoutView.vue";
import PersonalRouter from "./personal";
import {userStore} from "@/store/index";

const routes = [
    {
        path: "/",
        name: "home",
        component: LayoutView,
        redirect: "home",
        children: [
            {
                path: "home",
                name: "home",
                component: HomeView,
            },
            {
                path: "/game",
                name: "game",
                component: () => import(/* webpackChunkName: "Game" */ '../views/GameView.vue')
            },
            {
                path: "/about",
                name: "about",
                component: () => import(/* webpackChunkName: "About" */ '../views/AboutView.vue')
            },
            {
                path: "/esports",
                name: "esports",
                component: () => import(/* webpackChunkName: "Game" */ '../views/eSportsView.vue')
            },
            {
                path: "/sports",
                name: "sports",
                component: () => import(/* webpackChunkName: "Game" */ '../views/SportsView.vue')
            },
            {
                path: "/live-casino",
                name: "live",
                component: () => import(/* webpackChunkName: "Game" */ '../views/LiveCasinoView.vue')
            },
            {
                path: "/lottery",
                name: "lottery",
                component: () => import(/* webpackChunkName: "Game" */ '../views/LotteryView.vue')
            },
            {
                path: "/poker",
                name: "poker",
                component: () => import(/* webpackChunkName: "Game" */ '../views/PokerView.vue')
            },
            {
                path: "/fishing",
                name: "fishing",
                component: () => import(/* webpackChunkName: "Game" */ '../views/FishingView.vue')
            },
            {
                path: "/agent",
                name: "agent",
                component: () => import(/* webpackChunkName: "Game" */ '../views/AgentView.vue')
            },
            {
                path: "/promotion",
                name: "promotion",
                component: () => import(/* webpackChunkName: "Game" */ '../views/PromotionView.vue')
            },
            {
                path: "/app",
                name: "app",
                component: () => import(/* webpackChunkName: "Game" */ '../views/AppView.vue')
            },
            {
                path: "/sponsor",
                name: "sponsor",
                component: () => import(/* webpackChunkName: "Game" */ '../views/SponsorView.vue')
            },
            {
                path: "/vip",
                name: "vip",
                component: () => import(/* webpackChunkName: "Game" */ '../views/VIPView.vue')
            },
            {
                path: "/refer/:referralCode",
                name: "referCode",
                component: () => {
                }
            },
            {
                path: "/center",
                name: "center",
                component: PersonalLayoutView,
                children: PersonalRouter,
                meta: {requiresAuth: true},
            },
            {
                path: "/depositLoading",
                name: "loading",
                component: () =>
                    import(
                        /* webpackChunkName: "depositLoading" */ "../components/depositLoading.vue"
                        ),
            },
        ]
    },
    // {
    //   path: '/game',
    //   name: 'game',
    //   component: LayoutView,
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   // component: () => import(/* webpackChunkName: "Game" */ '../views/GameView.vue'
    // }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    const store = userStore();
    if (to.name === "agentCode") {
        sessionStorage.setItem("AFFILIATE_CODE", to.params.affiliateCode);
        next(`/home`);
    }
    if (to.name === "referCode") {
        sessionStorage.setItem("REFERRAL_CODE", to.params.referralCode);
        next(`/home?refer=1`);
    }

    if (store.token) {
        if (to.path === "/login") {
            next({path: "/"});
        } else {
            if (store.nickName === "") {
                store.getMemberInfo().then(() => next({...to, replace: true}));
            } else {
                next();
            }
        }
    } else {
        console.log(to)
        if (to.meta.requiresAuth) {
            next({query: {redirect: to.path}});
        } else {
            next();
        }
    }
});
export default router;

