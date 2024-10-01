<template>
  <div class="jackpot">
    <img class="jackpot-banner" src="../assets/images/index/jackpot/jackpot-animated.gif" />
    <div class="jackpot-number">{{ jackpotNum ?? 0 }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { api } from "boot/axios";

const jackpotNum = ref();
const timer = ref();

const updateJackpotNum = () => {
  api.get("/jackpotPrize/cq9").then(({ data }) => {
    jackpotNum.value = data;
  });
};

onMounted(() => {
  const interval = 30000;

  if (timer.value) {
    clearInterval(timer.value);
  }

  updateJackpotNum();

  if (!timer.value) {
    timer.value = setInterval(() => {
      updateJackpotNum();
    }, interval);
  }
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped lang="scss">
.jackpot {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .jackpot-banner {
    width: 100%;
  }

  .jackpot-number {
    color: #fff;
    position: absolute;
    margin-top: 17px;
    font-size: 22px;
    letter-spacing: 5px;
    font-family: Arial Black;
    text-shadow: 3px 3px #4d4d4d;
  }
}
</style>
