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
          @click="loadSummaryRecord()"
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
          v-permission="['sys:report:summary:active:export']"
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
      :summary-method="getSummaries"
      show-summary
      height="500"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="date"
        :label="t('fields.date')"
        width="120"
        fixed
      >
        <template #default="scope">
          <router-link
            :to="
              `/report/summary/memberreport?date=${scope.row.date}&site=${request.siteId}`
            "
          >
            <el-link type="primary">
              {{ scope.row.date }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="registerCount"
        :label="t('fields.registerCount')"
        width="120"
      >
        <template #default="scope">
          <router-link
            :to="
              `/report/summary/registercount?date=${scope.row.date}&site=${request.siteId}`
            "
          >
            <el-link type="primary">
              {{ scope.row.registerCount }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="fdp" label="FDP" width="80">
        <template #default="scope">
          <router-link
            :to="
              `/report/summary/fdp?date=${scope.row.date}&site=${request.siteId}`
            "
          >
            <el-link type="primary">
              {{ scope.row.fdp }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="deposit" :label="t('fields.deposit')" width="120">
        <template #default="scope">
          <router-link
            :to="
              `/report/summary/deposit?date=${scope.row.date}&site=${request.siteId}`
            "
          >
            <el-link type="primary">
              $
              <span
                v-formatter="{
                  data: scope.row.deposit,
                  type: 'money',
                }"
              />
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="withdraw"
        :label="t('fields.withdraw')"
        width="120"
      >
        <template #default="scope">
          <router-link
            :to="
              `/report/summary/withdraw?date=${scope.row.date}&site=${request.siteId}`
            "
          >
            <el-link type="primary">
              $
              <span
                v-formatter="{
                  data: scope.row.withdraw,
                  type: 'money',
                }"
              />
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="active"
        :label="t('fields.activeUser')"
        width="100"
      >
        <template #default="scope">
          <router-link
            :to="
              `/report/summary/activeuser?date=${scope.row.date}&site=${request.siteId}`
            "
          >
            <el-link type="primary">
              {{ scope.row.active }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalBet"
        :label="t('fields.totalBet')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.totalBet,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPayout"
        :label="t('fields.totalPayout')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.totalPayout,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="transferIn"
        :label="t('fields.transferIn')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.transferIn,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="transferOut"
        :label="t('fields.transferOut')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.transferOut,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="promo" :label="t('fields.promo')" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.promo,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="adjustment"
        :label="t('fields.adjustment')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.adjustment,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="ngr" label="NGR" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.ngr,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
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
import { getSummaryReport } from '../../../api/report-summary'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import * as XLSX from 'xlsx'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'

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

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalAmount: 0,
})

const request = reactive({
  size: 30,
  current: 1,
  memberName: null,
  privilegeName: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
})

const exportPercentage = ref(0)

const EXPORT_HEADER = [
  'Date',
  'Register Count',
  'FDP',
  'Deposit',
  'Withdraw',
  'Active User',
  'Total Bet',
  'Total Payout',
  'Transfer In',
  'Transfer Out',
  'Promo',
  'Adjustment',
  'NGR',
]

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
]

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.memberName = null
  request.privilegeName = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : null
}

async function loadSummaryRecord() {
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

  const { data: ret } = await getSummaryReport(query)

  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total

  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadSummaryRecord()
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
  await loadSummaryRecord()
})

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
  const { data: ret } = await getSummaryReport(query)
  const exportData = [EXPORT_HEADER]
  const maxLength = []

  pushRecordToData(ret.records, exportData)
  exportPercentage.value = Math.round((ret.current / (ret.pages + 1)) * 100)
  query.current = ret.current

  while (query.current < ret.pages) {
    query.current += 1
    const { data: ret } = await getSummaryReport(query)
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
  wb.SheetNames.push('Deposit_Record')
  wb.Sheets.Deposit_Record = ws
  XLSX.writeFile(wb, 'deposit_record.xlsx')
  exportPercentage.value = 100

  page.loading = false
}

function pushRecordToData(records, exportData) {
  records.forEach(item => {
    delete item.memberId
    delete item.privilegesName
  })
  const data = records.map(record =>
    Object.values(record).map(item => (!item || item === '' ? '-' : item))
  )
  exportData.push(...data)
}

function getSummaries(param) {
  if (hasPermission(['sys:report:summary:total'])) {
    const { columns, data } = param
    var sums = []
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = 'Total'
        return
      }
      const values = data.map(item => Number(item[column.property]))

      if (
        !values.every(value => Number.isNaN(value)) &&
        index !== 1 &&
        index !== 5 &&
        index !== 2
      ) {
        sums[index] = `$ ${values
          .reduce((prev, curr) => {
            const value = Number(curr)
            if (!Number.isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          .toFixed(2)}`
      } else if (
        !values.every(value => Number.isNaN(value)) &&
        (index === 1 || index === 5 || index === 2)
      ) {
        sums[index] = `${values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
      }
    })

    return sums
  } else {
    return '-'
  }
}
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
