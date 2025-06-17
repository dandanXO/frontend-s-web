<template>
  <div class="platform__wrap">
    <div class="live-container">
      <div class="live-bg bg-circle"></div>
      <div class="live-bg bg-wave"></div>
      <div class="live-container-inner">
        <template v-for="(det, idx) in filteredPlatforms" :key="idx">
          <template :class="active" v-if="selectedPlat === det.code">
            <div class="live-right fade-right">
              <img
                class="bgimg"
                :class="det.image"
                :src="require('../assets/live/left_person_' + det.image + '.webp')"
              />
              <template v-if="det.code === 'PMLIVE'">
                <img class="imgabs ag1" src="../assets/live/left_bg_ag_1.webp" />
                <img class="imgabs ag2" src="../assets/live/left_bg_ag_2.webp" />
                <img class="imgabs img-down-up fag1" src="../assets/live/left_float_ag_1.webp" />
                <img class="imgabs img-down-up fag2" src="../assets/live/left_float_ag_2.webp" />
              </template>
              <template v-if="det.code === 'AG'">
                <img class="imgabs ag1" src="../assets/live/left_bg_ag_1.webp" />
                <img class="imgabs ag2" src="../assets/live/left_bg_ag_2.webp" />
                <img class="imgabs img-down-up fag1" src="../assets/live/left_float_ag_1.webp" />
                <img class="imgabs img-down-up fag2" src="../assets/live/left_float_ag_2.webp" />
              </template>
              <template v-if="det.code === 'AR'">
                <img class="imgabs ag1" src="../assets/live/left_bg_ag_1.webp" />
                <img class="imgabs ag2" src="../assets/live/left_bg_ag_2.webp" />
                <img class="imgabs img-down-up fag1" src="../assets/live/left_float_ag_1.webp" />
                <img class="imgabs img-down-up fag2" src="../assets/live/left_float_ag_2.webp" />
              </template>
              <template v-if="det.code === 'ALLBET'">
                <img class="imgabs allbet1" src="../assets/live/left_bg_allbet_1.webp" />
                <img class="imgabs allbet2" src="../assets/live/left_bg_allbet_2.webp" />
                <img class="imgabs allbet3" src="../assets/live/left_bg_allbet_3.webp" />
                <img class="imgabs img-down-up fallbet1" src="../assets/live/left_float_allbet_1.webp" />
                <img class="imgabs img-down-up fallbet2" src="../assets/live/left_float_allbet_2.webp" />
              </template>
              <template v-if="det.code === 'BBINDY'">
                <img class="imgabs bbin1" src="../assets/live/left_bg_bbin_1.webp" />
                <img class="imgabs bbin2" src="../assets/live/left_bg_bbin_2.webp" />
                <img class="imgabs img-right-left fbbin5" src="../assets/live/left_float_bbin_5.webp" />
                <img class="imgabs img-down-up fbbin4" src="../assets/live/left_float_bbin_4.webp" />
                <img class="imgabs img-right-left fbbin3" src="../assets/live/left_float_bbin_3.webp" />
                <img class="imgabs img-left-right fbbin2" src="../assets/live/left_float_bbin_2.webp" />
                <img class="imgabs img-right-left fbbin1" src="../assets/live/left_float_bbin_1.webp" />
                <img class="imgabs img-left-right fbbin6" src="../assets/live/left_float_bbin_6.webp" />
                <img class="imgabs img-right-left fbbin7" src="../assets/live/left_float_bbin_7.webp" />
              </template>
              <template v-if="det.code === 'SEXY'">
                <img class="imgabs allbet1" src="../assets/live/left_bg_allbet_1.webp" />
                <img class="imgabs allbet2" src="../assets/live/left_bg_allbet_2.webp" />
                <img class="imgabs allbet3" src="../assets/live/left_bg_allbet_3.webp" />
                <img class="imgabs img-down-up fallbet1" src="../assets/live/left_float_allbet_1.webp" />
                <img class="imgabs img-down-up fallbet2" src="../assets/live/left_float_allbet_2.webp" />
              </template>
              <template v-if="det.code === 'BG'">
                <img class="imgabs bbin1" src="../assets/live/left_bg_bbin_1.webp" />
                <img class="imgabs bbin2" src="../assets/live/left_bg_bbin_2.webp" />
                <img class="imgabs img-right-left fbbin5" src="../assets/live/left_float_bbin_5.webp" />
                <img class="imgabs img-down-up fbbin4" src="../assets/live/left_float_bbin_4.webp" />
                <img class="imgabs img-right-left fbbin3" src="../assets/live/left_float_bbin_3.webp" />
                <img class="imgabs img-left-right fbbin2" src="../assets/live/left_float_bbin_2.webp" />
                <img class="imgabs img-right-left fbbin1" src="../assets/live/left_float_bbin_1.webp" />
                <img class="imgabs img-left-right fbbin6" src="../assets/live/left_float_bbin_6.webp" />
                <img class="imgabs img-right-left fbbin7" src="../assets/live/left_float_bbin_7.webp" />
              </template>
            </div>
            <div class="live-left">
              <div class="platform-list-box">
                <span
                  class="platform-list-item platform"
                  v-for="(plat, i) in filteredPlatforms"
                  :key="i"
                  @click="clickPlat(plat)"
                  :class="{ active: selectedPlat === plat.code }"
                >
                  {{ plat.name }}平台
                </span>
              </div>
              <div class="fade-left">
                <img :src="require('../assets/live/txt_desc_' + det.image + '.webp')" />
                <div class="platform-txt-box">
                  <div>
                    <img :src="require('../assets/live/live_' + det.image + '_icons.webp')" />
                  </div>
                </div>
                <div class="play-btn" @click="openGame(det.name, det.code, det.gameCode)">立即投注</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
  <GameModal ref="liveGame"></GameModal>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import GameModal from "@/components/modal/GameModal";
