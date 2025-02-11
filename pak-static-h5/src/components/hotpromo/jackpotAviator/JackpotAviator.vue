<template>
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
    <template v-if="mode === 'MAIN'">
        <div class="jackpot">
            <div class="jackpot-plate">
                <svg class="jackpot-number" data-v-40789f9c="" xmlns="http://www.w3.org/2000/svg" width="150" height="35" viewBox="0 0 150 35">
                <text data-v-40789f9c="" x="10" y="20">298,360,000</text>
            </svg>
            </div>
                
            <div class="rules-ribbon" @click="mode = 'RULES'">{{ $t('hotPromo.jackpotAviator.rules') }}</div>
            <div class="history-ribbon" @click="isShowHistoryPopup = true">{{ $t('hotPromo.jackpotAviator.history') }}</div>
        </div>

        <div class="receive-btn">
            {{ $t('hotPromo.jackpotAviator.receive') }}
        </div>

        <div class="podium" v-if="rankingList?.length > 0">
            <div class="confetti">
                <div class="confetti-piece" v-for="n in confettiCount" :key="n"></div>
            </div>

            <div class="podium-silver">
                <div class="left-wing" />
                <div class="id-and-prize">
                    <div class="id">{{ rankingList[1].loginName }}</div>
                    <div class="prize">{{ rankingList[1].amount }}</div>
                </div>
                <div class="right-wing" />
            </div>

            <div class="podium-gold">
                <div class="left-wing" />
                <div class="id-and-prize">
                    <div class="id">{{ rankingList[0].loginName }}</div>
                    <div class="prize">{{ rankingList[0].amount }}</div>
                </div>
                <div class="right-wing" />
            </div>

            <div class="podium-bronze">
                <div class="left-wing" />
                <div class="id-and-prize">
                    <div class="id">{{ rankingList[2].loginName }}</div>
                    <div class="prize">{{ rankingList[2].amount }}</div>
                </div>
                <div class="right-wing" />
            </div>
        </div>

        <div class="ranking">
            <div class="item">
                <div>{{ $t('hotPromo.jackpotAviator.ranking') }}</div>
                <div>{{ $t('hotPromo.jackpotAviator.username') }}</div>
                <div>{{ $t('hotPromo.jackpotAviator.betVolume') }}</div>
            </div>

            <div class="item" v-for="rankingListItem, rankingListItemIndex in rankingList" :key="rankingListItemIndex">
                <div>{{ rankingListItemIndex + 1 }}</div>
                <div>{{ rankingListItem.loginName }}</div>
                <div class="betVolume">{{ rankingListItem.amount?.toFixed(2) }}</div>
            </div>
        </div>

        <RankDetails :rankDetails="rankDetails" />
    </template>
    <template v-else-if="mode === 'RULES'">
        <JackpotAviatorRules :onClickBackBtn="() => mode = 'MAIN'" :rankingBonusRatioList="rankingBonusRatioList"/>
    </template>

    <q-dialog width="100%" v-model="isShowHistoryPopup">
        <div class="history-container">
            <div class="congrats-highlight">
                <div class="congrats-title">History</div>
                <!-- <div class="congrats-prize">80888PRK</div> -->
            </div>

            <div class="ranking">
                <div class="item">
                    <div>{{ $t('hotPromo.jackpotAviator.ranking') }}</div>
                    <div>{{ $t('hotPromo.jackpotAviator.username') }}</div>
                    <div>{{ $t('hotPromo.jackpotAviator.betVolume') }}</div>
                </div>

                <div class="item" v-for="historyListItem, historyListItemIndex in history" :key="historyListItemIndex">
                    <div>{{ historyListItemIndex + 1 }}</div>
                    <div>{{ historyListItem.loginName }}</div>
                    <div class="betVolume">{{ historyListItem.amount?.toFixed(2) }}</div>
                </div>
            </div>
            <!-- <RankingBonusRatioTable :rankingBonusRatioList="rankingBonusRatioList" /> -->
        </div>
    </q-dialog>

</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import JackpotAviatorRules from './JackpotAviatorRules.vue';
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import RankingBonusRatioTable from './RankingBonusRatioTable.vue';
import RankDetails from './RankDetails.vue';

const store = userStore();
const confettiCount = 20;
const mode = ref('MAIN');
const isShowHistoryPopup = ref(false);
const timeframe = ref('DAILY');
const rankingList = ref([]);
const history = ref([]);

const rankingBonusRatioList = ref([]);
const isNotInApp = window.location.pathname === '/promo';
const rankDetails = ref({});

