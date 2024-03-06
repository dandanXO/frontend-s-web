<template>
  <div class="app-container">
    <div class="bg-video-wrap"><video id="bg-video" muted="muted" autoplay="autoplay" loop="loop" poster="../assets/app/poster.jpg"><source src="../assets/app/videobg.webm" type="video/webm"></video></div>
    <div id="sec-content">
    <div class="intro-container">
      <img src="../assets/app/toplabel.png" alt="最佳电竞竞猜app" width="570px" class="img-slogan" data-v-93674b8c="">
      <img src="../assets/app/light.png" alt="最佳电竞竞猜app" width="570px" class="img-slogan" data-v-93674b8c="">
      <div class="text-content">
        海量体育、电竞顶尖赛事<br>
        真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中<br>
        实时直播，热门活动享不停
      </div>
      <div class="buttons">
        <div class="btn iphone">
          <img src="../assets/app/ios-icon.png">
          iPhone 版
          <div class="qrcode">
            <VueQRCodeComponent :size="120" :text="downloadUrl" />
          </div>
        </div>
        <div class="btn android">
          <img src="../assets/app/android-icon.png">
          Android 版
          <div class="qrcode">
            <VueQRCodeComponent :size="120" :text="downloadUrl" />
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-wrap">
      
      
  <swiper
      :direction="'vertical'"
      :loop="true"
      @swiper="onSwiper"
      :autoplay="{ delay: 3000, reverseDirection: true, }"
      effect="fade"
      :auto-height="false"
      :allow-slide-next="false"
    >
      <swiper-slide style="position: relative;" v-for="i in 3">
        <img class="fadeIn" :src="require(`../assets/app/phone-${i}.png`)">
        <img class="bounceIn" :src="require(`../assets/app/words-${i}.png`)">
        <img class="fadeInUp" :src="require(`../assets/app/bottom-${i}.png`)">
        <img class="fadeInRight" :src="require(`../assets/app/right-${i}.png`)">
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
import SwiperCore from 'swiper'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
SwiperCore.use([ EffectFade, Autoplay])

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
    GameModal,
    // VueQrious,
    VueQRCodeComponent
  },
  setup() {
    const onSwiper = (swiper) => {
    };

    const onSlideChange = () => {
        console.log('slide change');
      };
    const appGame = ref(null);
    const platforms = ref([
      {
        code: "H5",
        name: "手机H5网页",
        link: window.location.host,
        mobile: window.location.host,
      },
      {
        code: "QZ",
        name: "全站APP下载",
        link: ""
      },
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
            if(platform.code=='QZ'){
              platform.link= downloadUrl.value;
            }
          })
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const swiperInstance = ref(null);
    const swiperKey = ref(0)
    onMounted(() => {
      aos.refresh()
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
      swiperInstance
    };
  }
});
</script>

<style scoped lang="scss">
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
}
.bg-video-wrap, .bg-video-wrap #bg-video {
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
      transition-duration: .3s;
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
    gap: 20px;
    margin-bottom: 200px;
    .btn {
    background: url(../assets/app/btn.png)no-repeat center center;
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
  }
}
.animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

.animated.infinite {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite
}

.animated.hinge {
    -webkit-animation-duration: 2s;
    animation-duration: 2s
}
@-webkit-keyframes bounceIn {
    0%,20%,40%,60%,80%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: scale3d(.3,.3,.3)
    }

    20% {
        transform: scale3d(1.1,1.1,1.1)
    }

    40% {
        transform: scale3d(.9,.9,.9)
    }

    60% {
        opacity: 1;
        transform: scale3d(1.03,1.03,1.03)
    }

    80% {
        transform: scale3d(.97,.97,.97)
    }

    to {
        opacity: 1;
        transform: scaleX(1)
    }
}

@keyframes bounceIn {
    0%,20%,40%,60%,80%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: scale3d(.3,.3,.3)
    }

    20% {
        transform: scale3d(1.1,1.1,1.1)
    }

    40% {
        transform: scale3d(.9,.9,.9)
    }

    60% {
        opacity: 1;
        transform: scale3d(1.03,1.03,1.03)
    }

    80% {
        transform: scale3d(.97,.97,.97)
    }

    to {
        opacity: 1;
        transform: scaleX(1)
    }
}

.bounceIn {
    -webkit-animation-name: bounceIn;
    animation-name: bounceIn;
    -webkit-animation-duration: .75s;
    animation-duration: .75s;
}

