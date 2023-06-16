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
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="request.loginName" style="width: 200px; margin-left: 10px" size="small" maxlength="50" :placeholder="t('fields.loginName')" />
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="date"
          :placeholder="t('fields.recordTime')"
          style="width: 200px; margin-left: 10px"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadBetRecordImport"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          v-permission="['sys:bet-record-import:import']"
          @click="uiControl.importDialogVisible = true"
        >
          {{ t('fields.massImport') }}
        </el-button>
      </div>
    </div>

    <el-dialog
      :title="t('fields.massImport')"
      v-model="uiControl.importDialogVisible"
      append-to-body
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-button
          icon="el-icon-download"
          size="mini"
          type="primary"
          @click="downloadTemplate"
        >
          {{ t('fields.downloadTemplate') }}
        </el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          @click="chooseFile"
        >
          {{ t('fields.import') }}
        </el-button>
        <!-- eslint-disable -->
        <input
          id="importFile"
          type="file"
          accept=".xlsx, .xls"
          @change="importToTable"
          hidden
        />
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-form
          ref="importRefForm"
          :model="importForm"
          :rules="importRules"
          :inline="true"
          size="small"
          label-width="150px"
          style="float: right;"
        >
          <el-form-item :label="t('fields.site')" prop="siteId">
            <el-select
              v-model="importForm.siteId"
              :placeholder="t('fields.site')"
              style="width: 300px;"
              default-first-option
              required
              @focus="loadSites"
            >
              <el-option
                v-for="item in siteList.list"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.gameType')" prop="gameType">
            <el-select
              v-model="importForm.gameType"
              :placeholder="t('fields.gameType')"
              style="width: 300px;"
              default-first-option
              required
              @focus="loadGameTypes"
            >
              <el-option
                v-for="item in gameTypes.list"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.platform')" prop="platform">
            <el-select
              v-model="importForm.platform"
              :placeholder="t('message.selectSiteAndGameTypeFirst')"
              style="width: 300px;"
              filterable
              default-first-option
              required
              @focus="loadPlatforms"
              :disabled="!importForm.siteId || !importForm.gameType"
            >
              <el-option
                v-for="item in platforms.list"
                :key="item.id"
                :label="item.code"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.recordTime')" prop="recordTime">
            <el-date-picker
              v-model="importForm.recordTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="small"
              type="date"
              :placeholder="t('fields.date')"
              style="width: 300px"
              :disabled-date="disabledDate"
              :editable="false"
            />
          </el-form-item>
        </el-form>
      </el-row>
      <el-table
        :data="
          importedPage.records.slice(
            importedPage.size * (importedPage.current - 1),
            importedPage.size * importedPage.current
          )
        "
        v-loading="importedPage.loading"
        ref="table"
        row-key="id"
        size="small"
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" width="330" />
        <el-table-column prop="bet" :label="t('fields.bet')" width="330" />
        <el-table-column prop="payout" :label="t('fields.payout')" width="330" />
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changeImportedPage"
        layout="prev, pager, next"
        :page-size="importedPage.size"
        :page-count="importedPage.pages"
        :current-page="importedPage.current"
      />
      <div class="dialog-footer">
        <el-button
          type="primary"
          :disabled="importedPage.records.length === 0 || !importForm.siteId || !importForm.gameType || !importForm.platform || !importForm.recordTime"
          @click="confirmImport"
          :loading="importedPage.buttonLoading"
        >
          {{ t('fields.confirmAndImport') }}
        </el-button>
        <el-button @click="clearImport">{{ t('fields.cancel') }}</el-button>
      </div>
    </el-dialog>

    <el-table
      size="small"
      :data="page.records"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="site" :label="t('fields.site')" min-width="100" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="120">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
      <el-table-column prop="platform" :label="t('fields.platform')" min-width="120" />
      <el-table-column prop="gameType" :label="t('fields.gameType')" min-width="120" />
      <el-table-column prop="bet" :label="t('fields.bet')" min-width="120">
        <template #default="scope">
          $
          <span
            v-formatter="{data: scope.row.bet, type: 'money'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="payout" :label="t('fields.payout')" min-width="120">
        <template #default="scope">
          $
          <span
            v-formatter="{data: scope.row.payout, type: 'money'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="recordTime" :label="t('fields.recordTime')" min-width="150" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" min-width="120" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" min-width="150" />
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadBetRecordImport"
      @size-change="loadBetRecordImport"
    />
  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import * as XLSX from 'xlsx';
import { required } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import { getBetRecordImport, createBatchBetRecord } from "../../../api/bet-record-import";
import { getSiteListSimple } from "../../../api/site";
import { getGameTypes } from "../../../api/game";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { hasPermission } from '../../../utils/util'
import { getPlatformsBySiteAndGameType } from "../../../api/platform";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const importRefForm = ref(null);
const siteList = reactive({
  list: []
});
const gameTypes = reactive({
  list: []
});
const platforms = reactive({
  list: []
});

