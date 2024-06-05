<template>
  <div></div>
  <!-- <div class="banner-wrapper">
    <div class="lottery-main-banner">
      <div class="banner-title">
        <div class="sgwin-logo-container">
          <div class="sgwin-logo">
            <img src="../../assets/lottery/sgwin/sgwin-logo.png" alt="" />
          </div>
          <div class="sgwin-divider"></div>
          <div class="sgwin-title">
            <img src="../../assets/lottery/sgwin/sgwin-title.png" alt="" />
          </div>
        </div>
        <div class="sgwin-slogan">
          双赢彩票，不仅有高额的头奖，还有多种的附加奖，
          <br />
          让你有更多的机会赢取财富和幸福！
        </div>
      </div>
      <div class="banner-img">
        <img src="../../assets/lottery/sgwin/sgwin-main-img.png" alt="" />
      </div>
    </div>
  </div>
  <div class="content-wrapper">
    <div class="content-container">
      <div class="lott-selection-container">
        <route-link
          v-for="selection in selections"
          :key="selection"
          :class="{
            'lott-selector': true,
            active: selection === activeSelection
          }"
          @click="setActive(selection)"
        >
          {{ selection.title }}
        </route-link>
      </div>

      <div class="games-selection-container" id="gameSec">
        <a
          data-aos="zoom-in"
          :data-aos-delay="(index + 1) * 50"
          data-aos-anchor="#gameSec"
          v-for="(gameSelection, index) in gameListData"
          :key="index"
          @click="openGame(gameSelection.name, gameSelection.code)"
          class="game-selector"
        >
          <img :src="gameSelection.icon" />
          <div class="game-content">
            <div class="game-play">
              <div class="play-button"></div>
            </div>
            <div class="game-in"></div>
            <div class="game-title">{{ gameSelection.name }}</div>
            <div class="game-cat">彩票游戏</div>
          </div>
        </a>
      </div>

      <div class="game-selection-more" style="display: none">
        <button href="#">更多游戏</button>
      </div>
    </div>
  </div>
  <GameModal ref="lotteryGame"></GameModal> -->
</template>

<script>
// import { defineComponent, ref, reactive, onMounted, defineExpose } from "vue";
// import aos from "aos";
// import GameModal from "@/components/modal/GameModal";
// import { getPlatformGames, getPlatformList } from "@/api/platform/platform";

// export default defineComponent({
//   components: {
//     GameModal
//   },
//   setup() {
//     const lotteryGame = ref(null);

//     const selections = ref([
//       {
//         title: "全部",
//         option: ""
//       },
//       {
//         title: "热门",
//         option: ""
//       },
//       {
//         title: "极速",
//         option: ""
//       },
//       {
//         title: "时时",
//         option: ""
//       },
//       {
//         title: "快开",
//         option: ""
//       },
//       {
//         title: "香港",
//         option: ""
//       }
//     ]);

//     const gameSelections = ref([
//       {
//         gameTitle: "极速11选5",
//         gameCat: "彩票游戏",
//         gameGroup: "",
//         gameImg: "quickpick5"
//       },
//       {
//         gameTitle: "极速六合彩",
//         gameCat: "彩票游戏",
//         gameGroup: "",
//         gameImg: "lottery"
//       },
//       {
//         gameTitle: "极速快3",
//         gameCat: "彩票游戏",
//         gameGroup: "",
//         gameImg: "quickpick3"
//       },
//       {
//         gameTitle: "极速11选5",
//         gameCat: "彩票游戏",
//         gameGroup: "",
//         gameImg: "quickpick5"
//       },
//       {
//         gameTitle: "极速六合彩",
//         gameCat: "彩票游戏",
//         gameGroup: "",
//         gameImg: "lottery"
//       },
//       {
//         gameTitle: "极速六合彩",
//         gameCat: "彩票游戏",
//         gameGroup: "",
//         gameImg: "lottery"
//       }
//     ]);

//     const activeSelection = ref(selections.value[0]);
//     const setActive = (selection) => {
//       activeSelection.value = selection;
//     };

//     const openGame = (gameName, gameCode) => {
//       // console.log(
//       //   gameName,
//       //   gameCode,
//       //   transferInfo.value.platform,
//       //   transferInfo.value.platformId
//       // );
//       lotteryGame.value.open(
//         gameName,
//         transferInfo.value.platform,
//         gameCode,
//         "LOTTERY"
//       );
//     };

//     const transferInfo = ref({
//       amount: null,
//       platform: null,
//       platformId: null
//     });

//     const gamePage = reactive({
//       gameList: [],
//       currentPage: 1,
//       pageSize: 100,
//       searchType: "",
//       searchKey: "",
//       total: 0
//     });

//     const platforms = ref([]);
//     const gameListData = ref([]);

//     const loadPlatform = () => {
//       getPlatformList()
//         .then((data) => {
//           platforms.value = data.filter((element) =>
//             element.gameType.includes("LOTTERY")
//           );
//           platforms.value.forEach((element) => {
//             if (transferInfo.value.platform === element.code) {
//               transferInfo.value.platformId = element.id;
//               loadGameList();
//             }
//           });
//         })
//         .catch((err) => {
//           console.log(err.message);
//         });
//     };

//     const loadGameList = () => {
//       getPlatformGames(transferInfo.value.platformId, "LOTTERY")
//         .then((data) => {
//           data.forEach((element) => {
//             element.default = require("../../assets/images/games/aviator/default.png");
//             element.icon = `${
//             }/game/${transferInfo.value.platform.toLowerCase()}/lottery/${
//               element.icon
//             }.png`;
//           });
//           // console.log(data, "~~~");
//           gameListData.value = data;
//           // gamePage.total = data.length;
//           // changePage(1, gamePage.pageSize);
//         })
//         .catch((err) => {
//           console.log(err.message);
//         });
//     };

