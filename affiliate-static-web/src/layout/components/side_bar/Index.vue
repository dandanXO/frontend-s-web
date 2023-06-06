<template>
  <div
    class="sideWrap has-logo"
  >
    <SidebarLogo
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse="isCollapse"
        :unique-opened="false"
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <SidebarItem
          :is-collapse="isCollapse"
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'
import variables from '@/styles/_variables.scss'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    SidebarItem,
    SidebarLogo
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const sidebar = computed(() => {
      return store.state.app.sidebar
    })
    const routes = computed(() => {
      return store.state.menu.routes
    })

    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta !== null || meta !== undefined) {
        if (meta.activeMenu) {
          return meta.activeMenu
        }
      }
      return path
    })

    const isCollapse = computed(() => {
      return !sidebar.value.opened
    })

    // within variables only have those used in the component, what hpn to the other
    return {
      sidebar,
      routes,
      variables,
      activeMenu,
      isCollapse
    }
  }
})
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.has-logo {
  .el-scrollbar {
    height: calc(100vh - 100px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
