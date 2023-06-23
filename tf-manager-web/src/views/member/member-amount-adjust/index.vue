<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
          @change="loadReqCause"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="request.loginName" style="width: 200px; margin-left: 10px" size="small" maxlength="50" :placeholder="t('fields.loginName')" />
        <el-select
          clearable
          v-model="request.cause"
          size="small"
          :placeholder="t('fields.cause')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadReqCause"
        >
          <el-option
            v-for="item in reqAdjustTypeList.list"
            :key="item.id"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.operationType"
          size="small"
          :placeholder="t('fields.operationType')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.operationType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberAmountAdjust"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:amount:adjust:add']"
          @click="showDialog('CREATE_ADD')"
        >{{ t('fields.add') }}</el-button>
        <el-button
          icon="el-icon-minus"
          size="mini"
          type="danger"
          v-permission="['sys:amount:adjust:deduct']"
          @click="showDialog('CREATE_DEDUCT')"
        >{{ t('fields.deduct') }}</el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          v-permission="['sys:amount:adjust:import']"
          @click="uiControl.importDialogVisible = true"
        >
          {{ t('fields.massImport') }}
        </el-button>
        <el-button
          icon="el-icon-download"
          size="mini"
          type="primary"
          v-permission="['sys:amount:adjust:export:list']"
          @click="exportExcel"
        >{{ t('fields.exportToExcel') }}
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
      <el-button
        icon="el-icon-download"
        size="mini"
        type="primary"
        v-permission="['sys:amount:adjust:export']"
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
            style="width: 350px;"
            filterable
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
        </el-form-item>
        <el-form-item :label="t('fields.cause')" prop="cause">
          <el-select
            v-model="importForm.cause"
            :placeholder="t('fields.cause')"
            style="width: 350px;"
            filterable
            default-first-option
            required
            @focus="loadAdjustType"
          >
            <el-option
              v-for="item in importAdjustTypeList.list"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
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
        <el-table-column prop="amount" :label="t('fields.amount')" width="330" />
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

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="memberAmountAdjustForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.site')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadSites"
            @change="loadFormSelect"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px" />
          <span v-if="uiControl.dialogType === 'CREATE_DEDUCT'" style="display: block">{{ t('fields.balance') }}: $ <span v-formatter="{data: uiControl.balance,type: 'money'}" /></span>
        </el-form-item>
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input v-model="form.amount" style="width: 350px" maxlength="11" @keypress="restrictDecimalInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.cause')" prop="cause">
          <el-select
            v-model="form.cause"
            :placeholder="t('fields.cause')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadCauseBySiteId"
            :disabled="!form.siteId"
          >
            <el-option
              v-for="item in adjustTypeList.list"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" :rows="6" v-model="form.remark" style="width: 350px" maxlength="500" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button v-if="uiControl.dialogType === 'CREATE_ADD'" type="primary" @click="createAdd">{{ t('fields.confirm') }}</el-button>
          <el-button v-if="uiControl.dialogType === 'CREATE_DEDUCT'" type="primary" @click="createDeduct">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

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
      <el-table-column prop="cause" :label="t('fields.cause')" min-width="180" />
      <el-table-column prop="amount" :label="t('fields.amount')" min-width="120">
        <template #default="scope">
          $
          <span
            v-formatter="{data: scope.row.amount, type: 'money'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="beforeAmount" :label="t('fields.beforeAmount')" min-width="120">
        <template #default="scope">
          $
          <span
            v-formatter="{data: scope.row.beforeAmount, type: 'money'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="afterAmount" :label="t('fields.afterAmount')" min-width="120">
        <template #default="scope">
          $
          <span
            v-formatter="{data: scope.row.afterAmount, type: 'money'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="t('fields.remark')" min-width="180">
        <template #default="scope">
          <span v-if="scope.row.remark === null">-</span>
          <span v-if="scope.row.remark !== null">{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" min-width="150" />
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
      @current-change="loadMemberAmountAdjust"
      @size-change="loadMemberAmountAdjust"
    />
    <div class="table-footer">
      <span>{{ t('fields.totalReimburseAmount') }}</span>
      <span style="margin-left: 10px">$ </span>
      <span v-formatter="{data: page.totalReimburse, type: 'money'}" />
      <span style="margin-left: 20px">{{ t('fields.noOfReimbursement') }}</span>
      <span style="margin-left: 10px"> {{ page.numberOfReimbursement }}</span>
      <span style="margin-left: 20px">{{ t('fields.totalDeductAmount') }}</span>
      <span style="margin-left: 10px">$ </span>
      <span v-formatter="{data: page.totalDeduct, type: 'money'}" />
      <span style="margin-left: 20px">{{ t('fields.noOfDeduction') }}</span>
      <span style="margin-left: 10px"> {{ page.numberOfDeduction }}</span>
    </div>
  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import * as XLSX from 'xlsx';
import { required } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import moment from 'moment';
import {
  createAddMemberAmountAdjust, createDeductMemberAmountAdjust, getMemberAmountAdjust, getTotalReimburseAmount,
  getTotalDeductionAmount, getNumberOfReimburse, getNumberOfDeduct, createBatchAmountAdjust, getExport
} from "../../../api/member-amount-adjust";
import { getSiteListSimple } from "../../../api/site";
import { findIdByLoginName, getMemberBalanceByLoginNameSite } from "../../../api/member";
import { getConfigList } from '../../../api/config';
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { hasPermission } from '../../../utils/util'

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const memberAmountAdjustForm = ref(null);
const importRefForm = ref(null);
const siteList = reactive({
  list: []
});
const adjustTypeList = reactive({
  list: []
})
const reqAdjustTypeList = reactive({
  list: []
})
const importAdjustTypeList = reactive({
  list: []
})
const exportPercentage = ref(0);

const EXPORT_HEADER = ['ID', 'Site', 'Member ID', 'Login Name', 'Cause', 'Amount', 'Before Amount', 'After Amount',
  'Remark', 'Create By', 'Create Time'];

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date();
      const start = new Date();
      return [start, end];
    }
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'days').format('x'));
      end.setTime(moment(end).subtract(1, 'days').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('isoWeek').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'weeks').startOf('isoWeek').format('x'));
      end.setTime(moment(end).subtract(1, 'weeks').endOf('isoWeek').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('month').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'months').startOf('month').format('x'));
      end.setTime(moment(end).subtract(1, 'months').endOf('month').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.last3Months'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(2, 'months').startOf('month').format('x'));
      return [start, end];
    }
  }
];

