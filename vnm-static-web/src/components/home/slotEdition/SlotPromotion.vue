<template>
  <div class="promotion-section">
    <HomeTitle :title="$t('home.slotEdition.promotion')" />
    <div class="promotion-list">
      <swiper
        :slides-per-view="promotions.length > 2 ? 3 : promotions.length"
        effect="fade"
        :allow-slide-next="true"
        :space-between="20"
      >
        <swiper-slide v-for="(promotion, index) in promotions" :key="index">
          <a class="promotion">
            <img :src="promotion.img" />
            <span>{{ promotion.text }}</span>
          </a>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script setup>
import HomeTitle from "@/atoms/HomeTitle.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import Promotion1 from "@/assets/images/home/slotEdition/promotion-1.png";
import Promotion2 from "@/assets/images/home/slotEdition/promotion-2.png";
import Promotion3 from "@/assets/images/home/slotEdition/promotion-3.png";

const { t } = useI18n();

const promotions = computed(() => [
  { img: Promotion1, text: "Quỹ cứu hộ điện tử siêu cao 20%" },
  { img: Promotion2, text: "Quỹ cứu hộ điện tử siêu cao 20%" },
  { img: Promotion3, text: "Quỹ cứu hộ điện tử siêu cao 20%" }
]);
</script>
<style lang="scss" scoped>
.promotion-section {
  max-width: 1300px;
  margin: 0 auto;
  .promotion-list {
    display: flex;
    gap: 20px;
    .promotion {
      display: block;
      padding: 12px;
      background-color: #fff;
      box-shadow: 0px 0px 10px 0px #0000001a;
      border-radius: 15px;
      img {
        max-width: 100%;
        margin-bottom: 12px;
        border-radius: 12px;
      }
      span {
        font-size: 28px;
        font-weight: 700;
        line-height: 40px;
        color: #424f72;
      }
    }
  }
}
</style>
