<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-button
          style="margin-left: 20px"
          icon="el-icon-back"
          size="mini"
          type="success"
          @click="back()"
        >
          {{ t('fields.back') }}
        </el-button>

        <el-button
          style="margin-left: 20px"
          icon="el-icon-refresh"
          size="mini"
          type="success"
          @click="refresh()"
        />

        <el-button
          icon="el-icon-download"
          size="mini"
          type="primary"
          v-permission="['sys:report:summary:member:export']"
          @click="exportExcel"
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
    >
      <el-table-column
        prop="member"
        :label="t('fields.member')"
        width="120"
        fixed
      />
      <el-table-column
        prop="source"
        :label="t('fields.sourceType')"
        width="120"
      />
      <el-table-column prop="deposit" :label="t('fields.deposit')" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.deposit,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="depositCount"
        :label="t('fields.depositCount')"
        width="120"
      />
      <el-table-column
        prop="withdraw"
        :label="t('fields.withdraw')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.withdraw,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawCount"
        :label="t('fields.withdrawCount')"
        width="130"
      />
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

      <el-table-column prop="profit" :label="t('fields.profit')" width="120">
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

      <el-table-column prop="review" :label="t('fields.review')" width="120" />

      <el-table-column
        prop="reviewby"
        :label="t('fields.reviewby')"
        width="120"
      />

      <el-table-column prop="remark" :label="t('fields.remark')" width="120" />
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
import { getSummaryMemberReport } from '../../../../api/report-summary'
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import * as XLSX from 'xlsx'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

var date = new URL(location.href).searchParams.get('date')
var siteIdFromParam = new URL(location.href).searchParams.get('site')

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
})

const request = reactive({
  size: 30,
  current: 1,
  recordTime: date,
  siteId: null,
})

const exportPercentage = ref(0)

const EXPORT_HEADER = [
  'Member',
  'Source Type',
  'Deposit',
  'Deposit Count',
  'Withdraw',
  'Withdraw Count',
  'Total Bet',
  'Total Payout',
  'Transfer In',
  'Transfer Out',
  'Promo',
  'Adjustment',
  'Profit',
  'Review',
  'Review By',
  'Remark',
]

async function loadMemberRecord() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  const { data: ret } = await getSummaryMemberReport(query)

  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  request.current = page
  loadMemberRecord()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function back() {
  window.location.href = '/report/summaryreport'
}

onMounted(async () => {
  await loadSites()
  // tenant 只可以看到本身site的资料
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = siteIdFromParam
  }

  await loadMemberRecord()
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

  const { data: ret } = await getSummaryMemberReport(query)
  const exportData = [EXPORT_HEADER]
  const maxLength = []

  pushRecordToData(ret.records, exportData)
  exportPercentage.value = Math.round((ret.current / (ret.pages + 1)) * 100)
  query.current = ret.current

  while (query.current < ret.pages) {
    query.current += 1
    const { data: ret } = await getSummaryMemberReport(query)
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
  wb.SheetNames.push('Member_Daily_Report')
  wb.Sheets.Deposit_Record = ws
  XLSX.writeFile(wb, 'member_daily_report.xlsx')
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
