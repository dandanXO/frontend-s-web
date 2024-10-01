<template>
  <div class="live-container">
    <q-scroll-area style="height: calc(100vh - 90px); padding-bottom: 10px" :thumb-style="{ width: 0 }">
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
              <div class="items" @click="playGame(p.name, p.code, p.gameCode)">
                <div class="bgimg">
                  <div class="theme">
                    <!--                    <img :src="p.bg" alt="" />-->
                    <!--                    <img-->
                    <!--                      class="logo"-->
                    <!--                      :style="-->
                    <!--                        p.name === 'Evolution'-->
                    <!--                          ? 'max-height:15px; bottom: 12%;'-->
                    <!--                          : ''-->
                    <!--                      "-->
                    <!--                      :src="p.logo"-->
                    <!--                    />-->
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
import { useLocalStorage } from "@vueuse/core";

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
const hotTrendingGames = [
  // {
  //   code: "Evo",
  //   name: "Evolution",
  //   status: "NORMAL",
  //   gameName: "EVO",
  //   bg: require("../../assets/images/games/liveCasino/evo.png"),
  //   main: require("../../assets/images/games/liveCasino/live1_1.png"),
  //   logo: require("../../assets/images/common/logo/EVO.png"),
  //   text: "In the Evolution live casino, there are the world's first 6-card start, VIP tables, badge baccarat, intelligent control baccarat waiting for you to enjoy non-stop.",
  // },
  // {
  //   code: "AWC",
  //   name: "AG Sexy",
  //   status: "NORMAL",
  //   gameName: "AE Sexy",
  //   gameCode: "MX-LIVE-001",
  //   bg: require("../../assets/images/games/liveCasino/sexy.png"),
  //   main: require("../../assets/images/games/liveCasino/live2_01.png"),
  //   logo: require("../../assets/images/common/logo/ae_2.png"),
  //   text: "AE Casino, Asia's most potential live-action video. The interface is simple and easy to operate, cross-platform, download-free, and fun anytime, anywhere!",
  // },
  // {
  //   code: "EZUGI",
  //   name: "Ezugi",
  //   status: "NORMAL",
  //   gameName: "Ezugi",
  //   bg: require("../../assets/images/games/liveCasino/ezugi.png"),
  //   main: require("../../assets/images/games/liveCasino/live3_01.png"),
  //   logo: require("../../assets/images/common/logo/ezugi.png"),
  //   text: "The EZUGI entertainment platform with hundreds of well-trained professional dealers, bring you just like real casino experience.",
  // },
  // {
  //   code: "Evo",
  //   name: "Evolution",
  //   gameName: "EVO",
  //   bg: require("../../assets/images/games/liveCasino/sa.png"),
  //   main: require("../../assets/images/games/liveCasino/live1_1.png"),
  //   logo: require("../../assets/images/common/logo/evo.png"),
  //   text: "In the Evolution live casino, there are the world's first 6-card start, VIP tables, badge baccarat, intelligent control baccarat waiting for you to enjoy non-stop."
  // },
  // {
  //   code: "AWC",
  //   name: "AG Sexy",
  //   gameName: "AE Sexy",
  //   gameCode: "MX-LIVE-001",
  //   bg: require("../../assets/images/games/liveCasino/sexy.png"),
  //   main: require("../../assets/images/games/liveCasino/live2_01.png"),
  //   logo: require("../../assets/images/common/logo/ae_2.png"),
  //   text: "AE Casino, Asia's most potential live-action video. The interface is simple and easy to operate, cross-platform, download-free, and fun anytime, anywhere!"
  // },
  // {
  //   code: "EZUGI",
  //   name: "Ezugi",
  //   gameName: "Ezugi",
  //   bg: require("../../assets/images/games/liveCasino/ezugi.png"),
  //   main: require("../../assets/images/games/liveCasino/live3_01.png"),
  //   logo: require("../../assets/images/common/logo/ezugi.png"),
  //   text: "The EZUGI entertainment platform with hundreds of well-trained professional dealers, bring you just like real casino experience."
  // },
  // {
  //   code: "SA",
  //   name: "SA gaming",
  //   gameName: "SA",
  //   bg: require("../../assets/images/games/liveCasino/sa.png"),
  //   main: require("../../assets/images/games/liveCasino/live4_01.png"),
  //   logo: require("../../assets/images/common/logo/SA.png"),
  //   text: "SA Gaming has been committed to creating a mobile entertainment platform with both gameplay and creativity."
  // }
  // {
  //   code: "AWC",
  //   name: "AE Sexy",
  //   status: "NORMAL",
  //   gameName: "AE Sexy",
  //   gameCode: "MX-LIVE-001",
  //   bg: require("../../assets/images/games/liveCasino/evo.png"),
  //   main: require("../../assets/images/games/liveCasino/live4_01.png"),
  //   logo: require("../../assets/images/common/logo/ae_2.png"),
  //   text: "วิดีโอไลฟ์แอ็กชันที่มีศักยภาพสูงสุดในเอเชียผลิตภัณฑ์เกมคุณภาพสูง และวิดีโอเกมที่หลากหลาย การเชื่อมต่อข้ามแพลตฟอร์มที่ง่ายดาย ทำให้คุณสนุกได้ทุกที่ทุกเวลา!",
  // },
  // {
  //   code: "WM",
  //   name: "WM Casino",
  //   gameName: "WM",
  //   status: "NORMAL",
  //   bg: require("../../assets/images/games/liveCasino/sexy.png"),
  //   main: require("../../assets/images/games/liveCasino/live2_01.png"),
  //   logo: require("../../assets/images/common/logo/WM.png"),
  //   text: "AE Casino วิดีโอไลฟ์แอ็กชันที่มีศักยภาพมากที่สุดในเอเชีย เชื่อมต่อและใช้งานง่าย ข้ามแพลตฟอร์ม ฟรีดาวน์โหลด และสนุกได้ทุกที่ทุกเวลา!",
  // },
  // {
  //   code: "SA",
  //   name: "SA gaming",
  //   gameName: "SA",
  //   status: "NORMAL",
  //   bg: require("../../assets/images/games/liveCasino/ezugi.png"),
  //   main: require("../../assets/images/games/liveCasino/live3_01.png"),
  //   logo: require("../../assets/images/common/logo/SA.png"),
  //   text: "แพลตฟอร์มความบันเทิง EZUGI ที่มีดีลเลอร์มืออาชีพที่ผ่านการฝึกอบรมมาอย่างดีหลายร้อยคน มอบประสบการณ์คาสิโนที่แท้จริงให้กับคุณ",
  // },
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
  min-height: 50vh;
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
    // display: grid;
    // grid-gap: 20px;
    // grid-template-columns: repeat(2, 1fr);
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .set {
    margin: auto;
    width: 100%;
    width: 45%;
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
