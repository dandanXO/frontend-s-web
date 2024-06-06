<template>
  <div class="banner-carousel-wrapper">
    <swiper-container ref="mainSwiperRef" class="main-swiper" navigation="true" autoplay-delay="2500">
      <swiper-slide v-for="(banner, index) in banners" :key="`main-${index}`" class="main-swiper-slide">
        <router-link :to="`/promotion${banner.redirectUrl}`">
          <div class="promo-bg isDesktop" :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'" />
          <!-- <div class="promo-bg isMobile" :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'" /> -->
        </router-link>
      </swiper-slide>
    </swiper-container>
    <!-- TODO: click action ? -->
    <swiper-container
      v-if="displayPaginationSwiper"
      ref="paginationSwiperRef"
      class="pagination-swiper"
      :space-between="30"
      :slides-per-view="3"
      free-mode="true"
    >
      <swiper-slide v-for="(banner, index) in banners" :key="`pagination-${index}`" class="pagination-swiper-slide">
        <a @click="handlePaginationClick(index)">
          <div class="promo-bg isDesktop" :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'" />
          <!-- <div class="promo-bg isMobile" :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'" /> -->
        </a>
      </swiper-slide>
    </swiper-container>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref } from "vue";

const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";

defineProps({
  banners: {
    type: Array,
    default: () => []
  }
});

const mainSwiperRef = ref();
const paginationSwiperRef = ref();
const displayPaginationSwiper = ref(false);

const handlePaginationClick = (index) => {
  mainSwiperRef.value.swiper.slideTo(index);
  mainSwiperRef.value.swiper.slideTo(index);
};

// avoid loading 2 swiper at same time
onMounted(() => {
  setTimeout(() => (displayPaginationSwiper.value = true), 300);
});
</script>
<style scoped lang="scss">
.banner-carousel-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;

  .main-swiper {
    &::part(button-prev),
    &::part(button-next) {
      padding: 42px 6px;
      background-color: #17192599;
      color: #ffffff;
      --swiper-navigation-sides-offset: 0;
    }

    &::part(button-prev) {
      border-radius: 0px 20px 20px 0px;
    }

    &::part(button-next) {
      border-radius: 20px 0px 0px 20px;
    }

    .main-swiper-slide {
      .promo-bg {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;

        &.isDesktop {
          display: block;
          height: auto;
          aspect-ratio: 1560/490;
        }
      }
    }
  }

  .pagination-swiper {
    height: 229px;
    background: #14461333;
    backdrop-filter: blur(5px);
    padding: 54px 33px 29px;
    margin-top: -136px;
    width: 100%;

    .pagination-swiper-slide {
      .promo-bg {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;

        &.isDesktop {
          display: block;
          height: 100%;
        }
      }
    }
  }
}
</style>
