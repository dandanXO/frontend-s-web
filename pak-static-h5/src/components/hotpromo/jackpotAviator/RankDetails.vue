<template>
    <div class="bottom" :class="{ isNotInApp: isNotInApp, isLoading: isLoadingRanking }">
        <q-spinner style="margin:auto;" color="yellow" size="3em" :thickness="5" v-if="isLoadingRanking"/>
        <template v-else>
            <div>{{ props?.rankDetails?.rank > -1 ? props?.rankDetails?.rank : $t('hotPromo.jackpotAviator.noRank') }}</div>
            <div class="column">
                <div class="label">{{ $t('hotPromo.jackpotAviator.myBets') }} <span class="value">{{ props?.rankDetails?.currentBet }}</span></div>
                <div class="label">{{ `${$t('hotPromo.jackpotAviator.myReward')} ${props?.rankDetails?.rewardPerc}%` }}</div>
            </div>
            <div class="column">
                <div class="label">{{ $t('hotPromo.jackpotAviator.ranksLeft') }}</div>
                <div>{{ store.currency.value }} {{ props?.rankDetails?.betAmtNeeded }}</div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { userStore } from "stores/index";

const store = userStore();

const isNotInApp = window.location.pathname === '/promo';
const props = defineProps(['rankDetails', 'isLoadingRanking']);

</script>
<style lang="scss" scoped>
.bottom {
    background: linear-gradient(180deg, #0D5819 0%, #082A23 100%);
    border: 1px solid #258838;
    color: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    padding: 10px;
    position: fixed;
    bottom: 0px;
    width: 100%;
    font-family: 'Poppins';
    min-height: 70px;
    font-size: 14px;
    letter-spacing: -1px;

    &.isLoading {
        grid-template-columns: 1fr;
    }

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

@media (max-width: 400px) {
  .bottom {
    padding: 5px;
    min-height: 50px;
    font-size: 14px;
    letter-spacing: -1px;
  }
}

@media (max-width: 350px) {
  .bottom {
    padding: 5px;
    min-height: 50px;
    font-size: 12px;
    letter-spacing: -1px;
  }
}
</style>