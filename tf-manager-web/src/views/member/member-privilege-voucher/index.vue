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
          @change="loadPrivilegeList"
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
          style="width: 250px; margin-left: 10px;"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          clearable
          v-model="request.privilegeId"
          size="small"
          :placeholder="t('fields.privilege')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
          filterable
        >
          <el-option
            v-for="item in uiControl.privilegeList"
            :key="item.id"
            :label="item.alias !== null ? item.alias : item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('common.claimStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadMemberPrivilegeVouchers">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="primary"
          v-permission="['sys:member-privilege-voucher:import']"
          @click="uiControl.importDialogVisible = true"
        >
          {{ t('fields.massImport') }}
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
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="150" />
      <el-table-column prop="privilegeName" :label="t('fields.privilege')" width="300" />
      <el-table-column prop="amount" :label="t('fields.amount')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.amount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" align="center" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'PENDING'" size="mini" type="primary">{{ t('common.claimStatus.' + scope.row.status) }}</el-tag>
          <el-tag v-else-if="scope.row.status === 'CLAIMED'" size="mini" type="success">{{ t('common.claimStatus.' + scope.row.status) }}</el-tag>
          <el-tag v-else size="mini" type="danger">{{ t('common.claimStatus.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="claimTime"
        :label="t('fields.claimTime')"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.claimTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-else
            v-formatter="{ data: scope.row.claimTime, timeZone: timeZone, type: 'date' }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="100">
        <template #default="scope">
          <span v-if="scope.row.createBy === null">-</span>
          <span v-else>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-else
            v-formatter="{ data: scope.row.createTime, timeZone: timeZone, type: 'date' }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="100">
        <template #default="scope">
          <span v-if="scope.row.updateBy === null">-</span>
          <span v-else>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        :label="t('fields.updateTime')"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-else
            v-formatter="{ data: scope.row.updateTime, timeZone: timeZone, type: 'date' }"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="250"
        v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:member-privilege-voucher:update'])"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'PENDING'"
            size="mini"
            type="danger"
            v-permission="['sys:member-privilege-voucher:update']"
            @click="cancel(scope.row.id)"
          >{{ t('fields.cancel') }}</el-button>
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
      @current-change="loadMemberPrivilegeVouchers"
      @size-change="loadMemberPrivilegeVouchers"
    />

    <el-dialog
      :title="t('fields.massImport')"
      v-model="uiControl.importDialogVisible"
      append-to-body
      width="1100px"
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
          label-width="100px"
          style="padding-top: 20px;"
        >
          <el-form-item :label="t('fields.privilege')" prop="privilegeId">
            <el-select
              clearable
              v-model="importForm.privilegeId"
              size="small"
              :placeholder="t('fields.privilege')"
              class="filter-item"
              style="width: 200px"
              filterable
            >
              <el-option
                v-for="item in uiControl.privilegeList"
                :key="item.id"
                :label="item.alias !== null ? item.alias : item.name"
                :value="item.id"
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
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="180"
        />
        <el-table-column prop="amount" :label="t('fields.amount')" width="150">
          <template #default="scope">
            $
            <!-- eslint-disable -->
            <span
              v-formatter="{ data: scope.row.amount, type: 'money' }"
            />
          </template>
        </el-table-column>
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
  </div>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import * as XLSX from 'xlsx';
import { ElMessage, ElMessageBox } from "element-plus";
import { hasRole, hasPermission } from "@/utils/util";
import { required } from "@/utils/validate";
import { getSiteListSimple } from "@/api/site";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getVoucherList, createBatchVouchers, cancelVoucher } from "@/api/member-privilege-voucher";
import { getAllPrivilegeInfoBySiteId } from '@/api/privilege-info'
import moment from "moment";
import { formatInputTimeZone } from '@/utils/format-timeZone'

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const importRefForm = ref(null)
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
let timeZone = null

const EXPORT_VOUCHERS_LIST_HEADER = [
  '用户名',
  '金额'
]

const IMPORT_VOUCHERS_LIST_JSON = [
  'loginName',
  'amount'
]

const uiControl = reactive({
  privilegeList: [],
  status: [
    { key: 1, displayName: 'PENDING', value: 'PENDING' },
    { key: 2, displayName: 'CLAIMED', value: 'CLAIMED' },
    { key: 3, displayName: 'CANCEL', value: 'CANCEL' }
  ],
  importDialogVisible: false
});
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
  loginName: null,
  privilegeId: null,
  createTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const sites = reactive({
  list: []
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

const importForm = reactive({
  siteId: null,
  privilegeId: null
});

const importRules = reactive({
  privilegeId: [required(t('message.validatePrivilegeRequired'))]
});

async function loadMemberPrivilegeVouchers() {
  page.loading = true;
  const query = checkQuery();
  timeZone = sites.list.find(e => e.id === request.siteId).timeZone
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = JSON.parse(JSON.stringify(request.createTime))
      query.createTime[0] = formatInputTimeZone(
        query.createTime[0],
        timeZone,
        'start'
      )
      query.createTime[1] = formatInputTimeZone(
        query.createTime[1],
        timeZone,
        'end'
      )
      query.createTime = query.createTime.join(',')
    }
  }
  const { data: ret } = await getVoucherList(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

async function loadPrivilegeList() {
  const { data: list } = await getAllPrivilegeInfoBySiteId(request.siteId)
  uiControl.privilegeList = list
  request.privilegeId = null
}

function resetQuery() {
  request.siteId = site.value.id;
  request.loginName = null;
  request.privilegeId = null;
  request.status = null;
  request.createTime = [convertStartDate(new Date()), convertDate(new Date())];
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
      query.createTime = request.createTime.join(',')
    }
  }
  return query;
}

async function downloadTemplate() {
  const exportVoucherImport = [EXPORT_VOUCHERS_LIST_HEADER];
  const maxLengthVoucherImport = [];
  const wsVoucherImport = XLSX.utils.aoa_to_sheet(exportVoucherImport);
  setWidth(exportVoucherImport, maxLengthVoucherImport);
  const wsVoucherImportCols = maxLengthVoucherImport.map(w => {
    return { width: w };
  });
  wsVoucherImport['!cols'] = wsVoucherImportCols;

  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Vouchers_Import');
  wb.Sheets.Vouchers_Import = wsVoucherImport;
  XLSX.writeFile(wb, 'vouchers_import.xlsx');
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
            header: IMPORT_VOUCHERS_LIST_JSON,
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
  importForm.privilegeId = null;
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
          item.siteId = request.siteId;
          item.privilegeId = importForm.privilegeId;
          Object.entries(value).forEach(([k, v]) => {
            item[k] = v;
          });
        }
        data.push(item);
      });

      const records = [...data];
      do {
        if (records.length > 10000) {
          await createBatchVouchers(records.slice(0, 10000));
          records.splice(0, 10000);
        } else {
          await createBatchVouchers(records);
          records.splice(0, records.length);
        }
      } while (records.length > 0)
      importedPage.buttonLoading = false;
      ElMessage({ message: t('message.importSuccess'), type: 'success' });
      clearImport();
      loadMemberPrivilegeVouchers();
    }
  });
}

async function cancel(id) {
  ElMessageBox.confirm(t('message.confirmCancel'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await cancelVoucher(id)
    await loadMemberPrivilegeVouchers()
    ElMessage({ message: t('message.cancelSuccess'), type: 'success' })
  })
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadPrivilegeList()
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
</style>
