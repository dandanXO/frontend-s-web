<template>
  <div class="sports-container">
    <div class="sports-container-inner">
      <template v-for="(det, idx) in filteredPlatforms" :key="idx">
        <template v-if="selectedPlat === det.code">
          <div
            class="sports-left"
            data-aos="fade-right"
            data-aos-duration="4000"
          >
            <img
              :src="
                require('../assets/sports/title_sport_' + det.image + '.png')
              "
              style="margin-bottom: 54px"
            />
            <div class="platform-txt-box">
              <div>
                <div class="platform-txt-list-content">{{ det.message }}</div>
              </div>
            </div>
            <img
              src="../assets/sports/sport_platforms.png"
              style="margin: 8px 0 68px 50px"
            />
            <br />
            <div class="play-btn" @click="openGame(det.name, det.code)"></div>
          </div>
          <div
            class="sports-right"
            data-aos="fade-left"
            data-aos-duration="4000"
          >
            <img
              :src="
                require('../assets/sports/sport_right_' + det.image + '.png')
              "
            />
          </div>
        </template>
      </template>
    </div>
    <div class="platform-list-box">
      <span
        class="platform-list-item platform"
        v-for="(plat, i) in filteredPlatforms"
        :key="i"
        @click="clickPlat(plat)"
        :class="{ active: selectedPlat === plat.code }"
      >
        {{ plat.code }} 体育
      </span>
    </div>
  </div>
  <GameModal ref="sportsGame"></GameModal>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import GameModal from "@/components/modal/GameModal";
import { useRoute } from "vue-router";
import aos from "aos";
import {
  getPlatformListDisplay,
  getLoggedInPlatformList
} from "@/api/platform/platform";
import { userStore } from "@/store";

export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const sportsGame = ref(null);
    const route = useRoute();
    const store = userStore();

    const platforms = ref([
      {
        code: "IM",
        name: "IM",
        image: "im",
        message:
          "全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、电竞顶尖赛事，真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！",
        link: "/games/im-sport.html"
      },
      {
        code: "PM",
        name: "PM",
        image: "pm",
        message:
          "最专业的盘口趋势分析，及时掌握最全面的热点赛事、体育资讯，多种投注型，让您乐享其中。",
        link: "/games/pm-sport.html"
      },
      {
        code: 'CR',
        name: 'CR',
        image: 'cr',
        message: '倾力打造的刺激火爆的体育娱乐游戏，每天为您提供千场精彩体育赛事，多种娱乐方式 选择，让您拥有完美游戏体验。',
        link: '/games/cr-sport.html'
      },
      {
        code: 'SABA',
        name: 'SABA',
        image: 'saba',
        message: '覆盖世界各地大小赛事，提供让球、大小、半全场、波胆、单双、总入球、连串过关等多元竞猜，雷火体育不会让您错过任何自己最喜爱的体育赛事。',
        link: '/games/saba-sport.html'
      }
    ]);
    // const selectedPlat = ref(platforms.value[0].code);

    const filteredPlatforms = ref([]);
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.memberType === "TEST") {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("SPORT")
          );
          setFilteredPlatforms();
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("SPORT")
          );
          setFilteredPlatforms();
        });
      }
    };

    const setFilteredPlatforms = () => {
      filteredPlatforms.value = platforms.value.filter((displayPlatform) =>
        platformsListDisplay.value.some(
          (platform) => platform.code === displayPlatform.code
        )
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
      selectedPlat.value = plat.code;
    };

    const openGame = (gameName, code, gameCode) => {
      sportsGame.value.open(gameName, code, gameCode);
    };
    onMounted(() => {
      aos.refresh();
      getPlatList();
    });

    return {
      platforms,
      selectedPlat,
      clickPlat,
      openGame,
      sportsGame,
      filteredPlatforms,
      setSelectedPlat,
      getPlatList,
      setFilteredPlatforms
    };
  }
});
</script>

<style scoped lang="scss">
.sports-container {
  background-image: url(../assets/sports/bg_sport_platforms.jpg);
  background-repeat: no-repeat;
  background-position: top center;
  height: 850px;
  width: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0;
  font-size: 14px;
  z-index: 0;
  .sports-container-inner {
    max-width: $maxwidth;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    height: 795px;
    .sports-left {
      text-align: left;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
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
    justify-content: center;
    align-items: center;
    gap: 40px;
    margin: 5px;
    .platform-list-item {
      color: #869ebf;
      &::before {
        content: "";
        background: url(../assets/sports/xf-grey.png) no-repeat center center;
        padding: 15px;
      }
      &.active {
        color: #32ceed;
        &::before {
          background-image: url(../assets/sports/xf.png);
        }
      }
    }
  }
}
</style>
