<template>
  <div class="jackpot container">
    <div class="numbers">{{ jackpotNum ?? 0 }}</div>
  </div>
</template>
<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { getJackpot } from "@/api/index/common";

const jackpotNum = ref();
const timer = ref();

const updateJackpotNum = () => {
  getJackpot().then(({ data }) => {
    jackpotNum.value = data;
  });
};

onMounted(() => {
  // const interval = 12000;
  // updateJackpotNum();
  //
  // if (!timer.value) {
  //   timer.value = setInterval(() => {
  //     updateJackpotNum();
  //   }, interval);
  // }
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>
<style lang="scss" scoped>
.jackpot {
  opacity: 0;
  animation: fadeIn 1s ease-in-out forwards;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: url(../assets/images/games/jackpot-animated.gif) no-repeat left center;
  background-size: contain;

  width: 520px;
  height: 100%;
  overflow: hidden;
  .numbers {
    color: #ffe500;
    font-size: 30px;
    margin-left: 233px;

    text-shadow: 3px 3px #845f00;
  }
  img {
    width: 100%;
    // mix-blend-mode: plus-lighter;
  }
}

.dark-theme {
  .jackpot {
    // // mix-blend-mode: exclusion;
    // mix-blend-mode: lighten;
    // background-image: url(../../assets/images/games/jackpot.jpg);
    img {
      width: 100%;
      // mix-blend-mode: plus-lighter;
    }
  }
}
</style>
