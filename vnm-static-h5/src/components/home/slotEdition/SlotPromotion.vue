<template>
  <div class="promotion-wrapper">
    <div class="promotion-title">
      <img src="../../../assets/images/home/slotEdition/hot-promotion-icon.png" />
      {{ $t("lang.slotEdition.promotion") }}
    </div>
    <swiper :space-between="12" :slides-per-view="1.5" class="promotion-list">
      <swiper-slide v-for="(promotion, index) in promotions" :key="index">
        <a class="promotion-item" @click="gotoPromo(promotion)">
          <img :src="imgURL + promotion.mobileImgUrl" />
          <span>{{ promotion.title }}</span>
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/scrollbar";
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { api } from "src/boot/axios";
import { userStore } from "src/stores";

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
const router = useRouter();
const store = userStore();

const promotions = ref([]);

const getPromo = () => {
  const platformApiUrl = "/opt-session/promo/page";
  api.get(`${platformApiUrl}?siteType=SLOT`).then((res) => {
    if (res.code === 0) {
      promotions.value = res.data.slice(0, 3);
    }
  });
};

const gotoPromo = (banner) => {
  const urlSplit = banner.redirectUrl.split("|");
  if (urlSplit.length >= 2) {
    const type = urlSplit[0];
    if (type === "page") {
      router.push(`/${urlSplit[1]}`);
    } else {
      router.push(`/promo?name=${banner.redirectUrl}`);
    }
  } else {
    const openPattern = /^\/open\/(.*)/;
    if (banner.redirectUrl.match(openPattern)) {
      const extractedUrl = banner.redirectUrl.match(openPattern)[1];
      const [gameName, platformCode, gameCode] = extractedUrl.split("/");

      allGames.value.open(gameName, platformCode, gameCode, "OPEN");
    } else if (banner.redirectUrl.includes("https://")) {
      window.open(banner.redirectUrl, "_blank");
    } else {
      router.push(`/promo?name=${banner.redirectUrl}`);
    }
  }
};

onMounted(getPromo);
</script>
<style lang="scss" scoped>
.promotion-wrapper {
  width: calc(100% - 2rem);
  margin: 10px auto 10px;
  .promotion-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3rem;
    color: #333333;
    img {
      width: 22px;
    }
  }
  .promotion-list {
    .promotion-item {
      display: block;
      padding: 6px;
      // background-color: #fff;
      background: url(../../../assets/images/home/slotEdition/promotion-bg.png) no-repeat;
      background-size: cover;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.1rem;
      img {
        max-width: 100%;
        border-radius: 4px;
      }
      span {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
