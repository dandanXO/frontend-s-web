<template>
  <div class="item_list">
    <q-spinner v-if="props.gameItemLoad" class="center" color="teal" size="50px" />

    <template v-else>
      <a v-for="p in props.games" :key="p.id" class="game_item" @click="() => props.onClickGameItem(p)">
        <div class="game_box">
          <div class="game_thumb_platform">
            <div class="platform_game_bg">
              <img
                :src="
                  (() => {
                    try {
                      return `${require(`../../assets/home/games/${gameType}/game-bg-${p.name.toLowerCase()}.png`)}`;
                    } catch (e) {
                      return `${require(`../../assets/home/games/${gameType}/game-bg-empty.png`)}`;
                    }
                  })()
                "
              />
              <div class="activated"><img src="../../assets/home/games/game-bg--active.png" /></div>
            </div>

            <div class="platform_game_title">
              <div>{{ p.name }}</div>
              <div>
                <img
                  :src="
                    (() => {
                      try {
                        return `${require(`../../assets/home/games/logo/game-logo-${p.name.toLowerCase()}.png`)}`;
                      } catch (e) {
                        return `${require(`../../assets/home/games/logo/game-logo-empty.png`)}`;
                      }
                    })()
                  "
                />
              </div>
            </div>

            <div class="platform_game_rounded">
              <img
                :src="
                  (() => {
                    try {
                      return `${require(`../../assets/home/games/${gameType}/game-rounded-${p.name.toLowerCase()}.png`)}`;
                    } catch (e) {
                      return `${require(`../../assets/home/games/${gameType}/game-rounded-empty.png`)}`;
                    }
                  })()
                "
              />
            </div>

            <div class="platform_game_img">
              <img
                :src="
                  (() => {
                    try {
                      return `${require(`../../assets/home/games/${gameType}/game-${p.name.toLowerCase()}.png`)}`;
                    } catch (e) {
                      return `${require(`../../assets/home/games/${gameType}/game-empty.png`)}`;
                    }
                  })()
                "
              />
            </div>

            <div class="platform_game_btn">
              <div class="btn-w-blue">게임입장</div>
            </div>

            <!-- <img
            class="platform-img"
            :src="
              (() => {
                try {
                  return `${require(`../../assets/home/games/live-${p.name.toLowerCase()}.png`)}`;
                } catch (e) {
                  return `${require(`../../assets/home/slot/StayTuned.png`)}`;
                }
              })()
            "
          /> -->
            <!-- <div class="platform-company-box">
                        <div class="company-image" :style="{
                            backgroundImage: (() => {
                                try {
                                    return `url(${require(`../../assets/images/footer/logo-${p.name.toLowerCase()}.png`)})`;
                                } catch (e) {
                                    return '';
                                }
                            })()
                        }"></div>
                    </div> -->
            <!-- <div class="thumb_cover">
            <img src="../../assets/images/index/kr-logo.png" class="icon_play" />
          </div> -->
          </div>
          <!-- <div class="game_info">
          <h2>게임입장</h2>
          <h3>{{ p.alias ? p.alias : p.name }}</h3>
        </div> -->
        </div>
      </a>
    </template>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { QSpinner } from "quasar";
const props = defineProps(["games", "onClickGameItem", "gameType", "gameItemLoad"]);
const gameType = ref(props.gameType);
</script>
<style lang="scss" scoped>
.item_list {
  // padding: 20px 0px 30px 0px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  text-align: center;
  justify-content: space-around;
  gap: 15px;
  padding: 0 16px;
  @media (min-width: 769px) {
    justify-content: flex-start;
    // padding: 0px;
  }
}

