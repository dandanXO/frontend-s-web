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
          <a class="promotion" :title="promotion.title" @click="goToUrl(promotion.redirectUrl)">
            <img :src="imgURL + promotion.mobileImgUrl" />
            <span>{{ promotion.title }}</span>
          </a>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script setup>
import HomeTitle from "@/atoms/HomeTitle.vue";
import { onMounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { loadPromo } from "@/api/index/promo";
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
const router = useRouter();

const promotions = ref([]);

const getPromo = () => {
  loadPromo("SLOT").then((res) => {
    if (res.code === 0) {
      promotions.value = res.data.slice(0, 3);
    }
  });
};

const goToUrl = (redirectUrl) => {
  const urlSplit = redirectUrl.split("|");
  if (urlSplit.length >= 2) {
    const type = urlSplit[0];
    if (type === "page") {
      router.push(`/${urlSplit[1]}`);
    } else {
      router.push(`/promotion?name=${redirectUrl}`);
    }
  } else {
    const openPattern = /^\/open\/(.*)/;
    if (redirectUrl.match(openPattern)) {
      const extractedUrl = redirectUrl.match(openPattern)[1];
      const [gameName, platformCode, gameCode] = extractedUrl.split("/");

      allGames.value.open(gameName, platformCode, gameCode, "OPEN");
    } else if (redirectUrl.includes("https://")) {
      window.open(redirectUrl, "_blank");
    } else {
      router.push(`/promotion?name=${redirectUrl}`);
    }
  }
};

onMounted(getPromo);
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
      margin: 12px 0;
      background: url(@/assets/images/home/slotEdition/promotion-bg.png) no-repeat;
      background-size: cover;
      box-shadow: 0px 0px 10px 0px #0000001a;
      border-radius: 15px;
      img {
        display: block;
        max-width: 100%;
        margin: 0 auto 12px;
        border-radius: 12px;
      }
      span {
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 22px;
        font-weight: 700;
        line-height: 30px;
        color: #424f72;
      }
    }
  }
}
</style>
