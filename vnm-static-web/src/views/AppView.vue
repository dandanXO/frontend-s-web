<template>
  <div class="app-container">
    <div class="bg-video-wrap">
      <video id="bg-video" muted="muted" autoplay="autoplay" loop="loop" poster="../assets/app/poster.jpg">
        <source src="../assets/app/videobg.webm" type="video/webm" />
      </video>
    </div>
    <div id="sec-content">
      <div class="intro-container">
        <img
          :src="require(`../assets/app/toplabel-${languageVal}.png`)"
          alt="TF88GamingApp"
          width="570px"
          class="img-slogan"
          data-v-93674b8c=""
        />
        <img src="../assets/app/light.png" alt="TF88GamingApp" width="570px" class="img-slogan" data-v-93674b8c="" />
        <div class="text-content">
          {{ $t('app.sports') }}
          <br />
          {{ $t('app.live') }}
          <!-- <br /> -->
          <!-- {{ $t('app.hot') }} -->
        </div>
        <div class="buttons">
          <!-- <div class="btn iphone">
            <img src="../assets/app/ios-icon.png" />
            iPhone 版
            <div class="qrcode">
              <VueQRCodeComponent :size="120" :text="downloadUrl" />
            </div>
          </div>
          <div class="btn android">
            <img src="../assets/app/android-icon.png" />
            Android 版
            <div class="qrcode">
              <VueQRCodeComponent :size="120" :text="downloadUrl" />
            </div>
          </div> -->
          <template v-for="(det, idx) in platforms" :key="idx">
            <div class="platform-button-w-qr-code">
              <div class="platform-button" @click="clickPlat(det)">{{ det.name }}</div>
              <div :class="`platform-qr-code ${selectedPlat === det.code ? 'visible' : ''}`">
                <div class="close-btn" @click="closePlatformQRCode">&#x2716;</div>
                <div class="qr-code-wrapper">
                  <VueQRCodeComponent :size="120" :text="det.link" />
                </div>
                <div class="supported-mobile-os">
                  <img src="../assets/app/ios-icon.png" />
                  <img src="../assets/app/android-icon.png" />
                  <span v-if="det.mobile">{{ $t('app.mobileAccess') }}</span>
                </div>
                <div>
                  <a v-if="det.mobile" :href="det.mobile" target="_blank">{{ det.mobile }}</a>
                  <span v-else>{{ $t('app.scanDownload') }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="swiper-wrap">
        <swiper
          :direction="'vertical'"
          :loop="true"
          @swiper="onSwiper"
          :autoplay="{ delay: 3000, reverseDirection: true }"
          effect="fade"
          :auto-height="false"
          :allow-slide-next="false"
        >
          <swiper-slide style="position: relative" v-for="i in 3">
            <img class="fadeIn" :src="require(`../assets/app/phone-${i}.png`)" />
            <img class="bounceIn" :src="require(`../assets/app/words-${i}-${languageVal}.png`)" />
            <img class="fadeInUp" :src="require(`../assets/app/bottom-${i}.png`)" />
            <img class="fadeInRight" :src="require(`../assets/app/right-${i}.png`)" />
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
  <GameModal ref="appGame"></GameModal>
</template>
<script>
import { defineComponent, onMounted, ref, nextTick } from "vue";
import VueQRCodeComponent from "vue-qrcode-component";
import GameModal from "@/components/modal/GameModal";
import { getAppDownloadUrlFromServer } from "@/api/index/site";
import aos from "aos";

// Import Swiper Vue.js components
import SwiperCore from "swiper";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import { i18nStore } from '@/store/language'
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
SwiperCore.use([EffectFade, Autoplay]);

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
    GameModal,
    // VueQrious,
    VueQRCodeComponent
  },
  setup() {
    const { t } = useI18n()
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    const onSwiper = (swiper) => {};

    const onSlideChange = () => {
      // console.log("slide change");
    };
    const appGame = ref(null);
    const platforms = ref([
      {
        code: "H5",
        name: t('app.h5'),
        link: window.location.host,
        mobile: window.location.host
      },
      {
        code: "QZ",
        name: t('app.app'),
        link: ""
      }
      // {
      //   code: "DJ",
      //   name: "雷火电竞APP下载",
      //   link: "https://m.e8386.com"
      // },
      // {
      //   code: "TY",
      //   name: "雷火体育APP下载",
      //   link: "https://m.e8386.com"
      // }
    ]);
    const selectedPlat = ref();
    const clickPlat = (plat) => {
      selectedPlat.value = plat.code;
    };

    const openGame = (gameName, gameCode) => {
      appGame.value.open(gameName, "onlyPlatform", gameCode);
    };

    const closePlatformQRCode = () => {
      selectedPlat.value = "";
    };

    const downloadUrl = ref("");

    const getAppDownloadUrl = () => {
      getAppDownloadUrlFromServer()
        .then((res) => {
          downloadUrl.value = res.downloadPageUrl;
          platforms.value.forEach((platform) => {
            if (platform.code == "QZ") {
              platform.link = downloadUrl.value;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const swiperInstance = ref(null);
    const swiperKey = ref(0);
    onMounted(() => {
      aos.refresh();
      getAppDownloadUrl();
    });
    return {
      platforms,
      selectedPlat,
      clickPlat,
      openGame,
      appGame,
      getAppDownloadUrl,
      downloadUrl,
      closePlatformQRCode,
      onSwiper,
      swiperKey,
      EffectFade,
      swiperInstance,
      languageVal
    };
  }
});
</script>

<style scoped lang="scss">
.swiper-wrap {
  margin-right: -110px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.swiper-slide {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  img {
    width: 100%;
  }
}

.swiper-slide-active {
  opacity: 1;
}
.app-container {
  height: 100vh;
  position: relative;
}
#sec-content {
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0 auto;
  max-width: 1500px;
  transform: translateY(-40%);
  padding-left: 6%;
  z-index: 3;
  display: flex;
}
.bg-video-wrap {
  z-index: 1;
  left: 0;
  top: 0;
  overflow: hidden;
  min-height: 800px;
}
.bg-video-wrap,
.bg-video-wrap #bg-video {
  position: absolute;
  width: 100%;
  height: 100%;
}
.bg-video-wrap #bg-video {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -o-object-fit: cover;
  object-fit: cover;
}
.swiper {
  margin-left: -50px;
  display: inline-block;
  width: 900px;
  min-width: 900px;
  height: 725px;
  white-space: nowrap;
  img {
    position: absolute;
    transition-duration: 0.3s;
  }
}
.intro-container {
  display: flex;
  flex-direction: column;
  width: 65%; 
  .text-content {
    font-size: 22px;
    color: #ffffff;
    padding: 15px 0px;
  }
  .buttons {
    display: flex;
    gap: 70px;
    padding-top: 40px;
    .btn {
      background: url(../assets/app/btn.png) no-repeat center center;
      background-size: contain;
      width: 207px;
      height: 58px;
      font-size: 18px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      position: relative;
      img {
        height: 30px;
      }
      .qrcode {
        position: absolute;
        top: 140%;
        background: #ffffff;
        padding: 10px;

        opacity: 0;
        &::before {
          content: "";
          position: absolute;
          border-left: 16px solid transparent;
          border-right: 16px solid transparent;
          border-bottom: 19px solid #fff;
          left: 50%;
          top: 0;
          transform: translate(-50%, -100%);
        }
      }
      &:hover {
        .qrcode {
          opacity: 1;
        }
      }
    }
    .platform-button-w-qr-code {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .platform-button {
          width: 242px;
          height: 68px;
          font-size: 22px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          line-height: 30px;
          padding: 10px 20px;
          border-radius: 100px;
          background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;
          cursor: pointer;
          z-index: 1;
          text-align: center;

          &.outline {
            background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
            box-shadow: 0px 2px 4.579999923706055px 0px #bbdcff inset;
            box-shadow: 0px -1px 3.6640000343322754px 0px #a2bff4 inset;
            color: #468cff;
          }
        }

        .platform-qr-code {
          position: absolute;
          bottom: -10px;
          margin: auto;
          width: 280px;
          height: 287px;
          box-shadow: 0px 4px 34px 0px #00000033;
          background-color: #ffffff;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 15px 10px 0;
          display: none;

          .supported-mobile-os {
            display: flex;
            align-items: center;
            justify-content: center;

            span {
              line-height: 29px;
              padding: 0px 3px;
            }
          }

          .close-btn {
            position: absolute;
            top: 10px;
            right: 12px;
            cursor: pointer;
            color: #0000004d;
          }

          .qr-code-wrapper {
            background-image: url("./../assets/app/square-crosshair.png");
            background-size: 100% 100%;
            padding: 8px;
          }

          &.visible {
            display: flex;
            animation-duration: 0.5s;
            animation-fill-mode: both;
            animation-name: fadeInUp;
          }
        }
  }
}
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

.animated.hinge {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
}
@-webkit-keyframes bounceIn {
  0%,
  20%,
  40%,
  60%,
  80%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes bounceIn {
  0%,
  20%,
  40%,
  60%,
  80%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.bounceIn {
  -webkit-animation-name: bounceIn;
  animation-name: bounceIn;
  -webkit-animation-duration: 0.75s;
  animation-duration: 0.75s;
}

@-webkit-keyframes bounceInDown {
  0%,
  60%,
  75%,
  90%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }

  75% {
    transform: translate3d(0, -10px, 0);
  }

  90% {
    transform: translate3d(0, 5px, 0);
  }

  to {
    transform: none;
  }
}

@keyframes bounceInDown {
  0%,
  60%,
  75%,
  90%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }

  75% {
    transform: translate3d(0, -10px, 0);
  }

  90% {
    transform: translate3d(0, 5px, 0);
  }

  to {
    transform: none;
  }
}

.bounceInDown {
  -webkit-animation-name: bounceInDown;
  animation-name: bounceInDown;
}

@-webkit-keyframes bounceInLeft {
  0%,
  60%,
  75%,
  90%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }

  75% {
    transform: translate3d(-10px, 0, 0);
  }

  90% {
    transform: translate3d(5px, 0, 0);
  }

  to {
    transform: none;
  }
}

@keyframes bounceInLeft {
  0%,
  60%,
  75%,
  90%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }

  75% {
    transform: translate3d(-10px, 0, 0);
  }

  90% {
    transform: translate3d(5px, 0, 0);
  }

  to {
    transform: none;
  }
}

.bounceInLeft {
  -webkit-animation-name: bounceInLeft;
  animation-name: bounceInLeft;
}

@-webkit-keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    transform: translate3d(10px, 0, 0);
  }

  90% {
    transform: translate3d(-5px, 0, 0);
  }

  to {
    transform: none;
  }
}

@keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    transform: translate3d(10px, 0, 0);
  }

  90% {
    transform: translate3d(-5px, 0, 0);
  }

  to {
    transform: none;
  }
}

.bounceInRight {
  -webkit-animation-name: bounceInRight;
  animation-name: bounceInRight;
}

@-webkit-keyframes bounceInUp {
  0%,
  60%,
  75%,
  90%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }

  75% {
    transform: translate3d(0, 10px, 0);
  }

  90% {
    transform: translate3d(0, -5px, 0);
  }

  to {
    transform: translateZ(0);
  }
}

@keyframes bounceInUp {
  0%,
  60%,
  75%,
  90%,
  to {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }

  75% {
    transform: translate3d(0, 10px, 0);
  }

  90% {
    transform: translate3d(0, -5px, 0);
  }

  to {
    transform: translateZ(0);
  }
}

.bounceInUp {
  -webkit-animation-name: bounceInUp;
  animation-name: bounceInUp;
}

@-webkit-keyframes bounceOut {
  20% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  50%,
  55% {
    opacity: 1;
    transform: scale3d(1.1, 1.1, 1.1);
  }

  to {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
}

@keyframes bounceOut {
  20% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  50%,
  55% {
    opacity: 1;
    transform: scale3d(1.1, 1.1, 1.1);
  }

  to {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
}

.bounceOut {
  -webkit-animation-name: bounceOut;
  animation-name: bounceOut;
  -webkit-animation-duration: 0.75s;
  animation-duration: 0.75s;
}

@-webkit-keyframes bounceOutDown {
  20% {
    transform: translate3d(0, 10px, 0);
  }

  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}

@keyframes bounceOutDown {
  20% {
    transform: translate3d(0, 10px, 0);
  }

  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}

.bounceOutDown {
  -webkit-animation-name: bounceOutDown;
  animation-name: bounceOutDown;
}

@-webkit-keyframes bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0);
  }
}

