<template>
  <router-view />
</template>

<script setup>
/* eslint-disable */
import {onMounted} from "vue";

onMounted(() => {
  if(window.location.pathname.indexOf("dy") > -1 || window.location.pathname.indexOf("xf") > -1 || window.location.pathname.indexOf("lh") > -1) {
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
  }else if(window.location.pathname.indexOf("vi") > -1){
    link.href = '/vi-favicon.ico';
  }else if(window.location.pathname.indexOf("my") > -1){
    link.href = '/my-favicon.ico';
  }else if(window.location.pathname.indexOf("th") > -1 || window.location.pathname.indexOf("ph") > -1){
    link.href = '/th-favicon.ico';
  }else if(window.location.pathname.indexOf("ind") > -1 || window.location.hostname.indexOf("ind-") > -1){
    link.href = '/ind-favicon.ico';
  }else if(window.location.pathname.indexOf("ind2") > -1 || window.location.hostname.indexOf("ind2-") > -1){
    link.href = '/ind2-favicon.ico';
  }else{
    link.href = '/favicon.ico';
  }

  // change path according to hostname
  console.log(window.location.host);
  // debugger;
  if (window.location.pathname === '/login') {
    console.log("Nside Login.")
    if (window.location.host.indexOf('xf') > -1) {
      window.location.pathname = '/xf/login'
    } else if (window.location.host.indexOf('ind') > -1 || window.location.hostname.indexOf("ind-") > -1 || window.location.href.includes('ind-')) {
      window.location.pathname = '/ind/login'
    } else if (window.location.host.indexOf('lh1') > -1) {
      window.location.pathname = '/lh/login'
    }else if (window.location.host.indexOf('vnm') > -1 || window.location.hostname.indexOf("vnm-") > -1 || window.location.href.includes('vnm-')) {
      window.location.pathname = '/vi/login'
    } else {
      window.location.pathname = '/dy/login'
    }
  }
});

</script>
<style lang="scss">

@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap");
.el-submenu__title:focus, .el-submenu__title:hover, .el-menu-item:hover {
  outline: 0 !important;
}

.el-menu-item:hover {
  background: #001528 !important;
}
body.vilang {
  font-family: 'Roboto';
  .sidebar .navigation .route-wrapper {

  font-family: 'Roboto';
  }
}

</style>
