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

        <el-select
          v-model="request.source"
          size="small"
          :placeholder="t('fields.sourceType')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
        >
          <el-option
            v-for="item in source.list"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>

        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberRecord()"
        >
          {{ t('fields.search') }}
        </el-button>

        <el-button
          v-if="uiControl.show"
          size="mini"
          type="primary"
          v-permission="['sys:report:summary:deposit:member:detail:export']"
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
      <el-table-column
        prop="member"
        :label="t('fields.member')"
        width="160"
        fixed
      />
      <el-table-column
        prop="source"
        :label="t('fields.sourceType')"
        width="160"
      />
      <el-table-column prop="deposit" :label="t('fields.memberDetailDeposit')" width="160">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.deposit,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="depositCount"
        :label="t('fields.memberDetailDepositCount')"
        width="160"
      />

      <el-table-column prop="promo" :label="t('fields.memberDetailPrivilege')" width="160">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.promo,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="withdraw"
        :label="t('fields.memberDetailWithdraw')"
        width="160"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.withdraw,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="time"
        :label="t('fields.recordTime')"
        width="160"
      />
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
import { getSummaryMemberReport, getExportSummaryMemberReport } from '../../../../api/report-summary'
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import moment from "moment";

const { t } = useI18n()

var date = new URL(location.href).searchParams.get('date')
var siteIdFromParam = new URL(location.href).searchParams.get('site')

const uiControl = reactive({
  messageVisible: false,
  show: false,
})

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const source = reactive({
  list: [{ name: 'DIRECT' }, { name: "REFER" }, { name: "AFFILIATE" }],
})

const request = reactive({
  size: 30,
  current: 1,
  recordTime: date,
  siteId: null,
  source: null,
  isDeposit: true,
})

async function loadMemberRecord() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  const { data: ret } = await getSummaryMemberReport(query)

  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  request.current = page
  loadMemberRecord()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function back() {
  window.location.href = '/report/summaryreport'
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

  await loadMemberRecord()
})

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  return query
}

async function requestExportExcel() {
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getExportSummaryMemberReport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}
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

.el-input-number:deep .el-input__inner {
  text-align: left;
}
</style>
