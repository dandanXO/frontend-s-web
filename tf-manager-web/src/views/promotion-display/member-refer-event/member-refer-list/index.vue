<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
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
        <el-input
          v-model="request.referrerName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.referrer')"
        />
        <el-input
          v-model="request.loginName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.memberName')"
        />
        <el-select
          v-model="request.eligibleStatus"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            :label="t('memberReferStatus.FAILED')"
            value="FAILED"
          />
          <el-option
            :label="t('memberReferStatus.SUCCESS')"
            value="SUCCESS"
          />
          <el-option
            :label="t('memberReferStatus.PENDING')"
            value="PENDING"
          />
        </el-select>
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in sites.list"
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
          @click="loadRecord"
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
      size="small"
      :data="page.records"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="referrerName"
        :label="t('fields.referrer')"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            :to="`/member/details/${scope.row.referrerId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.referrerName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="loginName"
        :label="t('fields.memberName')"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="eligibleStatus"
        :label="t('fields.status')"
      >
        <template #default="scope">
          <span>
            {{ t(`memberReferStatus.${scope.row.eligibleStatus}`) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="errorMessage"
        :label="t('fields.failReason')"
      >
        <template #default="scope">
          <div v-if="scope.row.eligibleStatus==='FAILED'">
            <span v-for="(item, index) in scope.row.failReasonList" :key="item">
              {{ t(`memberReferFailReason.${item}`) }}{{ index+1 === scope.row.failReasonList.length ? "" : "; " }}
            </span>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="recordTime"
        :label="t('fields.recordTime')"
      >
        <template #default="scope">
          <span v-if="scope.row.recordTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.recordTime !== null"
            v-formatter="{
              data: scope.row.recordTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadRecord"
      @size-change="loadRecord"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import moment from 'moment'
import { getMemberReferRecord } from '../../../../api/member-refer-event'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../../utils/util'
import { convertDateToEnd, convertDateToStart, getShortcuts } from '@/utils/datetime'
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'

const { t } = useI18n()
const shortcuts = getShortcuts(t)

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDateToStart(startDate)
const defaultEndDate = convertDateToEnd(new Date())
const site = ref(null)
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
let timeZone = null

const sites = reactive({
  list: [],
})

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  loginName: null,
  referrerName: null,
  eligibleStatus: null,
})

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
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : sites.list[0].id
  request.loginName = null
  request.referrerName = null
  request.eligibleStatus = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = sites.list.find(e => e.id === request.siteId).timeZone
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime))
      query.recordTime[0] = formatInputTimeZone(
        query.recordTime[0],
        timeZone,
        'start'
      )
      query.recordTime[1] = formatInputTimeZone(
        query.recordTime[1],
        timeZone,
        'end'
      )
      query.recordTime = query.recordTime.join(',')
    }
  }

  return query
}

function formatInputTimeZone(time, timezone, type = '') {
  if (!timezone) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
  }

  var oriTimeZone = moment(time).add(8, 'hour');
  var hourDifferent = timezone.substring(1);

  var formattedTimeZone = timezone.charAt(0) === '+'
    ? moment(oriTimeZone).subtract(hourDifferent, 'hours')
    : moment(oriTimeZone).add(hourDifferent, 'hours');

  return moment(formattedTimeZone).format('YYYY-MM-DD HH:mm:ss');
}

async function loadRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getMemberReferRecord(query)
  page.pages = ret.pages
  page.records = ret.records
  if (page.records !== null) {
    for (var i = 0; i < page.records.length; i++) {
      page.records[i].failReasonList = ["-"]
      if (page.records[i].errorMessage !== null && page.records[i].errorMessage.includes(",")) {
        page.records[i].failReasonList = page.records[i].errorMessage.split(",")
      } else {
        page.records[i].failReasonList[0] = page.records[i].errorMessage;
      }
    }
  }
  page.total = ret.total
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

onMounted(async () => {
  await loadSites()
  request.siteId = sites.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName)
    request.siteId = site.value.id
  }
  await loadRecord()
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}
</style>
