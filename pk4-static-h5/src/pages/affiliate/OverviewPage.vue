<template>
    <q-card class="q-pa-md bg-transparent">
      <img @click="openPageInfoDialog" class="info-qn" src="../../assets/images/affiliate/qnmark.png">
      <div class="top-right" @click="openDaySelectionDialog">
        {{ daysSelection.label }}
      </div>
      <q-card-section class="graph-section">
        <!-- Tabs -->
        <q-tabs
          v-model="tab"
          dense
          no-caps
          class="tab-toggle"
          indicator-color="transparent"
          align="center"
        >
          <q-tab name="activity" :label="selectedMetric.label" />
          <q-tab name="team_pl" label="Team P&L" />
        </q-tabs>
    
        <!-- Tab Panels -->
        <q-tab-panels class="bg-transparent" v-model="tab" animated>
          <!-- Dynamic Metric Chart Panel -->
          <q-tab-panel name="activity">
            <Line :data="getChartData(selectedMetric.key)" :options="chartOptions(selectedMetric.label)" />
          </q-tab-panel>
    
          <!-- Static Team P&L Placeholder -->
          <q-tab-panel class="bg-transparent" name="team_pl">
            <div class="text-center bg-transparent text-grey">
              <ProfitLossChart />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <!-- Team Member Info -->
      <q-card-section class="team-members">
        <img src="../../assets/images/affiliate/team-icon.png">
        <div>Team member 4362</div>
      </q-card-section>
  
      <!-- Metric Cards -->
      <q-card-section class="q-gutter-sm row metrics">
        <q-card
          v-for="item in metrics"
          :key="item.key"
          class="col-12 q-pa-sm text-center cursor-pointer chart-item"
          :class="[
            'bg-' + item.color,
            'text-' + item.textColor,
            { active: selectedMetric.key === item.key }
          ]"
          @click="selectMetric(item)"
        >
          <div class="text-h6">{{ item.count }}</div>
          <div class="text-caption" v-html="formatLabel(item.label)" />
        </q-card>
      </q-card-section>
    </q-card>
    
    <q-dialog width="100%" v-model="isDaySelectionDialog" persistent>
      <div class="popout-dialog">
        <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
        <div class="popout-dialog-container">

          <div style="width: 100%;" class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
            <q-btn :label="$t('btn.cancel')" no-caps class="btn-cancel" v-close-popup />
            <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" @click="logout" />
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
              <ul class="info-top">
                <li>1. For current week and current month, the data will only be refreshed every hour.</li>
                <li>2. Win/Loss , Team P&amp;L :</li>
              </ul>
              <ul class="info-down">
                <li>Green representing positive amount, which is the profit.</li><li>Red representing negative amount, which is the loss.</li></ul></div>

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
  import { ref } from 'vue'
  
  ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Title)
  
  const tab = ref('activity')
  
  // Simulated chart data
  const allChartData = {
    logins: [34, 42, 33, 29, 31, 36, 32],
    registers: [3, 2, 1, 0, 2, 1, 3],
    bets: [5, 6, 9, 7, 8, 6, 7],
    promotions: [4, 3, 5, 2, 3, 3, 4],
    registersFirstDeposits: [1, 1, 0, 1, 0, 2, 1],
    firstDeposits: [1, 1, 0, 1, 0, 2, 1],
    deposits: [4, 6, 5, 3, 7, 6, 6],
    withdrawals: [2, 3, 1, 2, 2, 3, 2]
  }
  
  // Chart labels
  const labels = ['04/23', '04/24', '04/25', '04/26', '04/27', '04/28', '04/29']
  
  const getChartData = (key) => ({
    labels,
    datasets: [
      {
        label: key,
        data: allChartData[key],
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
        beginAtZero: true
      }
    }
  })
  
  // Cards & metric chart selectors
  const metrics = [
    { key: 'logins', count: 84, label: 'Logins', color: 'chartlogins', textColor: 'white' },
    { key: 'registers', count: 3, label: 'Registers', color: 'chartregisters', textColor: 'white' },
    { key: 'bets', count: 48, label: 'Bet count', color: 'chartbetcount', textColor: 'white' },
    { key: 'promotions', count: 24, label: 'Promotions', color: 'chartpromotions', textColor: 'white' },
    { key: 'registersFirstDeposits', count: 2, label: 'Registers First deposits', color: 'chartregistersfirstdeposits', textColor: 'white' },
    { key: 'firstDeposits', count: 2, label: 'First deposits', color: 'chartfirstdeposits', textColor: 'white' },
    { key: 'deposits', count: 37, label: 'Deposits', color: 'chartdeposits', textColor: 'white' },
    { key: 'withdrawals', count: 15, label: 'Withdrawals', color: 'chartwithdrawal', textColor: 'white' }
  ]
  
  const selectedMetric = ref(metrics[0])
  
  const selectMetric = (item) => {
    selectedMetric.value = item
    tab.value = 'activity'
  }
  const isDaySelectionDialog = ref(false)
  const daysSelection = {label: '7 days', value: 7}
  const openDaySelectionDialog = () => {
    isDaySelectionDialog.value = true
  }
  const isPageInfoDialog = ref(false);
  const openPageInfoDialog = () => {
    isPageInfoDialog.value = true
  }
  const formatLabel = (label) => label.replace('\n', '<br>')
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
  .chart-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    text-align: left;
    height: 100%;
    padding: 8px 20px;
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
        width: 0; height: 0; border-left: 10px solid transparent; 
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
    background:#121829;
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
    :deep(.q-tabs__content) {

    }

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
  </style>