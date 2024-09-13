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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecords()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
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
        <el-table-column prop="activeMembers" :label="t('fields.dailyActiveMemberCount')" min-width="100" />
        <el-table-column prop="totalActiveMembers" :label="t('fields.totalActiveMembers')" min-width="100" />
        <el-table-column prop="membersMonthlyTotalDeposit" :label="t('fields.membersMonthlyTotalDeposit')" min-width="200" />
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
      width="780px"
    >
      <div style="padding-bottom: 15px;">
        <el-table
          size="small"
          :data="detailPage.records"
          row-key="id"
          v-loading="detailPage.loading"
          :empty-text="t('fields.noData')"
        >
          <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="120" />
          <el-table-column prop="gameType" :label="t('fields.gameType')" align="center" min-width="100">
            <template #default="scope">
              {{ t('gameType.' + scope.row.gameType) }}
            </template>
          </el-table-column>
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
      </div>
    </el-dialog>
  </div>
</template>

<script setup>

import { onMounted, reactive, ref, computed } from "vue";
import { getReferFriendEligibility, getReferFriendEligibilityDetails } from "@/api/refer-friend-eligibility";
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from "@/api/site";
import { useStore } from '@/store'
import { TENANT } from '@/store/modules/user/action-types'

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const totalRebateAmount = ref(0);

const uiControl = reactive({
  dialogVisible: false
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const detailPage = reactive({
  pages: 0,
  records: [],
  loading: false
});

const siteList = reactive({
  list: []
});

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  referrerName: null
});

function resetQuery() {
  request.siteId = site.value ? site.value.id : siteList.list[0].id
  request.referrerName = null;
}

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
  detailPage.loading = false;
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

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
  font-weight: bold;
}
</style>
