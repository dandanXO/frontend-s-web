<template>
  <div class="home-title-container">
    <div class="home-title">
      <img class="title-img-left" src="../assets/home/title/title-section.png" />
      <div class="title">
        <img class="title-bg" src="../assets/home/title/title-ball.png" />
        <div class="title-text">{{ title }}</div>
      </div>
      <img class="title-img-right" src="../assets/home/title/title-section.png" />
    </div>
    <div class="subtitle-text">{{ subtitle }}</div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps(["title", "subtitle"]);
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
        z-index: -1;
        width: 5rem;
      }

      .title-text {
        word-break: keep-all;
        filter: drop-shadow(0px 2px #c4effa);
        font-family: FZHanZhenGuangBiaoS-GB;
        font-size: 2.82869rem;
        font-weight: 600;
        letter-spacing: 0.14144rem;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke-width: 0.5px;
        -webkit-text-stroke-color: white;
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
</style>
