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
          @focus="loadSites"
          @change="changeSite"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.winStatus"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 150px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          :placeholder="t('fields.recordDate')"
          style="margin-left: 5px;width: 150px"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecords()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.lotteryRecordList') }}</span>
        </div>
      </template>

      <el-table :data="page.records" ref="table"
                v-loading="page.loading"
                row-key="id"
                size="mini"
                :resizable="true"
                highlight-current-row
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.loginName === null">-</span>
            <span v-if="scope.row.loginName !== null">{{ scope.row.loginName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" :label="t('fields.selectedNumber')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.number === null">-</span>
            <span v-if="scope.row.number !== null">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="winStatus" :label="t('fields.status')" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.winStatus === 'WIN'" type="success" size="mini">{{ scope.row.winStatus }}</el-tag>
            <el-tag v-if="scope.row.winStatus === 'LOSS'" type="danger" size="mini">{{ scope.row.winStatus }}</el-tag>
            <el-tag v-if="scope.row.winStatus === 'BET'" type="warning" size="mini">{{ scope.row.winStatus }}</el-tag>
            <el-tag v-if="scope.row.winStatus === null" type="info" size="mini">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" :label="t('fields.recordTime')" min-width="160">
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <span v-if="scope.row.recordTime !== null">{{ scope.row.recordTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="resultTime" :label="t('fields.resultTime')" min-width="160">
          <template #default="scope">
            <span v-if="scope.row.resultTime === null">-</span>
            <span v-if="scope.row.resultTime !== null">{{ scope.row.resultTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination"
                     @current-change="changePage"
                     layout="prev, pager, next"
                     :page-size="request.size"
                     :page-count="page.pages"
                     :current-page="request.current"
      />
    </el-card>
  </div>
</template>

<script setup>

import { onMounted, reactive } from "vue";
import moment from 'moment';
import { getLotteryRecords } from "../../../api/privilege-lottery";
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from "../../../api/site";

const { t } = useI18n();
const uiControl = reactive({
  status: [
    { key: 1, displayName: "BET", value: "BET" },
    { key: 2, displayName: "WIN", value: "WIN" },
    { key: 3, displayName: "LOSS", value: "LOSS" }
  ]
});

const startDate = convertDate(new Date());
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

const page = reactive({
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
  winStatus: null,
  recordTime: startDate,
  affiliateCode: null,
  siteId: null
});

function resetQuery() {
  request.winStatus = null;
  request.recordTime = null;
}

async function loadRecords() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getLotteryRecords(query);
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

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id
  loadRecords();
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
</style>