const getHistory = () => {
    const endpoint = timeframe.value === 'DAILY' ? '/session/game-jackpot-bonus/top-ranking-history?promoCode=pak-aviator-jackpot-daily-challenge' : '/session/game-jackpot-bonus/top-ranking-history?promoCode=pak-aviator-jackpot-weekly-challenge';

    eventapi.post(endpoint).then((res) => {
        if (res.code == 0) {
            history.value = res?.data;
        }
    });
};

const getRankingDetails = () => {
    const endpoint = timeframe.value === 'DAILY' ? '/session/game-jackpot-bonus/top-ranking-realtime?promoCode=pak-aviator-jackpot-daily-challenge' : '/session/game-jackpot-bonus/top-ranking-realtime?promoCode=pak-aviator-jackpot-weekly-challenge';

    eventapi.post(endpoint).then((res) => {
        if (res.code == 0) {
            rankingList.value = res?.data?.rankingList;
            rankDetails.value = res?.data?.rankDetails;
        }
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
                letter-spacing: -1px;
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
        top: 177px;
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

        &:hover {
            filter: brightness(1.1);
        } 
    }
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

.podium {
    background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/podium.png') no-repeat center center;
    aspect-ratio: 1020/416;
    background-size: 100% 100%;
    position: relative;
    font-family: 'Poppins';
    letter-spacing: -1px;

    .podium-silver {
        background-size: 100% 100%;
        position: absolute;
        top: 85%;
        left: 19.5%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/silver-left-wing.png') no-repeat center center;
            aspect-ratio: 66/93;
            background-size: 100% 100%;
            min-height: 30px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/silver-right-wing.png') no-repeat center center;
            aspect-ratio: 66/93;
            background-size: 100% 100%;
            min-height: 30px;
        }
    }

    .podium-gold {
        background-size: 100% 100%;
        position: absolute;
        top: 77%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0px;
        font-size: 13px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/gold-left-wing.png') no-repeat center center;
            aspect-ratio: 90/141;
            background-size: 100% 100%;
            min-height: 40px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/gold-right-wing.png') no-repeat center center;
            aspect-ratio: 90/141;
            background-size: 100% 100%;
            min-height: 40px;
        }
    }

    .podium-bronze {
        background-size: 100% 100%;
        position: absolute;
        top: 85%;
        left: 80%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/bronze-left-wing.png') no-repeat center center;
            aspect-ratio: 63/90;
            background-size: 100% 100%;
            min-height: 30px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/bronze-right-wing.png') no-repeat center center;
            aspect-ratio: 63/90;
            background-size: 100% 100%;
            min-height: 30px;
        }
    }
}

.ranking {
    display: flex;
    flex-direction: column;
    margin: 0 10px;
    border-radius: 5px;
    overflow: hidden;
    padding-bottom: 0px;

    .item {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 40px;

        &:first-child {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 40px;
            text-align: center;

        }

        &:not(:first-child) {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 40px;
            text-align: center;
            color: #FFFFFF80;
        }

        &:nth-child(odd) {
            background-color: #032503;
        }

        &:nth-child(even) {
            background-color: #113810;
        }
    }
}

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


$yellow: #ffd300;
$blue: #17d3ff;
$pink: #ff4e91;

$duration: 3000;

@function randomNum($min, $max) {
  $rand: random();
  $randomNum: $min + floor($rand * (($max - $min) + 1));

  @return $randomNum;
}


.confetti {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 6px;
  height: 12px;
  background: $yellow;
  top: 0;
  opacity: 0;
  
  @for $i from 1 through 13 {
    &:nth-child(#{$i}) {
      left: $i * 7%;
      transform: rotate(#{randomNum(-80, 80)}deg);
      animation: makeItRain $duration * 1ms infinite ease-out;
      animation-delay: #{randomNum(0, $duration * .5)}ms;
      animation-duration: #{randomNum($duration * .7, $duration * 1.2)}ms
    }
  }
  
  &:nth-child(odd) {
    background: $blue;
  }
  
  &:nth-child(even) {
    z-index: 1;
  }
  
  &:nth-child(4n) {
    width: 5px;
    height: 12px;
    animation-duration: $duration * 2ms;
  }
  
  &:nth-child(3n) {
    width: 3px;
    height: 10px;
    animation-duration: $duration * 2.5ms;
    animation-delay: $duration * 1ms;
  }
  
  &:nth-child(4n-7) {
    background: $pink;
  }
}

@keyframes makeItRain {
  from {
    opacity: 0;
  }
  
  50% {
    opacity: 1;
  }
  
  to {
    transform: translateY(200px);
  }
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