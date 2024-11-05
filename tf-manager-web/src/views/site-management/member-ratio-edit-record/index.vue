<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
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
          :placeholder="t('fields.loginName')"
        />

        <el-date-picker
          v-model="request.updateTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
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
          @click="loadEditRecord"
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
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        min-width="100"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            v-if="scope.row.memberType === 'AFFILIATE'"
            :to="
              `/affiliate/details/${scope.row.memberId}?site=${request.siteId}`
            "
          >
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
          <router-link
            v-else
            :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="beforeRatio" :label="t('fields.dataBefore')" />
      <el-table-column prop="afterRatio" :label="t('fields.dataAfter')" />
      <el-table-column prop="gameType" :label="t('fields.gameType')">
        <template #default="scope">
          <span> {{ t(`gameType.${scope.row.gameType}`) }}</span>
        </template>
      </el-table-column>>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" />
      <el-table-column
        prop="updateTime"
        :label="t('fields.updateTime')"
        align="center"
        min-width="150"
      >
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              timeZone: timeZone,
              type: 'date',
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
import { getEditRecord } from '../../../api/member-ratio-edit-record'
import { getSiteListSimple } from '../../../api/site'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import {
  getShortcuts,
} from '@/utils/datetime'
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { hasPermission } from '../../../utils/util'
import moment from 'moment'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
let timeZone = null

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const siteList = reactive({
  list: [],
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  updateTime: [defaultStartDate, defaultEndDate],
  loginName: null,
})

const shortcuts = getShortcuts(t)

function resetQuery() {
  request.loginName = null
  request.updateTime = [defaultStartDate, defaultEndDate]
  request.siteId = siteList.list[0].id
  loadEditRecord()
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  siteList.list = ret
}

async function loadEditRecord() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  if (request.updateTime !== null) {
    if (request.updateTime.length === 2) {
      query.updateTime = JSON.parse(JSON.stringify(request.updateTime))
      query.updateTime[0] = formatInputTimeZone(query.updateTime[0], timeZone, 'start')
      query.updateTime[1] = formatInputTimeZone(query.updateTime[1], timeZone, 'end')
      query.updateTime = query.updateTime.join(',')
    }
  }

  const { data: ret } = await getEditRecord(query)
  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  request.current = page
  loadEditRecord()
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadEditRecord()
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
