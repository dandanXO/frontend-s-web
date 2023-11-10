<template>
  <nav class="sidebar">
    <div class="route-wrapper-home">
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
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const navigationData = ref([
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
])

const setActiveNav = () => {
  navigationData.value.forEach(e => {
    if (e.path === route.path) e.active = true
    else e.active = false
  })
}

onMounted(() => {
  watch(
    () => route.path,
    async () => {
      setActiveNav()
    }
  )
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
  margin: 4rem 2rem;

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
    font-size: 1.5rem;

    .route-title {
      margin: 1rem 0 1rem 2rem;
      color: #00a1fd;
    }

    .route-wrapper {
      padding: 0.5rem 0 0.5rem 0;

      .route {
        color: black;
        text-decoration: none;
      }

      &.active,
      &:hover {
        background: #e8f5ff;
      }

      .route-content {
        display: flex;
        gap: 0.5rem;
        margin: 0 0 0 2rem;

        svg {
          width: 2rem;
          &.active {
            color: #00a1fd;
          }
        }

        span {
          &.active {
            color: #00a1fd;
          }
        }
      }
    }
  }
}
</style>
