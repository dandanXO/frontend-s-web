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
          style="width: 300px; margin-left: 20px;"
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
          @click="loadSummaryRecord()"
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

        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:report:summary:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      height="75vh"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column prop="date" :label="t('fields.date')" width="120" fixed>
        <template #default="scope">
          <!-- <el-link type="primary" @click="loadMemberDialog(scope.row.date)"> -->
          {{ scope.row.date }}
          <!-- </el-link> -->
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
          <!-- eslint-disable -->
          <span
            v-formatter="{ data: scope.row.depositAmount, type: 'money' }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="usdtDepositAmount"
        :label="t('fields.usdtDepositAmount')"
        align="center"
        width="120"
      >
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span
            v-formatter="{ data: scope.row.usdtDepositAmount, type: 'money' }"
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
          <!-- eslint-disable -->
          <span
            v-formatter="{ data: scope.row.withdrawAmount, type: 'money' }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawCount"
        :label="t('fields.withdrawCount')"
        align="center"
        width="120"
      />
      <el-table-column
        :label="t('fields.depositWithdrawalProfit')"
        align="center"
        width="120"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{
              data: scope.row.depositAmount - scope.row.withdrawAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="registerCount"
        :label="t('fields.registerCount')"
        align="center"
        width="180"
      />
      <el-table-column
        prop="fdp"
        :label="t('fields.ftdCount')"
        align="center"
        width="120"
      />
      <el-table-column
        prop="fdAmount"
        :label="t('fields.ftdAmount')"
        align="center"
        width="150"
      >
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span v-formatter="{ data: scope.row.fdAmount, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="validBet"
        :label="t('fields.betAmount')"
        align="center"
        width="150"
      >
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span v-formatter="{ data: scope.row.validBet, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="payout"
        :label="t('fields.payoutAmount')"
        align="center"
        width="150"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{
              data: scope.row.validBet - scope.row.companyWinLoss,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="companyWinLoss"
        :label="t('fields.profit')"
        align="center"
        width="120"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{ data: scope.row.companyWinLoss, type: 'money' }"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="depositAmount"
        :label="t('fields.totalMemberDepositAmount')"
        align="center"
        width="180"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{
              data: scope.row.totalMemberDepositAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        prop="depositCount"
        :label="t('fields.totalDepositCount')"
        align="center"
        width="120"
      />
      <el-table-column
        prop="totalDepositNumber"
        :label="t('fields.totalDepositMemberCount')"
        align="center"
        width="120"
      />
      <el-table-column
        prop="usdtDepositCount"
        :label="t('fields.usdtDepositCount')"
        align="center"
        width="120"
      />
      <el-table-column
        prop="betCount"
        :label="t('fields.totalBetMemberCount')"
        align="center"
        width="120"
      />
      <el-table-column
        prop="bonus"
        :label="t('fields.bonusAmount')"
        align="center"
        width="120"
      >
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span v-formatter="{ data: scope.row.bonus, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="rebateAmount"
        :label="t('fields.rebateAmount')"
        align="center"
        width="120"
      >
        <template #default="scope">
          $
          <span v-formatter="{ data: scope.row.rebateAmount, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="adjustment"
        :label="t('fields.adjustAmount')"
        align="center"
        width="120"
      >
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span v-formatter="{ data: scope.row.adjustment, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="profit"
        :label="t('fields.netProfit')"
        align="center"
        width="120"
      >
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span v-formatter="{ data: scope.row.profit, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="oldMemberDepositAmount"
        :label="t('fields.oldMemberDepositAmount')"
        width="120"
      >
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span
            v-formatter="{ data: scope.row.oldMemberDepositAmount, type: 'money' }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="oldMemberDepositMemberCount"
        :label="t('fields.oldMemberDepositMemberCount')"
        width="120"
      />
      <el-table-column
        prop="oldMemberWithdrawAmount"
        :label="t('fields.oldMemberWithdrawAmount')"
        width="120"
      >
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span
            v-formatter="{ data: scope.row.oldMemberWithdrawAmount, type: 'money' }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="oldMemberWithdrawMemberCount"
        :label="t('fields.oldMemberWithdrawMemberCount')"
        width="120"
      />
      <el-table-column
        prop="referCount"
        :label="t('fields.referCount')"
        align="center"
        width="80"
      />
      <el-table-column
        prop="referFtdCount"
        :label="t('fields.referFtdCount')"
        align="center"
        width="120"
      />
      <el-table-column
        prop="redepositRate"
        :label="t('fields.redepositRate')"
        align="center"
        width="120"
      >
        <template #default="scope">
          {{ scope.row.redepositRate }} %
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

    <el-dialog
      :title="t('fields.exportToExcel')"
      v-model="uiControl.messageVisible"
      append-to-body
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>
    <el-dialog
      :title="t('fields.memberReport')"
      v-model="uiControl.memberVisible"
      append-to-body
    >
      <div class="header-container">
        <div class="search">
          <el-button
            size="mini"
            type="primary"
            v-permission="['sys:report:summary:member:export']"
            @click="requestExportMemberExcel"
          >
            {{ t('fields.requestExportToExcel') }}
          </el-button>
        </div>
      </div>

      <el-table
        :data="memberPage.records"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        v-loading="memberPage.loading"
        height="500"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="member"
          :label="t('fields.member')"
          width="120"
          fixed
        />
        <el-table-column
          prop="totalBet"
          :label="t('fields.betAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span v-formatter="{ data: scope.row.totalBet, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalPayout"
          :label="t('fields.payoutAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{
                data: scope.row.totalPayout,
                type: 'money',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="companyWinLoss"
          :label="t('fields.profit')"
          align="center"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{
                data: scope.row.totalBet - scope.row.totalPayout,
                type: 'money',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="deposit"
          :label="t('fields.depositAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <!-- eslint-disable -->
            <span v-formatter="{ data: scope.row.deposit, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="promo"
          :label="t('fields.bonusAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <!-- eslint-disable -->
            <span v-formatter="{ data: scope.row.promo, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="rebate"
          :label="t('fields.rebateAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <!-- eslint-disable -->
            <span v-formatter="{ data: scope.row.rebate, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="adjustment"
          :label="t('fields.adjustAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <!-- eslint-disable -->
            <span v-formatter="{ data: scope.row.adjustment, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="profit"
          :label="t('fields.netProfit')"
          align="center"
        >
          <template #default="scope">
            $
            <!-- eslint-disable -->
            <span v-formatter="{ data: scope.row.profit, type: 'money' }" />
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @current-change="changeMemberPage"
        layout="prev, pager, next"
        :page-size="memberRequest.size"
        :page-count="memberPage.pages"
        :current-page="memberRequest.current"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, defineExpose, computed } from 'vue'
import moment from 'moment'
import {
  getDorisSummaryReport,
  // getSummaryMemberReport,
  getDorisTotalSummaryReport,
  getExportSummaryReport,
  // getExportSummaryMemberReport
} from '../../../../api/report-summary'
import { useStore } from '../../../../store'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'

import { TENANT } from '../../../../store/modules/user/action-types'

defineExpose({
  loadSites,
})

const { t } = useI18n()
const startDate = new Date()
startDate.setTime(
  moment(startDate)
    .startOf('month')
    .format('x')
)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  messageVisible: false,
  memberVisible: false,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalAmount: 0,
})

const totalPage = reactive({
  records: [],
})

const request = reactive({
  size: 30,
  current: 1,
  memberName: null,
  privilegeName: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: store.state.user.siteId,
})

// const memberPage = reactive({
//   pages: 0,
//   records: [],
//   loading: false,
// })

// const memberRequest = reactive({
//   size: 30,
//   current: 1,
//   recordTime: null,
//   siteId: null,
// })

const shortcuts = getShortcuts(t)
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(24, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.memberName = null
  request.privilegeName = null
  request.recordTime = [defaultStartDate, defaultEndDate]
}

async function loadSummaryRecord() {
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

  const { data: ret } = await getDorisSummaryReport(query)
  const { data: ret1 } = await getDorisTotalSummaryReport(query)
  totalPage.records = ret1.records
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total

  page.loading = false
}

async function loadSites() {
  siteList.list = store.state.user.sites

  request.siteId = store.state.user.siteId || siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    const site = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.id
  }
}

function changePage(page) {
  request.current = page
  loadSummaryRecord()
}

function getSummaries(param) {
  const { columns } = param
  var sums = []
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

  if (totalPage.records.length > 0) {
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = t('fields.total')
      } else {
        var prop = column.property
        if (
          index === 21 ||
          index === 7 ||
          index === 23 ||
          index === 6 ||
          index === 4 || index === 12 ||
          index === 13 || index === 14 || index === 15 || index === 24 || index === 25 || index === 26) {
          sums[index] = totalPage.records[0][prop]
        } else if (index === 5) {
          // profit depositWithdrawal = deposit - withdrawal
          sums[index] =
            '$' +
            parseFloat(
              totalPage.records[0].depositAmount -
                totalPage.records[0].withdrawAmount
            ).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        } else {
          sums[index] =
            '$' +
            parseFloat(totalPage.records[0][prop]).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        }
      }
    })
  }
  return sums
}

