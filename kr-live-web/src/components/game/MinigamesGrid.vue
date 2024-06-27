<template>
  <div v-if="props.isLoading" class="loading-spinner">
    <q-spinner-orbit :color="'primary'" size="8em" />
  </div>
  <div class="minigames-grid" v-else>
    <q-img v-for="(game, index) in props.minigames" loading="lazy" :src="game.icon" fit="fill" height="auto"
      spinner-color="white" position="50% 20%" style="border-radius: 20px; overflow: hidden" :key="index"
      @click="playGame(game.name, 'TFGaming', game.code)" class="minigames-grid-item">
      <template v-slot:loading>
        <img :src="defaultImg" style="width: 100%; height: 100%; border-radius: 15px; overflow: hidden" />
      </template>
    </q-img>

    <div v-for="(game, index) in props.minigamesMore" :key="index" class="minigames-grid-item minigame-select-div"
      @click="props.showTypeH5(game.id)" @mouseover="props.showTypeWeb(game.id)" @mouseleave="props.showTypeWeb(0)">

      <img class="minigames-grid-item" :src="game.logo" />

      <transition appear>
        <div class="select-type-div" v-if="props.showMiniType == game.id">
          <div class="game-type btn-pointer" id="copper-type"
            @click="props.playGame(game.name, 'TFGaming', game.copper)">
            1,000 - 65K
          </div>
          <div class="game-type btn-pointer" id="silver-type" @click="props.playGame(game.id, 'TFGaming', game.silver)">
            100K - 130K
          </div>
          <div class="game-type btn-pointer" id="gold-type" @click="playGame(game.id, 'TFGaming', game.gold)">
            1,000 - 20K
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['minigames', 'minigamesMore', 'showTypeWeb', 'showTypeH5', 'playGame', 'showMiniType', 'isLoading']);
const defaultImg = require(`../../assets/images/games/aviator/default.png`);
</script>

<style lang="scss" scoped>
.loading-spinner {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.minigames-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 20px;
  padding: 20px;

  .minigames-grid-item {
    width: 100%;
    height: auto;
    aspect-ratio: 672 / 828;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: top center;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.1s ease-in-out;
    border-radius: 12px;

    &:hover {
      border: 2px solid #5dd8ff;
      filter: brightness(1.1);
    }
  }
}

.minigame-select-div {
  position: relative;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 672 / 828;
  }

  &:hover {}

  .select-type-div {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 12px;

    .game-type {
      width: 100%;
      height: 33.3%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      color: #000;
      text-shadow: 1px 1px 1px $text-gray;

      &#copper-type {
        background: #b87333;
        opacity: 0.85;
        border-radius: 12px 12px 0px 0px;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }

      &#silver-type {
        background: #c0c0c0;
        opacity: 0.85;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }

      &#gold-type {
        background: #ffd700;
        opacity: 0.85;
        border-radius: 0px 0px 12px 12px;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }
    }
  }
}
</style>