import aos from "aos";
import { useRoute, useRouter } from "vue-router";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";

export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const liveGame = ref(null);
    const route = useRoute();
    const router = useRouter();
    const store = userStore();

    const platforms = ref([
      {
        code: "AR",
        name: "AR",
        image: "ar",
        message:
          "全球首创6张牌先发、VIP包桌、咪牌百家乐、智控模式百家乐及竞咪互动百家乐等游戏，多终端兼容，让您享受不停。",
        gameCode: ""
      },
      {
        code: "PMLIVE",
        name: "DB",
        image: "db",
        gameCode: "",
        message: ""
      },
      {
        code: "BG",
        name: "BG",
        image: "bg",
        gameCode: "",
        message: ""
      },
      {
        code: "ALLBET",
        name: "欧博",
        image: "allbet",
        gameCode: "",
        message:
          "玩放易博尽享金满人生，EBET自2012年成立以来即致力创造富游戏性与创意兼具的移动娱乐平台，不仅提供专业的技术支持和稳定的顶级设备，并支持多项平台和荣获多项国际许可认证，提供玩家最值得信任的娱乐环境。"
      },
      {
        code: "BBINDY",
        name: "BBIN",
        image: "bbin",
        gameCode: "bblive_lobby_pc",
        message:
          "20余年来倾力于技术及系统研发，屡获业界国际大奖入围或得奖殊荣予肯定。 近年来，BBIN积极参与国际活动，并赞助多项全球知名赛事，包含方程式赛车、球类赛事等，也主动号召大力支持慈善团体，不遗余力投入各项国际事务，提供业界更开阔多元的视野。"
      },
      {
        code: "AG",
        name: "PA",
        image: "ag",
        message:
          "全球首创6张牌先发、VIP包桌、咪牌百家乐、智控模式百家乐及竞咪互动百家乐等游戏，多终端兼容，让您享受不停。",
        gameCode: ""
      },
      {
        code: "SEXY",
        name: "Sexy",
        image: "sexy",
        gameCode: "",
        message: ""
      }
    ]);

    const filteredPlatforms = ref([]);
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("LIVE"));
          setFilteredPlatforms();
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("LIVE"));
          setFilteredPlatforms();
        });
      }
    };

    const setFilteredPlatforms = () => {
      filteredPlatforms.value = platforms.value.filter((displayPlatform) =>
        platformsListDisplay.value.some((platform) => platform.code === displayPlatform.code)
      );

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
      router.push({ path: "live-casino", query: { plat: plat.code } });
      selectedPlat.value = plat.code;
    };

    const openGame = (gameName, code, gameCode) => {
      // console.log(gameName);
      // console.log(gameCode);
      liveGame.value.open(gameName, code, gameCode);
    };

    onMounted(() => {
      aos.refresh();
      getPlatList();
    });

    watch(
      () => route.query.plat,
      () => {
        if (route.path === "/esports") {
          filteredPlatforms.value.forEach((element) => {
            if (element.code === route.query.plat) {
              clickPlat(element);
            }
          });
        }
      }
    );

    return {
      platforms,
      selectedPlat,
      clickPlat,
      openGame,
      liveGame,
      filteredPlatforms,
      setSelectedPlat,
      getPlatList,
      setFilteredPlatforms
    };
  }
});
</script>

