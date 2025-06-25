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
    {
      path: '/live-sport',
      name: 'Live Sport',
      beforeEnter: (to, from, next) => {
        if (sessionStorage.getItem('memberType') === 'admin'){
          next()
        }else{
          next({ path: '/', query: { redirect: to.fullPath } })
        }
      },
      component: '',
      children: [
        {
          name: '体育直播赛事设定',
          path: 'live-setting',
          component: () => import('../components/live/LiveSetting.vue'),
        },
        {
          name: '体育直播监控',
          path: 'live-monitor',
          component: () => import('../components/live/LiveMonitor.vue'),
        },
        {
          name: '聊天室记录禁言设定',
          path: 'live-history-block',
          component: () => import('../components/live/LiveHistoryBlock.vue'),
        },
        {
          name: '聊天室会员禁言设定',
          path: 'live-block',
          component: () => import('../components/live/LiveBlock.vue'),
        },
        {
          name: '聊天室VIP发言设定',
          path: 'chat-status',
          component: () => import('../components/live/ChatStatus.vue'),
        },
        {
          name: '体育直播敏感词设定',
          path: 'sensitive-wrod',
          component: () => import('../components/live/SensitiveWord.vue'),
        },
        {
          name: '赛事管理',
          path: 'live-event',
          component: () => import('../components/live/LiveEvent.vue'),
        },
        {
          name: '主播管理',
          path: 'live-streamer',
          component: () => import('../components/live/LiveStreamer.vue'),
        },
        {
          name: '队伍管理',
          path: 'live-team',
          component: () => import('../components/live/LiveTeam.vue'),
        },
        {
          name: '赛事资讯',
          path: 'live-match',
          component: () => import('../components/live/liveMatch.vue'),
        },
      ]
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
