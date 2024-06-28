<template>
  <div v-if="isLoading" class="game-items-loading">
    <q-spinner-orbit size="8em" />
  </div>
  <GameItem v-else :game="game" :onClickGameItem="props.onClickGameItem" :gameType="gameType"
    v-for="game, gameIndex in props.games" :key="gameIndex" />
</template>
<script setup>
import { ref } from "vue";
import GameItem from './GameItem';

const props = defineProps(["games", "onClickGameItem", "gameType", "isLoading"]);
const gameType = ref(props.gameType);
</script>
<style lang="scss" scoped>
.game-items-loading {
  width: 200px;
  height: 365px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
