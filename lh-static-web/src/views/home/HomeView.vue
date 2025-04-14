<template>
  <div class="home">
    <HomeBanner></HomeBanner>
    <div class="home-mid-section">
      <HomeAnnouncement></HomeAnnouncement>
      <!-- <EurocupHomePageBanner /> -->
      <HomeHotMatch :openGame="openGame"/>
      <HomeDownload></HomeDownload>
      <HomeHotGame></HomeHotGame>
      <HomeService></HomeService>
    </div>
  </div>
  <GameModal ref="gameMenu" />
  <AnnouncementModal />
  <!-- <NewMemberGuide /> -->
</template>

<script setup>
import GameModal from "@/components/modal/GameModal.vue";
import AnnouncementModal from "@/components/modal/AnnouncementModal.vue";
import { ref, onMounted } from "vue";
import HomeBanner from "@/components/home/HomeBanner.vue";
import HomeAnnouncement from "@/components/home/announcement/index.vue";
import HomeDownload from "@/components/home/download/index.vue";
import HomeHotMatch from "@/components/home/hotmatch/HotMatch.vue";
import HomeHotGame from "@/components/home/hotgame/index.vue";
import HomeService from "@/components/home/service/index.vue";
import { userStore } from "@/store";
// import EurocupHomePageBanner from "@/components/home/EurocupHomePageBanner.vue";
// import NewMemberGuide from '@/components/home/NewMemberGuide.vue'

const store = userStore();
const gameMenu = ref(null);
const openGame = (gameName, platType, gameCode, scrollingState) => {
  gameMenu.value.open(gameName, platType, gameCode, scrollingState);
};

onMounted(() => {});
</script>

<style scoped lang="scss">
.home {
  margin: 0px;
  background-image: url("../../assets/images/home/home-bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: top center;
}

.home-mid-section {
  padding-top: 20px;
  padding-bottom: 2.5rem;
}
</style>
