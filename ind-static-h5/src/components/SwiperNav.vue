<template>
  <div class="swiper-container swiper-nav-container">
    <div class="swiper-wrapper">
      <div v-for="(e, i) in slideList" :key="`${e}-${i}`" class="swiper-slide">
        <div class="slide-item" @click="onSlideClick(e)" :class="{ 'active-slide': isActiveSlide(e) }">
          <img v-if="isActiveSlide(e)" class="slide-title-deco left" src="../assets/images/index/tab-title-deco.png" />
          <img v-if="isActiveSlide(e)" class="text-glow" src="../assets/images/index/text-glow.png" alt="" />
          <div :class="{ 'inactive-text': !isActiveSlide(e) }">
            {{ e }}
          </div>
          <img v-if="isActiveSlide(e)" class="slide-title-deco" src="../assets/images/index/tab-title-deco.png" />
        </div>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script setup>
import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import { onMounted } from "vue";

const props = defineProps(["slideList", "onSlideClick", "isActiveSlide"]);

onMounted(() => {
  const loopValue = props.slideList.length > 2;
  const swiperNav = new Swiper(".swiper-nav-container", {
    slidesPerView: 3,
    loop: loopValue,
    spaceBetween: 1,
    centeredSlides: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    }
  });
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
          &.left {
            transform: rotate(180deg);
          }
        }

        &.text-glow {
          position: absolute;
          width: 5rem;
        }
      }
      .inactive-text {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
