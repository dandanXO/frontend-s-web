<template>

  <!-- <q-spinner v-if="props.gameItemLoad" class="spin-center" color="teal" size="50px" /> -->
  <div :class="`game-item ${game.name.toLowerCase()}`" v-for="game, gameIndex in props.games" :key="gameIndex"
    @click="() => props.onClickGameItem(game)">
    <div class="game-item-content">
      <img class="bg-overlay" :src="(() => {
          try {
            return `${require(`../../assets/home/games/${gameType}/game-bg-${game.name.toLowerCase()}.png`)}`;
          } catch (e) {
            return `${require(`../../assets/home/games/${gameType}/game-bg-empty.png`)}`;
          }
        })()
        " />
      <img class="active-overlay" :src="require(`../../assets/home/games/game-bg--active.png`)" />
      <div class="game-info-wrapper">
        <img class="arrow" src="../../assets/home/games/game-item-arrow.svg" />
        <div class="game-name">{{ game?.alias || game.name }}</div>
        <img class="game-logo" :src="(() => {
            console.log('here', `../../assets/home/games/logo/game-logo-${game.name.toLowerCase()}.png`)
            try {
              return `${require(`../../assets/home/games/logo/game-logo-${game.name.toLowerCase()}.png`)}`;
            } catch (e) {
              return `${require(`../../assets/home/games/logo/game-logo-empty.png`)}`;
            }
          })()
          " />
      </div>
      <div class="avatar-wrapper">
        <img class="avatar-bg" :src="(() => {
            try {
              return `${require(`../../assets/home/games/${gameType}/game-rounded-${game.name.toLowerCase()}.png`)}`;
            } catch (e) {
              return `${require(`../../assets/home/games/${gameType}/game-rounded-empty.png`)}`;
            }
          })()
          " />
        <img class="avatar" :src="(() => {
            try {
              return `${require(`../../assets/home/games/${gameType}/game-${game.name.toLowerCase()}.png`)}`;
            } catch (e) {
              return `${require(`../../assets/home/games/${gameType}/game-empty.png`)}`;
            }
          })()
          " />
      </div>
      <div class="game-entry-btn">
        <div class="primary-button blue"><img class="star"
            src="../../assets/home/games/game-entry-button-star.svg" />게임입장<img class="star"
            src="../../assets/home/games/game-entry-button-star.svg" /></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { QSpinner } from "quasar";
const props = defineProps(["games", "onClickGameItem", "gameType", "gameItemLoad"]);
const gameType = ref(props.gameType);
</script>
<style lang="scss" scoped>
.game-item {
  aspect-ratio: 290 / 530;
  background: url('../../assets/home/games/background-placeholder.png') no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  cursor: pointer;
  transition: 0.3s all;
  padding: 20px;
  max-width: 200px;
  width: 100%;

  @media (max-width: 769px) {
    max-width: 130px;
  }

  .active-overlay,
  .bg-overlay {
    transition: 0.3s all;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }

  .active-overlay {
    opacity: 0;
  }

  .game-item-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: 0.3s all;

    .game-info-wrapper {
      position: absolute;
      top: 12%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      @media (max-width: 769px) {
        top: 12%;
      }

      .arrow {
        width: 24px;

        @media (max-width: 769px) {
          width: 16px;
        }
      }

      .game-name {
        color: #fff;
        font-size: 20px;
        line-height: 1;
        white-space: nowrap;

        @media (max-width: 769px) {
          font-size: 14px;
        }
      }

      .game-logo {
        max-width: 120px;
        aspect-ratio: 283 / 96;
        // width: 100%;

        @media (max-width: 769px) {
          max-width: 75px;
        }
      }
    }

    .avatar-wrapper {

      .avatar-bg,
      .avatar {
        width: 100%;
        transition: 0.3s all;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .game-entry-btn {
      position: absolute;
      bottom: 11%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      display: flex;
      justify-content: center;

      .star {
        padding: 0 5px;
      }

      @media (max-width: 769px) {
        bottom: 7%;

        .primary-button.blue {
          width: 100px;
          height: 30px;
        }
      }

      &:hover {
        filter: brightness(0.9);
      }
    }
  }

  &:hover {
    .active-overlay {
      opacity: 0.3;
    }

    .game-item-content {
      .avatar-wrapper {

        .avatar-bg,
        .avatar {
          transform: translate(-50%, -50%) scale(1.1);
        }
      }
    }
  }
}



.spin-center {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
