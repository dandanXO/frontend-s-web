<template>
  <div class="slot-game-wrapper">
    <div class="slot-game-platform-wrapper">
      <button
        v-for="(platform, index) in platformsListDisplay"
        :key="index"
        :class="{
          active: selectedPlat === platform.code
        }"
        class="slot-game-platform-btn"
        @click="clickPlat(platform)"
      >
        <div class="slot-game-platform-btn__text">
          <span class="slot-game-platform-btn__text-title">{{ platform.code === "AG" ? "XIN" : platform.code }}</span>
          <br />
          <span class="slot-game-platform-btn__text-description">{{ $t("home.slotEdition.description") }}</span>
        </div>
        <img class="slot-game-platform-btn__icon" :src="getPlatformIcon(platform.code)" />
        <!-- <img
          v-if="platform.code.toLowerCase() === 'pt'"
          src="@/assets/images/index/new-ribbon.svg"
          class="new-ribbon"
        /> -->
      </button>
    </div>
    <div v-if="isLoading" v-loading="isLoading" class="slot-game-loading-wrapper" />
    <div v-else class="slot-game-game-wrapper game-list-wrapper">
      <div class="game-slot animate__animated animate__fadeInRight" v-for="game in gameListData" :key="game.id">
        <a @click="openGame(game, selectedPlat, game.code)">
          <div class="slot-img">
            <el-image :src="game.icon" lazy :alt="game.name">
              <template #placeholder>
                <img :src="game.default" />
              </template>
              <template #error>
                <div class="image-slot">
                  <img :src="game.default" />
                </div>
              </template>
            </el-image>
          </div>

          <div class="slot-details">
            <div class="slot-name">
              {{ game.name }}
            </div>

            <!--            <div class="slot-fav"></div>-->
          </div>
          <!-- <div class="slot-logo">
            <img :src="require(`@/assets/images/home/slotEdition/${selectedPlat.toLowerCase()}-logo.png`)" />
          </div> -->
        </a>
        <div @click="openGame(game, selectedPlat, game.code)" class="play-btn">
          {{ $t("common.playnow") }}
        </div>
      </div>
      <div class="game-slot more-game">
        <router-link :to="{ path: '/slot', query: { plat: selectedPlat } }">
          <div>
            <img src="@/assets/images/home/slotEdition/more-game-img.png" alt="more game" />
          </div>
          <button>{{ $t("home.slotEdition.moreGame") }}</button>
        </router-link>
      </div>
    </div>
    <GameModal ref="gameRef" />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { userStore } from "@/store";
import { getLoggedInPlatformList, getPlatformGames, getPlatformListDisplay } from "@/api/platform/platform";
import { slotPlatforms } from "@/shared/platformArray";
import { useLocalStorage } from "@vueuse/core";
import GameModal from "@/components/modal/GameModal.vue";

const GAME_TYPE = "SLOT";

const store = userStore();

const platformsList = ref([]);
const filteredPlatforms = ref([]);
const platformsListDisplay = ref([]);
const selectedPlat = ref("");
const activePlat = ref(null);
const gameListData = ref([]);
const gameRef = ref();
const isLoading = ref(false);

const getPlatformIcon = (code) => {
  try {
    return require(`@/assets/images/home/slotEdition/${code.toLowerCase()}-platform-icon.png`);
  } catch (e) {
    return "";
  }
};

const getPlatformList = () => {
  const getFn = store.token ? getLoggedInPlatformList : getPlatformListDisplay;
  getFn().then((res) => {
    platformsList.value = res;

    platformsListDisplay.value = platformsList.value.filter((element) =>
      element.gameType
        .split(",")
        .some(
          (type) =>
            type.trim().toUpperCase() === GAME_TYPE.toUpperCase() ||
            (type.trim().toUpperCase() === "COCKFIGHT" && GAME_TYPE.toUpperCase() === "FISH")
        )
    );

    platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
      const matchingItem = slotPlatforms.find((item2) => item1.code === item2.code);
      return { ...matchingItem, ...item1 };
    });

    setFilteredPlatforms();
  });
};

const setFilteredPlatforms = () => {
  filteredPlatforms.value = slotPlatforms.filter((displayPlatform) =>
    platformsListDisplay.value.some((platform) => platform.code === displayPlatform.code)
  );

  filteredPlatforms.value = platformsListDisplay.value.map((item1) => {
    const matchingItem = slotPlatforms.find((item2) => item1.code === item2.code);
    return { ...matchingItem, ...item1 };
  });
  clickPlat(filteredPlatforms.value[0]);
};

const clickPlat = (plat) => {
  selectedPlat.value = plat.code;
  switchPlat(plat);
};

