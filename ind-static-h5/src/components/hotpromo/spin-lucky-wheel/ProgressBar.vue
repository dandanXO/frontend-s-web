<template>
    <div class="extraction-progress-bar" v-if="extractionDifference > 0 && info.status === 'IN_PROGRESS'">
        <div class="progress" :style="{ width: progressBarIndicatePosition }"></div>
        <img class="indicate" :style="{ left: progressBarIndicatePosition }"
            src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/coin.png" />
    </div>

    <div class="extraction-remaining-progress">
        <span class="extraction-require-amount">Only <span class="amount">${{ extractionDifference }}</span> to go</span>
        <span class="extraction-require-percentage">{{ progressBarIndicatePosition }}</span>
    </div>
</template>
<script setup>
import { computed, inject } from "vue";

const info = inject('info');
const extractionDifference = inject('extractionDifference');

const progressBarIndicatePosition = computed(() => {
    if (extractionDifference.value < 5) {
        return `96%`;
    } else {
        return `calc(100% - ${extractionDifference.value}%)`;
    }
});
</script>
<style lang="scss" scoped>
.extraction-require-amount,
.extraction-require-percentage {
    color: #fff;
    font-family: 'Poppins';
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0px;
    text-align: left;

    .amount {
        font-weight: 500;
        color: #FEBA02;
    }
}

.extraction-progress-bar {
    position: relative;
    width: 100%;
    height: 12px;
    background-color: #cc9f8c;
    border-radius: 100px;

    .progress {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(356.25deg, #3b156e -0.21%, #8100ae 93.65%);
        background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/progress-bar-bg.png) no-repeat;
        background-size: 100% 100%;
        border-radius: 4px;
    }

    .indicate {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 28px !important;
    }
}

.extraction-remaining-progress {
  display: flex;
  justify-content: space-between;
  font-family: 'Poppins';
  width: 100%;
  margin: 5px 0;
}
</style>