const EXPORT_AMOUNT_ADJUST_LIST_HEADER = [
  'Login Name',
  'Amount'
]

const IMPORT_AMOUNT_ADJUST_LIST_JSON = [
  'loginName',
  'amount'
]

const uiControl = reactive({
  progressBarVisible: false,
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 }
  ],
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE_ADD",
  editBtn: true,
  removeBtn: true,
  operationType: [
    { key: 1, displayName: "ADD", value: "ADD" },
    { key: 2, displayName: "DEDUCT", value: "DEDUCT" },
  ],
  importDialogVisible: false,
  balance: null
});

const startDate = new Date();
startDate.setDate(startDate.getDate() - 2);
const defaultStartDate = convertDate(startDate);
const defaultEndDate = convertDate(new Date());

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalReimburse: 0,
  numberOfReimbursement: 0,
  totalDeduct: 0,
  numberOfDeduction: 0
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
  createTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  loginName: null,
  operationType: null,
  cause: null
});

const form = reactive({
  id: null,
  siteId: null,
  memberId: null,
  loginName: null,
  amount: null,
  cause: null,
  remark: null
});

const importForm = reactive({
  cause: null,
  siteId: null
});

const loginNameValidator = async(rule, value, callback) => {
  if (uiControl.dialogType === 'CREATE_DEDUCT') {
    const { data: bal } = await getMemberBalanceByLoginNameSite(value, form.siteId);
    if (bal === null || bal === undefined) {
      callback(new Error(t('message.memberNotInSite')));
    } else {
      uiControl.balance = bal;
      callback();
    }
  } else {
    uiControl.balance = null;
    const { data: bal } = await getMemberBalanceByLoginNameSite(value, form.siteId);
    if (bal === null || bal === undefined) {
      callback(new Error(t('message.memberNotInSite')));
    } else {
      callback();
    }
  }
};

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [required(t('message.validateLoginNameRequired')), { validator: loginNameValidator, trigger: "blur" }],
  amount: [required(t('message.validateAmountRequired'))],
  cause: [required(t('message.validateCauseRequired'))]
});

const importRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  cause: [required(t('message.validateCauseRequired'))]
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

async function loadFormSelect() {
  form.loginName = null;
  form.cause = null;
  uiControl.balance = null;
  await loadCauseBySiteId();
}

async function loadCauseBySiteId() {
  if (form.siteId) {
    const { data: adjustType } = await getConfigList("adjust_type", form.siteId);
    adjustTypeList.list = adjustType;
  }
}

async function loadReqCause() {
  const { data: adjustType } = await getConfigList("adjust_type", request.siteId);
  reqAdjustTypeList.list = adjustType;
}

async function loadAdjustType() {
  const { data: adjustType } = await getConfigList("adjust_type");
  importAdjustTypeList.list = adjustType;
}

function resetQuery() {
  request.createTime = [defaultStartDate, defaultEndDate];
  request.siteId = siteList.list[0].id;
  request.loginName = null;
  request.operationType = null;
  request.cause = null;
}

