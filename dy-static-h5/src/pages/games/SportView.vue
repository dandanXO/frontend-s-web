<template>
  <div class="sport-container">
    <div class="sport-txt-wrapper">
      <img src="../../assets/images/games/sport/sport_txt.png" />
    </div>
    <div
      class="margin-center flex-box flex-justify-center flex-align-center sport-main-container"
    >
      <!-- <div class="sport-plat">
        <img
          class="plat-img"
          src="../../assets/images/games/sport/sport_saba.png"
        />
      </div> -->
      <div class="sport-plat">
        <img
          class="plat-img"
          src="../../assets/images/games/sport/sport_cmd.png"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="js"></script>
<style scoped lang="scss">
.sport-container {
  position: relative;
  height: 800px;
  padding-top: 100px;
  background-image: url("../../assets/images/games/sport/sport_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .sport-txt-wrapper {
    position: absolute;
    right: 160px;
    bottom: 115px;
  }
  .sport-main-container {
    width: 1102px;
    .sport-plat {
      .plat-img {
        cursor: pointer;
      }
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .sport-container {
    padding-bottom: 60px;
    background-attachment: fixed;
    background-size: unset;
    height: calc(100vh - 100px);
    padding-top: 0;
    // height: 100%;
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // z-index: -1;
    // padding-top: 140px;
    background-size: unset;
    .sport-txt-wrapper {
      display: none;
    }
    .sport-main-container {
      display: block;
      width: 100%;
      height: 100%;
      .sport-plat {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        .plat-img {
          // width: 266px;
          // cursor: pointer;
          width: 80%;
          cursor: pointer;
          max-width: 360px;
        }
      }
    }
  }
}
</style>
