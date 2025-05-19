import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
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
    {
      path: '/sensitive-word',
      name: '後台管理',
      component: () => import('../views/Sensitive-word/SensitiveWordView.vue'),
      children: [
        {
          path: 'list',
          name: '敏感字列表',
          component: () => import('../components/Sensitive-word/SensitiveWordList.vue'),
        },
      ],
    },
    {
      path: '/chat-block',
      name: '拉黑管理',
      component: () => import('../views/chat-block/ChatBlockView.vue'),
      children: [
        {
          path: 'block-list',
          name: '拉黑名单',
          component: () => import('../components/chat-block/BlockList.vue'),
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
