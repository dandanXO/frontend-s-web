<template>
  <div class="platform__wrap">
    <div class="game-container">
      <div class="game-tab-content">
        <div class="pane-bg"></div>

        <template v-for="(det, idx) in filteredPlatforms" :key="idx">
          <template v-if="selectedPlat === det.code">
            <div
              :class="'lottery-pane-bg lottery-pane-' + det.image + '-bg'"
              data-aos="zoom-in"
              data-aos-duration="700"
            >
              <div :class="det.image + '-effect-left'"></div>
              <div :class="det.image + '-effect-right'"></div>
            </div>
            <div class="lottery-pane-right" data-aos="fade-down" data-aos-duration="700">
              <img class="title" :src="require('../assets/lottery/' + det.image + '-title.webp')" />
              <p class="context">
                {{ det.message }}
              </p>
              <div class="type-icon">
                <template v-if="det.code === 'TCG'">
                  <img src="../assets/lottery/img_1.5.webp" />
                  <img src="../assets/lottery/img_five.webp" />
                  <img src="../assets/lottery/img_eleven.webp" />
                  <img src="../assets/lottery/img_bjpk.webp" />
                  <img src="../assets/lottery/img_time.webp" />
                </template>
                <template v-if="det.code === 'BBINDY'">
                  <img src="../assets/lottery/img_3d.webp" />
                  <img src="../assets/lottery/img_bbpk10.webp" />
                  <img src="../assets/lottery/img_cq.webp" />
                  <img src="../assets/lottery/img_k3.webp" />
                  <img src="../assets/lottery/img_pink11.webp" />
                </template>
                <template v-if="det.code === 'SGWin'">
                  <img src="../assets/lottery/img_sgwin-004.png" />
                  <img src="../assets/lottery/img_sgwin-001.png" />
                  <img src="../assets/lottery/img_sgwin-002.png" />
                  <img src="../assets/lottery/img_sgwin-003.png" />
                </template>
              </div>
              <button class="btn linear-blue" @click="openGame(det.name, det.code, det.gameCode)">进入游戏</button>
            </div>
          </template>
        </template>
      </div>
      <ul class="nav nav-tabs lottery-tabs" id="myTab" role="tablist">
        <template v-for="(det, idx) in filteredPlatforms" :key="idx">
          <li class="nav-item custom-nav-item">
            <a
              :class="['nav-link', 'custom-nav-link', det.image + '-nav-link', { active: selectedPlat === det.code }]"
              @click="selectedPlat !== det.code && clickPlat(det.code)"
            >
              {{ det.name }}彩票
            </a>
          </li>
        </template>
      </ul>
    </div>
  </div>

  <GameModal ref="liveGame"></GameModal>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import aos from "aos";
