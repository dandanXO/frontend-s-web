<template>
  <router-view />
</template>

<script setup>
/* eslint-disable */
import {onMounted} from "vue";

onMounted(() => {
  if(window.location.pathname.indexOf("dy") > -1 || window.location.pathname.indexOf("xf") > -1) {
    document.title = '代理后台';
  }

  var link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if(window.location.pathname.indexOf("dy") > -1){
    link.href = '/dy-favicon.ico';
  }else if(window.location.pathname.indexOf("xf") > -1){
    link.href = '/xf-favicon.ico';
  }else if(window.location.pathname.indexOf("my") > -1){
    link.href = '/my-favicon.ico';
  }else if(window.location.pathname.indexOf("th") > -1 || window.location.pathname.indexOf("ph") > -1){
    link.href = '/th-favicon.ico';
  }else{
    link.href = '/favicon.ico';
  }
  
  // change path according to hostname
  if (window.location.pathname === '/login') {
    if (window.location.host.indexOf('xf') > -1) {
      window.location.pathname = '/xf/login'
    } else {
      window.location.pathname = '/dy/login'
    }
  }

});

</script>
<style lang="scss">
.el-submenu__title:focus, .el-submenu__title:hover, .el-menu-item:hover {
  outline: 0 !important;
}

.el-menu-item:hover {
  background: #001528 !important;
}

</style>
