<template>
  <div class="home">
    <HomeBanner></HomeBanner>
    <div class="home-mid-section">
      <HomeAnnouncement></HomeAnnouncement>
      <!--      <HomeHotMatches></HomeHotMatches>-->
      <HomeHotGame></HomeHotGame>
      <HomeInfoListSection />
      <!--      <HomeDownload></HomeDownload>-->
      <!--      <HomeService></HomeService>-->
    </div>
  </div>
  <GameModal ref="gameMenu" />
</template>

<script setup>
import GameModal from "@/components/modal/GameModal.vue";
import { ref } from "vue";
import HomeBanner from "@/components/home/HomeBanner.vue";
import HomeInfoListSection from "@/components/home/HomeInfoListSection.vue";
import HomeAnnouncement from "@/components/home/HomeAnnouncement.vue";
import HomeHotGame from "@/components/home/HomeHotGame.vue";

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

.home-mid-section {
  padding-top: 20px;
  padding-bottom: 2.5rem;
}
</style>
