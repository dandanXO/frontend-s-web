<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <div>
          <!-- <el-select v-model="request.siteId" :placeholder="t('fields.site')">
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
              @change="handleChangeSites"
            />
          </el-select> -->
          <!-- <el-select
            v-model="request.loginNameList"
            :placeholder="t('fields.platform')"
            multiple
            style="margin-left: 20px;"
          >
            <el-option
              v-for="aff in affiliateNames"
              :key="aff.name"
              :label="aff.name"
              :value="aff.name"
            />
          </el-select> -->
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
            :editable="false"
            :clearable="false"
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
      <!-- eslint-disable -->
      <el-table
        height="75vh"
        size="small"
        :resizable="true"
        :data="page.records"
        v-loading="page.loading"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :empty-text="t('fields.noData')"
        :summary-method="getSummaries"
        show-summary
        highlight-current-row
      >
        <el-table-column
          prop="recordTime"
          :label="t('fields.recordTime')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.recordTime,
                formatter: 'YYYY-MM-DD',
                type: 'date',
              }"
            />
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
          width="120"
        />
        <el-table-column
          prop="ftdCount"
          :label="t('fields.ftdCount')"
          align="center"
          width="120"
        />
        <el-table-column
          prop="ftdAmount"
          :label="t('fields.ftdAmount')"
          align="center"
          width="150"
        >
          <template #default="scope">
            $
            <span v-formatter="{ data: scope.row.ftdAmount, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bet"
          :label="t('fields.betAmount')"
          align="center"
          width="150"
        >
          <template #default="scope">
            $
            <span v-formatter="{ data: scope.row.bet, type: 'money' }" />
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
            <span v-formatter="{ data: scope.row.payout, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="profit"
          :label="t('fields.profit')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{ data: scope.row.profit, type: 'money' }" />
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="depositAmount"
          :label="t('fields.totalMemberDepositAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{
                data: scope.row.depositAmount,
                type: 'money',
              }"
            />
          </template>
        </el-table-column> -->
        <el-table-column
          prop="depositMembersCount"
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
          prop="betMembersCount"
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
            <span
              v-formatter="{ data: scope.row.rebateAmount, type: 'money' }"
            />
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
            <span v-formatter="{ data: scope.row.adjustment, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="netProfit"
          :label="t('fields.netProfit')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{ data: scope.row.netProfit, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="referCount"
          :label="t('fields.referCount')"
          align="center"
          width="120"
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
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch, ref, defineExpose, computed } from 'vue'
import moment from 'moment'
import {
  queryDailySummaryByType,
  queryDailySummaryTotal,
} from '../../../../api/affiliate-daily-summary'
import { getSiteListSimple } from '../../../../api/site'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
// import { formatInputTimeZone } from '@/utils/format-timeZone'
import { useRoute } from 'vue-router'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'

defineExpose({
  loadSites,
})

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const siteList = reactive({
  list: [],
})

const route = useRoute()
const getFromRouter = reactive({
  loginNameList: route.query.loginNameList,
  superiorLoginName: route.query.superiorLoginName,
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

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  loginNameList: null,
  superiorLoginName: null,
})

const total = reactive({
  data: null,
})

let previouseLoginNameList = ref(null)
let previousSuperiorLoginName = ref(null)

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site

  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }

  if (
    route.query.loginNameList !== null &&
    route.query.loginNameList !== undefined
  ) {
    if (previouseLoginNameList.value !== null) {
      if (route.query.loginNameList !== previouseLoginNameList.value) {
        resetQuery()
        loadRecord()
      }
    } else {
      previouseLoginNameList = route.query.loginNameList
      loadRecord()
    }
  } else if (
    route.query.superiorLoginName !== null &&
    route.query.superiorLoginName !== undefined
  ) {
    if (previousSuperiorLoginName.value !== null) {
      if (route.query.superiorLoginName !== previousSuperiorLoginName.value) {
        resetQuery()
        loadRecord()
      }
    } else {
      previousSuperiorLoginName = route.query.superiorLoginName
      loadRecord()
    }
  }
}

