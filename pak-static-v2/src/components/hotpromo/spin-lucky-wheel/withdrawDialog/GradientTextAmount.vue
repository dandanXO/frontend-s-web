<template>
    <div class="gradient-amount-wrapper" :class="{ longText: isLongText }">
      <svg class="prize" width="100%" :height="isLongText ? 50 : 60" style="" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradientAmountBlue" gradientTransform="rotate(90)">
            <stop offset="0%" stop-color="#49B9FF" />
            <stop offset="100%" stop-color="#49B9FF" />
          </linearGradient>
        </defs>
        <text
          id="test"
          class="amount"
          :class="{ longText: isLongText }"
          x="50%"
          y="55%"
          dominant-baseline="middle"
          text-anchor="middle"
        >
          {{ props?.amountText }}
        </text>
      </svg>
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  const props = defineProps(["amountText"]);
  const isLongText = computed(() => props?.amountText?.length > 10);
  </script>
  
  <style lang="scss" scoped>
  .gradient-amount-wrapper {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  
    &.longText {
      height: 50px;
    }
  
    .amount {
      font-size: 30px;
      font-weight: 900;
      fill: url(#gradientAmountBlue);
      text-shadow: 1px 3px #fff;
      letter-spacing: -1px;
  
      &.longText {
        font-size: 26px;
        letter-spacing: -1px;
      }
    }
  }
  
  @media screen and (max-width: 400px) {
    .gradient-amount-wrapper {
      .amount {
        font-size: 40px;
  
        &.longText {
          font-size: 22px;
          letter-spacing: -1px;
        }
      }
    }
  }
  
  @media screen and (max-width: 350px) {
    .gradient-amount-wrapper {
      .amount {
        font-size: 30px;
  
        &.longText {
          font-size: 18px;
          letter-spacing: -1px;
        }
      }
    }
  }
  </style>
  