<template>
  <el-dialog
    @close="setWithExpiry('isImpt', true, 43200000)"
    class="imptann-modal"
    v-model="isImportantAnnoucementModal"
    v-if="!isImpt"
  >
    <img :src="homePopupImg" class="alert-img" />
  </el-dialog>

  <el-carousel
    class="banner-slider"
    indicator-position="outside"
    arrow="never"
    :autoplay="false"
  >
    <el-carousel-item
      class="banner-container"
      v-for="banner in banners"
      :key="banner"
    >
      <router-link :to="`/promotion?name=${banner.redirectUrl}`">
        <div
          class="promo-bg isDesktop"
          :style="
            'background-image: url(' + imgURL + banner.desktopImageUrl + ')'
          "
        ></div>
        <div
          class="promo-bg isMobile"
          :style="
            'background-image: url(' + imgURL + banner.mobileImageUrl + ')'
          "
        ></div>
      </router-link>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadPromoBanner } from "@/api/index/promo";

const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";
const banners = ref([
  {
    src: "83ac7ea8-c77d-4cf0-976a-7f1a5e1b0027.png"
  },
  {
    src: "9ba30f5e-162a-429e-a811-ad918c958fbd.jpg"
  }
]);

const loadBanners = () => {
  loadPromoBanner("HOME").then((res) => {
    if (res.code === 0) banners.value = res.data;
  });
};

const setWithExpiry = (key, value, interval) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + interval
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const isImpt = getWithExpiry("isImpt");

const isFirstView = ref(false);
const homePopupImg = ref("");
const isImportantAnnoucementModal = ref(false);
const checkShowImgTop = () => {
  const lastTime = localStorage.getItem("indexImgTop");
  if (lastTime) {
    const diff = new Date().getTime() - Number(lastTime);
    if (diff > 1000 * 60 * 60 * 12) isFirstView.value = true;
  } else {
    loadPromoBanner("HOMEPOP")
      .then((res) => {
        const { code, data } = res;
        if (code === 0) {
          if (data.length > 0) {
            if (isImpt === null) {
              isImportantAnnoucementModal.value = true;

              homePopupImg.value =
                data.length > 0 ? imgURL + data[0]["desktopImageUrl"] : "";
              if (homePopupImg.value) isFirstView.value = true;
            }
          } else {
            isImportantAnnoucementModal.value = false;
          }
        }
      })
      .catch(() => {});
  }
};

onMounted(() => {
  loadBanners();
  checkShowImgTop();
});
</script>

<style scoped lang="scss">
.banner-slider {
  width: 100%;

  .banner-container {
    .promo-bg {
      background-image: url(../../assets/images/mock/home_banner.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: top center;

      &.isDesktop {
        display: block;
        width: 100%;
        height: 100%;
      }

      &.isMobile {
        display: none;
        height: 100%;
      }
    }
  }
}

.imptann-modal {
  max-width: 800px;

  .el-dialog__body {
    padding: 0;
  }

  .alert-img {
    display: block;
    width: 100%;
  }

  .el-dialog__headerbtn {
    opacity: 0;
  }
}
</style>
