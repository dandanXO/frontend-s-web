<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.referrerName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.referrer')"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadStatsAnalysis()">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="openExportDialog"
          v-permission="['sys:privi:member-refer-friend-analysis:export']"
        >
          {{ t('fields.requestExportToExcel') }}
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
      :summary-method="getSummaries"
      show-summary
      :empty-text="t('fields.noData')"
      :default-sort="{prop: 'successCount', order: 'descending'}"
      @sort-change="sort"
    >
      <el-table-column prop="referrerName" :label="t('fields.referrer')">
        <template #default="scope">
          <el-link type="primary" @click="redirectToReferPane(scope.row.referrerName)">
            {{ scope.row.referrerName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="referCount" :label="t('fields.referCount')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          <el-link type="primary" @click="redirectToReferPane(scope.row.referrerName)">
            {{ scope.row.referCount }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="referBonus" :label="t('fields.referBonus')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.referBonus, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="firstDepositCount" :label="t('fields.ftdCount')" sortable :sort-orders="sortOrders" />
      <el-table-column prop="successCount" :label="t('fields.successCount')" sortable :sort-orders="sortOrders" />
      <el-table-column prop="depositCount" :label="t('fields.depositCount')" sortable :sort-orders="sortOrders" />
      <el-table-column prop="depositBonus" :label="t('fields.depositBonus')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.depositBonus, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="betBonus" :label="t('fields.betBonus')" sortable :sort-orders="sortOrders">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.betBonus, type: 'money'}" />
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
      @current-change="loadStatsAnalysis"
      @size-change="loadStatsAnalysis"
    />
  </div>

  <el-dialog
    :title="t('fields.requestExportToExcel')"
    v-model="exportDialogVisible"
    append-to-body
    width="900px"
    style="height: 600px;"
  >
    <div style="height: 500px; overflow-y: auto;">
      <el-form :inline="true" size="small" label-width="180px">
        <el-form-item :label="t('fields.recordDate')">
          <el-date-picker
            v-model="exportRequest.recordTime"
            type="daterange"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          @click="chooseExportFile"
        >
          {{ t('fields.import') }}
        </el-button>
        <el-button
          icon="el-icon-download"
          size="mini"
          type="primary"
          @click="downloadTemplate"
        >
          {{ t('fields.downloadTemplate') }}
        </el-button>
      </el-form>

      <input
        id="exportFile"
        type="file"
        accept=".csv, .xlsx, .xls"
        @change="handleFileImport"
        hidden
      >

      <el-table
        :data="exportMemberList"
        v-loading="exportLoading"
        size="small"
        :empty-text="t('fields.noData')"
        style="margin-top: 15px"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" />
      </el-table>

      <div class="dialog-footer" style="margin-top: 15px">
        <el-button
          type="primary"
          :disabled="exportMemberList.length === 0"
          @click="confirmExport"
          :loading="exportButtonLoading"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
        <el-button @click="exportDialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
      </div>
    </div>
  </el-dialog>

  <el-dialog :title="t('fields.exportToExcel')" v-model="messageVisible" append-to-body width="500px"
             :close-on-click-modal="false" :close-on-press-escape="false"
  >
    <span>{{ t('message.requestExportToExcelDone1') }}</span>
    <router-link :to="`/site-management/download-manager`">
      <el-link type="primary">
        {{ t('menu.DownloadManager') }}
      </el-link>
    </router-link>
    <span>{{ t('message.requestExportToExcelDone2') }}</span>
  </el-dialog>

</template>

<script setup>

import { computed, reactive, ref } from "vue"; // defineEmits
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { getShortcuts } from "@/utils/datetime";
import { getAnalysisRecord, getAnalysisRecordExport } from "@/api/member-refer-friend-analysis";
import { getSiteListSimple } from "@/api/site";
import { ElMessage } from "element-plus";
import * as XLSX from 'xlsx'
import { useRouter } from "vue-router";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const shortcuts = getShortcuts(t);
// const emits = defineEmits(["switch-to-relation-tab"]);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD');
}

const sortOrders = ['descending', 'ascending', null]

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  referrerName: null,
  recordTime: [convertDate(new Date()), convertDate(new Date())],
  orderBy: null,
  sortType: null,
});

