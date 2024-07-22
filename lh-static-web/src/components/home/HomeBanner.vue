<template>
  <el-dialog
    @close="setWithExpiry('isImpt', true, 43200000)"
    class="imptann-modal"
    v-model="isImportantAnnoucementModal"
    v-if="!isImpt"
  >
    <a
      @click="clickHomePopupImg(homePopupPath)"
    >
      <img :src="homePopupImg" class="alert-img" />
    </a>
  </el-dialog>

  <el-carousel class="banner-slider" indicator-position="outside" :autoplay="false" :interval="5000">
    <el-carousel-item class="banner-container" v-for="banner in banners" :key="banner">
      <a @click="goBannerPage(banner.redirectUrl)">
        <div class="banner-background">
          <div
            v-if="!banner.isLocal"
            class="promo-bg isDesktop"
            :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'"
          ></div>
          <div
            v-else
            class="promo-bg isDesktop"
            :style="'background-image: url(' + require(`../../assets/home/bannerTest/IM-img.png`) + ')'"
          ></div>

          <div class="promo-bg isMobile" :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"></div>
        </div>
      </a>
    </el-carousel-item>
  </el-carousel>
  <GameModal ref="allGames"></GameModal>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { loadPromoBanner, loadHomePopup } from "@/api/index/promo";
import { useDark, useLocalStorage } from "@vueuse/core";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import GameModal from "@/components/modal/GameModal.vue";
import { useNotify } from "@/hooks/notify";

const notify = useNotify();

const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
const banners = ref([]);

const isDark = useDark();
const store = userStore();
const router = useRouter();

const allGames = ref(null);
const goBannerPage = (redirectUrl) => {
  const openPattern = /^\/open\/(.*)/;
  if (redirectUrl.match(openPattern)) {
    const extractedUrl = redirectUrl.match(openPattern)[1];
    const [gameName, platformCode, gameCode] = extractedUrl.split("/");

    allGames.value.open(gameName, platformCode, gameCode, 'OPEN');
    return;
  } else if (redirectUrl == "app://deposit") {
    router.push("/center/deposit");
  } else {
    router.push(`/promotion?name=${redirectUrl}`);
  }
};

const loadBanners = () => {
  loadPromoBanner("HOME").then((res) => {
    if (res.code === 0) {
      banners.value = res.data;

      console.log(banners.value);

      if (store.token && (store.memberType === "TEST" || store.memberType === "PROMO_TEST")) {
        banners.value.unshift({
          category: "HOME",
          isLocal: true,
          promoPageId: null,
          redirectUrl: "lh1-im-sport"
        });
      }
    } else
      notify({
        type: "error",
        message: res.message
      });
  });
};

const setWithExpiry = (key, value, interval) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + interval
  };
  sessionStorage.setItem(key, JSON.stringify(item));
};


const getWithExpiry = (key) => {
  const itemStr = sessionStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    sessionStorage.removeItem(key);
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

const clickHomePopupImg = (urlString)=>{
  const openPattern = /^\/open\/(.*)/;
  if (urlString.match(openPattern)) {
    const extractedUrl = urlString.match(openPattern)[1];
    const [gameName, platformCode, gameCode] = extractedUrl.split("/");

    allGames.value.open(gameName, platformCode, gameCode, 'OPEN');
    return;
  }

  // debugger;
  let regexUrl = new RegExp(/^(https:\/\/)/g)
  if(regexUrl.test(urlString)){
    // 跳轉
    location.href = urlString;
    return
  }
  let regexName = new RegExp(/^(name|\?name)/g)
  if(regexName.test(urlString)){
    //去優惠
    router.push(`/promotion${urlString}`);
    return
  }

  router.push(`${urlString}`);
}

const checkShowImgTop = () => {
  const lastTime = sessionStorage.getItem("indexImgTop");
  if (lastTime) {
    const diff = new Date().getTime() - Number(lastTime);
    if (diff > 1000 * 60 * 60 * 12) isFirstView.value = true;
  } else {
    // loadPromoBanner("HOMEPOP")
    //   .then((res) => {
    //     const { code, data } = res;
    //     if (code === 0) {
    //       if (data.length > 0) {
    //         if (isImpt === null) {
    //           isImportantAnnoucementModal.value = true;

    //           homePopupImg.value = data.length > 0 ? imgURL + data[0]["desktopImageUrl"] : "";
    //           if (homePopupImg.value) isFirstView.value = true;
    //         }
    //       } else {
    //         isImportantAnnoucementModal.value = false;
    //       }
    //     }
    //   })
    //   .catch(() => {});

    loadHomePopup("")
      .then((res) => {
        // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
        //   res = apiMockData;
        // }
        const { code, data } = res;
        if (code === 0) {
          if (isImpt === null) {
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
            homePopupPath.value = data["path"];
            homePopupImg.value = imgURL + data["desktopImgUrl"];
            homePopupContent.value = data["content"];
            homePopupType.value = data["type"];
            homePopupId.value = data["id"];
            homePopupFrequency.value = data["frequency"];
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
  if(store.token){
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
.banner-slider {
  width: 100%;

  .banner-container {
    .banner-background {
      background-image: url(@/assets/images/home/banner/banner-background.png);
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

.dark {
  .banner-slider {
    .banner-container {
      .banner-background {
        background-image: url(@/assets/images/home/banner/banner-background-dark.png);
      }
    }
  }
}
</style>
