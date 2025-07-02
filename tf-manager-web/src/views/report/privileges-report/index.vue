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
          style="width: 250px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px;margin-left:5px"
          :placeholder="t('fields.name')"
        />

        <!--        <el-select-->
        <!--          v-model="request.siteId"-->
        <!--          size="small"-->
        <!--          :placeholder="t('fields.site')"-->
        <!--          class="filter-item"-->
        <!--          style="width: 120px; margin-left: 5px"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="item in siteList.list"-->
        <!--            :key="item.id"-->
        <!--            :label="item.siteName"-->
        <!--            :value="item.id"-->
        <!--          />-->
        <!--        </el-select>-->
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="
            uiControl.display === 'DATA'
              ? loadPrivilegeReport(false)
              : loadCharts()
          "
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
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:report:privilege:export']"
          @click="requestExportExcel"
          style="float: right;"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
      <div style="margin-top: 10px;">
        <el-radio-group v-model="uiControl.display" size="small">
          <el-radio-button label="DATA">
            {{ t('fields.table') }}
          </el-radio-button>
          <el-radio-button label="CHART">
            {{ t('fields.chart') }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <el-card
      class="chart-summary"
      v-if="uiControl.display === 'CHART'"
      v-loading="uiControl.chartLoading"
      style="gap: 10px; height: 500px;"
    >
      <Chart :options="amountPiechatOptions" />
    </el-card>
    <el-card
      class="chart-summary"
      v-if="uiControl.display === 'CHART'"
      v-loading="uiControl.chartLoading"
      style="margin-top: 10px; height: 500px;"
    >
      <Chart :options="countPiechatOptions" />
    </el-card>

    <el-table
      v-if="uiControl.display === 'DATA'"
      :data="page.records"
      ref="table"
      row-key="id"
      :expand-row-keys="expandrowkey"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      @expand-change="loadDaily"
      :empty-text="t('fields.noData')"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column type="expand">
        <template #default="scope">
          <!-- v-slot:[slotname]="data"> -->
          <el-table
            :data="scope.row.ruleItemData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column prop="date" :label="t('fields.date')" />
            <el-table-column
              prop="totalAmount"
              :label="t('fields.dailyTotalAmount')"
            >
              <template #default="scope1">
                $
                <span
                  v-formatter="{
                    data: scope1.row.totalAmount,
                    type: 'money',
                  }"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="totalCount"
              :label="t('fields.dailyTotalRedeem')"
            />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" v-if="false" prod="id" />
      <el-table-column
        prop="name"
        :label="t('fields.privilegeName')"
        width="400"
      />
      <el-table-column prop="site" :label="t('fields.siteName')" width="200" />
      <el-table-column
        prop="totalAmount"
        :label="t('fields.totalPrivilegeAmount')"
        width="200"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.totalAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalCount"
        :label="t('fields.totalRedeem')"
        width="120"
      >
        <template #default="scope">
          <router-link
            :to="
              `/report/privilege/privilegememberdetail?id=${scope.row.privilegeId}&site=${request.siteId}&date=${request.recordTime}`
            "
          >
            <el-link type="primary">
              {{ scope.row.totalCount }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="uiControl.display === 'DATA'"
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
    <el-dialog
      :title="t('fields.exportToExcel')"
      v-model="uiControl.messageVisible"
      append-to-body
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  getPrivilegeReport,
  getDailyReport,
  getTotalPrivilegeAmount,
  getPrivilegeReportExport,
  getPrivilegeReportAll,
} from '../../../api/report-privilege'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { hasPermission } from '../../../utils/util'
import Chart from '@/components/charts/Charts.vue'

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})

var expandrowkey = []

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  totalAmount: 0,
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: store.state.user.siteId,
})

const uiControl = reactive({
  display: 'DATA',
  messageVisible: false,
  chartLoading: false,
})

function getAmountChart(summaryList, chartOptions) {
  const dataset = [['Privilege', 'Amount']]
  const legendData = []
  if (summaryList.length > 0) {
    summaryList.forEach((item, index) => {
      const data = []
      data.push(item.name)
      data.push(Math.round(item.totalAmount * 100) / 100)
      dataset.push(data)
      legendData.push({ name: item.name })
    })
    chartOptions.dataset.source = dataset
    chartOptions.legend.data = legendData
    console.log('legend', legendData)
  }
}

function getCountChart(summaryList, chartOptions) {
  const dataset = [['Privilege', 'Count']]
  const legendData = []
  if (summaryList.length > 0) {
    summaryList.forEach((item, index) => {
      const data = []
      data.push(item.name)
      data.push(item.totalCount)

      dataset.push(data)
      legendData.push({ name: item.name })
    })
    chartOptions.dataset.source = dataset
    chartOptions.legend.data = legendData
  }
}

