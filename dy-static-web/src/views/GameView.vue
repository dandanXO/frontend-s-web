<template>
  <div class="casino-container">
    <div class="recreation-money" id="numBox">LOADING...</div>
    <!-- <router-link to="/promotion"> -->
    <!-- <div
        v-if="banner && banner.desktopImageUrl && banner.mobileImageUrl"
        class="banner-container"
      >
        <div class="recreation-money">{{ numBox }}</div>
        <div
          class="promo-bg isDesktop"
          :style="
            'background-image: url(https://jsn92.czxinbang.com/xf-resource/web/style/img/recreation/recreation_bg.jpg)'
          "
        ></div>
        <div
          class="promo-bg isMobile"
          :style="
            'background-image: url(' + imgURL + banner.mobileImageUrl + ''
          "
        ></div>
      </div> -->
    <!-- </router-link> -->
    <div class="margin-center game-container">
      <div class="all-game-container">
        <div class="left">
          <div class="plat-type-container">
            <div class="plat-list">
              <template v-for="p in platforms" :key="p">
                <div class="plat-item" :class="{ active: p === activePlat }" @click="switchPlat(p)">
                  <img :src="require(`../assets/game/${p.code.toLowerCase()}.png`)" />
                  {{ getGameLabel(p.name) }}
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="grid-items flex-box flex-align-center search-container web-only-box">
            <el-input
              class="search-input"
              v-model="gamePage.searchKey"
              @keypress.enter="searchList()"
              placeholder="输入查找游戏名"
            >
              <template #suffix>
                <el-icon :width="15" @click="searchList()">
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="game-list-wrapper">
            <div
              class="game-slot animate__animated animate__fadeInRight"
              v-for="game in gamePage.gameList"
              :key="game.id"
            >
              <a @click="openGame(game.name, game.code)">
                <div class="slot-img">
                  <el-image :src="game.icon" lazy>
                    <template #placeholder>
                      <img :src="game.default" />
                    </template>
                    <template #error>
                      <div class="image-slot">
                        <img :src="game.default" />
                      </div>
                    </template>
                  </el-image>
                  <!-- <img :src="game.icon" v-image="game.icon" /> -->
                </div>
                <div class="slot-name">
                  <img src="../assets/images/games/play-icon.png" />
                  {{ game.name }}
                </div>
              </a>
            </div>
          </div>
          <div class="pagination-wrapper">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="gamePage.total"
              @current-change="changePage(gamePage.currentPage, gamePage.pageSize)"
              v-model:current-page="gamePage.currentPage"
              v-model:pageSize="gamePage.pageSize"
              default-page-size="30"
            />
            <!-- <el-pagination

            v-model:current="gamePage.currentPage"
            v-model:pageSize="gamePage.pageSize"
            :total="gamePage.total"
            @change="changePage"
            @showSizeChange="onShowSizeChange"
            :showSizeChanger="true"
          /> -->
          </div>
        </div>
      </div>
    </div>
    <GameModal ref="slotsGame"></GameModal>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getLoggedInPlatformList, getPlatformGames, getPlatformList } from "@/api/platform/platform";
import GameModal from "@/components/modal/GameModal";
import { loadPromoBanner } from "@/api/index/promo";
import { useRoute, useRouter } from 'vue-router';
import { useScriptTag } from '@vueuse/core'
import { userStore } from "@/store";
import { useLocalStorage } from "@vueuse/core";

