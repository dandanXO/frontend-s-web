<template>
  <nav class="sidebar">
    <div class="navigation">
      <div
        v-for="nav in navigationData"
        :key="nav.id"
        :class="`route-wrapper ${nav.active ? 'active' : ''}`"
      >
        <div v-if="nav.display" class="route-title">{{ nav.title }}</div>
        <div
          v-for="child in nav.children"
          :key="child.id"
          :class="`route-container ${child.active ? 'active' : ''}`"
        >
          <RouterLink :to="nav.path + child.path" class="route">
            <div class="route-content">
              <svg-icon
                :icon-class="`${child.icon}`"
                :style="child.active ? 'color: #179cff' : ''"
                :className="child.active ? 'active-icon' : ''"
              />
              <span :class="child.active ? 'active' : ''">
                {{ child.title }}
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const navigationData = ref([
  {
    title: t('首页'),
    display: false,
    path: '',
    children: [
      {
        path: '/dashboard',
        title: '首页',
        active: false,
        icon: 'home',
      },
    ],
  },
  {
    title: '下级信息',
    display: true,
    path: '/member',
    children: [
      {
        path: '/manage',
        title: '会员管理',
        active: false,
        icon: 'squares',
      },
      {
        path: '/game-record',
        title: '游戏记录',
        active: false,
        icon: 'clock',
      },
    ],
  },
  {
    title: '财务中心',
    display: true,
    path: '/affiliate',
    children: [
      {
        path: '/withdraw-request',
        title: '提款申请',
        active: false,
        icon: 'form-w-pencil',
      },
      {
        path: '/transfer',
        title: '代理代存',
        active: false,
        icon: 'users',
      },
      {
        path: '/deposit',
        title: '额度充值',
        active: false,
        icon: 'wallet',
      },
      {
        path: '/finance',
        title: '财务报表',
        active: false,
        icon: 'report',
      },
      {
        path: '/settlement',
        title: '佣金报表',
        active: false,
        icon: 'money',
      },
      {
        path: '/credit-flow',
        title: '账变明细',
        active: false,
        icon: 'ledger',
      },
    ],
  },
  {
    title: '推广中心',
    display: true,
    path: '/promotion',
    children: [
      {
        path: '/referral-link',
        title: '推广链接',
        active: false,
        icon: 'link',
      },
      {
        path: '/referral-material',
        title: '推广素材',
        active: false,
        icon: 'photo',
      },
      {
        path: '/channel-pack',
        title: '渠道打包',
        active: false,
        icon: 'folder',
      },
    ],
  },
  {
    title: '个人中心',
    display: true,
    path: '/personal',
    children: [
      {
        path: '/vip',
        title: 'VIP专享',
        active: false,
        icon: 'link',
      },
      {
        path: '/overflow',
        title: '溢出申请',
        active: false,
        icon: 'form',
      },
      {
        path: '/announcement',
        title: '系统通告',
        active: false,
        icon: 'speaker',
      },
      {
        path: '/commission-info',
        title: '佣金说明',
        active: false,
        icon: 'money-bag',
      },
      {
        path: '/contact-us',
        title: '联系我们',
        active: false,
        icon: 'speech-bubbles',
      },
    ],
  },
])

const setActiveNav = () => {
  const currentPath = route.path.substring(route.path.lastIndexOf('/'))
  navigationData.value.forEach(e => {
    e.children.forEach(c => {
      // due to the usage of <use> mechanism and svg-sprite-loader
      // referred icon is out of component scope
      // thus unable to style within component directly
      const iconEl = document.querySelector(`symbol#icon-${c.icon} > path`);
      const activeIconColor = '#3f8cff';
      const defaultIconColor = '#7D8592';
      if (c.path === currentPath) {
        c.active = true
        iconEl.style.fill = activeIconColor
      } else {
        c.active = false
        iconEl.style.fill = defaultIconColor
      }
    })
  })
}

onMounted(() => {
  watch(
    () => route.path,
    async () => {
      setActiveNav()
    }
  )
  setActiveNav()
})
</script>

<style scoped lang="scss">
.sidebar {
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  width: 250px;

  .home {
    display: flex;
    gap: 0.5rem;
    margin: 0 0 0 2rem;

    svg {
      width: 1.5rem;
    }

    span {
      font-size: 1.25rem;
    }
  }

  .route-wrapper-home {
    margin: 0 0 1rem 0;

    .route {
      color: black;
      text-decoration: none;
    }
  }

  .navigation {
    font-size: 1rem;

    .route-title {
      margin: 1rem 0 1rem 1rem;
      font-weight: bold;
    }

    .route-title:has(~.active) {
      color: #3F8CFF;
    }

    .route-wrapper {
      padding: 0.5rem 0 0.5rem 0;

      .route {
        color: black;
        text-decoration: none;
      }

      .route-content {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 2rem 0.5rem 0.5rem;
        margin: 0px 10px;

        svg {
          width: 2rem;
        }
      }
    }
  }

  .route-container.active {
    border-right: 5px solid #3f8cff;
  }

  .route-container.active .route-content {
    background-color: #ecf3ff;
    border-radius: 0.5rem;
    color: #3F8CFF;
  }
}
</style>
