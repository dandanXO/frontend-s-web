<template>
  <el-dialog
    class="imptann-modal"
    modal-class="custom-overlay"
    v-model="isImportantAnnoucementModal"
    :show-close="false"
    :close-on-click-modal="false"
    v-if="showDialog"
  >
    <div class="popup-wrapper">
      <template v-if="popupBanners.length">
        <a
          v-for="(item,index) in popupBanners"
          :key="index"
          class="popup-container"
        >
          <img :key="item.mobileImgUrl" :src="imgURL + item.desktopImgUrl" class="alert-img" />
          <div class="popup-footer">
            <div>
              <el-checkbox label="오늘 이창을 다시열지 않기" v-model="item.checkedBox" style="background-color: transparent" @click="handleCheckLoginBanner(item.title)" />
            </div>
            <div class="btn-container">
              <el-button type="info" size="small" @click="handleCloseLoginBanner($event, item.title)">닫기</el-button>
            </div>
          </div>
        </a>
      </template>
    </div>
  </el-dialog>

  <el-carousel class="banner-slider" indicator-position="outside" :autoplay="true" :interval="5000">
    <el-carousel-item class="banner-container" v-for="banner in banners" :key="banner">
      <a @click="goToUrl(banner.redirectUrl)">
        <div class="promo-bg isDesktop" :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'"></div>
        <div class="promo-bg isMobile" :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"></div>
      </a>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { loadPromoBanner, loadLoginHomePopup } from "@/api/index/promo";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import { userStore } from "@/store/index";

const store = userStore();
const router = useRouter();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
const banners = ref([]);
const popupBanners = ref([]);
const checkedBox = ref(false)
const showDialog = ref(true)

if(localStorage.getItem('disableShowLoginThreeStep') === 'true'){
  showDialog.value = false
}

const goToUrl = (redirectUrl) => {
  if (!redirectUrl.trim()) return;
  const urlSplit = redirectUrl.split("|");
  if (urlSplit.length >= 2) {
    const type = urlSplit[0];
    if (type === "page") {
      router.push(`/${urlSplit[1]}`);
    } else {
      router.push(`/promotion?name=${redirectUrl}`);
    }
  } else {
    if (redirectUrl.includes("https://")) {
      window.open(redirectUrl, "_blank");
    } else {
      router.push(`/promotion?name=${redirectUrl}`);
    }
  }
};

const loadBanners = () => {
  loadPromoBanner("HOME").then((res) => {
    if (res.code === 0) banners.value = res.data;
    else
      ElMessage.error({
        type: "error",
        message: res.message
      });
  });
};


const isImportantAnnoucementModal = ref(false);

const closedLoginBannerList = ref(new Set());
const checkedLoginBannerList = ref(new Set());

const handleCloseLoginBanner = (e, title) => {
  e.preventDefault();

  if(!checkedLoginBannerList.value.has(title)){

    return

  }
  // closedLoginBannerList.value.add(index);

  popupBanners.value = popupBanners.value.filter(itme=>itme.title !=title)
  checkedBox.value = false
  if (checkedLoginBannerList.value.has(title)) {
    if (sessionStorage.getItem("CLOSED_LOGIN_BANNER")) {
      const result = new Set(JSON.parse(sessionStorage.getItem("CLOSED_LOGIN_BANNER"))).add(title);
      sessionStorage.setItem("CLOSED_LOGIN_BANNER", JSON.stringify(Array.from(result)));
    } else {
      sessionStorage.setItem("CLOSED_LOGIN_BANNER", JSON.stringify([title]));
    }
  }
  if(popupBanners.value.length<=0){
    isImportantAnnoucementModal.value = false
    localStorage.setItem('disableShowLoginThreeStep',true)
  }
}

const handleCheckLoginBanner = (index) => {
  if (checkedLoginBannerList.value.has(index)) {
    checkedLoginBannerList.value.delete(index);
  } else {
    checkedLoginBannerList.value.add(index);
  }
}

// const checkShowImgTop = () => {
//   const lastTime = localStorage.getItem("indexImgTop");
//   if (lastTime) {
//     const diff = new Date().getTime() - Number(lastTime);
//     if (diff > 1000 * 60 * 60 * 12) isFirstView.value = true;
//   } else {
//     loadHomePopup("")
//       .then((res) => {
//         const { code, data } = res;
//         if (code === 0) {
//           if (isImpt === null) {
//             switch (data["frequency"]) {
//               case "EVERYTIME":
//                 homePopupFrequencyNum.value = 0;
//                 break;
//               case "EVERYDAY":
//                 homePopupFrequencyNum.value = 86400000; // 24hrs
//                 break;
//               case "SESSION":
//                 homePopupFrequencyNum.value = 7866432000; // 3months
//                 break;
//               default:
//                 homePopupFrequencyNum.value = 10000;
//                 break;
//             }
//             isImportantAnnoucementModal.value = true;
//             if (data["path"].includes("https://")) {
//               homePopupPath.value = data["path"];
//             } else {
//               homePopupPath.value = "/promotion?name=" + data["path"];
//             }
//             homePopupImg.value = imgURL + data["desktopImgUrl"];
//             homePopupContent.value = data["content"];
//             homePopupType.value = data["type"];
//             homePopupId.value = data["id"];
//             homePopupFrequency.value = data["frequency"];
//             isFirstView.value = true;
//           } else {
//             isImportantAnnoucementModal.value = false;
//           }
//         }
//       })
//       .catch(() => {});
//   }
// };

// const getLoginBannerHref = (data) => {
//   if (data["path"].includes("https://")) {
//     return data["path"];
//   }
//   return "/promotion?name=" + data["path"];
// }

const fetchPopoutData = () => {
  loadLoginHomePopup().then((res) => {
    if (res.code === 0) {
      popupBanners.value = res.data;
      popupBanners.value.forEach(item=>{
        item.checkedBox = false
        return item
      })
      closedLoginBannerList.value = new Set(JSON.parse(sessionStorage.getItem("CLOSED_LOGIN_BANNER")) || []);

      if(localStorage.getItem('disableShowLoginThreeStep') === 'true'){
        showDialog.value = false
      }else{
        showDialog.value = true
      }
    } else
      ElMessage.error({
        type: "error",
        message: res.message
      });
  });
};

onMounted(() => {
  loadBanners();
  // checkShowImgTop();
});

watch(
  () => store.token,
  () => {
    if (store.token) {
      fetchPopoutData();
      isImportantAnnoucementModal.value = true
    }else{
      showDialog.value = false
    }
  },
  { immediate: true }
);
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
</style>
<style lang="scss">
.imptann-modal {
  background: transparent !important;
  width: 100% !important;
  height: auto;
  margin-top: 25% !important;
  transform: translate(0px, -50%);

  .el-dialog__body {
    padding: 20px !important;
    border-radius: 12px;
  }

  .alert-img {
    display: block;
    width: 100%;
    border-radius: 12px;
  }
}

.popup-wrapper {
  position: absolute;
  width: 99%;
  left: 50%;
  transform: translate(-50%, 0%);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .popup-container {
    position: relative;

    .alert-img {
      max-width: 640px;
    }

    .popup-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      color: #FFFFFF99;

      .btn-container {
        position: absolute;
        right: 20px;
        color: #FFFFFF;
      }

      .el-checkbox__inner {
        background-color: transparent;
        border-color: #FFFFFF99;
      }
    }
  }
}

.custom-overlay {
  --el-overlay-color-lighter: rgba(0, 0, 0, 0.3);
}
</style>
