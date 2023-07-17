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
  padding-top: 40px;
  padding-bottom: 80px;

  .maintenance-img {
    img {
      display: block;
      width: 100%;
      max-width: 900px;
    }
  }

  .maintenance-btn {
    margin-top: 290px;
    margin-left: 310px;
    position: absolute;

    .maintenance-cta {
      border: 2px solid #32e5e5;
      background: linear-gradient(96deg, #095c6f 0%, #00161b 100%);
      padding: 12px 60px;
      border-radius: 8px;
      color: #ffffff;
      text-decoration: none;
      font-size: 20px;
      font-weight: 500;

      &:hover {
        filter: brightness(0.8);
      }
    }
  }
}
</style>
