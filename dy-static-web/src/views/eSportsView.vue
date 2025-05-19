<template>
  <div class="platform__wrap">
    <div class="esports-container">
      <div class="platform-list-box">
        <span
          class="platform-list-item platform"
          v-for="(plat, i) in filteredPlatforms"
          :key="i"
          @click="clickPlat(plat)"
          :class="{ active: selectedPlat === plat.code }"
        >
          {{ getAliasName(plat, 'ESPORT') }}
        </span>
      </div>
      <div class="nav-pane">
        <div class="esports-container-inner">
          <template v-for="(det, idx) in filteredPlatforms" :key="idx">
            <template v-if="selectedPlat === det.code">
              <div class="top" :class="det.image">
                <img
                  v-for="(v, vid) in 5"
                  :key="vid"
                  :src="require('../assets/esports/' + det.image + '-' + (vid + 1) + '.png')"
                />
              </div>
              <div class="bottom">
                <div class="esports-right" data-aos="fade-left" data-aos-duration="4000">
                  <div class="left-icon"></div>
                  <p class="left">{{ det.left }}</p>
                  <button @click="openGame(det.name, det.code)">进入游戏</button>
                  <p class="right">{{ det.right }}</p>
                  <div class="right-icon"></div>
                </div>
                <div class="esports-left" data-aos="fade-right" data-aos-duration="4000">
                  <img :src="require('../assets/esports/' + det.image + '-title.png')" />
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="pane-bg-bottom">
          <div class="dy-point-group">
            <div class="point-left">
              <img v-for="pt in 5" :key="pt" src="../assets/esports/blue_point.webp" />
            </div>
            <div class="point-right">
              <img v-for="pt in 5" :key="pt" src="../assets/esports/red_point.webp" />
            </div>
          </div>
          <img class="game-icon" src="../assets/esports/game-icon.webp" />
        </div>
      </div>
    </div>
  </div>

  <GameModal ref="sportsGame"></GameModal>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import GameModal from "@/components/modal/GameModal";
import { useRoute, useRouter } from "vue-router";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import { getAliasName } from "@/utils/utils.js";

