<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.gameMatchRecord.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadMatchRecord">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          size="mini"
          type="success"
          v-permission="['sys:nba-match-record:update']"
          @click="settleAllPending"
        >
          {{ t('fields.settleAllPending') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      v-loading="page.loading"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="180" />
      <el-table-column prop="title" :label="t('fields.title')" width="250" />
      <el-table-column prop="teamChosen" :label="t('fields.selectedTeam')" width="150">
        <template #default="scope">
          <span v-if="scope.row.teamChosen === 'DRAW'">{{ t('fields.draw') }}</span>
          <span v-else>{{ scope.row.teamChosen }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="winnerTeam" :label="t('fields.winnerTeam')" width="150">
        <template #default="scope">
          <span v-if="scope.row.homeTeamResult - scope.row.awayTeamResult === 0">{{ t('fields.draw') }}</span>
          <span v-else-if="scope.row.homeTeamResult - scope.row.awayTeamResult > 0">{{ scope.row.homeTeam }}</span>
          <span v-else>{{ scope.row.awayTeam }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bonus" :label="t('fields.bonus')" align="center" min-width="180">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonus,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'PENDING_MATCH'" size="mini">{{ t('status.gameMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'PENDING_SETTLE'" type="warning" size="mini">{{ t('status.gameMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'SETTLED'" type="success" size="mini">{{ t('status.gameMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CANCEL'" type="danger" size="mini">{{ t('status.gameMatchRecord.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.recordTime')" min-width="200">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="center" v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:nba-match-record:update'])" fixed="right" width="280">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'PENDING_SETTLE'"
            size="small"
            type="success"
            v-permission="['sys:nba-match-record:update']"
            @click="settle(scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.settle') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'PENDING_SETTLE'"
            size="small"
            type="danger"
            v-permission="['sys:nba-match-record:update']"
            @click="cancel(scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.cancel') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadMatchRecord"
      @size-change="loadMatchRecord"
    />
  </div>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { getSiteListSimple } from "@/api/site";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getNbaMatchRecord, settleNbaMatchRecord, cancelNbaMatchRecord, settleAllNbaMatchRecord } from "@/api/nba-match";
import { getShortcuts } from "@/utils/datetime";
import { hasRole, hasPermission } from '@/utils/util'
import moment from "moment";
import { ElMessage, ElMessageBox } from "element-plus";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const shortcuts = getShortcuts(t);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD');
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  status: null,
  createTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const sites = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "UPDATE",
  removeBtn: true,
  status: [
    { key: 1, displayName: 'PENDING_MATCH', value: 'PENDING_MATCH' },
    { key: 2, displayName: 'PENDING_SETTLE', value: 'PENDING_SETTLE' },
    { key: 3, displayName: 'SETTLED', value: 'SETTLED' },
    { key: 4, displayName: 'CANCEL', value: 'CANCEL' }
  ]
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

async function loadMatchRecord() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = request.createTime.join(",");
    }
  }
  const { data: ret } = await getNbaMatchRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.status = null;
  request.loginName = null;
  request.createTime = [convertStartDate(new Date()), convertDate(new Date())];
}

async function settle(id) {
  ElMessageBox.confirm(t('message.confirmSettlement'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await settleNbaMatchRecord(id)
    await loadMatchRecord()
    ElMessage({ message: t('message.settled'), type: 'success' })
  })
}

async function cancel(id) {
  ElMessageBox.confirm(t('message.confirmCancel'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await cancelNbaMatchRecord(id)
    await loadMatchRecord()
    ElMessage({ message: t('message.cancelSuccess'), type: 'success' })
  })
}

async function settleAllPending() {
  ElMessageBox.confirm(t('message.confirmSettlement'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await settleAllNbaMatchRecord()
    await loadMatchRecord()
    ElMessage({ message: t('message.settled'), type: 'success' })
  })
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
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

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}
</style>
