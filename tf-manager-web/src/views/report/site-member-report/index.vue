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
          v-model="request.memberName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.memberName')"
        />

        <el-input
          v-model="request.affiliateName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.affiliateName')"
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
          @click="loadSiteMemberReport()"
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
          icon="el-icon-download"
          size="mini"
          type="primary"
          v-permission="['sys:report:site:member:report:export']"
          @click="exportExcel"
          style="float: right;"
        >
          {{ t('fields.exportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
      style="margin-top:20px;"
      height="450"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        width="200"
      />
      <el-table-column
        prop="regTime"
        :label="t('fields.registerTime')"
        width="200"
      />
      <el-table-column
        prop="balance"
        :label="t('fields.balance')"
        width="200"
      />
      <el-table-column
        prop="depositCount"
        :label="t('fields.depositCount')"
        width="200"
      />
      <el-table-column
        prop="depositAmount"
        :label="t('fields.depositAmount')"
        width="200"
      />
      <el-table-column
        prop="withdrawCount"
        :label="t('fields.withdrawCount')"
        width="200"
      />
      <el-table-column
        prop="withdrawAmount"
        :label="t('fields.withdrawAmount')"
        width="200"
      />
      <el-table-column
        prop="validBet"
        :label="t('fields.validBet')"
        width="200"
      />
      <el-table-column prop="adjust" :label="t('fields.adjust')" width="200" />
      <el-table-column prop="bonus" :label="t('fields.bonus')" width="200" />
      <el-table-column prop="profit" :label="t('fields.profit')" width="200" />
      <el-table-column
        prop="affiliate"
        :label="t('fields.affiliate')"
        width="200"
      />
      <el-table-column prop="way" :label="t('fields.way')" width="200" />
      <el-table-column prop="vip" :label="t('fields.vipLevel')" width="200" />
      <el-table-column
        prop="firstDeposit"
        :label="t('fields.firstDeposit')"
        width="200"
      />
      <el-table-column
        prop="lastLoginTime"
        :label="t('fields.lastLoginTime')"
        width="200"
      />
      <el-table-column
        prop="lastLoginIp"
        :label="t('fields.lastLoginIp')"
        width="200"
      />
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { getSiteMemberReport, getTotalSiteMemberReport } from '../../../api/report-centre'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import { hasPermission } from '../../../utils/util'

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const exportPercentage = ref(0)

const siteList = reactive({
  list: [],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const totalPage = reactive({
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  loginName: null,
  affiliateName: null,
  recordTime: [defaultStartDate, defaultEndDate],
})

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : 1
  request.loginName = null
  request.affiliateName = null
}

function changePage(page) {
  request.current = page
  loadSiteMemberReport()
}

async function loadSiteMemberReport() {
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
  const { data: ret } = await getSiteMemberReport(query)
  const { data: ret1 } = await getTotalSiteMemberReport(query)
  totalPage.records = ret1.records
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

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
    text: t('fields.lastMonth'),
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
  {
    text: t('fields.last6Months'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(5, 'months')
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(5, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

const EXPORT_HEADER = [
  t('fields.loginName'),
  t('fields.registerTime'),
  t('fields.balance'),
  t('fields.depositCount'),
  t('fields.depositAmount'),
  t('fields.withdrawCount'),
  t('fields.withdrawAmount'),
  t('fields.memberName'),
  t('fields.validBet'),
  t('fields.adjust'),
  t('fields.bonus'),
  t('fields.profit'),
  t('fields.affiliate'),
  t('fields.way'),
  t('fields.vipLevel'),
  t('fields.firstDeposit'),
  t('fields.lastLoginTime'),
  t('fields.lastLoginIp'),
]

async function exportExcel() {
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
  const { data: ret } = await getSiteMemberReport(query)
  const exportData = [EXPORT_HEADER]
  const maxLength = []

  pushRecordToData(ret.records, exportData)
  exportPercentage.value = Math.round((ret.current / (ret.pages + 1)) * 100)
  query.current = ret.current

  while (query.current < ret.pages) {
    query.current += 1
    const { data: ret } = await getSiteMemberReport(query)
    pushRecordToData(ret.records, exportData)
    exportPercentage.value = Math.round((ret.current / (ret.pages + 1)) * 100)
  }
  const ws = XLSX.utils.aoa_to_sheet(exportData)
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key]

      maxLength[key] =
        typeof value === 'number'
          ? maxLength[key] >= 10
            ? maxLength[key]
            : 10
          : maxLength[key] >= value.length + 2
            ? maxLength[key]
            : value.length + 2
    })
  })
  const wsCols = maxLength.map(w => {
    return { width: w }
  })
  ws['!cols'] = wsCols
  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Record')
  wb.Sheets.Record = ws
  XLSX.writeFile(wb, t('reportName.Summary_Member_Record') + '.xlsx')
  exportPercentage.value = 100

  page.loading = false
}

function pushRecordToData(records, exportData) {
  const data = records.map(record =>
    Object.values(record).map(item => (!item || item === '' ? '-' : item))
  )
  exportData.push(...data)
}

function getSummaries(param) {
  if (hasPermission(['sys:report:site:member:report:summary'])) {
    const { columns } = param
    var sums = []
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

    if (totalPage.records.length > 0) {
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = t('fields.total')
        } else {
          if (index !== 1 && index !== 11 && index !== 12 && index !== 13 && index !== 14 && index !== 15 && index !== 16 && index !== 2) {
            var prop = column.property;
            var money = "$";
            if (index === 3 || index === 5) {
              money = "";
            }
            sums[index] = money + totalPage.records[0][prop];
          }
        }
      })
    }
    console.log(sums)
    return sums
  } else {
    return '-'
  }
}

onMounted(async () => {
  await loadSites()

  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = 1
  }
  await loadSiteMemberReport()
})
</script>

<style>
.el-table .cell {
  word-break: break-word;
  text-overflow: none;
}
.warning-row {
  color: #ff0000;
}
</style>
