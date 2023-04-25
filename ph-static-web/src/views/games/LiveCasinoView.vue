<template>
  <div class="live-container">
    <div
      v-if="banner && banner.desktopImageUrl && banner.mobileImageUrl"
      class="banner-container"
    >
      <div
        class="promo-bg isDesktop"
        :style="
          'background-image: url(' + imgURL + banner.desktopImageUrl + ')'
        "
      ></div>
      <div
        class="promo-bg isMobile"
        :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"
      ></div>
    </div>
    <div class="section-product">
      <div
        class="item-group"
        data-aos="slide-down"
        data-aos-easing="ease-out"
        data-aos-duration="1000"
      >
        <div
          v-for="(p, index) in hotTrendingGames"
          :key="index"
          class="set aos-init aos-animate"
          data-aos="fade-up"
        >
          <div
            class="items"
            @click="playGame(p.name, p.code, p.gameCode, p.status)"
          >
            <div class="theme">
              <img :src="p.bg" alt="" />
            </div>
            <div class="main-object">
              <img :src="p.main" alt="" />
            </div>
            <div class="txt">
              <img
                :style="p.name === 'Evolution' ? 'max-height:23px;' : ''"
                :src="p.logo"
              />
              <p>{{ p.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <GameModal ref="casinoGame"></GameModal>
    </div>
  </div>
</template>

<script setup>
import { loadPromoBanner } from "@/api/index/promo";
import { onMounted, ref } from "vue";
import GameModal from "@/components/modal/GameModal";
const imgURL = process.env.VUE_APP_IMAGE_CDN + "/";

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
    code: "Evo",
    name: "Evolution",
    status: "NORMAL",
    gameName: "EVO",
    bg: require("../../assets/images/games/liveCasino/live_1.jpg"),
    main: require("../../assets/images/games/liveCasino/live1_1.png"),
    logo: require("../../assets/images/common/logo/EVO.png"),
    text: "In the Evolution live casino, there are the world's first 6-card start, VIP tables, badge baccarat, intelligent control baccarat waiting for you to enjoy non-stop.",
  },
  {
    code: "AWC",
    name: "AG Sexy",
    status: "NORMAL",
    gameName: "AE Sexy",
    gameCode: "MX-LIVE-001",
    bg: require("../../assets/images/games/liveCasino/live_2.jpg"),
    main: require("../../assets/images/games/liveCasino/live2_01.png"),
    logo: require("../../assets/images/common/logo/ae_2.png"),
    text: "AE Casino, Asia's most potential live-action video. The interface is simple and easy to operate, cross-platform, download-free, and fun anytime, anywhere!",
  },
  {
    code: "EZUGI",
    name: "Ezugi",
    status: "NORMAL",
    gameName: "Ezugi",
    bg: require("../../assets/images/games/liveCasino/live_3.jpg"),
    main: require("../../assets/images/games/liveCasino/live3_01.png"),
    logo: require("../../assets/images/common/logo/ezugi.png"),
    text: "The EZUGI entertainment platform with hundreds of well-trained professional dealers, bring you just like real casino experience.",
  },
  // {
  //   code: "SA",
  //   name: "SA gaming",
  //   gameName: "SA",
  //   bg: require("../../assets/images/games/liveCasino/live_4.jpg"),
  //   main: require("../../assets/images/games/liveCasino/live4_01.png"),
  //   logo: require("../../assets/images/common/logo/SA.png"),
  //   text: "SA Gaming has been committed to creating a mobile entertainment platform with both gameplay and creativity.",
  // },
];
onMounted(() => {
  loadBanner();
});
</script>
<style scoped lang="scss">
$max-width: 1400px;
.live-container {
  background: linear-gradient(to bottom, #23263c, #190f25);
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
  padding: 50px 0 80px 0;
  max-width: $max-width;
  /* position: relative; */
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
    grid-template-columns: repeat(3, 1fr);
    &:last-child {
      padding-top: 30px;
    }
  }
  .set {
    margin: auto;
    width: 100%;
    // &:nth-child(1) {
    //   grid-column-start: 2;
    //   grid-column-end: 3;
    // }
  }
  .items {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 320px;
    margin: auto;
    overflow: hidden;
    .theme {
      overflow: hidden;
      img {
        width: 100%;
        vertical-align: middle;
        margin-top: 70px;
        border-radius: 20px 20px 0 0;
      }
    }
    .main-object {
      position: absolute;
      top: 0;
      right: 0px;
      height: 220px;
      transform: translateY(0px);
      transition: 0.3s;
      display: flex;
      align-items: flex-end;
      img {
        vertical-align: middle;
        width: 100%;
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
      background: #2b2b4b;
      padding: 20px;
      color: #fff;
      width: 100%;
      filter: brightness(0.9);
      min-height: 130px;
      border-radius: 0 0 20px 20px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      p {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 16px;
        margin: 0;
      }
      img {
        max-width: 50%;
        margin: 0 0 10px;
        display: block;
        max-height: 30px;
      }
    }
    &:hover {
      .txt {
        opacity: 1;
        filter: brightness(1);
      }
    }
  }
}
@media (max-width: 768px) {
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
