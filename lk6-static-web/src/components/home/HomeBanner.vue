<template>
  <el-dialog
    @close="setWithExpiry('isImpt', true, 43200000)"
    class="imptann-modal"
    v-model="isImportantAnnoucementModal"
    v-if="!isImpt"
    align-center
  >
    <div style="position: relative">
      <SitePopout @popup-click="clickHomePopupImg" :onShow="() => setWithExpiry('isImpt', true, 43200000)" />
      <img class="close-btn" src="../../assets/images/home/site-popout/close-btn.png" alt="" @click="handleClose" />
    </div>
  </el-dialog>
  
  <div v-if="isFetchingBanners" class="banner-loading">
    <img class="loading-img" src="@/assets/lucky-6-logo.png" />
  </div>

  <transition name="stomp">
    <el-carousel
      v-if="!isFetchingBanners && banners?.length"
      class="banner-slider"
      indicator-position="outside"
      :autoplay="true"
      :interval="5000"
    >
      <el-carousel-item class="banner-container" v-for="banner in banners" :key="banner">
        <a @click="goBannerPage(banner.redirectUrl)">
          <div class="banner-background">
            <div
              class="promo-bg isDesktop"
              :style="
                'background-image: url(' +
                imgURL + banner.desktopImageUrl +
                ')'
              "
            ></div>
          </div>
        </a>
      </el-carousel-item>
    </el-carousel>
  </transition>
  <GameModal ref="allGames"></GameModal>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { loadPromoBanner, loadHomePopups } from "@/api/index/promo";
import { useDark, useLocalStorage } from "@vueuse/core";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import GameModal from "@/components/modal/GameModal.vue";
import { useNotify } from "@/hooks/notify";
import SitePopout from "@/components/modal/SitePopout.vue";

const emit = defineEmits(["scrollToView"]);

const notify = useNotify();

const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
const banners = ref([]);

const isDark = useDark();
const store = userStore();
const router = useRouter();
const isFetchingBanners = ref(false);

const allGames = ref(null);
const goBannerPage = (redirectUrl) => {
  console.log("goBannerPage", redirectUrl);
  const openPattern = /^\/open\/(.*)/;
  if (redirectUrl.match(openPattern)) {
    const extractedUrl = redirectUrl.match(openPattern)[1];
    const [gameName, platformCode, gameCode] = extractedUrl.split("/");

    allGames.value.open(gameName, platformCode, gameCode, "OPEN");
    return;
  } else if (redirectUrl == "app://deposit") {
    router.push("/center/deposit");
  } else if (redirectUrl === "livestream") {
    emit("scrollToView", "livestream");
  } else {
    router.push(`/promotion?name=${redirectUrl}`);
  }
};

const handleClose = () => {
  isImportantAnnoucementModal.value = false;
};

const loadBanners = () => {
  isFetchingBanners.value = true;

  loadPromoBanner("HOME")
    .then((res) => {
      isFetchingBanners.value = false;
      if (res.code === 0) {
        banners.value = res.data.filter((promo) => {
          if (!promo.showDesktop) return false;
          return true;
        });
        //No Need liao.
        // if (store.token && (store.memberType === "TEST" || store.memberType === "PROMO_TEST")) {
          //   banners.value.unshift({
            //     category: "HOME",
        //     isLocal: true,
        //     promoPageId: null,
        //     redirectUrl: "lh1-im-sport"
        //   });
        // }
      } else
      notify({
        type: "error",
        message: res.message
      });
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

const popupList = ref([]);
const isFirstView = ref(false);
const isImportantAnnoucementModal = ref(false);
const homePopupFrequencyNum = ref(0);

const clickHomePopupImg = (urlString) => {
  isImportantAnnoucementModal.value = false;

  const openPattern = /^\/open\/(.*)/;
  if (urlString.match(openPattern)) {
    const extractedUrl = urlString.match(openPattern)[1];
    const [gameName, platformCode, gameCode] = extractedUrl.split("/");

    allGames.value.open(gameName, platformCode, gameCode, "OPEN");
    return;
  }

  // debugger;
  let regexUrl = new RegExp(/^(https:\/\/)/g);
  if (regexUrl.test(urlString)) {
    // 跳轉
    location.href = urlString;
    return;
  }
  let regexName = new RegExp(/^(name|\?name)/g);
  if (regexName.test(urlString)) {
    //去優惠
    router.push(`/promotion?${urlString}`);
    return;
  }

  router.push(`/promotion?name=${urlString}`);
};

const checkShowImgTop = () => {
  const lastTime = sessionStorage.getItem("indexImgTop");
  if (lastTime) {
    const diff = new Date().getTime() - Number(lastTime);
    if (diff > 1000 * 60 * 60 * 12) isFirstView.value = true;
  } else {
    loadHomePopups("")
      .then((res) => {
        // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
        //   res = apiMockData;
        // }
        const { code, data } = res;
        popupList.value = data;
        store.frequency = data[0]["frequency"];
        if (code === 0) {
          if (isImpt === null) {
            switch (data[0]["frequency"]) {
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
            isFirstView.value = true;
          } else {
            isImportantAnnoucementModal.value = false;
          }
        }
      })
      .catch(() => {});
  }
};

// watch(
//   () => store.token,
//   () => {
//     if(store.token && (store.memberType === "TEST" || store.memberType === "PROMO_TEST")){
//       checkShowImgTop();
//     }
//   }
// );

onMounted(() => {
  loadBanners();
  if (store.token) {
    checkShowImgTop();
  }
});

watch(
  () => store.token,
  () => {
    if (store.token) {
      checkShowImgTop();
    }
  }
);
</script>

<style scoped lang="scss">
.banner-loading {
  width: 100%;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    to bottom,
    rgba(240, 248, 255, 0.8196078431) 0%,
    rgb(240 248 255 / 50%) 80%,
    rgb(240 248 255 / 0%) 100%
  );

  .loading-img {
    animation-name: fade-in-out;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    width: 100px;
  }
}

@keyframes fade-in-out {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.banner-slider {
  width: 100%;

  .banner-container {
    .banner-background {
      background-size: contain;
      width: 100%;
      height: 100%;
    }

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

.close-btn {
  position: absolute;
  bottom: -55px;
  cursor: pointer;
}
</style>

<style lang="scss">
.banner-slider {
  width: 100%;

  .is-active .el-carousel__button {
      background: #2E3031;
      box-shadow: 0 0 0 1px #2E3031;
      border: 1px solid #2E3031;
  }

  .el-carousel__indicators--outside button {
      background-color: #A2B1C3;
      border: 1px solid #A2B1C3;
      box-shadow: 0 0 0 1px #A2B1C3;
  }
}

@keyframes stompIn {
  0% {
    transform: scale(0.95) translateY(-40px);
    opacity: 0;
    box-shadow: none;
  }
  60% {
    transform: scale(1.03) translateY(5px);
    opacity: 1;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  80% {
    transform: scale(0.98) translateY(-2px);
  }
  100% {
    transform: scale(1) translateY(0);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
}

.stomp-enter-active {
  animation: stompIn 0.6s ease-out;
}
</style>
