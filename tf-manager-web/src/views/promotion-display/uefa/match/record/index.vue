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
          v-model="request.title"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.title')"
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
          @focus="loadSites"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.uefaMatchRecord.' + item.displayName)"
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
      <el-table-column prop="title" :label="t('fields.title')" width="180" />
      <el-table-column prop="teamOneName" :label="t('fields.teamOne')" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.teamOneIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.teamOneName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="teamTwoName" :label="t('fields.teamTwo')" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.teamTwoIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.teamTwoName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="teamName" :label="t('fields.selectedTeam')" width="180">
        <template #default="scope">
          <div v-if="scope.row.teamName" style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.teamIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.teamName }}</span>
          </div>
          <el-tag v-else size="mini" type="warning">{{ t('fields.draw') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="winnerTeamName" :label="t('fields.winner')" width="180">
        <template #default="scope">
          <div v-if="scope.row.winnerTeamName" style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.winnerTeamIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.winnerTeamName }}</span>
          </div>
          <el-tag v-else-if="scope.row.winnerTeamId === 0 && scope.row.matchStatus === 'ENDED'" size="mini" type="warning">{{ t('fields.draw') }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'PENDING'" size="mini">{{ t('status.uefaMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CANCEL'" type="danger" size="mini">{{ t('status.uefaMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'WIN_MATCH' || scope.row.status === 'WIN_TEAM' || scope.row.status === 'WIN_ALL'" type="success" size="mini">{{ t('status.uefaMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'LOSE'" type="warning" size="mini">{{ t('status.uefaMatchRecord.' + scope.row.status) }}</el-tag>
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
import { getUefaMatchRecord } from "@/api/uefa";
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
  title: null,
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
    { key: 1, displayName: 'PENDING', value: 'PENDING' },
    { key: 2, displayName: 'CANCEL', value: 'CANCEL' },
    { key: 3, displayName: 'WIN_MATCH', value: 'WIN_MATCH' },
    { key: 4, displayName: 'WIN_TEAM', value: 'WIN_TEAM' },
    { key: 5, displayName: 'WIN_ALL', value: 'WIN_ALL' },
    { key: 6, displayName: 'LOSE', value: 'LOSE' }
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
  const { data: ret } = await getUefaMatchRecord(query);
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
  request.title = null;
  request.status = null;
  request.loginName = null;
  request.createTime = [convertStartDate(new Date()), convertDate(new Date())];
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
