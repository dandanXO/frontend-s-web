<template>
  <img class="scroll-btn scroll-up" src="../assets/images/index/scroll-btn.png" alt="" />
  <img class="bg-frame" src="../assets/images/index/bg-frame.png" alt="" />
  <img class="bg" src="../assets/images/index/bg.png" alt="" />

  <img v-if="!isNoInfo" class="bg-character" src="../assets/images/index/bg-character.png" alt="" />
  <div v-else class="no-info-container">
    <img class="" src="../assets/images/earn-money/no-info.png" alt="" />
    <div class="no-info-text">{{ noInfoTitle }}</div>
  </div>
  <img class="scroll-btn scroll-down" src="../assets/images/index/scroll-btn.png" alt="" />
</template>

<script setup>
const props = defineProps(["isNoInfo", "noInfoTitle"]);
</script>

<style lang="scss">
.bg-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;

  .scroll-btn {
    width: 2rem;
    margin: 0.5rem 0;

    &.scroll-up {
      transform: rotate(180deg);
    }
  }

  .bg {
    position: absolute;
  }

  .bg-character {
    position: absolute;
    top: 2rem;
  }

  .no-info-container {
    position: absolute;
    top: 10rem;

    img {
      width: 20rem;
    }

    .no-info-text {
      font-size: 1.25rem;
      font-weight: 700;
      text-align: center;
    }
  }

  img {
    width: 30rem;
  }
}
</style>
