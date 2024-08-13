<template>
  <div class="maintenance-container">
    <div class="maintenance-details">
      <div class="maintenance-logo">
        <img src="../assets/logo.svg" />
      </div>
      <div class="maintenance-title" v-html="$t('maintenance.title')"></div>
      <div class="maintenance-desc" v-html="$t('maintenance.desc')"></div>
      <div class="maintenance-contact">
        <a
          :href="`https://csweb01.amv4xjcbd.com/?partnerId=12&way=WEB&lang=${languageVal}`"
          class="email"
          target="_blank"
        >
          {{ $t("maintenance.customerService") }}
        </a>
        <a href="https://t.me/cityy88" class="email" target="_blank">Telegram: @cityy88</a>
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
import { i18nStore } from "@/store/language";
import { storeToRefs } from "pinia";

const i18nStoreLanguage = i18nStore();
const { languageVal } = storeToRefs(i18nStoreLanguage);
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

  .maintenance-contact {
    display: flex;
    flex-direction: column;
    font-size: 20px;
  }
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
</style>
