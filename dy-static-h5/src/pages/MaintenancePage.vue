<template>
  <div class="maintenance-container">
    <div class="maintenance-img">
      <img :src="require('../assets/images/maintenance/maintenance-img.png')" />
    </div>
    <div class="maintenance-btn">
      <router-link to="/" class="maintenance-cta">返回主页</router-link>
    </div>
  </div>
</template>

<style lang="scss">
.maintenance-container {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/images/maintenance/maintenance-bg.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  flex-direction: column;

  .maintenance-img {
    img {
      display: block;
      width: 100%;
      max-width: 450px;
    }
  }

  .maintenance-btn {
    .maintenance-cta {
      background: linear-gradient(96deg, #024bff 0%, #7708ff 100%);
      padding: 12px 40px;
      border-radius: 8px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 500;
      text-decoration: none;
      min-width: 160px;
      display: block;
      text-align: center;

      &:hover {
        filter: brightness(0.8);
      }
    }
  }
}
</style>
