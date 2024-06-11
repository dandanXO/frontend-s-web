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
          value-format="YYYY-MM-DD 00:00:00"
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
      >
        <el-table-column prop="downlineMember" :label="t('fields.downlineMember')" width="180">
          <template
            #default="scope"
            v-if="hasPermission(['sys:member-refer:summary'])"
          >
            <a v-if="scope.row.downlineMember > 0">
              <el-link type="primary" @click="reloadMembers(scope.row.loginName, scope.row.memberId)">{{ scope.row.downlineMember }}</el-link>
            </a>
            <span v-else>{{ scope.row.downlineMember }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="180"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link :to="`details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="ftdDownlineCount" :label="t('fields.ftdDownlineCount')" width="120" />
        <el-table-column prop="depositDownlineCount" :label="t('fields.depositDownlineCount')" width="120" />
        <el-table-column prop="regDownlineCount" :label="t('fields.regDownlineCount')" width="120" />
        <el-table-column
          prop="deposit"
          :label="t('fields.depositAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.deposit, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="withdraw"
          :label="t('fields.withdrawAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.withdraw, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="bet"
          :label="t('fields.betAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.bet, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="payout"
          :label="t('fields.payoutAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.payout, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="deposit"
          :label="t('fields.winloss')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.payout - scope.row.bet, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="balance"
          :label="t('fields.rebateAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.rebate, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="deposit"
          :label="t('fields.bonusAmount')"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.bonus, type: 'money'}"
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
  getMemberReferSummary
} from '../../../api/member-refer-event'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";
import { getShortcuts } from '@/utils/datetime'
import { formatInputTimeZone } from "@/utils/format-timeZone"
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
startDate.setTime(
  moment(startDate)
    .startOf('month')
    .format('x')
)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
let timeZone = null;

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  referrer: null,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  referrerId: null,
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD 00:00:00')
}

function resetQuery() {
  request.loginName = null
  request.memberRemark = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.referrerId = null
  uiControl.referrer = null
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
  timeZone = siteList.list.find(e => e.id === requestCopy.siteId).timeZone;
  if (query.recordTime !== null) {
    if (query.recordTime.length === 2) {
      query.summaryTime = joinRecordTime(query.recordTime)
      query.recordTime[0] = formatInputTimeZone(query.recordTime[0], timeZone);
      query.recordTime[1] = moment(query.recordTime[1]).format(
        'YYYY-MM-DD 23:59:59'
      )
      query.recordTime[1] = formatInputTimeZone(query.recordTime[1], timeZone);
      query.recordTime = joinRecordTime(query.recordTime)
    }
  }
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
  loadMembers()
}

async function loadMembers() {
  console.log("loadmembers")
  page.loading = true
  uiControl.searchDialogVisible = false
  const query = checkQuery()
  const result = await getMemberReferSummary(query)

  page.pages = result.data.pages
  page.records = result.data.records
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadMembers()
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
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
