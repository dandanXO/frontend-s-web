<template>
  <div class="home">
    <HomeViewLayoutAdapter />
  </div>
  <AnnouncementModal />
</template>

<script setup>
import HomeViewLayoutAdapter from "@/components/home/HomeViewLayoutAdapter.vue";
import AnnouncementModal from "@/components/modal/AnnouncementModal.vue";
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
