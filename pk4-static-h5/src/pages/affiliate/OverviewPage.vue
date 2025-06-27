<template>
  <q-card class="q-pa-md bg-transparent">
    <img @click="openPageInfoDialog" class="info-qn" src="../../assets/images/affiliate/qnmark.png">
    <div class="top-right" @click="openDaySelectionDialog">
      {{ daysSelection.label }}
    </div>
    <q-card-section class="graph-section">
      <!-- Tabs -->
      <q-tabs v-model="tab" dense no-caps class="tab-toggle" indicator-color="transparent" align="center">
        <q-tab name="activity" :label="selectedMetric.label" />
        <q-tab name="team_pl" label="Team P&L" />
      </q-tabs>

      <!-- Tab Panels -->
      <q-tab-panels class="bg-transparent" v-model="tab" animated>
        <!-- Dynamic Metric Chart Panel -->
        <q-tab-panel name="activity">
          <Line v-if="allChartData && labels" :data="getChartData(selectedMetric.key)"
            :options="chartOptions(selectedMetric.label)" />
        </q-tab-panel>

        <!-- Static Team P&L Placeholder -->
        <q-tab-panel class="bg-transparent" name="team_pl">
          <div class="text-center bg-transparent text-grey">
            <ProfitLossChart v-if="allChartData && labels" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <!-- Team Member Info -->
    <q-card-section class="team-members">
      <img src="../../assets/images/affiliate/team-icon.png">
      <div>{{ store.nickName }}</div>
    </q-card-section>

    <!-- Metric Cards -->
    <div v-if="isLoading">
      <div class="container animate">
        <div class="one animate splat delay-1"></div>
        <div class="two animate splat delay-2"></div>
        <div class="three animate splat delay-3"></div>
        <div class="four animate splat delay-4"></div>
      </div>
      <div class="container animate">
        <div class="five animate splat delay-1"></div>
        <div class="six animate splat delay-2"></div>
        <div class="seven animate splat delay-3"></div>
        <div class="eight animate splat delay-4"></div>
      </div>
    </div>
    <q-card-section class="q-gutter-sm row metrics" v-else>
      <q-card v-for="item in metrics" :key="item.key" class="col-12 q-pa-sm text-center cursor-pointer chart-item"
        :class="[
          'bg-' + item.color,
          'text-' + item.textColor,
          { active: selectedMetric.key === item.key }
        ]" @click="selectMetric(item)">
        <div class="text-h6">{{ item.count }}</div>
        <div class="text-caption">{{ item.label }}</div>
      </q-card>
    </q-card-section>
    <q-card-section class="statistics row">
      <div class="stats-row" v-for="(stat, index) in stats" :key="(index)">
        <div class="stats-label">{{ stat.label }}</div>
        <div class="stats-value" :class="['text-' + stat.label.toLowerCase(), 'text-' + stat.textColor]">{{ stat.value
        }}
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-dialog width="100%" v-model="isDaySelectionDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">

        <div style="width: 100%;" class="q-mt-lg q-pl-lg q-pr-lg x-n-container">
          <div class="filter-grid">
            <div class="filter-item" :class="{ active: dialogDaysSelection.label === 'Today' }"
              @click="changeDaySelection('Today')">Today</div>
            <div class="filter-item" :class="{ active: dialogDaysSelection.label === 'Yesterday' }"
              @click="changeDaySelection('Yesterday')">Yesterday</div>
            <div class="filter-item" :class="{ active: dialogDaysSelection.label === '7-days' }"
              @click="changeDaySelection('7-days')">7-days</div>
            <div class="filter-item" :class="{ active: dialogDaysSelection.label === 'This Month' }"
              @click="changeDaySelection('This Month')">This Month</div>
          </div>

          <div style="display:flex;">
            <q-btn :label="$t('btn.cancel')" no-caps class="btn-cancel" v-close-popup />
            <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" @click="confirmDaySelection" />
          </div>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="isPageInfoDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">

        <div class="txt-title">{{ $t("btn.reminder") }}</div>
        <div class="txt-content q-mt-md text-center">
          <div class="overview-info">
            <ul class="info-top" style="list-style-type: none; text-align:left">
              <li>1. For current week and current month, the data will only be refreshed every hour.</li>
              <br>
              <li>2. Win/Loss , Team P&amp;L :</li>
            </ul>
            <ul class="info-down" style="list-style-type: none; text-align:left">
              <li>Green representing positive amount, which is the profit.</li>
              <li>Red representing negative amount, which is the loss.</li>
            </ul>
          </div>

        </div>

        <div style="width: 100%;" class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <!-- <q-btn :label="$t('btn.cancel')" no-caps class="btn" v-close-popup /> -->

          <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" v-close-popup />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import ProfitLossChart from 'components/ProfitLossChart.vue'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title
} from 'chart.js'

