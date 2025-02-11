<template>
    <template v-if="mode === 'MAIN'">
        <q-tabs
            v-model="timeframe"
            class="timeframe-tabs q-mb-lg"
            color="yellow"
            no-caps
            narrow-indicator
            indicator-color="yellow"
            >
            <q-tab name="DAILY" :label="$t('hotPromo.jackpotAviator.daily')"></q-tab>
            <q-tab name="WEEKLY" :label="$t('hotPromo.jackpotAviator.weekly')"></q-tab>
        </q-tabs>
            
        <div class="jackpot">
            <div class="jackpot-plate">
                <svg class="jackpot-number" data-v-40789f9c="" xmlns="http://www.w3.org/2000/svg" width="150" height="35" viewBox="0 0 150 35">
                <text data-v-40789f9c="" x="7.5" y="20">{{ convertToCommaAmount(jackpotAmt) }}</text>
            </svg>
            </div>
                
            <div class="rules-ribbon" @click="mode = 'RULES'">{{ $t('hotPromo.jackpotAviator.rules') }}</div>
            <div class="history-ribbon" @click="isShowHistoryPopup = true">{{ $t('hotPromo.jackpotAviator.history') }}</div>
        </div>

        <div class="receive-btn" @click="onClickReceive">
            {{ $t('hotPromo.jackpotAviator.receive') }}
        </div>

        <template v-if="isLoadingRanking">
            <img style="width: 100px;margin: 100px auto;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/podium-loader.gif" />
        </template>
        <template v-else>
            <RankPodium :rankingList="rankingList" />
            <HistoryTable :historyList="rankingList" />
        </template>
        

        <RankDetails :rankDetails="rankDetails" :isLoadingRanking="isLoadingRanking" />
    </template>
    <template v-else-if="mode === 'RULES'">
        <JackpotAviatorRules :onClickBackBtn="() => mode = 'MAIN'" :rankingBonusRatioList="rankingBonusRatioList"/>
    </template>

    <q-dialog width="100%" v-model="isShowHistoryPopup">
        <div class="history-container">
            <div class="congrats-highlight">
                <div class="congrats-title">History</div>
                <div class="congrats-prize">{{ timeframe }}</div>
            </div>

            <HistoryTable :historyList="history" />
        </div>
    </q-dialog>

    <q-dialog width="100%" v-model="isShowClaimPrizePopup">
        <ClaimPrizePopup :claimPrizeAmt="claimPrizeAmt" :onClickClose="() => isShowClaimPrizePopup = false"/>
    </q-dialog>

</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import JackpotAviatorRules from './JackpotAviatorRules.vue';
import { eventapi } from "boot/axios";
import RankDetails from './RankDetails.vue';
import RankPodium from './RankPodium.vue';
import HistoryTable from './HistoryTable.vue';
import ClaimPrizePopup from './ClaimPrizePopup.vue';
import { convertToCommaAmount } from "src/boot/utils";

const mode = ref('MAIN');
const timeframe = ref('DAILY');
const isShowHistoryPopup = ref(false);
const isShowClaimPrizePopup = ref(false);
const claimPrizeAmt = ref(0);
const jackpotAmt = ref(298360000);
const rankingList = ref([]);
const history = ref([]);
const rankingBonusRatioList = ref([]);
const rankDetails = ref({});
const isLoadingRanking = ref(false);

const onClickReceive = () => {
    const endpoint = timeframe.value === 'DAILY' ? '/session/game-jackpot-bonus/claim??promoCode=pak-aviator-jackpot-daily-challenge' : '/session/game-jackpot-bonus/claim??promoCode=pak-aviator-jackpot-weekly-challenge';

    claimPrizeAmt.value = 1000;
    isShowClaimPrizePopup.value = true;

    eventapi.post(endpoint).then((res) => {
        if (res.code == 0) {
            claimPrizeAmt.value = res?.data;
            isShowClaimPrizePopup.value = true;
        }
    });
}

