<template>
  <div class="home">
    <el-carousel class="home-carousel" height="500px">
      <el-carousel-item v-for="banner in banners" :key="banner">
        <a @click="goBannerPage(banner.redirectUrl)">
          <div
            class="promo-bg"
            :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'"
            style="background-repeat: no-repeat; background-size: cover"
          ></div>
        </a>
      </el-carousel-item>
    </el-carousel>
    <AnnouncementBar />
    <div class="index-container">
      <div class="hotgames-wrapper">
        <div class="hotgames-title">
          <img class="game-title" src="../assets/home/hotgames-title.png" alt="热门游戏" />
        </div>
        <HotGamesCarousel />
      </div>
      <div class="avg-fox">
        <div class="inner-contents">
        <img class="game-title" src="../assets/home/hotplatforms-title.png" alt="热门游戏" />
        <HotPlatforms />
      </div>
      </div>
      <!-- <div class="avg-list">
        <img src="../assets/home/list_money.png" alt="" />
        <img class="list-title" src="../assets/home/list_all.png" alt="" />
      </div> -->
      <!-- <div class="avg-earth">
        <div
          class="list-content"
          style="justify-content: space-between; width: 1270px; margin: 0 auto"
        >
          <div @click="openGame('全能宙斯帝国', 'MGP', 'SMG_almightyZeusEmpire')">
            <img src="../assets/home/hot_game1.png" alt="" />
            <span>进入游戏</span>
          </div>
          <div onclick="fun_openGame('summon-conquer', 38)">
            <img src="../assets/home/hot_game2.png" alt="" />
            <span>进入游戏</span>
          </div>
          <div onclick="fun_openGame('medusa2', 38)">
            <img src="../assets/home/hot_game3.png" alt="" />
            <span>进入游戏</span>
          </div>
          <div onclick="fun_openGame('captains-bounty', 38)">
            <img src="../assets/home/hot_game4.png" alt="" />
            <span>进入游戏</span>
          </div>
        </div>
        <div class="avg-serve">
          <img
            class="serve-title"
            src="../assets/home/server_title.png"
            alt=""
          />
          <img class="serve-bg" src="../assets/home/server_bg.png" alt="" />
        </div>
      </div> -->
      <div class="app-container">
        <img class="game-title" src="../assets/home/app-title.png" alt="APP下载" />
        <AppDownload />
      </div>
      <div class="svc-container">
        <img class="game-title" src="../assets/home/service-title.png" alt="APP下载" />
        <HomeServiceSection />
    </div>  
      
    </div>
  </div>
  <GameModal ref="gameMenu"></GameModal>

  <el-dialog
    @close="setWithExpiry('isImpt', true, 43200000)"
    class="imptann-modal"
    v-model="isImportantAnnouncementModal"
  >
    <div class="promo-banner-container" :class="homePopupType === 'TEXT ' ? 'promo-text' : 'promo-img'">
      <div class="promo-banner-content" v-if="homePopupType === 'TEXT'" v-html="homePopupContent"></div>
      <div class="promo-banner-img" v-else>
        <a @click="clickHomePopupImg(homePopupPath)">
          <img :src="homePopupImg" class="alert-img" />
        </a>
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref, onMounted, watch } from "vue";
import { loadPromoBanner, loadHomePromoBanner } from "@/api/index/promo";
import { useLocalStorage } from "@vueuse/core";
import Vue3autocounter from "vue3-autocounter";
import AnnouncementBar from "@/components/home/AnnouncementBar.vue";
import HotGamesCarousel from "@/components/home/HotGamesCarousel.vue";
import HotPlatforms from "@/components/home/HotPlatforms.vue";
import AppDownload from "@/components/home/AppDownload.vue";
import HomeServiceSection from "@/components/home/HomeService.vue";
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { userStore } from "@/store";

