<template>
  <div class="swiper-container swiper-nav-container">
    <div class="swiper-wrapper">
      <div v-for="(e, i) in slideList" :key="`${e}-${i}`" class="swiper-slide">
        <div class="slide-item" @click="onSlideClick(e, i)" :class="{ 'active-slide': isActiveSlide(e) }">
          <img
            class="slide-title-deco left"
            :class="!isActiveSlide(e) && 'deco-hide'"
            src="../assets/images/index/tab-title-deco.png"
          />
          <img v-if="isActiveSlide(e)" class="text-glow" src="../assets/images/index/text-glow.png" alt="" />
          <div :class="{ 'inactive-text': !isActiveSlide(e) }">
            {{ e }}
          </div>
          <img
            class="slide-title-deco"
            :class="!isActiveSlide(e) && 'deco-hide'"
            src="../assets/images/index/tab-title-deco.png"
          />
        </div>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script setup>
import { onActivated, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import Swiper from "swiper";
import "swiper/swiper-bundle.css";

const props = defineProps(["slideList", "slideListPath", "isActiveSlide"]);
const router = useRouter();
const loopValue = props.slideList.length > 2;

const onSlideClick = (e, i) => {
  router.push(props.slideListPath[i]);
};

const swiperNav = ref(null);

const initializeSwiperNav = () => {
  swiperNav.value = new Swiper(".swiper-nav-container", {
    slidesPerView: 3,
    loop: loopValue,
    spaceBetween: 1,
    initialSlide: 0,
    centeredSlides: true,
    pagination: false
  });
};
const rebuildSwiper = () => {
  if (swiperNav.value) {
    swiperNav.value.destroy();
    initializeSwiperNav();
  }
};

onMounted(() => {
  initializeSwiperNav();
});

onActivated(() => {
  rebuildSwiper();
});
</script>

<style scoped lang="scss">
.swiper-nav-container {
  width: 100%;
  text-align: center;
  overflow: hidden;

  .swiper-wrapper {
    .slide-item {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      text-transform: capitalize;
      height: 5rem;
      gap: 0.5rem;

      img {
        width: 2.25rem;
        &.slide-title-deco {
          &.deco-hide {
            visibility: hidden;
          }
          &.left {
            transform: rotate(180deg);
          }
        }

        &.text-glow {
          position: absolute;
          width: 5rem;
          z-index: -1;
        }
      }
      .inactive-text {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
