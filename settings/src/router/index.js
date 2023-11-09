import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        {
            path: '/member-management',
            name: 'member-menagement',
            component: () => import('../views/MemberManagement.vue')
        },
        {
            path: '/game-record',
            name: 'game-record',
            component: () => import('../views/GameRecord.vue')
        }
    ]
});

export default router;
