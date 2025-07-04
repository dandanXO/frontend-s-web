<template>
  <div class="maintenance-container">
    <div class="maintenance-details">
      <div class="maintenance-logo">
        <img src="../assets/logo-1.png" />
      </div>
      <div class="maintenance-title">目前我们的网站正在维护中...</div>
      <div class="maintenance-desc">
        开始：{{ ui.maintenanceStartTime }}
        <br />
        结束：{{ ui.maintenanceEndTime }}
        <br />
        期间所有游戏和服务均无法使用。
        <br />
        感谢您的耐心等待，给您带来的不便我们深感抱歉！
      </div>
    </div>
    <div class="maintenance-img">
      <img :src="require('../assets/images/maintenance/maintenance-img.png')" />
    </div>
    <!-- <div class="maintenance-btn">
      <router-link to="/home" class="maintenance-cta">返回主页</router-link>
    </div> -->
  </div>
</template>
<script setup>
import { useDark } from "@vueuse/core";
import { uiStore } from "@/store/ui";

const ui = uiStore();
const isDark = useDark();
</script>

<style lang="scss">
.maintenance-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/images/home/main-bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: top center;

  .maintenance-details {
    display: flex;
    flex-direction: column;
  }

  .maintenance-logo {
    margin: 0 auto;
    img {
      display: block;
      width: 168px;
    }
  }

  .maintenance-title {
    margin-top: 10px;
    font-family: PingFang SC;
    color: #4c88f8;
    font-size: 40px;
    font-weight: 800;
  }

  .maintenance-desc {
    margin-top: 10px;
    font-family: PingFang SC;
    color: #858585;
    font-size: 18px;
    line-height: 1.6;
    font-weight: 600;
  }

  .maintenance-img {
    margin-left: 30px;
    img {
      display: block;
      width: 100%;
      max-width: 600px;
    }
  }
}

.dark {
  .maintenance-container {
    background: $background-dark;
  }
}
</style>
