<template>
  <div class="fishing-container">
    <div
      v-if="banner && banner.desktopImageUrl && banner.mobileImageUrl"
      class="banner-container"
    >
      <div
        class="promo-bg isDesktop"
        :style="
          'background-image: url(' + imgURL + banner.desktopImageUrl + ')'
        "
      ></div>
      <div
        class="promo-bg isMobile"
        :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"
      ></div>
    </div>
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
        <div class="plat-type-container">
          <div class="plat-list">
            <div
              class="plat-item"
              v-for="p in platforms"
              :class="{ active: p.id === selectedPlatId }"
              :key="p"
              @click="switchPlat(p)"
            >
              <img
                :src="
                  require('../../assets/images/common/logo/' + p.code + '.png')
                "
              />
              <!-- <img
                v-if="p.name === 'KAGaming'"
                src="../../assets/images/common/logo/KA.png"
              />
              <img
                v-else-if="p.name === 'Gamatron'"
                src="../../assets/images/common/logo/GMT.png"
              /> -->
            </div>
          </div>
        </div>
        <div
          class="grid-items flex-box flex-align-center search-container web-only-box"
        ></div>
        <div class="game-list-wrapper">
          <div
            class="game-slot animate__animated animate__fadeInRight"
            v-for="game in gameListData"
            :key="game.id"
          >
            <a
              @click="
                fishGame.open(
                  game.name,
                  selectedPlat.code,
                  game.code,
                  game.status
                )
              "
            >
              <div class="slot-img">
                <img :src="game.default" v-image="game.icon" />
              </div>
              <div class="slot-name">
                {{ game.name }}
                <RiPlayLine />
              </div>
            </a>
          </div>
        </div>
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
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            fill="rgba(36,71,100,0.7"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            fill="rgba(36,71,100,0.5)"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            fill="rgba(36,71,100,0.3)"
          />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#244764" />
        </g>
      </svg>
    </div>

    <GameModal ref="fishGame"></GameModal>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { getPlatformGames, getPlatformList } from "@/api/platform/platform";
import GameModal from "@/components/modal/GameModal";
import { useRoute, useRouter } from 'vue-router';
// import { message } from "ant-design-vue";
import { loadPromoBanner } from "@/api/index/promo";
import { RiPlayLine
 } from "vue-remix-icons";