<style scoped lang="scss">
@-webkit-keyframes sport-left-fadeout-ani {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(-30px, 0, 0);
    transform: translate3d(-30px, 0, 0);
  }
}

@keyframes sport-left-fadeout-ani {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(-30px, 0, 0);
    transform: translate3d(-30px, 0, 0);
  }
}

@-webkit-keyframes sport-left-fadein-ani {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-30px, 0, 0);
    transform: translate3d(-30px, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}

@keyframes sport-left-fadein-ani {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-30px, 0, 0);
    transform: translate3d(-30px, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}

@-webkit-keyframes sport-right-fadeout-ani {
  0% {
    opacity: 1;
  }

  to {
    -webkit-transform: translate3d(30px, 0, 0);
    transform: translate3d(30px, 0, 0);
    opacity: 0;
  }
}

@keyframes sport-right-fadeout-ani {
  0% {
    opacity: 1;
  }

  to {
    -webkit-transform: translate3d(30px, 0, 0);
    transform: translate3d(30px, 0, 0);
    opacity: 0;
  }
}

@-webkit-keyframes sport-right-fadein-ani {
  0% {
    -webkit-transform: translate3d(30px, 0, 0);
    transform: translate3d(30px, 0, 0);
    opacity: 0;
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
  }
}

@keyframes sport-right-fadein-ani {
  0% {
    -webkit-transform: translate3d(30px, 0, 0);
    transform: translate3d(30px, 0, 0);
    opacity: 0;
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
  }
}

