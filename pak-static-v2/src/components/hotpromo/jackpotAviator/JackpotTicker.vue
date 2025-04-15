<template>
    <div class="jackpot-plate">
        <svg 
  v-if="jackpotAmt > 0" 
  class="jackpot-number" 
  xmlns="http://www.w3.org/2000/svg" 
  width="150" 
  height="35" 
  viewBox="0 0 150 35"
>
  <!-- Define Gradient -->
  <defs>
    <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="13.04%" stop-color="#FDF9EB"/>
      <stop offset="78.93%" stop-color="#CB8F24"/>
    </linearGradient>
  </defs>

  <!-- Text with Gradient Fill -->
  <text 
    x="50%" 
    y="60%" 
    dominant-baseline="middle" 
    text-anchor="middle" 
    font-size="16" 
    font-weight="bold" 
    fill="url(#textGradient)" 
    stroke="black" 
    stroke-width="1"
  >
    {{ convertToCommaAmount(jackpotAmt) }}
  </text>
</svg>
        <span v-else>-</span>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { eventapi } from "boot/axios";
import { convertToCommaAmount } from "src/boot/utils";

const jackpotAmt = ref(0);
const jackpotAmtCap = ref();
const jackpotAmtInterval = ref();
const jackpotFetchInterval = ref();
const props = defineProps(['timeframe']);

const updateJackpot = () => {
    const endpoint = props?.timeframe === 'DAILY' ? '/session/game-jackpot-bonus/jackpot?promoCode=pk2-aviator-jackpot-daily-challenge' : '/session/game-jackpot-bonus/jackpot?promoCode=pak-aviator-jackpot-weekly-challenge';

    clearInterval(jackpotAmtInterval.value);

    eventapi.get(endpoint).then((res) => {
        if (res.code == 0) {
            jackpotAmt.value = res?.data?.min;
            jackpotAmtCap.value = res?.data?.max;

            jackpotAmtInterval.value = setInterval(() => {
                if(jackpotAmtCap.value > 0 && jackpotAmt.value <= jackpotAmtCap.value) {
                    jackpotAmt.value += 1;
                }
            },500);
        }
    });
}

onUnmounted(() => {
    clearInterval(jackpotAmtInterval.value);
    clearInterval(jackpotFetchInterval.value);
})

watch(() => props?.timeframe, () => {
    clearInterval(jackpotFetchInterval.value);
    
    updateJackpot();
    
    jackpotFetchInterval.value = setInterval(() => {
        updateJackpot();
    }, 30000);
})

onMounted(() => {
    updateJackpot();

    jackpotFetchInterval.value = setInterval(() => {
        updateJackpot();
    }, 30000);
})
</script>
<style lang="scss" scoped>
.jackpot-plate {
    background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/jackpot-plate.png') no-repeat center center;
    background-size: contain;
    width: 100%;
    height: 80px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Poppins";

    .jackpot-number {
        transform: rotateX(45deg);
        margin-top: -5px;

        text {
            font-family: Poppins;
            font-weight: 900;
            font-size: 23.52px;
            line-height: 19.86px;
            letter-spacing: 0px;
            text-align: center;
            text-transform: uppercase;

        }
    }
}
</style>