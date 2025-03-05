<template>
  <div class="livestream-container">
    <img
      src="@/assets/home/livestream/livestream-title-light.png"
      style="display: flex; margin: 20px auto 10px; width: 1300px"
    />
    <div class="livestream-inner-wrapper">
      <LivestreamList class="livestream-list" />
      <CurrentLivestream />
      <LivestreamChat class="livestream-chat" />
      <LivestreamVideo />
    </div>
  </div>
</template>
<script setup>
import LivestreamList from "@/components/home/livestream/LivestreamList.vue";
import CurrentLivestream from "@/components/home/livestream/CurrentLivestream.vue";
import LivestreamChat from "@/components/home/livestream/LivestreamChat.vue";
import LivestreamVideo from "@/components/home/livestream/LivestreamVideo.vue";
</script>
<style lang="scss" scoped>
.livestream-container {
  max-width: 1320px;
  margin: 0 auto;

  .livestream-inner-wrapper {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: auto auto 1fr;
    gap: 18.87px;
    padding: 18px;
    border: 2px solid #fff;
    border-radius: 15px;
    box-shadow: 0px 0px 5.76px 4.72px #22446e21 inset;

    .livestream-list {
      grid-column: 1 / span 2;
    }
    .livestream-chat {
      grid-row: 2 / span 2;
      grid-column: 2;
      height: 632px;
    }
  }
}
</style>