export default defineComponent({
  components: { GameModal, RiPlayLine,
  },
setup() {
  const imgURL = process.env.VUE_APP_IMAGE_CDN + '/'
  const route = useRoute();
  const router = useRouter();
  const platforms = ref([]);
  const selectedPlatId = ref();
  const selectedPlat = ref(platforms.value[0]);
  const fishGame = ref(null);
  const gameListData = ref([]);
  const gamePage = reactive({
    gameList: [],
  });
  const switchPlat = (plat) => {
      router.push({ path: 'aviator', query: { plat: plat.code }})
    selectedPlat.value = plat;
    selectedPlatId.value = plat.id;
    loadGameList();
  };
const banner = ref([])


    const getPlatList = () => {
      getPlatformList().then((data) => {
        platforms.value = data.filter(element => element.gameType.includes("FISH"));
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
        console.log(err.message);
        // message.error(
        //   err.message,
        //   4
        // );
      });
    };

const loadBanner = () => {
  loadPromoBanner("FISH").then((res) => {
    if (res.code === 0) {
      banner.value = res.data[0]
      console.log(banner)
    }
  })
}
const loadGameList = () => {
    getPlatformGames(selectedPlatId.value, "FISH")
      .then((data) => {
        data.forEach((element) => {
           element.default = require("../../assets/images/games/aviator/default.png");
          element.icon = `${process.env.VUE_APP_IMAGE_CDN}/fish/${selectedPlat.value.code}/${element.icon}.png`;
        gameListData.value = data;
        gamePage.total = data.length;

        });
      })
      .catch((err) => {
        console.log(err.message);
        // message.error(err.message, 4);
      });
};
watch(
  () => route.query.plat,
  () => {
    if (route.path === '/aviator') {
      getPlatList();
    }
  }
);
onMounted(() => {
  loadBanner();
  getPlatList();
});

    return {
      platforms,
      selectedPlatId,
      selectedPlat,
      switchPlat,
      loadGameList,
      fishGame,
      gameListData,
      banner,
      imgURL
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
  background: linear-gradient(to top, #23263c, #244764);
  background-image: url("../../assets/images/games/aviator/aviator_bg.png");
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
  .waves {
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: -7px; /*Fix
for safari gap*/
    min-height: 100px;
    max-height: 150px;
  } /* Animation */
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
    padding: 0 0 80px 0;

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
      margin-top: 50px;
      max-width: 1280px;
      margin: 30px auto;
      .plat-type-container {
        display: flex;
        justify-content: center;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
        align-items: flex-end;
        .plat-list {
          font-size: 18px;
          line-height: 18px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          padding: 10px;

          .plat-item {
            padding: 10px;
            cursor: pointer;
            // border-bottom: 4px solid transparent;
            border-radius: 40px;
            background: #003653;
            z-index: 2;
            box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;
            // min-width: 100px;
            text-align: center;
            img {
              max-height: 23px;
              max-width: 100%;
              filter: grayscale(1);
            }
            &.active,
            &:hover {
              background: #1c5370;
              box-shadow: 0 0 5px #ffffff;
              img {
                filter: grayscale(0);
              }
            }
          }
        }
      }
      .game-list-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        margin: 30px auto;
        grid-gap: 30px;

        .game-slot {
          -webkit-animation: scale 1s;
          animation: scale 1s;
          -webkit-transform: scale(0, 0);
          transform: scale(0, 0);
          -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          a {
            display: block;
            text-align: center;

            &:hover {
              img {
                // transform: scale(1.2);
                filter: brightness(0);
                transform: rotateY(180deg);
              }

              .slot-name {
                opacity: 1;
                font-size: 18px;
                svg {
                  width: 40px;
                  fill: #ffffff;
                  transform: scale(1);
                }
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
              border-radius: 20px;
              img {
                transition: all 0.5s ease;
              }
            }

            .slot-name {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              // background: rgba(0, 0, 0, 0.6);
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

              svg {
                fill: #ffffff;
                width: 40px;
                transform: scale(4);
                transition: all 0.3s ease-out;
                border: 2px solid #ffffff;
                border-radius: 50%;
                padding: 10px;
                margin-bottom: 10px;
              }
              img {
                width: 90px;
                margin-bottom: 10px;
                display: block;
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
        .game-list-wrapper {
          grid-template-columns: 1fr 1fr;

          .game-slot {
            img {
              opacity: 0.7;
            }
            a {
              .slot-name {
                opacity: 1;
                font-size: 16px;
                svg {
                  transform: scale(1);
                }
              }
            }
          }
        }
      }
    }
  }
}
// @media (max-width: 768px) {
//   .fishing-container {
//     .game-container {
//       .all-game-container {
//         .plat-type-container {
//           .plat-list {
//             flex-wrap: nowrap;
//             overflow: auto;
//           }
//         }
//       }
//     }
//   }
// }
// @media (max-width: 1440px) {
//   .casino-container .banner-container {
//     background-position: 70% center;
//   }
// }
// @media (max-width: 768px) {
//   .casino-container {
//     min-height: unset;

//     .web-only-box {
//       display: none !important;
//     }

//     .banner-container {
//       // width: 100%;
//       // height: 270px;
//       // padding-top: 30px;
//       font-size: 1rem;
//       // background-image: url("../../assets/images/games/casino/casino_banner_mob.png");
//       padding: 75px 0;
//       background-size: cover;
//     }

//     .title-container {
//       &.large {
//         padding: 12px 0;

//         .game-title {
//           font-size: 1em;

//           &:before {
//             display: none;
//           }

//           &:after {
//             display: none;
//           }
//         }
//       }

//       &.hot {
//         .game-title {
//           font-size: 26px;
//         }
//       }
//     }

//     .game-container {
//       width: 95%;
//       min-width: unset;
//       overflow: hidden;

//       .hot-game-container {
//         padding: 10px;

//         .carousel-item {
//           width: 100%;
//           height: unset;

//           .carousel-img {
//             display: grid;
//             grid-gap: 10px;
//             grid-template-columns: 1fr 1fr;
//             justify-content: space-between;

//             img {
//               width: 100%;
//               margin: 0;
//             }
//           }
//         }

//         .desktop {
//           display: none;
//         }

//         .mobile {
//           display: block;
//         }
//       }

//       .hot-img {
//         width: 100%;
//         margin-bottom: 10px;
//       }

//       .all-game-container {
//         .grid-items {
//           display: grid;
//           justify-content: start;
//           grid-template-columns: repeat(2, 1fr);
//           grid-column-gap: 9px;
//         }

//         .game-list-wrapper {
//           grid-template-columns: 1fr 1fr;
//           grid-gap: 10px;

//           .game-slot a .slot-img {
//             width: 100%;
//             height: unset;
//           }
//         }
//       }
//     }
//   }
// }

// .slot-iframe {
//   height: 100%;
//   width: 100%;
//   margin: 0 auto;
//   display: block;
// }
</style>
