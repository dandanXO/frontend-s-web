<template>
  <div class="promotion-wrapper">
    <div class="promotion-title">
      <img src="../../../assets/images/home/slotEdition/hot-promotion-icon.png" />
      {{ $t("lang.slotEdition.promotion") }}
    </div>
    <swiper :space-between="12" :slides-per-view="1.5" class="promotion-list">
      <swiper-slide v-for="(promotion, index) in promotions" :key="index">
        <a class="promotion-item">
          <img :src="promotion.img" />
          {{ promotion.text }}
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/scrollbar";

defineProps({
  promotions: Array
});
</script>
<style lang="scss" scoped>
.promotion-wrapper {
  width: calc(100% - 2rem);
  margin: 10px auto 10px;
  .promotion-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3rem;
    color: #333333;
    img {
      width: 22px;
    }
  }
  .promotion-list {
    .promotion-item {
      display: block;
      padding: 6px;
      background-color: #fff;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.1rem;
      img {
        max-width: 100%;
        border-radius: 4px;
      }
    }
  }
}
</style>
