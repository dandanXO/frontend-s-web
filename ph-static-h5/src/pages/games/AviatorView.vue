<template>
  <div class="fishing-container">
    <div class="bubbles">
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
    </div>
    <div class="margin-center game-container">
      <div class="all-game-container">
        <div class="plat-type-container" style="display: none">
          <div class="plat-list">
            <div
              class="plat-item"
              v-for="p in platforms"
              :class="{ active: p.id === selectedPlatId }"
              :key="p"
              @click="switchPlat(p)"
            >
              <img :src="require('../../assets/logo/' + p.code + '.png')" />
              <!-- <img
                v-if="p.name === 'JDB'"
                src="../../assets/images/common/logo/JDB.png"
              />
              <img
                v-if="p.name === 'KAGaming'"
                src="../../assets/images/common/logo/KA.png"
              />
              <img
                v-if="p.name === 'CQ9'"
                src="../../assets/images/common/logo/CQ9.png"
              />
              <img
                v-if="p.name === 'NextSpin'"
                src="../../assets/images/common/logo/es.png"
              />
              <img
                v-if="p.name === 'YL'"
                src="../../assets/images/common/logo/YL.png"
              />
              <img
                v-if="p.name === 'FC'"
                src="../../assets/images/common/logo/FC.png"
              />
              <img
                v-if="p.name === 'JiliGames'"
                src="../../assets/images/common/logo/jl.png"
              /> -->
            </div>
          </div>
        </div>
        <div class="grid-items flex-box flex-align-center search-container web-only-box"></div>
        <!-- <div class="game-list-wrapper">
          <div
            class="game-slot animate__animated animate__fadeInRight"
            v-for="game in gameListData"
            :key="game.id"
          >
            <a @click="fishGame.open(game.name, selectedPlat.code, game.code)">
              <div class="slot-img">
                <img :src="game.icon ? game.icon : game.default" />
              </div>
              <div class="slot-name">
                {{ game.name }}
                <RiPlayLine />
              </div>
            </a>
          </div>
        </div> -->
        <q-scroll-area ref="scrollPageRef" style="height: calc(100vh - 265px)" :thumb-style="{ width: 0 }">
          <div class="loading-div" v-if="isLoading">
            <q-spinner-hourglass color="light-blue-4" size="8em" />
          </div>
          <q-intersection transition="scale">
            <div class="grid fishing">
              <div
                class="game-slot"
                v-for="game in gameListData"
                :key="game.id"
                @click="fishGame.open(game.name, selectedPlat.code, game.code, selectedPlat.status)"
                style="height: 120px"
              >
                <div class="slot-img">
                  <!-- <q-img loading="lazy" :src="game.icon" style="height: 150px">
                    <template v-slot:loading>
                      <img :src="game.default"/>
                    </template>
                    <template v-slot:error>
                      <img :src="game.default"/>
                    </template>
                  </q-img> -->

                  <div
                    class="box"
                    style="display: flex; justify-content: center"
                    :style="`background: url(${game.default})no-repeat center center; background-size: 100% 100%;aspect-ratio:1/1;`"
                  >
                    <img :src="game.icon" v-bind:alt="game.default" style="height: 100%; width: 100%" />
                  </div>
                </div>
                <div class="slot-name">
                  <span class="slide">{{ game.name }}</span>
                </div>

                <!-- <a @click="openGame(game.name, game.code)">
              <div class="slot-img">
                <img :src="game.default" v-image="game.icon" />
              </div>
              <div class="slot-name">
                <img src="../../assets/images/games/slots/play-icon.png" />
                {{ game.name }}
              </div>
            </a> -->
              </div>
            </div>
          </q-intersection>
          <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
          <q-scroll-observer @scroll="scrolling" />
        </q-scroll-area>
      </div>
    </div>
    <!--Waves Container-->
    <div>
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(36,71,100,0.7" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(36,71,100,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(36,71,100,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#244764" />
        </g>
      </svg>
    </div>
  </div>
  <GameModal ref="fishGame"></GameModal>
</template>

<script lang="js">
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import { getPlatformGames, getPlatformList } from "src/api/platform/platform";
import GameModal from "components/modal/GameModal";
// import { message } from "ant-design-vue";
// import { loadPromoBanner } from "src/api/index/promo";
import {api} from "boot/axios";
import {cached} from "boot/cache";
import {useQuasar, Platform} from "quasar";
import {useRoute} from "vue-router";
import BacktoTop from "components/backtotop.vue"
import {scroll} from 'quasar'

export default defineComponent({
  components: {GameModal, BacktoTop},
  props: ['activeSubTab'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const route = useRoute()
    const platforms = ref([]);
    const selectedPlatId = ref();
    const selectedPlat = ref(platforms.value[0]);
    const fishGame = ref(null);
    const gameListData = ref([]);
    const isLoading = ref(false);

    const gamePage = reactive({
      gameList: [],
    });
    const switchPlat = (plat) => {
      selectedPlat.value = plat;
      selectedPlatId.value = plat.id;
      loadGameList();
    };

    const getPlatList = () => {
      isLoading.value = true;
      // return;

      getPlatformList().then((data) => {
        isLoading.value = false;
        platforms.value = data.filter(element => element.gameType.includes("FISH"));
        platforms.value.forEach((e, i) => {
          if (e.code === 'AWS') {
            platforms.value.splice(i, 1)
          }
        });
        if (!route.query.plat) {
          switchPlat(platforms.value[0]);

        } else {
          platforms.value.forEach(element => {
            if (parseInt(route.query.plat) === element.id) {
              switchPlat(element)
            }
          });
        }
      }).catch((err) => {
        isLoading.value = false;
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "Loading failed",
        //   icon: "report_problem"
        // });
      }).finally(() => {
        emit('platformUpdate', platforms.value)
      })

    };

    const isShowBtt = ref(false)
    const {getScrollTarget, getVerticalScrollPosition, setVerticalScrollPosition} = scroll
    const scrollPosition = ref(0)
    const scrolling = (e) => {
      scrollPosition.value = e.position
      if (e.position.top > 400) {
        isShowBtt.value = true
      }
    }
    const scrollPageRef = ref();
    const position = ref(0);
    const scrollToTop = (el) => {
      scrollPageRef.value.setScrollPosition('vertical', position)
      isShowBtt.value = false
    }

    const loadGameList = () => {
      isLoading.value = true;
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB"
      var way = null
      if (Platform.is.android) {
        way = "ANDROID"
      } else if (Platform.is.ios) {
        way="IOS"
      }
      const code = selectedPlatId.value;
      const gameType = "FISH";
      const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

      cached.get(key, () => api.get("/platformGames", {
        params: {platformId: code, gameType: gameType, device: regDevice, way: way},
      }).then((res) => {
        isLoading.value = false;

        if (res.code === 0) {
          return res
        }
      }).catch((err) => {
        isLoading.value = false;
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "Loading failed",
        //   icon: "report_problem"
        // });
      })).then((res) => {
        isLoading.value = false;
        res.forEach(element => {
          element.default = require("../../assets/images/games/aviator/default.png");
          element.icon = `${process.env.IMAGE_CDN}/games/fish/${selectedPlat.value.code}/${element.icon}.png`;
        });
        gameListData.value = res;
      })
    };


    onMounted(() => {
      getPlatList();
    });

    watch(() => props.activeSubTab, () => {
      const plat = platforms.value.find(({ code }) => code === props.activeSubTab);

      if(plat) {
        switchPlat(plat);
      }
    })

    return {
      platforms,
      selectedPlatId,
      selectedPlat,
      switchPlat,
      loadGameList,
      fishGame,
      gameListData,
      scrolling,
      isShowBtt,
      scrollPageRef,
      scrollToTop,
      scroll,
      scrollPosition,
      isLoading
    };
  }
});
</script>
<style scoped lang="scss">
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

.fishing-container {
  // background-color: #f5faff;
  // background-image: url("../../assets/images/account/bg-23.png");

  //background: linear-gradient(to top, #23263c, #244764);
  background-attachment: fixed;
  background-size: cover;
  position: relative;
  overflow: hidden;

  .banner-container {
    width: 100%;

    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      overflow: hidden;
      height: 180px;
      margin: 10px;
      border-radius: 10px;

      img {
        width: 100%;
      }
    }
  }

  .waves {
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: -7px;
    /*Fix
   for safari gap*/
    min-height: 100px;
    max-height: 150px;
    z-index: 0;
  }

  /* Animation */
  .parallax > use {
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
  }

  .parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
  }

  .parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
  }

  .parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
  }

  .parallax > use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
  }

  @keyframes move-forever {
    0% {
      transform: translate3d(-90px, 0, 0);
    }
    100% {
      transform: translate3d(85px, 0, 0);
    }
  }

  .bubbles {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    top: 0;
    left: 0;
  }

  .bubble {
    position: absolute;
    bottom: -100px;
    width: 40px;
    height: 40px;
    background: #5d5d7e;
    border-radius: 50%;
    opacity: 0.5;
    animation: rise 10s infinite ease-in;
  }

  .bubble:nth-child(1) {
    width: 40px;
    height: 40px;
    left: 10%;
    animation-duration: 8s;
  }

  .bubble:nth-child(2) {
    width: 20px;
    height: 20px;
    left: 20%;
    animation-duration: 5s;
    animation-delay: 1s;
  }

  .bubble:nth-child(3) {
    width: 50px;
    height: 50px;
    left: 35%;
    animation-duration: 7s;
    animation-delay: 2s;
  }

  .bubble:nth-child(4) {
    width: 80px;
    height: 80px;
    left: 50%;
    animation-duration: 11s;
    animation-delay: 0s;
  }

  .bubble:nth-child(5) {
    width: 35px;
    height: 35px;
    left: 55%;
    animation-duration: 6s;
    animation-delay: 1s;
  }

  .bubble:nth-child(6) {
    width: 45px;
    height: 45px;
    left: 65%;
    animation-duration: 8s;
    animation-delay: 3s;
  }

  .bubble:nth-child(7) {
    width: 90px;
    height: 90px;
    left: 70%;
    animation-duration: 12s;
    animation-delay: 2s;
  }

  .bubble:nth-child(8) {
    width: 25px;
    height: 25px;
    left: 80%;
    animation-duration: 6s;
    animation-delay: 2s;
  }

  .bubble:nth-child(9) {
    width: 15px;
    height: 15px;
    left: 70%;
    animation-duration: 5s;
    animation-delay: 1s;
  }

  .bubble:nth-child(10) {
    width: 90px;
    height: 90px;
    left: 25%;
    animation-duration: 10s;
    animation-delay: 4s;
  }

  @keyframes rise {
    0% {
      bottom: -100px;
      transform: translateX(0);
    }
    50% {
      transform: translate(100px);
    }
    100% {
      bottom: 1080px;
      transform: translateX(-200px);
    }
  }

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
          background-image: url("../../assets/images/common/title_large.png");
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
          background-image: url("../../assets/images/common/title_small.png");
          background-repeat: no-repeat;
          right: -36px;
          top: 10px;
        }
      }
    }
  }

  .game-container {
    max-width: 1280px;
    width: 95%;
    padding: 0;
    margin: 0 auto;

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
      margin: 0px auto;

      .plat-type-container {
        display: flex;
        justify-content: center;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
        align-items: flex-end;

        .plat-list {
          cursor: pointer;
          display: flex;
          grid-gap: 20px;
          max-width: 1400px;
          width: 100%;
          margin: 10px auto 0;
          overflow: auto;
          padding: 5px 20px 10px;
          justify-content: flex-start;

          .plat-item {
            min-width: 130px;
            padding: 7px 10px;
            cursor: pointer;
            border-radius: 10px;
            z-index: 2;
            align-items: center;
            box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.24);

            // min-width: 100px;
            text-align: center;

            img {
              max-height: 25px;
              filter: grayscale(1);
              display: block;
              margin: 0 auto;
            }

            &.active {
              background: $primary;
              border: 1px solid hsla(0, 0%, 78%, 0.5);
              box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.24);

              img {
                filter: grayscale(0);
              }

              span {
                color: #ffffff;
              }
            }
          }
        }
      }

      // .game-list-wrapper {
      //   display: grid;
      //   grid-template-columns: 1fr 1fr;
      //   margin: 30px auto;
      //   grid-gap: 30px;

      //   .game-slot {
      //     -webkit-animation: scale 1s;
      //     animation: scale 1s;
      //     -webkit-transform: scale(0, 0);
      //     transform: scale(0, 0);
      //     -webkit-animation-fill-mode: forwards;
      //     animation-fill-mode: forwards;
      //     position: relative;
      //     border-radius: 20px;
      //     overflow: hidden;
      //     display: flex;
      //     justify-content: center;
      //     align-items: center;
      //     a {
      //       display: block;
      //       text-align: center;

      //       &:hover {
      //         img {
      //           // transform: scale(1.2);
      //           filter: brightness(0);
      //           transform: rotateY(180deg);
      //         }

      //         .slot-name {
      //           opacity: 1;
      //           font-size: 18px;
      //           svg {
      //             width: 40px;
      //             fill: #ffffff;
      //             transform: scale(1);
      //           }
      //           img {
      //             opacity: 1;
      //             transition: all 0.3s ease-out;
      //             -webkit-animation: playzoom 0.5s;
      //             animation: playzoom 0.5s;
      //             -webkit-animation-fill-mode: forwards;
      //             animation-fill-mode: forwards;
      //           }
      //         }
      //       }

      //       .slot-img {
      //         width: 100%;
      //         height: auto;
      //         overflow: hidden;
      //         border-radius: 20px;
      //         img {
      //           transition: all 0.5s ease;
      //         }
      //       }

      //       .slot-name {
      //         position: absolute;
      //         top: 0;
      //         left: 0;
      //         width: 100%;
      //         height: 100%;
      //         // background: rgba(0, 0, 0, 0.6);
      //         transition: all 0.3s ease-out;
      //         // box-shadow: 0 0 20px #5f6065 inset;
      //         display: flex;
      //         opacity: 0;
      //         flex-direction: column-reverse;
      //         justify-content: center;
      //         align-items: center;
      //         color: #ffffff;
      //         font-size: 0;
      //         line-height: 23px;
      //         width: 100%;
      //         overflow: hidden;

      //         svg {
      //           fill: #ffffff;
      //           width: 40px;
      //           transform: scale(4);
      //           transition: all 0.3s ease-out;
      //           border: 2px solid #ffffff;
      //           border-radius: 50%;
      //           padding: 10px;
      //           margin-bottom: 10px;
      //         }
      //         img {
      //           width: 90px;
      //           margin-bottom: 10px;
      //           display: block;
      //           opacity: 0;
      //         }
      //       }
      //     }
      //   }

      //   img {
      //     width: 100%;
      //   }
      // }

      .grid.fishing {
        // padding: 0 20px 10px;
        // display: grid;
        // grid-auto-rows: 100px;
        // grid-template-columns: repeat(3, 1fr);

        // grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr);
        // gap: 10px;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        width: 100%;
        margin: 0 auto;

        .game-slot {
          cursor: pointer;
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          // -webkit-animation: scale 1s;
          // animation: scale 1s;
          // -webkit-transform: scale(0, 0);
          // transform: scale(0, 0);
          // -webkit-animation-fill-mode: forwards;
          // animation-fill-mode: forwards;

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

          .slot-name {
            background: linear-gradient(0deg, #1f2035 20%, transparent);
            position: absolute;
            bottom: 0;
            color: #fff;
            left: 0;
            right: 0;
            padding: 10px;
            text-align: center;
          }

          .slide {
            display: block;
            line-height: 15px;
            white-space: nowrap; /* 防止文本换行 */
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
          }
        }
      }
    }
  }

  .pagination-wrapper {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 80px;
  }
}

.slot-iframe {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: block;
}

.loading-div {
  z-index: 99;
  position: fixed;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
  margin: 0 auto;
  width: 100%;
  height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 100px;

  svg {
    color: #1e88e5;
    width: 48px;
  }
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
  margin: 10px;
  color: #ffffff;
  width: 460px;
  background: #23263c;
  border: #23263c;
  padding: 10px;
}

.search-container :deep(.anticon) {
  font-size: 22px;
}

.search-container :deep(.ant-input-affix-wrapper) {
  padding-top: 0;
  padding-bottom: 0;
  margin-left: 16px;
  background-color: #23263c;
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
        color: #242424;
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

.q-scrollarea {
  // padding-top: 14px;
}

@media (max-width: 768px) {
  .fishing-container {
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

    .game-container {
      .all-game-container {
      }
    }
  }
}
</style>
