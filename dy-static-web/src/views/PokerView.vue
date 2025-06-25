<template>
  <div class="platform__wrap">
    <div class="poker-container">
      <div class="poker-container-list">
        <div class="platform-list-box">
          <span
            class="platform-list-item platform"
            v-for="(plat, i) in filteredPlatforms"
            :key="i"
            @click="clickPlat(plat)"
            :class="{ active: selectedPlat === plat.code }"
          >
            <!-- {{ plat.name }}棋牌 -->
            {{ getAliasName(plat, 'POKER') }}
          </span>
        </div>
        <template v-for="(det, idx) in filteredPlatforms" :key="idx">
          <div class="poker-container-inner" v-if="selectedPlat === det.code" :class="det.style">
            <!-- <div class="poker-left" data-aos="fade-right" data-aos-duration="4000">
                  <img :src="require('../assets/poker/title_poker_' + det.image + '.png')" style="margin-bottom: 54px;">
                  <div class="platform-txt-box">
                      <div>
                          <div class="platform-txt-list-content">{{ det.message }}</div>
                      </div>
                  </div>
                  <img src="../assets/poker/poker_tx_platforms.png" style="margin: 8px 0 68px 50px;"><br>
                  <div class="play-btn" @click="openGame(det.name, det.code)"></div>
              </div>
              <div class="poker-right" data-aos="fade-left"  data-aos-duration="4000">
                <img class="absolute" src="../assets/poker/poker_right.png">
                <img :src="require('../assets/poker/poker_right_' + det.image + '.png')">
              </div> -->
            <div class="platform-left-box">
              <template v-if="det.code === 'DT'">
                <img
                  class="imgabs tx1"
                  data-aos="zoom-out"
                  data-aos-duration="500"
                  src="../assets/poker/bg_left_tx.webp"
                />
                <img
                  class="imgabs tx2"
                  data-aos="fade-right"
                  data-aos-duration="1000"
                  src="../assets/poker/girl_tx_left.webp"
                />
                <img
                  class="imgabs tx3"
                  data-aos="fade-down"
                  data-aos-duration="700"
                  src="../assets/poker/center_btn_bg_tx.webp"
                />
                <div class="imgabs tx3text" data-aos="fade-down" data-aos-duration="900" v-html="det.message"></div>
                <img class="imgabs tx4" src="../assets/poker/img_float_tx.webp" />
                <img class="imgabs tx5" src="../assets/poker/bg_right_tx.webp" />
                <div
                  class="imgabs play-btn"
                  data-aos="fade-down"
                  data-aos-duration="1100"
                  @click="openGame(det.name, det.code, det.gameCode)"
                >
                  立即游戏
                </div>
                <img
                  class="imgabs tx6"
                  data-aos="fade-left"
                  data-aos-duration="1000"
                  src="../assets/poker/girl_tx_right.webp"
                />
                <img
                  class="imgabs tx7"
                  data-aos="fade-down"
                  data-aos-duration="500"
                  src="../assets/poker/txt_tx.webp"
                />
              </template>
              <template v-if="det.code === 'KY'">
                <img
                  class="imgabs ky1"
                  data-aos="zoom-out"
                  data-aos-duration="1000"
                  src="../assets/poker/img_bg_ky_left.webp"
                />
                <img
                  class="imgabs ky2"
                  data-aos="fade-right"
                  data-aos-duration="1000"
                  src="../assets/poker/girl_ky_left.webp"
                />
                <img class="imgabs kydice" src="../assets/poker/img_ky_left_top.webp" />
                <img
                  class="imgabs ky3"
                  data-aos="fade-down"
                  data-aos-duration="700"
                  src="../assets/poker/center_btn_bg_ky.webp"
                />
                <div class="imgabs ky3text" data-aos="fade-down" data-aos-duration="900" v-html="det.message"></div>
                <img
                  class="imgabs ky4"
                  data-aos="fade-down"
                  data-aos-duration="500"
                  src="../assets/poker/txt_ky.webp"
                />
                <img
                  class="imgabs ky6"
                  data-aos="fade-left"
                  data-aos-duration="1000"
                  src="../assets/poker/girl_ky_right.webp"
                />
                <img
                  class="imgabs ky5"
                  data-aos="fade-down"
                  data-aos-duration="500"
                  data-aos-once="true"
                  src="../assets/poker/txt_ky_tip.webp"
                />
                <div
                  class="imgabs play-btn"
                  data-aos="fade-down"
                  data-aos-duration="1100"
                  @click="openGame(det.name, det.code, det.gameCode)"
                >
                  立即游戏
                </div>

                <img class="imgabs ky7" src="../assets/poker/img_float_ky_1.webp" />
                <img class="imgabs ky8" src="../assets/poker/img_float_ky_2.webp" />
                <img class="imgabs ky9" src="../assets/poker/img_float_ky_3.webp" />
                <img class="imgabs ky10" src="../assets/poker/img_float_ky_4.webp" />
                <img
                  class="imgabs ky11"
                  data-aos="zoom-out"
                  data-aos-duration="1000"
                  src="../assets/poker/img_bg_ky_right.webp"
                />
              </template>
              <template v-if="det.code === 'LEG'">
                <img
                  class="imgabs leg2"
                  data-aos="fade-right"
                  data-aos-duration="1000"
                  src="../assets/poker/girl_leg_left.png"
                />
                <img
                  class="imgabs leg3"
                  data-aos="fade-down"
                  data-aos-duration="700"
                  src="../assets/poker/center_leg_btn.png"
                />
                <div class="imgabs leg3text" data-aos="fade-down" data-aos-duration="900" v-html="det.message"></div>
                <img
                  class="imgabs leg4"
                  data-aos="fade-down"
                  data-aos-duration="500"
                  src="../assets/poker/txt_leg.png"
                />
                <img
                  class="imgabs leg6"
                  data-aos="fade-left"
                  data-aos-duration="1000"
                  src="../assets/poker/girl_leg_rightr.png"
                />
                <div
                  class="imgabs play-btn"
                  data-aos="fade-down"
                  data-aos-duration="1100"
                  @click="openGame(det.name, det.code, det.gameCode)"
                >
                  立即游戏
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <GameModal ref="pokerGame"></GameModal>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import GameModal from "@/components/modal/GameModal";
import { useRoute, useRouter } from "vue-router";
import aos from "aos";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";

