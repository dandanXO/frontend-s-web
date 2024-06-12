<template>
    <div class="jackpot">
      <div class="jackpot-txt">
        <q-spinner-pie  v-if="isLoading" color="purple" size="20"/>
        <span v-else>{{ (new Intl.NumberFormat('en-US')).format(jackpotPrizeAmt) || '' }}</span>
      </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { api } from 'boot/axios';

const jackpotPrizeAmt = ref();
const isLoading = ref(false);
const refetchJackpotInterval = ref();
const jackpotTickerInterval = ref();

const fetchJackpot = (isInit) => {
  if(isInit) {
    isLoading.value = true;
  }

  api.get("/member/jackpot-amount").then((res) => {
      const response = res.data
      jackpotPrizeAmt.value = Math.round(response.data);
      isLoading.value = false;
  })
  .catch((e) => {
      console.log(e);
      isLoading.value = false;
  }).finally(() => {
    isLoading.value = false;
  });
}

onMounted(() => {
  fetchJackpot(true);

  jackpotTickerInterval.value = setInterval(() => {
    jackpotPrizeAmt.value++;
  }, 100);

  refetchJackpotInterval.value = setInterval(() => {
    fetchJackpot();
  }, 10000)
})

onUnmounted(() => {
  clearInterval(jackpotTickerInterval.value);

  clearInterval(refetchJackpotInterval);
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

    background-clip: text;
    background-image: linear-gradient(to right, #d62727, #d62727);
    color: #EBD5A9;
    letter-spacing: calc(3em / 8);
    padding: calc(calc(3em / 16) / 2);
    -webkit-text-stroke-color: transparent;
    -webkit-text-stroke-width: calc(3em / 16);

    @media (max-width: 768px) {
      font-size: 18px;
      letter-spacing: calc(2em / 8);
    }

    /**
    color: #f5c681;
    text-shadow: 2px 0 #ff3c3c, -2px 0 #ff3c3c, 0 2px #ff3c3c, 0 -2px #ff3c3c, 1px 1px #ff3c3c, -1px -1px #ff3c3c, 1px -1px #ff3c3c, -1px 1px #ff3c3c;
    letter-spacing: 3px;

    @media (max-width: 768px) {
      font-size: 18px;
      text-shadow: 1px 0 #ff3c3c, -1px 0 #ff3c3c, 0 1px #ff3c3c, 0 -1px #ff3c3c, 1px 1px #ff3c3c, -1px -1px #ff3c3c, 1px -1px #ff3c3c, -1px 1px #ff3c3c;
    }
    */
  }
}
</style>