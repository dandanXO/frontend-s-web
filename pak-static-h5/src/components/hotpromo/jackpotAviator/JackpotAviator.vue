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
      <JackpotTicker :timeframe="timeframe" />

      <div class="rules-ribbon" @click="mode = 'RULES'">{{ $t("hotPromo.jackpotAviator.rules") }}</div>
      <div class="history-ribbon" @click="isShowHistoryPopup = true">{{ $t("hotPromo.jackpotAviator.history") }}</div>
    </div>

    <div class="receive-btn" @click="onClickReceive">
      {{ $t("hotPromo.jackpotAviator.receive") }}
    </div>

    <template v-if="isLoadingRanking">
      <img
        style="width: 100px; margin: 100px auto"
        src="../../../assets/images/promotion/hotpromo/jackpot-aviator/podium-loader.gif"
      />
    </template>
    <template v-else>
      <RankPodium :rankingList="rankingList" />
      <HistoryTable :historyList="rankingList" />
    </template>

    <RankDetails :rankDetails="rankDetails" :isLoadingRanking="isLoadingRanking" />
  </template>
  <template v-else-if="mode === 'RULES'">
    <JackpotAviatorRules :onClickBackBtn="() => (mode = 'MAIN')" :rankingBonusRatioList="rankingBonusRatioList" />
  </template>

  <q-dialog width="100%" v-model="isShowHistoryPopup">
    <div class="history-container">
      <div class="congrats-highlight">
        <div class="congrats-title">{{ $t("hotPromo.jackpotAviator.jackpot") }}</div>
        <div class="congrats-prize">{{ store.currency.value }} {{ historyData.jackpotAmount }}</div>
      </div>

      <HistoryTable :historyList="historyData.rankingList" />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="isShowClaimPrizePopup">
    <ClaimPrizePopup :claimPrizeAmt="claimPrizeAmt" :onClickClose="() => (isShowClaimPrizePopup = false)" />
  </q-dialog>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import JackpotAviatorRules from "./JackpotAviatorRules.vue";
import { eventapi } from "boot/axios";
import RankDetails from "./RankDetails.vue";
import RankPodium from "./RankPodium.vue";
import HistoryTable from "./HistoryTable.vue";
import ClaimPrizePopup from "./ClaimPrizePopup.vue";
import JackpotTicker from "./JackpotTicker.vue";
import { userStore } from "stores/index";

const store = userStore();
const mode = ref("MAIN");
const timeframe = ref("DAILY");
const isShowHistoryPopup = ref(false);
const isShowClaimPrizePopup = ref(false);
const claimPrizeAmt = ref(0);
const rankingList = ref([]);
const historyData = ref({});
const rankingBonusRatioList = ref([]);
const rankDetails = ref({});
const isLoadingRanking = ref(false);

const onClickReceive = () => {
  const endpoint =
    timeframe.value === "DAILY"
      ? "/session/game-jackpot-bonus/claim?promoCode=pak-aviator-jackpot-daily-challenge"
      : "/session/game-jackpot-bonus/claim?promoCode=pak-aviator-jackpot-weekly-challenge";

  eventapi.post(endpoint).then((res) => {
    if (res.code == 0) {
      claimPrizeAmt.value = res?.data;
      isShowClaimPrizePopup.value = true;
    }
  });
};

const getHistory = () => {
  const endpoint =
    timeframe.value === "DAILY"
      ? "/session/game-jackpot-bonus/top-ranking-history?promoCode=pak-aviator-jackpot-daily-challenge"
      : "/session/game-jackpot-bonus/top-ranking-history?promoCode=pak-aviator-jackpot-weekly-challenge";

  eventapi.post(endpoint).then((res) => {
    if (res.code == 0) {
      historyData.value = res?.data;
    }
  });
};

