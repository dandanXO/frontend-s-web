<template>
  <div class="marquee-wrapper">
    <Vue3Marquee :clone="true">
      <div v-for="index in 2" :key="index" :class="index % 2 ? 'odd' : 'even'" class="marquee-content">
        <img v-if="type === 'bounty'" src="@/assets/images/promotion/hotpromo/blastpremier/marquee-bounty.png" />
        <img v-else src="@/assets/images/promotion/hotpromo/blastpremier/marquee-odd.png" />
      </div>
    </Vue3Marquee>
  </div>
</template>
<script setup>
import { Vue3Marquee } from "vue3-marquee";
import { defineProps } from 'vue';

// Define the `type` prop
defineProps({
  type: {
    type: String, // Type of the prop
    default: null, // Default value
  },
});
</script>
<style lang="scss" scoped>
.marquee-wrapper {
  background-color: #000;

  .marquee-content {
    display: flex;
    justify-content: center;
    padding: 7px 15px 4px;
    width: 280px;
    height: 40px;

    img {
      max-width: 100%;
    }

    &.odd {
      $bg-color: #fffd66;
      background-color: $bg-color;
      clip-path: polygon(20px 0, 260px 0, 100% 100%, 0 100%);
    }

    &.even {
      img {
        filter: brightness(0) saturate(100%) invert(95%) sepia(15%) saturate(0%) hue-rotate(188deg) brightness(106%)
          contrast(106%);
      }
    }
  }
}
</style>
