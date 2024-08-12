<template>
  <HomeBanner></HomeBanner>
  <div class="home-mid-section">
    <HomeAnnouncement></HomeAnnouncement>
    <HomeHotMatches></HomeHotMatches>
    <NewsSection></NewsSection>
    <HomeDownload></HomeDownload>
    <HomeService></HomeService>
  </div>
</template>

<script setup>
import HomeBanner from "@/components/home/HomeBanner.vue";
import NewsSection from "@/components/home/NewsSection.vue";
import HomeAnnouncement from "@/components/home/HomeAnnouncement.vue";
import HomeDownload from "@/components/home/HomeDownload.vue";
import HomeHotMatches from "@/components/home/HomeHotMatches.vue";
import HomeService from "@/components/home/HomeService.vue";
</script>

<style scoped lang="scss">
.home-mid-section {
  padding-top: 20px;
  padding-bottom: 2.5rem;
}
</style>