// function handleChangeSites() {
//   if (
//     route.query.loginNameList !== null &&
//     route.query.loginNameList !== undefined
//   ) {
//     if (previouseLoginNameList.value !== null) {
//       if (route.query.loginNameList !== previouseLoginNameList.value) {
//         resetQuery()
//         loadRecord()
//       }
//     } else {
//       previouseLoginNameList = route.query.loginNameList
//       loadRecord()
//     }
//   } else if (
//     route.query.superiorLoginName !== null &&
//     route.query.superiorLoginName !== undefined
//   ) {
//   }
// }

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

// function disabledDate(time) {
//   return (
//     time.getTime() <
//       moment(new Date())
//         .subtract(3, 'months')
//         .startOf('month')
//         .format('x') || time.getTime() > new Date().getTime()
//   )
// }

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate]
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
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
  // const timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime))
      // query.recordTime[0] = formatInputTimeZone(
      //   query.recordTime[0],
      //   timeZone,
      //   'start'
      // )
      // query.recordTime[1] = formatInputTimeZone(
      //   query.recordTime[1],
      //   timeZone,
      //   'end'
      // )
      query.recordTime[0] = moment(query.recordTime[0]).format(
        'YYYY-MM-DD 00:00:00'
      )
      query.recordTime[1] = moment(query.recordTime[1]).format(
        'YYYY-MM-DD 23:59:59'
      )
      query.recordTime = query.recordTime.join(',')
    }
  }

  if (getFromRouter.loginNameList != null) {
    query.loginNameList = getFromRouter.loginNameList
  }

  if (getFromRouter.superiorLoginName != null) {
    query.superiorLoginName = getFromRouter.superiorLoginName
  }

  return query
}

async function loadRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await queryDailySummaryByType(query)
  const { data: ret1 } = await queryDailySummaryTotal(query)
  total.data = ret1
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

function getSummaries(param) {
  const { columns } = param
  var sums = []

  if (total.data) {
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = t('fields.total')
      } else {
        var prop = column.property
        if (
          index === 4 ||
          index === 6 ||
          index === 13 ||
          index === 19 ||
          index === 20 ||
          index === 21
        ) {
          // withdrawCount, registerCount, ftdCount, totalDepositCount, totalBetCount
          sums[index] = total.data[prop]
        } else if (index === 7 || index === 12 || index === 14) {
          // const pageRowCount = Number(page.records.reduce((sum, row) => {
          //   return sum + Number(row[prop])
          // }, 0))
          // const totalPageCount = Number(total.data[prop])
          // if (pageRowCount !== totalPageCount) {
          //   sums[index] = `${total.data[prop]} (${pageRowCount})`
          // } else {
          //   sums[index] = total.data[prop]
          // }
          sums[index] = total.data[prop]
        } else if (index === 5) {
          // profit depositWithdrawal = deposit - withdrawal
          sums[index] =
            '$' +
            parseFloat(
              total.data.depositAmount - total.data.withdrawAmount
            ).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        } else {
          sums[index] =
            '$' +
            parseFloat(total.data[prop]).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        }
      }
    })
  }
  return sums
}

function changePage(page) {
  request.current = page
  loadRecord()
}

onMounted(async () => {
  await loadSites()
  watch(() => {
    if (
      route.query.loginNameList !== null &&
      route.query.loginNameList !== undefined
    ) {
      getFromRouter.loginNameList = route.query.loginNameList
    } else if (
      route.query.superiorLoginName !== null &&
      route.query.superiorLoginName !== undefined
    ) {
      getFromRouter.superiorLoginName = route.query.superiorLoginName
    } else {
      getFromRouter.loginNameList = null
    }
  })
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
  margin-bottom: 10px;
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
