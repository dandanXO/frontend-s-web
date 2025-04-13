<template>
  <button class="common-btn" @click="$emit('click')">
    <slot />
  </button>
</template>
<script setup></script>
<style lang="scss">
.common-btn {
  display: block;
  width: 100%;
  aspect-ratio: 190 / 75;
  background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/common-btn.png) no-repeat;
  background-size: cover;
  border: none;
  font-size: 20px;
  font-weight: 700;
  color: #f9f9f9;
}

@media screen and (max-width: 375px) {
  .common-btn {
    font-size: 16px;
  }
}
</style>
