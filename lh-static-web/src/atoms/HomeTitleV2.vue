<template>
  <div class="home-title-container">
    <img class="home-title-bg" src="@/assets/home/title/title-bg-v2.png" />
    <span class="home-title-subtitle">{{ subtitle }}</span>
    <h3 class="home-title-title">{{ title }}</h3>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";

defineProps(["title", "subtitle"]);

const isDark = useDark();
</script>

<style scoped lang="scss">
.home-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2.5rem 0 0 0;
  height: 95px;
  position: relative;

  .home-title-bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    pointer-events: none;
    filter: brightness(0) saturate(100%) invert(42%) sepia(59%) saturate(3754%) hue-rotate(209deg) brightness(105%)
      contrast(110%);
    z-index: 1;
  }

  .home-title-title {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    background-clip: text;
    z-index: 1;
    font-family: FZHanZhenGuangBiaoS-GB;
    font-size: 45.26px;
    font-weight: 400;
    line-height: 53.75px;
    letter-spacing: 0.05em;
    color: transparent;
  }

  .home-title-subtitle {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(180deg, rgba(155, 171, 199, 0.3) 0%, rgba(207, 236, 249, 0.5) 100%);
    background-clip: text;
    font-family: FZHanZhenGuangBiaoS-GB;
    font-size: 80px;
    font-weight: 400;
    line-height: 95px;
    color: transparent;
    pointer-events: none;
    white-space: nowrap;
  }
}

.dark {
  .home-title-container {
    .home-title-bg {
      filter: none;
    }

    .home-title-title {
      background: linear-gradient(180deg, #b0dfd4 0%, #82c5ce 98%);
      background-clip: text;
    }

    .home-title-subtitle {
      background: linear-gradient(180deg, rgba(207, 236, 249, 0.1) 0%, rgba(155, 171, 199, 0) 100%);
      background-clip: text;
    }
  }
}
</style>
