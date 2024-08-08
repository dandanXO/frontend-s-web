<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.targetName"
          size="small"
          style="width: 200px; margin-left:10px"
          :placeholder="t('fields.targetName')"
        />

        <el-input
          v-model="request.dataBefore"
          size="small"
          style="width: 200px; margin-left:10px"
          :placeholder="t('fields.dataBefore')"
        />

        <el-input
          v-model="request.dataAfter"
          size="small"
          style="width: 200px; margin-left:10px"
          :placeholder="t('fields.dataAfter')"
        />

        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px; margin-left:10px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>

        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left:10px"
          :placeholder="t('fields.doneBy')"
        />

        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left:10px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />

        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAffiliateActionLog"
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
      <el-table-column prop="targetId" :label="t('fields.targetId')" />
      <el-table-column prop="targetName" :label="t('fields.targetName')" />
      <el-table-column prop="siteName" :label="t('fields.siteName')" />
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
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getAffiliateActionLog } from '../../../api/user-action-log'
import { getSiteListSimple } from '../../../api/site'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import {
  getShortcuts,
  convertDateToStart,
  convertDateToEnd,
} from '@/utils/datetime'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDateToStart(startDate)
const defaultEndDate = convertDateToEnd(new Date())

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const siteList = reactive({
  list: []
});
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  createTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  targetName: null,
  dataBefore: null,
  dataAfter: null,
})

const shortcuts = getShortcuts(t)

function resetQuery() {
  request.loginName = null
  request.createTime = [
    convertDateToStart(new Date()),
    convertDateToEnd(new Date()),
  ]
  request.siteId = siteList.list[0].id
  request.targetName = null
  request.dataBefore = null
  request.dataAfter = null
  loadAffiliateActionLog()
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  siteList.list = ret
}

async function loadAffiliateActionLog() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
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

  const { data: ret } = await getAffiliateActionLog(query)
  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  request.current = page
  loadAffiliateActionLog()
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadAffiliateActionLog()
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
