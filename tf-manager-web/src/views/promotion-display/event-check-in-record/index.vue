<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.checkInDate"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
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
          v-model="request.loginName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.loginName')"
        />
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
        prop="loginName"
        :label="t('fields.loginName')"
        min-width="120"
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
        prop="checkInDate"
        :label="t('fields.checkInDate')"
        min-width="150"
      />
      <el-table-column
        prop="consecutiveCount"
        :label="t('fields.consecutiveDay')"
        min-width="150"
      />
      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
        min-width="150"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
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
import { onMounted, reactive } from 'vue'
import moment from 'moment'
import { listMemberCheckInRecord } from '../../../api/privi-member-check-in-record'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { getShortcuts } from '@/utils/datetime'

const { t } = useI18n()
const shortcuts = getShortcuts(t)

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalReimburse: 0,
  numberOfReimbursement: 0,
  totalDeduct: 0,
  numberOfDeduction: 0,
})

const request = reactive({
  size: 20,
  current: 1,
  checkInDate: [defaultStartDate, defaultEndDate],
  siteId: 2,
  loginName: null,
})

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
  request.checkInDate = [defaultStartDate, defaultEndDate]
  request.siteId = 2
  request.loginName = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.checkInDate !== null) {
    if (request.checkInDate.length === 2) {
      query.checkInDate = JSON.parse(JSON.stringify(request.checkInDate))
      query.checkInDate = query.checkInDate.join(',')
    }
  }

  return query
}

async function loadRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await listMemberCheckInRecord(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

onMounted(async () => {
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
