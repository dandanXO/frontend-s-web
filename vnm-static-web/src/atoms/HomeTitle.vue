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
      width: 20rem;
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
        background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%),
        linear-gradient(0deg, #FFFFFF, #FFFFFF);

        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        filter: drop-shadow(2px 1px #C4EFFA);
        position:relative;
        z-index:2;

        margin: 0 2.5rem;
      }
    }

    .title-img-right {
      width: 20rem;
      transform: scaleX(-1);
    }
  }

  .subtitle-text {
    text-align: center;
    text-transform: uppercase;
    color: #858585;
    ;
    font-size: 1.17363rem;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.05869rem;
  }
}
</style>
