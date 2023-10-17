<template>
  <img class="scroll-btn scroll-up" src="../assets/images/index/scroll-btn.png" alt="" />
  <img class="bg-frame" src="../assets/images/index/bg-frame.png" alt="" />
  <img class="bg" src="../assets/images/index/bg.png" alt="" />
  <img class="bg-character" src="../assets/images/index/bg-character.png" alt="" />
  <img class="scroll-btn scroll-down" src="../assets/images/index/scroll-btn.png" alt="" />
</template>

<script setup>
const props = defineProps(["tabList", "onTabClick", "isActiveTab"]);
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

  img {
    width: 30rem;
  }
}
</style>