export default defineComponent({
  components: {
    Search, GameModal
  },
  setup() {
    const store = userStore();
    const numBox = ref(275417746)
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + '/game/'
    const banner = ref([]);
    const route = useRoute();
    const router = useRouter();
    const slotsGame = ref(null);
    const platforms = ref([]);
    const activePlat = ref(platforms.value[0]);
    const gamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 12,
      searchType: "",
      searchKey: "",
      total: 0
    });
    const gameListData = ref([]);

    const switchPlat = (plat) => {
      router.push({ path: 'game', query: { plat: plat.code }})
      activePlat.value = plat;
      gamePage.currentPage = 1;
      loadGameList();
    };

    const getGameLabel = (gameLabel) => {
      if (gameLabel === 'BBINDY') {
        return 'BBIN 电子'
      } else if (gameLabel === 'AMEBA') {
        return 'AE 电子'
      } else if (gameLabel === 'MGP') {
        return 'MG 电子'
      } else if (gameLabel === 'AG') {
        return 'PA 电子'
      } else {
        return gameLabel + ' 电子'
      }
    }

    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((data) => {
          platforms.value = data.filter(element => element.gameType.includes("SLOT"));
          if (!route.query.plat) {
            switchPlat(platforms.value[0]);
          } else {
            platforms.value.forEach(element => {
              if (route.query.plat === element.code) {
                switchPlat(element)
              }
            });
          }
        }).catch((err) => {
          console.log(err.message)
          // message.error(
          //   err.message,
          //   4
          // );
        });
      } else {
        getPlatformList().then((data) => {
          platforms.value = data.filter(element => element.gameType.includes("SLOT"));
          if (!route.query.plat) {
            switchPlat(platforms.value[0]);
          } else {
            platforms.value.forEach(element => {
              if (route.query.plat === element.code) {
                switchPlat(element)
              }
            });
          }
        }).catch((err) => {
          console.log(err.message)
          // message.error(
          //   err.message,
          //   4
          // );
        });
      }

    };
    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter((game) => {
          return (((game.name).toLowerCase()).includes((gamePage.searchKey).toLowerCase()));
        });
      }
    };
    const loadGameList = () => {
      getPlatformGames(activePlat.value.id, "SLOT").then((data) => {
        data.forEach(element => {
          element.default = require("../assets/images/games/aviator/default.png");
          element.icon = `${imgURL}${element.icon}`;
        });
        gameListData.value = data;
        gamePage.total = data.length;
        changePage(1, gamePage.pageSize);
      }).catch((err) => {
        console.log(err.message);
        // message.error(
        //   err.message,
        //   4
        // );
      });
    };

    const changePage = (page, pageSize) => {
      console.log(page)
      console.log(pageSize)
      gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
    };
    const onShowSizeChange = (current, size) => {
      current = 1;
      gamePage.currentPage = 1;
      changePage(current, size);
    };
    const loadBanner = () => {
      loadPromoBanner("SLOT").then((res) => {
        if (res.code === 0) {
            banner.value = res.data[0]
        }
      })
    }
    const openGame = (gameName, gameCode) => {
      slotsGame.value.open(gameName, activePlat.value.code, gameCode);
    };
    const ptJackpot = ref()
    useScriptTag(
      'https://tickers.playtech.com/jackpots/new_jackpotjs.js',
      // on script tag loaded.
        () => {
          function formatNumberStr(nStr) {
              nStr += "";
              var x = nStr.split(".");
              var x1 = x[0];
            //	x2 = x.length > 1 ? "." + x[1] : "";
              var rgx = /(\d+)(\d{3})/;
              while (rgx.test(x1)) {
                x1 = x1.replace(rgx, "$1" + "," + "$2");
              }
            //	return x1 + x2;
              return x1;
            }
            Ticker.prototype.showJackpot = function()
            {
              var newvalue = this.getJackpot();

              if (this.type != "count") {
                newvalue = Math.round(newvalue * 100) / 100 + "";
                if (newvalue.match(/^\d+\.\d$/)) {
                  newvalue = newvalue + "0";
                }
                if (newvalue.match(/^\d+$/)) {
                  newvalue = newvalue + ".00";
                }
              }
              var text = "LOADING...";
              if (newvalue > 0) {
                text = (this.signpos != 0 ? formatNumberStr(newvalue) + this.sign
                    : this.sign + formatNumberStr(newvalue));
              }
              if (newvalue > 0 && this.type == "count") {
                text = newvalue;
              }

              this.textbox.innerHTML = text;
            }
          // do something
            ptJackpot.value = new Ticker({
              info : 2,
              casino : 'drunkenmonkey88',
              currency : 'cny'
            })
          console.log(Ticker.prototype);
          ptJackpot.value.SetCurrencyPos(0);
          ptJackpot.value.SetCurrencySign(store.currency.value);
          ptJackpot.value.attachToTextBox('numBox');
          ptJackpot.value.tick();
        },
      )

    onMounted(() => {
      getPlatList();
      loadBanner();
    });

    watch(
      () => route.query.plat,
      () => {
        if (route.path === '/game') {
          getPlatList();
        }
      }
    );
    return {
      store,
      numBox,
      platforms,
      activePlat,
      switchPlat,
      gamePage,
      openGame,
      loadGameList,
      changePage,
      searchList,
      gameListData,
      onShowSizeChange,
      slotsGame,
      banner,
      imgURL,
      getGameLabel
    };
  }
});
</script>

<style scoped lang="scss">
.el-image {
  height: 130px;
  display: block;
  width: 100%;
  cursor: pointer;
}

