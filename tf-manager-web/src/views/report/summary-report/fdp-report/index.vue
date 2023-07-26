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
          v-permission="['sys:report:summary:active:export']"
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
      <el-table-column prop="member" :label="t('fields.member')" width="120" fixed />
      <el-table-column prop="source" :label="t('fields.sourceType')" width="120" />
      <el-table-column prop="registerTime" :label="t('fields.registerTime')" width="150" />
      <el-table-column prop="ftdTime" :label="t('fields.ftdTime')" width="150" />
      <el-table-column prop="ftdAmount" :label="t('fields.ftdAmount')" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.ftdAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="ftdTxn" :label="t('fields.ftdTxn')" width="220" />
      <el-table-column
        prop="paymentMethod"
        :label="t('fields.paymentMethod')"
        width="150"
      />
      <el-table-column prop="paymentName" :label="t('fields.paymentName')" width="180" />
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
import { getSummaryFdpReport } from '../../../../api/report-summary'
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import * as XLSX from 'xlsx'
import { useI18n } from "vue-i18n";

// eslint-disable-next-line
const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})
var date = new URL(location.href).searchParams.get('date')
var siteIdFromParam = new URL(location.href).searchParams.get('site')

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
  t('fields.member'),
  t('fields.sourceType'),
  t('fields.registerTime'),
  t('fields.ftdTime'),
  t('fields.ftdAmount'),
  t('fields.ftdTxn'),
  t('fields.paymentMethod'),
  t('fields.paymentName'),
]

async function loadSummaryFdpRecord() {
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

  const { data: ret } = await getSummaryFdpReport(query)

  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  request.current = page
  loadSummaryFdpRecord()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function back() {
  window.location.href = '/report/summaryreport'
}

function refresh() {
  loadSummaryFdpRecord()
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

  await loadSummaryFdpRecord()
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
  const { data: ret } = await getSummaryFdpReport(query)
  const exportData = [EXPORT_HEADER]
  const maxLength = []

  pushRecordToData(ret.records, exportData)
  exportPercentage.value = Math.round((ret.current / (ret.pages + 1)) * 100)
  query.current = ret.current

  while (query.current < ret.pages) {
    query.current += 1
    const { data: ret } = await getSummaryFdpReport(query)
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
  XLSX.writeFile(wb, t('reportName.Summary_Fdp_Record') + '.xlsx')
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
</style>
