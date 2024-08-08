<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <span style="font-size: small;margin-top: 10px;margin-left:20px">
          {{ t('fields.loginName') }}
        </span>

        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;margin-left:20px"
          :placeholder="t('fields.loginName')"
        />

        <span style="font-size: small;margin-top: 10px;margin-left:20px;">
          {{ t('fields.site') }}
        </span>

        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px; margin-left:20px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>

        <span style="font-size: small;margin-top: 10px;margin-left:20px;">
          {{ t('fields.loginTime') }}
        </span>

        <el-date-picker
          v-model="request.loginTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left:20px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />

        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadUserLoginLog"
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
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="loginName" :label="t('fields.username')" />
      <el-table-column prop="siteName" :label="t('fields.siteName')">
        <template #default="scope">
          <span v-if="scope.row.siteName === null">-</span>
          <span v-if="scope.row.siteName !== null">
            {{ scope.row.siteName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="loginTime" :label="t('fields.loginTime')" />
      <el-table-column v-if="!isKorea(LOGIN_USER_SITEID)" prop="loginIp" :label="t('fields.loginIp')" />
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
  <el-dialog
    :title="t('fields.param')"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="580px"
  >
    <p>{{ t('fields.responseBody') }} : {{ uiControl.responseBody }}</p>
    <p>{{ t('fields.requestParam') }} : {{ uiControl.requestParam }}</p>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue'
import { getUserLoginLog } from '../../../api/user-login-log'
import { getSiteListSimple } from '../../../api/site'
import { useI18n } from 'vue-i18n'
import {
  getShortcuts,
  convertDateToStart,
  convertDateToEnd,
} from '@/utils/datetime'
import { useStore } from '@/store'
import { isKorea } from '@/utils/site'

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDateToStart(startDate)
const defaultEndDate = convertDateToEnd(new Date())
const store = useStore()
const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogLoading: false,
  requestParam: '',
  responseBody: '',
})
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const sites = reactive({
  list: [],
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  loginTime: [defaultStartDate, defaultEndDate],
  loginName: null,
})

const shortcuts = getShortcuts(t)

function resetQuery() {
  request.loginName = null
  request.loginTime = [
    convertDateToStart(new Date()),
    convertDateToEnd(new Date()),
  ]
  request.siteId = null
  loadUserLoginLog()
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadUserLoginLog() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.loginTime !== null) {
    if (request.loginTime.length === 2) {
      query.loginTime = request.loginTime.join(',')
    }
  }

  const { data: ret } = await getUserLoginLog(query)
  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  request.current = page
  loadUserLoginLog()
}

onMounted(() => {
  loadSites()
  loadUserLoginLog()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
