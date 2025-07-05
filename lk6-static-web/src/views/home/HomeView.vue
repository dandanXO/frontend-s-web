<template>
  <div class="home">
    <HomeBanner @scrollToView="handleScrollToView" />
    <div class="home-mid-section">
      <HomeAnnouncement></HomeAnnouncement>
      <!-- <EurocupHomePageBanner /> -->
      <!-- <Livestream ref="livestreamRef" @livestreamVisible="onLivestreamVisible" /> -->
      <!-- <HomeHotMatch :openGame="openGame" /> -->
      <HomeHotGame></HomeHotGame>
      <HomeDownload></HomeDownload>
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
import HomeHotGame from "@/components/home/hotgame/index.vue";
import HomeService from "@/components/home/service/index.vue";
import { userStore } from "@/store";
// import EurocupHomePageBanner from "@/components/home/EurocupHomePageBanner.vue";
// import NewMemberGuide from '@/components/home/NewMemberGuide.vue'
import { useRoute } from 'vue-router';

const livestreamRef = ref(null);
const gameMenu = ref(null);
const hasRedirectToLivestream = ref(false);

const route = useRoute();

const openGame = (gameName, platType, gameCode, scrollingState) => {
  gameMenu.value.open(gameName, platType, gameCode, scrollingState);
};

const handleScrollToView = (viewName) => {
  if (viewName === "livestream") {
    livestreamRef.value?.$el?.scrollIntoView({ behavior: "smooth", block: "end" });
  }
};

const onLivestreamVisible = () => {
  if(route.hash === '#livestream' && hasRedirectToLivestream.value === false) {
    const element = document.querySelector(".livestream-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      hasRedirectToLivestream.value = true;
    }
  }
}

onMounted(() => { });
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
