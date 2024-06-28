<template>
  <GameItem :game="game" :onClickGameItem="props.onClickGameItem" :gameType="gameType"
    v-for="game, gameIndex in props.games" :key="gameIndex" />
</template>
<script setup>
import { ref } from "vue";
import GameItem from './GameItem';

const props = defineProps(["games", "onClickGameItem", "gameType"]);
const gameType = ref(props.gameType);
</script>
<style lang="scss" scoped></style>
