<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          style="width: 120px"
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
          v-model="request.requestTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 380px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
          @blur="calendarBlur"
          @calendar-change="calendarChange"
        />
        <el-input
          v-if="LOGIN_USER_TYPE === ADMIN.value"
          v-model="request.requestBy"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.requestBy')"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="table-header-container">
          <div class="title"><span class="role-span">{{ t('fields.downloadManagerRecord') }}</span></div>
          <div class="refresh-btn">
            <el-button
              v-if="page.records.length > 0"
              icon="el-icon-refresh"
              size="mini"
              type="primary"
              @click="loadRecords()"
            >{{ t('fields.updateProgress') }}</el-button>
          </div>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="jobName" :label="t('fields.jobName')" align="center" min-width="150" />
        <el-table-column prop="requestBy" :label="t('fields.requestBy')" align="center" min-width="100" />
        <el-table-column prop="requestTime" :label="t('fields.requestTime')" align="center" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.requestTime === null">-</span>
            <span
              v-if="scope.row.requestTime !== null"
              v-formatter="{data: scope.row.requestTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="progress" :label="t('fields.progress')" align="center" min-width="80">
          <template #default="scope">
            <span> {{ scope.row.progress }} %</span>
          </template>
        </el-table-column>
        <el-table-column prop="downloadUrl" :label="t('fields.download')" align="center" min-width="100">
          <template #default="scope">
            <a v-if="scope.row.progress === 100" class="el-button el-button--primary" :href="downloadLinkPrefix + '/' + scope.row.downloadUrl">{{ t('fields.download') }}</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150, 200]"
        @current-change="changepage"
        layout="total,sizes,prev, pager, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadRecords()"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import moment from 'moment';
import { getExportList } from '../../../api/download-manager';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '../../../api/site';
import { useStore } from '../../../store';
import { TENANT, ADMIN } from '../../../store/modules/user/action-types';

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const downloadLinkPrefix = process.env.VUE_APP_IMAGE
let selectedDate = "";
const siteList = reactive({
  list: []
});

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];

const date = new Date();
const defaultStartDate = convertStartDate(date);
const defaultEndDate = convertDate(date);

const request = reactive({
  size: 20,
  current: 1,
  requestTime: [defaultStartDate, defaultEndDate],
  requestBy: null,
  siteId: null,
});

function resetQuery() {
  request.requestTime = [defaultStartDate, defaultEndDate];
  request.siteId = siteList.list[0].id;
  request.requestBy = null;
}

const page = reactive({
  pages: 0,
  records: [],
  pagingState: '',
  loading: false
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD') + ' 23:59:59';
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function disabledDate(time) {
  if (selectedDate) {
    return time.getTime() < moment(selectedDate).startOf('month').format('x') || (time.getTime() > new Date().getTime() || time.getTime() > moment(selectedDate).endOf('month').format('x'));
  }
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

function calendarBlur() {
  selectedDate = null;
}

function calendarChange(date) {
  selectedDate = date[0];
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
  request.siteId = siteList.list[0].id;
};

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.requestTime !== null) {
    if (request.requestTime.length === 2) {
      query.requestTime = request.requestTime.join(",");
    }
  }
  if (LOGIN_USER_TYPE.value !== ADMIN.value) {
    query.requestBy = store.state.user.name
  }
  return query;
}

function changepage(page) {
  request.current = page;
  loadRecords();
}

async function loadRecords() {
  page.loading = true;
  const query = checkQuery();
  query.pagingState = page.pagingState
  const { data: ret } = await getExportList(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadRecords();
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 20px 0 20px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

.btn-group {
  margin-top: 15px;
}

.table-header-container{
  height: 20px;

  .title{
    float: left;
    vertical-align: middle;
  }
  .refresh-btn{
    float: right;
    vertical-align: middle;
  }
}
</style>
