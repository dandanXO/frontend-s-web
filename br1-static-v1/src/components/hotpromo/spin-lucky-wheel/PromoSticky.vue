<template>
    <q-page-sticky position="bottom-right" :offset="csDragPos" class="floating-btn" v-if="remainingTime && isShowSticky">
        <div v-touch-pan.prevent.mouse="moveCsIcon" @click="router.push('promo?name=spin-lucky-wheel')" class="countdown-sticky">
            <span class="remaining-time"> {{ remainingTime }}</span>
            <img @click.stop="closeSticky" class="close-btn" src="../../../assets/images/index/close-btn.png" />
        </div>
    </q-page-sticky>
</template>
<script setup>
import { userStore } from "src/stores";
import { onActivated, onMounted, onUnmounted, ref, inject } from "vue";
import { eventapi } from "src/boot/axios";
import moment from 'moment-timezone';
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();
const timer = ref();
const remainingTime = ref("");
const isShowSticky = ref(false);
const nextFreeSpinRemainingTime = ref("");
const moveCsIcon = (ev) => {
    isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;
    csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
};

const store= userStore()

const closeSticky = () => {
  isShowSticky.value = false;
  sessionStorage.setItem("SPIN_LUCKY_WHEEL_STICKY", "1");
}

const csDragPos = ref([10, 90]);
const isDraggingCsIcon = ref(false);

const { spinWheelLuckyPromoInfo: info } = storeToRefs(store);

const getRemainingTime = (endTime) => {
    let result = "00:00:00";
    if (endTime) {
        const now = moment(Date.now()).tz("America/Sao_Paulo");
        const _endTime = moment(endTime).tz("America/Sao_Paulo");
        const totalSeconds = _endTime.diff(now, "seconds");
        if (totalSeconds > 0) {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            result = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`;
        }
    }
    return result;
};

const updateCountdownTime = () => {
    // console.log("updateCountdownTime")
    const endTime = moment(info.value.startTime).tz("America/Sao_Paulo").add(3, "days");
    const nextFreeSpinEndTime = moment().tz("America/Sao_Paulo").add(1, "days").startOf("day");
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = setInterval(() => {
        remainingTime.value = getRemainingTime(endTime);
        nextFreeSpinRemainingTime.value = getRemainingTime(nextFreeSpinEndTime);
    }, 1000);
}

onMounted(() => {
  const getShow = sessionStorage.getItem("SPIN_LUCKY_WHEEL_STICKY");
  if(!getShow && store.token){
    if(info.value.status === 'IN_PROGRESS') {
        isShowSticky.value = true;
    }

    updateCountdownTime();
  }
});

onActivated(() => {
    clearInterval(timer.value);

    const getShow = sessionStorage.getItem("SPIN_LUCKY_WHEEL_STICKY");
    if(!getShow && store.token){
        if(info.value.status === 'IN_PROGRESS') {
            isShowSticky.value = true;
        }

        updateCountdownTime();

    }
})

onUnmounted(() => {
    clearInterval(timer.value);
})
</script>
<style lang="scss">
.countdown-sticky {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    aspect-ratio: 192/172;
    background: url("../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/sticky.png") no-repeat center center;
    background-size: contain;
    position: relative;

    .close-btn {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        cursor: pointer;
    }
}

.remaining-time {
    font-size: 18px;
    line-height: 24px;
    letter-spacing: -1px;
    color: #FDFD7A;
    text-shadow: 1px 2px #B72C00;
    margin-top: -20px;
}
</style>
