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
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 280px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.referrerName"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.referrer')"
        />
        <el-select
          multiple
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="margin-left: 5px; width: 240px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('distributeStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.event"
          size="small"
          :placeholder="t('fields.event')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
        >
          <el-option
            v-for="item in uiControl.event"
            :key="item.key"
            :label="t('referFriendEvent.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadReferFriendRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <div class="btn-group">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:refer-friend:distribute']" @click="distributeRefer()">
            {{ t('fields.distributeRefer') }}
          </el-button>
          <el-button
            icon="el-icon-download"
            size="mini"
            type="warning"
            v-permission="['sys:refer-friend:export']"
            @click="exportExcel"
          >{{ t('fields.exportToExcel') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.referFriendRecord') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="120">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="referrerName" :label="t('fields.referrer')" align="center" min-width="100">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.referrerId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.referrerName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="t('fields.amount')" align="center" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.amount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="rollover" :label="t('fields.rollover')" align="center" min-width="80" />
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'DISTRIBUTED'" size="mini" type="success">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else size="mini" type="warning">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="event" :label="t('fields.event')" align="center" min-width="140">
          <template #default="scope">
            {{ t('referFriendEvent.' + scope.row.event) }}
          </template>
        </el-table-column>
        <el-table-column prop="depositSerialNumber" :label="t('fields.depositSerialNo')" align="center" min-width="210">
          <template #default="scope">
            <span v-if="scope.row.depositSerialNumber === null">-</span>
            <span v-else>{{ scope.row.depositSerialNumber }}</span>
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
        <el-table-column prop="distributeBy" :label="t('fields.distributeBy')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.distributeBy === null">-</span>
            <span v-else>{{ scope.row.distributeBy }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distributeTime" :label="t('fields.distributeTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.distributeTime === null">-</span>
            <span
              v-if="scope.row.distributeTime !== null"
              v-formatter="{data: scope.row.distributeTime, timeZone: timeZone, type: 'date'}"
            />
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
        @size-change="loadReferFriendRecords()"
      />
    </el-card>
  </div>

  <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.progressBarVisible" append-to-body width="500px"
             :close-on-click-modal="false" :close-on-press-escape="false"
  >
    <el-progress :text-inside="true" :stroke-width="26" :percentage="exportPercentage"
                 :color="uiControl.colors" v-if="exportPercentage !== 100"
    />
    <el-result
      icon="success"
      :title="t('fields.successfullyExport')"
      v-if="exportPercentage === 100"
    />
    <div class="dialog-footer">
      <el-button type="primary" :disabled="exportPercentage !== 100"
                 @click="uiControl.progressBarVisible = false"
      >{{ t('fields.done') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { hasPermission } from '../../../utils/util'
import * as XLSX from 'xlsx';
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '../../../api/site';
import { useStore } from '../../../store';
import { TENANT } from '../../../store/modules/user/action-types';
import { distribute, getReferFriend } from '../../../api/refer-friend';
import { ElMessage, ElMessageBox } from 'element-plus';

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: []
});
let timeZone = null;
const exportPercentage = ref(0);
const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  status: [
    { key: 1, displayName: "PENDING", value: "PENDING" },
    { key: 2, displayName: "DISTRIBUTED", value: "DISTRIBUTED" }
  ],
  event: [
    { key: 1, displayName: "INFO", value: "INFO" },
    { key: 2, displayName: "FIRST", value: "FIRST" },
    { key: 3, displayName: "SECOND", value: "SECOND" }
  ]
});

const EXPORT_HEADER = [t('fields.loginName'), t('fields.referrer'), t('fields.event'), t('fields.status'), t('fields.amount'),
  t('fields.rollover'), t('fields.depositSerialNo'), t('fields.recordTime'), t('fields.distributeBy'), t('fields.distributeTime')];

const defaultDate = convertDate(new Date());

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultDate, defaultDate],
  siteId: null,
  loginName: null,
  referrerName: null,
  event: null,
  status: ["PENDING", "DISTRIBUTED"]
});

function resetQuery() {
  request.recordTime = [defaultDate, defaultDate];
  request.siteId = siteList.list[0].id;
  request.loginName = null;
  request.referrerName = null;
  request.event = null;
  request.status = ["PENDING", "DISTRIBUTED"];
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
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
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(",");
    }
  }
  if (request.status !== null) {
    if (request.status.length === 1) {
      query.status = request.status[0];
    } else {
      query.status = request.status.join(",");
    }
  }
  return query;
}

async function loadReferFriendRecords() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getReferFriend(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;

  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  page.loading = false;
}

function changepage(page) {
  request.current = page;
  loadReferFriendRecords();
}

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getReferFriend(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getReferFriend(query);
    pushRecordToData(ret.records, exportData);
    exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  }
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key];

      maxLength[key] = typeof value === 'number'
        ? (maxLength[key] >= 10 ? maxLength[key] : 10)
        : (maxLength[key] >= value.length + 2 ? maxLength[key] : value.length + 2);
    });
  });
  const wsCols = maxLength.map(w => { return { width: w } });
  ws['!cols'] = wsCols;
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Refer_Friend_Record');
  wb.Sheets.Refer_Friend_Record = ws;
  XLSX.writeFile(wb, "refer_friend_record.xlsx");
  exportPercentage.value = 100;
}

function pushRecordToData(records, exportData) {
  records.forEach(item => {
    delete item.id;
    delete item.memberId;
    delete item.referrerId;
  })
  const data = records.map(record => {
    record.event = t('referFriendEvent.' + record.event);
    record.status = t('distributeStatus.' + record.status);
    return Object.values(record).map(item => !item || item === '' ? '-' : item)
  });
  console.log(data)
  exportData.push(...data);
}

function distributeRefer() {
  ElMessageBox.confirm(
    t('message.confirmRefer'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    const query = checkQuery();
    await distribute(query);
    await loadReferFriendRecords();
    ElMessage({ message: t('message.referSuccess'), type: "success" });
  });
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
