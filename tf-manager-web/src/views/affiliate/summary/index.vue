<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <div>
          <el-input
            v-model="request.loginName"
            style="width: 200px"
            size="small"
            maxlength="50"
            :placeholder="t('fields.loginName')"
          />
          <el-input
            v-model="request.affiliateCode"
            style="width: 200px; margin-left: 10px; margin-bottom: 10px;"
            size="small"
            maxlength="50"
            :placeholder="t('fields.affiliateCode')"
          />
          <el-select
            v-if="hasRole(['ADMIN'])"
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
          <el-date-picker
            v-model="request.recordTime"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 300px; margin-left: 10px"
            :shortcuts="shortcuts"
            :disabled-date="disabledDate"
            :editable="false"
            :clearable="false"
          />
        </div>
        <div style="margin-bottom: 10px;">
          <span style="font-size: small">
            {{ t('fields.minActiveMemberCount') }}
          </span>
          <el-input-number
            v-model="request.activeMember"
            style="width: 100px; margin-left: 10px"
            size="small"
            maxlength="5"
            :label="t('fields.activeMember')"
          />
          <el-button
            style="margin-left: 20px"
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="loadRecord()"
          >
            {{ t('fields.search') }}
          </el-button>
          <el-button size="mini" @click="resetQuery()">
            {{ t('fields.reset') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="page.records"
        v-loading="page.loading"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :empty-text="t('fields.noData')"
        highlight-current-row
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="left"
          width="120"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link
              :to="
                `/affiliate/details/${scope.row.affiliateId}?site=${request.siteId}`
              "
            >
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="depositAmount"
          :label="t('fields.depositAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.depositAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawAmount"
          :label="t('fields.withdrawAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="bonus"
          :label="t('fields.bonus')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bet"
          :label="t('fields.totalBet')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bet, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="adjustment"
          :label="t('fields.adjustment')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.adjustment, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="payout"
          :label="t('fields.totalPayout')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.payout, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="ngr" label="NGR" align="center" width="120">
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.ngr, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="ftdCount"
          :label="t('fields.ftd')"
          align="center"
          min-width="50"
        />
        <el-table-column
          prop="newMemberCount"
          :label="t('fields.newMemberCount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <el-link
              v-if="scope.row.newMemberCount !== 0"
              type="primary"
              @click="showDialog('MEMBER', scope.row.newMembers)"
            >
              {{ scope.row.newMemberCount }}
            </el-link>
            <span v-else>{{ scope.row.newMemberCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activeMemberCount"
          :label="t('fields.activeMemberCount')"
          align="center"
          width="120"
        />
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
    </el-card>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="1200px"
    >
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="memberPage.records"
        v-loading="memberPage.loading"
        row-key="id"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="left"
          min-width="100"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link
              :to="
                `/member/details/${scope.row.memberId}?site=${request.siteId}`
              "
            >
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="depositAmount"
          :label="t('fields.depositAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.depositAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawAmount"
          :label="t('fields.withdrawAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="bonus"
          :label="t('fields.bonus')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bet"
          :label="t('fields.totalBet')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bet, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="adjustment"
          :label="t('fields.adjustment')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.adjustment, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="payout"
          :label="t('fields.totalPayout')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.payout, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="regTime"
          :label="t('fields.registerTime')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.regTime,
                formatter: 'YYYY/MM/DD HH:mm:ss',
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
        :page-size="memberRequest.size"
        :page-count="memberPage.pages"
        :current-page="memberRequest.current"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { hasRole, hasPermission } from '../../../utils/util'
import moment from 'moment'
import {
  getAffiliateSummary,
  getAffiliateSummaryNewMember,
} from '../../../api/affiliate-record'
import { getSiteListSimple } from '../../../api/site'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { formatInputTimeZone } from '@/utils/format-timeZone'

const { t } = useI18n()
const siteList = reactive({
  list: [],
})

const newMembers = reactive({
  list: [],
})

const shortcuts = getShortcuts(t)
const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: '',
  dialogType: 'MEMBER',
})
const site = ref(null)
const startDate = new Date()
startDate.setTime(
  moment(startDate)
    .startOf('month')
    .format('x')
)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  affiliateCode: null,
  activeMember: 0,
})

const memberRequest = reactive({
  size: 10,
  current: 1,
})

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

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
  request.loginName = null
  request.affiliateCode = null
  request.activeMember = 0
  request.siteId = site.value ? site.value.id : siteList.list[0].id
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})

const memberPage = reactive({
  pages: 0,
  records: [],
  loading: false,
})

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
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

async function loadRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getAffiliateSummary(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

function showDialog(type, members) {
  if (type === 'MEMBER') {
    newMembers.list = members
    loadNewMember(newMembers.list)
    uiControl.dialogTitle = t('fields.newMember')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function loadNewMember(members) {
  memberPage.loading = true
  const requestCopy = { ...memberRequest }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  const timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
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
    } else {
      query.recordTime = formatInputTimeZone(
        request.recordTime[0],
        timeZone,
        'start'
      )
    }
  }

  if (members !== null) {
    if (members.length > 1) {
      query.memberId = members.join(',')
    } else {
      query.memberId = members[0]
    }
  }
  const { data: ret } = await getAffiliateSummaryNewMember(query)
  memberPage.pages = ret.pages
  memberPage.records = ret.records
  memberPage.loading = false
}

function changePage(page) {
  memberRequest.current = page
  loadNewMember(newMembers.list)
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
  display: inline-flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}
</style>
