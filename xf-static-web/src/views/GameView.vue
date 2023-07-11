<template>
  <div
    class="casino-container"
    :style="'background-image: url(https://jsn92.czxinbang.com/xf-resource/web/style/img/recreation/recreation_bg.jpg)'"
  >
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
        <div class="plat-type-container">
          <div class="plat-list">
            <template v-for="p in platforms" :key="p">
              <template v-if="p.code === 'AG'"></template>
              <template v-else>
                <div
                  class="plat-item"
                  :class="{ active: p === activePlat }"
                  @click="switchPlat(p)"
                >
                  {{ getGameLabel(p.name) }}
                </div>
              </template>
            </template>
          </div>
        </div>
        <div
          class="grid-items flex-box flex-align-center search-container web-only-box"
        >
          <el-input
            class="search-input"
            v-model="gamePage.searchKey"
            @keypress.enter="searchList()"
            placeholder="输入查找游戏名"
          >
            <template #suffix>
              <el-icon :width="15">
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
    <GameModal ref="slotsGame"></GameModal>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getPlatformGames, getPlatformList, getLoggedInPlatformList, getLoggedInPlatformGames } from "@/api/platform/platform";
import GameModal from "@/components/modal/GameModal";
import { loadPromoBanner } from "@/api/index/promo";
import { useRoute, useRouter } from 'vue-router';
import { useScriptTag } from '@vueuse/core'
import { userStore } from "@/store";
// import { message } from "ant-design-vue";

export default defineComponent({
  components: {
    Search, GameModal
  },
  setup() {
    const store = userStore();
    const numBox = ref(275417746)
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/game/'
    const banner = ref([]);
    const route = useRoute();
    const router = useRouter();
    const slotsGame = ref(null);
    const platforms = ref([]);
    const activePlat = ref(platforms.value[0]);
    const gamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 30,
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
    const getPlatList = () => {

		if (!store.token) {
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
		} else {
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
      // if (!store.token) {
        getPlatformGames(activePlat.value.id, "SLOT").then((data) => {
          data.forEach(element => {
          element.default = `${process.env.VUE_APP_IMAGE_CDN}/game/${activePlat.value.code.toLowerCase()}/slot/${element.icon}.png`;
          element.icon = `${process.env.VUE_APP_IMAGE_CDN}/game/${activePlat.value.code.toLowerCase()}/slot/${element.icon}.png`;
          });
          gameListData.value = data;
          gamePage.total = data.length;
          changePage(1, gamePage.pageSize);
        }).catch((err) => {
          console.log(err.message);
        });
      // } else {
      //   getLoggedInPlatformGames(activePlat.value.id, "SLOT").then((data) => {
      //     data.forEach(element => {
      //     element.default = `${process.env.VUE_APP_IMAGE_CDN}/game/${activePlat.value.code.toLowerCase()}/slot/${element.icon}.png`;
      //     element.icon = `${process.env.VUE_APP_IMAGE_CDN}/game/${activePlat.value.code.toLowerCase()}/slot/${element.icon}.png`;
      //     });
      //     gameListData.value = data;
      //     gamePage.total = data.length;
      //     changePage(1, gamePage.pageSize);
      //   }).catch((err) => {
      //     console.log(err.message);
      //   });
      // }
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

    const getGameLabel = (gameLabel) => {
      if (gameLabel === 'BBINDY') {
        return 'BBIN 电子'
      } else if (gameLabel === 'AMEBA') {
        return 'AE 电子'
      } else if (gameLabel === 'MGP') {
        return 'MG 电子'
      } else {
        return gameLabel + ' 电子'
      }
    }

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
      store,
      getGameLabel,
    };
  }
});
</script>

<style scoped lang="scss">
.el-image {
  min-height: 140px;
  width: 100%;
  cursor: pointer;
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
  // background: url("../assets/images/common/bg.jpg");
  background-repeat: no-repeat;
  background-position: center 0px;
  padding-bottom: 200px;
  .recreation-money {
    width: 350px;
    padding-top: 150px;
    margin: 0 auto;
    font-size: 48px;
    font-weight: 700;
    text-align: center;
    color: #333;
  }
  .banner-container {
    width: 100%;
    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      &.isDesktop {
        display: block;
        height: 430px;
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
    background-color: #222a34;
    border-radius: 8px;
    padding: 40px;
    max-width: 1120px;
    margin: 100px auto;

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

      .plat-type-container {
        padding: 20px;
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
          flex-wrap: wrap;

          .plat-item {
            width: 115px;
            height: 45px;
            line-height: 45px;
            text-align: center;
            background-color: #333b44;
            box-shadow: 0 3px 4px 0 rgb(0 0 0 / 15%);
            border-radius: 50px;
            color: #959dab;
            display: inline-block;
            cursor: pointer;
            font-size: 15px;
            // padding: 10px;
            // cursor: pointer;
            // // border-bottom: 4px solid transparent;
            // border-radius: 40px;
            // background: #003653;
            // z-index: 2;
            // box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;
            // // min-width: 100px;
            // text-align: center;
            img {
              max-height: 23px;
              max-width: 100%;
              filter: grayscale(1);
            }
            &.active,
            &:hover {
              background-image: linear-gradient(90deg, #35d8f2 0, #2188c9 100%),
                linear-gradient(#2a313e, #2a313e);
              color: #fff;
            }
          }
        }
      }

      .search-container {
        margin: 30px 0px 30px auto;
        max-width: 460px;
        .search-input {
          margin-bottom: 10px;
          padding: 0px 10px 0 30px;
        }
      }

      .game-list-wrapper {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
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
          position: relative;

          a {
            display: block;
            text-align: center;

            &:hover {
              img {
                transform: scale(1.2);
              }

              .slot-name {
                opacity: 1;
                font-size: 18px;

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
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              // height: 100%;
              background: rgba(0, 0, 0, 0.6);
              padding: 10px 0;
              transition: all 0.3s ease-out;
              // box-shadow: 0 0 20px #5f6065 inset;
              display: flex;
              opacity: 0;
              flex-direction: column-reverse;
              justify-content: center;
              align-items: center;
              color: #ffffff;
              font-size: 0;
              line-height: 23px;
              width: 100%;
              overflow: hidden;

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
    justify-content: center;
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
