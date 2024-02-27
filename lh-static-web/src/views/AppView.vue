<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="banner-w-dl-btn-wrapper">
        <div class="banner-container">
          <div class="left">
            <div class="info">
              <div>安全稳定</div>
              <div>|</div>
              <div>方便快捷</div>
              <div>|</div>
              <div>独家玩法</div>
              <div>
                <img src="../assets/app/logo.png" height="80" />
              </div>
            </div>
            <div class="subtitle">最佳电竞竞猜APP</div>
            <div class="title">雷火电竞</div>
          </div>
          <div class="right">
            <img class="showcase-image" src="../assets/app/phones.png" />
          </div>
        </div>
        <div class="bottom">
          <template v-for="(det, idx) in platforms" :key="idx">
            <div class="platform-button-w-qr-code">
              <div class="platform-button" @click="clickPlat(det)">{{ det.name }}</div>
              <div :class="`platform-qr-code ${selectedPlat === det.code ? 'visible' : ''}`">
                <div class="close-btn" @click="closePlatformQRCode">&#x2716;</div>
                <div class="qr-code-wrapper">
                  <VueQRCodeComponent :size="120" :text="det.link" />
                </div>
                <div class="supported-mobile-os">
                  <img src="../assets/app/apple-icon.png" />
                  <img src="../assets/app/android-icon.png" />
                  <span v-if="det.mobile">手机访问</span>
                </div>
                <div>
                  <a v-if="det.mobile" :href="det.mobile" target="_blank">{{ det.mobile }}</a>
                  <span v-else>手机用户扫码下载</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <GameModal ref="appGame"></GameModal>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import VueQRCodeComponent from "vue-qrcode-component";
import GameModal from "@/components/modal/GameModal";
import { getAppDownloadUrlFromServer } from "@/api/index/site";
import aos from "aos";

export default defineComponent({
  components: {
    GameModal,
    // VueQrious,
    VueQRCodeComponent
  },
  setup() {
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
      closePlatformQRCode
    };
  }
});
</script>

<style scoped lang="scss">
@keyframes fadeInUp {
  from {
    transform: translate3d(0, 40px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.app-container {
  background-image: url(../assets/app/download_bg.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  width: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0;
  font-size: 14px;
  z-index: 0;
  min-height: calc(100vh - 188px);
  display: flex;
  justify-content: center;
  align-items: center;

  .app-container-inner {
    z-index: 1;
    position: relative;
    max-width: $maxwidth;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    // gap: 100px;
    gap: 50px;

    .banner-w-dl-btn-wrapper {
      display: flex;
      flex-direction: column;

      .banner-container {
        display: grid;
        grid-template-columns: 700px 600px;
        align-items: center;

        .left {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0px 50px;
          animation: fadeInUp 0.5s forwards cubic-bezier(0.83, 0.97, 0.05, 1.44);

          .info {
            display: flex;
            gap: 20px;
            align-items: flex-end;
            color: #424f72;
            font-size: 26px;
          }

          .title {
            font-size: 125px;
            font-weight: 700;
            color: #4c88f8;
            letter-spacing: 2.85px;
            line-height: 130px;
          }

          .subtitle {
            font-size: 70px;
            font-weight: 700;
            color: #4c88f8;
            line-height: 80px;
            letter-spacing: 1.65px;
          }
        }

        .right {
          .showcase-image {
            animation: slide-in 0.5s forwards cubic-bezier(0.83, 0.97, 0.05, 1.44);
            width: 100%;

            @keyframes slide-in {
              0% {
                transform: translateZ(0);
              }

              100% {
                transform: translate(-60px, 0);
              }
            }
          }
        }
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        padding: 0px 50px;
        align-items: flex-end;
        gap: 20px;
        padding: 0px 20px;

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

          &.outline {
            background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
            box-shadow: 0px 2px 4.579999923706055px 0px #bbdcff inset;
            box-shadow: 0px -1px 3.6640000343322754px 0px #a2bff4 inset;
            color: #468cff;
          }
        }

        .platform-qr-code {
          position: absolute;
          bottom: -20px;
          margin: auto;
          width: 280px;
          height: 297px;
          box-shadow: 0px 4px 34px 0px #00000033;
          background-color: #ffffff70;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 20px;
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
  }
}
</style>