export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const pokerGame = ref(null);
    const route = useRoute();
    const router = useRouter();
    const store = userStore();

    const platforms = ref([
      {
        code: "DT",
        name: "大唐",
        image: "tx",
        gameCode: "",
        style: "DT",
        message: "抢庄牛牛龙虎斗，多款棋牌任君选<br> 棋牌彰显胸怀，竞技娱乐烧脑，好友相约竞技，游戏改变生活"
      },
      {
        code: "KY",
        name: "开元",
        image: "ky",
        style: "KY",
        gameCode: "",
        message: "开元棋牌提供市面上热门游戏种类，选择全面多元，应有尽有<br> 玩家能不断游戏不感无趣！"
      },
      {
        code: "LEG",
        name: "乐游",
        image: "leg",
        style: "LEG",
        gameCode: "",
        message: "欧洲最高级别安全认证，热门棋牌品类丰富，聆听悦耳音乐，<br/>感受非同凡响极致体验，让游戏改变生活"
      }
    ]);

    const filteredPlatforms = ref([]);
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("POKER"));
          setFilteredPlatforms();
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("POKER"));
          setFilteredPlatforms();
        });
      }
    };

    

    const setFilteredPlatforms = () => {
      filteredPlatforms.value = platforms.value
        .filter((displayPlatform) =>
          platformsListDisplay.value.some((platform) => platform.code === displayPlatform.code)
        )
        .map((displayPlatform) => {
          const match = platformsListDisplay.value.find(platform => platform.code === displayPlatform.code);
          return {
            ...displayPlatform,
            alias: match?.alias || null  // Add alias from platformsListDisplay
          };
        });

      filteredPlatforms.value.forEach((element) => {
        if (element.code === route.query.plat) {
          clickPlat(element);
        }
      });

      setSelectedPlat();
    };

    const selectedPlat = ref(null);
    const setSelectedPlat = () => {
      if (filteredPlatforms.value.length > 0) {
        selectedPlat.value = filteredPlatforms.value[0].code;
      } else {
        selectedPlat.value = null;
      }
    };

    const clickPlat = (plat) => {
      router.push({ path: "poker", query: { plat: plat.code } });
      selectedPlat.value = plat.code;
    };

    const openGame = (gameName, code, gameCode) => {
      pokerGame.value.open(gameName, code, gameCode);
    };

    onMounted(() => {
      aos.refresh();
      getPlatList();
    });

    watch(
      () => route.query.plat,
      () => {
        if (route.path === "/poker") {
          filteredPlatforms.value.forEach((element) => {
            if (element.code === route.query.plat) {
              clickPlat(element);
            }
          });
        }
      }
    );

    const getAliasName = (plat, platformType) => {
      // console.log(plat);
      if (plat.alias?.includes("、")) {
        const aliass = plat.alias.split("、");
        const gameTypes = plat.gameType.split(",");
        const itemIndex = gameTypes.indexOf(platformType);
        // console.log(platformType);
        // console.log(aliass);
        // console.log(aliass[itemIndex]);

        return itemIndex && aliass[itemIndex] ? aliass[itemIndex] : aliass[0];
      }
      return plat.alias;
    };
    return {
      platforms,
      selectedPlat,
      clickPlat,
      openGame,
      pokerGame,
      filteredPlatforms,
      setSelectedPlat,
      getPlatList,
      setFilteredPlatforms,
      getAliasName
    };
  }
});
</script>

