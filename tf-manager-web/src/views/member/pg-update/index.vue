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
          default-first-option
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.date"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px; margin-left:10px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadPendingRecords()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>
    <el-table
      height="600"
      size="small"
      :resizable="true"
      :data="page.showRecords"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="playerName" :label="t('fields.playerName')" align="center" min-width="210" />
      <el-table-column prop="gameName" :label="t('fields.gameName')" align="center" min-width="210" />
      <el-table-column prop="betStatus" :label="t('fields.betStatus')" align="center" min-width="210">
        <template #default="scope">
          <span v-if="scope.row.betStatus === 1">{{ t('fields.pendingTransaction') }}</span>
          <span v-else>{{ scope.row.betStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="betId" :label="t('fields.betId')" align="center" min-width="210" />
      <el-table-column prop="betAmount" :label="t('fields.betAmount')" align="center" min-width="120">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.betAmount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="betTime" :label="t('fields.betTime')" align="center" min-width="150">
        <template #default="scope">
          <span v-if="scope.row.betTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.betTime !== null"
            v-formatter="{
              data: scope.row.betTime,
              timeZone: siteTimeZone.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="center"
        min-width="300"
        fixed="right"
      >
        <template #default="scope">
          <el-button :disabled="scope.row.betStatus !== 1" size="mini" type="success" @click="update(scope.row, true)">{{ t('fields.success') }}</el-button>
          <el-button :disabled="scope.row.betStatus !== 1" size="mini" type="danger" @click="update(scope.row, false)">{{ t('fields.fail') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next"
      style="margin-top: 10px"
      :total="page.total"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
      @current-change="changePage"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getPending, updatePending } from "../../../api/pg-update";
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from "../../../api/site";
import moment from "moment";

const { t } = useI18n();
const siteList = reactive({
  list: []
});

const startDate = new Date();
startDate.setDate(startDate.getDate() - 6);
const defaultStartDate = convertDate(startDate);
const defaultEndDate = convertDate(new Date());
const siteTimeZone = reactive({
  timeZone: null,
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  date: [defaultStartDate, defaultEndDate]
});

const page = reactive({
  pages: 0,
  records: [],
  showRecords: [],
  total: 0,
  loading: false,
  totalAmount: 0
});

const changePage = (page) => {
  if (request.current >= 1) {
    request.current = page;
    getShowRecords();
  }
};

async function update(row, isSuccess) {
  const req = { ...row };
  req.isSuccess = isSuccess;
  req.siteId = request.siteId;
  await updatePending(req);
  ElMessage({ message: t('message.success'), type: "success" });
  await loadPendingRecords();
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function disabledDate(time) {
  return time.getTime() <= moment(new Date()).subtract(1, 'weeks').format('x') || time.getTime() > new Date().getTime();
}

async function loadPendingRecords() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.date !== null) {
    if (request.date.length === 2) {
      query.date = request.date.join(",");
    }
  }
  const { data: ret } = await getPending(query);
  page.records = ret;
  page.total = ret.length;
  page.pages = Math.ceil(page.total / request.size);
  getShowRecords();

  var siteSelected = siteList.list.find(e => e.id === request.siteId)
  siteTimeZone.timeZone = siteSelected.timeZone;

  page.loading = false;
}

function getShowRecords() {
  page.showRecords = [];
  const startIndex = (request.current * request.size) - 20;
  const endIndex = Math.min((request.current * request.size) - 1, page.total - 1);
  for (let i = startIndex; i <= endIndex; i++) {
    page.showRecords.push(page.records[i]);
  }
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id;
  await loadPendingRecords();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-start;
  margin-left: 140px;
}
</style>