const getPlatGameList = () => {
  const getFn = store.token ? getLoggedInPlatformList : getPlatformListDisplay;
  getFn()
    .then((data) => {
      platformsListDisplay.value = data.filter(
        (element) => element.gameType.includes(GAME_TYPE) || (element.gameType === "COCKFIGHT" && GAME_TYPE === "FISH")
      );
      platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
        const matchingItem = slotPlatforms.find((item2) => item1.code === item2.code);
        return { ...matchingItem, ...item1 };
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const switchPlat = (plat) => {
  activePlat.value = plat;
  loadGameList();
};

const loadGameList = () => {
  isLoading.value = true;
  getPlatformGames(activePlat.value.id, GAME_TYPE)
    .then((data) => {
      data.forEach((element) => {
        element.default = require("@/assets/images/games/aviator/default.png");
        var imageUrl = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;
        element.icon = `${imageUrl}/game/${element.icon}`;
      });
      gameListData.value = data.filter((_, index) => index < 9);
    })
    .catch((err) => {
      console.log(err.message);
    })
    .finally(() => (isLoading.value = false));
};

const openGame = (item, platformCode, gameCode) => {
  const platName = item.alias ?? item.name ?? item.name;
  gameRef.value.open(platName, platformCode, gameCode);
};

onMounted(() => {
  getPlatformList();
  getPlatGameList();
});
</script>
<style lang="scss" scoped>
.slot-game-wrapper {
  max-width: 1300px;
  margin: 40px auto;
  .slot-game-platform-wrapper {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, 244px);
    margin-bottom: 40px;
    .slot-game-platform-btn {
      background: url(@/assets/images/home/slotEdition/platform-bg.png) no-repeat;
      background-size: contain;
      height: 94px;
      position: relative;
      padding: 20px 27px;

      &.active {
        background-image: url(@/assets/images/home/slotEdition/platform-bg-active.png);
        .slot-game-platform-btn__text {
          .slot-game-platform-btn__text-title {
            color: #0047ff;
          }
          .slot-game-platform-btn__text-description {
            color: #4e93ff;
          }
        }
      }

      .slot-game-platform-btn__text {
        text-align: left;
        .slot-game-platform-btn__text-title {
          font-size: 24px;
          font-weight: 900;
          line-height: 34px;
          color: #717171;
        }
        .slot-game-platform-btn__text-description {
          font-size: 12px;
          font-weight: 600;
          line-height: 17px;
          color: #a4aabb;
        }
      }

      .slot-game-platform-btn__icon {
        position: absolute;
        right: 11px;
        top: 50%;
        transform: translateY(-50%);
        max-height: 94px;
      }

      .new-ribbon {
        position: absolute;
        right: -10px;
        top: -5px;
        max-width: 64px;
      }
    }
  }
}

.slot-game-loading-wrapper {
  display: flex;
  height: 30vh;
  :deep(.el-loading-mask) {
    background-color: transparent;
  }
}

.game-list-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;

  &.cockfight-special {
    display: flex;
    justify-content: center;

    .game-slot {
      max-width: 300px;
    }

    .slot-details {
      justify-content: center !important;
      font-size: 20px !important;
    }
  }

  .game-slot {
    animation: 2s ease 0s 1 normal none running game-circle-ani;
    position: relative;
    border-radius: 1rem;
    background: #fff;
    padding: 0.5rem;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);

    .play-btn {
      display: none;
      position: absolute;
      top: 50%;
      margin-top: -38px;
      margin-left: -80px;
      height: 48px;
      width: 160px;
      left: 50%;
      margin-bottom: 20px;
      z-index: 2;
      //background: #67c23a;
      //color: #e6e6e6;
      //background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
      //box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.664px 0px #a2bff4 inset;
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: #fff;
      border-radius: 20px;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 20px;
      cursor: pointer;

      &:hover {
        opacity: 0.9;
      }
      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }
    }

    &:hover {
      .play-btn {
        transition: all 0.3s ease-out;
        -webkit-animation: playzoomsm 0.2s;
        animation: playzoomsm 0.2s;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
        display: flex;
      }
    }

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
        box-shadow: 0 0 90px #fff inset;
        //background-image: url(../../assets/game/play-btn.svg);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 50%;
        opacity: 0;
        transition: all 0.3s ease-out;
        left: 0px;
        z-index: 1;
      }

      &:hover {
        &::before {
          content: "";
          position: absolute;
          height: 100%;
          width: 100%;
          box-shadow: 0 0 20px #fff inset;
          background-color: #ffffff40;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 25%;
          opacity: 0.8;
        }

        img {
          transform: scale(1.2);
        }

        .slot-name {
          text-align: center;

          img {
            opacity: 1;
            transition: all 0.3s ease-out;
            -webkit-animation: playzoom 0.5s;
            animation: playzoom 0.5s;
            -webkit-animation-fill-mode: forwards;
            animation-fill-mode: forwards;
          }
        }

        .slot-logo {
          img {
            transform: none;
          }
        }
      }

      .slot-img,
      .cockfight-img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        overflow: hidden;

        .el-image {
          height: 100%;

          .image-slot {
            height: 100%;

            img {
              height: 100%;
              width: 100%;
            }
          }
        }

        img {
          transition: all 0.5s ease;
        }
      }
      .cockfight-img {
        aspect-ratio: unset;
      }

      .slot-details {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .slot-name {
        padding: 0.5rem 1rem;
        color: #7a80a1;
        position: relative;

        img {
          width: 90px;
          margin-bottom: 10px;
          display: none;
          opacity: 0;
        }
      }

      .slot-fav {
        display: block;
        position: relative;
        z-index: 5;
        width: 2rem;
        height: 2rem;

        i {
          font-size: 1.5rem;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: $font-grey;

          &:last-child {
            // display: none;
            opacity: 0;
            font-size: 1.75rem;
            transition: 0.3s all;
          }
        }

        &:hover,
        &.fav-on {
          i {
            color: $color-danger;

            &:last-child {
              // display: block;
              opacity: 1;
            }
          }
        }
      }
      .slot-logo {
        height: 35px;
        img {
          height: 100%;
          object-fit: contain;
          object-position: left;
        }
      }
    }
    &.more-game {
      padding: 35px 0;
      box-shadow: 0px 0px 10px 0px #0000001a;
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      max-height: 285px;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 25px;
        &::before {
          display: none;
        }
      }
      img {
        max-width: 104px;
      }
      button {
        background-color: #fff;
        border-radius: 35px;
        padding: 13px 32px;
        font-size: 20px;
        font-weight: 600;
        line-height: 29.28px;
        text-align: center;
      }
    }
  }

  img {
    width: 100%;
  }
}
</style>
