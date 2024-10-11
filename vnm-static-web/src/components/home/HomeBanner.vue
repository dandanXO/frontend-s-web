<template>
  <el-dialog
    @close="setWithExpiry('isImpt', true, homePopupFrequencyNum)"
    class="imptann-modal"
    v-model="isImportantAnnoucementModal"
    v-if="!isImpt"
    width="820px"
  >
    <SitePopout />
    <!-- <a :href="homePopupPath" :target="homePopupPath.includes('https://') ? '_blank' : '_self'">
      <img :src="homePopupImg" class="alert-img" />
    </a> -->
  </el-dialog>

  <div v-if="isFetchingBanners" class="banner-placeholder">
    <h1>{{ $t("common.loading") }}...</h1>
  </div>
  <el-carousel
    v-else
    class="banner-slider"
    :class="ui.edition"
    indicator-position="outside"
    :autoplay="true"
    :interval="5000"
  >
    <el-carousel-item class="banner-container" v-for="banner in banners" :key="banner">
      <a @click="goToUrl(banner.redirectUrl)">
        <div class="promo-bg isDesktop" :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'"></div>
      </a>
    </el-carousel-item>
  </el-carousel>
  <GameModal ref="allGames"></GameModal>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { loadPromoBanner, loadHomePopup } from "@/api/index/promo";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import SitePopout from "@/components/modal/SitePopout.vue";
import { uiStore } from "@/store/ui";
import { EDITION } from "@/constant/edition";
const GameModal = defineAsyncComponent(() => import("@/components/modal/GameModal.vue"));

const router = useRouter();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
const banners = ref([]);
const ui = uiStore();
const isFetchingBanners = ref(false);

const allGames = ref(null);
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

const loadBanners = () => {
  let params = "";
  switch (ui.edition) {
    case EDITION.SLOT:
      params = "SLOT";
      break;
    case EDITION.NORMAL:
    default:
      params = "HOME";
  }

  isFetchingBanners.value = true;
  loadPromoBanner(params)
    .then((res) => {
      isFetchingBanners.value = false;
      if (res.code === 0) {
        banners.value = res.data;
      } else {
        ElMessage.error({
          type: "error",
          message: res.message
        });
      }
    })
    .catch(() => {
      isFetchingBanners.value = false;
    })
    .finally(() => {
      isFetchingBanners.value = false;
    });
};

const setWithExpiry = (key, value, interval) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + interval,
    id: homePopupId.value,
    frequency: homePopupFrequency.value
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
const homePopupPath = ref("");
const isImportantAnnoucementModal = ref(false);
const homePopupFrequency = ref(0);
const homePopupFrequencyNum = ref(0);
const homePopupContent = ref("");
const homePopupType = ref("");
const homePopupId = ref(0);

const checkShowImgTop = () => {
  const lastTime = localStorage.getItem("indexImgTop");
  if (lastTime) {
    const diff = new Date().getTime() - Number(lastTime);
    if (diff > 1000 * 60 * 60 * 12) isFirstView.value = true;
  } else {
    let params;
    switch (ui.edition) {
      case EDITION.SLOT:
        params = "SLOT";
        break;
      case EDITION.NORMAL:
      default:
      // params = "HOME";
    }

    if (isImpt === null) {
      loadHomePopup(params)
        .then((res) => {
          const { code, data } = res;
          if (code === 0) {
            switch (data["frequency"]) {
              case "EVERYTIME":
                homePopupFrequencyNum.value = 0;
                break;
              case "EVERYDAY":
                homePopupFrequencyNum.value = 86400000; // 24hrs
                break;
              case "SESSION":
                homePopupFrequencyNum.value = 7866432000; // 3months
                break;
              default:
                homePopupFrequencyNum.value = 10000;
                break;
            }
            isImportantAnnoucementModal.value = true;
            if (data["path"].includes("https://")) {
              homePopupPath.value = data["path"];
            } else {
              homePopupPath.value = "/promotion?name=" + data["path"];
            }
            homePopupImg.value = imgURL + data["desktopImgUrl"];
            homePopupContent.value = data["content"];
            homePopupType.value = data["type"];
            homePopupId.value = data["id"];
            homePopupFrequency.value = data["frequency"];
            isFirstView.value = true;
          }
        })
        .catch(() => {});
    }
  }
};

onMounted(() => {
  loadBanners();
  checkShowImgTop();
});
</script>

<style scoped lang="scss">
.banner-placeholder {
  width: 1920px;
  height: 568px;
  width: 100%;
  //background-color:#e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-slider {
  width: 100%;

  .banner-container {
    .promo-bg {
      // background-image: url(../../assets/images/mock/home_banner.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: top center;

      &.isDesktop {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.imptann-modal {
  background: transparent;
  max-width: 1300px;
  position: fixed !important;
  left: 50%;
  width: max-content;
  height: auto;
  margin-top: 25% !important;
  transform: translate(-50%, -50%);

  &.el-dialog {
    // --el-dialog-width: 35%;
  }

  .el-dialog__body {
    padding: 20px !important;
    border-radius: 12px;
  }

  .el-dialog__headerbtn {
    background: #ffffff99;
    border: 1px solid #ffffffb3;
  }

  .el-dialog__close {
    color: #2792fd !important;
  }

  .alert-img {
    display: block;
    width: 100%;
    border-radius: 12px;
  }
}
</style>