const getRankingDetails = () => {
  isLoadingRanking.value = true;

  const endpoint =
    timeframe.value === "DAILY"
      ? "/session/game-jackpot-bonus/top-ranking-realtime?promoCode=pak-aviator-jackpot-daily-challenge"
      : "/session/game-jackpot-bonus/top-ranking-realtime?promoCode=pak-aviator-jackpot-weekly-challenge";

  eventapi
    .post(endpoint)
    .then((res) => {
      if (res.code == 0) {
        rankingList.value = res?.data?.rankingList;
        rankDetails.value = res?.data?.rankDetails;
      }

      isLoadingRanking.value = false;
    })
    .catch(() => {
      isLoadingRanking.value = false;
    })
    .finally(() => {
      isLoadingRanking.value = false;
    });
};

const initData = () => {
  const endpoint =
    timeframe.value === "DAILY"
      ? "/session/game-jackpot-bonus/init?promoCode=pak-aviator-jackpot-daily-challenge"
      : "/session/game-jackpot-bonus/init?promoCode=pak-aviator-jackpot-weekly-challenge";

  eventapi.get(endpoint).then((res) => {
    if (res.code == 0) {
      rankingBonusRatioList.value = res?.data?.bonusRatioList;
    }
  });
};

watch(
  () => timeframe.value,
  () => {
    initData();
    getHistory();
    getRankingDetails();
  }
);

onMounted(() => {
  initData();
  getHistory();
  getRankingDetails();
});
</script>
<style lang="scss" scoped>
.jackpot {
  background: url("../../../assets/images/promotion/hotpromo/jackpot-aviator/jackpot-bg.png") no-repeat center center;
  aspect-ratio: 1125/500;
  background-size: 100% 100%;
  position: relative;

  .rules-ribbon {
    background-color: #30af88;
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
    background-color: #30af88;
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

  .rules-ribbon,
  .history-ribbon {
    z-index: 1;
    cursor: pointer;
    font-family: "Poppins";
    transition: width 0.2s ease;
    box-shadow: 2px 2px 10px #252d2b;

    &:hover {
      width: 85px;
      background-position: 5px center;
    }
  }
}

@-webkit-keyframes slide {
  100% {
    left: 0;
  }
}

@keyframes slide {
  100% {
    left: 0;
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

    .podium-silver {
        background-size: 100% 100%;
        position: absolute;
        top: 80%;
        left: 19.5%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 5px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/silver-left-wing.png') no-repeat center center;
            aspect-ratio: 66/93;
            background-size: 100% 100%;
            min-height: 35px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/silver-right-wing.png') no-repeat center center;
            aspect-ratio: 66/93;
            background-size: 100% 100%;
            min-height: 35px;
        }
    }

    .podium-gold {
        background-size: 100% 100%;
        position: absolute;
        top: 72%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 5px;
        font-size: 15px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/gold-left-wing.png') no-repeat center center;
            aspect-ratio: 90/141;
            background-size: 100% 100%;
            min-height: 45px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/gold-right-wing.png') no-repeat center center;
            aspect-ratio: 90/141;
            background-size: 100% 100%;
            min-height: 45px;
        }
    }

    .podium-bronze {
        background-size: 100% 100%;
        position: absolute;
        top: 80%;
        left: 80%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 5px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/bronze-left-wing.png') no-repeat center center;
            aspect-ratio: 63/90;
            background-size: 100% 100%;
            min-height: 35px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/bronze-right-wing.png') no-repeat center center;
            aspect-ratio: 63/90;
            background-size: 100% 100%;
            min-height: 35px;
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
            line-height: 21px;
            text-align: center;

        }

        &:not(:first-child) {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 21px;
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
    bottom: 95px;
    width: 100%;
    max-width: 500px;
    font-family: 'Poppins';

    &.isApp {
        bottom: 0px;
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
  height: 200px;
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
  border: 1px solid #55c253;
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
      color: #fffdc9;
    }

    .congrats-prize {
      font-family: Poppins;
      font-size: 21.03px;
      font-weight: 900;
      line-height: 31.54px;
      text-align: center;
      color: #fff96f;
    }
  }
}

.timeframe-tabs {
  margin-top: 0;

  :deep(.q-tab--active .q-tab__label) {
    color: #fff900;
  }
  :deep(.q-tab--active .q-tab__indicator) {
    background: #fff900;
  }
}

@media (max-width: 350px) {
  .receive-btn {
    padding: 10px;
    width: 150px;
    height: 30px;
  }
}
</style>