@-webkit-keyframes bounceInDown {
    0%,60%,75%,90%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: translate3d(0,-3000px,0)
    }

    60% {
        opacity: 1;
        transform: translate3d(0,25px,0)
    }

    75% {
        transform: translate3d(0,-10px,0)
    }

    90% {
        transform: translate3d(0,5px,0)
    }

    to {
        transform: none
    }
}

@keyframes bounceInDown {
    0%,60%,75%,90%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: translate3d(0,-3000px,0)
    }

    60% {
        opacity: 1;
        transform: translate3d(0,25px,0)
    }

    75% {
        transform: translate3d(0,-10px,0)
    }

    90% {
        transform: translate3d(0,5px,0)
    }

    to {
        transform: none
    }
}

.bounceInDown {
    -webkit-animation-name: bounceInDown;
    animation-name: bounceInDown
}

@-webkit-keyframes bounceInLeft {
    0%,60%,75%,90%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: translate3d(-3000px,0,0)
    }

    60% {
        opacity: 1;
        transform: translate3d(25px,0,0)
    }

    75% {
        transform: translate3d(-10px,0,0)
    }

    90% {
        transform: translate3d(5px,0,0)
    }

    to {
        transform: none
    }
}

@keyframes bounceInLeft {
    0%,60%,75%,90%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: translate3d(-3000px,0,0)
    }

    60% {
        opacity: 1;
        transform: translate3d(25px,0,0)
    }

    75% {
        transform: translate3d(-10px,0,0)
    }

    90% {
        transform: translate3d(5px,0,0)
    }

    to {
        transform: none
    }
}

.bounceInLeft {
    -webkit-animation-name: bounceInLeft;
    animation-name: bounceInLeft
}

@-webkit-keyframes bounceInRight {
    0%,60%,75%,90%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: translate3d(3000px,0,0)
    }

    60% {
        opacity: 1;
        transform: translate3d(-25px,0,0)
    }

    75% {
        transform: translate3d(10px,0,0)
    }

    90% {
        transform: translate3d(-5px,0,0)
    }

    to {
        transform: none
    }
}

@keyframes bounceInRight {
    0%,60%,75%,90%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: translate3d(3000px,0,0)
    }

    60% {
        opacity: 1;
        transform: translate3d(-25px,0,0)
    }

    75% {
        transform: translate3d(10px,0,0)
    }

    90% {
        transform: translate3d(-5px,0,0)
    }

    to {
        transform: none
    }
}

.bounceInRight {
    -webkit-animation-name: bounceInRight;
    animation-name: bounceInRight
}

@-webkit-keyframes bounceInUp {
    0%,60%,75%,90%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: translate3d(0,3000px,0)
    }

    60% {
        opacity: 1;
        transform: translate3d(0,-20px,0)
    }

    75% {
        transform: translate3d(0,10px,0)
    }

    90% {
        transform: translate3d(0,-5px,0)
    }

    to {
        transform: translateZ(0)
    }
}

@keyframes bounceInUp {
    0%,60%,75%,90%,to {
        transition-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
        opacity: 0;
        transform: translate3d(0,3000px,0)
    }

    60% {
        opacity: 1;
        transform: translate3d(0,-20px,0)
    }

    75% {
        transform: translate3d(0,10px,0)
    }

    90% {
        transform: translate3d(0,-5px,0)
    }

    to {
        transform: translateZ(0)
    }
}

.bounceInUp {
    -webkit-animation-name: bounceInUp;
    animation-name: bounceInUp;
    
}

@-webkit-keyframes bounceOut {
    20% {
        transform: scale3d(.9,.9,.9)
    }

    50%,55% {
        opacity: 1;
        transform: scale3d(1.1,1.1,1.1)
    }

    to {
        opacity: 0;
        transform: scale3d(.3,.3,.3)
    }
}

@keyframes bounceOut {
    20% {
        transform: scale3d(.9,.9,.9)
    }

    50%,55% {
        opacity: 1;
        transform: scale3d(1.1,1.1,1.1)
    }

    to {
        opacity: 0;
        transform: scale3d(.3,.3,.3)
    }
}

.bounceOut {
    -webkit-animation-name: bounceOut;
    animation-name: bounceOut;
    -webkit-animation-duration: .75s;
    animation-duration: .75s
}

@-webkit-keyframes bounceOutDown {
    20% {
        transform: translate3d(0,10px,0)
    }

    40%,45% {
        opacity: 1;
        transform: translate3d(0,-20px,0)
    }

    to {
        opacity: 0;
        transform: translate3d(0,2000px,0)
    }
}

