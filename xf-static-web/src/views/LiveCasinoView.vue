<template>
  <div class="live-container">
    <div class="live-container-inner">
      <template v-for="(det, idx) in filteredPlatforms" :key="idx">
        <template v-if="selectedPlat === det.code">
          <div class="live-left" data-aos="fade-right" data-aos-duration="4000">
            <img
              :src="require('../assets/live/title_live_' + det.image + '.png')"
              style="margin-bottom: 54px"
            />
            <div class="platform-txt-box">
              <div>
                <div class="platform-txt-list-content">{{ det.message }}</div>
              </div>
            </div>
            <img
              src="../assets/live/live_ag_platforms.png"
              style="margin: 8px 0 68px 50px"
            />
            <br />
            <div
              class="play-btn"
              @click="openGame(det.name, det.code, det.gameCode)"
            ></div>
          </div>
          <div class="live-right" data-aos="fade-left" data-aos-duration="4000">
            <img class="absolute" src="../assets/live/live_right.png" />
            <img
              :src="require('../assets/live/live_right_' + det.image + '.png')"
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
        {{ plat.name }} 真人
      </span>
    </div>
  </div>
  <GameModal ref="liveGame"></GameModal>
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
    const liveGame = ref(null);
    const route = useRoute();
    const store = userStore();

    const platforms = ref([
      {
        code: "AG",
        name: "AG",
        image: "ag",
        message:
          "全球首创6张牌先发、VIP包桌、咪牌百家乐、智控模式百家乐及竞咪互动百家乐等游戏，多终端兼容，让您享受不停。",
        gameCode: ""
      },
      {
        code: "EBET",
        name: "WE",
        image: "we",
        message:
          "玩放易博尽享金满人生，EBET自2012年成立以来即致力创造富游戏性与创意兼具的移动娱乐平台，不仅提供专业的技术支持和稳定的顶级设备，并支持多项平台和荣获多项国际许可认证，提供玩家最值得信任的娱乐环境。",
        gameCode: ""
      },
      {
        code: "ALLBET",
        name: "AllBet",
        image: "allbet",
        message:
          "玩放易博尽享金满人生，EBET自2012年成立以来即致力创造富游戏性与创意兼具的移动娱乐平台，不仅提供专业的技术支持和稳定的顶级设备，并支持多项平台和荣获多项国际许可认证，提供玩家最值得信任的娱乐环境。",
        gameCode: ""
      },
      {
        code: "BBINDY",
        name: "BBIN",
        image: "bbin",
        message:
          "20余年来倾力于技术及系统研发，屡获业界国际大奖入围或得奖殊荣予肯定。 近年来，BBIN积极参与国际活动，并赞助多项全球知名赛事，包含方程式赛车、球类赛事等，也主动号召大力支持慈善团体，不遗余力投入各项国际事务，提供业界更开阔多元的视野。",
        gameCode: "bblive_lobby_pc"
      },
      {
        code: "PMLIVE",
        name: "PM",
        image: "pm",
        message:
          "高清性感真人荷官直播娱乐场，独创真人融合棋牌电游风格。设有百家乐、牛牛、龙虎、炸金花、色碟、番摊等上百真人荷官桌台，专为亚洲人研发设计的投注界面，细致版面、极致操作让您拥有身临其境的体验！",
        gameCode: ""
      },
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
            element.gameType.includes("LIVE")
          );
          setFilteredPlatforms();
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("LIVE")
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
      liveGame.value.open(gameName, code, gameCode);
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
.live-container {
  background-image: url(../assets/live/bg_live_platforms.jpg);
  background-repeat: no-repeat;
  background-position: top center;
  height: 850px;
  width: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0;
  font-size: 14px;
  z-index: 0;
  .live-container-inner {
    max-width: $maxwidth;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    height: 795px;
    gap: 100px;
    .live-left {
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
        background: url(../assets/live/start-btn.png) no-repeat center center;
        width: 300px;
        height: 100px;
        margin: 0 auto;
      }
    }
    .live-right {
      position: relative;
      margin-right: -100px;
      display: flex;
      justify-content: center;
      .absolute {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: unset;
      }
      flex: 2;
      img {
        height: 100%;
      }
    }
  }
  .platform-list-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    margin: 5px;
    .platform-list-item {
      cursor: pointer;
      color: #869ebf;
      &::before {
        content: "";
        background: url(../assets/live/xf-grey.png) no-repeat center center;
        padding: 15px;
      }
      &.active {
        color: #32ceed;
        &::before {
          background-image: url(../assets/live/xf.png);
        }
      }
    }
  }
}
</style>
