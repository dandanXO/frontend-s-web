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
          style="margin-left: 5px; width: 380px"
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
        <el-select
          v-model="request.gameType"
          size="small"
          :placeholder="t('fields.gameType')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
          clearable
        >
          <el-option
            v-for="item in uiControl.gameType"
            :key="item.key"
            :label="t('gameType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          multiple
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="margin-left: 5px; width: 300px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('distributeStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadBetGameTypeRebateRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <div class="btn-group">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:bet-game-type-rebate-record:rebate']" @click="distributeRebate()">
            {{ t('fields.distributeRebate') }}
          </el-button>
          <el-button
            icon="el-icon-download"
            size="mini"
            type="warning"
            v-permission="['sys:bet-game-type-rebate-record:export']"
            @click="requestExportExcel"
          >{{ t('fields.exportToExcel') }}
          </el-button>
          <el-button
            icon="el-icon-upload"
            size="mini"
            type="danger"
            v-permission="['sys:bet-game-type-rebate-record:cancel']"
            @click="uiControl.importDialogVisible = true"
          >
            {{ t('fields.batchCancel') }}
          </el-button>
          <el-button
            icon="el-icon-close"
            size="mini"
            type="danger"
            v-permission="['sys:bet-game-type-rebate-record:cancel']"
            @click="cancelBySearch"
          >
            {{ t('fields.cancelBySearch') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.betRebateRecord') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
                sortable
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="120">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="siteName" :label="t('fields.site')" align="center" min-width="100" />
        <el-table-column prop="validBet" :label="t('fields.betAmount')" align="center" min-width="100" sortable>
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.validBet,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column v-if="request.siteId !== 3" prop="rebatePercentage" :label="t('fields.rebatePercentage')" align="center" min-width="120">
          <template #default="scope">
            {{ (scope.row.rebatePercentage * 100).toFixed(2) }} %
          </template>
        </el-table-column>
        <el-table-column prop="rebateAmount" :label="t('fields.amount')" align="center" min-width="100" sortable>
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.rebateAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column v-if="request.siteId !== 3" prop="maxRebate" :label="t('fields.maxRebate')" align="center" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.maxRebate">$ <span v-formatter="{data: scope.row.maxRebate,type: 'money'}" /></span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'DISTRIBUTED'" size="mini" type="success">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else-if="scope.row.status === 'IN_PROGRESS'" size="mini" type="warning">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else-if="scope.row.status === 'PENDING'" size="mini" type="primary">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else size="mini" type="danger">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gameType" :label="t('fields.gameType')" align="center" min-width="100">
          <template #default="scope">
            {{ t('gameType.' + scope.row.gameType) }}
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" :label="t('fields.rebateDistributeTime')" align="center" min-width="150">
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
        <el-table-column prop="updateBy" :label="t('fields.updateBy')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.updateBy === null">-</span>
            <span v-else>{{ scope.row.updateBy }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="t('fields.updateTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.updateTime === null">-</span>
            <span
              v-if="scope.row.updateTime !== null"
              v-formatter="{data: scope.row.updateTime, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="280"
          v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:bet-game-type-rebate-record:update']) || hasPermission(['sys:bet-game-type-rebate-record:update-bet']) || hasPermission(['sys:bet-game-type-rebate-record:detail']))"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="mini"
              type="success"
              v-permission="['sys:bet-game-type-rebate-record:update']"
              @click="showEdit('AMOUNT', scope.row)"
            >
              {{ t('fields.adjustAmount') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="mini"
              type="success"
              v-permission="['sys:bet-game-type-rebate-record:update-bet']"
              @click="showEdit('BET_AMOUNT', scope.row)"
            >
              {{ t('fields.adjustBetAmount') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:10px;">
        <span>{{ t('fields.totalValidBet') }}: $ <span v-formatter="{data: page.totalValidBet,type: 'money'}" /></span>
        <span style="margin-left:20px;">{{ t('fields.totalRebateAmount') }}: $ <span v-formatter="{data: page.totalRebateAmount,type: 'money'}" /></span>
      </div>
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150, 200]"
        @current-change="changepage"
        layout="total,sizes,prev, pager, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadBetGameTypeRebateRecords()"
      />
    </el-card>
  </div>

  <el-dialog
    :title="t('fields.exportToExcel')"
    v-model="uiControl.messageVisible"
    append-to-body
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <span>{{ t('message.requestExportToExcelDone1') }}</span>
    <router-link :to="`/site-management/download-manager`">
      <el-link type="primary">
        {{ t('menu.DownloadManager') }}
      </el-link>
    </router-link>
    <span>{{ t('message.requestExportToExcelDone2') }}</span>
  </el-dialog>

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    :width="uiControl.dialogWidth"
  >
    <el-form
      v-if="uiControl.dialogType === 'ADJUST'"
      ref="adjustForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item
        :label="t('fields.adjustAmount')"
        prop="rebateAmount"
        @keypress="restrictDecimalInput($event)"
      >
        <el-input v-model="form.rebateAmount" style="width: 350px;" />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="adjust">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
    <el-form
      v-else-if="uiControl.dialogType === 'ADJUST_BET'"
      ref="adjustForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item
        :label="t('fields.adjustBetAmount')"
        prop="validBet"
        @keypress="restrictDecimalInput($event)"
      >
        <el-input v-model="form.validBet" style="width: 350px;" />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="adjustBet">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
    :title="t('fields.batchCancel')"
    v-model="uiControl.importDialogVisible"
    append-to-body
    width="1000px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
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
          style="width: 150px;"
          filterable
          default-first-option
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
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
          :placeholder="t('fields.recordTime')"
          style="margin-left: 5px; width: 150px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
      </el-form-item>
    </el-form>
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
      <el-table-column prop="memberId" :label="t('fields.memberId')" width="300" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="330" />
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
        :disabled="importedPage.records.length === 0"
        @click="confirmImport"
        :loading="importedPage.buttonLoading"
      >
        {{ t('fields.confirmAndImport') }}
      </el-button>
      <el-button @click="clearImport">{{ t('fields.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { hasRole, hasPermission } from '../../../utils/util'
import * as XLSX from 'xlsx';
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '../../../api/site';
import { useStore } from '../../../store';
import { TENANT } from '../../../store/modules/user/action-types';
import { adjustAmount, adjustBetAmount, distribute, getTotal, getBetGameTypeRebateRecord, getBetGameTypeRebateRecordForExport, batchCancel, cancelByQuery } from '../../../api/bet-game-type-rebate-record';
import { required } from '../../../utils/validate';
import { ElMessage, ElMessageBox } from 'element-plus';
import { findIdByLoginName } from '../../../api/member';

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const adjustForm = ref(null)
const importRefForm = ref(null);
const site = ref(null)
const siteList = reactive({
  list: []
});
let timeZone = null;
const uiControl = reactive({
  dialogTitle: "",
  dialogType: "",
  dialogVisible: false,
  dialogWidth: '580px',
  messageVisible: false,
  gameType: [
    { key: 1, displayName: "SLOT", value: "SLOT" },
    { key: 2, displayName: "LIVE", value: "LIVE" },
    { key: 3, displayName: "FISH", value: "FISH" },
    { key: 4, displayName: "SPORT", value: "SPORT" },
    { key: 5, displayName: "ESPORT", value: "ESPORT" },
    { key: 6, displayName: "POKER", value: "POKER" },
    { key: 7, displayName: "LOTTERY", value: "LOTTERY" },
    { key: 8, displayName: "CASUAL", value: "CASUAL" }
  ],
  status: [
    { key: 1, displayName: "PENDING", value: "PENDING" },
    { key: 2, displayName: "IN_PROGRESS", value: "IN_PROGRESS" },
    { key: 3, displayName: "DISTRIBUTED", value: "DISTRIBUTED" },
    { key: 4, displayName: "CANCEL", value: "CANCEL" }
  ],
  importDialogVisible: false
});

const EXPORT_CANCEL_REBATE_LIST_HEADER = [
  'Login Name',
]

const IMPORT_CANCEL_REBATE_LIST_JSON = [
  'loginName',
]

const form = reactive({
  id: null,
  rebateAmount: null,
  validBet: null
})

const defaultDate = convertDate(new Date());

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultDate, defaultDate],
  siteId: null,
  loginName: null,
  gameType: [],
  status: ["PENDING", "DISTRIBUTED", "CANCEL"]
});

function resetQuery() {
  request.recordTime = [defaultDate, defaultDate];
  request.siteId = siteList.list[0].id;
  request.loginName = null;
  request.gameType = [];
  request.status = ["PENDING", "DISTRIBUTED", "CANCEL"];
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  totalRebateAmount: 0,
  totalValidBet: 0
});

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

const importForm = reactive({
  siteId: null,
  recordTime: convertDate(new Date())
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    form.rebateAmount !== null &&
    form.rebateAmount.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
  }
}

const formRules = reactive({
  rebateAmount: [required(t('message.validateAmountRequired'))],
  validBet: [required(t('message.validateBetAmountRequired'))],
})

const importRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  recordTime: [required(t('message.validateRecordTimeRequired'))]
});

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
  request.siteId = siteList.list[0].id;
  importForm.siteId = siteList.list[0].id
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

async function loadBetGameTypeRebateRecords() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getBetGameTypeRebateRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  const { data: total } = await getTotal(query);
  page.totalRebateAmount = total.totalRebate;
  page.totalValidBet = total.totalValidBet;

  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  page.loading = false;
}

function changepage(page) {
  request.current = page;
  loadBetGameTypeRebateRecords();
}

function showEdit(type, adjust) {
  if (adjustForm.value) {
    adjustForm.value.resetFields()
  }
  form.id = adjust.id
  if (type === 'AMOUNT') {
    uiControl.dialogTitle = t('fields.adjustAmount')
    uiControl.dialogType = 'ADJUST'
  } else if (type === 'BET_AMOUNT') {
    uiControl.dialogTitle = t('fields.adjustBetAmount')
    uiControl.dialogType = 'ADJUST_BET'
  }
  uiControl.dialogWidth = '580px'
  uiControl.dialogVisible = true
}

async function adjust() {
  adjustForm.value.validate(async valid => {
    if (valid) {
      await adjustAmount(form.id, form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.adjustSuccess'), type: 'success' })
      await loadBetGameTypeRebateRecords()
    }
  });
}

async function adjustBet() {
  adjustForm.value.validate(async valid => {
    if (valid) {
      await adjustBetAmount(form.id, form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.adjustSuccess'), type: 'success' })
      await loadBetGameTypeRebateRecords()
    }
  });
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await getBetGameTypeRebateRecordForExport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

function distributeRebate() {
  ElMessageBox.confirm(
    t('message.confirmRebate'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(() => {
    const query = checkQuery();
    distribute(query);
    ElMessage({ message: t('message.rebateSuccess'), type: "success" });
  });
}

async function downloadTemplate() {
  const exportCancelRebate = [EXPORT_CANCEL_REBATE_LIST_HEADER];
  const maxLengthCancelRebate = [];
  const wsCancelRebate = XLSX.utils.aoa_to_sheet(exportCancelRebate);
  setWidth(exportCancelRebate, maxLengthCancelRebate);
  const wsCancelRebateCols = maxLengthCancelRebate.map(w => {
    return { width: w };
  });
  wsCancelRebate['!cols'] = wsCancelRebateCols;

  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Cancel_Rebate');
  wb.Sheets.Cancel_Rebate = wsCancelRebate;
  XLSX.writeFile(wb, 'cancel_rebate.xlsx');
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
            header: IMPORT_CANCEL_REBATE_LIST_JSON,
            range: 1,
          })
        );
        for (const d of data) {
          const { data: id } = await findIdByLoginName(d.loginName, importForm.siteId);
          d.memberId = id;
        }
        break;
      }
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
  importForm.cause = null;
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
          item.recordTime = importForm.recordTime;
          Object.entries(value).forEach(([k, v]) => {
            if (k !== "loginName") {
              item[k] = v;
            }
          });
        }
        data.push(item);
      });

      const records = [...data];
      do {
        if (records.length > 10000) {
          await batchCancel(records.slice(0, 10000));
          records.splice(0, 10000);
        } else {
          await batchCancel(records);
          records.splice(0, records.length);
        }
      } while (records.length > 0)
      importedPage.buttonLoading = false;
      ElMessage({ message: t('message.cancelSuccess'), type: 'success' });
      clearImport();
      loadBetGameTypeRebateRecords();
      importForm.cause = null;
    }
  });
}

async function cancelBySearch() {
  ElMessageBox.confirm(
    t('message.confirmCancelRebate'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    const query = checkQuery();
    await cancelByQuery(query);
    ElMessage({ message: t('message.cancelSuccess'), type: "success" });
    loadBetGameTypeRebateRecords()
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
