a
<template>
  <div class="poker-container">
    <div class="banner-container">
      <div
        v-if="banner.desktopImageUrl"
        class="promo-bg isDesktop"
        :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'"
      ></div>
      <div
        v-if="banner.mobileImageUrl"
        class="promo-bg isMobile"
        :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"
      ></div>
    </div>
    <div class="section-product">
      <div class="item-group" data-aos="slide-down" data-aos-easing="ease-out" data-aos-duration="1000">
        <div v-for="(p, index) in pokerGames" :key="index" class="set aos-init aos-animate" data-aos="fade-up">
          <div class="items" @click="playGame(p.name, p.code, p.gameCode)">
            <div class="theme">
              <img :src="p.bg" alt="" />
            </div>
            <div class="main-object">
              <img :src="p.main" alt="" />
            </div>
            <div class="txt">
              <img :style="p.name === 'Evolution' ? 'max-height:23px;' : ''" :src="p.logo" />
              <p>
                The most innovative gaming experience, Most Classic Live Games.Live Baccarat, Sic Bo, Dragon Tiger,
                Roulette, Blackjack and other live game shows.
              </p>
            </div>
          </div>
        </div>
      </div>
      <GameModal ref="item-group"></GameModal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { loadPromoBanner } from "@/api/index/promo";
import GameModal from "components/modal/GameModal";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
const imgURL = process.env.IMAGE_CDN + "/";
const casinoGame = ref(null);
const banner = ref([]);

const loadBanner = () => {
  api
    .get("/opt-session/promo/banner", {
      params: {
        category: "POKER"
      }
    })
    .then((response) => {
      if (response.code === 0) {
        banner.value = response.data[0];
      }
    });
};
function playGame(gameName, platformCode, gameCode, gameStatus) {
  casinoGame.value.open(gameName, platformCode, gameCode, gameStatus);
}
const $q = useQuasar();
const pokerGames = [
  {
    code: "JILI",
    name: "Jili Games",
    gameName: "Jili",
    gameCode: "64",
    bg: require("../../assets/images/games/poker/poker_1.jpg"),
    main: require("../../assets/images/games/poker/poker1_1.png"),
    logo: require("../../assets/images/common/logo/jl.png")
  },
  {
    code: "RICH88",
    name: "Rich88",
    gameName: "Rich88",
    bg: require("../../assets/images/games/poker/poker_2.jpg"),
    main: require("../../assets/images/games/poker/poker2_01.png"),
    logo: require("../../assets/images/common/logo/RICH88.png")
  },
  {
    code: "KM",
    name: "KM",
    gameName: "KM",
    bg: require("../../assets/images/games/poker/poker_3.jpg"),
    main: require("../../assets/images/games/poker/poker3_01.png"),
    logo: require("../../assets/images/common/logo/km.png")
  }
];