// function changeMemberPage(page) {
//   memberRequest.current = page
//   loadMemberRecord()
// }

// async function loadMemberRecord() {
//   memberPage.loading = true
//   const requestCopy = { ...memberRequest }
//   const query = {}
//   Object.entries(requestCopy).forEach(([key, value]) => {
//     if (value) {
//       query[key] = value
//     }
//   })

//   const { data: ret } = await getSummaryMemberReport(query)

//   memberPage.pages = ret.pages
//   memberPage.records = ret.records
//   memberPage.loading = false
// }

// function loadMemberDialog(date) {
//   memberRequest.recordTime = date
//   memberRequest.siteId = request.siteId
//   loadMemberRecord()
//   uiControl.memberVisible = true
// }

onMounted(async () => {
  await loadSites()
  await loadSummaryRecord()
})

function checkQuery() {
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
  return query
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await getExportSummaryReport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

// function checkMemberQuery() {
//   const requestCopy = { ...memberRequest }
//   const query = {}
//   Object.entries(requestCopy).forEach(([key, value]) => {
//     if (value) {
//       query[key] = value
//     }
//   })
//   return query
// }

// async function requestExportMemberExcel() {
//   const query = checkMemberQuery()
//   query.requestBy = store.state.user.name
//   query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
//   const { data: ret } = await getExportSummaryMemberReport(query)
//   if (ret) {
//     uiControl.messageVisible = true
//   }
// }
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

.el-input-number:deep(.el-input__inner) {
  text-align: left;
}
</style>
