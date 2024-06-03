<template>
  <div class="main-container">
    <div class="main-wrapper">
      <div class="center-content">
        <div class="og-tab-content container" v-if="['casino', 'Poker'].indexOf(platform.code) === -1">
          <h2 class="hot-game-header">
            <img src="../assets/images/common/submenu/menu-icons/hot-icon.png" />
            <span>Jackpot</span>
          </h2>
          <div class="hot-games-section">
            <img
              @click="openGame(jackpot, jackpot.platformCode)"
              v-for="(jackpot, index) in jackpotGame"
              :key="index"
              :src="
                imgGamesURL + jackpot.gameType.toLowerCase() + '/' + jackpot.platformCode + '/' + jackpot.icon + '.png'
              "
            />
          </div>
        </div>
        <GameModal ref="slotsGame" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import moment from "moment";
import { useRoute, useRouter } from "vue-router";

import { getPlatformGames, getPlatformList, jackpotGames } from "@/api/platform/platform";
import { globalStore } from "@/store";
import NavPlatforms from "@/constant/platforms";
import GameModal from "@/components/modal/GameModal";

const imgGamesURL = process.env.VUE_APP_IMAGE_CDN + "/games/";
const platforms = ref([]);
const platform = ref(NavPlatforms[0]);

const slotsGame = ref(null);

const openGame = (game, platName, platStatus = "OPEN") => {
  if (game.gameType && (game.gameType === "SLOT" || game.gameType === "FISH")) {
    slotsGame.value.open(game.name, platName, game.code, platStatus);
  } else {
    slotsGame.value.open(game.gameName, game.name, game.code, platStatus);
  }
};

const jackpotGame = ref([]);
const getJackpotGames = () => {
  jackpotGames("JACKPOT").then((res) => {
    jackpotGame.value = res.slice(0, 10);

    console.log("JACKPOT:: ", jackpotGame.value);
  });
};

onMounted(async () => {
  getJackpotGames();
});
</script>

<style scoped lang="scss">
$link-color: #db7e42;
.dark-theme {
  .main-container .main-wrapper .station-notice-container {
    background: #ffffff05;

    border: 1px solid;
    border-image-slice: 1;
    border-width: 1px;
    border-radius: 12px;
    border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);
  }
}
.main-container {
  padding: 0;

  .main-wrapper {
    width: 100%;
  }
}
</style>

<style scoped lang="scss" data-alt="tabs">
.og-tabs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  margin-block: 1rem;
  overflow: auto;
  gap: 0.6rem;

  @media (max-width: 767px) {
    gap: 0.3em;
  }

  .game-tab {
    position: relative;
    cursor: pointer;
    transition: 0.3s all;
    aspect-ratio: 166/75;
    border-radius: 15px;
    // background-image: url("../assets/images/common/bghometabs.png");
    background-size: cover;

    img {
      position: absolute;
      right: 0px;
      top: 50%;
      aspect-ratio: 1/1;
      object-fit: contain;
      transform: translate(0%, -50%);
      bottom: 10px;
      max-width: 50%;
    }

    &:hover {
      transform: translate(0px, -3px);
    }

    > span {
      transition: all 0.3s ease-in-out;
      position: absolute;
      font-weight: 500;
      font-size: 18px;
      line-height: 137.19%;
      letter-spacing: 0.06em;
      left: 10px;
      top: 50%;
      margin-top: -15px;
      text-transform: uppercase;
      color: #000;
    }
  }

  & > * {
  }
}
.center-content {
  background: url(../assets/images/index/centerbg.png) no-repeat center top;
  background-size: cover;
  overflow: hidden;
  .jackpot {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    // background: url(../assets/images/games/jackpot-w.png) no-repeat center center;
    background-size: contain;
    mix-blend-mode: darken;
    width: 90%;
    margin: 0 auto;
    .numbers {
      font-family: "Arial Black";
      font-size: 2.5vw;
      padding-top: 1.5vw;
      padding-left: 1vw;
      font-weight: 900;
      line-height: 52px;
      letter-spacing: 0em;
      text-align: left;
      color: #ffe500;
      height: 20vw;
      min-height: 200px;
      max-height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;

      text-shadow: 3px 3px #845f00;
    }
    img {
      width: 100%;
      mix-blend-mode: plus-lighter;
    }
  }
}
.og-tab-content {
  margin: 1rem auto;
  padding: 25px;
  width: 90%;
  /* background: #434343; */
  box-shadow: 0px 2px 10px 0px #ffffff inset;
  box-shadow: 0px 0px 17.600000381469727px 0px #ffffff inset;
  box-shadow: 0px 4px 10px 0px #0000001a;
  background: linear-gradient(0deg, #ecf5ff, #ecf5ff), linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 20px;
  border: 1px solid #ffffff;

  .hot-game-header {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: "Baloo Bhaina";
    font-size: 2.4rem;
    line-height: 42px;
    margin: 0;
    padding-bottom: 20px;
  }

  .hot-games-section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 30px;

    img {
      width: 195px;
      height: 244.5px;
      border-radius: 10px;
    }
  }
  .og-tab-content-header {
    display: flex;
    align-items: flex-end;
    gap: 2rem;
    padding-bottom: 2em;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }
  }

  h2 {
    font-size: 3rem;
    margin: 0;
    line-height: 1;

    @media (max-width: 767px) {
      margin-bottom: 0.3em;
    }
  }

  .og-tab-content-header-sub {
    display: flex;
    gap: 1.25rem;
    overflow: auto;
    flex: 1 1 auto;

    @media (max-width: 767px) {
      width: 100%;
      gap: 1em;
      margin-bottom: 1.25rem;
    }

    & > * {
      padding: 1em;
      border-radius: 4px;
      min-width: 80px;
      background: transparent;
      &.og-btn {
        img {
          max-height: 25px;
        }
      }
    }
  }

  a {
    color: inherit;
    font-size: 1rem;
  }
}

