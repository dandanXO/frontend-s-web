<template>
    <div class="congrats-container">
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <div class="congrats-header"><img src="../../../assets/images/index/modal/congrats-header.png" /></div>
      <div class="congrats-coupons">
        <img class="light-source" src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/light-source.png" />
        <div class="congrats-highlight">
            <img class="money-icon" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/money-pile-icon.png"/>
            <svg class="gradient-amount-wrapper" preserveAspectRatio='xMinYMin' xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradientAmount" gradientTransform="rotate(90)">
                        <stop offset="0%"  stop-color="#FDEE4F"/>
                        <stop offset="100%" stop-color="#FF953E"/>
                    </linearGradient>
                </defs>
                <text id="test"  x="0" y="43" class="amount">300</text>
            </svg>
        </div>
    </div>

      <div class="congrats-title">{{ $t("hotPromo.referWheel.withdrawSuccessfully") }}</div>

      <div class="congrats-button">
        <router-link to="/promo?name=bgd-register-claim-bonus">
          <q-btn no-caps unelevated class="recharge-btn" :loading="false">
            {{ $t("hotPromo.referWheel.recharge") }}
          </q-btn>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup></script>
  
  <style lang="scss" scoped>

.gradient-amount-wrapper {
    max-height: 55px;
    max-width: 100px;

    .amount {
        font-size: 50px;
        fill:url(#gradientAmount);
        text-shadow: 3px 3px #A00022;
        font-family: 'Poppins';
        font-weight: 700;
    }
}
  .congrats-button {
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .congrats-wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  .congrats-container {
    background-color: #1e371f;
    border: 1px solid #337e3a;
    border-radius: 10px !important;
    max-width: 400px;
    width: 100%;
    padding: 16px;
    position: relative;
    overflow: visible;
    border-radius: 12px;
  
    &:before {
      content: "";
      background-image: url(../../../assets/images/index/modal/congrats-container-light.png);
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
      }
    }
  
    .congrats-coupons {
      .light-source {
        display: block;
        width: 100%;
        margin: auto;
        max-width: 300px;
      }
    }
  
    .congrats-title {
      color: #ffffff;
      display: flex;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
    }
  
    .congrats-highlight {
      color: #fff96f;
      font-size: 45px;
      text-align: center;
      background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
      padding: 0 12px;
      background-repeat: no-repeat;
      background-size: 70% 100%;
      background-position: center;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      gap: 10px;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px 0;

        .money-icon {
            width: 80px;
        }
    }
  }
  
  .congrats-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .recharge-btn {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #000a01;
  }
  </style>
  