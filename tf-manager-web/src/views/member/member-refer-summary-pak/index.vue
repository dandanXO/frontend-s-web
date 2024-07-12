<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;"
          :placeholder="t('fields.loginName')"
        />
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          class="input-small"
          style="margin-left: 5px;"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
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
          @click="search()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.referrerList') }}</span>
          <el-row />
          <span v-if="uiControl.referrer"> {{ t('fields.referrer') }} : {{ uiControl.referrer }}</span>
          <el-row />
          <el-button v-if="uiControl.referrer" size="mini" type="primary" icon="el-icon-back" @click="goBackToPrevious()">
            {{ t('fields.back') }}
          </el-button>
        </div>
      </template>
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :empty-text="t('fields.noData')"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="subRegCount" :label="t('fields.subRegCount')" width="180">
          <template
            #default="scope"
            v-if="hasPermission(['sys:member-refer:summary'])"
          >
            <el-link type="primary" @click="reloadMembers(scope.row.loginName, scope.row.id)">{{ scope.row.subRegCount }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="subDepositCount" :label="t('fields.subDepositCount')" width="120" />
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="180"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link :to="`details/${scope.row.id}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="downlineFtdCount" :label="t('fields.ftdDownlineCount')" width="120" />
        <el-table-column
          prop="downlineFtdAmount"
          :label="t('fields.ftdDownlineAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: Math.floor(scope.row.downlineFtdAmount), type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="downlineDepositCount" :label="t('fields.depositDownlineCount')" width="120" />
        <el-table-column
          prop="downlineDepositAmount"
          :label="t('fields.depositAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: Math.floor(scope.row.downlineDepositAmount), type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="downlineWithdrawAmount"
          :label="t('fields.withdrawAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: Math.floor(scope.row.downlineWithdrawAmount), type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="downlineBetAmount"
          :label="t('fields.betAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: Math.floor(scope.row.downlineBetAmount), type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="downlinePayoutAmount"
          :label="t('fields.payoutAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: Math.floor(scope.row.downlinePayoutAmount), type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="winloss"
          :label="t('fields.winloss')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: Math.floor(scope.row.downlinePayoutAmount - scope.row.downlineBetAmount), type: 'money'}"
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
    </el-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import {
  getPakMemberReferSummary
} from '../../../api/member-refer-event'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";
import { getShortcuts } from '@/utils/datetime'
import moment from "moment/moment";

const router = useRouter()
const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const table = ref(null)
const siteList = reactive({
  list: [],
})
const shortcuts = getShortcuts(t)
const startDate = new Date()
// startDate.setTime(
//   moment(startDate)
//     .startOf('month')
//     .format('x')
// )
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  referrer: null,
  referrerPath: [],
  referrerIdPath: [],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  sums: null,
})

const request = reactive({
  size: 10,
  current: 1,
  loginName: null,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  referrerId: null,
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function resetQuery() {
  request.loginName = null
  request.memberRemark = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.referrerId = null
  uiControl.referrer = null
  uiControl.referrerPath = []
  uiControl.referrerIdPath = []
}

function goBackToPrevious() {
  if (uiControl.referrerPath.length > 1) {
    uiControl.referrerPath.pop()
    uiControl.referrerIdPath.pop()
    request.referrerId = uiControl.referrerIdPath[uiControl.referrerIdPath.length - 1]
    uiControl.referrer = uiControl.referrerPath[uiControl.referrerPath.length - 1]
    loadMembers()
  } else {
    resetQuery()
    loadMembers()
  }
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (key === 'recordTime') {
      query[key] = [...requestCopy.recordTime]
    } else {
      if (value) {
        query[key] = value
      }
    }
  })
  query.recordTime = joinRecordTime(query.recordTime)
  return query
}

function joinRecordTime(recordTime) {
  const string = JSON.parse(JSON.stringify(recordTime))
  return string.join(',')
}

function search() {
  uiControl.referrer = null
  request.referrerId = null
  loadMembers()
}

async function reloadMembers(loginName, uplineId) {
  request.referrerId = uplineId
  request.loginName = null
  uiControl.referrer = loginName
  uiControl.referrerPath.push(loginName)
  uiControl.referrerIdPath.push(uplineId)
  loadMembers()
}

async function loadMembers() {
  page.loading = true
  uiControl.searchDialogVisible = false
  const query = checkQuery()
  const result = await getPakMemberReferSummary(query)

  page.pages = result.data.pages
  page.records = result.data.records
  page.sums = result.data.sums
  page.loading = false
}

function getSummaries(val) {
  const { columns } = val;
  const sums = [];
  var sumKeys = []
  for (var key in page.sums) {
    sumKeys.push(key)
  }
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = 'Total';
    } else if (sumKeys.includes(column.property)) {
      sums[index] = Math.floor(page.sums[column.property]);
    } else if (index === 10) {
      sums[index] = Math.floor(sums[9] - sums[8]);
    }
  });
  return sums;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadMembers()
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site.filter(e => e.id === 11)
}

onMounted(async () => {
  await loadSites()
  if (router.currentRoute.value.query.id) {
    request.siteId = Number(router.currentRoute.value.query.site)
    request.referrerId = router.currentRoute.value.query.id
    uiControl.referrer = router.currentRoute.value.query.referrer
    request.recordTime = router.currentRoute.value.query.recordTime.split(',')
  } else {
    request.siteId = siteList.list[0].id
    if (LOGIN_USER_TYPE.value === TENANT.value) {
      site.value = siteList.list.find(
        s => s.siteName === store.state.user.siteName
      )
      request.siteId = site.value.id
    }
  }
  await loadMembers();
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.level-color {
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