.og-tab-content-body {
  gap: 3rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  @media (max-width: 767px) {
    gap: 1.5rem 1rem;
    grid-template-columns: repeat(2, 1fr);
  }

  & > div {
    text-align: center;
    cursor: pointer;
  }

  .og-content-thumb {
    // aspect-ratio: 2/3;
    max-width: 240px;
    margin-inline: auto;
    transform: scale(1);
    border-radius: 4px;

    transition: all 0.3s;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
    }
  }

  & > div:hover {
    .og-content-thumb {
      transform: scale(1.1);
    }
  }
}

.og-btn-active {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 39px;
    border-radius: 1px;
    height: 2px;
    background: #3981ff;
  }
}
.ribbonbar {
  background: url(../assets/images/index/ribbon.png) no-repeat center center;
  background-size: cover;
  display: flex;
  gap: 4vw;
  justify-content: center;
  height: 10vw;
  align-items: center;
  margin-bottom: 50px;
  padding-left: 150px;
  width: 100%;
  .rib {
    display: flex;
    gap: 10px;
    padding: 20px 0;
    font-size: 0.8rem;
    justify-content: center;
    align-items: center;
    .rib-left {
      width: 65px;
      height: 65px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
    .rib-center {
      display: flex;
      flex-direction: column;
      color: #ffffff99;
      .rib-number {
        font-family: "Poppins Regular";
      }
      .rib-title {
        font-family: "Poppins Medium";
      }
    }
    .rib-right {
      font-family: "Poppins Bold";
      display: flex;
      flex-direction: column;
      gap: 5px;
      .rib-tag {
        background: #ffa800;
        border-radius: 4px;
        color: #ffffff;
        font-size: 0.6rem;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px 5px;
      }
      .rib-plus {
        font-size: 0.8rem;
        color: #ffffff;
      }
    }
  }
}
.ant-btn-round {
  height: 48px;
  font-size: 18px;
}

.dark-theme {
  .og-tab-content {
    background: unset;
    border: none;
    box-shadow: none;
    .og-tab-content-header-sub > * {
      background: transparent;
      &.og-btn {
        img {
          max-height: 25px;
        }
      }
      &.og-btn-active {
        background: linear-gradient(90deg, rgba(57, 129, 255, 0.2) 0%, rgba(20, 29, 38, 0.2) 100%);
      }
    }
  }

  .center-content {
    background: url(../assets/images/index/centerbg.png) no-repeat center top;
    background-size: cover;
    overflow: hidden;
    .jackpot {
      mix-blend-mode: exclusion;
      // background-image: url(../assets/images/games/jackpot.png);
      img {
        width: 100%;
        mix-blend-mode: plus-lighter;
      }
    }
  }
}
.grid-wrapper {
  overflow: hidden;
}

.grid {
  display: flex;
  margin: 0px auto 0px;
  align-items: flex-start;
  column-gap: 8px;
  row-gap: 14px;
  width: calc(100% - 40px);
  background: #1976d2;
  padding: 6px 12px 6px;
  border-radius: 12px;
  overflow-x: auto;

  @media (min-width: 769px) {
    margin: 10px auto;
  }

  .game-board-item {
    border-radius: 8px;
    width: auto;
    gap: 5px;
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    text-align: center;
    padding: 4px 16px;
    white-space: nowrap;
    cursor: pointer;

    &.active-board {
      // background: $linear-bg-4;
      color: #fff;
      border-radius: 6px;
      font-weight: bold;
      background: linear-gradient(144.11deg, #4183d3 29.63%, #8ec1f7 96.04%);
    }

    &:hover {
      filter: brightness(0.88);
    }

    &:active {
      opacity: 0.95;
    }

    span {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      padding: 10px 15px;
      text-transform: capitalize;
    }

    img {
      width: auto;
      max-height: 30px;
    }
  }
}
</style>
