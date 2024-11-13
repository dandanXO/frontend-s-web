<template>
  <div class="stats-header-container">
    <div class="stats-row">
      <img class="hamburger-bars-img" src="@/assets/images/home/hamburger-bars.png" @click="toggleExpansion">

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.myMoney') }}
        </div>
        <div class="stat-value green">{{ Math.floor(records.myMoney) }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.myPoint') }}
        </div>
        <div class="stat-value green">{{ Math.floor(records.myPoint) }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.memberMoney') }}
        </div>
        <div class="stat-value green">{{ Math.floor(records.memberMoney) }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.memberPoint') }}</div>
        <div class="stat-value green">{{ Math.floor(records.memberPoint) }}</div>
      </div>

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.myCommission') }}</div>
        <div class="stat-value green">{{ Math.floor(records.myCommission) }}</div>
      </div> -->

      <!-- <div class="stats">
        <div class="stat-label">보드머니</div>
        <div class="stat-value blue">0</div>
      </div> -->

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.memberInquiry') }}</div>
        <div class="stat-value grey">{{ records.memberInquiry }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.depositApplication') }}</div>
        <div class="stat-value grey">{{ records.depositApplication }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.withdrawApplication') }}</div>
        <div class="stat-value grey">{{ records.withdrawApplication }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.affiliateApplication') }}</div>
        <div class="stat-value grey">{{ records.affiliateApplication }}</div>
      </div> -->

      <!-- <div class="stats">
        <div class="stat-label">경고</div>
        <div class="stat-value grey">0</div>
      </div> -->

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.totalMembers') }}</div>
        <div class="stat-value grey">{{ records.totalMembers }}</div>
      </div>

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.currentMembers') }}</div>
        <div class="stat-value grey">{{ records.currentMembers }}</div>
      </div> -->
    </div>

    <div class="stats-row">
      <img class="hamburger-bars-img" src="@/assets/images/home/hamburger-bars.png" @click="toggleExpansion"
        style="visibility: hidden;">

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.todayDepositAmount') }}</div>
        <div class="stat-value grey">{{ Math.floor(records.todayDepositAmount) }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.todayWithdrawAmount') }}</div>
        <div class="stat-value grey">{{ Math.floor(records.todayWithdrawAmount) }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.refundProfitAndLoss') }}</div>
        <div class="stat-value grey">{{ Math.floor(records.todayDepositAmount - records.todayWithdrawAmount) }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.manualMoney') }}</div>
        <div class="stat-value blue">{{ Math.floor(records.manualMoney) }}</div>
      </div>

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.manualPoint') }}</div>
        <div class="stat-value blue">{{ records.manualPoint }}</div>
      </div> -->

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.totalProfitLoss') }}</div>
        <div class="stat-value grey">{{ (records.casinoProfit - records.casinoBetAmount - records.casinoRollingAmount)
          + (records.slotProfit - records.slotBetAmount - records.slotRollingAmount)
          + (records.sportProfit - records.sportBetAmount - records.sportRollingAmount)
          + (records.miniGameProfit - records.miniGameBetAmount - records.miniGameRollingAmount) }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.casinoBetAmount') }}</div>
        <div class="stat-value grey">{{ records.casinoBetAmount }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.casinoProfit') }}</div>
        <div class="stat-value grey">{{ records.casinoProfit }}</div>
      </div> -->

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.casinoRollingAmount') }}</div>
        <div class="stat-value grey">{{ Math.floor(records.casinoRollingAmount) }}</div>
      </div>

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.casinoProfitLoss') }}</div>
        <div class="stat-value grey">{{ records.casinoProfit - records.casinoBetAmount - records.casinoRollingAmount }}
        </div>
      </div> -->

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.slotBetAmount') }}</div>
        <div class="stat-value grey">{{ records.slotBetAmount }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.slotProfit') }}</div>
        <div class="stat-value grey">{{ records.slotProfit }}</div>
      </div> -->

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.slotRollingAmount') }}</div>
        <div class="stat-value grey">{{ Math.floor(records.slotRollingAmount) }}</div>
      </div>

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.slotProfitLoss') }}</div>
        <div class="stat-value grey">{{ records.slotProfit - records.slotBetAmount - records.slotRollingAmount }}</div>
      </div> -->

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.sportBetAmount') }}</div>
        <div class="stat-value grey">{{ records.sportBetAmount }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.sportProfit') }}</div>
        <div class="stat-value grey">{{ records.sportProfit }}</div>
      </div> -->

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.sportRollingAmount') }}</div>
        <div class="stat-value grey">{{ Math.floor(records.sportRollingAmount) }}</div>
      </div>

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.sportProfitLoss') }}</div>
        <div class="stat-value grey">{{ records.sportProfit - records.sportBetAmount - records.sportRollingAmount }}
        </div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.miniGameBetAmount') }}</div>
        <div class="stat-value grey">{{ records.miniGameBetAmount }}</div>
      </div>

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.miniGameProfit') }}</div>
        <div class="stat-value grey">{{ records.miniGameProfit }}</div>
      </div> -->

      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.miniGameRollingAmount') }}</div>
        <div class="stat-value grey">{{ Math.floor(records.miniGameRollingAmount) }}</div>
      </div>

      <!-- <div class="stats">
        <div class="stat-label">{{ t('statsHeader.miniGameProfitLoss') }}</div>
        <div class="stat-value grey">{{ records.miniGameProfit - records.miniGameBetAmount -
          records.miniGameRollingAmount
          }}</div>
      </div> -->
      <div class="stats">
        <div class="stat-label">{{ t('statsHeader.totalProfitLoss') }}</div>
        <div class="stat-value grey">{{ Math.floor((records.casinoBetAmount - records.casinoProfit - records.casinoRollingAmount)
          + (records.slotBetAmount - records.slotProfit - records.slotRollingAmount)
          + (records.sportBetAmount - records.sportProfit - records.sportRollingAmount)
          + (records.miniGameBetAmount - records.miniGameProfit - records.miniGameRollingAmount)) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import $ from 'jquery'
import { getKoreaStatsReport } from '@/api/statistics'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const toggleExpansion = () => {
  if ($(".navigation").width()) {
    $(".navigation").animate({ width: 0 })
  } else {
    $(".navigation").animate({ width: 200 })
  }
}

const records = ref({
  memberMoney: 0,
  memberPoint: 0,
  myPoint: 0,
  eggs: 0,
  memberInquiry: 0,
  depositApplication: 0,
  withdrawApplication: 0,
  affiliateApplication: 0,
  totalMembers: 0,
  currentMembers: 0,
  todayDepositAmount: 0,
  todayWithdrawAmount: 0,
  manualMoney: 0,
  manualPoint: 0,
  casinoBetAmount: 0,
  casinoProfit: 0,
  casinoRollingAmount: 0,
  slotBetAmount: 0,
  slotProfit: 0,
  slotRollingAmount: 0,
  sportBetAmount: 0,
  sportProfit: 0,
  sportRollingAmount: 0,
  miniGameBetAmount: 0,
  miniGameProfit: 0,
  miniGameRollingAmount: 0,
  myCommission: 0,
})

const loadReport = () => {
  return new Promise((resolve, reject) => {
    getKoreaStatsReport().then(({ data: statsData }) => {
      records.value = {
        ...records.value,
        ...statsData
      }

      resolve();
    }).catch((error) => {
      console.log(error);
      reject();
    });
  })
}

const scrollWheelListener = (evt) => {
  const scrollContainer = document.querySelector(".stats-header-container");

  /* eslint-disable */
  if (evt.deltaY !== -0) {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
  }
}

onMounted(() => {
  loadReport();

  // support vertical mousehweel scrolling in horiztonal scroll div
  const scrollContainer = document.querySelector(".stats-header-container");

  if (scrollContainer) {
    scrollContainer.addEventListener("wheel", scrollWheelListener);
  }
})

onUnmounted(() => {
  const scrollContainer = document.querySelector(".stats-header-container");

  if (scrollContainer) {
    scrollContainer.removeEventListener("wheel", scrollWheelListener);
  }
})
</script>

<style lang="scss" scoped>
.hamburger-bars-img {
  aspect-ratio: 448 / 512;
  width: 20px;
  margin: 15px 10px 15px 15px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
}

.stats-header-container {
  background-color: #fff;
  font-family: 'NanumNeo';
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  justify-content: center;

  &::-webkit-scrollbar-track {
    background-color: #d5d5d5;
  }

  &::-webkit-scrollbar {
    height: 3px;
    background-color: #ffffff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #999999;
  }

  .stats-row {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .stats {
    border: 1px solid #9e9e9e;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: max-content;

    .stat-label,
    .stat-value {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .stat-label {
      color: #9e9e9e;
      font-size: 12px;
      font-weight: 500;
      padding: 5px;
      white-space: nowrap;
      min-width: 100px;
    }

    .stat-value {
      color: #fff;
      text-shadow: 1px 1px 1px #404040;
      font-size: 12px;
      font-weight: 500;
      padding: 5px;
    }

    .green {
      background-color: #4dbd74;
    }

    .blue {
      background-color: #20a8d8;
    }

    .grey {
      background-color: #b0bec5;
    }
  }
}
</style>
