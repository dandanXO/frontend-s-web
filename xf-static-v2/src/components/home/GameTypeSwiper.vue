<template>
   <!-- :breakpoints="{
      0: {
        slidesPerView: 4.5,
        spaceBetween: 8
      },
      380: {
        slidesPerView: 4.5,
        spaceBetween: 8
      },
      440: {
        slidesPerView: 4.5,
        spaceBetween: 8
      }
    }" -->
  <swiper
    :modules="[Thumbs, Controller]"
    slides-per-view="auto"
    :set-wrapper-size="true"
    :scrollbar="{ draggable: true }"
    :mousewheel="true"
    :space-between="4"
    :slidesPerView="4.5"
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
        class="home-select-slide"
        :class="selectedTab == tab.name ? 'selected' : ''"
      >
        <!-- <img :style="`margin-top:${tab.mb}px;`" :src="require('../../assets/images/index/' + tab.icon)" /> -->
        <img :src="require(`../../assets/images/index/menu-icon-${tab.icon}.png`)" />
        <span>{{ selectedTab !== tab.name ? tab.label : tab.labelact }}</span>
      </div>
    </swiper-slide>
  </swiper>

  <!-- <pre>tab---{{ list }}</pre> -->
   <!-- <pre>selectedTab---{{selectedTab}}</pre> -->
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
  // background: #fff;
  // background: salmon;

}

.first-swiper {
  // background: #fff;
  background: #00bfd71a;
  justify-content: flex-start;
  align-items: stretch;
  // backdrop-filter: blur(4px);

  // box-shadow: 0px 2px 2px 0px #0000001A;

  box-shadow: 0px 0px 4px 0px #ffffff40 inset;
  border-radius: 12px;
  padding: 4px 8px;
}

.home-select-slide {
  // box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
  align-items: center;
  padding: 2px 12px;
  min-height: 32px;
  margin: 5px 0;
  border-radius: 12px;
  display: flex;
  // flex-wrap: nowrap;
  gap: 6px;

  img {
    // width: auto;
    width: 20px;
  }

  span {
    color: #748591;
    font-weight: 700;
    font-size: 14px;
    white-space: nowrap;
  }

  &.selected {
    // background: linear-gradient(180deg, #7dd4fd 0, #4c9dec 100%);
    background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
    box-shadow: 0px 0px 4px 0px #ffffff inset;

    span {
      color: #fff;
    }

    img {
      filter: brightness(0) invert(1);
    }
  }
}
</style>
