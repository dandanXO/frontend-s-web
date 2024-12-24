<template>
  <div class="marquee-wrapper">
    <MarqueeText :repeat="10">
      <div v-for="index in 2" :key="index" :class="index % 2 ? 'odd' : 'even'" class="marquee-content">
        <img v-if="type === 'bounty'" src="../../../assets/images/promo/hotpromo/blastbounty/marquee-bounty.png" />
        <img v-else  src="../../../assets/images/promo/hotpromo/blastbounty/marquee-odd.png" />
      </div>
    </MarqueeText>
  </div>
</template>
<script setup>
import MarqueeText from "vue-marquee-text-component";
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

  .marquee-text-wrap {
    height: 16px;
  }

  .marquee-content {
    display: inline-block;
    justify-content: center;
    padding: 1.4px 15px 2.8px;
    width: 112px;
    height: 16px;

    img {
      display: block;
      max-width: 100%;
    }

    &.odd {
      $bg-color: #fffd66;
      background-color: $bg-color;
      clip-path: polygon(8px 0, 104px 0, 100% 100%, 0 100%);
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
