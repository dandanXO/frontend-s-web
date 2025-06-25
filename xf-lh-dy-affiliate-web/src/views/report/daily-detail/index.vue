<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <div>
          <el-select
            v-model="request.loginNameList"
            :placeholder="t('fields.affiliate')"
            multiple
          >
            <el-option
              v-for="aff in affiliateNames.list"
              :key="aff.loginName"
              :label="aff.loginName + ' (' + aff.affiliateCode + ')'"
              :value="aff.loginName"
            />
          </el-select>
          <el-date-picker
            v-model="request.recordTime"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 300px; margin-left: 10px"
            :shortcuts="shortcuts"
            :editable="false"
            :clearable="false"
          />

          <el-button
            style="margin-left: 20px"
            icon="el-icon-search"
            type="success"
            @click="loadRecord()"
          >
            {{ t('fields.search') }}
          </el-button>
          <el-button @click="resetQuery()">
            {{ t('fields.reset') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        size="small"
        :resizable="true"
        :data="page.records"
        v-loading="page.loading"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
          prop="loginName"
          :label="t('fields.platform')"
          align="left"
          min-width="100"
          width="120"
        >
          <template #default="scope">
            <router-link
              :to="
                `/affiliate/details/${scope.row.affiliateId}?site=${request.siteId}`
              "
            >
              <el-link type="primary">
                {{
                  scope.row.loginName
                    .replace('(OFFICAL)', '')
                    .replace('admin', '')
                    .trim()
                }}
              </el-link>
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
          width="150"
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
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.ftdAmount, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bet"
          :label="t('fields.indBet')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bet, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="payout"
          :label="t('fields.payout')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.payout, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="profit"
          :label="t('fields.indProfit')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.profit, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
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
        </el-table-column>
        <el-table-column
          prop="depositMembersCount"
          :label="t('fields.totalDepositMemberCount')"
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
          :label="t('fields.indBonusAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="rebateAmount"
          :label="t('fields.indRebateAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.rebateAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="adjustment"
          :label="t('fields.indAdjustAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.adjustment, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="netProfit"
          :label="t('fields.grossProfit')"
          align="center"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.netProfit, type: 'money'}" />
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
    </el-card>
  </div>
</template>

<script setup>
/* eslint-disable */
import { onMounted, reactive, computed  } from 'vue'
import moment from 'moment'
import {
  queryDailySummary,
  queryDailySummaryTotal,
} from '../../../api/affiliate-daily-summary'
import { getSite } from '../../../api/site'
import { getAffiliateList } from '../../../api/affiliate-record'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { useStore } from '@/store'

const { t } = useI18n()
let site = reactive({
  id: 5,
})
const store = useStore()

const shortcuts = getShortcuts(t)
const startDate = new Date()
startDate.setTime(
  moment(startDate)
    .startOf('month')
    .format('x')
)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
const affiliateNames = reactive({
  list: [],
})

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  loginNameList: null,
})

const total = reactive({
  data: null,
})

async function loadSites() {
  const { data } = await getSite(store.state.user.siteId)
  site = data
  request.siteId = site.id
  const { data: affiliates } = await getAffiliateList(store.state.user.id)

  affiliateNames.list = affiliates
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  if(siteId.value === "5" || siteId.value === "9"){
    return false;
  }

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
  request.loginNameList = null
  request.affiliateCode = null
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
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime
      query.recordTime[0] =
        moment(query.recordTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
      query.recordTime[1] =
        moment(query.recordTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
      query.recordTime = query.recordTime.join(',')
    }
  }
  if (request.loginNameList === null || request.loginNameList.length === 0) {
    query.loginNameList = affiliateNames.list.map(a => a.loginName).join(',')
  } else {
    query.loginNameList = request.loginNameList.join(',')
  }

  return query
}

async function loadRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await queryDailySummary(query)
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
      } else if (index > 1) {
        var prop = column.property
        if (index === 5 || index === 6 || index === 12 || index === 13) {
          sums[index] = total.data[prop]
        } else if (index === 4) {
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

onMounted(async () => {
  await loadSites()
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
  margin-bottom: 5px;
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
