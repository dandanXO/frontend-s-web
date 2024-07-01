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
  if(window.location.pathname.indexOf("dy") > -1 || window.location.host.indexOf("dy2-") > -1){
    link.href = '/dy-favicon.ico';
  }else if(window.location.pathname.indexOf("xf") > -1 || window.location.host.indexOf("xf") > -1){
    link.href = '/xf-favicon.ico';
  }else if(window.location.pathname.indexOf("vi") > -1 || window.location.host.indexOf("vnm") > -1){
    link.href = '/vi-favicon.ico';
  }else if(window.location.pathname.indexOf("kaka") > -1 || window.location.host.indexOf("ka2") > -1){
    link.href = '/kaka-favicon.ico';
  }else if(window.location.pathname.indexOf("my") > -1 || window.location.host.indexOf("my") > -1){
    link.href = '/my-favicon.ico';
  }else if(window.location.pathname.indexOf("lh") > -1 || window.location.host.indexOf("lh1-") > -1){
    link.href = '/favicon.ico';
  }else if(window.location.pathname.indexOf("ind") > -1 || window.location.hostname.indexOf("ind-") > -1){
    link.href = '/ind-favicon.ico';
  }else if(window.location.pathname.indexOf("ind") > -1 || window.location.hostname.indexOf("iw2-") > -1){
    link.href = '/ind2-favicon.ico';
  }else if(window.location.pathname.indexOf("krw") > -1 || window.location.hostname.indexOf("krw-") > -1){
    link.href = '/kr-favicon.ico';
  }else{
    link.href = '/favicon.ico';
  }

  // change path according to hostname
  // console.log(window.location.host);
  // debugger;
  if (window.location.pathname === '/login') {
    console.log("Nside Login.")
    if (window.location.host.indexOf('xf') > -1) {
      window.location.pathname = '/xf/login'
    } else if (window.location.host.indexOf('ind') > -1 || window.location.hostname.indexOf("ind-") > -1 || window.location.href.includes('ind-')) {
      window.location.pathname = '/ind/login'
    } else if (window.location.host.indexOf('iw2') > -1 || window.location.hostname.indexOf("iw2-") > -1 || window.location.href.includes('iw2-')) {
      window.location.pathname = '/ind/login'
    }  else if (window.location.host.indexOf('lh1') > -1) {
      window.location.pathname = '/lh/login'
    }else if (window.location.host.indexOf('vnm') > -1 || window.location.hostname.indexOf("vnm-") > -1 || window.location.href.includes('vnm-')) {
      window.location.pathname = '/vi/login'
    }else if (window.location.host.indexOf('ka1') > -1 || window.location.hostname.indexOf("ka1-") > -1 || window.location.href.includes('ka1-')) {
      window.location.pathname = '/kaka/login'
    }else if (window.location.host.indexOf('krw') > -1 || window.location.hostname.indexOf("krw-") > -1 || window.location.href.includes('krw-')) {
      window.location.pathname = '/kr/login'
    } else if (window.location.host.indexOf('pak') > -1 || window.location.hostname.indexOf("pak-") > -1 || window.location.href.includes('pak-')) {
      window.location.pathname = '/pak/login'
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
