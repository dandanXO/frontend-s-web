<template>
  <div class="home" :class="store?.theme === 'CNY' ? 'cny-bg' : ''">
    <HomeViewLayoutAdapter />
  </div>
  <AnnouncementModal />
</template>

<script setup>
import AnnouncementModal from "@/components/modal/AnnouncementModal.vue";
import HomeViewLayoutAdapter from "@/components/home/HomeViewLayoutAdapter.vue";
import { userStore } from "@/store/index";

const store = userStore();
</script>

<style scoped lang="scss">
.home {
  margin: 0px;
  background-image: url("../assets/images/home/home-bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: top center;

  &.cny-bg {
    background-image: url("../assets/images/home/cny/cny-home-bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: top center;
  }
}
</style>
