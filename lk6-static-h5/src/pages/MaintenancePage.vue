<template>
  <div class="maintenance-container">
    <div class="maintenance-logo">
      <img src="../assets/logo.png" />
    </div>
    <div class="maintenance-img">
      <img :src="require('../assets/images/maintenance/maintenance-img.png')" />
    </div>

    <div class="maintenance-title">目前我们的网站正在维护中...</div>
    <div class="maintenance-details">
      <div class="maintenance-desc">
        开始：{{ ui.maintenanceStartTime }}
        <br />
        结束：{{ ui.maintenanceEndTime }}
        <br />
        <br />
        期间所有游戏和服务均无法使用。
        <br />
        感谢您的耐心等待，给您带来的不便我们深感抱歉！
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
  justify-content: flex-start;
  padding: 20px;
  padding-top: 60px;
  background-color: #f3f7fd;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  flex-direction: column;

  .maintenance-details {
    display: flex;
    flex-direction: column;

    box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
    background: #fcfdfe;
    border-radius: 20px;
    padding: 30px 25px 40px;
  }

  .maintenance-logo {
    margin: 0px auto 0;
    img {
      display: block;
      width: 168px;
    }
  }

  .maintenance-title {
    margin: 30px auto;
    color: #424f72;
    font-size: 24px;
    text-align: center;
    font-weight: 600;
  }

  .maintenance-desc {
    margin-top: 10px;
    color: #858585;
    font-size: 18px;
    text-align: center;
    line-height: 1.6;
    font-weight: 500;
  }

  .maintenance-img {
    img {
      display: block;
      width: 65%;
      margin: 15px auto;
      max-width: 400px;
    }
  }
}
</style>
