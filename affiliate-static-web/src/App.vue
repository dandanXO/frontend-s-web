<template>
  <router-view />
</template>

<script setup>
</script>
<style lang="scss">
.el-submenu__title:focus, .el-submenu__title:hover, .el-menu-item:hover {
  outline: 0 !important;
}

.el-menu-item:hover {
  background: #001528 !important;
}
//.el-popper {
//  left: 54px !important; // width of a el-menu-item, to prevent gap
//}
</style>
