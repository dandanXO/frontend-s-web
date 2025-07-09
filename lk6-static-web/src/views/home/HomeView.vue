<template>
  <div class="home">
    <HomeBanner @scrollToView="handleScrollToView" />
    <div class="home-mid-section">
      <HomeAnnouncement></HomeAnnouncement>
      <HomeHotGame></HomeHotGame>
      <HomeDownload></HomeDownload>
      <HomeService></HomeService>
    </div>
  </div>
  <GameModal ref="gameMenu" />
  <AnnouncementModal />
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

const livestreamRef = ref(null);
const gameMenu = ref(null);

const handleScrollToView = (viewName) => {
  if (viewName === "livestream") {
    livestreamRef.value?.$el?.scrollIntoView({ behavior: "smooth", block: "end" });
  }
};

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
  padding-bottom: 80px;
}
</style>
