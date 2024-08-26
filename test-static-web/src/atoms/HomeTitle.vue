<template>
  <div class="home-title-container">
    <div class="home-title">
      <img class="title-img-left" :src="require(`../assets/home/title/title-section${isDark ? '-dark' : ''}.png`)" />
      <div class="title">
        <img class="title-bg" :src="require(`../assets/home/title/title-ball${isDark ? '-dark' : ''}.png`)" />
        <div class="title-text">{{ title }}</div>
      </div>
      <img class="title-img-right" :src="require(`../assets/home/title/title-section${isDark ? '-dark' : ''}.png`)" />
    </div>
    <div class="subtitle-text">{{ subtitle }}</div>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";

defineProps(["title", "subtitle"]);

const isDark = useDark();
</script>

<style scoped lang="scss">
.home-title-container {
  margin: 2.5rem 0 0 0;

  .home-title {
    display: flex;
    align-items: center;
    justify-content: center;

    .title-img-left {
      width: 22rem;
    }

    .title {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .title-bg {
        position: absolute;
        z-index: 1;
        width: 5rem;
      }

      .title-text {
        word-break: keep-all;
        font-size: 2.82869rem;
        font-weight: 600;
        letter-spacing: 0.14144rem;

        //background: linear-gradient(180deg, #C2E9FB 0%, #A1C4FC 100%);
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%), linear-gradient(0deg, #ffffff, #ffffff);

        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        filter: drop-shadow(2px 1px #c4effa);
        position: relative;
        z-index: 2;

        margin: 0 2.5rem;
      }
    }

    .title-img-right {
      width: 22rem;
      transform: scaleX(-1);
    }
  }

  .subtitle-text {
    text-align: center;
    text-transform: uppercase;
    color: #858585;
    font-family: Microsoft YaHei;
    font-size: 1.17363rem;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.05869rem;
  }
}

.dark {
  .home-title-container {
    .home-title {
      .title {
        .title-text {
          background: linear-gradient(180deg, #c9e1ff 0%, #ffffff 100%);
          background-clip: text;
        }

        .title-bg {
          opacity: 20%;
        }
      }
    }

    .subtitle-text {
      color: $color-white;
      opacity: 20%;
    }
  }
}
</style>
