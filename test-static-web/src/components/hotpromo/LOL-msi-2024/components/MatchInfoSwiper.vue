<template>
  <swiper :slides-per-view="matchList.length > 1 ? 2 : 1" :space-between="35" :loop="false">
    <template v-for="(match, index) in matchList" :key="index">
      <swiper-slide>
        <div>
          <match-info :match="match" />
        </div>
      </swiper-slide>
    </template>
  </swiper>
</template>
<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";

import MatchInfo from "./MatchInfo.vue";
import "swiper/css";
import "swiper/css/navigation";

defineProps({
  matchList: {
    type: Array,
    default: () => []
  }
});
</script>
<style scoped lang="scss"></style>
