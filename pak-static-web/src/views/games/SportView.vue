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
.dark-theme {
  .sport-container {
    background: linear-gradient(to bottom, #23263c, #190f25);
  }
}
.sport-container {
  position: relative;
  height: 800px;
  padding-top: 100px;
  background-image: url("../../assets/images/games/sport/centerbg.png");
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
@media (max-width: 767px) {
  .sport-container {
    padding-bottom: 60px;
    background-attachment: fixed;
    min-height: calc(100% - 100px);
    height: 100%;
    padding-top: 0;
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
