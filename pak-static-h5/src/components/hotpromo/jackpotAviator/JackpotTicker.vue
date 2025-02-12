<template>
    <div class="jackpot-plate">
        <svg v-if="jackpotAmt > 0" class="jackpot-number" data-v-40789f9c="" xmlns="http://www.w3.org/2000/svg" width="150" height="35" viewBox="0 0 150 35">
            <text data-v-40789f9c="" x="20" y="20">{{ convertToCommaAmount(jackpotAmt) }}</text>
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
    const endpoint = props?.timeframe === 'DAILY' ? '/session/game-jackpot-bonus/jackpot?promoCode=pak-aviator-jackpot-daily-challenge' : '/session/game-jackpot-bonus/jackpot?promoCode=pak-aviator-jackpot-weekly-challenge';

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
    }, 5000);
})

onMounted(() => {
    updateJackpot();

    jackpotFetchInterval.value = setInterval(() => {
        updateJackpot();
    }, 5000);
})
</script>
<style lang="scss" scoped>
.jackpot-plate {
    background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/jackpot-plate.png') no-repeat center center;
    aspect-ratio: 381/66;
    background-size: 100% 100%;
    width: 38%;
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins';

    .jackpot-number {
        transform: rotateX(45deg);

        text {
            fill: #FFF9FF;
            stroke: #1E826A;
            stroke-width: 1;
            margin: 0;
            font-family: 'Poppins';
            font-size: 22px;
            font-weight: bold;
            letter-spacing: -1px;
        }
    }
}
</style>