import GameModal from "@/components/modal/GameModal";
import { useRoute, useRouter } from "vue-router";
import { TweenMax } from "gsap";
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
        code: "TCG",
        name: "TCG",
        image: "tcg",
        gameCode: "",
        message:
          "TCG，业界首创区块链彩票，汲取区块链的核心技术算法，只为公平、公正的开奖结果。多地域的官方时时彩、11选5、PK10、PC蛋蛋和官方六合彩，足不出户却能无时无刻的尽情游玩！"
      },
      {
        code: "BBINDY",
        name: "BBIN",
        image: "bbin",
        gameCode: "bbkeno_lobby_pc",
        message:
          "BBIN彩票打造着高品质游戏体验、不断地求新求变，寻找最新的创意，秉持最好的服务……，种种这些都注定BBIN彩票的不俗传说，超百种彩票玩法任您赢！"
      },
      {
        code: "SGWin",
        name: "双赢",
        image: "sgwin",
        gameCode: "imlotto30000",
        message:
          "专注于彩票游戏行业多年，拥有经典彩种、玩法。还有超多独家创新玩法，足够新颖，极易操作的游戏界面，更是在您游戏过程中增光添彩！"
      }
    ]);

    const filteredPlatforms = ref([]);
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("LOTTERY"));
          setFilteredPlatforms();
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("LOTTERY"));
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

    // const clickPlat = (plat) => {
    //   router.push({ path: "live-casino", query: { plat: plat.code } });
    //   selectedPlat.value = plat.code;
    // };

    const clickPlat = (plat) => {
      setTimeout(() => {
        selectedPlat.value = plat;
        router.push({ path: "lottery", query: { plat: plat.code } });
      }, 300);

      TweenMax.fromTo(
        ".pane-bg",
        {
          duration: 0.1,
          scale: 1,
          opacity: 1
        },
        {
          duration: 0.2,
          scale: 1.5,
          opacity: 0
        }
      );

      TweenMax.to(".pane-bg", {
        duration: 0.3,
        scale: 1,
        opacity: 1,
        delay: 0.3
      });

      TweenMax.fromTo(
        ".lottery-pane-bg",
        {
          duration: 0.1,
          scale: 1,
          opacity: 1
        },
        {
          duration: 0.2,
          scale: 1.5,
          opacity: 0
        }
      );

      TweenMax.to(".lottery-pane-right", {
        duration: 0.3,
        y: 600,
        opacity: 0
      });
    };

    const openGame = (gameName, code, gameCode) => {
      if (code === "SGWin") {
        router.push("/lottery/SGWin");
      } else {
        liveGame.value.open(gameName, code, gameCode);
      }
    };

    onMounted(() => {
      aos.refresh();
      getPlatList();
    });

    watch(
      () => route.query.plat,
      () => {
        if (route.path === "/lottery") {
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
.game-container {
  width: 1300px;
  // padding-top: 120px;
  // height: 902px;
  margin: auto;
}

.game-tab-content {
  position: relative;
  height: 630px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pane-bg {
  position: absolute;
  background-image: url("../assets/lottery/bg_water.webp");
  background-repeat: no-repeat;
  width: 712px;
  height: 618px;
}

.lottery-tabs {
  position: relative;
  padding: 0 0 70px 10px;
  justify-content: center;
  border: none;
  display: flex;
  gap: 34px;
  max-width: 720px;

  li {
    list-style-type: none;
    // width: 50%;
  }
}

.custom-nav-item {
  // margin-right: 34px;
}

.custom-nav-link {
  cursor: pointer;
  width: 222px;
  height: 75px;
  background-image: linear-gradient(0deg, #f2f2f2 0%, #fefefe 100%), linear-gradient(#000000, #000000);
  background-blend-mode: normal, normal;
  box-shadow: 0px 6px 20px 2px rgba(103, 204, 255, 0.75);
  border-radius: 6px !important;

  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  letter-spacing: 2px;
  color: #4474ce;

  &.active,
  &:hover {
    color: #ffffff;
  }
}

.tcg-nav-link::before {
  content: " ";
  background-image: url("../assets/lottery/tcg.png");
  width: 43px;
  height: 43px;
}

.tcg-nav-link:hover::before {
  content: " ";
  background-image: url("../assets/lottery/tcg-hover.png");
}

.tcg-nav-link.active::before {
  content: " ";
  background-image: url("../assets/lottery/tcg-hover.png");
}

.bbin-nav-link::before {
  content: " ";
  background-image: url("../assets/lottery/bbin.png");
  width: 68px;
  height: 26px;
}

.bbin-nav-link:hover::before {
  content: " ";
  background-image: url("../assets/lottery/bbin-hover.png");
}

.bbin-nav-link.active::before {
  content: " ";
  background-image: url("../assets/lottery/bbin-hover.png");
}

.sgwin-nav-link::before {
  content: " ";
  background-image: url("../assets/lottery/sgwin.png");
  width: 59px;
  height: 58px;
}

.sgwin-nav-link:hover::before {
  content: " ";
  background-image: url("../assets/lottery/sgwin-hover.png");
}

.sgwin-nav-link.active::before {
  content: " ";
  background-image: url("../assets/lottery/sgwin-hover.png");
}

.custom-nav-link:hover {
  background-image: linear-gradient(90deg, #2d74f6 0%, #7abdfc 100%), linear-gradient(#000000, #000000);
  background-blend-mode: normal, normal;
  box-shadow: 0px 6px 20px 2px rgba(103, 204, 255, 0.75);
}

.custom-nav-link:hover,
.nav-tabs .nav-item.show .nav-link,
.nav-tabs .custom-nav-link.active {
  background-image: linear-gradient(90deg, #2d74f6 0%, #7abdfc 100%), linear-gradient(#000000, #000000);
  background-blend-mode: normal, normal;
  box-shadow: 0px 6px 20px 2px rgba(103, 204, 255, 0.75);
}

.lottery-pane-tcg-bg {
  position: relative;
  background-image: url("../assets/lottery/bg-tcg.webp");
  background-repeat: no-repeat;
  background-position: left center;
  width: 668px;
  height: 760px;
  z-index: 0;
}

.tcg-effect-left {
  position: absolute;
  background-image: url("../assets/lottery/img_yellowball.webp");
  width: 81px;
  height: 81px;
  top: 126px;
  left: 85px;
  animation: bonuceDown 8s ease-in-out infinite;
}

.tcg-effect-right {
  position: absolute;
  bottom: 300px;
  right: 0px;
  background-image: url("../assets/lottery/img_buleball.webp");
  width: 76px;
  height: 77px;
  animation: bonuceUp 8s ease-in-out infinite;
}

.bbin-effect-left {
  position: absolute;
  background-image: url("../assets/lottery/img_greenball.webp");
  width: 96px;
  height: 96px;
  top: 126px;
  left: 85px;
  animation: bonuceDown 8s ease-in-out infinite;
}

.bbin-effect-right {
  position: absolute;
  bottom: 300px;
  right: 0px;
  background-image: url("../assets/lottery/img_redball.webp");
  width: 94px;
  height: 92px;
  animation: bonuceUp 8s ease-in-out infinite;
}

.sgwin-effect-left {
  position: absolute;
  // background-image: url("../assets/lottery/img_greenball.webp");
  width: 96px;
  height: 96px;
  top: 126px;
  left: 85px;
  animation: bonuceDown 8s ease-in-out infinite;
}

.sgwin-effect-right {
  position: absolute;
  bottom: 300px;
  right: 0px;
  // background-image: url("../assets/lottery/img_redball.webp");
  width: 94px;
  height: 92px;
  animation: bonuceUp 8s ease-in-out infinite;
}

@keyframes bonuceDown {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(0, 30px);
  }
}

@keyframes bonuceUp {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(0, -30px);
  }
}

.lottery-pane-bbin-bg {
  position: relative;
  background-image: url("../assets/lottery/bg-bbin.webp");
  background-repeat: no-repeat;
  background-position: left top;
  width: 718px;
  height: 760px;
  z-index: 0;
}

.lottery-pane-right {
  float: right;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10rem;
}

.lottery-pane-right .context {
  margin-top: 55px;
  margin-bottom: 65px;
  font-size: 14px;
  font-weight: normal;
  color: #515151;
}

.lottery-pane-right button {
  margin-top: 48px;
  width: 198px;
  height: 52px;
}

.lottery-pane-sgwin-bg {
  position: relative;
  background-image: url("../assets/lottery/bg-sgwin.webp");
  background-repeat: no-repeat;
  background-position: left center;
  width: 668px;
  height: 760px;
  z-index: 0;
}

.linear-blue {
  background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000);
  background-blend-mode: normal, normal;
  border-radius: 26px;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
</style>
