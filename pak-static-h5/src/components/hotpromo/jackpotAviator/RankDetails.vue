<template>
    <div class="bottom" :class="{ isNotInApp: isNotInApp }">
        <div>{{ props?.rankDetails?.rank > -1 ? props?.rankDetails?.rank : 'No Rank' }}</div>
        <div class="column">
            <div class="label">My Bets <span class="value">{{ props?.rankDetails?.currentBet }}</span></div>
            <div class="label">{{ `My Reward ${props?.rankDetails?.rewardPerc}%` }}</div>
        </div>
        <div class="column">
            <div class="label">Ranks Left</div>
            <div>{{ store.currency.value }} {{ props?.rankDetails?.betAmtNeeded }}</div>
        </div>
    </div>
</template>
<script setup>
import { userStore } from "stores/index";

const store = userStore();

const isNotInApp = window.location.pathname === '/promo';
const props = defineProps(['rankDetails']);

</script>
<style lang="scss" scoped>
.bottom {
    background: linear-gradient(180deg, #0D5819 0%, #082A23 100%);
    border: 1px solid #258838;
    color: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    height: 77px;
    align-items: center;
    padding: 20px;
    position: fixed;
    bottom: 0px;
    width: 100%;
    font-family: 'Poppins';

    &.isNotInApp {
        bottom: 95px;
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .label {
        color: #7EC24A;
    }

    .value {
        color: #F1FF55;
    }
}
</style>