import { Line } from 'vue-chartjs'
import { ref, onActivated, provide } from 'vue'
import { api } from 'boot/axios';
import moment from 'moment';
import { userStore } from 'src/stores';

const store = userStore();

const isLoading = ref(false);

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Title)

const tab = ref('activity')

// Simulated chart data
const allChartData = ref();

// Chart labels
const labels = ref()

provide('labels', labels);
provide('allChartData', allChartData);

const getChartData = (key) => ({
  labels: labels.value,
  datasets: [
    {
      label: key,
      data: allChartData.value[key],
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f6',
      tension: 0.4,
      fill: false,
      pointRadius: 5
    }
  ]
})

const chartOptions = (title) => ({
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: context => context[0].label,
        label: context => `${title}\n${context.raw}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: title === 'Logins' || title === 'Registers' ? 0 : undefined
      }
    }
  }
})

const changeDaySelection = (type) => {
  dialogDaysSelection.value = { label: type, value: type };
}

const confirmDaySelection = () => {
  daysSelection.value = dialogDaysSelection.value;
  initData();
  isDaySelectionDialog.value = false;
}


function getDateRange(startDate = null, endDate = null) {
  const type = daysSelection.value.label;

  let start, end;

  switch (type) {
    case 'Today':
      start = moment().format('YYYY-MM-DD');
      end = start;
      break;
    case 'Yesterday':
      start = moment().subtract(1, 'days').format('YYYY-MM-DD');
      end = start;
      break;
    case '7-days':
      start = moment().subtract(7, 'days').format('YYYY-MM-DD');
      end = moment().format('YYYY-MM-DD');
      break;
    case 'This Month':
      start = moment().startOf('month').format('YYYY-MM-DD');
      end = moment().endOf('month').format('YYYY-MM-DD');
      break;
    case 'Custom':
      if (!startDate || !endDate) {
        throw new Error("Custom range requires both startDate and endDate.");
      }
      start = moment(startDate).format('YYYY-MM-DD');
      end = moment(endDate).format('YYYY-MM-DD');
      break;
    default:
      throw new Error("Invalid date range type.");
  }

  return `${start},${end}`;
}

// Cards & metric chart selectors
const metrics = ref([
  { key: 'logins', count: 0, label: 'Logins', color: 'chartlogins', textColor: 'white' },
  { key: 'registers', count: 0, label: 'Registers', color: 'chartregisters', textColor: 'white' },
  { key: 'bets', count: 0, label: 'Bet count', color: 'chartbetcount', textColor: 'white' },
  { key: 'promotions', count: 0, label: 'Promotions', color: 'chartpromotions', textColor: 'white' },
  { key: 'registersFirstDeposits', count: 0, label: 'Registers First deposits', color: 'chartregistersfirstdeposits', textColor: 'white' },
  { key: 'firstDeposits', count: 0, label: 'First deposits', color: 'chartfirstdeposits', textColor: 'white' },
  { key: 'deposits', count: 0, label: 'Deposits', color: 'chartdeposits', textColor: 'white' },
  { key: 'withdrawals', count: 0, label: 'Withdrawals', color: 'chartwithdrawal', textColor: 'white' }
]);

const selectedMetric = ref(metrics.value[0])

const selectMetric = (item) => {
  selectedMetric.value = item
  tab.value = 'activity'
}
const stats = ref([
  { key: 'deposit', label: 'Deposit', value: (0).toFixed(2), textColor: 'grey-6' }, //
  { key: 'withdrawalAmount', label: 'Withdrawal amount', value: (0).toFixed(2), textColor: 'grey-6' },
  { key: 'bonus', label: 'Bonus', value: (0).toFixed(2), textColor: 'blue-8' },
  { key: 'validBet', label: 'Valid bet', value: (0).toFixed(2), textColor: 'blue-8' }, // validBet
  { key: 'winLoss', label: 'Win/Loss', value: (0).toFixed(2), textColor: 'negative' }, // payout - validBet
  { key: 'teamPnL', label: 'Team P&L', value: (0).toFixed(2), textColor: 'negative' }, // payout - validBet
  { key: 'teamRebate', label: 'Team Rebate', value: (0).toFixed(2), textColor: 'positive' }, // rebate
]);
const isDaySelectionDialog = ref(false)
const daysSelection = ref({ label: '7-days', value: 7 });
const dialogDaysSelection = ref({ label: '7-days', value: 7 });
const openDaySelectionDialog = () => {
  dialogDaysSelection.value = daysSelection.value;
  isDaySelectionDialog.value = true
}
const isPageInfoDialog = ref(false);
const openPageInfoDialog = () => {
  isPageInfoDialog.value = true
}


const initData = () => {
  isLoading.value = true;

  const recordTime = getDateRange()
  api.get(`/session/affiliate/data-by-month?recordTime=${recordTime}`).then((res) => {
    const data = res.data;

    const sumByKey = (key) => data.reduce((sum, obj) => sum + (typeof obj[key] === "number" ? obj[key] : 0), 0);

    const { labels: newLabels, allChartData: newAllChartData } = data.reduce((acc, curr) => {
      return {
        ...acc,
        labels: [...acc.labels, curr.recordTime],
        allChartData: {
          ...acc.allChartData,
          logins: [...acc.allChartData.logins, curr.loginCount],
          registers: [...acc.allChartData.registers, curr.newMemberCount],
          bets: [...acc.allChartData.bets, curr.bet],
          promotions: [...acc.allChartData.promotions, curr.bonusCount],
          registersFirstDeposits: [...acc.allChartData.registersFirstDeposits, curr.ftdCount],
          firstDeposits: [...acc.allChartData.firstDeposits, curr.ftdAmount],
          deposits: [...acc.allChartData.deposits, curr.depositAmount],
          withdrawals: [...acc.allChartData.withdrawals, curr.withdrawAmount],
          teamPnL: [...acc.allChartData.teamPnL, curr.payout - curr.validBet - curr.rebate],
        }
      }
    }, {
      labels: [],
      allChartData: {
        logins: [],
        registers: [],
        bets: [],
        promotions: [],
        registersFirstDeposits: [],
        firstDeposits: [],
        deposits: [],
        withdrawals: [],
        teamPnL: []
      }
    });

    allChartData.value = newAllChartData;
    labels.value = newLabels;

    metrics.value = metrics.value.map(metric => {
      if (metric.key === 'logins') metric.count = sumByKey("loginCount");
      else if (metric.key === 'registers') metric.count = sumByKey("newMemberCount");
      else if (metric.key === 'bets') metric.count = sumByKey("bet");
      else if (metric.key === 'promotions') metric.count = sumByKey("bonusCount");
      else if (metric.key === 'registersFirstDeposits') metric.count = sumByKey("ftdCount");
      else if (metric.key === 'firstDeposits') metric.count = sumByKey("ftdAmount");
      else if (metric.key === 'deposits') metric.count = sumByKey("depositAmount");
      else if (metric.key === 'withdrawals') metric.count = sumByKey("withdrawAmount");
      return metric;
    });

    stats.value = stats.value.map(stat => {
      if (stat.key === 'deposit') stat.value = sumByKey("depositAmount");
      else if (stat.key === 'withdrawalAmount') stat.value = sumByKey("withdrawAmount");
      else if (stat.key === 'bonus') stat.value = sumByKey("bonus");
      else if (stat.key === 'validBet') stat.value = sumByKey("validBet");
      else if (stat.key === 'winLoss') stat.value = sumByKey("payout") - sumByKey("validBet");
      else if (stat.key === 'teamPnL') stat.value = sumByKey("payout") - sumByKey("validBet") - sumByKey("rebate");
      else if (stat.key === 'teamRebate') stat.value = sumByKey("rebate");
      return stat;
    });

    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }).finally(() => {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  })
}
onActivated(() => {
  initData();
})

</script>

<style scoped lang="scss">
.info-qn {
  position: absolute;
  right: 120px;
  top: -30px;
  width: 15px;
}

.top-right {
  top: -35px;
  right: 10px;
  position: absolute;
}

.q-card {
  max-width: 800px;
  margin: auto;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  margin: 0 auto;
  column-gap: 10px;
  row-gap: 20px;
}

.statistics {
  background: linear-gradient(90deg, #1C273D 0%, #12192B 100%);
  padding: 10px;
  margin: 15px auto;
  border-radius: 8px;

  .stats-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 14px;
    border-bottom: 0.97px solid #FFFFFF1A;
    padding: 10px;

    &:last-child {
      border: 0;
    }

    .stats-label {
      color: #B2BDBF;
    }

    .stats-value {
      &:not(.text-deposit, .text-withdrawal) {
        font-weight: bold;
      }
    }
  }
}

.chart-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  text-align: left;
  height: 100%;
  padding: 19px 15px;
  border: 2px solid transparent;

  &:after {
    content: "";
    background: url(../../assets/images/affiliate/badge.png)no-repeat center center;
    padding: 10px;
    position: absolute;
    background-size: contain;
    right: 5px;
    top: 0;
  }

  &.active {
    &:before {
      content: "";
      position: absolute;
      top: -10px;
      left: 0;
      right: 0;
      margin: auto;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #ffffff;
    }

    border-color: #ffffff;
  }
}

.bg-chartlogins {
  background: linear-gradient(180deg, #0299FA 0%, #4FC2FD 100%);

  &.active {
    box-shadow: 2px 2px 2px #4BC0FD;
  }
}

.bg-chartregisters {
  background: linear-gradient(180deg, #FF4949 0%, #FF8B8B 100%);
}

.bg-chartbetcount {
  background: linear-gradient(180deg, #FE1E78 0%, #FE9DC3 100%);
}

.bg-chartpromotions {
  background: linear-gradient(180deg, #42AACC 0%, #00F9FF 100%);
}

.bg-chartregistersfirstdeposits {
  background: linear-gradient(180deg, #FC9500 0%, #FFBC1C 100%);
}

.bg-chartfirstdeposits {
  background: linear-gradient(180deg, #FB501C 0%, #FE8831 100%);
}

.bg-chartdeposits {
  background: linear-gradient(180deg, #8543FF 0%, #BA95FF 100%);
}

.bg-chartwithdrawal {
  background: linear-gradient(180deg, #47C93B 0%, #A6EA8A 100%)
}

.graph-section {
  background: #121829;
  padding: 10px 0;
}

.team-members {
  font-weight: bold;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 15px auto 10px;

  img {
    width: 30px;
    height: unset;
  }
}

.tab-toggle {
  // background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;

  background-size: 100% 100%;
  border-radius: 8px;
  margin: 10px;
  padding: 1px;

  .right {
    color: white;
    // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
    background-size: 0;
  }

  .left {
    color: white;
    // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
    background-size: 0;
  }

  :deep(.q-tab__label) {
    font-weight: 700;
    font-size: 10px;
    // color: #FFFFFF80;
  }

  :deep(.q-tab) {
    background: #3237384D;
    min-height: unset;
    padding: 4px;
  }

  :deep(.q-tabs__content) {}

  :deep(.q-tab--active) {
    color: white;
    // background-size: 100% 100%;
    // background: linear-gradient(
    //   180deg,
    //   rgba(97, 255, 0, 0) 0%,
    //   rgba(97, 255, 0, 0.25) 50.5%,
    //   rgba(97, 255, 0, 0) 100%
    // );
    // box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

    // &:before {
    //   content: "";
    //   background-color: #21EF89;
    //   height: 3px;
    //   border-radius: 4px;
    //   width: 30%;
    //   position: absolute;
    //   bottom: 0;
    //   left: 50%;
    //   transform: translateX(-50%);
    // }
    background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
  }

  :deep(.q-tab--active .q-tab__label) {
    font-weight: 700 !important;
  }
}

.popout-dialog-container {
  .filter-grid {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 10px 0;

    .filter-item {
      margin: 5px;
      border-radius: 4px;
      background: #EAEFF9;
      padding: 8px 12px;
      white-space: nowrap;

      &.active {
        background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
        color: #fff;
      }
    }
  }
}

body {
  font-family: sans-serif;
  text-align: center;
}

.container {
  border-radius: 100px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.container div {
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
  margin: 10px;
  border-radius: 5px;
  border-color: #fff;
  box-shadow: 2px 2px 2px #dadada;
}

.container .one {
  background: linear-gradient(180deg, #0299fa, #4fc2fd);
}

.container .two {
  background: linear-gradient(180deg, #ff4949, #ff8b8b);
}

.container .three {
  background: linear-gradient(180deg, #fe1e78, #fe9dc3);
}

.container .four {
  background: linear-gradient(180deg, #42aacc, #00f9ff);
}

.container .five {
  background: linear-gradient(180deg, #fc9500, #ffbc1c)
}

.container .six {
  background: linear-gradient(180deg, #fb501c, #fe8831)
}

.container .seven {
  background: linear-gradient(180deg, #8543ff, #ba95ff)
}

.container .eight {
  background: linear-gradient(180deg, #47c93b, #a6ea8a)
}


.animate {
  animation-duration: 1s; //running slower to show effect
  animation-delay: 0.5s;
  animation-timing-function: cubic-bezier(.26, .53, .74, 1.48);
  animation-fill-mode: backwards;
  animation-iteration-count: infinite;
}

/* Splat In */
.animate.splat {
  animation-name: animate-splat;
}

@keyframes animate-splat {
  0% {
    opacity: 1;
    transform: scale(1.1, 1.1) rotate(0deg);
  }

  50% {
    opacity: 1;
    transform: scale(1.1, 1.1) rotate(15deg) translate(0, -10px);
  }

  100% {
    opacity: 1;
    transform: scale(1, 1) rotate(0) translate(0, 0);
  }
}

/* Animation Delays */
.delay-1 {
  animation-delay: 0.6s;
}

.delay-2 {
  animation-delay: 0.7s;
}

.delay-3 {
  animation-delay: 0.8s;
}

.delay-4 {
  animation-delay: 0.9s;
}

.delay-5 {
  animation-delay: 1s;
}

.delay-6 {
  animation-delay: 1.1s;
}

.delay-7 {
  animation-delay: 1.2s;
}

.delay-8 {
  animation-delay: 1.3s;
}

.delay-9 {
  animation-delay: 1.4s;
}

.delay-10 {
  animation-delay: 1.5s;
}

.delay-11 {
  animation-delay: 1.6s;
}

.delay-12 {
  animation-delay: 1.7s;
}

.delay-13 {
  animation-delay: 1.8s;
}

.delay-14 {
  animation-delay: 1.9s;
}

.delay-15 {
  animation-delay: 2s;
}

@media screen and (prefers-reduced-motion: reduce) {
  .animate {
    animation: none !important;
  }
}
</style>