.fade-left {
  -webkit-animation: sport-right-fadein-ani 0.8s forwards;
  animation: sport-right-fadein-ani 0.8s forwards;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.fade-right {
  -webkit-animation: sport-left-fadein-ani 0.8s forwards;
  animation: sport-left-fadein-ani 0.8s forwards;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.live-container {
  background-image: url(../assets/sports/sport_bg.webp);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0;
  font-size: 14px;
  z-index: 0;

  .live-bg {
    position: absolute;
    background-repeat: no-repeat;
    background-position: top center;

    &.bg-wave {
      width: 1507px;
      height: 331px;
      background-image: url(../assets/sports/sport_bg_bottom.webp);
      left: 0;
      top: 580px;
    }

    &.bg-circle {
      width: 475px;
      height: 475px;
      background-image: url(../assets/sports/img_bg_bule.webp);
      top: 3%;
      left: 26%;
    }
  }

  .live-container-inner {
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

    .live-left {
      text-align: left;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 5;
      position: relative;

      .platform-txt-list-content {
        line-height: 26px;
        letter-spacing: 1px;
        color: #959dab;
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

    .live-right {
      position: relative;
      margin-right: -40px;
      display: flex;
      justify-content: flex-end;

      .absolute {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: unset;
      }

      .bgimg {
        height: 100%;
        display: block;
        position: relative;
        z-index: 1;
        margin-top: 60px;
        margin-right: 50px;
        height: 750px;

        &.allbet,
        &.bbin {
          // margin-top: 50px;
        }

        &.allbet {
          // margin-right: 40px;
        }

        &.bbin {
          // margin-right: 100px;
        }

        &.ag {
          margin-right: 20px;
        }
      }

      .imgabs {
        z-index: -1;
        position: absolute;
      }

      .ag1 {
        bottom: 16%;
        left: 26%;
      }

      .ag2 {
        bottom: 4%;
        right: 0%;
      }

      .fag1 {
        left: 28%;
        top: 38%;
      }

      .fag2 {
        right: 6%;
        top: 22%;
      }

      .allbet1 {
        bottom: 15%;
        left: 35%;
      }

      .allbet2 {
        bottom: 10%;
        right: -10%;
      }

      .allbet3 {
        bottom: 8%;
        left: 38%;
      }

      .fallbet1 {
        left: 30%;
        top: 35%;
      }

      .fallbet2 {
        right: 2%;
        top: 18%;
      }

      .bbin1 {
        bottom: 5%;
        left: 20%;
      }

      .bbin2 {
        bottom: 10%;
        right: -14%;
      }

      .fbbin1 {
        left: 17%;
        bottom: 67%;
      }

      .fbbin2 {
        left: 10%;
        bottom: 56%;
      }

      .fbbin3 {
        left: 13%;
        bottom: 47%;
      }

      .fbbin4 {
        left: 11%;
        bottom: 38%;
      }

      .fbbin5 {
        left: 24%;
        bottom: 28%;
      }

      .fbbin6 {
        left: 15%;
        bottom: 20%;
      }

      .fbbin7 {
        right: -3%;
        top: 18%;
      }

      .img-down-up {
        -webkit-animation: img-down-up-ani 5s infinite;
        animation: img-down-up-ani 5s infinite;
      }

      .img-right-left {
        -webkit-animation: img-right-left-ani 5s infinite;
        animation: img-right-left-ani 5s infinite;
      }

      .img-left-right {
        -webkit-animation: img-left-right-ani 5s infinite;
        animation: img-left-right-ani 5s infinite;
      }

      flex: 2;

      @keyframes img-down-up-ani {
        0% {
          -webkit-transform: translateY(0);
          transform: translateY(0);
        }
        50% {
          -webkit-transform: translateY(20px);
          transform: translateY(20px);
        }
        100% {
          -webkit-transform: translateY(0);
          transform: translateY(0);
        }
      }

      @keyframes img-right-left-ani {
        0% {
          -webkit-transform: translateX(0);
          transform: translateX(0);
        }
        50% {
          -webkit-transform: translateX(-10px);
          transform: translateX(-10px);
        }
        100% {
          -webkit-transform: translateX(0);
          transform: translateX(0);
        }
      }
      @keyframes img-left-right-ani {
        0% {
          -webkit-transform: translateX(0);
          transform: translateX(0);
        }
        50% {
          -webkit-transform: translateX(10px);
          transform: translateX(10px);
        }
        100% {
          -webkit-transform: translateX(0);
          transform: translateX(0);
        }
      }
    }
  }

  .platform-list-box {
    cursor: pointer;
    display: flex;
    // justify-content: center;
    align-items: center;
    gap: 25px;
    margin: 35px auto 90px;
    flex-wrap: wrap;
    width: 600px;

    .platform-list-item {
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: linear-gradient(0deg, #f2f2f2 0, #fefefe 100%), linear-gradient(#000, #000);
      border: none;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 1px;
      color: #222;
      padding: 15px 0px;
      min-width: 165px;
      background-blend-mode: normal, normal;
      box-shadow: 0 6px 20px 2px rgba(203, 203, 203, 0.75);
      border-radius: 26px;

      &.active,
      &:hover {
        background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000);
        box-shadow: 0 6px 20px 2px rgba(103, 204, 255, 0.75);
        border: none;
        color: #fff;
      }
    }
  }

  .platform-txt-box {
    margin: 15px 0 55px;
    text-align: center;
  }
}
</style>
