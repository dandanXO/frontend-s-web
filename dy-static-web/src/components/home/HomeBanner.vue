<template>
    <div v-if="isLoadingBanners" class="loading">
        <img class="loading-img" src="../../assets/logo.png" />
    </div>
    <el-carousel v-else class="banner-slider" height="25vw" arrow="always">
      <el-carousel-item class="banner-container" v-for="banner in banners" :key="banner" style="cursor:pointer;">
        <a @click="props.goBannerPage(banner.redirectUrl)">
          <div
            v-if="banner && banner.desktopImageUrl"
            class="promo-bg isDesktop"
            :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'"
          ></div>
          <div
            v-if="banner && banner.mobileImageUrl"
            class="promo-bg isMobile"
            :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"
          ></div>
        </a>
      </el-carousel-item>
    </el-carousel>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadPromoBanner } from "@/api/index/promo";
import { useLocalStorage } from "@vueuse/core";

const props = defineProps(['goBannerPage']);
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
const banners = ref([]);
const isLoadingBanners = ref(false);

const loadBanners = () => {
    isLoadingBanners.value = true;
  loadPromoBanner("HOME").then((res) => {
    isLoadingBanners.value = false;

    if (res.code === 0) {
      banners.value = res.data.filter(item => item.showDesktop === true);
    }
  }).catch(() => {
    isLoadingBanners.value = false;
  }).finally(() => {
    isLoadingBanners.value = false;
  });
};

onMounted(() => {
  loadBanners();
});
</script>

<style lang="scss" scoped>
.loading {
    height:25vw;
    display:flex;
    justify-content:center;
    align-items:center;
    font-family: 'PingFang SC';

    .loading-img {
        animation-name: fade-in-out;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        width: 100px;
    }
}

@keyframes fade-in-out{
  0%{
    opacity: 1;
  }
   50%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
</style>