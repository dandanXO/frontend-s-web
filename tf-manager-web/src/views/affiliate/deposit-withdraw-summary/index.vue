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
          <el-button
            size="mini"
            type="primary"
            v-permission="['sys:affiliate:deposit-withdraw-summary:export']"
            @click="requestExportExcel"
          >
            {{ t('fields.requestExportToExcel') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :data="page.records"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
        highlight-current-row
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="left"
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
        <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" />
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
        >
          <template #default="scope">
            {{ formatMoney(scope.row.depositCount) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawAmount"
          :label="t('fields.withdrawAmount')"
          align="center"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawCount"
          :label="t('fields.withdrawCount')"
          align="center"
        >
          <template #default="scope">
            {{ formatMoney(scope.row.withdrawCount) }}
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { hasPermission } from '../../../utils/util'
import moment from 'moment'
import {
  getAffiliateDepositWithdrawSummary,
  exportAffiliateDepositWithdrawSummary
} from '../../../api/affiliate-record'
import { getSiteListSimple } from '../../../api/site'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../store'
import { getShortcuts } from '@/utils/datetime'
import { formatMoney } from "@/utils/format-money";
/* import { ElMessage } from 'element-plus'
import { useStore } from "@/store"; */

const { t } = useI18n()
const store = useStore()
const siteList = reactive({
  list: [],
})

const currentPageType = ref('main')
const shortcuts = getShortcuts(t)

const startDate = new Date()
startDate.setTime(
  moment(startDate)
    .startOf('month')
    .format('x')
)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const uiControl = reactive({
  messageVisible: false,
})

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  affiliateCode: null,
  activeMember: 0,
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
        .subtract(13, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.loginName = null
  request.affiliateCode = null
  request.activeMember = 0
  request.siteId = store.state.user.siteId
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
      query.recordTime = query.recordTime.join(',')
    }
  }
  return query
}

async function loadRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getAffiliateDepositWithdrawSummary(query)
  currentPageType.value = 'main'
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

async function requestExportExcel() {
  const query = checkQuery()
  const { data: ret } = await exportAffiliateDepositWithdrawSummary(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
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
