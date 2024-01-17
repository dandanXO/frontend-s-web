<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator-class="el-icon-arrow-right"
  >
    <transition-group name="breadcrumb">
      <template v-for="(item, index) in breadcrumbs"
                :key="item.path"
      >
        <el-breadcrumb-item
          v-if="item.name"
        >
          <span
            v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1"
            class="no-redirect"
          >{{ $t('menu.' + item.name) }}</span>
          <a
            v-else
            @click.prevent="handleLink(item)"
          >{{ $t('menu.' + item.name) }}</a>

        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { compile } from 'path-to-regexp'
import router from '@/router'
import { useI18n } from "vue-i18n";
export default defineComponent({
  setup() {
    const currentRoute = useRoute()
    // eslint-disable-next-line
    const { t } = useI18n();
    const pathCompile = (path) => {
      const { params } = currentRoute
      const toPath = compile(path)
      return toPath(params)
    }

    const state = reactive({
      breadcrumbs: [],
      getBreadcrumb: () => {
        const currentRouteMatchedCopy = [...currentRoute.matched]
        // if contain parent for last element, prepend before it the list
        let matched;
        const lastIdxOfMatched = currentRouteMatchedCopy.length - 1
        const parentRoute = currentRouteMatchedCopy[lastIdxOfMatched].meta.parent
        if (parentRoute) {
          currentRouteMatchedCopy.splice(-1, 0, parentRoute)
        }
        matched = currentRouteMatchedCopy.filter((item) => item.meta && item.meta.title)
        const first = matched[0]
        if (!state.isDashboard(first)) {
          matched = [{ path: '/dashboard', meta: { title: 'dashboard' } }].concat(matched)
        }
        state.breadcrumbs = matched.filter((item) => {
          return item.meta && item.meta.title && item.meta.breadcrumb !== false
        })
        // console.log(state.breadcrumbs);
      },
      isDashboard(route) {
        const name = route && route.name
        if (!name) {
          return false
        }
        return name.toString().trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
      },
      handleLink(item) {
        const { redirect, path, name } = item
        if (redirect) {
          router.push(redirect).catch((err) => {
            console.warn(err)
          })
          return
        }
        if (name) {
          router.push({ name: name })
          return
        }
        router.push(pathCompile(path)).catch((err) => {
          console.warn(err)
        })
      }
    })

    watch(() => currentRoute.path, (path) => {
      if (path.startsWith('/redirect/')) {
        return
      }
      state.getBreadcrumb()
    })

    onBeforeMount(() => {
      state.getBreadcrumb()
    })

    return {
      ...toRefs(state)
    }
  }

})

</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
