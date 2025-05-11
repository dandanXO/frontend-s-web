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
          v-model="request.loginName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.affiliateName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadReport()"
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

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
      style="margin-top:20px;"
      :row-style="{width: '100px'}"
    >
      <el-table-column prop="recordTime" :label="t('fields.recordTime')" width="120" />
      <el-table-column prop="loginName" :label="t('fields.affiliateName')" width="120" />
      <el-table-column :label="t('fields.ftdAmountAndMemberCount')" width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.ftdAmount, type: 'money'}" /> / {{ scope.row.ftdMemberCount }}
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.depositAmountAndMemberCount')" width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.depositAmount, type: 'money'}" /> / {{ scope.row.depositMemberCount }}
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.withdrawAmountAndMemberCount')" width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.withdrawAmount, type: 'money'}" /> / {{ scope.row.withdrawMemberCount }}
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.reloadAmountAndMemberCount')" width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.reloadAmount, type: 'money'}" /> / {{ scope.row.reloadMemberCount }}
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.reloadRate')" min-width="120">
        <template #default="scope">
          {{ (scope.row.reloadRate * 100).toFixed(2) }} %
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention2d')" width="150">
        <template #default="scope">
          {{ scope.row.retention2d }} ({{ (scope.row.retention2dRate * 100).toFixed(2) }} %)
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention3d')" width="150">
        <template #default="scope">
          {{ scope.row.retention3d }} ({{ (scope.row.retention3dRate * 100).toFixed(2) }} %)
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention4d')" width="150">
        <template #default="scope">
          {{ scope.row.retention4d }} ({{ (scope.row.retention4dRate * 100).toFixed(2) }} %)
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention5d')" width="150">
        <template #default="scope">
          {{ scope.row.retention5d }} ({{ (scope.row.retention5dRate * 100).toFixed(2) }} %)
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention6d')" width="150">
        <template #default="scope">
          {{ scope.row.retention6d }} ({{ (scope.row.retention6dRate * 100).toFixed(2) }} %)
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention7d')" width="150">
        <template #default="scope">
          {{ scope.row.retention7d }} ({{ (scope.row.retention7dRate * 100).toFixed(2) }} %)
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention10d')" width="150">
        <template #default="scope">
          {{ scope.row.retention10d }} ({{ (scope.row.retention10dRate * 100).toFixed(2) }} %)
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention14d')" width="150">
        <template #default="scope">
          {{ scope.row.retention14d }} ({{ (scope.row.retention14dRate * 100).toFixed(2) }} %)
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.retention30d')" width="150">
        <template #default="scope">
          {{ scope.row.retention30d }} ({{ (scope.row.retention30dRate * 100).toFixed(2) }} %)
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
import { getAffiliateRetentionReport } from '@/api/report-centre'
import { getSiteListSimple } from '@/api/site'
import { useStore } from '@/store'
import { TENANT } from '@/store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'

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
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  loginName: null,
  recordTime: [defaultStartDate, defaultEndDate],
})

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const shortcuts = getShortcuts(t)
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
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = store.state.user.siteId
  request.loginName = null
}

function changePage(page) {
  request.current = page
  loadReport()
}

async function loadReport() {
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
  const { data: ret } = await getAffiliateRetentionReport(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadReport()
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