@keyframes bounceOutDown {
    20% {
        transform: translate3d(0,10px,0)
    }

    40%,45% {
        opacity: 1;
        transform: translate3d(0,-20px,0)
    }

    to {
        opacity: 0;
        transform: translate3d(0,2000px,0)
    }
}

.bounceOutDown {
    -webkit-animation-name: bounceOutDown;
    animation-name: bounceOutDown
}

@-webkit-keyframes bounceOutLeft {
    20% {
        opacity: 1;
        transform: translate3d(20px,0,0)
    }

    to {
        opacity: 0;
        transform: translate3d(-2000px,0,0)
    }
}

@keyframes bounceOutLeft {
    20% {
        opacity: 1;
        transform: translate3d(20px,0,0)
    }

    to {
        opacity: 0;
        transform: translate3d(-2000px,0,0)
    }
}

.bounceOutLeft {
    -webkit-animation-name: bounceOutLeft;
    animation-name: bounceOutLeft
}

@-webkit-keyframes bounceOutRight {
    20% {
        opacity: 1;
        transform: translate3d(-20px,0,0)
    }

    to {
        opacity: 0;
        transform: translate3d(2000px,0,0)
    }
}

@keyframes bounceOutRight {
    20% {
        opacity: 1;
        transform: translate3d(-20px,0,0)
    }

    to {
        opacity: 0;
        transform: translate3d(2000px,0,0)
    }
}

.bounceOutRight {
    -webkit-animation-name: bounceOutRight;
    animation-name: bounceOutRight
}

@-webkit-keyframes bounceOutUp {
    20% {
        transform: translate3d(0,-10px,0)
    }

    40%,45% {
        opacity: 1;
        transform: translate3d(0,20px,0)
    }

    to {
        opacity: 0;
        transform: translate3d(0,-2000px,0)
    }
}

@keyframes bounceOutUp {
    20% {
        transform: translate3d(0,-10px,0)
    }

    40%,45% {
        opacity: 1;
        transform: translate3d(0,20px,0)
    }

    to {
        opacity: 0;
        transform: translate3d(0,-2000px,0)
    }
}

.bounceOutUp {
    -webkit-animation-name: bounceOutUp;
    animation-name: bounceOutUp
}

@-webkit-keyframes fadeIn {
    0% {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

.fadeIn {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
    -webkit-animation-duration: .75s;
    animation-duration: .75s
}

@-webkit-keyframes fadeInDown {
    0% {
        opacity: 0;
    }

    to {
        opacity: 1;
        transform: none
    }
}

@keyframes fadeInDown {
    0% {
        opacity: 0;
        transform: translate3d(0,-100%,0)
    }

    to {
        opacity: 1;
        transform: none
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
        transform: translate3d(0,-2000px,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

@keyframes fadeInDownBig {
    0% {
        opacity: 0;
        transform: translate3d(0,-2000px,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

.fadeInDownBig {
    -webkit-animation-name: fadeInDownBig;
    animation-name: fadeInDownBig
}

@-webkit-keyframes fadeInLeft {
    0% {
        opacity: 0;
        transform: translate3d(-100%,0,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

@keyframes fadeInLeft {
    0% {
        opacity: 0;
        transform: translate3d(-100%,0,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

.fadeInLeft {
    -webkit-animation-name: fadeInLeft;
    animation-name: fadeInLeft
}

@-webkit-keyframes fadeInLeftBig {
    0% {
        opacity: 0;
        transform: translate3d(-2000px,0,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

@keyframes fadeInLeftBig {
    0% {
        opacity: 0;
        transform: translate3d(-2000px,0,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

.fadeInLeftBig {
    -webkit-animation-name: fadeInLeftBig;
    animation-name: fadeInLeftBig
}

@-webkit-keyframes fadeInRight {
    0% {
        opacity: 0;
        transform: translate3d(100%,0,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

@keyframes fadeInRight {
    0% {
        opacity: 0;
        transform: translate3d(100%,0,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

.fadeInRight {
    -webkit-animation-name: fadeInRight;
    animation-name: fadeInRight;
    -webkit-animation-duration: .75s;
    animation-duration: .75s
}


@-webkit-keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translate3d(0,100%,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translate3d(0,100%,0)
    }

    to {
        opacity: 1;
        transform: none
    }
}

.fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
    -webkit-animation-duration: .75s;
    animation-duration: .75s
}

</style>
