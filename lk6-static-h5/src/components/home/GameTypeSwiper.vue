<template>
  <swiper
    :modules="[Thumbs, Controller]"
    slides-per-view="3"
    :set-wrapper-size="true"
    :scrollbar="{ draggable: true }"
    :mousewheel="true"
    :space-between="8"
    watch-slides-progress
    class="first-swiper"
    centered-slides
    centered-slides-bounds
    slide-to-clicked-slide
    center-insufficient-slides
    @swiper="initSwiper"
  >
    <swiper-slide
      :class="tab.name && { tbact: selectedTab === tab.name }"
      @click="handleClick(tab)"
      v-for="(tab, i) in list"
      :key="i"
    >
      <div
        class="home-select-slide row items-center align-center justify-center gap-8"
        :class="selectedTab == tab.name ? 'selected' : ''"
        :style="`gap:${tab.gap}px`"
      >
        <img
          :style="`margin-top:${tab.mb}px;`"
          :src="require('../../assets/index/' + (selectedTab === tab.name ? tab.iconActive : tab.icon))"
        />
        <span>{{ tab.label }}</span>
      </div>
    </swiper-slide>
  </swiper>
</template>
<script setup>
// Import Swiper Vue.js components
import SwiperCore, { Keyboard, Mousewheel, HashNavigation, A11y, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs, Controller, Grid } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/scrollbar";
import { onMounted, ref, toRefs, watch } from "vue";
SwiperCore.use([Keyboard, Mousewheel, A11y, HashNavigation, Navigation, Pagination]);

const props = defineProps({
  list: Array,
  scrollToCenter: Boolean
});
const { scrollToCenter, list } = toRefs(props);

const emit = defineEmits(["select-swiper", "swiper"]);

const selectedTab = defineModel();

const swiperRef = ref(null);

const handleClick = (tab) => {
  selectedTab.value = tab.name;
  emit("select-swiper", tab);
};

const scrollSlide = () => {
  if (!scrollToCenter.value || !swiperRef.value) return;
  const index = list.value.findIndex((el) => el.name === selectedTab.value);
  if (index < 0) return;
  swiperRef.value.slideTo(index, 500);
};

const initSwiper = (swiper) => {
  swiperRef.value = swiper;
  emit("swiper", swiper);
};

onMounted(() => scrollSlide(selectedTab.value));

watch(selectedTab, scrollSlide);
</script>
<style lang="scss" scoped>
// :deep(.firstSwiper .swiper-wrapper) {
//   background: #fff;
// }

.first-swiper {
  background: url(../../assets/index/game-type-bg.png) no-repeat center center;
  background-size: 100% 100%;
  box-shadow: 0px 0px 5.5px 0px #c6d9ffab;
  border-radius: 30px;
  justify-content: flex-start;
  align-items: stretch;
  padding: 4px 5px;
  margin-bottom: 16px;
}

.home-select-slide {
  background: radial-gradient(103.75% 103.75% at 50% -3.75%, #ffffff 0%, #deecff 100%);
  border: 1.41px solid #ffffff;
  border-radius: 30px;
  align-items: center;
  padding: 2px 5px;
  min-height: 46px;
  margin: 5px 0;

  img {
    width: auto;
    max-width: 25px;
  }

  span {
    color: #35648f;
    font-weight: 600;
    font-size: 14px;
  }

  &.selected {
    background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);

    span {
      color: #fff;
    }
  }
}
</style>