function checkQuery() {
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

  return query;
}

async function loadMemberAmountAdjust() {
  page.loading = true;
  page.totalReimburse = 0;
  page.totalDeduct = 0;
  page.numberOfReimbursement = 0;
  page.numberOfDeduction = 0;
  const query = checkQuery();
  const { data: ret } = await getMemberAmountAdjust(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  if (page.records.length !== 0) {
    const { data: noOfReimburse } = await getNumberOfReimburse(query);
    const { data: noOfDeduct } = await getNumberOfDeduct(query);
    if (noOfReimburse > 0) {
      const { data: reimburseAmount } = await getTotalReimburseAmount(query);
      page.numberOfReimbursement = noOfReimburse;
      page.totalReimburse = reimburseAmount;
    }
    if (noOfDeduct > 0) {
      const { data: deductAmount } = await getTotalDeductionAmount(query);
      page.numberOfDeduction = noOfDeduct;
      page.totalDeduct = deductAmount;
    }
  }
  page.loading = false;
}

async function showDialog(type) {
  if (type === "CREATE_ADD") {
    if (memberAmountAdjustForm.value) {
      memberAmountAdjustForm.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.addMemberAmountAdjust');
  } else if (type === "CREATE_DEDUCT") {
    if (memberAmountAdjustForm.value) {
      memberAmountAdjustForm.value.resetFields();
    }
    uiControl.balance = null;
    uiControl.dialogTitle = t('fields.deductMemberAmountAdjust');
  }
  await loadFormSelect();
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function createAdd() {
  memberAmountAdjustForm.value.validate(async (valid) => {
    form.id = null;
    form.memberId = null;
    const { data: id } = await findIdByLoginName(form.loginName, form.siteId);
    form.memberId = id;
    if (valid) {
      await createAddMemberAmountAdjust(form);
      uiControl.dialogVisible = false;
      await loadMemberAmountAdjust();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function createDeduct() {
  memberAmountAdjustForm.value.validate(async (valid) => {
    form.id = null;
    form.memberId = null;
    const { data: id } = await findIdByLoginName(form.loginName, form.siteId);
    form.memberId = id;
    if (valid) {
      await createDeductMemberAmountAdjust(form);
      uiControl.dialogVisible = false;
      await loadMemberAmountAdjust();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

async function downloadTemplate() {
  const exportAmountAdjust = [EXPORT_AMOUNT_ADJUST_LIST_HEADER];
  const maxLengthAdmountAdjust = [];
  const wsAmountAdjust = XLSX.utils.aoa_to_sheet(exportAmountAdjust);
  setWidth(exportAmountAdjust, maxLengthAdmountAdjust);
  const wsAdmountAdjustCols = maxLengthAdmountAdjust.map(w => {
    return { width: w };
  });
  wsAmountAdjust['!cols'] = wsAdmountAdjustCols;

  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Member_Amount_Adjust');
  wb.Sheets.Member_Amount_Adjust = wsAmountAdjust;
  XLSX.writeFile(wb, 'member_amount_adjust.xlsx');
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
            header: IMPORT_AMOUNT_ADJUST_LIST_JSON,
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
          item.cause = importForm.cause;
          item.siteId = importForm.siteId;
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
          await createBatchAmountAdjust(records.slice(0, 10000));
          records.splice(0, 10000);
        } else {
          await createBatchAmountAdjust(records);
          records.splice(0, records.length);
        }
      } while (records.length > 0)
      importedPage.buttonLoading = false;
      ElMessage({ message: t('message.importSuccess'), type: 'success' });
      clearImport();
      loadMemberAmountAdjust();
      importForm.cause = null;
    }
  });
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) && charCode !== 46
  ) {
    event.preventDefault();
  }

  if (
    form.amount !== null &&
    form.amount.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault();
    }
  }
}

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getExport(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getExport(query);
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
  wb.SheetNames.push('Member_Amount_Adjust');
  wb.Sheets.Member_Amount_Adjust = ws;
  XLSX.writeFile(wb, "member_amount_adjust.xlsx");
  exportPercentage.value = 100;
}

function pushRecordToData(records, exportData) {
  const data = records.map(record => Object.values(record).map(item => item !== 0 && (!item || item === '') ? '-' : item));
  exportData.push(...data);
}

// async function populateMemberBalance() {
//   if (uiControl.dialogType === 'CREATE_DEDUCT') {
//     const { data: bal } = await getMemberBalanceByLoginNameSite(form.loginName, form.siteId);
//     uiControl.balance = bal;
//   } else {
//     uiControl.balance = null;
//   }
// }

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
    await loadReqCause();
  }
  await loadMemberAmountAdjust()
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
