import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '仪表板',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/login',
      name: '登录页',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/member',
      name: '会员',
      component: () => import('../views/Member/MemberListView.vue'),
      children: [
        {
          path: 'list',
          name: '会员列表',
          component: () => import('../components/Member/MemberList.vue'),
        },
        {
          path: 'add',
          name: '新增会员',
          component: () => import('../components/Member/MemberAdd.vue'),
        },
      ],
    },
  ],
})

export default router
