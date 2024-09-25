<template>
  <div class="live-container">
    <div
      v-if="props.noBanner === false && banner && banner.desktopImageUrl && banner.mobileImageUrl"
      class="banner-container"
    >
      <div class="promo-bg isDesktop" :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'" />
      <div class="promo-bg isMobile" :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'" />
    </div>
    <div class="section-product">
      <div class="item-group" data-aos="fade-in" data-aos-easing="ease-out" data-aos-duration="1000">
        <div v-for="(p, index) in pokerGames" :key="index" class="set aos-init aos-animate" data-aos="fade-up">
          <div
            class="items"
            @click="playGame(p.name, p.code, p.gameCode, p.status)"
            :style="'background-image: url(' + p.bigbg + ')'"
          >
            <!-- <div class="theme">
              <img :src="p.bg" alt="" />
            </div>
            <div class="main-object">
              <img :src="p.main" alt="" />
            </div> -->
            <div class="txt">
              <!-- <img :style="p.name === 'Evolution' ? 'max-height:23px;' : ''" :src="p.logo" /> -->
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
import { defineProps, onMounted, ref } from "vue";
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
  loadPromoBanner("POKER").then((res) => {
    if (res.code === 0) {
      banner.value = res.data[0];
      console.log(banner);
    }
  });
};
const pokerGames = [
  {
    code: "JILI",
    name: "Jili Games",
    status: "NORMAL",
    gameName: "Jili",
    gameCode: "64",
    bigbg: require("../../assets/images/games/poker/pokerjili.png"),
    text: "JILI chess and card game with a variety. It turns out to be a highly restored offline game experience and professional competition. Come try it out today and win some attractive prizes!"
    // bg: require("../../assets/images/games/poker/poker_1.jpg"),
    // main: require("../../assets/images/games/poker/poker1_1.png"),
    // logo: require("../../assets/images/common/logo/jl.png")
  },
  {
    code: "RICH88",
    name: "Rich88",
    status: "NORMAL",
    gameName: "Rich88",
    bigbg: require("../../assets/images/games/poker/pokerr88.png"),
    text: "A variety of chess and cards for you to choose from. Chess and cards show your mind, competitive entertainment burns your brain, friends meet to compete, games change your life!"
    // bg: require("../../assets/images/games/poker/poker_2.jpg"),
    // main: require("../../assets/images/games/poker/poker2_01.png"),
    // logo: require("../../assets/images/common/logo/RICH88.png")
  },
  {
    code: "KM",
    name: "KM",
    status: "NORMAL",
    gameName: "KM",
    bigbg: require("../../assets/images/games/poker/pokerkm.png"),
    text: "KingMaker chess and cards try different rules and gameplay to bring you a smooth playing experience. Entertainment and competition bring smooth online competitive interaction!"
    // bg: require("../../assets/images/games/poker/poker_3.jpg"),
    // main: require("../../assets/images/games/poker/poker3_01.png"),
    // logo: require("../../assets/images/common/logo/km.png")
  }
];
onMounted(() => {
  loadBanner();
});
</script>
<style scoped lang="scss">
$max-width: $container-width;
.dark-theme {
  .live-container {
    background-color: linear-gradient(to bottom, #23263c, #190f25);
  }
}
.live-container {
  background-image: url(../../assets/images/index/centerbg.png);

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
    gap: 20px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
    // display: flex;
    // flex-wrap: wrap;
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
    margin: auto;
    //overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 1vw;
    .theme {
      overflow: hidden;
      img {
        width: 100%;
        vertical-align: middle;
        margin-top: 95px;
        border-radius: 20px 20px 0 0;
      }
    }
    .main-object {
      position: absolute;
      top: 0;
      right: 0px;
      height: 233px;
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
      padding: 20px;
      color: #ffffff;
      width: 100%;
      border-radius: 0 0 12px 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      height: 6.5vw;
      // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2196078431);
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
        max-height: 45px;
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