@keyframes bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0);
  }
}

.bounceOutLeft {
  -webkit-animation-name: bounceOutLeft;
  animation-name: bounceOutLeft;
}

@-webkit-keyframes bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(2000px, 0, 0);
  }
}

@keyframes bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(2000px, 0, 0);
  }
}

.bounceOutRight {
  -webkit-animation-name: bounceOutRight;
  animation-name: bounceOutRight;
}

@-webkit-keyframes bounceOutUp {
  20% {
    transform: translate3d(0, -10px, 0);
  }

  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, 20px, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}

@keyframes bounceOutUp {
  20% {
    transform: translate3d(0, -10px, 0);
  }

  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, 20px, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}

.bounceOutUp {
  -webkit-animation-name: bounceOutUp;
  animation-name: bounceOutUp;
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
  -webkit-animation-duration: 0.75s;
  animation-duration: 0.75s;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  transform: translate3d(0, -100%, 0);
}

@-webkit-keyframes fadeInDownBig {
  0% {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInDownBig {
  0% {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.fadeInDownBig {
  -webkit-animation-name: fadeInDownBig;
  animation-name: fadeInDownBig;
}

@-webkit-keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.fadeInLeft {
  -webkit-animation-name: fadeInLeft;
  animation-name: fadeInLeft;
}

@-webkit-keyframes fadeInLeftBig {
  0% {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInLeftBig {
  0% {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.fadeInLeftBig {
  -webkit-animation-name: fadeInLeftBig;
  animation-name: fadeInLeftBig;
}

@-webkit-keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.fadeInRight {
  -webkit-animation-name: fadeInRight;
  animation-name: fadeInRight;
  -webkit-animation-duration: 0.75s;
  animation-duration: 0.75s;
}

@-webkit-keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.fadeInUp {
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
  -webkit-animation-duration: 0.75s;
  animation-duration: 0.75s;
}
</style>
