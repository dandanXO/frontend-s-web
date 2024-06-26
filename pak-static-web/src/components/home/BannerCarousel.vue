<template>
  <div class="banner-carousel-wrapper">
    <swiper-container ref="mainSwiperRef" class="main-swiper" navigation="true" autoplay-delay="2500" loop="true">
      <swiper-slide v-for="(banner, index) in banners" :key="`main-${index}`" class="main-swiper-slide">
        <a @click="gotoPromo(banner)">
          <div class="promo-bg isDesktop" :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'" />
        </a>
      </swiper-slide>
    </swiper-container>
    <!-- TODO: click action ? -->
    <!-- <swiper-container
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
        </a>
      </swiper-slide>
    </swiper-container> -->
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";

defineProps({
  banners: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["playGame"]);

const router = useRouter();

const mainSwiperRef = ref();
const paginationSwiperRef = ref();
const displayPaginationSwiper = ref(false);

const handlePaginationClick = (index) => {
  mainSwiperRef.value.swiper.slideTo(index);
  mainSwiperRef.value.swiper.slideTo(index);
};

const gotoPromo = (banner) => {
  const urlSplit = banner.redirectUrl.split("|");
  const gameSplit = urlSplit.map((part) => part.split("/"));

  if (urlSplit.length >= 2) {
    const type = urlSplit[0];
    if (type === "open") {
      if (gameSplit[1][0] === 'LuckySport') {
        emit(
          "playGame",
          gameSplit[1][0],
          gameSplit[1][1],
          '#/special/uefaeuro',
          gameSplit[1][3],
          gameSplit[1][4],
          gameSplit[1][5]
        );
      } else {
        emit(
          "playGame",
          gameSplit[1][0],
          gameSplit[1][1],
          gameSplit[1][2],
          gameSplit[1][3],
          gameSplit[1][4],
          gameSplit[1][5]
        );
      }
    } else if (type === "page") {
      router.push(`/${urlSplit[1]}`);
    } else {
      router.push(`/promotion?code=${banner.redirectUrl}`);
    }
  } else {
    if (banner.redirectUrl.includes("https://")) {
      window.open(banner.redirectUrl, "_blank");
    } else {
      router.push(`/promotion?code=${banner.redirectUrl}`);
    }
  }
};

// avoid loading 2 swiper at same time
onMounted(() => {
  // setTimeout(() => (displayPaginationSwiper.value = true), 300);
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
        border-radius: 10px;
        background-size: cover;
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
