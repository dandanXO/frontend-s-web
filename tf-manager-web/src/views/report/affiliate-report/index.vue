<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
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
          style="width: 300px; margin-left: 5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.affiliateCode"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.affiliateCode')"
        />
        <el-select
          v-model="request.affiliateLevel"
          size="small"
          :placeholder="t('fields.affiliateLevel')"
          class="filter-item"
          style="width: 180px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.affiliateLevel"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAffiliateReport(true)"
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
      <div class="btn-group">
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:report:summary:affiliate:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

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

    <el-table
      :data="page.records"
      ref="table"
      row-key="rowId"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :load="load"
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :empty-text="t('fields.noData')"
      show-summary
      :summary-method="populateReportTotal"
    >
      <el-table-column
        prop="recordTime"
        :label="t('fields.recordTime')"
        align="center"
        min-width="140"
        fixed="left"
      />
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        align="center"
        min-width="110"
        fixed="left"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
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
        prop="affiliateCode"
        :label="t('fields.affiliateCode')"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="affiliateLevel"
        :label="t('fields.affiliateLevel')"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          {{ t('affiliate.level.' + scope.row.affiliateLevel) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="commissionModel"
        :label="t('fields.commissionModel')"
        align="center"
        min-width="130"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.commissionModel === 'NORMAL'" type="success">
            {{ t('affiliate.commissionModel.' + scope.row.commissionModel) }}
          </el-tag>
          <el-tag v-else type="primary">
            {{ t('affiliate.commissionModel.' + scope.row.commissionModel) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="commission"
        :label="t('fields.commission')"
        width="100"
      >
        <template #default="scope">
          <span v-if="scope.row.commission === null">0.00 %</span>
          <span v-if="scope.row.commission !== null">
            {{ (scope.row.commission * 100).toFixed(2) }} %
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="registerMemberCount"
        :label="t('fields.registerCount')"
        align="center"
        min-width="110"
      />
      <!-- <el-table-column
        prop="totalRegisterMemberCount"
        :label="t('fields.totalRegisterCount')"
        align="center"
        min-width="140"
      /> -->
      <el-table-column
        prop="ftdMemberCount"
        :label="t('fields.ftdCount')"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="ftdAmount"
        :label="t('fields.ftdAmount')"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{data: scope.row.ftdAmount, type: 'money'}"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="depositAmount"
        :label="t('fields.depositAmount')"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{data: scope.row.depositAmount, type: 'money'}"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="depositMemberCount"
        :label="t('fields.depositMemberCount')"
        align="center"
        min-width="150"
      >
        <template #default="scope">
          <router-link
            :to="
              `/report/affiliate-report/deposit-member?date=${scope.row.recordTime}&site=${request.siteId}&affiliateId=${scope.row.affiliateId}`
            "
          >
            <el-link type="primary">
              {{ scope.row.depositMemberCount }}
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawAmount"
        :label="t('fields.withdrawAmount')"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawMemberCount"
        :label="t('fields.withdrawMemberCount')"
        align="center"
        min-width="160"
      />
      <el-table-column
        prop="bet"
        :label="t('fields.bet')"
        align="center"
        min-width="120"
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
        min-width="120"
      >
        <template #default="scope">
          $
          <span v-formatter="{data: scope.row.payout, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column
        prop="bonus"
        :label="t('fields.bonus')"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          $
          <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column
        prop="companyProfit"
        :label="t('fields.companyProfit')"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{
              data: scope.row.bet - scope.row.payout,
              type: 'money',
            }"
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  getAffiliateChildReport,
  getAffiliateReport,
  getAffiliateReportExport,
  getAffiliateReportTotal,
} from '../../../api/report-affiliate'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { getShortcuts } from '@/utils/datetime'

const { t } = useI18n()
const startDate = new Date()
const defaultDate = convertDate(startDate)

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  messageVisible: false,
  affiliateLevel: [
    { key: 1, displayName: t('affiliate.level.AFFILIATE'), value: 'AFFILIATE' },
    {
      key: 2,
      displayName: t('affiliate.level.SUPER_AFFILIATE'),
      value: 'SUPER_AFFILIATE',
    },
    {
      key: 3,
      displayName: t('affiliate.level.MASTER_AFFILIATE'),
      value: 'MASTER_AFFILIATE',
    },
    {
      key: 4,
      displayName: t('affiliate.level.CHIEF_AFFILIATE'),
      value: 'CHIEF_AFFILIATE',
    },
  ],
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 },
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  total: null,
  loading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  loginName: null,
  recordTime: [defaultDate, defaultDate],
  siteId: null,
  affiliateCode: null,
  affiliateLevel: null,
})

const shortcuts = getShortcuts(t)
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.loginName = null
  request.affiliateCode = null
  request.affiliateLevel = null
  request.recordTime = [defaultDate, defaultDate]
  request.siteId = store.state.user.siteId
}

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

async function loadAffiliateReport(withTotal) {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getAffiliateReport(query)
  page.pages = ret.pages
  page.records = ret.records
  if (withTotal) {
    loadAffiliateReportTotal(query)
  }
  page.loading = false
}

async function loadAffiliateReportTotal(query) {
  const { data: total } = await getAffiliateReportTotal(query)
  page.total = total
}

async function load(tree, treeNode, resolve) {
  const query = {}
  query.recordTime = tree.recordTime
  query.superiorAffiliateId = tree.affiliateId
  query.siteId = request.siteId
  const { data: children } = await getAffiliateChildReport(query)
  resolve(children)
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await getAffiliateReportExport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadAffiliateReport(false)
}

function populateReportTotal(param) {
  const { columns } = param
  const total = []
  columns.forEach((column, index) => {
    if (index === 0) {
      total[index] = t('fields.total')
    }

    const totalCopy = { ...page.total }

    Object.entries(totalCopy).forEach(([key, value]) => {
      if (key === column.property && value !== null) {
        if (key === 'depositAmount' || key === 'withdrawAmount') {
          total[index] = '$' + value.toFixed(2)
        } else {
          total[index] = value
        }
      }
    })
  })
  return total
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadAffiliateReport(true)
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

.el-input-number:deep(.el-input__inner) {
  text-align: left;
}
</style>