<style scoped lang="scss">
.poker-container {
  // background-image: url(../assets/poker/bg_poker_platforms.jpg);
  // background-repeat: no-repeat;
  // background-position: top center;
  width: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0;
  font-size: 14px;
  gap: 15px;
  z-index: 1;
  min-width: $maxwidth;
  .poker-container-list {
    display: flex;
    justify-content: center;
    align-items: center;
    // max-width: $maxwidth;
    width: 100%;
    margin: 0 auto;
  }
  .poker-container-inner {
    // max-width: $maxwidth;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 790px;
    gap: 100px;
    // .poker-left {
    //   text-align: left;
    //   flex: 1;
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    //   .platform-txt-list-content {
    //     line-height: 26px;
    //     letter-spacing: 1px;
    //     color: #959dab;
    //   }
    //   .play-btn {
    //     cursor: pointer;
    //     background: url(../assets/common/start-btn.png)no-repeat center center;
    //     width: 300px;
    //     height: 100px;
    //     margin: 0 auto;
    //     &:hover {
    //       background-image: url(../assets/common/start-hover-btn.png);
    //     }
    //   }
    // }
    // .poker-right {
    //   position: relative;
    //   .absolute {
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     right: 0;
    //     bottom: 0;
    //     width: unset;
    //     height: 95%;
    //   }
    //   flex: 2;
    //   img {
    //     width: unset;
    //     height: 75vh;
    //   }
    // }
    &.DT {
      background: url(../assets/poker/bg_tx.webp);
      .imgabs {
        position: absolute;
        &.tx1 {
          left: 0;
          top: 0;
          z-index: 4;
        }
        &.tx2 {
          left: 15%;
          top: 6%;
          z-index: 3;
          // animation: 2s ease 0s 1 normal none running poker-circle-ani;
        }
        &.tx3 {
          left: 0;
          right: 0;
          top: 35%;
          margin: auto;
          z-index: 5;
          &text {
            left: 0;
            right: 0;
            margin: auto;
            top: 55%;
            margin: auto;
            z-index: 999;
            color: #ffffff;
            text-align: center;
            width: 490px;
            font-size: 18px;
            line-height: 32px;
            text-align: center;
            color: #fff;
          }
        }
        &.tx4 {
          right: 5%;
          bottom: 4%;
          z-index: 7;
          animation: 4s ease 2s infinite normal both running poker-circle-ani;
        }
        &.tx5 {
          right: 0;
          bottom: 15%;
          z-index: 6;
        }
        &.play-btn {
          top: 67%;
          left: 0;
          right: 0;
          z-index: 7;
        }
        &.tx6 {
          right: 12%;
          top: 13%;
          z-index: 5;
          // animation: 2s ease 0s 1 normal none running poker-circle-ani;
        }
        &.tx7 {
          left: 0%;
          right: 0;
          margin: auto;
          top: 20%;
        }
      }
    }
    &.KY {
      background: url(../assets/poker/bg_ky.webp);
      .imgabs {
        position: absolute;
        &.ky1 {
          left: 6%;
          bottom: 15%;
          z-index: 0;
        }
        &.ky2 {
          left: 15%;
          top: 6%;
          z-index: 0;
          // animation: 2s ease 0s 1 normal none running poker-circle-ani;
        }
        &.kydice {
          left: 14%;
          top: 5%;
        }
        &.ky3 {
          left: 0;
          right: 0;
          top: 38%;
          margin: auto;
          &text {
            left: 0;
            right: 0;
            margin: auto;
            top: 52%;
            margin: auto;
            z-index: 999;
            color: #ffffff;
            text-align: center;
            width: 490px;
            font-size: 18px;
            line-height: 32px;
            text-align: center;
            color: #fff;
          }
        }
        &.ky4 {
          left: 0;
          right: 0;
          top: 20%;
          margin: auto;
          z-index: 7;
        }
        &.ky5 {
          left: 0;
          right: 0;
          top: 32%;
          margin: auto;
          z-index: 6;
        }
        &.play-btn {
          top: 65%;
          left: 0;
          right: 0;
        }
        &.ky6 {
          right: 13%;
          top: 13%;
          z-index: 5;
          // animation: 2s ease 0s 1 normal none running poker-circle-ani;
        }
        &.ky6a {
        }
        &.ky7 {
          left: 17%;
          bottom: 3%;
          z-index: 5;
          animation: 4s ease 2s infinite normal both running up-down-ani;
        }
        &.ky8 {
          left: 27%;
          bottom: 3%;
          z-index: 5;
          animation: 4s ease 2s infinite normal both running down-up-ani;
        }
        &.ky9 {
          right: 21%;
          bottom: 3%;
          z-index: 5;
          animation: 4s ease 2s infinite normal both running up-down-ani;
        }
        &.ky10 {
          right: 11%;
          bottom: 3%;
          z-index: 5;
          animation: 4s ease 2s infinite normal both running down-up-ani;
        }
        &.ky11 {
          right: 7%;
          top: 13%;
        }
      }
    }

    &.LEG {
      background: url(../assets/poker/leg_bg.jpg);
      .imgabs {
        position: absolute;
        &.leg1 {
          left: 6%;
          bottom: 15%;
          z-index: 0;
        }
        &.leg2 {
          left: 5%;
          top: 6%;
          z-index: 0;
          // animation: 2s ease 0s 1 normal none running poker-circle-ani;
        }
        &.legdice {
          left: 14%;
          top: 5%;
        }
        &.leg3 {
          left: 0;
          right: 0;
          top: 38%;
          margin: auto;
          &text {
            left: 0;
            right: 0;
            margin: auto;
            top: 52%;
            margin: auto;
            z-index: 999;
            color: #ffffff;
            text-align: center;
            width: 490px;
            font-size: 18px;
            line-height: 32px;
            text-align: center;
            color: #fff;
          }
        }
        &.leg4 {
          left: 0;
          right: 0;
          top: 20%;
          margin: auto;
          z-index: 7;
        }
        &.leg5 {
          left: 0;
          right: 0;
          top: 32%;
          margin: auto;
          z-index: 6;
        }
        &.play-btn {
          top: 65%;
          left: 0;
          right: 0;
        }
        &.leg6 {
          right: 0%;
          top: 13%;
          z-index: 2;
          // animation: 2s ease 0s 1 normal none running poker-circle-ani;
        }
        &.leg6a {
        }
        &.leg7 {
          left: 17%;
          bottom: 3%;
          z-index: 5;
          animation: 4s ease 2s infinite normal both running up-down-ani;
        }
        &.leg8 {
          left: 27%;
          bottom: 3%;
          z-index: 5;
          animation: 4s ease 2s infinite normal both running down-up-ani;
        }
        &.leg9 {
          right: 21%;
          bottom: 3%;
          z-index: 5;
          animation: 4s ease 2s infinite normal both running up-down-ani;
        }
        &.leg10 {
          right: 11%;
          bottom: 3%;
          z-index: 5;
          animation: 4s ease 2s infinite normal both running down-up-ani;
        }
        &.leg11 {
          right: 7%;
          top: 13%;
        }
      }
    }

    .play-btn {
      cursor: pointer;
      display: block;
      width: 198px;
      height: 52px;
      background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000);
      background-blend-mode: normal, normal;
      border-radius: 26px;
      color: #fff;
      font-size: 16px;
      margin: 0 auto;
      text-align: center;
      line-height: 52px;
      border: none;
    }
  }
  .platform-list-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    margin: 30px;
    position: absolute;
    top: 0;
    z-index: 99;
    .platform-list-item {
      cursor: pointer;
      width: 181px;
      height: 50px;
      background-image: linear-gradient(0deg, #f2f2f2 0, #fefefe 100%), linear-gradient(#000, #000);
      background-blend-mode: normal, normal;
      box-shadow: 0 6px 20px 2px rgba(103, 204, 255, 0.75);
      border-radius: 6px;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
      font-size: 16px;
      color: #222;
      //     &::before{
      //       content: "";
      //       background: url(../assets/common/xf-grey.png)no-repeat center center;
      //       padding: 15px;
      //     }
      &.active {
        color: #fff;
        background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000);
      }
    }
  }
}

@keyframes poker-circle-ani {
  0%,
  100% {
    transform: scaleX(1);
  }

  50% {
    transform: scale3d(1.05, 1.05, 1.05);
  }
}

@keyframes up-down-ani {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(10px);
  }
}

@keyframes down-up-ani {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
