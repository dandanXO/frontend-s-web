<template>
  <div class="maintenance-container">
    <div class="maintenance-img">
      <img class="logo-img" src="../assets/logo.png" />
      <img src="../assets/images/maintenance/maintenance-img.png" />
    </div>
    <div class="maintenance-title">网站维护中</div>
    <div class="maintenance-content">
      目前我们的网站正在维护中...
      <br />
      <template v-if="ui.maintenanceStartTime">
        从：{{ ui.maintenanceStartTime }}
        <br />
      </template>
      <template v-if="ui.maintenanceEndTime">
        至：{{ ui.maintenanceEndTime }}
        <br />
      </template>
      期间所有游戏和服务均无法使用。
      <br />
      对于给您带来任何的不变，我们深表歉意，并感谢您的耐心等待！
    </div>
  </div>
</template>

<script setup>
import { useUI } from "src/stores/ui";
const ui = useUI();
</script>

<style lang="scss" scoped>
.maintenance-container {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position:relative;
  z-index:9999;

  .maintenance-img {
    img {
      display: block;
      width: 100%;
      max-width: 250px;
    }
  }

  .maintenance-title {
    color: #fff;
    display: flex;
  }

  .maintenance-content {
    display: flex;
    justify-content: center;
    max-width: 400px;
    padding: 16px;
    color: #c1c1c1;
  }
}
</style>
