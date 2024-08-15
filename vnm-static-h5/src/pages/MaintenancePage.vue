<template>
  <div class="maintenance-container">
    <div class="maintenance-logo">
      <img src="../assets/logo-web.svg" />
    </div>
    <div class="maintenance-img">
      <img :src="require('../assets/images/maintenance/maintenance-img.png')" />
    </div>
    <div class="maintenance-details">
      <div class="maintenance-title">{{ $t("lang.maintenance_title") }}</div>
      <div class="maintenance-desc">
        {{ $t("lang.maintenance_from") }} {{ ui.maintenanceStartTime }}
        <br />
        {{ $t("lang.maintenance_to") }} {{ ui.maintenanceEndTime }}
        <br />
        {{ $t("lang.maintenance_desc_01") }}
        <br />
        {{ $t("lang.maintenance_desc_02") }}
      </div>

      <div class="maintenance-contact">
        <div class="contact-item">
          <div class="contact-img"><img src="../assets/images/home/float-cs-02.png" /></div>
          <div>
            {{ $t("lang.maintenance_contact_01") }}
            <a href="mailto:vnsupport@tf88.com">vnsupport@tf88.com</a>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-img"><img src="../assets/images/home/float-cs-01.png" /></div>
          <div>
            <!-- <router-link to="/liveChat">24/7 Customer Service</router-link> -->
            <a href="https://csweb01.amv4xjcbd.com/?partnerId=7&way=WEB&lang=vn" target="_blank">
              {{ $t("lang.maintenance_contact_02") }}
            </a>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-img"><img src="../assets/images/home/float-cs-04.png" /></div>
          <div>
            {{ $t("lang.maintenance_contact_03") }}
            <a href="https://t.me/TF88_CS" target="_blank">@TF88_CS</a>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="maintenance-btn">
      <router-link to="/home" class="maintenance-cta">返回主页</router-link>
    </div> -->
  </div>
</template>

<script setup>
import { useUI } from "src/stores/ui";
const ui = useUI();
</script>
<style lang="scss">
.maintenance-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-image: url("../assets/images/maintenance/main-bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  flex-direction: column;
  padding: 20px;
  padding-top: 45px;

  .maintenance-contact {
    margin-top: 24px;

    .contact-item {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;

      a {
        // text-decoration: underline;
        color: #4c88f8;
      }
    }
    .contact-img {
      img {
        width: 24px;
        display: block;
      }
    }
  }

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
    color: #424f72;
    font-size: 30px;
    font-weight: 600;
    text-align: center;
  }

  .maintenance-desc {
    margin-top: 10px;
    color: #858585;
    font-size: 18px;
    line-height: 1.6;
    font-weight: 500;
  }

  .maintenance-img {
    //margin-left: 30px;
    img {
      display: block;
      width: 65%;
      margin: 10px auto;
      max-width: 450px;
    }
  }
}
</style>