onMounted(() => {
  loadBanner();
});
</script>
<style scoped lang="scss">
$max-width: 1400px;
.poker-container {
  background: linear-gradient(to bottom, #23263c, #190f25);

  .banner-container {
    width: 100%;
    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      overflow: hidden;
      height: 180px;
      margin: 10px;
      border-radius: 10px;
      img {
        width: 100%;
      }
      &.isDesktop {
        display: block;
      }
      &.isMobile {
        display: none;
      }
    }
  }
}
.section-product {
  width: 95%;
  margin: 0 auto;
  padding: 50px 0 80px 0;
  max-width: $max-width;
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
    grid-template-columns: 1fr 1fr 1fr;
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
    height: 340px;
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
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;
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
      padding: 20px 80px 20px 20px;
      color: #fff;
      width: 100%;
      filter: brightness(0.9);
      border-radius: 0 0 20px 20px;

      p {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 16px;
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
}
</style>
<template>
  <div class="live-container">
    <q-scroll-area style="height: 100%; padding-bottom: 10px" :thumb-style="{ width: 0 }">
      <q-intersection transition="scale">
        <!-- <div v-if="banner.mobileImageUrl" class="banner-container">
          <div
            class="promo-bg"
            :style="
              'background-image: url(' + imgURL + banner.mobileImageUrl + ')'
            "
          ></div>
        </div> -->

        <div class="section-product">
          <div class="item-group" data-aos="slide-down" data-aos-easing="ease-out" data-aos-duration="1000">
            <div
              v-for="(p, index) in hotTrendingGames"
              :key="index"
              class="set aos-init aos-animate"
              data-aos="fade-up"
            >
              <div class="items" @click="playGame(p.name, p.code, p.gameCode, p.status)">
                <div class="bgimg">
                  <div class="theme">
                    <img :src="p.bg" alt="" />
                    <img
                      class="logo"
                      :style="p.name === 'Evolution' ? 'max-height:15px; bottom: 12%;' : ''"
                      :src="p.logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <GameModal ref="casinoGame"></GameModal>
        </div>
        <!--        <img src="../../assets/images/games/liveCasino/live-bg.png" />-->
      </q-intersection>
    </q-scroll-area>
  </div>
</template>

<script setup>
// import { loadPromoBanner } from "@/api/index/promo";
import { onMounted, ref } from "vue";
import GameModal from "components/modal/GameModal";
import { api } from "boot/axios";
const imgURL = process.env.IMAGE_CDN + "/";

const casinoGame = ref(null);
function playGame(gameName, platformCode, gameCode) {
  casinoGame.value.open(gameName, platformCode, gameCode);
}
// const banner = ref([]);

// const loadBanner = () => {
//   api
//     .get("/opt-session/promo/banner", {
//       params: {
//         category: "LIVE"
//       }
//     })
//     .then((ret) => {
//       const res = ret.data;
//       if (res.code === 0) {
//         banner.value = res.data[0];
//       }
//     });
// };
const hotTrendingGames =const pokerGames = [
  {
    code: "JILI",
    name: "Jili Games",
    gameName: "Jili",
    gameCode: "64",
    bg: require("../../assets/images/games/poker/poker_1.jpg"),
    main: require("../../assets/images/games/poker/poker1_1.png"),
    logo: require("../../assets/images/common/logo/jl.png")
  },
  {
    code: "RICH88",
    name: "Rich88",
    gameName: "Rich88",
    bg: require("../../assets/images/games/poker/poker_2.jpg"),
    main: require("../../assets/images/games/poker/poker2_01.png"),
    logo: require("../../assets/images/common/logo/RICH88.png")
  },
  {
    code: "KM",
    name: "KM",
    gameName: "KM",
    bg: require("../../assets/images/games/poker/poker_3.jpg"),
    main: require("../../assets/images/games/poker/poker3_01.png"),
    logo: require("../../assets/images/common/logo/km.png")
  }
];
onMounted(() => {});
</script>
<style scoped lang="scss">
$max-width: 1400px;
.live-container {
  background: linear-gradient(to bottom, #23263c, #190f25);
  img {
    width: 100%;
  }
  .banner-container {
    width: 100%;
    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      height: 180px;
      margin: 10px;
      border-radius: 10px;
      img {
        width: 100%;
      }
    }
  }
}
.section-product {
  width: 95%;
  margin: 0 auto;
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
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
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
    margin: auto;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    .bgimg {
      position: relative;

      .theme {
        overflow: hidden;
        img {
          width: 100%;
          vertical-align: middle;
          margin-top: 30px;
          &.logo {
            width: unset;
            height: 12%;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 10%;
            margin: auto;
          }
        }
      }
      .main-object {
        position: absolute;
        bottom: 0;
        right: 0px;
        height: auto;
        overflow: hidden;
        transform: translateY(0px);
        transition: 0.3s;
        display: flex;
        align-items: flex-end;
        img {
          vertical-align: middle;
          // width: 100%;
          width: 75%;
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
      padding: 10px 20px;
      background: linear-gradient(transparent, #2b2b4b);
      border-radius: 0 0 20px 20px;
      // position: absolute;
      // bottom: 0px;
      // // background: #2b2b4b;
      // padding: 20px;
      // color: #fff;
      // width: 100%;
      // filter: brightness(0.9);
      // border-radius: 0 0 20px 20px;

      p {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 16px;
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
// @media (max-width: 768px) {
//   .section-product {
//     padding: 0 0 80px;
//     .item-group {
//       grid-template-columns: repeat(2, 1fr);
//     }
//     .set {
//       &:nth-child(1) {
//         grid-column-start: 1;
//         grid-column-end: 1;
//       }
//     }
//   }
//   .live-container {
//     .banner-container {
//       .promo-bg {
//         &.isDesktop {
//           display: none;
//         }
//         &.isMobile {
//           display: block;
//         }
//       }
//     }
//   }
// }
// @media (max-width: 500px) {
//   .section-product .item-group {
//     grid-template-columns: 1fr;
//   }
//   .section-product .items .main-object {
//     height: 230px;
//   }
// }
</style>
