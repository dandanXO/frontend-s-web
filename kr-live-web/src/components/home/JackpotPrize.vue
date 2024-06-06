<template>
    <div class="jackpot">
      <div class="jackpot-txt">{{ jackpotPrizeAmt }}</div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';

const jackpotPrizeAmt = ref();

const initData = () => {
    api.get("/member/jackpot-amount")
        .then((res) => {
            const response = res.data
            jackpotPrizeAmt.value = response.data;
        })
        .catch((e) => {
            console.log(e);
        });
}

onMounted(() => {
    initData();
})
</script>

<style lang="scss" scoped>
.jackpot {
  display: flex;
  margin: 0 auto;
  width: calc(100% - 40px);
  max-width: 816px;
  background: url('../../assets/home/jackpot.png') no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  aspect-ratio: 816 / 130;

  @media (max-width: 768px) {
    background: url('../../assets/home/jackpot-mobile.png') no-repeat center center;
    background-size: 100% 100%;
    aspect-ratio: 288 / 68;
    max-width: 288px;
    margin: 0px auto 10px;
  }

  .jackpot-txt {
    display: flex;
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 34px;
    font-weight: bold;
    font-family: monospace;
    color: #f5c681;
    // text-shadow: 0 0 5px #ff0000;
    text-shadow: 2px 0 #ff3c3c, -2px 0 #ff3c3c, 0 2px #ff3c3c, 0 -2px #ff3c3c,
               1px 1px #ff3c3c, -1px -1px #ff3c3c, 1px -1px #ff3c3c, -1px 1px #ff3c3c;
    letter-spacing: 3px;

    @media (max-width: 768px) {
      font-size: 18px;
      text-shadow: 1px 0 #ff3c3c, -1px 0 #ff3c3c, 0 1px #ff3c3c, 0 -1px #ff3c3c, 1px 1px #ff3c3c, -1px -1px #ff3c3c, 1px -1px #ff3c3c, -1px 1px #ff3c3c;
    }
  }
}
</style>