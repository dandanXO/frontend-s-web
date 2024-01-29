<template>
  <div class="maintenance-container">
    <div class="maintenance-img">
      <img :src="require('../assets/images/maintenance/maintenance-img.png')" />
    </div>
    <div class="maintenance-btn">
      <router-link to="/home" class="maintenance-cta">返回主页</router-link>
    </div>
  </div>
</template>

<style lang="scss">
.maintenance-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/images/maintenance/maintenance-bg.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  padding-top: 80px;
  padding-bottom: 80px;

  .maintenance-img {
    margin-left: 210px;
    img {
      display: block;
      width: 100%;
      max-width: 800px;
    }
  }

  .maintenance-btn {
    margin-left: 150px;
    margin-top: 270px;
    position: absolute;

    .maintenance-cta {
      background: linear-gradient(96deg, #024bff 0%, #7708ff 100%);
      padding: 12px 60px;
      border-radius: 8px;
      color: #ffffff;
      font-size: 20px;
      font-weight: 500;
      text-decoration: none;

      &:hover {
        filter: brightness(0.8);
      }
    }
  }
}
</style>