const EXPORT_BET_RECORD_IMPORT_LIST_HEADER = [
  '用户名',
  '投注额',
  '派彩'
]

const IMPORT_BET_RECORD_IMPORT_LIST_JSON = [
  'loginName',
  'bet',
  'payout'
]

const uiControl = reactive({
  progressBarVisible: false,
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 }
  ],
  importDialogVisible: false,
  balance: null
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  recordTime: null
});

const importForm = reactive({
  siteId: null,
  gameType: null,
  platform: null,
  recordTime: null
});

const importRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  gameType: [required(t('message.validateGameTypeRequired'))],
  platform: [required(t('message.validatePlatformRequired'))],
  recordTime: [required(t('message.validateRecordTimeRequired'))]
});

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
  request.siteId = siteList.list[0].id;
};

async function loadGameTypes() {
  const { data: gameType } = await getGameTypes()
  gameTypes.list = gameType;
}

async function loadPlatforms() {
  const { data: platform } = await getPlatformsBySiteAndGameType(importForm.siteId, importForm.gameType);
  platforms.list = platform;
}

function resetQuery() {
  request.recordTime = null;
  request.siteId = siteList.list[0].id;
  request.loginName = null;
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

async function loadBetRecordImport() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getBetRecordImport(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

async function downloadTemplate() {
  const exportBetRecordImport = [EXPORT_BET_RECORD_IMPORT_LIST_HEADER];
  const maxLengthBetRecordImport = [];
  const wsBetRecordImport = XLSX.utils.aoa_to_sheet(exportBetRecordImport);
  setWidth(exportBetRecordImport, maxLengthBetRecordImport);
  const wsBetRecordImportCols = maxLengthBetRecordImport.map(w => {
    return { width: w };
  });
  wsBetRecordImport['!cols'] = wsBetRecordImportCols;

  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Bet_Records_Import');
  wb.Sheets.Bet_Records_Import = wsBetRecordImport;
  XLSX.writeFile(wb, 'bet_records_import.xlsx');
}

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

function chooseFile() {
  document.getElementById('importFile').click();
}

function importToTable(file) {
  importedPage.loading = true;
  importedPage.buttonLoading = false;
  const files = file.target.files[0];
  const allowFileType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  if (allowFileType.find(ftype => ftype.includes(files.type))) {
    const fileReader = new FileReader();

    fileReader.onload = async event => {
      const { result } = event.target;
      const workbook = XLSX.read(result, { type: 'binary' });
      let data = [];
      for (const sheet in workbook.Sheets) {
        data = data.concat(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: IMPORT_BET_RECORD_IMPORT_LIST_JSON,
            range: 1,
          })
        );
        break;
      }
      console.log(data)
      importedPage.records = data;
      importedPage.pages = Math.ceil(
        importedPage.records.length / importedPage.size
      );
    }
    fileReader.readAsBinaryString(files);
    document.getElementById('importFile').value = '';
  } else {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' });
  }
  importedPage.loading = false;
}

function changeImportedPage(page) {
  importedPage.current = page;
}

function clearImport() {
  uiControl.importDialogVisible = false;
  importedPage.buttonLoading = false;
  importedPage.loading = false;
  importedPage.records = [];
  importedPage.pages = 0;
  importedPage.current = 1;
  importForm.siteId = null;
  importForm.gameType = null;
  importForm.platform = null;
  importForm.recordTime = null;
}

async function confirmImport() {
  importRefForm.value.validate(async (valid) => {
    if (valid) {
      importedPage.buttonLoading = true;
      const recordCopy = { ...importedPage.records };
      const data = [];
      Object.entries(recordCopy).forEach(([key, value]) => {
        const item = {};
        if (value) {
          item.siteId = importForm.siteId;
          item.gameType = importForm.gameType;
          item.platform = importForm.platform;
          item.recordTime = importForm.recordTime;
          Object.entries(value).forEach(([k, v]) => {
            item[k] = v;
          });
        }
        data.push(item);
      });

      const records = [...data];
      do {
        if (records.length > 10000) {
          await createBatchBetRecord(records.slice(0, 10000));
          records.splice(0, 10000);
        } else {
          await createBatchBetRecord(records);
          records.splice(0, records.length);
        }
      } while (records.length > 0)
      importedPage.buttonLoading = false;
      ElMessage({ message: t('message.importSuccess'), type: 'success' });
      clearImport();
      loadBetRecordImport();
      importForm.cause = null;
    }
  });
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadBetRecordImport()
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}
</style>
