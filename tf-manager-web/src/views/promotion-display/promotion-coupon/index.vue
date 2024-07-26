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
          v-model="request.loginName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.loginName')"
        />
        <el-date-picker
          v-model="request.recordTimeBetween"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-select
          clearable
          v-model="request.status"
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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecords()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">

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
        <el-table-column prop="status" :label="t('fields.status')" min-width="120">
          <template #default="scope">
            <el-tag type="info" size="mini">{{ scope.row.status }}</el-tag>
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
                timeZone: timeZone,
                type: 'date',
              }"
            />
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
import { getCouponRecords } from "../../../api/privilege-coupon";
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from "../../../api/site";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment";
import { formatInputTimeZone } from '@/utils/format-timeZone'
let timeZone = null

const { t } = useI18n();
const uiControl = reactive({
  status: [
    { key: 1, displayName: "PENDING", value: "PENDING" },
    { key: 2, displayName: "EXPIRED", value: "EXPIRED" },
    { key: 3, displayName: "USED", value: "USED" }
  ]
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const siteList = reactive({
  list: []
});

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

const request = reactive({
  size: 30,
  current: 1,
  status: null,
  loginName: null,
  recordTimeBetween: [convertStartDate(new Date()), convertDate(new Date())],
  siteId: null
});

function resetQuery() {
  request.status = null;
  request.loginName = null;
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  if (request.recordTimeBetween !== null) {
    if (request.recordTimeBetween.length === 2) {
      query.recordTimeBetween = JSON.parse(JSON.stringify(request.recordTimeBetween))
      query.recordTimeBetween[0] = formatInputTimeZone(
        query.recordTimeBetween[0],
        timeZone,
        'start'
      )
      query.recordTimeBetween[1] = formatInputTimeZone(
        query.recordTimeBetween[1],
        timeZone,
        'end'
      )
      query.recordTimeBetween = query.recordTimeBetween.join(',')
    }
  }

  return query
}

async function loadRecords() {
  page.loading = true;
  const query = checkQuery()
  const { data: ret } = await getCouponRecords(query);
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