export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const sportsGame = ref(null);
    const route = useRoute();
    const router = useRouter();
    const store = userStore();

    const platforms = ref([
      {
        code: "TFGaming",
        name: "DY",
        image: "dy",
        message:
          "全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、电竞顶尖赛事，真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！",
        link: "/games/im-sport.html",
        left: "最全赛事",
        right: "一应俱全"
      },
      {
        code: "IMES",
        name: "IM",
        image: "im",
        message:
          "倾力打造的刺激火爆的体育娱乐游戏，每天为您提供千场精彩体育赛事，多种娱乐方式 选择，让您拥有完美游戏体验。",
        link: "",
        left: "赛事齐全",
        right: "玩法新颖"
      },
      {
        code: "IA",
        name: "小艾",
        image: "ia",
        message:
          "倾力打造的刺激火爆的体育娱乐游戏，每天为您提供千场精彩体育赛事，多种娱乐方式 选择，让您拥有完美游戏体验。",
        link: "",
        left: "创新玩法",
        right: "全新体验"
      }
    ]);

    const filteredPlatforms = ref([]);
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("ESPORT"));
          setFilteredPlatforms();
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("ESPORT"));
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
      router.push({ path: "esports", query: { plat: plat.code } });
      selectedPlat.value = plat.code;
    };

    const openGame = (gameName, gameCode) => {
      sportsGame.value.open(gameName, "onlyPlatform", gameCode);
    };

    onMounted(() => {
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
      sportsGame,
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
.esports-container {
  .platform-list-box {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    margin: 0px auto 50px;
    padding-top: 35px;
    .platform-list-item {
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: linear-gradient(0deg, #f2f2f2 0, #fefefe 100%), linear-gradient(#000, #000);
      border-radius: 26px;
      border: none;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 1px;
      color: #222;
      padding: 15px 0px;
      min-width: 165px;
      background-blend-mode: normal, normal;
      box-shadow: 0 6px 20px 2px rgba(203, 203, 203, 0.75);
      &.active,
      &:hover {
        box-shadow: 0 6px 20px 2px rgba(103, 204, 255, 0.75);
        background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000);
        border: none;
        color: #fff;
      }
    }
  }
  @keyframes scale {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
    }
  }
  .esports-container-inner {
    max-width: 925px;
    width: 100%;
    margin: 30px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 795px;
    .top {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        position: absolute;
        animation: scale 1.5s ease-in-out;
        transition: smooth;
      }
      &.dy {
        img {
          &:nth-child(1) {
            left: 0px;
            top: -2px;
          }
          &:nth-child(2) {
            left: 180px;
            top: -45px;
          }
          &:nth-child(3) {
            left: 356px;
            top: -80px;
          }
          &:nth-child(4) {
            left: 558px;
            top: -45px;
          }
          &:nth-child(5) {
            left: 725px;
            top: -2px;
          }
        }
      }
      &.im {
        img {
          &:nth-child(1) {
            left: 0;
            top: -22px;
          }
          &:nth-child(2) {
            left: 180px;
            top: -43px;
          }
          &:nth-child(3) {
            left: 370px;
            top: -55px;
          }
          &:nth-child(4) {
            left: 571px;
            top: -43px;
          }
          &:nth-child(5) {
            left: 761px;
            top: -22px;
          }
        }
      }

      &.ia {
        img {
          &:nth-child(1) {
            left: -94px;
            top: -77px;
          }
          &:nth-child(2) {
            left: 139px;
            top: -25px;
          }
          &:nth-child(3) {
            left: 370px;
            top: -77px;
          }
          &:nth-child(4) {
            left: 602px;
            top: -25px;
          }
          &:nth-child(5) {
            left: 833px;
            top: -77px;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 120px;
      display: flex;
      flex-direction: column-reverse;

      .esports-left {
        transition-duration: 1.4s;
        text-align: left;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: -20px;
        .platform-txt-list-content {
          line-height: 26px;
          letter-spacing: 1px;
          color: #959dab;
        }
        .play-btn {
          cursor: pointer;
          background: url(../assets/sports/start-btn.png) no-repeat center center;
          width: 300px;
          height: 100px;
          margin: 0 auto;
        }
      }
      .esports-right {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        .left-icon {
          background-image: url(../assets/esports/icon-left.webp);
          background-repeat: no-repeat;
          width: 148px;
          height: 40px;
        }
        .right-icon {
          background-image: url(../assets/esports/icon-right.webp);
          background-repeat: no-repeat;
          width: 148px;
          height: 40px;
        }
        .left,
        .right {
          margin-right: 12px;
          font-size: 36px;
          font-weight: 600;
          font-style: italic;
          font-stretch: normal;
        }
        .left {
          color: #e9981d;
        }
        .right {
          color: #6ba0ff;
        }
        button {
          width: 198px;
          height: 52px;
          color: #fff;
          background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000);
          background-blend-mode: normal, normal;
          border-radius: 26px;
          border: none;
          cursor: pointer;
        }
      }
    }
  }
  .point-left {
    position: relative;
    img {
      position: absolute;
      &:nth-child(1) {
        top: 40px;
        left: 316px;
      }
      &:nth-child(2) {
        top: 54px;
        left: 218px;
      }
      &:nth-child(3) {
        top: 94px;
        left: 316px;
      }
      &:nth-child(4) {
        top: 119px;
        left: 154px;
      }
      &:nth-child(5) {
        top: 152px;
        left: 41px;
      }
    }
  }
  .point-right {
    position: relative;
    img {
      position: absolute;
      &:nth-child(1) {
        top: 40px;
        right: 316px;
      }
      &:nth-child(2) {
        top: 54px;
        right: 218px;
      }
      &:nth-child(3) {
        top: 84px;
        right: 119px;
      }
      &:nth-child(4) {
        top: 119px;
        right: 154px;
      }
      &:nth-child(5) {
        top: 95px;
        right: 208px;
      }
    }
  }
}

.nav-pane .game-name,
.nav-pane .ray .game-name {
  background-repeat: no-repeat;
  background-position: bottom;
}

.nav-pane {
  margin: 70px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 628px;
  position: relative;
}

.nav-pane .pane-bg-bottom {
  margin-top: 0;
  background-image: url(../assets/esports/map.webp);
  background-repeat: no-repeat;
  background-position: bottom;
  width: 100%;
  height: 100%;
  text-align: center;
  position: relative;
  z-index: -1;
  .game-icon {
    padding-top: 150px;
  }
}
.dy-point-group,
.ray-point-group {
  width: $maxwidth;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
</style>
