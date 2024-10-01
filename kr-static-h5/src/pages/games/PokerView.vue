<template>
  <div class="poker-container">
    <q-scroll-area style="height: 100vh; padding-bottom: 10px" :thumb-style="{ width: 0 }">
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
            <div v-for="(p, index) in pokerGames" :key="index" class="set aos-init aos-animate" data-aos="fade-up">
              <div class="items" @click="playGame(p.name, p.code, p.gameCode, p.status)">
                <div class="bgimg">
                  <div class="theme">
                    <img :src="p.bg" alt="" />
                    <img
                      class="logo"
                      :style="p.name === 'KM' ? 'max-height: 5%; bottom: 15%; left: -5%;' : ''"
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
import { useLocalStorage } from "@vueuse/core";
import GameModal from "components/modal/GameModal";
import { api } from "boot/axios";
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/";

const casinoGame = ref(null);
function playGame(gameName, platformCode, gameCode, gameStatus) {
  casinoGame.value.open(gameName, platformCode, gameCode, gameStatus);
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
const pokerGames = [
  // {
  //   code: "JILI",
  //   name: "Jili Games",
  //   status: "NORMAL",
  //   gameName: "Jili",
  //   gameCode: "64",
  //   bg: require("../../assets/images/games/poker/jili.png"),
  //   main: require("../../assets/images/games/poker/poker1_1.png"),
  //   logo: require("../../assets/images/common/logo/jl.png")
  // },
  // {
  //   code: "RICH88",
  //   name: "Rich88",
  //   status: "NORMAL",
  //   gameName: "Rich88",
  //   bg: require("../../assets/images/games/poker/rich88.png"),
  //   main: require("../../assets/images/games/poker/poker2_01.png"),
  //   logo: require("../../assets/images/common/logo/RICH88.png")
  // },
  // {
  //   code: "KM",
  //   name: "KM",
  //   status: "NORMAL",
  //   gameName: "KM",
  //   bg: require("../../assets/images/games/poker/kingmaker.png"),
  //   main: require("../../assets/images/games/poker/poker3_01.png"),
  //   logo: require("../../assets/images/common/logo/km.png")
  // }
];
onMounted(() => {});
</script>
<style scoped lang="scss">
$max-width: 1400px;
.poker-container {
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
            height: 10%;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 12%;
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