const getHistory = () => {
    const endpoint = timeframe.value === 'DAILY' ? '/session/game-jackpot-bonus/top-ranking-history?promoCode=pak-aviator-jackpot-daily-challenge' : '/session/game-jackpot-bonus/top-ranking-history?promoCode=pak-aviator-jackpot-weekly-challenge';

    eventapi.post(endpoint).then((res) => {
        if (res.code == 0) {
            history.value = res?.data;
        }
    });
};

const getRankingDetails = () => {
    isLoadingRanking.value = true;

    const endpoint = timeframe.value === 'DAILY' ? '/session/game-jackpot-bonus/top-ranking-realtime?promoCode=pak-aviator-jackpot-daily-challenge' : '/session/game-jackpot-bonus/top-ranking-realtime?promoCode=pak-aviator-jackpot-weekly-challenge';

    eventapi.post(endpoint).then((res) => {
        if (res.code == 0) {
            rankingList.value = res?.data?.rankingList;
            rankDetails.value = res?.data?.rankDetails;
        }

        isLoadingRanking.value = false;
    }).catch(() => {
        isLoadingRanking.value = false;
    }).finally(() => {
        isLoadingRanking.value = false;
    });
};

const initData = () => {
    const endpoint = timeframe.value === 'DAILY' ? '/session/game-jackpot-bonus/init?promoCode=pak-aviator-jackpot-daily-challenge' : '/session/game-jackpot-bonus/init?promoCode=pak-aviator-jackpot-weekly-challenge';

    eventapi.get(endpoint).then((res) => {
        if (res.code == 0) {
            rankingBonusRatioList.value = res?.data?.bonusRatioList;
        }
    });
};

watch(() => timeframe.value, () => {
    initData();
    getHistory();
    getRankingDetails();
})

onMounted(() => {
    initData();
    getHistory();
    getRankingDetails();
})
</script>
<style lang="scss" scoped>
.jackpot {
    background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/jackpot-bg.png') no-repeat center center;
    aspect-ratio: 1125/500;
    background-size: 100% 100%;
    position: relative;

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
                letter-spacing: -3px;
            }
        }
    }

    .rules-ribbon {
        background-color: #30AF88;
        position: absolute;
        width: 74px;
        height: 23px;
        top: 150px;
        left: -10px;
        padding-left: 10px;
        gap: 5px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .history-ribbon {
        background-color: #30AF88;
        position: absolute;
        width: 74px;
        height: 26px;
        top: 180px;
        left: -10px;
        padding-left: 10px;
        gap: 5px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .rules-ribbon, .history-ribbon {
        cursor: pointer;
        font-family: 'Poppins';
        transition: width .2s ease;
        box-shadow: 2px 2px 10px #252d2b;

        &:hover {
            width: 85px;
            background-position: 5px center;
        } 
    }
}

@-webkit-keyframes slide {
    100% { left: 0; }
}

@keyframes slide {
    100% { left: 0; }
}

.receive-btn {
    background: linear-gradient(180deg, #61FF00 0%, #006DED 100%);
    padding: 20px;
    border-radius: 17px;
    width: 236px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    font-family: Poppins;
    font-size: 16.9px;
    font-weight: 900;
    line-height: 19.16px;
    text-align: center;

}

.history-container {
    background-color: #113413;
    border: 1px solid #55C253;
    border-radius: 5px;
    width: 90%;

    .congrats-highlight {
        color: #fff96f;
        font-size: 16px;
        text-align: center;
        background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
        padding: 8px 12px;
        background-repeat: no-repeat;
        background-size: 70% 100%;
        background-position: center;
        margin-top: 16px;

        .congrats-title {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 500;
            line-height: 21px;
            text-align: center;
            color: #FFFDC9;
        }

        .congrats-prize {
            font-family: Poppins;
            font-size: 21.03px;
            font-weight: 900;
            line-height: 31.54px;
            text-align: center;
            color: #FFF96F;
        }
    }
}

.timeframe-tabs {
    margin-top: 0;

    :deep(.q-tab--active .q-tab__label) {
        color:#FFF900;
    }
    :deep(.q-tab--active .q-tab__indicator) {
        background:#FFF900;
    }
}
</style>