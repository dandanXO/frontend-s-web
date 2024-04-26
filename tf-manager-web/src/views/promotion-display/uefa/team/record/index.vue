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
          v-model="request.recordTime"
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
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          v-model="request.teamGroup"
          size="small"
          :placeholder="t('fields.teamGroup')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
        >
          <el-option
            v-for="item in uiControl.teamGroup"
            :key="item.key"
            :label="t('fields.team' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadUefaTeamRecord">
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
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="200" />
      <el-table-column prop="teamGroup" :label="t('fields.teamGroup')" min-width="200">
        <template #default="scope">
          <span v-if="scope.row.teamGroup === null">-</span>
          <span v-else>{{ t('fields.team' + scope.row.teamGroup) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teamName" :label="t('fields.teamName')" min-width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.teamIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.teamName }}</span>
          </div>
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
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadUefaTeamRecord"
      @size-change="loadUefaTeamRecord"
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
import { getUefaTeamRecord } from "@/api/uefa";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const promoDir = process.env.VUE_APP_IMAGE + '/promo/'
const site = ref(null);

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
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  teamGroup: null,
  recordTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const sites = reactive({
  list: []
});

const uiControl = reactive({
  teamGroup: [
    { key: 1, displayName: 'A', value: 'A' },
    { key: 2, displayName: 'B', value: 'B' },
    { key: 3, displayName: 'C', value: 'C' },
    { key: 4, displayName: 'D', value: 'D' },
    { key: 5, displayName: 'E', value: 'E' },
    { key: 6, displayName: 'F', value: 'F' }
  ]
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

async function loadUefaTeamRecord() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(",");
    }
  }
  const { data: ret } = await getUefaTeamRecord(query);
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
  request.teamGroup = null;
  request.loginName = null;
  request.recordTime = [convertStartDate(new Date()), convertDate(new Date())];
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
