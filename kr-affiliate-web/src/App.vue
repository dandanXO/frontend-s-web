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
  link.href = '/kr-favicon.ico';

  // change path according to hostname
  // console.log(window.location.host);
  // debugger;
  if (window.location.pathname === '/login') {
    console.log("Nside Login.")
    if (window.location.host.indexOf('xf') > -1) {
      window.location.pathname = '/xf/login'
    } else {
      window.location.pathname = '/kr/login'
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
