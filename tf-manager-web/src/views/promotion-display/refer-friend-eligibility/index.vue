<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 100px;"
          default-first-option
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.referrerName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.referrer')"
        />
        <el-input
          v-model="request.referrerCode"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.referrerCode')"
        />
        <el-input
          v-model="request.referredName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.referredName')"
        />
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="date"
          :placeholder="t('fields.recordTime')"
          style="margin-left: 5px; width: 200px"
          :editable="false"
          :clearable="false"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecords()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:refer-friend-eligibility:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.referrer')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.loginName === null">-</span>
            <span v-if="scope.row.loginName !== null">{{ scope.row.loginName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="referrerCode" :label="t('fields.referrerCode')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.referrerCode === null">-</span>
            <span v-if="scope.row.referrerCode !== null">{{ scope.row.referrerCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="activeMembers" :label="t('fields.dailyActiveMemberCount')" min-width="100" />
        <el-table-column prop="totalActiveMembers" :label="t('fields.totalActiveMembers')" min-width="100" />
        <el-table-column prop="membersDailyTotalDeposit" :label="t('fields.membersDailyTotalDeposit')" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.membersDailyTotalDeposit,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="membersMonthlyTotalDeposit" :label="t('fields.membersMonthlyTotalDeposit')" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.membersMonthlyTotalDeposit,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" :label="t('fields.recordTime')" min-width="200">
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <!-- eslint-disable -->
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{
                data: scope.row.recordTime,
                formatter: 'YYYY-MM-DD',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="200"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="warning"
              @click="showDetails(scope.row)"
            >
              {{ t('fields.view') }}
            </el-button>
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

    <el-dialog
      :title="t('fields.viewDetails')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="980px"
    >
      <div style="padding-bottom: 15px;">
        <el-table
          size="small"
          :data="detailPage.records"
          row-key="id"
          v-loading="detailPage.loading"
          :empty-text="t('fields.noData')"
        >
          <el-table-column prop="loginName" :label="t('fields.referredName')" align="center" min-width="120" />
          <el-table-column prop="regTime" :label="t('fields.regTime')" align="center" min-width="150">
            <template #default="scope">
              <span v-if="scope.row.regTime === null">-</span>
              <span
                v-if="scope.row.regTime !== null"
                v-formatter="{data: scope.row.regTime, timeZone: timeZone, type: 'date'}"
              />
            </template>
          </el-table-column>
          <el-table-column prop="gameType" :label="t('fields.gameType')" align="center" min-width="100">
            <template #default="scope">
              {{ t('gameType.' + scope.row.gameType) }}
            </template>
          </el-table-column>
          <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" align="center" min-width="100">
            <template #default="scope">
              $ <span v-formatter="{data: scope.row.depositAmount,type: 'money'}" />
            </template>
          </el-table-column>
          <el-table-column prop="monthlyDepositAmount" :label="t('fields.monthlyDepositAmount')" align="center" min-width="100">
            <template #default="scope">
              $ <span v-formatter="{data: scope.row.monthlyDepositAmount,type: 'money'}" />
            </template>
          </el-table-column>
          <el-table-column prop="monthlyDepositCount" :label="t('fields.monthlyDepositCount')" align="center" min-width="100" />
          <el-table-column prop="validBet" :label="t('fields.validBet')" align="center" min-width="100">
            <template #default="scope">
              $ <span v-formatter="{data: scope.row.validBet,type: 'money'}" />
            </template>
          </el-table-column>
          <el-table-column prop="rebatePercentage" :label="t('fields.rebatePercentage')" align="center" min-width="120">
            <template #default="scope">
              {{ scope.row.rebatePercentage.toFixed(2) }} %
            </template>
          </el-table-column>
          <el-table-column prop="rebateAmount" :label="t('fields.rebateAmount')" align="center" min-width="100">
            <template #default="scope">
              $ <span v-formatter="{data: scope.row.rebateAmount,type: 'money'}" />
            </template>
          </el-table-column>
          <el-table-column prop="recordTime" :label="t('fields.recordTime')" align="center" min-width="150">
            <template #default="scope">
              <span v-if="scope.row.recordTime === null">-</span>
              <span
                v-if="scope.row.recordTime !== null"
                v-formatter="{data: scope.row.recordTime, formatter: 'YYYY-MM-DD', type: 'date'}"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <span>{{ t('fields.totalRebateAmount') }}</span>
          <span style="margin-left: 10px">$ </span>
          <span>{{ totalRebateAmount.toFixed(2) }}</span>
        </div>
        <div class="table-footer">
          <el-button v-if="!detailPage.hasClaimed && totalRebateAmount == 0" type="warning" disabled style="margin-left: 10px">
            <span >{{ $t('fields.ineligible') }}</span>
          </el-button>
          <el-button v-else-if="!detailPage.hasClaimed && totalRebateAmount > 0" type="primary" @click="distribute" style="margin-left: 10px">
            <span >{{ $t('fields.distributeRebate') }}</span>
          </el-button>
          <el-button v-else type="success" disabled style="margin-left: 10px">
            <span >{{ $t('fields.distributed') }}</span>
          </el-button>
        </div>
      </div>
    </el-dialog>

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

import { onMounted, reactive, ref, computed } from "vue";
import { getReferFriendEligibility, getReferFriendEligibilityDetails, checkHasClaimed, distributeReferFriendEligibility, getExport } from "@/api/refer-friend-eligibility";
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from "@/api/site";
import { useStore } from '@/store'
import { TENANT } from '@/store/modules/user/action-types'
import moment from "moment";
import { ElMessage } from "element-plus";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const totalRebateAmount = ref(0);
const selectedRecord = reactive({
  referrerId: null,
  siteId: null,
  recordTime: null
});
let timeZone = null;

const uiControl = reactive({
  dialogVisible: false,
  messageVisible: false
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const detailPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  hasClaimed: true
});

const siteList = reactive({
  list: []
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}
const defaultDate = convertDate(new Date());

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  referrerName: null,
  referrerCode: null,
  referredName: null,
  recordTime: defaultDate
});

function resetQuery() {
  request.siteId = site.value ? site.value.id : siteList.list[0].id
  request.referrerName = null;
  request.referrerCode = null;
  request.referredName = null;
  request.recordTime = defaultDate
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  return query
}

async function loadRecords() {
  page.loading = true;
  const query = checkQuery()
  const { data: ret } = await getReferFriendEligibility(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadRecords();
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

async function showDetails(record) {
  totalRebateAmount.value = 0
  uiControl.dialogVisible = true
  detailPage.loading = true;
  const query = {}
  query.siteId = record.siteId
  query.referrerId = record.referrerId
  query.recordTime = record.recordTime
  query.activeMembers = record.activeMembers
  const { data: ret } = await getReferFriendEligibilityDetails(query);
  detailPage.pages = ret.pages;
  detailPage.records = ret.records;
  detailPage.records.forEach(record => {
    totalRebateAmount.value = totalRebateAmount.value + record.rebateAmount
  })
  const { data: claimed } = await checkHasClaimed(query);
  detailPage.hasClaimed = claimed
  selectedRecord.referrerId = record.referrerId
  selectedRecord.siteId = query.siteId
  selectedRecord.recordTime = record.recordTime;
  detailPage.loading = false;
}

async function distribute() {
  const query = {};
  Object.entries(selectedRecord).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  query.amount = totalRebateAmount.value
  await distributeReferFriendEligibility(query);
  uiControl.dialogVisible = false
  ElMessage({ message: t('message.success'), type: 'success' })
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await getExport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    site.value = siteList.list[0];
    request.siteId = site.value.id;
  }
});
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

:deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  font-size: small;
  font-weight: bold;
  display: flex;
  justify-content: flex-end;
}
</style>
