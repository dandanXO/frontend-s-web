<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
          @focus="loadSites"
          @change="loadPrivilegeList"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 250px; margin-left: 10px;"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          clearable
          v-model="request.privilegeId"
          size="small"
          :placeholder="t('fields.privilege')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
          filterable
        >
          <el-option
            v-for="item in uiControl.privilegeList"
            :key="item.id"
            :label="item.alias !== null ? item.alias : item.name"
            :value="item.id"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadMemberPrivilegeClaimStatusRecords">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
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
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="150" />
      <el-table-column prop="privilegeName" :label="t('fields.privilege')" width="200" />
      <el-table-column prop="status" :label="t('fields.status')" align="center" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'SUCCESS'" size="mini" type="success">{{ t('common.status.' + scope.row.status) }}</el-tag>
          <el-tag v-else size="mini" type="danger">{{ t('common.status.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="detailMsg"
        :label="t('fields.detailMsg')"
        :show-overflow-tooltip="true"
        min-width="300"
      />
      <el-table-column
        prop="recordTime"
        :label="t('fields.recordTime')"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.recordTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.recordTime !== null"
            v-formatter="{ data: scope.row.recordTime, timeZone: timeZone, formatter: 'YYYY-MM-DD HH:mm:ss', type: 'date' }"
          />
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
      @current-change="loadMemberPrivilegeClaimStatusRecords"
      @size-change="loadMemberPrivilegeClaimStatusRecords"
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
import { getmemberPrivilegeClaimStatusRecord } from "@/api/member-privilege-claim-status";
import { getAllPrivilegeInfoBySiteId } from '@/api/privilege-info'
import moment from "moment";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const uiControl = reactive({
  privilegeList: [],
  messageVisible: false
});
function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  recordTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const sites = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

async function loadMemberPrivilegeClaimStatusRecords() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getmemberPrivilegeClaimStatusRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

async function loadPrivilegeList() {
  const { data: list } = await getAllPrivilegeInfoBySiteId(request.siteId)
  uiControl.privilegeList = list
  request.privilegeId = null
}

function resetQuery() {
  request.siteId = site.value.id;
  request.loginName = null;
  request.recordTime = [convertStartDate(new Date()), convertDate(new Date())];
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });

  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  return query;
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadPrivilegeList()
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

.el-form-item--level-color:deep(.el-form-item__content) {
  display: flex !important;
}
</style>
