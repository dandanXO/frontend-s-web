<template>
  <div class="home">
    <HomeBanner @scrollToView="handleScrollToView" />
    <div class="home-mid-section">
      <HomeAnnouncement></HomeAnnouncement>
      <Livestream ref="livestreamRef" />
      <HotMatch :openGame="openGame"></HotMatch>
      <HomeHotGame></HomeHotGame>
      <HomeDownload></HomeDownload>
      <HomeService></HomeService>
    </div>
  </div>
  <GameModal ref="gameMenu" />
  <AnnouncementModal />
</template>

<script setup>
import AnnouncementModal from "@/components/modal/AnnouncementModal.vue";
import GameModal from "@/components/modal/GameModal.vue";
import { ref, onMounted } from "vue";
import HomeBanner from "@/components/home/HomeBanner.vue";
import HomeAnnouncement from "@/components/home/announcement/index.vue";
import HomeDownload from "@/components/home/download/index.vue";
import HomeHotGame from "@/components/home/hotgame/index.vue";
import HomeService from "@/components/home/service/index.vue";
import HotMatch from "@/components/home/hotmatch/DarkHotMatch.vue";
import Livestream from "@/components/home/livestream/Livestream.vue";

const livestreamRef = ref(null);
const gameMenu = ref(null);

const openGame = (gameName, platType, gameCode, scrollingState) => {
  gameMenu.value.open(gameName, platType, gameCode, scrollingState);
};

const handleScrollToView = (viewName) => {
  if (viewName === "livestream") {
    livestreamRef.value?.$el?.scrollIntoView({ behavior: "smooth", block: "end" });
  }
};

onMounted(() => {
  // console.log("Home");
});
</script>

<style scoped lang="scss">
.home {
  margin: 0px;
  margin-top: -70px;
  background-image: url("../../assets/images/home/home-bg-dark.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: top center;
}

.home-mid-section {
}
</style>
