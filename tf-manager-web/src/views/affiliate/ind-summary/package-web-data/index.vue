<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <div>
          <el-date-picker
            v-model="request.recordTime"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 300px;"
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
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          prop="recordTime"
          :label="t('fields.recordTime')"
          align="center"
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
          prop="ftdAmount"
          :label="t('fields.ftdAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.ftdAmount, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bet"
          :label="t('fields.betAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bet, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="payout"
          :label="t('fields.payoutAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.payout, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="profit"
          :label="t('fields.profit')"
          align="center"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.profit, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="depositAmount"
          :label="t('fields.depositAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.depositAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="depositCount"
          :label="t('fields.depositCount')"
          align="center"
        />
        <el-table-column
          prop="bonus"
          :label="t('fields.bonusAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="rebateAmount"
          :label="t('fields.rebateAmount')"
          align="center"
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
          :label="t('fields.adjustAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.adjustment, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="netProfit"
          :label="t('fields.netProfit')"
          align="center"
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
import { onMounted, reactive } from 'vue'
import moment from 'moment'
import {
  queryDailySummaryByType,
  queryDailySummaryTotal,
} from '../../../../api/affiliate-daily-summary'
import { getSiteListSimple } from '../../../../api/site'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'

const { t } = useI18n()
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

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  belongType: 'PACKAGE',
})

const total = reactive({
  data: null,
})

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
  request.siteId = siteList.list.filter(x => x.siteCode === 'IND')[0].id
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
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime))
      query.recordTime[0] = moment(query.recordTime[0]).format(
        'yyyy-MM-DD 00:00:00'
      )
      query.recordTime[1] = moment(query.recordTime[1]).format(
        'yyyy-MM-DD 00:00:00'
      )
      query.recordTime = query.recordTime.join(',')
    }
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
        sums[index] =
          '$' +
          parseFloat(total.data[prop]).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
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