//     onMounted(() => {
//       transferInfo.value = { platform: "SGWin", platformId: 83 };
//       loadPlatform();
//       loadGameList();
//       aos.refresh();
//     });

//     return {
//       selections,
//       activeSelection,
//       setActive,
//       gameSelections,
//       loadPlatform,
//       platforms,
//       gameListData,
//       loadGameList,
//       transferInfo,
//       gamePage,
//       openGame,
//       lotteryGame
//     };
//   }
// });

// defineExpose({
//   open
// });
</script>

<!-- <style lang="scss" scoped>
.banner-wrapper {
  background-image: url("../../assets/lottery/sgwin/vivid-bg.png");
  background-position: center center;
  background-color: #ffffff;
  background-size: cover;
  background-repeat: no-repeat;
}

.content-wrapper {
  padding-top: 15px;
  padding-bottom: 65px;
  .content-container {
    max-width: 1280px;
    width: 100%;
    margin: auto;

    .lott-selection-container {
      display: none !important;
      border-radius: 100px;
      background: #fff;
      box-shadow: 0px 9px 25px 0px rgba(20, 17, 50, 0.1);
      position: relative;
      padding: 3px;
      display: flex;
      column-gap: 12px;

      .lott-selector {
        padding: 16px 16px;
        display: flex;
        justify-content: center;
        min-width: 70px;
        font-weight: 400;
        line-height: 1;
        color: #858585;
        cursor: pointer;
        transition: 0.3s all;
        border-radius: 100px;

        &:hover {
          background: rgba(104, 188, 236, 0.2);
        }
        &.active {
          color: #ffffff;

          font-weight: 600;
          background: #68bcec;
        }
      }
    }

    .games-selection-container {
      display: grid;
      position: relative;
      grid-template-columns: repeat(5, 1fr);
      row-gap: 40px;
      column-gap: 40px;
      margin-top: 20px;
      // justify-content: space-between;
      .game-selector {
        display: flex;
        height: 265px;
        // width: 140px;
        width: 214px;
        background-color: #ccc;
        border-radius: 30px;
        position: relative;

        &:before {
          content: "";
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 1),
            rgba(0, 0, 0, 0)
          );
          position: absolute;
          height: 120px;
          width: 100%;
          display: block;
          bottom: 0;
          left: 0;
          border-bottom-left-radius: 30px;
          border-bottom-right-radius: 30px;
        }

        img {
          display: block;
          width: 100%;
          border-radius: 30px;
        }

        .game-content {
          position: absolute;
          z-index: 2;
          bottom: 0px;
          left: 0px;
          right: 0px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 70px;
          transition: 0.3s all;
          overflow: hidden;
          border-radius: 30px;
          background: transparent;
          cursor: pointer;

          .game-in {
            margin-bottom: 15px;
            opacity: 0;
            &:before {
              content: "进入游戏";
              display: block;
              font-size: 12px;
              line-height: 1;
              font-weight: 600;
              color: #ffffff;
            }
          }

          .game-title {
            color: #ffffff;
            font-weight: 600;
            font-size: 24px;
            line-height: 1;
            transition: 0.3s all;
          }

          .game-cat {
            color: rgba(255, 255, 255, 0.8);
            font-size: 16px;
            font-weight: 100;
            line-height: 1;
            margin-top: 8px;
            padding-bottom: 10px;
            transition: 0.3s all;
          }

          .game-play {
            margin-bottom: 20px;
            opacity: 0;
            // transition: 0.6s all;
            .play-button {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-color: #ffffff;
              position: relative;
              cursor: pointer;
            }

            .play-button::before,
            .play-button::after {
              content: "";
              position: absolute;
            }

            .play-button::before {
              top: 20px;
              left: 22px;
              width: 0;
              height: 0;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              border-left: 20px solid #0f58b8;
            }
          }
        }

        &:hover {
          .game-content {
            background: linear-gradient(
              180deg,
              rgba(58, 135, 230, 0.85) 0%,
              rgba(0, 65, 144, 0.85) 71.88%,
              rgba(0, 65, 144, 0.85) 100%
            );
            height: 100%;

            .game-in {
              opacity: 1;
            }
            .game-cat {
              padding-bottom: 20px;
              opacity: 0;
            }

            .game-title {
              font-weight: 400;
              font-size: 22px;
            }
            .game-play {
              opacity: 1;
            }
          }
        }
      }
    }

    .game-selection-more {
      display: flex;
      justify-content: center;
      margin-top: 40px;

      button {
        border-radius: 10px;
        border: 1px solid #3c87e5;
        padding: 12px 16px;
        color: #3c87e5;
        min-width: 160px;
        font-size: 16px;
        font-weight: 500;
        background: #ffffff;
        transition: 0.3s all;

        &:hover {
          background: linear-gradient(180deg, #52acff 0%, #3559da 100%);
          color: #ffffff;
        }
      }
    }
  }
}
.lottery-main-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  width: 100%;
  margin: auto;
  padding-top: 30px;
  padding-bottom: 30px;
  .banner-title {
    .sgwin-logo-container {
      display: flex;
      column-gap: 20px;
      align-items: center;

      .sgwin-logo img {
        display: block;
        width: 100%;
        max-width: 168px;
      }

      .sgwin-title {
        display: block;
        width: 100%;
        max-width: 199px;
      }
      .sgwin-divider {
        display: block;
        height: 50px;
        background: rgba(0, 0, 0, 0.2);
        width: 2px;
      }
    }

    .sgwin-slogan {
      margin: 15px;
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .banner-img {
    & > img {
      display: block;
      max-width: 480px;
    }
  }
}
</style> -->
