<template>
  <div class="live-container">
    <div
      v-if="props.noBanner === false && banner && banner.desktopImageUrl && banner.mobileImageUrl"
      class="banner-container"
    >
      <div class="promo-bg isDesktop" :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'" />
      <div class="promo-bg isMobile" :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'" />
    </div>
    <div class="section-product" id="parent">
      <div
        class="item-group"
        data-aos="fade-in"
        data-aos-easing="ease-out"
        data-aos-duration="1000"
        data-aos-anchor="#parent"
      >
        <div v-for="(p, index) in hotTrendingGames" :key="index" class="set aos-init aos-animate" data-aos="fade-up">
          <div
            class="items"
            @click="playGame(p.name, p.code, p.gameCode, p.status)"
            :style="'background-image: url(' + p.bigbg + ')'"
          >
            <div class="txt">
              <p>{{ p.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <GameModal ref="casinoGame" />
    </div>
  </div>
</template>

<script setup>
import { loadPromoBanner } from "@/api/index/promo";
import { onMounted, ref, defineProps } from "vue";
import GameModal from "@/components/modal/GameModal";
const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";

const props = defineProps({
  noBanner: {
    type: Boolean,
    default: false
  }
});

const casinoGame = ref(null);
function playGame(gameName, platformCode, gameCode, status) {
  casinoGame.value.open(gameName, platformCode, gameCode, status);
}
const banner = ref([]);
const loadBanner = () => {
  loadPromoBanner("LIVE").then((res) => {
    if (res.code === 0) {
      banner.value = res.data[0];
      console.log(banner);
    }
  });
};
const hotTrendingGames = [
  {
    code: "EvoAce",
    name: "Evolution",
    status: "NORMAL",
    gameName: "EVO",
    bigbg: require("../../assets/images/games/liveCasino/live-evo.png"),
    // bg: require("../../assets/images/games/liveCasino/live-1.png"),
    // main: require("../../assets/images/games/liveCasino/main-1.png"),
    // sub: require("../../assets/images/games/liveCasino/sub-1.png"),
    // logo: require("../../assets/images/common/logo/evo-white.png"),
    gradient: "rgba(32, 0, 52, 0.6) 0%, rgba(50, 50, 50, 0) 100%",
    wordbg: "#12005999",
    text: "In the Evolution live casino, there are the world's first 6-card start, VIP tables, badge baccarat, intelligent control baccarat waiting for you to enjoy non-stop."
  },
  {
    code: "AWC",
    name: "AG Sexy",
    status: "NORMAL",
    gameName: "AE Sexy",
    gameCode: "MX-LIVE-001",
    bigbg: require("../../assets/images/games/liveCasino/live-ae.png"),
    // bg: require("../../assets/images/games/liveCasino/live-2.png"),
    // main: require("../../assets/images/games/liveCasino/main-2.png"),
    // sub: require("../../assets/images/games/liveCasino/sub-2.png"),
    // logo: require("../../assets/images/common/logo/ae-white.png"),
    gradient: "rgba(114, 1, 143, 0.6) 0%, rgba(23, 0, 23, 0) 100%",
    wordbg: "#680B8899",
    text: "AE Casino, Asia's most potential live-action video. The interface is simple and easy to operate, cross-platform, download-free, and fun anytime, anywhere!"
  },
  {
    code: "EZUGI",
    name: "Ezugi",
    status: "NORMAL",
    gameName: "Ezugi",
    bigbg: require("../../assets/images/games/liveCasino/live-ezugi.png"),
    gradient: "rgba(121, 52, 2, 0.6) 0%, rgba(50, 50, 50, 0) 100%",
    wordbg: "#4D2A0099",
    text: "The EZUGI entertainment platform with hundreds of well-trained professional dealers, bring you just like real casino experience."
  }
];
onMounted(() => {
  loadBanner();

  // console.log(props.noBanner);
});
</script>
<style scoped lang="scss">
$max-width: $container-width;
.live-container {
  // background: #fff;
  background: url(../../assets/images/index/centerbg.png);

  .banner-container {
    width: 100%;
    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      &.isDesktop {
        display: block;
        height: 430px;
      }
      &.isMobile {
        display: none;
        height: 220px;
      }
    }
  }
}
.section-product {
  width: 95%;
  margin: 0 auto;
  // padding: 50px 0 80px 0;
  // max-width: 1020px;
  position: relative;
  z-index: 2;

  .title {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      margin-top: 20px;
      background-color: rgb(214, 214, 214);
    }
  }
  .subintro {
    font-size: 16px;
    width: 100%;
    margin: auto;
    font-weight: 100;
    color: #190f25;
  }
  .item-group {
    padding-top: 50px;
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
    &:last-child {
      padding-top: 30px;
    }
  }
  .set {
    margin: auto;
    width: 100%;
  }
  .items {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 20vw;
    // height: 369px;
    margin: auto;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 1vw;
    .theme {
      overflow: hidden;
      img {
        width: 100%;
        vertical-align: middle;
        // border-radius: 20px 20px 0 0;
      }
    }
    .main-object {
      position: absolute;
      top: 0;
      bottom: 0px;
      height: 15vw;
      transform: translateY(0px);
      transition: 0.3s;
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      img {
        vertical-align: middle;
        &.logo {
          margin: 0 auto;
          height: 5vw;
        }
        &.imgmain {
          height: 100%;
          width: unset;
          // position: absolute;
          right: 0px;
        }
        &.imgsub {
          height: 30%;
          width: unset;
          // position: absolute;
        }
      }
    }
    &:hover .main-object {
      position: absolute;
      transform: translateX(-25px);
    }
    .sub-object {
      display: none;
      position: absolute;
      top: 0;
      left: 10px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
    .txt {
      position: absolute;
      bottom: 0px;
      padding: 20px;
      color: #ffffff;
      width: 100%;
      // min-height: 130px;
      border-radius: 0 0 12px 12px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      height: 6.5vw;
      // box-shadow: 0px 0px 8px 0px #00000038;

      p {
        font-size: 0.9vw;
        line-height: 1.5vw;
        font-weight: normal;
        font-stretch: normal;
        margin: 0;
      }
      img {
        max-width: 50%;
        margin: 0 0 10px;
        display: block;
        max-height: 30px;
      }
    }
    // &:hover {
    //   .txt {
    //     opacity: 1;
    //     filter: brightness(1);
    //   }
    // }
  }
}
.dark-theme {
  .section-product .items .txt p {
    color: #ffffff;
  }
}
@media (max-width: 767px) {
  .section-product {
    padding: 0 0 80px;
    .item-group {
      grid-template-columns: repeat(2, 1fr);
    }
    .set {
      &:nth-child(1) {
        grid-column-start: 1;
        grid-column-end: 1;
      }
    }
  }
  .live-container {
    .banner-container {
      .promo-bg {
        &.isDesktop {
          display: none;
        }
        &.isMobile {
          display: block;
        }
      }
    }
  }
}
@media (max-width: 500px) {
  .section-product .item-group {
    grid-template-columns: 1fr;
  }
  .section-product .items .main-object {
    height: 230px;
  }
}
</style>