a {
  color: #007bff;
  text-decoration: none;
  background-color: transparent;
  cursor: pointer;
  text-decoration: none !important;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.item_list > a {
  position: relative;
  display: block;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.game_item {
  width: calc(25% - 15px);

  @media (max-width: 769px) {
    width: calc(33% - 15px);
  }
  @media (max-width: 600px) {
    width: calc(50% - 15px);
  }
  @media (max-width: 355px) {
    width: calc(100% - 15px);
  }
}

.game_item_sm {
  width: calc(14% - 16px);
}

.item_list .game_item:after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  opacity: 0;
  z-index: -1;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.platform-img {
  display: block;
  width: 100%;
}

.game_thumb_platform {
  position: relative;

  // width: 100%;

  &:hover {
    .platform_game_rounded {
      transform: scale(1.05);
    }

    .platform_game_img {
      transform: scale(1.1);
    }

    .platform_game_bg .activated {
      // opacity: 1;
      opacity: 0.5; /* Adjust between 0 and 1 for transparency level */
      filter: brightness(1);
      width: 100%;
      height: 100%;
    }
  }
  .platform_game_bg {
    transition: 0.3s all;

    .activated {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      transition: all 0.3s;
    }
    img {
      display: block;
      width: 100%;
    }
  }

  .platform_game_title {
    display: flex;
    justify-content: center;
    text-align: center;
    position: absolute;
    flex-direction: column;
    top: 40px;
    transform: translateX(-50%);
    left: 50%;
    color: #ffffff;
    font-size: 24px;
  }

  .platform_game_rounded {
    transition: 0.3s all;
    position: absolute;
    top: 0;
    left: 0;
    img {
      display: block;
      width: 100%;
    }
  }

  .platform_game_img {
    transition: 0.3s all;
    position: absolute;
    top: 0;
    left: 0;
    img {
      display: block;
      width: 100%;
    }
  }

  .platform_game_btn {
    position: absolute;
    bottom: 60px;
    transform: translateX(-50%);
    left: 50%;
  }
}

.game_thumb {
  transition: all 0.3s;
  &:hover {
    // transform: scale(1.05);
    &:after {
      // content: "";
      // position: absolute;
      // height: 70%;
      // width: 100%;
      // background: linear-gradient(to top, rgb(0, 254, 254, 0.3) 0%, transparent 50%);
      // top: 30%;
      // left: 0;
      // border-radius: 0 0 100px 100px;
      // overflow: hidden;
    }
  }
}

// .game_item .game_box .game_thumb {
//   position: relative;
//   overflow: hidden;
//   width: 100%;
//   height: 0;
//   padding-top: 102%;
//   margin-bottom: 10px;
//   -webkit-filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
//   filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
//   z-index: 1;

//   .platform-img {
//     width: 100%;
//     height: auto;
//     // aspect-ratio: 672/648;
//     background-size: 100% 100%;
//     /* background-size: contain; */
//     // background-repeat: no-repeat;
//     // background-position: top center;
//   }

//   .platform-company-box {
//     position: absolute;
//     left: 6px;
//     bottom: 5px;
//     background-color: #0000004d;
//     backdrop-filter: blur(5px);
//     width: calc(100% - 12px);
//     height: 55px;
//     //   -webkit-clip-path: polygon(0 -35%, 100% -25%, 80% 100%, 22% 100%);
//     //   clip-path: polygon(0 -35%, 100% -25%, 80% 100%, 22% 100%);

//     .company-image {
//       width: 100%;
//       height: 100%;
//       background-repeat: no-repeat;
//       background-position: center center;
//     }
//   }
// }

.game_item .game_box .game_info {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  line-height: 1;
  height: 60px;
  margin: 0 10px;
  border: 1px solid #323e4d;
  background: #1f2833;
  border-radius: 4px;
  text-align: center;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  // -webkit-transform: skewX(-10deg);
  // transform: skewX(-10deg)
}

.game_item:hover .game_box .game_info {
  // border: 1px solid #6d7c8e;
  // background: #445365;
  -webkit-box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.9);
  box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.9);
}

.game_item .game_box .game_thumb .thumb_cover {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  // -webkit-clip-path: polygon(20% 0, 80% 0, 100% 70%, 80% 100%, 20% 100%, 0 70%);
  // clip-path: polygon(20% 0, 80% 0, 100% 70%, 80% 100%, 20% 100%, 0 70%);
  opacity: 0;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  z-index: 5;
}

.game_item:hover .game_box .game_thumb .thumb_cover {
  -webkit-transform: scale(0.95);
  transform: scale(0.95);
  opacity: 1;
}

h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
  font-size: 2rem;
}

.game_item .game_box .game_info h2 {
  display: none;
  color: #eee;
  font-size: 20px;
  font-weight: 500;
  text-shadow: 0 0 5px #000, 0 0 5px #000, 0 0 5px #000;
}

.game_item .game_box .game_info h3 {
  margin: 3px 0 3px 0;
  color: #ddd;
  font-size: 16px;
  font-weight: 500;
}

.game_item:hover .game_box .game_info h2 {
  display: block;
  color: #ffc24d;
}

.game_item:hover .game_box .game_info h3 {
  display: none;
}

.game_item .game_box .game_thumb .icon_play {
  width: 60%;
  height: auto;
  margin: 0 auto;
  -webkit-filter: drop-shadow(0 6px 6px #000);
  filter: drop-shadow(0 6px 6px #000);
  z-index: 1;
}

.game_item:hover .game_box .game_thumb .icon_play {
  -webkit-animation: icon_play 0.6s ease-in-out infinite alternate;
  animation: icon_play 0.6s ease-in-out infinite alternate;
  z-index: -1;
}

@-webkit-keyframes icon_play {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  to {
    -webkit-transform: scale(1.04);
    transform: scale(1.04);
  }
}

@keyframes icon_play {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  to {
    -webkit-transform: scale(1.04);
    transform: scale(1.04);
  }
}

.item_list .game_item .game_box .game_thumb:after {
  content: "";
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #789eff;
  background-size: auto 200%;
  z-index: -1;
}

.item_list .game_item:hover .game_box .game_thumb:after {
  background-position: bottom;
}

h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
  font-size: 1.75rem;
}

img {
  border: none;
  border-style: none;
  vertical-align: middle;
}

.item_list .game_item .game_box .game_thumb:after,
.item_list .game_item .game_box .game_thumb > img {
  position: absolute;
  // -webkit-clip-path: polygon(20% 0, 80% 0, 100% 70%, 80% 100%, 20% 100%, 0 70%);
  // clip-path: polygon(20% 0, 80% 0, 100% 70%, 80% 100%, 20% 100%, 0 70%);
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

// .item_list .game_item .game_box .game_thumb > img {
//   top: 4px;
//   left: 6px;
//   right: 6px;
//   bottom: 6px;
//   width: calc(100% - 12px);
//   height: calc(100% - 12px);
// }

.item_list .game_item:hover .game_box .game_thumb > img {
  -webkit-transform: scale(0.94);
  transform: scale(0.94);
}

ul {
  list-style: none;
  margin-bottom: 1rem;
  margin-top: 0;
}

li {
  list-style: none;
}

.slide-in-bottom {
  -webkit-animation: slide-in-bottom 1.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
  animation: slide-in-bottom 1.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
</style>
