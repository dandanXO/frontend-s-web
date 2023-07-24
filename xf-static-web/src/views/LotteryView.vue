<template>
  <div class="lottery-container">
    <div class="lottery-container-inner">
      <template v-for="(det, idx) in filteredPlatforms" :key="idx">
        <template v-if="selectedPlat === det.code">
          <div
            class="lottery-left"
            data-aos="fade-right"
            data-aos-duration="4000"
          >
            <img
              :src="
                require('../assets/lottery/title_lottery_' + det.image + '.png')
              "
              style="margin-bottom: 54px"
            />
            <div class="platform-txt-box">
              <div>
                <div class="platform-txt-list-content">{{ det.message }}</div>
              </div>
            </div>
            <img
              src="../assets/lottery/lottery_tcg_platforms.png"
              style="margin: 38px 0 0px 0px"
            />
            <br />
            <div class="rounded-txt-container">
              <div class="rounded-txt">11选5</div>
              <div class="rounded-txt">七乐彩</div>
              <div class="rounded-txt">福彩3D</div>
              <div class="rounded-txt">快3</div>
              <div class="rounded-txt">双色球</div>
            </div>
            <div
              class="play-btn"
              @click="openGame(det.name, det.code, det.gameCode)"
            ></div>
          </div>
          <div
            class="lottery-right"
            data-aos="fade-left"
            data-aos-duration="4000"
          >
            <!-- <img class="absolute" src="../assets/lottery/lottery_right.png"> -->
            <img
              :src="
                require('../assets/lottery/lottery_right_' + det.image + '.png')
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
        {{ plat.name }} 彩票
      </span>
    </div>
  </div>
  <GameModal ref="lotteryGame"></GameModal>
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
    const lotteryGame = ref(null);
    const route = useRoute();
    const store = userStore();

    const platforms = ref([
      {
        code: "TCG",
        name: "TCG",
        image: "tcg",
        message:
          "TCG，业界首创区块链彩票，汲取区块链的核心技术算法，只为公平、公正的开奖结果。多地域的官方时时彩、11选5、PK10、PC蛋蛋和官方六合彩，足不出户却能无时无刻的尽情游玩！",
        gameCode: ""
      },
      {
        code: "VR",
        name: "VR",
        image: "vr",
        message:
          "VR彩票打造着高品质游戏体验、不断地求新求变，寻找最新的创意，秉持最好的服务，种种这些都注定VR彩票的不俗传说，超百种彩票玩法任您赢！",
        gameCode: ""
      },
      {
        code: "LB",
        name: "LB",
        image: "lb",
        message:
          "专注于彩票游戏行业多年，拥有经典彩种、玩法。还有超多独家创新玩法，足够新颖，极易操作的游戏界面，更是在您游戏过程中增光添彩！",
        gameCode: ""
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
            element.gameType.includes("LOTTERY")
          );
          setFilteredPlatforms();
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("LOTTERY")
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
      lotteryGame.value.open(gameName, code, gameCode);
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
      lotteryGame,
      filteredPlatforms,
      setSelectedPlat,
      getPlatList,
      setFilteredPlatforms
    };
  }
});
</script>

<style scoped lang="scss">
.lottery-container {
  background-image: url(../assets/lottery/bg_lottery_platforms.jpg);
  background-repeat: no-repeat;
  background-position: top center;
  height: 850px;
  width: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0;
  font-size: 14px;
  z-index: 0;
  .lottery-container-inner {
    max-width: $maxwidth;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    height: 795px;
    gap: 100px;
    .lottery-left {
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
        background: url(../assets/lottery/start-btn.png) no-repeat center center;
        width: 300px;
        height: 100px;
        margin: 0 auto;
      }
    }
    .lottery-right {
      position: relative;
      margin-right: -100px;
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

  .rounded-txt-container {
    display: flex;
    gap: 53px;
    margin-bottom: 40px;

    .rounded-txt {
      color: #95b7d6;
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
        background: url(../assets/lottery/xf-grey.png) no-repeat center center;
        padding: 15px;
      }
      &.active {
        color: #32ceed;
        &::before {
          background-image: url(../assets/lottery/xf.png);
        }
      }
    }
  }
}
</style>
