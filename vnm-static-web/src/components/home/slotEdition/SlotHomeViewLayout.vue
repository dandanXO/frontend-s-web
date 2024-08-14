<template>
  <HomeBanner></HomeBanner>
  <div class="home-mid-section">
    <HomeAnnouncement></HomeAnnouncement>
    <SlotGameList />
    <SlotPromotion />
    <HomeDownload></HomeDownload>
    <HomeService></HomeService>
  </div>
</template>

<script setup>
import HomeBanner from "@/components/home/HomeBanner.vue";
import HomeAnnouncement from "@/components/home/HomeAnnouncement.vue";
import HomeDownload from "@/components/home/HomeDownload.vue";
import HomeService from "@/components/home/HomeService.vue";
import SlotGameList from "@/components/home/slotEdition/SlotGameList.vue";
import SlotPromotion from "@/components/home/slotEdition/SlotPromotion.vue";
</script>

<style scoped lang="scss">
.home-mid-section {
  padding-top: 20px;
  padding-bottom: 7.5rem;
}
</style>
