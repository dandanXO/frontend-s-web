<template>
  <div v-if="isLoading" class="game-items-loading">
    <q-skeleton v-for="rectSkeleton, rectSkeletonIndex in 5" :key="rectSkeletonIndex" type="rect"
      class="scooped-skeleton" />
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
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
