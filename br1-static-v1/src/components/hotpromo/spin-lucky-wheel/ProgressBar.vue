<template>
    <div class="extraction-progress-bar" v-if="extractionDifference > 0 && info.status === 'IN_PROGRESS'">
        <div class="progress" :style="{ width: progressBarIndicatePosition }"></div>
        <img class="indicate" :style="{ left: progressBarIndicatePosition }"
            src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/coin.png" />
    </div>

    <div class="extraction-remaining-progress" v-if="props?.isShowDetails">
        <span class="extraction-require-amount">Faltam apenas <span class="amount">{{ `${store.currency.value} ${extractionDifference}` }}</span></span>
        <span class="extraction-require-percentage">{{ `${remainingRequired.toFixed(2)}%` }}</span>
    </div>
</template>
<script setup>
import { computed, inject } from "vue";
import { userStore } from "stores/index";

const store = userStore();
const props = defineProps(['isShowDetails']);
const info = inject('info');
const extractionDifference = inject('extractionDifference');
const remainingRequired = computed(() => info.value.currAmount / info.value.targetWithdrawAmount * 100);

const progressBarIndicatePosition = computed(() => {
    return `calc(${remainingRequired.value}%)`;
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
    width: 95%;
    margin: 0 auto;
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
  margin: 5px auto;
}

@media screen and (max-width: 400px) {
    .extraction-progress-bar {
        width: 90%;
    }
    .extraction-remaining-progress {
        width: 95%;
    }
}
</style>