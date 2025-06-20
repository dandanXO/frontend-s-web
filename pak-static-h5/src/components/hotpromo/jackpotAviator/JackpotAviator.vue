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
      <!-- <q-tab name="DAILY" :label="$t('hotPromo.jackpotAviator.daily')"></q-tab> -->
      <!-- <q-tab name="WEEKLY" :label="$t('hotPromo.jackpotAviator.weekly')"></q-tab> -->
    </q-tabs>

    <div class="jackpot">
      <JackpotTicker :timeframe="timeframe" />

      <div class="rules-ribbon" @click="mode = 'RULES'">{{ $t("hotPromo.jackpotAviator.rules") }}</div>
      <div class="history-ribbon" @click="isShowHistoryPopup = true">{{ $t("hotPromo.jackpotAviator.history") }}</div>

      <div class="receive-btn" @click="onClickReceive">
        {{ $t("hotPromo.jackpotAviator.receive") }}
      </div>
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
      <q-btn
        style="position: absolute; right: 10px; top: 10px; z-index: 99"
        unelevated
        dense
        rounded
        icon="close"
        class="bg-greytext text-white popout-close"
        v-close-popup
      />
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
  background: url("../../../assets/images/promotion/hotpromo/jackpot-aviator/jackpot-bg.gif") no-repeat 0% 25%;
  // aspect-ratio: 1125/500;
  background-size: cover;
  
  min-height: 420px;
  position: relative;
  margin-top: -30px;

  .rules-ribbon {
    // background-color: #30af88;
    // background: linear-gradient(180deg, #fb4f77 0%, #da093a 100%);
    
    // background: linear-gradient(180deg, #9c3624, #3f1203);
    background: linear-gradient(to bottom, #fcd34d 0%, #f59e0b 50%, #d97706 100%);
    color: #4b1d06;
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
    // background-color: #30af88;
    // background: linear-gradient(180deg, #fb4f77 0%, #da093a 100%);
    // background: linear-gradient(180deg, #9c3624, #3f1203);
    background: linear-gradient(to bottom, #fcd34d 0%, #f59e0b 50%, #d97706 100%);
    color: #4b1d06;
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

// .receive-btn {
//   background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/receive-btn.png') center center no-repeat;
//   background-size: 100% 100%;
//   width: 90px;
//   height: 24px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: 0 auto;
//   text-transform: uppercase;
//   color: #582B00;
//   font-family: Poppins;
//   font-weight: 900;
//   font-size: 14.88px;
//   line-height: 20.27px;
//   letter-spacing: 0px;
//   text-align: center;
//   text-transform: uppercase;
//   position: absolute;
//   left: 50%;
//   top: 82%;
//   transform: translate(-50%, -50%);

// }
.receive-btn {
  background: linear-gradient(to bottom, #fcd34d 0%, #f59e0b 50%, #d97706 100%);
  border: 2px solid #b45309;
  border-radius: 30px;
  color: #4b1d06;
  font-weight: bold;
  font-size: 16px;
  padding: 5px 30px;
  text-align: center;
  text-shadow: 0px 0px 2px #4b1d06;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  text-transform: uppercase;
  font-weight: bold;
}

.history-container {
  background-color: #323738;
  border: 1px solid #ff3838;
  border-radius: 15px;
  width: 90%;
  position: relative;

  .congrats-highlight {
    color: #fff96f;
    font-size: 16px;
    text-align: center;
    // background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
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
      text-shadow: 0.97px 0.97px black;
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
</style>
