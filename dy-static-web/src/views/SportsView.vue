<template>
  <div class="platform__wrap">
    <div class="sports-container">
      <div class="sport-platform-bg bg-circle"></div>
      <div class="sport-platform-bg bg-wave"></div>
      <div class="sports-container-inner">
        <template v-for="(det, idx) in filteredPlatforms" :key="idx">
          <template v-if="selectedPlat === det.code">
            <div
              class="sports-right"
              v-if="det.image === 'im' || det.image === 'fb'"
              data-aos="fade-right"
              data-aos-duration="4000"
            >
              <img :src="require('../assets/sports/sport_left_' + det.image + '.png')" />
            </div>
            <div class="sports-right" v-else data-aos="fade-right" data-aos-duration="4000">
              <img :src="require('../assets/sports/sport_left_' + det.image + '.webp')" />
            </div>

            <div class="sports-left">
              <div class="platform-list-box">
                <span
                  class="platform-list-item platform"
                  v-for="(plat, i) in filteredPlatforms"
                  :key="i"
                  @click="clickPlat(plat)"
                  :class="{ active: selectedPlat === plat.code }"
                >
                  <!-- {{ plat.name }} -->
                  {{ getAliasName(plat, 'SPORTS') }}
                </span>
              </div>
              <div class="" data-aos="fade-left" data-aos-duration="4000">
                <img :src="require('../assets/sports/txt_' + det.image + '_sport.png')" />
                <div class="platform-txt-box">
                  <div>
                    <div class="platform-txt-list-content">{{ det.message }}</div>
                  </div>
                </div>
                <div class="play-btn" @click="openGame(det.name, det.code)">立即投注</div>
              </div>
            </div>
          </template>
        </template>
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
        code: "IM",
        name: "IM 体育",
        image: "im",
        message:
          "全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、电竞顶尖赛事，真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！",
        link: "/games/im-sport.html"
      },
      {
        code: "PM",
        name: "熊猫体育",
        image: "db",
        message: "最专业的盘口趋势分析，及时掌握最全面的热点赛事、体育资讯，多种投注型，让您乐享其中。",
        link: "/games/pm-sport.html"
      },
      {
        code: "SABA",
        name: "SABA体育",
        image: "saba",
        message:
          "覆盖世界各地大小赛事，提供让球、大小、半全场、 波胆、单双、总入球、连串过关等多元竞猜， 不会让您错过任何自己最喜爱的体育赛事",
        link: "/games/cr-sport.html"
      },
      {
        code: "FB",
        name: "FB体育",
        image: "fb",
        message: "FB体育是一个充满激情和刺激的线上游戏体育平台，提供丰富的体育赛事和精彩的游戏体验，让您乐享其中。",
        link: "/games/cr-sport.html"
      }
    ]);

    const filteredPlatforms = ref([]);
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.split(",").includes("SPORT")
          );
          setFilteredPlatforms();
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.split(",").includes("SPORT")
          );
          setFilteredPlatforms();
        });
      }
    };

    const setFilteredPlatforms = () => {
      filteredPlatforms.value = platforms.value.filter((displayPlatform) =>
        platformsListDisplay.value.some((platform) => platform.code === displayPlatform.code)
      );

      filteredPlatforms.value = filteredPlatforms.value.map((item1) => {
        const matchingItem = platformsListDisplay.value.find((item2) => item1.code === item2.code);
        return { ...matchingItem, ...item1 };
      });

      filteredPlatforms.value.forEach((element) => {
        if (element.code === route.query.plat) {
          clickPlat(element);
        }
      });

      filteredPlatforms.value = filteredPlatforms.value.sort((a, b) => a.sequence - b.sequence);

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
      router.push({ path: "sports", query: { plat: plat.code } });
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
        if (route.path === "/sports") {
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
.sports-container {
  background-image: url(../assets/sports/sport_bg.webp);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0;
  font-size: 14px;
  z-index: 0;
  .sport-platform-bg {
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
      top: 128px;
      left: 380px;
    }
  }
  .sports-container-inner {
    z-index: 1;
    position: relative;
    max-width: $maxwidth;
    width: 100%;
    margin: 50px auto 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    .sports-left {
      text-align: left;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      .platform-txt-list-content {
        font-size: 16px;
        line-height: 26px;
        letter-spacing: 1px;
        margin: 55px 0 60px;
        color: #2e79fc;
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
    .sports-right {
      flex: 2;
      img {
        height: 100%;
      }
    }
  }
  .platform-list-box {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 25px;
    width: 600px;
    flex-wrap: wrap;
    margin: 35px auto 50px;
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
}
</style>
