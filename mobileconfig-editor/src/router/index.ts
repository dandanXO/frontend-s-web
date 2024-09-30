import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
