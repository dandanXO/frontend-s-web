<template>
    <!-- <div class="congrats-wrapper"> -->
    <div class="congrats-container">
      <div v-if="$slots.controller" class="controller-wrapper">
        <slot name="controller" />
      </div>
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <!-- <div class="congrats-header"><img src="../../../assets/images/index/modal/congrats-header.png" /></div> -->
      <!-- <div class="congrats-coupons"><img src="../../../assets/images/promotion/hotpromo/jackpot-aviator/prize.png" /></div> -->
      <!-- <div class="congrats-title">{{ props?.claimPrizeAmt }}</div> -->
      <div class="congrats-highlight">{{ store.currency.value }} {{ props?.claimPrizeAmt }}</div>
  
      <div class="congrats-button" @click="props?.onClickClose">
        <q-btn no-caps unelevated class="button-bg" :loading="false">
          {{ $t("btn.recharge") }}
        </q-btn>
      </div>
    </div>
    <!-- </div> -->
  </template>
  
  <script setup>
  import { useUI } from "stores/ui";
  import { userStore } from "stores/index";

  const ui = useUI();
  const store = userStore();
  const props = defineProps(['claimPrizeAmt', 'onClickClose']);
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
    // background-color: #113413;
      background-image: url(../../../assets/images/index/modal/aviator-grats-bg.png);
      background-size: contain;
    max-width: 400px;
    min-height: 600px;
    width: 100%;
    padding: 16px;
    position: relative;
    overflow: visible;
    border-radius: 12px;
  
    // &:before {
    //   content: "";
    //   background-image: url(../../../assets/images/index/modal/congrats-container-light.png);
    //   background-size: 100% 100%;
    //   background-position: center center;
    //   background-repeat: no-repeat;
    //   width: 100%;
    //   height: 150px;
    //   position: absolute;
    //   left: 0;
    //   top: -150px;
    // }
  
    .congrats-header {
      display: flex;
      justify-content: center;
      margin-top: -18px;
      z-index: 2;
  
      img {
        display: block;
        width: 100%;
        max-width: 320px;
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
      color: #ffffff;
      display: flex;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
    }
  
    
.congrats-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 3%;
  display: flex;  
  justify-content: center;
  align-items: center;
  width: 80%;

  .button-bg {
    background: url(../../../assets/images/index/modal/aviator-btn.png) center center no-repeat;
    background-size: 100% 100%;
    aspect-ratio: 389/139;
    color: #ffffff;
    font-weight: bold;
    width: 70%;
    font-size: 23px;
    padding-bottom: 25px;
  }
}
  .congrats-highlight {
      // color: #fff96f;
      // font-size: 26px;
      // font-weight: bold;
      // text-align: center;
      // background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
      padding: 15px 12px;
      // background-repeat: no-repeat;
      // background-size: 70% 100%;
      // background-position: center;
      // margin-top: 16px;
      background: unset;
      position: absolute;
      top: 67%;
      font-size: 45px;
      font-weight: 900;
      text-align: center;
      font-family: "Poppins";
      left: 0;
      right: 0;
      margin: auto;
      color: #FF3F1C;
      text-shadow: 0px 0.9px #FFFFFF;
    }
    .controller-wrapper {
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
    }
  }
  
  .congrats-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.1);
  }
  </style>
  