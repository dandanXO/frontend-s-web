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
      height="500"
      :empty-text="t('fields.noData')"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column prop="date" :label="t('fields.date')" width="120" fixed>
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
      <el-table-column prop="fdp" :label="t('fields.ftdCount')" width="80">
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
      <el-table-column
        prop="convertRate"
        :label="t('fields.convertRate')"
        width="80"
      >
        <template #default="scope">{{ scope.row.convertRate }}%</template>
      </el-table-column>
      <el-table-column
        prop="fdAmount"
        :label="t('fields.ftdAmount')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.fdAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="fdAverage"
        :label="t('fields.ftdAverage')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.fdAverage,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="depositAmount"
        :label="t('fields.depositAmount')"
        width="120"
      >
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
                  data: scope.row.depositAmount,
                  type: 'money',
                }"
              />
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="depositCount"
        :label="t('fields.depositCount')"
        width="120"
      />
      <el-table-column
        prop="withdrawAmount"
        :label="t('fields.withdrawAmount')"
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
                  data: scope.row.withdrawAmount,
                  type: 'money',
                }"
              />
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawCount"
        :label="t('fields.withdrawCount')"
        width="120"
      />
      <el-table-column prop="dif" :label="t('fields.dif')" width="100">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.dif,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="betCount"
        :label="t('fields.summaryTotalBet')"
        width="120"
      />
      <el-table-column
        prop="validBet"
        :label="t('fields.validBet')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.validBet,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="adjustment"
        :label="t('fields.summaryAdjustment')"
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
      <el-table-column
        prop="bonus"
        :label="t('fields.summaryBonus')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.bonus,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="profit"
        :label="t('fields.summaryProfit')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.profit,
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
import { getSummaryReport, getTotalSummaryReport } from '../../../api/report-summary'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import * as XLSX from 'xlsx'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
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

const totalPage = reactive({
  records: []
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
  t('fields.date'),
  t('fields.registerCount'),
  t('fields.ftdCount'),
  t('fields.convertRate'),
  t('fields.ftdAmount'),
  t('fields.ftdAverage'),
  t('fields.depositCount'),
  t('fields.withdrawCount'),
  t('fields.depositAmount'),
  t('fields.withdrawAmount'),
  t('fields.dif'),
  t('fields.summaryTotalBet'),
  t('fields.validBet'),
  t('fields.summaryAdjustment'),
  t('fields.summaryBonus'),
  t('fields.summaryProfit'),
]

const shortcuts = getShortcuts(t)
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
  const { data: ret1 } = await getTotalSummaryReport(query)
  totalPage.records = ret1.records
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

function getSummaries(param) {
  if (hasPermission(['sys:report:withdraw:total'])) {
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
        } else if (index === 3) {
        } else {
          var prop = column.property;
          var money = "$";
          if (index === 1 || index !== 2 || index !== 7 || index !== 9 || index !== 11) {
            money = "";
          }
          sums[index] = money + totalPage.records[0][prop];
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
  wb.SheetNames.push('Record')
  wb.Sheets.Record = ws
  XLSX.writeFile(wb, t('reportName.Summary_Record') + '.xlsx')
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