@keyframes game-circle-ani {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes scale {
  100% {
    -webkit-transform: scale(1, 1);
  }
}

@keyframes scale {
  100% {
    transform: scale(1, 1);
  }
}

@-webkit-keyframes playzoom {
  0% {
    -webkit-transform: scale(2, 2);
  }
  100% {
    -webkit-transform: scale(1, 1);
  }
}

@keyframes playzoom {
  0% {
    transform: scale(2, 2);
  }
  100% {
    transform: scale(1, 1);
  }
}

.casino-container {
  color: #ffffff;
  background: url("../assets/game/recreation_bg.jpg");
  background-repeat: no-repeat;
  background-position: center 0px;
  .recreation-money {
    padding-top: 240px;
    text-align: center;
    font-size: 60px;
    font-weight: 700;
    letter-spacing: 0;
    color: #907438;
  }
  .banner-container {
    width: 100%;
    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      &.isDesktop {
        display: block;
        height: 500px;
      }
      &.isMobile {
        display: none;
        height: 220px;
      }
    }
  }

  // .banner-container {
  //   // width: 1920px;
  //   // height: 450px;
  //   font-size: 30px;
  //   padding: 40px 0px;
  //   background-image: url("../assets/images/games/slots/banner.jpg");
  //   background-repeat: no-repeat;
  //   background-position: center center;
  //   min-height: 580px;
  //   background-size: cover;
  //   display: flex;
  //   .btn-wrapper {
  //     width: 95%;
  //     max-width: 1440px;
  //     margin: auto;
  //     position: relative;

  //     .center {
  //       display: flex;
  //       flex-direction: column;
  //       justify-content: center;
  //       align-items: flex-start;
  //       width: 52%;
  //       color: #ffffff;
  //       .page-name {
  //         font-size: 30px;
  //         font-family: trending;
  //         margin-bottom: 10px;
  //       }
  //       .page-headline {
  //         font-size: 60px;
  //         line-height: 80px;
  //         font-family: trending;
  //         margin-bottom: 100px;
  //       }
  //       img {
  //         max-width: unset;
  //       }
  //       .common-btn.getnow {
  //         background: #ffffff;
  //         color: #000000;
  //         border: transparent;
  //         &:hover {
  //           background: #ffd800;
  //         }
  //       }
  //     }
  //   }

  //   // .jp-container {
  //   //   display: flex;
  //   //   justify-content: center;
  //   //   text-align: center;
  //   //   font-size: 110px;
  //   //   margin-top: 30px;
  //   //   color: #1bcef1;
  //   //   font-family: jp;
  //   //   font-weight: 600;
  //   //   line-height: 120px;

  //   //   .jp-number-item {
  //   //     width: 96px;
  //   //     height: 120px;
  //   //     // background-image: url("../assets/images/games/casino/jp_bg.png");
  //   //     background-repeat: no-repeat;
  //   //     background-size: 100% 100%;
  //   //   }
  //   // }
  // }

  .title-container {
    width: 100%;

    .game-title {
      position: relative;
      font-family: C9;
      color: #10a0cb;
      font-weight: 600;
    }

    &.large {
      padding: 50px 0 0 0;

      .game-title {
        font-size: 52px;

        &::before,
        &::after {
          content: "";
          position: absolute;
          top: 12px;
          width: 46px;
          height: 36px;
          background-image: url("../assets/images/common/title_large.png");
          background-repeat: no-repeat;
        }

        &::before {
          left: -64px;
        }

        &::after {
          transform: rotateY(180deg);
          right: -64px;
        }
      }
    }

    &.hot {
      padding-bottom: 10px;

      .game-title {
        font-size: 32px;
        line-height: 35px;

        &::after {
          content: "";
          position: absolute;
          width: 26px;
          height: 16px;
          background-image: url("../assets/images/common/title_small.png");
          background-repeat: no-repeat;
          right: -36px;
          top: 10px;
        }
      }
    }
  }

  .game-container {
    overflow: hidden;
    border-radius: 8px;
    padding: 20px;
    max-width: $maxwidth;
    margin: 100px auto 0;

    .hot-game-container {
      padding: 20px;
      background-color: #1b232d;

      .desktop {
        display: block;

        &.ant-carousel :deep(.slick-list) {
          margin: 0 -27px;
        }

        &.ant-carousel :deep(.slick-slide > div) {
          margin: 0 27px;
        }
      }

      .mobile {
        display: none;
      }

      .ant-carousel :deep(.slick-slide) {
        padding: 0px 4px;
        text-align: center;
      }

      .ant-carousel :deep(.slick-dots) {
        position: absolute;
        right: 0;
        top: -40px;
        bottom: unset;
        text-align: right;
      }

      .carousel-item {
        position: relative;
        overflow: hidden;
        position: relative;
        overflow: hidden;
        -webkit-animation: scale 1s;
        animation: scale 1s;
        -webkit-transform: scale(0, 0);
        transform: scale(0, 0);
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
        width: 346px;
        height: 210px;
        text-align: center;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          transition: all 0.5s ease;

          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }

    .all-game-container {
      // margin-top: 50px;

      display: flex;
      gap: 10px;
      .left {
        background: url(../assets/game/left.jpg);
        flex: 2;
        min-height: 1138px;
        min-width: 315px;
        .plat-type-container {
          padding: 60px 20px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgb(255 255 255 / 15%);
          align-items: flex-end;
          /* width */
          ::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            // display: none;
          }
          .plat-list {
            font-size: 18px;
            display: flex;
            gap: 20px;
            flex-direction: column;

            width: 100%;
            .plat-item {
              height: 45px;
              line-height: 45px;
              text-align: center;
              // background-color: #333b44;
              // box-shadow: 0 3px 4px 0 rgb(0 0 0 / 15%);
              color: #707a8f;
              display: inline-block;
              cursor: pointer;
              font-size: 15px;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 15px;
              // padding: 10px;
              // cursor: pointer;
              // // border-bottom: 4px solid transparent;
              // border-radius: 40px;
              // background: #003653;
              // z-index: 2;
              // box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;
              // // min-width: 100px;
              // text-align: center;
              // img {
              //   max-height: 23px;
              //   max-width: 100%;
              //   filter: grayscale(1);
              // }
              &.active,
              &:hover {
                background: url(../assets/game/menu.png) no-repeat center center;
                background-size: contain;
                color: #fff;
              }
              img {
                max-height: 40px;
              }
            }
          }
        }
      }

      .right {
        background: url(../assets/game/right.jpg);
        width: 100%;
        flex: 8;
        padding: 20px 50px;
      }
      .search-container {
        // margin: 30px 0px 30px auto;
        // max-width: 460px;
        width: 100%;
        border-bottom: 1px solid #aaaaaa;
        display: flex;
        .search-input {
          // margin-bottom: 10px;
          padding: 20px 20px 20px 30px;
          margin: 0 0 0 auto;
          max-width: 460px;
        }
      }

      .game-list-wrapper {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        // border: 1px solid #1bcef1;
        // padding: 10px;
        margin: 30px auto;

        .game-slot {
          //-webkit-animation: scale 1s;
          //animation: scale 1s;
          //-webkit-transform: scale(0, 0);
          //transform: scale(0, 0);
          //-webkit-animation-fill-mode: forwards;
          //animation-fill-mode: forwards;
          animation: 2s ease 0s 1 normal none running game-circle-ani;
          position: relative;

          a {
            display: block;
            text-align: center;
            position: relative;
            cursor: pointer;

            &::before {
              content: "";
              position: absolute;
              height: 100%;
              width: 100%;
              box-shadow: 0 0 20px #fff inset;
              background-image: url(../assets/game/play.png);
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 50%;
              opacity: 0;
              transition: all 0.3s ease-out;
              left: 0;
              z-index: 1;
            }
            &:hover {
              &::before {
                content: "";
                position: absolute;
                height: 100%;
                width: 100%;
                box-shadow: 0 0 20px #fff inset;
                background-image: url(../assets/game/play.png);
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 25%;
                opacity: 1;
              }
              img {
                transform: scale(1.2);
              }

              .slot-name {
                // opacity: 1;
                // font-size: 18px;

                img {
                  opacity: 1;
                  transition: all 0.3s ease-out;
                  -webkit-animation: playzoom 0.5s;
                  animation: playzoom 0.5s;
                  -webkit-animation-fill-mode: forwards;
                  animation-fill-mode: forwards;
                }
              }
            }

            .slot-img {
              width: 100%;
              height: auto;
              overflow: hidden;

              img {
                transition: all 0.5s ease;
              }
            }
            .slot-name {
              // position: absolute;
              // bottom: 0;
              // left: 0;
              // width: 100%;
              // background: rgba(0, 0, 0, 0.6);
              // padding: 10px 0;
              // transition: all 0.3s ease-out;
              // display: flex;
              // flex-direction: column-reverse;
              // justify-content: center;
              // align-items: center;
              // color: #ffffff;
              // font-size: 0;
              // line-height: 23px;
              // width: 100%;
              // overflow: hidden;
              display: flex;
              align-items: flex-start;
              padding: 5px 15px;
              background-color: #707a8f;

              img {
                width: 90px;
                margin-bottom: 10px;
                // display: block;
                display: none;
                opacity: 0;
              }
            }
          }
        }

        img {
          width: 100%;
        }
      }
    }
  }

  .pagination-wrapper {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 80px;
    display: flex;
    justify-content: flex-start;
  }
}

