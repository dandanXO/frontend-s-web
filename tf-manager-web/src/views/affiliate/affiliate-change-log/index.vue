<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.targetType"
          size="small"
          :placeholder="t('fields.targetType')"
          class="filter-item"
          style="width: 200px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in uiControl.targetType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="request.createTime"
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
          @click="loadUserActionLog"
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
      <el-table-column prop="targetType" :label="t('fields.targetType')" />
      <el-table-column prop="targetId" :label="t('fields.targetId')" />
      <el-table-column prop="targetName" :label="t('fields.targetName')" />
      <el-table-column prop="siteName" :label="t('fields.siteName')" />
      <el-table-column prop="actionType" :label="t('fields.actionType')" />
      <el-table-column prop="field" :label="t('fields.field')" />
      <el-table-column prop="dataBefore" :label="t('fields.dataBefore')" />
      <el-table-column prop="dataAfter" :label="t('fields.dataAfter')" />
      <el-table-column prop="loginName" :label="t('fields.doneBy')" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" />
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
import { onMounted, reactive } from 'vue'
import { getUserActionLog } from '../../../api/user-action-log'
import { getSiteListSimple } from '../../../api/site'
import { useI18n } from 'vue-i18n'
import {
  getShortcuts,
  convertDateToStart,
  convertDateToEnd,
} from '@/utils/datetime'

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDateToStart(startDate)
const defaultEndDate = convertDateToEnd(new Date())

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogLoading: false,
  requestParam: '',
  responseBody: '',
  targetType: [
    {
      key: 'MEMBER',
      displayName: 'MEMBER',
      value: 'MEMBER',
    },
    {
      key: 'AFFILIATE',
      displayName: 'AFFILIATE',
      value: 'AFFILIATE',
    },
  ],
  actionType: [
    {
      key: 'CREATE',
      displayName: 'CREATE',
      value: 'CREATE',
    },
    {
      key: 'UPDATE',
      displayName: 'UPDATE',
      value: 'UPDATE',
    },
    {
      key: 'DELETE',
      displayName: 'DELETE',
      value: 'DELETE',
    },
  ],
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
  createTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  targetName: null,
  dataBefore: null,
  dataAfter: null,
  actionType: null,
})

const shortcuts = getShortcuts(t)

function resetQuery() {
  request.loginName = null
  request.createTime = [
    convertDateToStart(new Date()),
    convertDateToEnd(new Date()),
  ]
  request.siteId = null
  request.targetName = null
  request.dataBefore = null
  request.dataAfter = null
  request.actionType = null
  loadUserActionLog()
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadUserActionLog() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  //  query.targetType = 'AFFILIATE'
  query.field = 'parentAffiliateId'
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = request.createTime.join(',')
    }
  }

  const { data: ret } = await getUserActionLog(query)
  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  request.current = page
  loadUserActionLog()
}

onMounted(() => {
  loadSites()
  loadUserActionLog()
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
