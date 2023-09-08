<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-button
          style="margin-left: 20px"
          icon="el-icon-back"
          size="mini"
          type="success"
          @click="back()"
        >
          {{ t('fields.back') }}
        </el-button>

        <el-button
          style="margin-left: 20px"
          icon="el-icon-refresh"
          size="mini"
          type="success"
          @click="refresh()"
        />

        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:report:summary:withdraw:export']"
          @click="requestExportExcel"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      height="500"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="member" :label="t('fields.member')" width="120" fixed />
      <el-table-column prop="source" :label="t('fields.sourceType')" width="120" />
      <el-table-column prop="txnId" :label="t('fields.txnId')" width="220" />
      <el-table-column prop="txnTime" :label="t('fields.txnTime')" width="150" />
      <el-table-column prop="auditTime" :label="t('fields.auditTime')" width="150" />
      <el-table-column prop="amount" :label="t('fields.amount')" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.amount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="paymentMethod"
        :label="t('fields.paymentMethod')"
        width="180"
      />

      <el-table-column prop="bankNumber" :label="t('fields.bankNumber')" width="180" />
      <el-table-column prop="bankAccount" :label="t('fields.bankAccount')" width="180" />
    </el-table>

    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />

    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
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
import { computed, onMounted, reactive, ref } from 'vue'
import { getSummaryWithdrawReport, getExportSummaryWithdrawReport } from '../../../../api/report-summary'
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { useI18n } from "vue-i18n";
import moment from "moment";

// eslint-disable-next-line
const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})
var date = new URL(location.href).searchParams.get('date')
var siteIdFromParam = new URL(location.href).searchParams.get('site')

const uiControl = reactive({
  messageVisible: false,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  recordTime: date,
  siteId: null,
})

async function loadSummaryWithdrawRecord() {
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

  const { data: ret } = await getSummaryWithdrawReport(query)

  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  request.current = page
  loadSummaryWithdrawRecord()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function back() {
  window.location.href = '/report/summaryreport'
}

function refresh() {
  loadSummaryWithdrawRecord()
}

onMounted(async () => {
  await loadSites()
  // tenant 只可以看到本身site的资料
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = siteIdFromParam
  }

  await loadSummaryWithdrawRecord()
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
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getExportSummaryWithdrawReport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}
</style>
