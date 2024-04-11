<template>
  <div class="maintenance-container">
    <div class="maintenance-img">
      <img :src="require('../assets/images/maintenance/maintenance-img.png')" />
    </div>
    <div class="maintenance-details">
      <div class="maintenance-logo">
        <img src="../assets/logo-web.svg" />
      </div>
      <div class="maintenance-title">{{ $t("lang.maintenance_title") }}</div>
      <div class="maintenance-desc">
        {{ $t("lang.maintenance_from") }}
        <br />
        {{ $t("lang.maintenance_to") }}
        <br />
        {{ $t("lang.maintenance_desc_01") }}
        <br />
        {{ $t("lang.maintenance_desc_02") }}
      </div>
    </div>
    <!-- <div class="maintenance-btn">
      <router-link to="/home" class="maintenance-cta">返回主页</router-link>
    </div> -->
  </div>
</template>

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
    font-family: PingFang SC;
    color: #4c88f8;
    font-size: 30px;
    font-weight: 600;
  }

  .maintenance-desc {
    margin-top: 10px;
    font-family: PingFang SC;
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
