<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          clearable
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 100px;"
          default-first-option
          @change="getDailySummaryList"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 250px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="getDailySummaryList"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
    </div>
    <el-row class="month-summary">
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="personMoney24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ t('dashboard.totalFirstDeposit') }}
            </div>
            <div class="card-panel-content">
              {{ t('fields.amount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalFtdAmount }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.memberCount') }} :
              <span class="card-panel-num">{{ quickSummary.total_ftd }}</span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="personMoney24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('dashboard.totalDeposit') }}</div>
            <div class="card-panel-content">
              {{ t('fields.amount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalDepositAmount }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.memberCount') }} :
              <span class="card-panel-num">
                {{ quickSummary.total_depositMember }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.totalTransaction') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalDepositTransaction }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="personMoney24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ t('dashboard.totalTransfer') }}
            </div>
            <div class="card-panel-content">
              {{ t('fields.amount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalAffiliateTransfer }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.memberCount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalAffiliateTransferMemberCount }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.totalTransaction') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalAffiliateTransferCount }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="personMoney24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ t('dashboard.totalWithdraw') }}
            </div>
            <div class="card-panel-content">
              {{ t('fields.amount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalWithdrawAmount }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.memberCount') }} :
              <span class="card-panel-num">
                {{ quickSummary.total_withdrawMember }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.totalTransaction') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalWithdrawTransaction }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="personMoney24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="輸贏 = 投注 - 派彩"
              >
                <span>{{ t('dashboard.totalWinLoss') }}</span>
              </el-tooltip>
            </div>
            <div class="card-panel-content">
              {{ t('fields.amount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalWinLossAmount }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="personMoney24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ t('dashboard.totalValidBet') }}
            </div>
            <div class="card-panel-content">
              {{ t('fields.amount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalValidBetAmount }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.memberCount') }} :
              <span class="card-panel-num">
                {{ quickSummary.total_betMember }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.totalTransaction') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalBetCount }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="personMoney24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('dashboard.totalBonus') }}</div>
            <div class="card-panel-content">
              {{ t('fields.amount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalBonusAmount }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.memberCount') }} :
              <span class="card-panel-num">
                {{ quickSummary.total_bonusMember }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="peopleEdit20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ t('dashboard.totalActiveMember') }}
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.memberCount') }} :
              <span class="card-panel-num">
                {{ quickSummary.total_activeMember }}
              </span>
            </div>
            <div class="card-panel-content">
              {{ t('dashboard.newRegisterMember') }} :
              <span class="card-panel-num">
                {{ quickSummary.total_registerMember }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="peopleEdit20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('dashboard.totalVisit') }}</div>
            <div class="card-panel-content">
              {{ t('dashboard.memberCount') }} :
              <span class="card-panel-num">
                {{ quickSummary.total_visitorMember }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
      <el-card
        body-style="gap:10px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-row>
          <el-icon color="#1ed6ba">
            <Icon :icon="personMoney24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="盈利 = 输赢-红利-返水-调整金额"
              >
                <span>{{ t('dashboard.totalProfit') }}</span>
              </el-tooltip>
            </div>
            <div class="card-panel-content">
              {{ t('fields.amount') }} :
              <span class="card-panel-num">
                {{ quickSummary.totalProfitAmount }}
              </span>
            </div>
          </div>
        </el-row>
      </el-card>
    </el-row>
    <el-row class="chart-summary">
      <el-card>
        <Chart :options="depositBarchatOptions" />
      </el-card>
      <el-card>
        <Chart :options="depositLinechatOptions" />
      </el-card>
      <el-card>
        <Chart :options="financialPiechatOptions" />
      </el-card>
      <el-card>
        <Chart :options="vipPiechatOptions" />
      </el-card>
    </el-row>
    <el-row class="payment-chart-summary">
      <el-card>
        <Chart :options="depositSummaryBarchatOptions" />
      </el-card>
      <el-card>
        <div style="font-size: 18px; font-weight: 600;">
          {{ t('dashboard.paymentMethodSummary') }}
        </div>
        <el-table
          :data="quickSummary.depositRecords"
          ref="table"
          row-key="id"
          size="small"
          max-height="280px"
          highlight-current-row
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column
            prop="paymentType"
            :label="t('dashboard.paymentMethod')"
          />
          <el-table-column
            prop="totalDeposit"
            :label="t('dashboard.totalTransaction')"
          />
          <el-table-column
            prop="totalDepositPerc"
            :label="t('dashboard.ratio')"
          />
          <el-table-column
            prop="totalDepositAmount"
            :label="t('dashboard.fundAmount')"
          />
          <el-table-column
            prop="totalDepositAmountPerc"
            :label="t('dashboard.ratio')"
          />
        </el-table>
      </el-card>
    </el-row>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import peopleEdit20Filled from '@iconify-icons/fluent/people-edit-20-filled'
import personMoney24Filled from '@iconify-icons/fluent/person-money-24-filled'
import { getSiteDailySummary } from '../../api/daily-summary'
import {
  // onBeforeMount,
  // onBeforeUnmount,
  onMounted,
  reactive,
  // ref,
} from '@vue/runtime-core'
import Chart from '@/components/charts/Charts'
import moment from 'moment'
import { getSiteListSimple } from '../../api/site'
import { useI18n } from 'vue-i18n'

const currentDate = new Date()
const defaultStartDate = convertDate(currentDate, true)
const defaultEndDate = convertDate(currentDate, false)

const { t } = useI18n()
const request = reactive({
  siteId: null,
  createTime: [defaultStartDate, defaultEndDate],
})

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('day')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .startOf('day')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .endOf('day')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'months')
          .startOf('month')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'months')
          .endOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.last3Months'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(2, 'months')
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

function convertDate(date, isStartDate) {
  if (isStartDate === true) {
    return moment(date).format('YYYY-MM') + '-01'
  } else {
    return moment(date).format('YYYY-MM-DD')
  }
}

const dailySummary = reactive({
  list: [],
})

const quickSummary = reactive({
  registerMember: 0,
  total_ftd: 0,
  total_activeMember: 0,
  total_registerMember: 0,
  total_visitorMember: 0,
  total_depositMember: 0,
  total_withdrawMember: 0,
  total_betMember: 0,
  total_bonusMember: 0,
  visit: 0,
  totalDepositAmount: 0.0,
  totalWithdrawAmount: 0.0,
  totalBonusAmount: 0.0,
  totalWinLossAmount: 0.0,
  totalProfitAmount: 0.0,
  totalValidBetAmount: 0.0,
  totalFtdAmount: 0.0,
  totalDepositTransaction: 0,
  totalWithdrawTransaction: 0,
  totalAffiliateTransfer: 0.0,
  totalAffiliateTransferCount: 0,
  totalAffiliateTransferMemberCount: 0,
  totalBetCount: 0,
  depositRecords: [],
})

const depositBarchatOptions = reactive({
  // title: {
  //   display: true,
  //   text: t('dashboard.depositChartName'),
  // },
  height: '160px',
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: 10,
    right: 10,
    bottom: 60,
    top: 50,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: t('dashboard.depositAmount'),
      data: [100, 101],
      type: 'bar',
    },
  ],
  legend: {
    display: true,
    position: 'bottom',
  },
})

const depositLinechatOptions = reactive({
  // title: {
  //   display: true,
  //   text: t('dashboard.depositTransactionNumChartName'),
  // },
  height: '160px',
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: 10,
    right: 10,
    bottom: 60,
    top: 50,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: t('dashboard.depositMemberCount'),
      data: [100, 101],
      type: 'line',
      smooth: true,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
    {
      name: t('dashboard.depositTransactionCount'),
      data: [100, 101],
      type: 'line',
      smooth: true,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
  ],
  legend: {
    display: true,
    position: 'bottom',
  },
})

const financialPiechatOptions = reactive({
  title: {
    text: t('dashboard.financialLevelRatio'),
  },
  height: '220px',
  dataset: {
    source: [['Level', 'Deposit', 'Withdraw']],
  },
  series: [
    {
      type: 'pie',
      top: '20px',
      emphasis: {
        focus: 'self',
      },
      label: {
        formatter: '{b}: [' + t('fields.deposit') + ': {@Deposit}] ({d}%)',
      },
      encode: {
        itemName: 'Level',
        value: 'Deposit',
        tooltip: 'Deposit',
      },
    },
  ],
})

const vipPiechatOptions = reactive({
  title: {
    text: t('dashboard.vipLevelRatio'),
  },
  height: '220px',
  dataset: {
    source: [['Level', 'Deposit', 'Withdraw']],
  },
  series: [
    {
      type: 'pie',
      top: '20px',
      emphasis: {
        focus: 'self',
      },
      label: {
        formatter: '{b}: [' + t('fields.deposit') + ': {@Deposit}] ({d}%)',
      },
      encode: {
        itemName: 'Level',
        value: 'Deposit',
        tooltip: 'Deposit',
      },
    },
  ],
})

const depositSummaryBarchatOptions = reactive({
  title: {
    text: t('dashboard.merchantDepositSummary'),
  },
  height: '200px',
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: 10,
    right: 10,
    bottom: 60,
    top: 50,
    containLabel: true,
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
    data: [],
  },
  series: [
    {
      name: t('dashboard.fundAmount'),
      data: [],
      type: 'bar',
    },
  ],
  legend: {},
})

const siteList = reactive({
  list: [],
})
// let timer = ref(null)

onMounted(async () => {
  loadSitesSummary()
})

async function loadSitesSummary() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
  request.siteId = siteList.list[0].id
  getDailySummaryList()
}

async function getDailySummaryList() {
  resetDisplayValues()
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.createTime.length === 2) {
    query.createTime = request.createTime.join(',')
  }
  const { data: ret } = await getSiteDailySummary(query)
  dailySummary.list = ret.siteDailySummaryVOList
  quickSummary.totalDepositAmount = getDecimalValueWithComma(
    ret.siteDailySummaryTotalVO.totalDepositAmount
  )
  quickSummary.totalWithdrawAmount = getDecimalValueWithComma(
    ret.siteDailySummaryTotalVO.totalWithdrawAmount
  )
  quickSummary.totalBonusAmount = getDecimalValueWithComma(
    ret.siteDailySummaryTotalVO.totalBonusAmount
  )
  quickSummary.totalWinLossAmount = getDecimalValueWithComma(
    ret.siteDailySummaryTotalVO.totalWinLossAmount
  )
  quickSummary.totalProfitAmount = getDecimalValueWithComma(
    ret.siteDailySummaryTotalVO.totalProfitAmount
  )
  quickSummary.totalValidBetAmount = getDecimalValueWithComma(
    ret.siteDailySummaryTotalVO.totalValidBetAmount
  )
  quickSummary.totalFtdAmount = getDecimalValueWithComma(
    ret.siteDailySummaryTotalVO.totalFtdAmount
  )
  quickSummary.totalBetCount = ret.siteDailySummaryTotalVO.totalBetCount.toLocaleString(
    'en-US'
  )
  quickSummary.totalWithdrawTransaction = ret.siteDailySummaryTotalVO.totalWithdrawCount.toLocaleString(
    'en-US'
  )
  quickSummary.totalDepositTransaction = ret.siteDailySummaryTotalVO.totalDepositCount.toLocaleString(
    'en-US'
  )

  quickSummary.totalAffiliateTransfer = getDecimalValueWithComma(
    ret.affiliateTotalTransferVO.totalTransferAmount
  )
  quickSummary.totalAffiliateTransferMemberCount = ret.affiliateTotalTransferVO.totalAffiliateMember.toLocaleString(
    'en-US'
  )
  quickSummary.totalAffiliateTransferCount = ret.affiliateTotalTransferVO.totalTransaction.toLocaleString(
    'en-US'
  )

  quickSummary.total_depositMember = JSON.parse(
    ret.siteMemberDailySummaryVO.depositMember
  )
  quickSummary.total_withdrawMember = JSON.parse(
    ret.siteMemberDailySummaryVO.withdrawMember
  )
  quickSummary.total_betMember = JSON.parse(
    ret.siteMemberDailySummaryVO.betMember
  )
  quickSummary.total_bonusMember = JSON.parse(
    ret.siteMemberDailySummaryVO.bonusMember
  )

  if (ret.siteDepositSummaryVO.length > 0) {
    ret.siteDepositSummaryVO.forEach((item, index) => {
      item.totalDepositAmount = getDecimalValue(item.totalDepositAmount)
    })
  }
  quickSummary.depositRecords = ret.siteDepositSummaryVO

  getDepositChart(ret.siteDailySummaryVOList)
  getFinancialChart(
    ret.siteMemberDailySummaryFinancialVO,
    financialPiechatOptions
  )
  getFinancialChart(ret.siteMemberDailySummaryVipVO, vipPiechatOptions)
  getDepositSummaryChart(ret.siteDepositReportVO)
  getTotalDailySummary()
}

function getDecimalValueWithComma(amount) {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
function getDecimalValue(amount) {
  return amount.toFixed(2)
}

function getDepositChart(summaryList) {
  const recordTime = []
  const depositAmount = []
  const depositMemberCount = []
  const depositTransactionCount = []

  if (summaryList.length > 0) {
    summaryList.forEach((item, index) => {
      recordTime.push(item.recordTime.substring(5).replace('-', '/'))
      depositAmount.push(getDecimalValue(item.depositAmount))
      depositTransactionCount.push(item.depositCount)
      depositMemberCount.push(item.withdrawCount)
    })
    // debugger;
    depositBarchatOptions.xAxis.data = recordTime
    depositBarchatOptions.series[0].data = depositAmount

    depositLinechatOptions.xAxis.data = recordTime
    depositLinechatOptions.series[0].data = depositMemberCount
    depositLinechatOptions.series[1].data = depositTransactionCount
  }
}

function getFinancialChart(summaryList, chartOptions) {
  const financialData = chartOptions.dataset.source
  if (summaryList.length > 0) {
    summaryList.forEach((item, index) => {
      const data = []
      data.push(item.financialName)
      data.push(getDecimalValue(item.totalDeposit))
      data.push(getDecimalValue(item.totalWithdraw))

      financialData.push(data)
    })
    chartOptions.dataset.source = financialData
  }
}

function getTotalDailySummary() {
  dailySummary.list.forEach(x => {
    quickSummary.total_ftd =
      quickSummary.total_ftd + parseInt(x.ftdMember)
    quickSummary.total_registerMember =
      quickSummary.total_registerMember + x.registerMember
    quickSummary.total_visitorMember =
      quickSummary.total_visitorMember + x.visitsNo
    quickSummary.total_activeMember =
      quickSummary.total_activeMember + parseInt(x.activeMember)
  })
}

function getDepositSummaryChart(summaryList) {
  const paymentType = []
  const depositAmount = []

  if (summaryList.length > 0) {
    summaryList.forEach((item, index) => {
      paymentType.push(item.paymentType)
      depositAmount.push(getDecimalValue(item.totalDepositAmount))
    })
    depositSummaryBarchatOptions.yAxis.data = paymentType
    depositSummaryBarchatOptions.series[0].data = depositAmount
  }
}

function resetDisplayValues() {
  // reset Deposit bar chart value
  depositBarchatOptions.xAxis.data = [0]
  depositBarchatOptions.series[0].data = [0]

  // reset Deposit Line chart value
  depositLinechatOptions.xAxis.data = [0]
  depositLinechatOptions.series[0].data = [0]

  // reset Pie chart value
  financialPiechatOptions.dataset.source = [['Level', 'Deposit', 'Withdraw']]
  vipPiechatOptions.dataset.source = [['Level', 'Deposit', 'Withdraw']]

  // reset Deposit Summary Barchat
  depositSummaryBarchatOptions.yAxis.data = []
  depositSummaryBarchatOptions.series[0].data = []

  quickSummary.registerMember = 0
  quickSummary.total_ftd = 0
  quickSummary.total_activeMember = 0
  quickSummary.total_registerMember = 0
  quickSummary.total_visitorMember = 0
  quickSummary.total_depositMember = 0
  quickSummary.total_withdrawMember = 0
  quickSummary.total_betMember = 0
  quickSummary.total_bonusMember = 0
  quickSummary.visit = 0
  quickSummary.totalDepositAmount = 0.0
  quickSummary.totalWithdrawAmount = 0.0
  quickSummary.totalBonusAmount = 0.0
  quickSummary.totalWinLossAmount = 0.0
  quickSummary.totalProfitAmount = 0.0
  quickSummary.totalValidBetAmount = 0.0
  quickSummary.totalFtdAmount = 0.0
  quickSummary.totalDepositTransaction = 0
  quickSummary.totalWithdrawTransaction = 0
  quickSummary.totalAffiliateTransfer = 0.0
  quickSummary.totalAffiliateTransferCount = 0
  quickSummary.totalAffiliateTransferMemberCount = 0
  quickSummary.totalBetCount = 0

  quickSummary.depositRecords = []
}

function getSummaries(param) {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = t('dashboard.total')
    } else if (index === 2 || index === 4) {
      sums[index] = '100 %'
    } else {
      const values = data.map(item => Number(item[column.property]))
      if (!values.every(value => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
      } else {
        sums[index] = 0
      }

      if (index === 3) {
        sums[index] = sums[index].toFixed(2)
      }
    }
  })

  return sums
}

// onBeforeUnmount(async () => {
//   clearInterval(timer)
// })
// onBeforeMount(async () => {
//   timer = setInterval(() => {
//     getSiteDailySummary(form)
//   }, 10000)
// })
</script>
<style scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.month-summary {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.chart-summary {
  width: 100%;
  height: 530px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.payment-chart-summary {
  width: 100%;
  height: 320px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.chart-box-card {
  width: 100%;
  height: 100px;
}

.month-summary .box-card {
  flex: 1;
  flex-wrap: wrap;
}

.month-summary .box-card i {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px;
}
.card-panel-description {
  font-weight: 600;
  margin-left: 10px;
  margin-top: 10px;
}
.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 8px;
}
.card-panel-description .card-panel-num[data-v-6723c96e] {
  font-size: 20px;
}

.card-panel-content {
  font-size: small;
  font-weight: 600;
}

.el-card {
  border: 0;
}

/*.month-summary .box-card div span:nth-child(1) {*/
/*  font-size: 14px;*/
/*  color: rgba(0, 0, 0, .45);*/
/*}*/

/*.month-summary .box-card div span:nth-child(2) {*/
/*  font-size: 20px;*/
/*  font-weight: 700;*/
/*}*/
@media (max-width: 1200px) {
  .month-summary {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