const amountPiechatOptions = reactive({
  title: {
    text: t('fields.privilegeAmountRatio'),
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    data: [],
    pageTextStyle: {
      fontSize: 22,
    },
    right: 10,
  },
  height: '380px',
  dataset: {
    source: [['Privilege', 'Amount']],
  },
  series: [
    {
      type: 'pie',
      top: '20px',
      emphasis: {
        focus: 'self',
        label: {
          show: true,
          formatter: '{b}: [' + t('fields.amount') + ': {@Amount}] ({d}%)',
        },
      },
      label: {
        show: false,
      },
      encode: {
        itemName: 'Privilege',
        value: 'Amount',
        tooltip: 'Amount',
      },
    },
  ],
})

const countPiechatOptions = reactive({
  title: {
    text: t('fields.privilegeCountRatio'),
  },
  height: '380px',
  dataset: {
    source: [['Privilege', 'Count']],
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    data: [],
    pageTextStyle: {
      fontSize: 22,
    },
    right: 10,
  },
  series: [
    {
      type: 'pie',
      top: '20px',
      emphasis: {
        focus: 'self',
        label: {
          show: true,
          formatter: '{b}: [' + t('fields.count') + ': {@Count}] ({d}%)',
        },
      },
      label: {
        show: false,
        formatter: '{b}: [' + t('fields.count') + ': {@Count}] ({d}%)',
      },
      encode: {
        itemName: 'Privilege',
        value: 'Count',
        tooltip: 'Count',
      },
    },
  ],
})

const shortcuts = getShortcuts(t)
async function loadDaily(row, expandedRows) {
  // 该处是用于判断是展开还是收起行，只有展开的时候做请求，避免多次请求！
  // 展开的时候expandedRows有值，收起的时候为空.
  console.log(row)
  if (expandedRows.length > 0) {
    const dailyquery = {}
    const requestCopy = { ...request }
    Object.entries(requestCopy).forEach(([key, value]) => {
      if (value) {
        dailyquery[key] = value
      }
    })
    if (request.recordTime !== null) {
      if (request.recordTime.length === 2) {
        dailyquery.recordTime = request.recordTime.join(',')
      }
    }

    dailyquery.name = row.name
    dailyquery.siteId = row.siteId

    const { data: ret } = await getDailyReport(dailyquery)
    page.records.forEach((temp, index) => {
      // 找到当前点击的行，把动态获取到的数据赋值进去
      console.log('temp : ', temp)
      if (temp.name === row.name) {
        page.records[index].ruleItemData = ret.records
        console.log(page.records)
      }
    })
  }
}

async function requestExportExcel() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await getPrivilegeReportExport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
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

function resetQuery() {
  request.name = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = siteList.list[0].id // site.value ? site.value.id : null
}

async function loadPrivilegeReport(first) {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }

  const { data: ret } = await getPrivilegeReport(query)

  if (first === true) {
    // 给每行数据强制追加一个数据项, 以便注入每日数据
    ret.records.map(item => {
      item.ruleItemData = []
    })
  }
  expandrowkey = [] // 收起所有展开项
  page.pages = ret.pages
  page.records = patchRecord(ret.records)
  if (page.records.length !== 0) {
    const { data: amount } = await getTotalPrivilegeAmount(query)
    page.totalAmount = amount
  } else {
    page.totalAmount = 0
  }
  page.loading = false
}

async function loadCharts() {
  uiControl.chartLoading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }

  const { data } = await getPrivilegeReportAll(query)
  getAmountChart(data, amountPiechatOptions)
  getCountChart(data, countPiechatOptions)

  uiControl.chartLoading = false
}

function patchRecord(records) {
  const couponStr = 'Coupon'
  if (records.length > 0) {
    records.forEach((item, index) => {
      if (item.alias !== null && !item.name.includes(couponStr)) {
        item.name = item.alias
      }
    })
  }
  return records
}

async function loadSites() {
  // const { data: site } = await getSiteListSimple()
  siteList.list = store.state.user.sites
}

function changePage(page) {
  request.current = page
  loadPrivilegeReport(false)
}

function getSummaries(param) {
  if (hasPermission(['sys:report:privilege:report:total'])) {
    const { columns } = param
    var sums = []

    columns.forEach((column, index) => {
      if (index === 1) {
        sums[index] = sums[index] =
          t('fields.totalPrivilegeClaimAmount') +
          '   $' +
          page.totalAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      }
    })

    console.log(sums)
    return sums
  } else {
    return '-'
  }
}

onMounted(async () => {
  await loadSites()

  request.siteId = store.state.user.siteId || siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadPrivilegeReport(true)
  await loadCharts()
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

.el-input-number:deep(.el-input__inner) {
  text-align: left;
}
</style>
