<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadStats"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <div>
      <el-card>
        <Chart :options="onlineStatOptions" ref="stats" @clicked="onClick" />
      </el-card>
    </div>
    <div class="header-container">
      <div class="search" style="margin-top: 50px">
        <el-date-picker
          v-model="compareRequest.recordTime"
          type="datetime"
          placeholder="Pick a date/time"
          :disabled-date="disabledDate"
          :disabled-minutes="disabledMinutes"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 300px"
          size="small"
        />
        <el-select
          v-model="compareRequest.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="compareRequest.compareDays"
          size="small"
          :placeholder="t('fields.days')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.compareDaysOptions"
            :key="item"
            :label="item + ' days'"
            :value="item"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadCompare"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetCompareQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <div>
      <el-card>
        <Chart :options="compareOptions" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { getSiteListSimple } from '../../../api/site'
import {
  getOnlineStats,
  getCompareOnlineStats
} from '../../../api/online-stat'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import Chart from '@/components/charts/Charts'

const stats = ref(null);
const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
const uiControl = reactive({
  compareDaysOptions: [7, 30]
})

const siteList = reactive({
  list: [],
})

const request = reactive({
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null
})

const compareRequest = reactive({
  recordTime: convertDateTime(startDate.setHours(0, 0, 0, 0)),
  compareDays: 7,
  siteId: null
})

const shortcuts = getShortcuts(t)
const onlineStatOptions = reactive({
  title: {
    display: true,
    text: t('dashboard.onlineStatsChartName'),
  },
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
    triggerEvent: true,
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [],
  legend: {
    display: true,
    position: 'bottom',
  },
})

const compareOptions = reactive({
  title: {
    display: true,
    text: t('dashboard.onlineStatsCompareChartName'),
  },
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
  series: [],
  legend: {
    display: true,
    position: 'bottom',
  },
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function convertDateTime(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(5, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function disabledMinutes(hour) {
  const makeRange = (start, end) => {
    const result = []
    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    return result
  }
  const fullMin = makeRange(0, 59)
  return fullMin.filter(min => min !== 0 && min !== 30)
}

function resetQuery() {
  request.name = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = siteList.list.length > 0 ? siteList.list[0].id : null
}

function resetCompareQuery() {
  compareRequest.recordTime = convertDateTime(startDate.setHours(0, 0, 0, 0))
  compareRequest.compareDays = uiControl.compareDaysOptions[0]
  compareRequest.siteId = siteList.list.length > 0 ? siteList.list[0].id : null
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function loadStats() {
  const recordTime = []
  onlineStatOptions.series = []

  const { data: ret } = await getOnlineStats(request.siteId, request.recordTime[0], request.recordTime[1])
  if (ret.length === 0) {
    return;
  }
  ret[0].stats.forEach((item, index) => {
    recordTime.push(item.recordTime)
  })
  onlineStatOptions.xAxis.data = recordTime
  ret.forEach((item, index) => {
    const count = []
    item.stats.forEach((s, i) => {
      count.push(s.count)
    })
    onlineStatOptions.series.push({
      type: 'line',
      smooth: true,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    })
    onlineStatOptions.series[index].data = count
    onlineStatOptions.series[index].name = item.way
  })
}

async function loadCompare() {
  const recordTime = []
  compareOptions.series = []

  const { data: ret } = await getCompareOnlineStats(compareRequest.siteId, compareRequest.recordTime, compareRequest.compareDays);
  if (ret.length === 0) {
    return;
  }
  ret[0].stats.forEach((item, index) => {
    recordTime.push(item.recordTime)
  })
  compareOptions.xAxis.data = recordTime
  ret.forEach((item, index) => {
    const count = []
    item.stats.forEach((s, i) => {
      count.push(s.count)
    })
    compareOptions.series.push({
      type: 'line',
      smooth: true,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    })
    compareOptions.series[index].data = count
    compareOptions.series[index].name = item.way
  })
}

async function onClick(val) {
  if (val) {
    compareRequest.recordTime = val.name + ":00"
    compareRequest.siteId = request.siteId
    compareRequest.compareDays = 30
    await loadCompare()
  }
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  compareRequest.siteId = siteList.list[0].id
  await loadStats()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-input-number:deep .el-input__inner {
  text-align: left;
}
</style>

<style rel="stylesheet/scss" lang="scss" >
li.el-time-spinner__item.disabled {
  display: none;
}
</style>
