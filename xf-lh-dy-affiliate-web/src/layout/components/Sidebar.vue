<template>
  <nav class="sidebar">
    <!-- <div class="route-wrapper-home">
      <RouterLink to="/" class="route">
        <div class="home">
          <span>首页</span>
        </div>
      </RouterLink>
    </div>
    <div class="navigation">
      <div class="route-title">下级信息</div>

      <div
        v-for="nav in navigationData"
        :key="nav.id"
        :class="`route-wrapper ${nav.active ? 'active' : ''}`"
      >
        <RouterLink :to="nav.path" class="route">
          <div class="route-content">
            <svg-icon
              :icon-class="nav.icon"
              :class="nav.active ? 'active' : ''"
            />
            <span :class="nav.active ? 'active' : ''">{{ nav.title }}</span>
          </div>
        </RouterLink>
      </div>
    </div> -->
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
          :class="child.active ? 'active' : ''"
        >
          <RouterLink :to="child.path" class="route">
            <div class="route-content">
              <svg-icon
                :icon-class="child.icon"
                :style="child.active ? 'color: #179cff' : ''"
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
    children: [
      {
        path: '/member-management',
        title: '会员管理',
        active: false,
        icon: 'people',
      },
      {
        path: '/game-record',
        title: '游戏记录',
        active: false,
        icon: 'chart',
      },
    ],
  },
  {
    title: '财务中心',
    display: true,
    children: [
      {
        path: '/withdraw-request',
        title: '提款申请',
        active: false,
        icon: 'bankcard',
      },
      {
        path: '/transfer',
        title: '代理代存',
        active: false,
        icon: 'backup',
      },
      {
        path: '/deposit',
        title: '额度充值',
        active: false,
        icon: 'bankcard',
      },
      {
        path: '/finance',
        title: '财务报表',
        active: false,
        icon: 'money',
      },
      {
        path: '/settlement',
        title: '佣金报表',
        active: false,
        icon: 'money',
      },
      {
        path: '/balance',
        title: '账变明细',
        active: false,
        icon: 'notebook',
      },
      {
        path: '/bonus',
        title: '推广红利',
        active: false,
        icon: 'gonggao',
      },
    ],
  },
  {
    title: '推广中心',
    display: true,
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
        icon: 'education',
      },
      {
        path: '/channel-pack',
        title: '渠道打包',
        active: false,
        icon: 'sys-tools',
      },
    ],
  },
  {
    title: '个人中心',
    display: true,
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
        icon: 'chart',
      },
      {
        path: '/announcement',
        title: '系统通告',
        active: false,
        icon: 'chart',
      },
      {
        path: '/settlement-info',
        title: '佣金说明',
        active: false,
        icon: 'chart',
      },
      {
        path: '/contact-us',
        title: '联系我们',
        active: false,
        icon: 'chart',
      },
    ],
  },
])

const setActiveNav = () => {
  navigationData.value.forEach(e => {
    e.children.forEach(c => {
      if (c.path === route.path) c.active = true
      else c.active = false
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
  padding: 2rem 0;
  border-radius: 1rem;
  width: 250px;
  margin: 4rem 0 2rem 2rem;

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
      margin: 1rem 0 1rem 2rem;
      font-weight: bold;
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
        padding: 0.5rem 0 0.5rem 2rem;

        svg {
          width: 2rem;
        }

        span {
          &.active {
            color: #00a1fd;
          }
        }

        &:hover {
          background: #e8f5ff;
        }
      }
    }
  }

  div.active {
    background-color: #e8f5ff;
    border-left: 5px solid rgb(71, 71, 255);
  }
}
</style>
