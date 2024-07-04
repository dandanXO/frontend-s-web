<template>
  <ElConfigProvider :locale="locale">
    <div :class="classObj" class="app-wrapper">
      <div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <div class="main-container">
        <Sidebar class="sidebar-container" />
        <AppMain class="content-container" />
      </div>
    </div>
  </ElConfigProvider>
</template>

<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  toRefs,
} from 'vue'
import { useStore } from '@/store'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import vi from 'element-plus/es/locale/lang/vi'
import th from 'element-plus/es/locale/lang/th'
import { AppActionTypes } from '@/store/modules/app/action-types'
import { AppMain, Navbar, Sidebar } from './components'
import resize from './resize'

export default defineComponent({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    ElConfigProvider,
  },
  setup() {
    const store = useStore()
    const {
      sidebar,
      device,
      addEventListenerOnResize,
      resizeMounted,
      removeEventListenerResize,
      watchRouter,
    } = resize()
    const state = reactive({
      handleClickOutside: () => {
        store.dispatch(AppActionTypes.ACTION_CLOSE_SIDEBAR, false)
      },
    })
    const classObj = computed(() => {
      return {
        // hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === 'mobile',
      }
    })

    watchRouter()
    onBeforeMount(() => {
      addEventListenerOnResize()
    })

    onMounted(() => {
      resizeMounted()
    })

    onBeforeUnmount(() => {
      removeEventListenerResize()
    })

    const localeMap = {
      zh: zhCn,
      en: en,
      vi: vi,
      th: th,
    }

    const locale = computed(() => {
      const storedLocale = localStorage.getItem('languageLocale')
      return localeMap[storedLocale] || en // Default to English if not found
    })

    return {
      classObj,
      sidebar,
      ...toRefs(state),
      locale,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  height: 100vh;
  transition: margin-left 0.28s;
  display: flex;
  position: relative;
  background: #f3f8fc;
  // gap: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
}

.content-container {
  max-height: 100%;
  display: grid;
  grid-template-rows: 130px 1fr;
}

.sidebar-container {
  transition: width 0.28s;
  height: 100%;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  transition: width 0.28s;
}

/* for mobile response 适配移动端 */
.mobile {
  .sidebar-container {
    transition: transform 0.28s;
    height: 100%;
    padding: 0;
    border-radius: 0;
  }

  :deep(.navigation) {
    height: 100%;
    overflow: auto;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .sidebar-container {
    width: 0;

    &.expanded {
      width: auto;
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {

  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
