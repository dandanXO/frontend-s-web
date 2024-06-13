<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadNotifcations"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group" v-if="!hasRole(['SUB_TENANT'])">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:redirect-notification:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:redirect-notification:del']"
          @click="removeSetting()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="settingForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="loadSites"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.way')" prop="eligibleWays">
          <el-checkbox-group v-model="form.eligibleWays">
            <el-checkbox
              v-for="item in ways.list"
              :key="item"
              :label="item"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="t('fields.popUpTime')" prop="popUpTimes">
          <el-tag
            v-for="(item,index) in JSON.parse(form.popUpTimes)"
            :key="item"
            class="ml-1"
            closable
            @close="removePopUpTime(index)"
            :type="isExpiredTime(item) ? 'danger' : ''"
            style="margin-right: 5px; margin-bottom: 5px"
          >
            {{ item }}
          </el-tag>
          <el-date-picker
            v-if="uiControl.popUpTimePickerVisible"
            v-model="popUpTime"
            type="datetime"
            :placeholder="t('fields.startDate')"
            format="YYYY-MM-DD HH:mm:ss"
            @change="addPopUpTime"
            :disabled-date="disabledTime"
          />
          <el-date-picker
            v-if="uiControl.popUpTimePickerVisible"
            v-model="popUpTimeEnd"
            type="datetime"
            :placeholder="t('fields.endDate')"
            format="YYYY-MM-DD HH:mm:ss"
            @change="addPopUpTime"
            :disabled-date="disabledTime"
          />
          <el-button type="primary" @click="uiControl.popUpTimePickerVisible = true">{{ t('fields.add') }}</el-button>
        </el-form-item>
        <el-form-item :label="t('fields.popUpDurationSeconds')" prop="popUpDuration">
          <el-input-number :precision="0" :step="1" :min="0" v-model="form.popUpDuration" style="width: 100px" />
        </el-form-item>
        <el-form-item :label="t('fields.notificationType')" prop="notificationType">
          <el-select
            v-model="form.notificationType"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.notificationTypes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.notificationContent')" prop="notificationContent">
          <el-input type="textarea" v-model="form.notificationContent" :rows="15"
                    style="width: 350px; white-space: pre-line"
          />
        </el-form-item>
        <el-form-item :label="t('fields.redirectUrlApp')" prop="redirectUrlApp">
          <el-input v-model="form.redirectUrlApp" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.redirectUrlH5')" prop="redirectUrlH5">
          <el-input v-model="form.redirectUrlH5" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.redirectUrlWeb')" prop="redirectUrlWeb">
          <el-input v-model="form.redirectUrlWeb" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.targetType')" prop="targetType">
          <el-radio-group
            v-model="form.targetType"
            class="form-input"
            style="width: 540px"
          >
            <el-radio
              v-for="r in uiControl.targetType"
              :label="r.value"
              :key="r.value"
            >
              {{ t('fields.' + r.typeName) }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.importDialogVisible" append-to-body width="500px">
      <el-form
        ref="importRefForm"
        :model="importForm"
        :rules="importRules"
        :inline="true"
        size="small"
        label-width="150px"
        style="float: right;"
      />
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
        <el-table-column prop="loginName" :label="t('fields.loginName')" width="230" />
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
        <el-button @click="clearImport(); uiControl.importDialogVisible = false;">{{ t('fields.cancel') }}</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="!hasRole(['SUB_TENANT'])"
      />
      <el-table-column prop="notificationType" :label="t('fields.type')" width="150">
        <template #default="scope">
          <span>{{ t('fields.' + scope.row.notificationType.toLowerCase()) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="notificationContent" :label="t('fields.content')" min-width="200">
        <template #default="scope">
          <span>{{ getContentBrief(scope.row.notificationContent) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eligibleWays" :label="t('fields.way')" width="100">
        <template #default="scope">
          <el-tag
            v-for="item in JSON.parse(scope.row.eligibleWays)"
            :key="item"
            class="ml-1"
          >{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="targetType" :label="t('fields.targetType')" width="200">
        <template #default="scope">
          <span>{{ t('fields.' + scope.row.targetType.toLowerCase()) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="redirectUrlApp" :label="t('fields.redirectUrlApp')" width="200" />
      <el-table-column prop="redirectUrlH5" :label="t('fields.redirectUrlH5')" width="200" />
      <el-table-column prop="redirectUrlWeb" :label="t('fields.redirectUrlWeb')" width="200" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
        <template #default="scope">
          <span>{{ formatPopUpTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:redirect-notification:update']) || hasPermission(['sys:redirect-notification:del']) )"
      >
        <template #default="scope">
          <div>
            <el-button
              :disabled="scope.row.targetType === 'ALL'"
              icon="el-icon-upload"
              size="mini"
              type="primary"
              @click="showImport(scope.row)"
            />
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              v-permission="['sys:redirect-notification:update']"
              @click="showEdit(scope.row)"
            />
            <el-button
              icon="el-icon-remove"
              size="mini"
              type="danger"
              v-permission="['sys:redirect-notification:del']"
              @click="removeSetting(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification, createBatchMemberNotification
} from '../../../api/site-redirect-notification'
import { getWays } from '../../../api/privilege-red-packet-rain'
import { getSiteListSimple } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from "moment";
import * as XLSX from "xlsx";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const settingForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  notificationTypes: ['PRIVILEGE'],
  popUpTimePickerVisible: false,
  targetType: [
    { typeName: 'all', value: 'ALL' },
    { typeName: 'selectedMembers', value: 'MEMBER' },
  ],
  importDialogVisible: false,
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
})

const form = reactive({
  id: null,
  siteId: null,
  notificationType: null,
  notificationContent: null,
  eligibleWays: [],
  popUpTimes: null,
  popUpDuration: null,
  redirectUrlApp: null,
  redirectUrlH5: null,
  redirectUrlWeb: null,
  lastPopUpTime: null,
  targetType: 'ALL',
  targets: null,
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteIdRequired'))],
  notificationType: [required(t('message.validateTypeRequired'))],
  notificationContent: [required(t('message.validateContentRequired'))],
  eligibleWays: [required(t('message.validateWayRequired'))],
  popUpTimes: [required(t('message.validateTimeRequired'))],
})

const importForm = reactive({
  notificationId: null
});

const importRules = reactive({
  notificationId: [required(t('message.validateNotificationIdRequired'))]
});

const sites = reactive({
  list: [],
})

const ways = reactive({
  list: [],
})

const popUpTime = ref(null)
const popUpTimeEnd = ref(null);

const hasDateError = computed(() => {
  if (form.popUpTimes === null) {
    return -1;
  } else {
    const listsing = JSON.parse(form.popUpTimes);
    var isExpired = 0;
    listsing.forEach((list) => {
      if (isExpiredTime(list)) {
        isExpired = 1;
      }
    })
    return isExpired;
  }
})

let chooseSetting = []

const EXPORT_MEMBER_HEADER = [
  'Login Name'
]

const IMPORT_MEMBER_LIST_JSON = [
  'loginName'
]

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

function resetQuery() {
  request.siteId = site.value ? site.value.id : null;
}

function handleSelectionChange(val) {
  chooseSetting = val
  if (chooseSetting.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseSetting.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadNotifcations() {
  page.loading = true
  const { data: ret } = await getNotifications(request)
  page.pages = ret.pages
  // ret.records.forEach(data => {
  //   data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
  //     ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
  //     : null
  // });
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadWays() {
  const { data: ret } = await getWays()
  ways.list = ret.filter(e => e !== 'UNKNOWN')
}

function changePage(page) {
  request.current = page
  loadNotifcations()
}

function changeImportedPage(page) {
  importedPage.current = page;
}

function removePopUpTime(index) {
  const popUpTimeList = form.popUpTimes === null ? [] : JSON.parse(form.popUpTimes);
  popUpTimeList.splice(index, 1);
  form.popUpTimes = JSON.stringify(popUpTimeList);
}

function isExpiredTime(dateTime) {
  const startDate = dateTime[0];
  const endDate = dateTime[1];
  // console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
  if (endDate < moment().format("YYYY-MM-DD HH:mm:ss") || endDate < startDate) {
    return true;
  }
  return false;
}

function formatPopUpTime(date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

function formatFullTime(startDate, endDate) {
  return [moment(startDate).format("YYYY-MM-DD HH:mm:ss"), moment(endDate).format("YYYY-MM-DD HH:mm:ss")];
}

function addPopUpTime() {
  if (popUpTime.value && popUpTimeEnd.value) {
    const popUpTimeList = form.popUpTimes === null ? [] : JSON.parse(form.popUpTimes);
    if (popUpTimeList.includes(formatFullTime(popUpTime.value, popUpTimeEnd.value))) {
      ElMessage({ message: t('message.timeExist'), type: 'error' });
    } else {
      popUpTimeList.push(formatFullTime(popUpTime.value, popUpTimeEnd.value));
      form.popUpTimes = JSON.stringify(popUpTimeList.sort());
    }
    popUpTime.value = null;
    popUpTimeEnd.value = null;
    uiControl.popUpTimePickerVisible = false;
  }
}

function getContentBrief(content) {
  return content.length > 20 ? content.substring(0, 20) + '...' : content;
}

// function json() {
//   if (form.param) {
//     nextTick(() => {
//       form.param = JSON.stringify(JSON.parse(form.param), null, 2)
//     })
//   }
// }
function showDialog(type) {
  if (type === 'CREATE') {
    if (settingForm.value) {
      settingForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.add')
    form.id = null
    form.siteId = request.siteId
    form.eligibleWays = []
    form.popUpTimes = null
    form.redirectUrlApp = null
    form.redirectUrlH5 = null
    form.redirectUrlWeb = null
    form.notificationType = null
    form.notificationContent = null
    form.targetType = 'ALL'
    form.targets = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.edit')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(setting) {
  if (!setting) {
    setting = chooseSetting[0]
  }
  nextTick(() => {
    for (const key in setting) {
      if (key === 'popUpTimes') {
        form[key] = setting[key]
      } else if (key === 'eligibleWays') {
        form[key] = JSON.parse(setting[key])
      } else if (Object.keys(form).find(k => k === key)) {
        form[key] = setting[key]
      }
    }
  })
  showDialog('EDIT')
}

function showImport(notification) {
  uiControl.importDialogVisible = true
  uiControl.dialogTitle = t('fields.massImport');
  importForm.notificationId = notification.id;
  clearImport()
}

function clearImport() {
  importedPage.buttonLoading = false;
  importedPage.loading = false;
  importedPage.records = [];
  importedPage.pages = 0;
  importedPage.current = 1;
}

function create(formCopy) {
  settingForm.value.validate(async valid => {
    if (valid) {
      await createNotification(formCopy)
      uiControl.dialogVisible = false
      await loadNotifcations()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit(formCopy) {
  settingForm.value.validate(async valid => {
    if (valid) {
      await updateNotification(formCopy)
      uiControl.dialogVisible = false
      await loadNotifcations()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeSetting(setting) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (setting) {
      await deleteNotification([setting.id])
    } else {
      await deleteNotification(chooseSetting.map(u => u.id))
    }
    await loadNotifcations()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function submit() {
  if (hasDateError.value === -1) {
    ElMessage({ message: t('message.selectPopupTime'), type: 'error' })
    return;
  } else if (hasDateError.value === 1) {
    ElMessage({ message: t('message.wrongPopupTime'), type: 'error' })
    return;
  }
  form.lastPopUpTime = form.popUpTimes ? JSON.parse(form.popUpTimes).sort().reverse()[0][1] : null
  const formCopy = { ...form }
  formCopy.eligibleWays = JSON.stringify(formCopy.eligibleWays)

  if (uiControl.dialogType === 'CREATE') {
    create(formCopy)
  } else if (uiControl.dialogType === 'EDIT') {
    edit(formCopy)
  }
}

async function confirmImport() {
  importedPage.buttonLoading = true;
  const recordCopy = { ...importedPage.records };
  const data = [];
  Object.entries(recordCopy).forEach(([key, value]) => {
    const item = {};
    if (value) {
      item.notificationId = importForm.notificationId;
      Object.entries(value).forEach(([k, v]) => {
        item[k] = v;
      });
    }
    data.push(item);
  });

  const records = [...data];
  do {
    if (records.length > 10000) {
      await createBatchMemberNotification(importForm.notificationId, records.slice(0, 10000));
      records.splice(0, 10000);
    } else {
      await createBatchMemberNotification(importForm.notificationId, records);
      records.splice(0, records.length);
    }
  } while (records.length > 0)
  importedPage.buttonLoading = false;
  ElMessage({ message: t('message.importSuccess'), type: 'success' });
  clearImport();
  loadNotifcations()
}

function disabledTime(time) {
  return time.getTime() <= moment(Date.now()).subtract(1, 'days')
}

async function downloadTemplate() {
  const exportMemberPrivilege = [EXPORT_MEMBER_HEADER];
  const maxLengthMemberPrivilege = [];
  const wsMemberPrivilege = XLSX.utils.aoa_to_sheet(exportMemberPrivilege);
  setWidth(exportMemberPrivilege, maxLengthMemberPrivilege);
  const wsMemberPrivilegeCols = maxLengthMemberPrivilege.map(w => {
    return { width: w };
  });
  wsMemberPrivilege['!cols'] = wsMemberPrivilegeCols;

  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Member');
  wb.Sheets.Member = wsMemberPrivilege;
  XLSX.writeFile(wb, 'member_redirect_notification.xlsx');
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
            header: IMPORT_MEMBER_LIST_JSON,
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

onMounted(async () => {
  await loadSites();
  await loadWays();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = sites.list[0].id;
  }
  await loadNotifcations();
})
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