export default defineComponent({
  // directives: {
  //   "number-counter": numberCounter
  // },
  components: {
    Vue3autocounter,
    AnnouncementBar,
    HotGamesCarousel,
    HotPlatforms,
    AppDownload,
    HomeServiceSection
  },
  setup() {
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
    const gameMenu = ref(null);
    const banners = ref([
      {
        src: "83ac7ea8-c77d-4cf0-976a-7f1a5e1b0027.png"
      },
      {
        src: "9ba30f5e-162a-429e-a811-ad918c958fbd.jpg"
      }
    ]);
    const isImportantAnnouncementModal = ref(false);
    const openGame = (gameName, platType, gameCode) => {
      gameMenu.value.open(gameName, platType, gameCode);
    };

    const loadBanners = () => {
      loadPromoBanner("HOME").then((res) => {
        if (res.code === 0) {
          banners.value = res.data.filter(item => item.showDesktop === true);
        }
      });
    };

    const store = userStore();
    // Pop out ads banner
    const homePopupImg = ref("");
    const homePopupContent = ref("");
    const homePopupType = ref("");
    const homePopupId = ref(0);
    const homePopupFrequency = ref("");
    const homePopupFrequencyNum = ref(0);
    const homePopupPath = ref("");

    const setWithExpiry = (key, value, interval) => {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + interval,
        id: homePopupId.value,
        frequency: homePopupFrequency.value
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

    const checkShowImgTop = () => {
      const lastTime = sessionStorage.getItem("indexImgTop");
      if (lastTime) {
        const diff = new Date().getTime() - Number(lastTime);
        if (diff > 1000 * 60 * 60 * 12) {
          isFirstView.value = true;
        }
      } else {
        loadHomePromoBanner()
          .then((res) => {
            if (res.code === 0) {
              // if (res.data[siteId] !== null) {
              if (isImpt === null) {
                switch (res.data["frequency"]) {
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

                isImportantAnnouncementModal.value = true;
                homePopupPath.value = res.data["path"];
                homePopupImg.value =
                  useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value +
                  "/promo/" +
                  res.data["desktopImgUrl"];
                homePopupContent.value = res.data["content"];
                homePopupType.value = res.data["type"];
                homePopupId.value = res.data["id"];
                homePopupFrequency.value = res.data["frequency"];
                // if (homePopupImg.value) {
                isFirstView.value = true;
                // }
              }
              // } else {
              //   isImportantAnnouncementModal.value = false;
              // }
            }
          })
          .catch(() => {});
      }
    };

    const clickHomePopupImg = (urlString) => {
      isImportantAnnouncementModal.value = false;

      const openPattern = /^\/open\/(.*)/;
      if (urlString.match(openPattern)) {
        const extractedUrl = urlString.match(openPattern)[1];
        const [gameName, platformCode, gameCode] = extractedUrl.split("/");

        gameMenu.value.open(gameName, platformCode, gameCode, "OPEN");
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
        router.push(`/promotion${urlString}`);
        return;
      }

      router.push(`${urlString}`);
    };

    const router = useRouter();

    const checkMaintenance = () => {
      ElMessageBox.alert("系统维护中", {
        center: true,
        confirmButtonText: "确认",
        showClose: false,
        buttonSize: "large"
      }).then(() => {
        router.push("/");
      });
      return;
    };

    const goBannerPage = (redirectUrl) => {
      if (redirectUrl == "app://deposit") {
        router.push("/center/deposit");
      } else {
        router.push(`/promotion?name=${redirectUrl}`);
      }
    };

    onMounted(() => {
      loadBanners();
      if (store.token && store.memberType === "TEST") {
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

    return {
      banners,
      isImportantAnnouncementModal,
      gameMenu,
      openGame,
      imgURL,
      getWithExpiry,
      setWithExpiry,
      homePopupImg,
      homePopupContent,
      homePopupType,
      homePopupId,
      homePopupFrequency,
      homePopupFrequencyNum,
      checkMaintenance,
      isImpt,
      goBannerPage,
      clickHomePopupImg,
      homePopupPath
    };
  }
});
</script>

<style lang="scss">

.demonstration {
  color: var(--el-text-color-secondary);
}
.home-carousel {

  .el-carousel__item {
    color: #475669;
    margin: 0;
    text-align: center;
    img {
      height: unset;
      width: 100%;
    }
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #0e121b;
  }
}
.index-container {
  background: url(../assets/home/wavy_bg.png)no-repeat center center;
  background-size: cover;
  .hotgames-wrapper {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 50px 0;
    .hotgames-title {
      img {
        width: 100%;
      }
    }
  }
  .avg-earth,
  .avg-fox {
    background-repeat: no-repeat;
  }
  .avg-fox {
    margin: 0 auto;
    background-image: url(../assets/home/hotplatforms.png);
    background-repeat: no-repeat;
    background-position: right;
    text-align: left;
    min-height: 800px;
    .inner-contents {
      max-width: 1400px;
      margin: 20px auto;
      img {
        width: 100%;
      }
    }
    .game-title {
      margin: 50px 0;
    }
    
    .game-content {
      height: 180px;
      display: flex;
      gap: 5px;
    }
    .game-left {
      border-top-right-radius: 17px;
      border-bottom-right-radius: 17px;
    }
    .game-right {
      border-top-left-radius: 17px;
      border-bottom-left-radius: 17px;
    }
    .game-left,
    .game-right {
      width: 40px;
      height: 180px;
      line-height: 180px;
      background-color: #1c212e;
      opacity: 0.8;
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        width: 40px;
        height: 50px;
      }
    }
  }
  .app-container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    .game-title{ 
      width: 100%;
      margin: 50px auto;
    }
    
  }
  
  .svc-container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    .game-title{ 
      width: 100%;
      margin: 50px auto;
    }
  }
  .avg-list,
  .avg-serve {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .game-item,
  .list-content {
    display: flex;
  }
  .avg-earth {
    height: 700px;
    background-image: url(../assets/home/earth_bg.png);
  }
  .list-content div {
    margin: 0 5px;
    cursor: pointer;
    position: relative;
  }
  .list-content div > img {
    width: 310px;
    height: 310px;
  }
  .list-content div > span {
    display: block;
    width: 98px;
    height: 38px;
    line-height: 38px;
    border-radius: 6px;
    border: 2px solid #36eefc;
    text-align: center;
    color: #30b8c3;
    font-size: 14px;
    position: absolute;
    top: 127px;
    left: 110px;
  }
  .list-title {
    margin-left: 340px;
  }
  .avg-serve {
    height: 500px;
  }
  .serve-title {
    margin-left: 150px;
    width: 300px;
    text-align: center;
  }
  .serve-bg {
    margin-left: 50px;
    width: 800px;
    text-align: center;
  }
  .avg-container {
    display: flex;
    justify-content: space-around;
    padding-bottom: 50px;
    text-align: center;
    color: #5e768c;
    max-width: $maxwidth;
    margin: 94px auto 0;

    .avg-advantage {
      font-size: 30px;
    }
    .avg-active-bg {
      position: absolute;
      left: 0;
      top: 0;
    }
    .avg-circle-container {
      position: absolute;
      width: 130px;
      height: 130px;
      left: 6px;
      top: 4px;
    }
    .avg-time-nv-box {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      width: 140px;
      height: 116px;
      background-image: url(data:image/png;base64,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);
      background-position: center;
      position: relative;
    }
    .avg-circle,
    .avg-schedule {
      position: absolute;
      top: 0;
      overflow: hidden;
    }
    .avg-time-content-box {
      width: 96px;
      height: 94px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABeCAYAAADc6BHlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA4LTE5VDIzOjE2OjI0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wOC0yNFQxNzo1NDowNiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wOC0yNFQxNzo1NDowNiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkOTA1ZmQ5Yy1lMTM2LTA5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);
      background-position: center;
      line-height: 94px;
      color: #fff;
    }
    .avg-schedule {
      width: 65px;
    }
    .avg-schedule-container {
      height: 110px;
    }
    .avg-circle,
    .avg-schedule-box {
      height: 130px;
    }
    .avg-schedule-left {
      left: 0;
    }
    .avg-schedule-right {
      left: 65px;
      -webkit-transform-origin: left;
      transform-origin: left;
    }
    .avg-circle {
      width: 130px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: 50%;
      border: 5px solid #0e121b;
    }
    .avg-circle-left {
      left: 0;
    }
    .avg-circle-right {
      right: 0;
    }
    .avg-animate-dep {
      -webkit-transform: rotate(125deg);
      transform: rotate(125deg);
      -webkit-animation: avg-time-dep 0.7s linear infinite;
      animation: avg-time-dep 0.7s linear infinite;
      -webkit-transform-origin: right;
      transform-origin: right;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }
    .avg-animate-withdraw {
      -webkit-transform: rotate(175deg);
      transform: rotate(175deg);
      -webkit-animation: avg-time-withdraw 0.7s linear infinite;
      animation: avg-time-withdraw 0.7s linear infinite;
      -webkit-transform-origin: right;
      transform-origin: right;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }
    .avg-animate-full {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
      -webkit-transform-origin: right;
      transform-origin: right;
      -webkit-animation: avg-time-full 0.7s linear infinite;
      animation: avg-time-full 0.7s linear infinite;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }
    .avg-animate-pay {
      -webkit-transform: rotate(75deg);
      transform: rotate(75deg);
      -webkit-transform-origin: left;
      transform-origin: left;
      -webkit-animation: avg-time-pay 0.7s 0.7s linear infinite both;
      animation: avg-time-pay 0.7s 0.7s linear infinite both;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }
    .avg-animate-down {
      -webkit-transform: rotate(115deg);
      transform: rotate(115deg);
      -webkit-transform-origin: left;
      transform-origin: left;
      -webkit-animation: avg-time-down 0.7s 0.7s linear infinite both;
      animation: avg-time-down 0.7s 0.7s linear infinite both;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }
    .avg-container-en {
      color: #86e6f6;
      line-height: 16px;
      font-size: 10px;
      margin-bottom: 12px;
    }
    @keyframes avg-time-dep {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(125deg);
      }
    }
    @keyframes avg-time-withdraw {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(175deg);
      }
    }
    @keyframes avg-time-pay {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(75deg);
      }
    }
    @keyframes avg-time-full {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(180deg);
      }
    }
    @keyframes avg-time-down {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(115deg);
      }
    }
    @-webkit-keyframes avg-time-dep {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(125deg);
      }
    }
    @-webkit-keyframes avg-time-withdraw {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(175deg);
      }
    }
    @-webkit-keyframes avg-time-pay {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(75deg);
      }
    }
    @-webkit-keyframes avg-time-full {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(180deg);
      }
    }
    @-webkit-keyframes avg-time-down {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(115deg);
      }
    }
  }
  .index-bottom-container {
    text-align: left;
    padding-bottom: 83px;
    margin: 0 auto;
    max-width: $maxwidth;
    .index-bottom-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 200px;
      margin: 50px auto;
      width: 100%;
      .index-our-tc {
        display: flex;
        gap: 20px;
        flex: 1;
        .serve_tip {
          color: #32ceed;
        }
        .index-tc-desc {
          color: #959dab;
          font-size: 14px;
        }
      }
    }
  }
}
.home {
  .promo-bg {
    height: 500px;
    width: 100%;
  }
}
.imptann-modal {
  .alert-img {
    display: block;
    width: 100%;
  }

  &.el-dialog {
    max-width: 1300px;
    background: transparent;
    box-shadow: none;
    width: max-content;
    margin-top: 25%;
    transform: translate(0px, -50%);
    padding: 20px;
  }

  .el-dialog__header {
    border-bottom: 0;
  }

  .el-dialog__close {
    background-color: rgba(255, 255, 255, 0.6);
    width: 32px;
    height: 32px;
    color: #222a34 !important;
    font-size: 24px !important;
    border-radius: 50%;
    margin-bottom: 10px;
    box-shadow: rgba(255, 255, 255, 0.2) 0px 7px 29px 0px;
  }

  .el-dialog__body {
    // padding: 40px 2px 0;
    box-shadow: none;
    padding: 0px 2px 0;
    background: transparent;
  }

  .el-dialog__headerbtn {
    top: 5px !important;
    right: 5px !important;
  }
}

.promo-banner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 20px;

  &.promo-img {
    background: transparent;
  }

  &.promo-text {
    background: #222a34;
  }

  .promo-banner-img {
    // margin-top: 55px;
    width: 100%;
    img {
      display: block;
      width: 100%;
    }
  }

  .promo-banner-title {
    font-weight: bold;
    font-size: 22px;
  }

  .promo-banner-content {
    padding: 40px 20px 20px;
  }
}
</style>
