<template>
  <swiper
    :modules="[Thumbs, Controller]"
    slides-per-view="auto"
    :set-wrapper-size="true"
    :scrollbar="{ draggable: true }"
    :mousewheel="true"
    :space-between="8"
    :breakpoints="{
      0: {
        slidesPerView: 5.5,
        spaceBetween: 8
      },
      380: {
        slidesPerView: 5.5,
        spaceBetween: 8
      },
      440: {
        slidesPerView: 5.5,
        spaceBetween: 8
      }
    }"
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
        class="home-select-slide column items-center justify-center gap-3"
        :class="selectedTab == tab.name ? 'selected' : ''"
        :style="`gap:${tab.gap}px`"
      >
        <img :style="`margin-top:${tab.mb}px;`" :src="require('../../assets/index/' + tab.icon)" />
        <span>{{ selectedTab !== tab.name ? tab.label : tab.labelact }}</span>
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
:deep(.firstSwiper .swiper-wrapper) {
  background: #fff;
}

.first-swiper {
  background: #fff;
  justify-content: flex-start;
  align-items: stretch;
}

.home-select-slide {
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  align-items: center;
  padding: 2px 5px;
  min-height: 46px;
  margin: 5px 0;

  img {
    width: auto;
  }

  span {
    color: #35648f;
    font-weight: 500;
    font-size: 12px;
  }

  &.selected {
    background: linear-gradient(180deg, #7dd4fd 0, #4c9dec 100%);

    span {
      color: #fff;
    }

    img {
      filter: brightness(0) invert(1);
    }
  }
}
</style>
