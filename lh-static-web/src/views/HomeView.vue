<template>
  <div class="home">
    <HomeBanner></HomeBanner>
    <HomeAnnouncement></HomeAnnouncement>
    <HomeDownload></HomeDownload>
    <HomeHotMatch></HomeHotMatch>
    <HomeHotGame></HomeHotGame>
    <HomeService></HomeService>
  </div>
  <GameModal ref="gameMenu" />
</template>

<script setup>
import GameModal from "@/components/modal/GameModal.vue";
import { ref, onMounted } from "vue";
import HomeBanner from "@/components/home/HomeBanner.vue";
import HomeAnnouncement from "@/components/home/HomeAnnouncement.vue";
import HomeDownload from "@/components/home/HomeDownload.vue";
import HomeHotMatch from "@/components/home/HomeHotMatch.vue";
import HomeHotGame from "@/components/home/HomeHotGame.vue";
import HomeService from "@/components/home/HomeService.vue";

const gameMenu = ref(null);
const openGame = (gameName, platType, gameCode, scrollingState) => {
  gameMenu.value.open(gameName, platType, gameCode, scrollingState);
};

onMounted(() => {
});
</script>

<style scoped lang="scss">
.home {
  margin: 0 0 2.5rem 0;
  background-image: url("../assets/home/home-bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
}
</style>
