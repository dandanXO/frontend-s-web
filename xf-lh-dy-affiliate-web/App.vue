<template>
  <router-view />
</template>

<script setup>
/* eslint-disable */
// import {onMounted} from "vue";

// onMounted(() => {
//   var link = document.querySelector("link[rel~='icon']");
//   if (!link) {
//     link = document.createElement('link');
//     link.rel = 'icon';
//     document.head.appendChild(link);
//   }
//   if(window.location.host.indexOf("dy") > -1){
//     link.href = '/dy-favicon.ico';
//   }else if(window.location.host.indexOf("xf") > -1){
//     link.href = '/xf-favicon.ico';
//   }else if(window.location.host.indexOf("my") > -1){
//     link.href = '/my-favicon.ico';
//   }else if(window.location.host.indexOf("vi") > -1){
//     link.href = '/vi-favicon.ico';
//   }else if(window.location.host.indexOf("th") > -1 || window.location.host.indexOf("ph") > -1){
//     link.href = '/th-favicon.ico';
//   }else if(window.location.host.indexOf("lh") > -1){
//     link.href = '/lh-favicon.ico';
//   }else{
//     link.href = '/dy-favicon.ico';
//   }
// });

</script>
<style lang="scss">
.el-submenu__title:focus, .el-submenu__title:hover, .el-menu-item:hover {
  outline: 0 !important;
}

.el-menu-item:hover {
  background: #001528 !important;
}

</style>
