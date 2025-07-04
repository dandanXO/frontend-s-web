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
      <el-table-column :label="t('fields.depositRetention')">
        <el-table-column prop="depositDay1" :label="t('fields.retentionDay1')" width="120" />
        <el-table-column prop="depositDay2" :label="t('fields.retentionDay2')" width="120" />
        <el-table-column prop="depositDay3" :label="t('fields.retentionDay3')" width="120" />
        <el-table-column prop="depositDay4" :label="t('fields.retentionDay4')" width="120" />
        <el-table-column prop="depositDay5" :label="t('fields.retentionDay5')" width="120" />
        <el-table-column prop="depositDay6" :label="t('fields.retentionDay6')" width="120" />
        <el-table-column prop="depositDay7" :label="t('fields.retentionDay7')" width="120" />
        <el-table-column prop="depositDay14" :label="t('fields.retentionDay14')" width="120" />
        <el-table-column prop="depositDay30" :label="t('fields.retentionDay30')" width="120" />
      </el-table-column>
      <el-table-column :label="t('fields.regLoginRetention')">
        <el-table-column prop="loginDay1" :label="t('fields.retentionDay1')" width="120" />
        <el-table-column prop="loginDay2" :label="t('fields.retentionDay2')" width="120" />
        <el-table-column prop="loginDay3" :label="t('fields.retentionDay3')" width="120" />
        <el-table-column prop="loginDay4" :label="t('fields.retentionDay4')" width="120" />
        <el-table-column prop="loginDay5" :label="t('fields.retentionDay5')" width="120" />
        <el-table-column prop="loginDay6" :label="t('fields.retentionDay6')" width="120" />
        <el-table-column prop="loginDay7" :label="t('fields.retentionDay7')" width="120" />
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
import { getSiteRetentionReport } from '@/api/report-centre'
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
  const { data: ret } = await getSiteRetentionReport(query)
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
