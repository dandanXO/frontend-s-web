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
    {
      path: '/stream',
      name: '流媒体',
      component: () => import('../views/Stream/StreamListView.vue'),
      children: [
        {
          path: 'list',
          name: '流媒体列表',
          component: () => import('../components/Stream/StreamList.vue'),
        },
        {
          path: 'my-streams',
          name: '我的直播',
          component: () => import('../components/Stream/StreamList.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  const isLoginPage = to.path === '/login'

  if (!token && !isLoginPage) {
    next('/login')
  } else {
    next()
  }
})
export default router
