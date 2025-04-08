<template>
  <div class="game-list-wrapper" ref="gameListWrapperRef">
    <div class="game-left-list">
      <div
        v-for="(platform, index) in platforms"
        class="game-platform btn-pointer"
        :key="index"
        :id="`${platform.name}-platform`"
        @click="selectTab(platform.name)"
      >
        <div class="platform-item">
          <div class="platform-icon-placeholder" />
          <div class="platform-icon--active" :class="tab === platform.name ? 'show' : ''">
            <img
              loading="lazy"
              :src="require(`../../../assets/images/home/v2/game/${platform.name}-icon-active.png`)"
            />
          </div>
          <div class="platform-icon">
            <img loading="lazy" :src="require(`../../../assets/images/home/v2/game/${platform.name}-icon.png`)" />
          </div>
          <span class="platform-name" :class="tab === platform.name ? 'active' : ''">
            {{ $t(`home.menu_${platform.name}`) }}
          </span>
        </div>
      </div>
    </div>
    <div class="game-right-platform" ref="rightPlatformContainer">
      <template v-for="(platform, index) in platforms" :key="index">
        <div class="game-lists fade-in-image" :class="{ hot: platform.name === 'hot' }" :id="`${platform.name}-lists`">
          <div
            v-for="(game, index) in platform.games"
            class="platform-block"
            :key="`${platform.name}-${index}`"
            :class="game.underMaintenance === true ? 'maintenance' : ''"
            @click="handlePlayGame(platform.name, game)"
          >
            <!-- {{ test(platform.name, game) }} -->
            <MaintenanceBox :item="game" />
            <div
              class="platform-img-frame"
              :style="{ 'background-image': getImgPlatformBg(platform.name, game) }"
            ></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { computed, onActivated, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MaintenanceBox from "./MaintenanceBox.vue";

const imgURL = process.env.IMAGE_CDN;
const imgURLGame = imgURL + "/game/";

const props = defineProps({
  hotGameList: Array,
  slotGameList: Array,
  liveGameList: Array,
  pokerGameList: Array,
  fishGameList: Array,
  // fishJiliGameList: Array,
  // fishJdbGameList: Array,
  sportGameList: Array
});

const emit = defineEmits(["playGame", "openGame"]);

const route = useRoute();

const rightPlatformContainer = ref();
const gameListWrapperRef = ref();
const tab = ref("hot");
const isSelecting = ref(false);
const isScrolling = ref(false);
const timerTimeout = ref();

const platforms = computed(() => [
  { name: "hot", games: props.hotGameList },
  { name: "slot", games: props.slotGameList },
  { name: "live", games: props.liveGameList },
  { name: "sport", games: props.sportGameList },
  { name: "poker", games: props.pokerGameList },
  { name: "fish", games: props.fishGameList }
]);

const selectTab = (item) => {
  if (timerTimeout.value) {
    clearTimeout(timerTimeout.value);
  }
  isSelecting.value = true;
  tab.value = item;
  setSelectedSwiper(item);

  timerTimeout.value = setTimeout(() => {
    isSelecting.value = false;
  }, 750);
};

const setSelectedSwiper = (tab) => {
  const gameRightPlatform = document.querySelector(".game-right-platform");
  const gameLeftList = document.querySelector(".game-left-list");
  const [scrollItem1, scrollItem2, scrollItem3, scrollItem4, scrollItem5, scrollItem6] = platforms.value.map(
    (platform) => document.getElementById(`${platform.name}-lists`)
  );

  if (tab === "hot") {
    gameRightPlatform.scrollTo({
      top: scrollItem1.offsetTop - gameRightPlatform.offsetTop,
      behavior: "smooth" // Optional: Use smooth scrolling
    });

    gameLeftList.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  if (tab === "slot") {
    gameRightPlatform.scrollTo({
      top: scrollItem2.offsetTop - gameRightPlatform.offsetTop,
      behavior: "smooth" // Optional: Use smooth scrolling
    });
  }
  if (tab === "live") {
    gameRightPlatform.scrollTo({
      top: scrollItem3.offsetTop - gameRightPlatform.offsetTop,
      behavior: "smooth" // Optional: Use smooth scrolling
    });
  }
  if (tab === "sport") {
    gameRightPlatform.scrollTo({
      top: scrollItem4.offsetTop - gameRightPlatform.offsetTop,
      behavior: "smooth" // Optional: Use smooth scrolling
    });
  }
  if (tab === "poker") {
    gameRightPlatform.scrollTo({
      top: scrollItem5.offsetTop - gameRightPlatform.offsetTop,
      behavior: "smooth" // Optional: Use smooth scrolling
    });

    gameLeftList.scrollTo({
      top: gameLeftList.scrollHeight,
      behavior: "smooth"
    });
  }
  if (tab === "fish") {
    gameRightPlatform.scrollTo({
      top: scrollItem6.offsetTop - gameRightPlatform.offsetTop,
      behavior: "smooth" // Optional: Use smooth scrolling
    });
  }
};

const onHomeScroll = (event) => {
  event.stopPropagation();
  if (isSelecting.value === true) {
    return;
  }
  if (route.path === "/home") {
    if (!isScrolling.value) {
      const gameLeftList = document.querySelector(".game-left-list");

      const platformBlocks = document.getElementsByClassName("platform-block");
      const blockHeight = platformBlocks ? (platformBlocks[0].offsetHeight / 4) * 3 : 75;

      const [checkItem1, checkItem2, checkItem3, checkItem4, checkItem5, checkItem6] = platforms.value.map((platform) =>
        document.getElementById(`${platform.name}-lists`)
      );
      var positionTop1 = checkItem1.getBoundingClientRect().top;
      var positionTop2 = checkItem2.getBoundingClientRect().top;
      var positionTop3 = checkItem3.getBoundingClientRect().top;
      var positionTop4 = checkItem4.getBoundingClientRect().top;
      var positionTop5 = checkItem5.getBoundingClientRect().top;
      var positionTop6 = checkItem6.getBoundingClientRect().top;

      if (0 > positionTop6 - 5) {
        tab.value = "fish";
      } else if (0 > positionTop5 - 5) {
        tab.value = "poker";
        // gameLeftList.scrollTo({
        //   top: 1000,
        //   behavior: "smooth"
        // });
      } else if (0 > positionTop4 - 5) {
        tab.value = "sport";
      } else if (0 > positionTop3 - 5) {
        tab.value = "live";
      } else if (0 > positionTop2 - 5) {
        tab.value = "slot";
        // gameLeftList.scrollTo({
        //   top: 0,
        //   behavior: "smooth"
        // });
      } else if (0 > positionTop1 - 5) {
        tab.value = "hot";
        // gameLeftList.scrollTo({
        //   top: 0,
        //   behavior: "smooth"
        // });
      }
    }
  }
};

// const test = (platform, game) => {
//   if (platform === "hot" && game.type === "game") {
//     return `${game.platform.toLowerCase()}-${game.code.toLowerCase()}`;
//   } else if (platform === "live" || platform === "sport") {
//     return `${game.name.toLowerCase()}`;
//   } else {
//     return `${game.code.toLowerCase()}`;
//   }
// };

const getImgPlatformBg = (platform, game) => {
  try {
    if (platform === "hot" && game.type === "game") {
      return `url(${require(`../../../assets/images/home/v2/game/platform/${platform}/platform-item-${game.platform.toLowerCase()}-${game.code.toLowerCase()}.png`)})`;
    } else if (platform === "live" || platform === "sport") {
      return `url(${require(`../../../assets/images/home/v2/game/platform/${platform}/platform-item-${game.name.toLowerCase()}.png`)})`;
    } else {
      return `url(${require(`../../../assets/images/home/v2/game/platform/${platform}/platform-item-${game.code.toLowerCase()}.png`)})`;
    }
  } catch (e) {
    try {
      if (!game.icon) throw Error();
      return `url(${imgURLGame}${game.icon})`;
    } catch (e) {
      return `url(${require(`../../../assets/images/home/v2/game/platform/${platform}/platform-item-empty.png`)})`;
      try {
        return `url(https://0vsadwuz3sh.com/static/images/v2/${platform}/platform-item-${game.code.toLowerCase()}.png)`;
      } catch (e) {
        return `url(${require(`../../../assets/images/home/v2/game/platform/${platform}/platform-item-empty.png`)})`;
      }
    }
  }
};

const handlePlayGame = (platform, game) => {
  if (platform === "hot") {
    if (game.type === "game") {
      emit("playGame", game.name, game.platformCode, game.code, game.status, game.gameType, game.id, game.demo);
    } else {
      emit("playGame", game.name, game.code, "", game.status, game.gameType, game.id, game.demo);
    }
  } else if (["slot", "fish", "poker"].includes(platform)) {
    let gameType = "";
    switch (platform) {
      case "fish":
        gameType = "FISH";
        break;
      case "poker":
        gameType = "POKER";
        break;
      case "slot":
        gameType = game.gameType === "CASUAL" ? "CASUAL" : "SLOT";
    }
    emit("openGame", game.name, game.code, "", game.status, gameType, game.id);
  } else {
    emit("playGame", game.name, game.code, "", game.status, game.gameType, game.id, game.demo);
  }
};

onActivated(() => {
  rightPlatformContainer.value.addEventListener("scroll", onHomeScroll);
});

watch(
  () => route.hash,
  (newHash) => {
    const tabMap = {
      "#Slot": "slot",
      "#Live": "live",
      "#Fish": "fish",
      "#Poker": "poker",
      "#Sport": "sport"
    };

    const tabName = tabMap[newHash];
    if (tabName) {
      setTimeout(() => {
        selectTab(tabName);
      }, 500);
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.game-list-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 0px auto;
  // gap: 8px;

  > div:first-child{
    margin-right: 8px
  }

  .game-left-list {
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100vh - 380px);
    margin-top: 0px;
    top: 0;
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 0px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-color: transparent transparent;

    &::-webkit-scrollbar {
      display: none;
    }

    .game-platform {
      padding: 0;
      margin: 0;
      margin-bottom: 8px;

      .platform-item {
        position: relative;
      }

      .platform-icon-placeholder {
        height: 0;
        padding-bottom: 107.14%;
        aspect-ratio: 42 / 45;
      }

      .platform-icon {
        position: absolute;
        top: 0;
        left: 0;
      }

      .platform-name {
        position: absolute;
        bottom: 12px;
        width: 100%;
        z-index: 2;
        font-size: 14px;
        font-weight: 600;
        line-height: 18px;
        text-align: center;
        color: #35648f;
        &.active {
          color: #fff;
        }
      }

      .platform-icon--active {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;

        &.show {
          opacity: 1;
          z-index: 2;
        }
      }
    }

    > div {
      width: 100%;
    }

    img {
      display: block;
      width: 100%;
    }
  }
  .game-right-platform {
    overflow-y: scroll;
    overflow-x: hidden;
    // padding-right: 2px;
    // margin-right: -4px;
    height: calc(100vh - 380px);
    margin-top: 0px;
    flex: 11;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-color: transparent transparent;

    &::-webkit-scrollbar {
      display: none;
    }

    .game-lists {
      gap: 8px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 8px;

      &.hot {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px 10px;
        .platform-img-frame {
          height: 0;
          padding-bottom: 94.34%;
          aspect-ratio: 90 / 106;
        }
      }
    }

    > div {
      width: 100%;
    }

    img {
      width: 100%;
    }

    .platform-block {
      cursor: pointer;
      width: 100%;
      position: relative;

      &.maintenance {
        pointer-events: none;

        .platform-img-frame {
          filter: blur(2px);
        }
      }

      &.maintenance:after {
        content: "";
        position: absolute;
        background: #00000069;
        top: 0%;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
      }

      &:hover {
        opacity: 0.9;
      }

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }

      .platform-img {
        width: 100%;
        max-width: 100%;
        height: auto;
        background-size: contain;
        background-repeat: no-repeat;
        height: 0;
        padding-bottom: 34.92%;
        aspect-ratio: 819/295;
      }

      .platform-img-frame {
        border-radius: 12px;
        height: auto;
        width: 100%;
        // background-color: #f4f9fe;
        background-size: 100% 100%;
        background-position: top center;
        background-repeat: no-repeat;
        height: 0;
        padding-bottom: 34.92%;
        aspect-ratio: 819/295;
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns: 50% 50%;
        box-shadow: 4px 4px 4px 0px #0000000d;

        .platform-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        // .platform-item-bg {
        // width: 80%;
        // height: 100%;
        // background-repeat: no-repeat;
        // background-size: contain;
        // background-position: bottom center;
        // margin: auto;
        // }

        .platform-logo {
          height: 1.6rem;

          img {
            display: block;
            height: 100%;
            width: auto;
          }
        }

        .platform-title {
          font-weight: 800;
          font-size: 1.175rem;
          line-height: 1;
          margin-top: 5%;
        }

        .platform-subtitle {
          margin-top: 5%;
          font-size: 0.875rem;
          line-height: 1;
          color: #000000;
        }

        .platform-rebate {
          margin-bottom: 5%;
          margin-top: auto;
          font-size: 0.875rem;
          line-height: 1;
          color: #000000;
          padding: 0.35rem 0.75rem;
          border-radius: 1rem;
          border: 1px solid #fff;
          background: linear-gradient(180deg, #fafbff 0%, #e6edfe 100%);
          box-shadow: 0px 4px 4px 0px rgba(154, 176, 255, 0.1);
          display: none;
          align-items: center;

          span {
            font-weight: 800;
            font-size: 120%;
            display: inline-block;
            margin-left: 0.25rem;
          }
        }

        .platform-label {
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          width: 40%;
          height: 40%;
          // background-image: url(../assets/images/home/label-certified.png);
          background-size: contain;
          background-repeat: no-repeat;
        }
      }
    }
  }

  .fade-in-image {
    animation: fadeIn 1.5s;
  }
}
</style>
