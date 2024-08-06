<template>
  <div class="home">
    <HomeViewLayoutAdapter />
  </div>
  <GameModal ref="gameMenu" />
</template>

<script setup>
import { ref } from "vue";
import GameModal from "@/components/modal/GameModal.vue";
import HomeViewLayoutAdapter from "@/components/home/HomeViewLayoutAdapter.vue";

const gameMenu = ref(null);
const openGame = (gameName, platType, gameCode, scrollingState) => {
  gameMenu.value.open(gameName, platType, gameCode, scrollingState);
};
</script>

<style scoped lang="scss">
.home {
  margin: 0px;
  background-image: url("../assets/images/home/home-bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: top center;
}
</style>
