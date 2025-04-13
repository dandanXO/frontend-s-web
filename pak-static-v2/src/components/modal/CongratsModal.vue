<template>
  <!-- <div class="congrats-wrapper"> -->
  <div class="congrats-container">
    <q-btn icon="close" round dense v-close-popup class="congrats-close" />
    <div class="congrats-header"><img src="../../assets/images/index/modal/congrats-header.png" /></div>
    <div class="congrats-coupons"><img src="../../assets/images/index/modal/congrats-coupons.png" /></div>
    <div class="congrats-title">Get a free lucky draw ticket</div>
    <div class="congrats-highlight">Download the app and log in to your account to get it</div>

    <div class="congrats-button">
      <q-btn no-caps unelevated class="btn-primary" :loading="false" :href="ui.downloadAppUrl">
        {{ $t("btn.downloadNow") }}
      </q-btn>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup>
import { useUI } from "stores/ui";
const ui = useUI();
</script>

<style lang="scss" scoped>
.congrats-button {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
}
.congrats-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.congrats-container {
  background: linear-gradient(180deg, #FFFFFF 0%, #D5E6FF 100%);
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;

  &:before {
    content: "";
    background-image: url(../../assets/images/index/modal/congrats-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: -150px;
  }

  .congrats-header {
    display: flex;
    justify-content: center;
    margin-top: -18px;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      max-width: 320px;
      height: 60px;
    }
  }

  .congrats-coupons {
    img {
      display: block;
      width: 100%;
      margin: auto;
      max-width: 240px;
    }
  }

  .congrats-title {
    color: #458bff;
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
  }

  .congrats-highlight {
    color: #004798;
    font-size: 16px;
    text-align: center;
    background-image: url(../../assets/images/index/modal/congrats-highlight-bg.png);
    padding: 8px 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    margin-top: 16px;
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);

  :deep(.q-icon) {
    color: #333;
  }
}
</style>
