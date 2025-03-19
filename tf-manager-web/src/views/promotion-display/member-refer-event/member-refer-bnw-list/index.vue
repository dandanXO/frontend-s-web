<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.uniqueValue"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.uniqueValue')"
        />
        <el-select
          style="width: 200px; margin-left: 10px"
          size="small"
          v-model="request.valueType"
          :placeholder="t('fields.type')"
        >
          <el-option
            v-for="item in uiControl.type"
            :key="item.key"
            :label="t('referFriendBnwType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.isBlacklist"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px; margin-left: 10px"
        >
          <el-option
            v-for="item in uiControl.statusList"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left:10px"
          default-first-option
          @focus="loadSites"
          @change="changeSite"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->

        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadBlanknWhitelist()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:member:referer-friend-bnw:add']"
          @click="showDialog('CREATE')"
        >{{ t('fields.add') }}</el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          v-permission="['sys:member:referer-friend-bnw:import']"
          @click="showDialog('IMPORT')"
        >
          {{ t('fields.massImport') }}
        </el-button>
        <el-button icon="el-icon-remove" size="mini" type="danger" @click="removeBlacklist()"
                   :disabled="uiControl.removeBtn"
                   v-permission="['sys:member:referer-friend-bnw:del']"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.memberReferWhitelist') }}</span>
        </div>
      </template>

      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                @selection-change="handleSelectionChange"
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uniqueValue" :label="t('fields.uniqueValue')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.uniqueValue === null">-</span>
            <span v-if="scope.row.uniqueValue !== null">{{ scope.row.uniqueValue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isBlacklist" :label="t('fields.status')" min-width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.isBlacklist === 0" type="info">{{ t('priviCodeRedeemBnWStatus.whitelist') }}</el-tag>
            <el-tag v-if="scope.row.isBlacklist === 1" type="danger">{{ t('priviCodeRedeemBnWStatus.blacklist') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('fields.createTime')" min-width="160">
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span v-if="scope.row.createTime !== null" v-formatter="{data: scope.row.createTime,timeZone: timeZone,type: 'date'}" />
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="t('fields.createBy')" min-width="160">
          <template #default="scope">
            <span v-if="scope.row.createBy === null">-</span>
            <span v-if="scope.row.createBy !== null">{{ scope.row.createBy }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="right"
          fixed="right"
          v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:member:referer-friend-bnw:del']))"
        >
          <template #default="scope">
            <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:member:referer-friend-bnw:del']" @click="removeBlacklist(scope.row)" />
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
    </el-card>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      :width="dialogWidth"
    >
      <el-form
        v-if="uiControl.dialogType === 'CREATE'"
        ref="blacklistForm"
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
        <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            style="width: 350px"
            v-model="form.valueType"
            :placeholder="t('fields.type')"
          >
            <el-option
              v-for="item in uiControl.type"
              :key="item.key"
              :label="t('referFriendBnwType.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.uniqueValue')" prop="uniqueValue">
          <el-input style="width: 350px" v-model="form.uniqueValue" />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="isBlacklist">
          <el-radio-group
            v-model="form.isBlacklist"
            size="small"
            style="width: 300px"
          >
            <el-radio-button label="0">
              {{ t('priviCodeRedeemBnWStatus.whitelist') }}
            </el-radio-button>
            <el-radio-button label="1">
              {{ t('priviCodeRedeemBnWStatus.blacklist') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="create">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <div v-else>
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
        <el-select
          style="width: 350px; margin-left: 10px;"
          size="mini"
          v-model="importType"
          :placeholder="t('fields.type')"
        >
          <el-option
            v-for="item in uiControl.type"
            :key="item.key"
            :label="t('referFriendBnwType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <!-- <el-form
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
        </el-form> -->
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
          <el-table-column prop="uniqueValue" :label="t('fields.uniqueValue')" width="330" />
          <el-table-column prop="isBlacklist" :label="t('fields.status')" min-width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.isBlacklist === 0" type="info">{{ t('priviCodeRedeemBnWStatus.whitelist') }}</el-tag>
            <el-tag v-if="scope.row.isBlacklist === 1" type="danger">{{ t('priviCodeRedeemBnWStatus.blacklist') }}</el-tag>
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
      </div>
    </el-dialog>
  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import * as XLSX from 'xlsx';
import { hasRole, hasPermission } from "../../../../utils/util";
import { createBatchBlacknWhitelist, createBlacknWhitelist, deleteBlacknWhitelist, getBlacknWhitelist } from "../../../../api/member-refer-bnw-list";
// import { getActivePrivilegeInfo, getActivePrivilegeInfoBySiteId } from "../../../../api/privilege-info";
import { useStore } from "../../../../store";
import { getSiteListSimple } from "../../../../api/site";
import { TENANT } from "../../../../store/modules/user/action-types";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);

const EXPORT_LIST_HEADER = [
  'IP/loginName',
  'Blacklist (0:whitelist  1:blacklist)'
]

const IMPORT_LIST_HEADER = [
  'uniqueValue',
  'isBlacklist'
]

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true,
  statusList: [
    { key: 1, displayName: t('priviCodeRedeemBnWStatus.whitelist'), value: 0 },
    { key: 2, displayName: t('priviCodeRedeemBnWStatus.blacklist'), value: 1 },
  ],
  type: [
    { key: 1, displayName: 'Referer', value: 'UNIQUE_REFERER_LOGINNAME' },
    { key: 2, displayName: 'IP', value: 'UNIQUE_IP' }
  ],
});
const site = ref(null);
const blacklistForm = ref(null);
const dialogWidth = ref("580px");
const importType = ref("UNIQUE_REFERER_LOGINNAME");

let timeZone = null;
const siteList = reactive({
  list: []
});

let chooseBlacklist = [];

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false
})

const request = reactive({
  size: 30,
  current: 1,
  uniqueValue: null,
  valueType: "UNIQUE_REFERER_LOGINNAME",
  isBlacklist: 0,
  siteId: null,
  orderBy: 'createTime'
});

const form = reactive({
  id: null,
  uniqueValue: null,
  valueType: "UNIQUE_REFERER_LOGINNAME",
  isBlacklist: 0
});

// const importForm = reactive({
//   siteId: null
// });

// const importRules = reactive({
//   siteId: [required(t('message.validateSiteRequired'))]
// });

function resetQuery() {
  request.uniqueValue = null;
  request.valueType = null;
  request.siteId = store.state.user.siteId
  request.isBlacklist = null;
}

async function loadBlanknWhitelist() {
  page.loading = true;
  const requestCopy = { ...request };
  const { data: ret } = await getBlacknWhitelist(requestCopy);
  page.pages = ret.pages;
  page.records = ret.records;
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadBlanknWhitelist();
  }
}

function handleSelectionChange(val) {
  chooseBlacklist = val;
  if (chooseBlacklist.length === 0) {
    uiControl.removeBtn = true;
  } else if (chooseBlacklist.length === 1) {
    uiControl.removeBtn = false;
  } else {
    uiControl.removeBtn = false;
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

async function showDialog(type) {
  if (type === "CREATE") {
    dialogWidth.value = "580px";
    if (blacklistForm.value) {
      blacklistForm.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.addMemberReferWhitelist');
    form.siteId = request.siteId
  } else if (type === "IMPORT") {
    dialogWidth.value = "900px";
    uiControl.dialogTitle = t('fields.massImport');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function create() {
  blacklistForm.value.validate(async (valid) => {
    form.id = null;
    if (valid) {
      form.uniqueValue = form.uniqueValue.trim();
      await createBlacknWhitelist(form);
      uiControl.dialogVisible = false;
      await loadBlanknWhitelist();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

async function removeBlacklist(blacklist) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (blacklist) {
      await deleteBlacknWhitelist([blacklist.id]);
    } else {
      await deleteBlacknWhitelist(chooseBlacklist.map(a => a.id));
    }
    await loadBlanknWhitelist();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

async function downloadTemplate() {
  const exportBlacklist = [EXPORT_LIST_HEADER];
  const maxLengthBlacklist = [];
  const wsBlacklist = XLSX.utils.aoa_to_sheet(exportBlacklist);
  setWidth(exportBlacklist, maxLengthBlacklist);
  const wsBlacklistCols = maxLengthBlacklist.map(w => {
    return { width: w };
  });
  wsBlacklist['!cols'] = wsBlacklistCols;
  // let privilegeMapping = {};

  // const { data: ret } = await getPromoCodeExcelMapping(request.siteId);
  // privilegeMapping = ret;

  // const exportMapping = [EXPORT_MAPPING_PRIVI_HEADER];
  // const maxLengthMapping = [];
  // pushRecordToData(privilegeMapping, exportMapping);
  // const wsMapping = XLSX.utils.aoa_to_sheet(exportMapping);
  // setWidth(exportMapping, maxLengthMapping);
  // const wsMappingCols = maxLengthMapping.map(w => {
  //   return { width: w }
  // });
  // wsMapping['!cols'] = wsMappingCols;

  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Member_refer_bnwlist');
  wb.Sheets.Member_refer_bnwlist = wsBlacklist;
  // wb.SheetNames.push('Mapping');
  // wb.Sheets.Mapping = wsMapping;
  XLSX.writeFile(wb, 'Member_refer_bnwlist.xlsx');
}

// function pushRecordToData(records, exportData) {
//   const data = records.map(record =>
//     Object.values(record).map(item => (!item || item === '' ? '-' : item))
//   )
//   exportData.push(...data)
// }

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
            header: IMPORT_LIST_HEADER,
            range: 1,
          })
        );
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
  uiControl.dialogVisible = false;
  importedPage.buttonLoading = false;
  importedPage.loading = false;
  importedPage.records = [];
  importedPage.pages = 0;
  importedPage.current = 1;
}

async function confirmImport() {
  if (importType.value === null) {
    ElMessage({ message: t('message.refererBnWImport'), type: "error" });
  }
  importedPage.buttonLoading = true;
  const recordCopy = { ...importedPage.records };
  const data = [];
  console.log(recordCopy)
  Object.entries(recordCopy).forEach(([key, value]) => {
    const item = {};
    if (value) {
      Object.entries(value).forEach(([k, v]) => {
        item[k] = v;
      });
    }
    data.push(item);
  });

  const records = [...data];
  do {
    if (records.length > 10000) {
      await createBatchBlacknWhitelist(records.slice(0, 10000), request.siteId, importType.value);
      records.splice(0, 10000);
    } else {
      await createBatchBlacknWhitelist(records, request.siteId, importType.value);
      records.splice(0, records.length);
    }
  } while (records.length > 0)
  importedPage.buttonLoading = false;
  ElMessage({ message: t('message.importSuccess'), type: 'success' });
  clearImport();
  loadBlanknWhitelist();
}

onMounted(async() => {
  await loadSites();
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }

  // if (LOGIN_USER_TYPE.value === TENANT.value) {
  //   site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
  //   await loadPrivilegeInfos(site.value.id);
  // } else {
  //   await loadPrivilegeInfos(store.state.user.siteId);
  // }
  await loadBlanknWhitelist();
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}
</style>
