<template>
  <div class="maintenance-container">
    <div class="maintenance-img">
      <img :src="require('../assets/images/maintenance/maintenance-img.png')" />
    </div>
    <div class="maintenance-details">
      <div class="maintenance-logo">
        <img src="../assets/logo-1.png" />
      </div>
      <div class="maintenance-title">目前我们的网站正在维护中...</div>
      <div class="maintenance-desc">
        从：{{ ui.maintenanceStartTime }}
        <br />
        至：{{ ui.maintenanceEndTime }}
        <br />
        期间所有游戏和服务均无法使用。
        <br />
        对于给您带来任何的不变，我们深表歉意，并感谢您的耐心等待！
      </div>
    </div>
    <!-- <div class="maintenance-btn">
      <router-link to="/home" class="maintenance-cta">返回主页</router-link>
    </div> -->
  </div>
</template>

<script setup>
import { useUI } from "stores/ui";

const ui = useUI();
</script>

<style lang="scss">
.maintenance-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/images/maintenance/main-bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  flex-direction: column;
  padding: 20px;

  .maintenance-details {
    display: flex;
    flex-direction: column;
  }

  .maintenance-logo {
    margin: 20px auto 0;
    img {
      display: block;
      width: 168px;
    }
  }

  .maintenance-title {
    margin-top: 10px;
    color: #4c88f8;
    font-size: 30px;
    font-weight: 600;
  }

  .maintenance-desc {
    margin-top: 10px;
    color: #858585;
    font-size: 18px;
    line-height: 1.6;
    font-weight: 500;
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
</style>