const sites = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  sums: [],
});

async function loadStatsAnalysis() {
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
  const { data: ret } = await getAnalysisRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.sums = ret.sums;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.recordTime = [convertDate(new Date()), convertDate(new Date())];
  request.referrerName = null;
}

function getSummaries(param) {
  const { columns } = param
  var sums = []
  if (page.sums) {
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = t('fields.total')
      } else {
        var prop = column.property
        if (
          index === 1 ||
          index === 3 ||
          index === 4 ||
          index === 5
        ) {
          sums[index] = page.sums[prop]
        } else {
          sums[index] =
            '$' +
            parseFloat(page.sums[prop]).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        }
      }
    })
  }
  return sums
}

const router = useRouter();

function redirectToReferPane(referrerName) {
  const query = {
    referrerName,
    recordTime: request.recordTime
  }

  router.push({
    path: '/promo-activity/member-refer/member-refer-relation',
    query: query
  });
  // emits('switch-to-relation-tab', query)
}

const sort = (column) => {
  request.orderBy = column.prop;
  if (column.order === "descending") {
    request.sortType = "DESC";
  } else {
    request.sortType = "ASC";
  }
  loadStatsAnalysis();
};

// 新增导出相关状态
const messageVisible = ref(false)
const exportDialogVisible = ref(false)
const exportLoading = ref(false)
const exportButtonLoading = ref(false)
const exportMemberList = ref([])

const exportRequest = reactive({
  recordTime: [convertDate(new Date()), convertDate(new Date())],
  loginNames: []
})

const EXPORT_LOGIN_NAME_HEADER = ['loginName']

function setWidth(exportData, maxLength) {
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key];

      maxLength[key] =
        typeof value === 'number'
          ? maxLength[key] >= 10
            ? maxLength[key]
            : 10
          : maxLength[key] >= value.length + 2
            ? maxLength[key]
            : value.length + 2
    });
  });
}

function openExportDialog() {
  exportDialogVisible.value = true
  messageVisible.value = false
  exportMemberList.value = []
  exportRequest.loginNames = []
  exportRequest.recordTime = [convertDate(new Date()), convertDate(new Date())]
}

function chooseExportFile() {
  document.getElementById('exportFile').click()
}

function handleFileImport(event) {
  exportLoading.value = true
  const file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(firstSheet)

    // 检查上传数量是否超过100个
    if (jsonData.length > 100) {
      ElMessage.error(t('message.uploadLimitExceeded', { count: 100 }));
      exportLoading.value = false;
      event.target.value = '';
      return;
    }

    exportMemberList.value = jsonData.map(item => ({
      loginName: item.loginName
    }))

    exportRequest.loginNames = exportMemberList.value.map(m => m.loginName)
    exportLoading.value = false
  }

  reader.readAsArrayBuffer(file)
  event.target.value = '' // 重置input
}

async function downloadTemplate() {
  const exportData = [EXPORT_LOGIN_NAME_HEADER]
  const maxLength = []
  const ws = XLSX.utils.aoa_to_sheet(exportData)
  setWidth(exportData, maxLength)
  ws['!cols'] = maxLength.map(w => ({ width: w }))

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Member_Refer_Analysis_Stats')
  wb.Sheets.Member_Refer_Analysis_Stats = ws
  XLSX.writeFile(wb, 'Member_Refer_Analysis_Stats_Template.xlsx')
}

async function confirmExport() {
  exportButtonLoading.value = true

  try {
    const query = {
      recordTime: exportRequest.recordTime.join(','),
      referrerNames: exportRequest.loginNames.join(','),
      requestBy: store.state.user.name,
      requestTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      siteId: request.siteId
    }
    const { data: ret } = await getAnalysisRecordExport(query)
    if (ret) {
      messageVisible.value = true
      exportDialogVisible.value = false
    }
  } catch (error) {
    ElMessage.error(t('message.exportFailed'))
  } finally {
    exportButtonLoading.value = false
  }
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadStatsAnalysis();
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
.el-overlay-dialog .el-image {
  width: 100px;
  height: 100px;
  background-color: #c1c1c1;
}
</style>