.slot-iframe {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: block;
}
</style>
<style scoped lang="scss">
.casino-container :deep(.anticon) {
  color: #ffffff;
}
.casino-container :deep(.ant-pagination-item-link .anticon) {
  font-size: 12px;
}
.search-container :deep(.ant-input) {
  color: #ffffff;
  width: 460px;
  height: 52px;
  background: #16151c;
}
.search-container :deep(.anticon) {
  font-size: 22px;
}
.search-container :deep(.ant-input-affix-wrapper) {
  padding-top: 0;
  padding-bottom: 0;
  margin-left: 16px;
  background-color: #16151c;
  border: solid 1px #ffffff;
}

.pagination-wrapper :deep(.ant-pagination) {
  color: #ffffff;
  .ant-select-dropdown {
    background: #242424;
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
      color: #6b6b6b;
      background: #ffffff;
    }
    .ant-select-item {
      color: #ffffff;
      &:hover {
        color: #ffffff;
      }
    }
  }

  .ant-pagination-item {
    background-color: #242424;
    border-color: #363636;

    a {
      color: #ffffff;
    }
  }

  .ant-pagination-item-active {
    background-color: #242424;
    border-color: #ffffff;

    a {
      color: #ffffff;
    }
  }

  .ant-select-selector {
    background-color: #242424;
    border-color: #363636;
    color: #ffffff;
  }
  .ant-select-arrow .ant-icon {
    font-size: 12px;
  }
  .ant-pagination-prev {
    .ant-pagination-item-link {
      background-color: #242424;
      border-color: #363636;
    }
  }

  .ant-pagination-next {
    .ant-pagination-item-link {
      background-color: #242424;
      border-color: #363636;
    }
  }
}
</style>
<style scoped lang="scss">
// @media (max-width: 1440px) {
//   .casino-container .banner-container {
//     background-position: 70% center;
//   }
// }
@media (max-width: 768px) {
  .casino-container {
    // .banner-container {
    //   background: url(../assets/images/games/slots/banner_mob.jpg);
    //   padding: 75px 0;
    //   // min-height: unset;

    //   min-height: 60vw;
    //   background-size: cover;
    //   .btn-wrapper {
    //     .center {
    //       width: 80%;
    //       .page-name {
    //         font-size: 4vw;
    //         line-height: 6vw;
    //       }
    //       .page-headline {
    //         font-size: 6.4vw;
    //         line-height: 8.4vw;
    //         margin-bottom: 7vw;
    //       }
    //     }
    //   }
    // }
    .banner-container {
      .promo-bg {
        &.isDesktop {
          display: none;
        }
        &.isMobile {
          display: block;
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .casino-container {
    min-height: unset;

    .web-only-box {
      display: none !important;
    }
    .title-container {
      &.large {
        padding: 12px 0;

        .game-title {
          font-size: 1em;

          &:before {
            display: none;
          }

          &:after {
            display: none;
          }
        }
      }

      &.hot {
        .game-title {
          font-size: 26px;
        }
      }
    }

    .game-container {
      width: 95%;
      min-width: unset;
      overflow: hidden;

      .hot-game-container {
        padding: 10px;

        .carousel-item {
          width: 100%;
          height: unset;

          .carousel-img {
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 1fr 1fr;
            justify-content: space-between;

            img {
              width: 100%;
              margin: 0;
            }
          }
        }

        .desktop {
          display: none;
        }

        .mobile {
          display: block;
        }
      }

      .hot-img {
        width: 100%;
        margin-bottom: 10px;
      }

      .all-game-container {
        .grid-items {
          display: grid;
          justify-content: start;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 9px;
        }

        .game-list-wrapper {
          grid-template-columns: 1fr 1fr;
          grid-gap: 10px;

          .game-slot a .slot-img {
            width: 100%;
            height: unset;
          }
          .game-slot a .slot-name {
            opacity: 1;
            font-size: 18px;
            img {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}

.slot-iframe {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: block;
}
</style>
