<template>
  <div class="roles-main">
    <div class="header-container">
      <el-select
        clearable
        v-model="request.siteId"
        size="small"
        :placeholder="t('fields.site')"
        class="filter-item"
        style="width: 150px"
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
    </div>
    <el-row class="month-summary">
      <el-card
        body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-icon color="#1ed6ba">
          <Icon :icon="personMoney24Filled" class="stats-icon" />
        </el-icon>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ t('fields.firstDeposit') }}</div>
          <span class="card-panel-num">
            {{ quickSummary.ftd }}
          </span>
        </div>
      </el-card>
      <el-card
        body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-icon color="#1fa8db">
          <Icon :icon="personEdit20Filled" class="stats-icon" />
        </el-icon>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ t('fields.register') }}</div>
          <span class="card-panel-num">
            {{ quickSummary.registerMember }}
          </span>
        </div>
      </el-card>
      <el-card
        body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-icon color="#db1f55">
          <Icon :icon="peopleMoney20Filled" class="stats-icon" />
        </el-icon>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ t('fields.totalFirstDeposit') }}</div>
          <span class="card-panel-num">
            {{ quickSummary.total_ftd }}
          </span>
        </div>
      </el-card>
      <el-card
        body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-icon color="#1fdbb0">
          <Icon :icon="peopleEdit20Filled" class="stats-icon" />
        </el-icon>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ t('fields.totalRegister') }}</div>
          <span class="card-panel-num">
            {{ quickSummary.total_registerMember }}
          </span>
        </div>
      </el-card>
      <el-card
        body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
        :xs="12"
        :sm="12"
        :lg="6"
        class="box-card"
      >
        <el-icon color="purple">
          <Icon :icon="peopleEdit20Filled" class="stats-icon" />
        </el-icon>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ t('fields.visitNumber') }}</div>
          <span class="card-panel-num">
            {{ quickSummary.visit }}
          </span>
        </div>
      </el-card>
    </el-row>
    <el-card class="box-card">
      <Chart :options="options" />
    </el-card>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import peopleMoney20Filled from '@iconify-icons/fluent/people-money-20-filled'
import peopleEdit20Filled from '@iconify-icons/fluent/people-edit-20-filled'
import personMoney24Filled from '@iconify-icons/fluent/person-money-24-filled'
import personEdit20Filled from '@iconify-icons/fluent/person-edit-20-filled'
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const request = reactive({
  siteId: null,
  lastMonth: false,
})

const dailySummary = reactive({
  list: [],
})

const quickSummary = reactive({
  ftd: 0,
  registerMember: 0,
  total_ftd: 0,
  total_registerMember: 0,
  visit: 0,
})

const options = reactive({
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: 10,
    right: 10,
    bottom: 60,
    top: 30,
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
      name: t('fields.firstDepositMember'),
      data: [100, 101],
      type: 'line',
      smooth: true,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
    {
      name: t('fields.registerMember'),
      data: [100, 101],
      type: 'line',
      smooth: true,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
    {
      name: t('fields.visitNumber'),
      color: "purple",
      data: [100, 101],
      type: 'line',
      smooth: true,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    }
  ],
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
  const { data: ret } = await getSiteDailySummary(request)
  dailySummary.list = ret

  const ftdMembers = []
  const registerMembers = []
  const recordTime = []
  const visitsNo = []

  if (ret.length > 0) {
    ret.forEach((item, index) => {
      recordTime.push(item.recordTime)
      ftdMembers.push(JSON.parse(item.ftdMember).length)
      registerMembers.push(item.registerMember)
      visitsNo.push(item.visitsNo)
    })
    // debugger;
    options.xAxis.data = recordTime
    options.series[0].data = ftdMembers
    options.series[1].data = registerMembers
    options.series[2].data = visitsNo
  }

  getTodaySummary()
  getTotalDailySummary()
}

function getTotalDailySummary() {
  dailySummary.list.forEach(x => {
    quickSummary.total_ftd =
      quickSummary.total_ftd + JSON.parse(x.ftdMember).length
    quickSummary.total_registerMember =
      quickSummary.total_registerMember + x.registerMember
  })
}

function getTodaySummary() {
  const today = moment(new Date()).format('YYYY-MM-DD')
  var obj = dailySummary.list.find(x => x.recordTime === today)
  if (obj !== undefined) {
    quickSummary.ftd = JSON.parse(obj.ftdMember).length
    quickSummary.registerMember = obj.registerMember
    quickSummary.visit = obj.visitsNo
  }
}

function resetDisplayValues() {
  // reset chart value
  options.xAxis.data = [0]
  options.series[0].data = [0]
  options.series[1].data = [0]
  options.series[2].data = [0]

  quickSummary.total_ftd = 0
  quickSummary.total_registerMember = 0
  quickSummary.ftd = 0
  quickSummary.registerMember = 0
  quickSummary.visit = 0
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

.month-summary {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px;
  margin-top: 10px;
  margin-bottom: 40px;
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
  font-weight: 700;
  margin-left: 0;
}
.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}
.card-panel-description .card-panel-num[data-v-6723c96e] {
  font-size: 20px;
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
