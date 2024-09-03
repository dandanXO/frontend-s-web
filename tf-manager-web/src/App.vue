<template>
  <router-view v-if="isRouterActive" />
</template>

<script setup>
import { ref, provide, nextTick } from 'vue-demi'

const isRouterActive = ref(true)
provide('reload', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
</script>
<style lang="scss">
.el-submenu__title:focus, .el-submenu__title:hover, .el-menu-item:hover {
  outline: 0 !important;
}

.el-menu-item:hover {
  background: #001528 !important;
}
</style>
