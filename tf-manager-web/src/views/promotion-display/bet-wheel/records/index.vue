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
          value-format="YYYY-MM-DD"
          size="small"
          type="date"
          :placeholder="t('fields.recordTime')"
          style="width: 180px; margin-left: 10px;"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadBetWheelRecords">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
        <el-button
          icon="el-icon-download"
          size="mini"
          type="primary"
          v-permission="['sys:bet-wheel-records:export']"
          @click="exportExcel"
        >{{ t('fields.exportToExcel') }}
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
      <el-table-column prop="siteName" :label="t('fields.site')" width="250" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="250" />
      <el-table-column prop="validBet" :label="t('fields.validBet')" width="250">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.validBet,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="bonus" :label="t('fields.bonus')" width="280">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonus,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="sureWin" :label="t('fields.sureWin')" width="180">
        <template #default="scope">
          <el-tag v-if="scope.row.sureWin" size="mini" type="success">{{ t('fields.yes') }}</el-tag>
          <el-tag v-else size="mini" type="danger">{{ t('fields.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="recordTime"
        :label="t('fields.recordTime')"
        align="center"
        min-width="200"
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
      @current-change="loadBetWheelRecords"
      @size-change="loadBetWheelRecords"
    />
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

import { computed, reactive, ref } from "vue";
import * as XLSX from 'xlsx';
import { getSiteListSimple } from "@/api/site";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getBetWheelRecords } from "@/api/bet-wheel";
import moment from "moment";
import { getVipList } from "../../../../api/vip";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const exportPercentage = ref(0);

const EXPORT_HEADER = [t('fields.site'), t('fields.loginName'), t('fields.vipLevel'), t('fields.bonus'),
  t('fields.sureWin'), t('fields.recordTime')];

const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false
});
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  vipId: null,
  recordTime: convertDate(new Date())
});

const sites = reactive({
  list: []
});
const vips = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

async function loadBetWheelRecords() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getBetWheelRecords(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

async function loadVips() {
  const { data: vip } = await getVipList({ siteId: request.siteId });
  vips.list = vip;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.loginName = null;
  request.vipId = null;
  request.recordTime = convertDate(new Date());
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  return query;
}

function pushRecordToData(records, exportData) {
  records.forEach(item => {
    delete item.id;
    delete item.siteId;
    delete item.memberId;
    delete item.vipId;
  })
  const data = records.map(record => {
    if (record.sureWin) {
      record.sureWin = t('fields.yes')
    } else {
      record.sureWin = t('fields.no')
    }
    return Object.values(record).map(item => (!item || item === '' ? '-' : item))
  })
  exportData.push(...data)
}

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getBetWheelRecords(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getBetWheelRecords(query);
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
  wb.SheetNames.push('VIP_Wheel_Records');
  wb.Sheets.VIP_Wheel_Records = ws;
  XLSX.writeFile(wb, "vip_wheel_records.xlsx");
  exportPercentage.value = 100;
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadVips();
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
