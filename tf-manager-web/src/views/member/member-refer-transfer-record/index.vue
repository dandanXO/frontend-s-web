<template>
  <div class="roles-main">
    <div class="header-container" style="margin-bottom: 40px">
      <div class="search">
        <el-input v-model="request.senderName" size="small" style="width: 180px; margin-left: 5px" :placeholder="t('fields.sender')" />
        <el-input v-model="request.receiverName" size="small" style="width: 180px; margin-left: 5px" :placeholder="t('fields.receiver')" />
        <el-date-picker
          v-model="request.transferDate"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px; margin-left: 5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecords">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row>
      <el-table-column prop="senderName" :label="t('fields.sender')">
        <template
          #default="scope"
          v-if="hasPermission(['sys:member:detail'])"
        >
          <router-link
            :to="`details/${scope.row.senderId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.senderName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="receiverName" :label="t('fields.receiver')">
        <template
          #default="scope"
          v-if="hasPermission(['sys:member:detail'])"
        >
          <router-link
            :to="`details/${scope.row.receiverId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.receiverName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="transferDate" :label="t('fields.transferTime')">
        <template #default="scope">
          <span v-if="scope.row.transferDate === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.transferDate !== null"
            v-formatter="{
              data: scope.row.transferDate,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="transferAmount" :label="t('fields.amount')">
        <template #default="scope">
          <span
            v-formatter="{
              data: scope.row.transferAmount,
              type: 'money',
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
  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import { getReferTransferRecords } from "../../../api/refer-transfer";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { getSiteListSimple } from "../../../api/site";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { hasPermission } from '../../../utils/util'

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const siteList = reactive({
  list: []
});

const shortcuts = getShortcuts(t);
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const startDate = new Date();
startDate.setDate(startDate.getDate() - 2);
const defaultStartDate = convertDate(startDate);
const defaultEndDate = convertDate(new Date());

const request = reactive({
  size: 30,
  current: 1,
  senderName: null,
  receiverName: null,
  transferDate: [defaultStartDate, defaultEndDate],
  siteId: null
});

let timeZone = null

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function resetQuery() {
  request.senderName = null;
  request.receiverName = null;
  request.transferDate = [defaultStartDate, defaultEndDate];
  request.siteId = store.state.user.siteId
}

async function loadRecords() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
    if (request.siteId === null) {
      const siteIdList = siteList.list.map(s => s.id);
      query.siteId = siteIdList.join(',');
    }
    if (request.transferDate && request.transferDate.length === 2) {
      if (request.siteId) {
        timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
      }
      query.transferDate = JSON.parse(JSON.stringify(request.transferDate));
      query.transferDate[0] = formatInputTimeZone(query.transferDate[0], timeZone, 'start');
      query.transferDate[1] = formatInputTimeZone(query.transferDate[1], timeZone, 'end');
      query.transferDate = query.transferDate.join(',')
    }
  });
  const { data: ret } = await getReferTransferRecords(query);
  page.pages = ret.pages;
  ret.records.forEach(data => {
    data.timeZone = siteList.list.find(e => e.siteName === data.site) !== undefined
      ? siteList.list.find(e => e.siteName === data.site).timeZone
      : null
  });
  console.log(ret)
  console.log(page)
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadRecords();
}

onMounted(async() => {
  await loadSites();
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadRecords();
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

</style>
