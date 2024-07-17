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
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.loginName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberInviteLimitRecords"
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
          v-permission="['sys:member-invite-limit:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:member-invite-limit:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:member-invite-limit:del']"
          @click="removeLimit()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
        <!-- <el-button
          icon="el-icon-upload"
          size="mini"
          type="primary"
          v-permission="['sys:member-invite-limit:add']"
          @click="uiControl.importDialogVisible = true"
        >
          {{ t('fields.massImport') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:member-invite-limit:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button> -->
      </div>
    </div>

    <!-- <el-dialog
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
        <el-table-column prop="name" :label="t('fields.gameName')" width="150"/>
        <el-table-column prop="code" :label="t('fields.gameCode')" width="150"/>
        <el-table-column prop="icon" :label="t('fields.icon')" width="120"/>
        <el-table-column prop="platformId" :label="t('fields.platformId')" width="120"/>
        <el-table-column prop="siteId" :label="t('fields.site')" width="100"/>
        <el-table-column prop="status" :label="t('fields.status')" width="80"/>
        <el-table-column prop="gameType" :label="t('fields.gameType')" width="100"/>
        <el-table-column prop="device" :label="t('fields.device')" width="100"/>
        <el-table-column prop="sequence" :label="t('fields.sequence')" width="80"/>
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
    </el-dialog> -->

    <el-dialog
      :title="$t('menu.Member Invite Limit')"
      v-model="uiControl.dialogVisible2"
      append-to-body
      width="580px"
      :close-on-press-escape="false"
    >
      <div>
        <table class="info-table">
          <tr>
            <td>{{ $t('google.register_count') }}</td>
            <td>{{ regLimitData.regCount }}</td>
          </tr>
          <tr>
            <td>{{ $t('google.register_limit') }}</td>
            <td>{{ regLimitData.regLimit }}</td>
          </tr>
        </table>
      </div>
    </el-dialog>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
      :close-on-press-escape="false"
    >
      <el-form
        ref="limitForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="170px"
      >
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px" :readonly="uiControl.editVisible" />
        </el-form-item>

        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @change="handleChangeSite"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.dailyMinRegLimit')" prop="minDayRegLimit">
          <el-input-number v-model="form.minDayRegLimit" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.dailyMaxRegLimit')" prop="maxDayRegLimit">
          <el-input-number v-model="form.maxDayRegLimit" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.dailyRegProbabilty')" prop="dayRegProbability">
          <el-input-number v-model="form.dayRegProbability" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.dailyMinFirstDepositLimit')" prop="minDayFirstDepositLimit">
          <el-input-number v-model="form.minDayFirstDepositLimit" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.dailyMaxFirstDepositLimit')" prop="maxDayFirstDepositLimit">
          <el-input-number v-model="form.maxDayFirstDepositLimit" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.dailyFirstDepositProbability')" prop="dayFirstDepositProbability">
          <el-input-number v-model="form.dayFirstDepositProbability" style="width: 150px;" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
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
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="150" />
      <el-table-column prop="dayRegLimit" :label="t('fields.dailyRegLimit')" width="200">
        <template #default="scope">
          <span v-if="scope.row.dayRegLimit === null">-</span>
          <span
            v-if="scope.row.dayRegLimit !== null"
          >
            {{ splitStrAndDisplay(scope.row.dayRegLimit) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="dayFirstDepositLimit" :label="t('fields.dailyFirstDepositLimit')" width="200">
        <template #default="scope">
          <span v-if="scope.row.dayFirstDepositLimit === null">-</span>
          <span
            v-if="scope.row.dayFirstDepositLimit !== null"
          >
            {{ splitStrAndDisplay(scope.row.dayFirstDepositLimit) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:member-invite-limit:update']) || hasPermission(['sys:member-invite-limit:del']) )"
      >
        <template #default="scope">
          <el-button size="mini" icon="el-icon-search"
                     type="primary"
                     @click="checkInviteLimit(scope.row)"
                     v-permission="['sys:member-invite-limit:update']"
          />

          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:member-invite-limit:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:member-invite-limit:del']"
            @click="removeLimit(scope.row)"
          />
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
    <!-- <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
// import * as XLSX from 'xlsx'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getSiteMemberInviteLimitRecords,
  createMemberInviteLimit,
  updateMemberInviteLimit,
  deleteMemberInviteLimit,
  checkMemberInviteLimit
} from '../../../api/site-member-invite-limit';
// import {
//   getPlatformExcelMapping, getPlatformsBySite,
// } from '../../../api/platform'
import { getSiteListSimple } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
// import moment from 'moment'

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const limitForm = ref(null)

// const EXPORT_GAME_LIST_HEADER = [
//   'Game Name',
//   'Game Code',
//   'Icon',
//   'Platform ID (Refer Mapping Sheet)',
//   'Site ID (Refer Mapping Sheet)',
//   'Status',
//   'Game Type',
//   'Device',
//   'Sequence',
// ]

// const IMPORT_GAME_LIST_JSON = [
//   'name',
//   'code',
//   'icon',
//   'platformId',
//   'siteId',
//   'status',
//   'gameType',
//   'device',
//   'sequence',
// ]

// const EXPORT_MAPPING_PLATFORM_HEADER = [
//   'Platform ID',
//   'Platform Code',
//   'Game Type',
// ]

// const EXPORT_MAPPING_SITE_HEADER = [
//   'Site ID',
//   'Site Name',
//   'Site Code',
//   'Currency',
// ]

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  messageVisible: false,
  editVisible: false,
  dialogVisible2: false
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
// const importedPage = reactive({
//   pages: 0,
//   records: [],
//   loading: false,
//   size: 10,
//   current: 1,
//   buttonLoading: false,
// })
const request = reactive({
  size: 30,
  current: 1,
  name: null,
  platform: null,
  siteId: null,
  gameType: null,
  requestBy: null,
  requestTime: null,
  code: null
})

const form = reactive({
  id: null,
  loginName: null,
  siteId: null,
  minDayRegLimit: 0,
  maxDayRegLimit: 0,
  dayRegProbability: 0,
  minDayFirstDepositLimit: 0,
  maxDayFirstDepositLimit: 0,
  dayFirstDepositProbability: 0,
  dayFirstDepositLimit: '',
  dayRegLimit: ''
})

const formRules = reactive({
  loginName: [required(t('message.validateLoginNameRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  minDayRegLimit: [required(t('message.validateMinDayRegLimitRequired'))],
  maxDayRegLimit: [required(t('message.validateMaxDayRegLimitRequired'))],
  dayRegProbability: [required(t('message.validateDayRegProbabilityRequired'))],
  minDayFirstDepositLimit: [required(t('message.validateMinDayDepositAmountRequired'))],
  maxDayFirstDepositLimit: [required(t('message.validateMaxDayDepositAmountRequired'))],
  dayFirstDepositProbability: [required(t('message.validateDayDepositAmountProbabilityRequired'))],
})

const sites = reactive({
  list: [],
})

let chooseMember = []

function resetQuery() {
  request.loginName = null
  request.siteId = site.value ? site.value.id : null;
}

function splitStrAndDisplay(limit) {
  const limitArr = limit.split(',');
  return limitArr[0] + "-" + limitArr[1] + " ( " + limitArr[2] + " % ) "
}

function handleSelectionChange(val) {
  chooseMember = val
  if (chooseMember.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseMember.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadMemberInviteLimitRecords() {
  page.loading = true
  const { data: ret } = await getSiteMemberInviteLimitRecords(request)
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

function changePage(page) {
  request.current = page
  loadMemberInviteLimitRecords()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (limitForm.value) {
      limitForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addGame')
    uiControl.editVisible = false;
    form.id = null
    form.loginName = ''
    form.minDayRegLimit = 0
    form.maxDayRegLimit = 0
    form.dayFirstDepositLimit = 0
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editGame')
    uiControl.editVisible = true
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(limit) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in limit) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = limit[key]
    }
    if (form.dayRegLimit !== null) {
      const arr = form.dayRegLimit.split(",")
      form.minDayRegLimit = +arr[0]
      form.maxDayRegLimit = +arr[1]
    }
    if (form.dayFirstDepositLimit !== null) {
      const arr = form.dayFirstDepositLimit.split(",")
      form.minDayFirstDepositLimit = +arr[0]
      form.maxDayFirstDepositLimit = +arr[1]
    }
  })
}

function create() {
  limitForm.value.validate(async valid => {
    if (valid) {
      if (form.minDayRegLimit > form.maxDayRegLimit) {
        ElMessage({
          message: t('message.dailyMinRegLimitCannotExceedMax'),
          type: "error"
        });
        return;
      }
      if (form.minDayFirstDepositLimit > form.maxDayFirstDepositLimit) {
        ElMessage({
          message: t('message.dailyMinFirstDepositCannotExceedMax'),
          type: "error"
        });
        return;
      }
      var dayRegLimit = form.minDayRegLimit + "," + form.maxDayRegLimit + "," + form.dayRegProbability + ","
      form.dayRegLimit = dayRegLimit;
      var dayFirstDepositLimit = form.minDayFirstDepositLimit + "," + form.maxDayFirstDepositLimit + "," + form.dayFirstDepositProbability + ","
      form.dayFirstDepositLimit = dayFirstDepositLimit;
      await createMemberInviteLimit(form)
      uiControl.dialogVisible = false
      await loadMemberInviteLimitRecords()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  limitForm.value.validate(async valid => {
    if (valid) {
      if (form.minDayRegLimit > form.maxDayRegLimit) {
        ElMessage({
          message: t('message.dailyMinRegLimitCannotExceedMax'),
          type: "error"
        });
        return;
      }
      if (form.minDayFirstDepositLimit > form.maxDayFirstDepositLimit) {
        ElMessage({
          message: t('message.dailyMinFirstDepositCannotExceedMax'),
          type: "error"
        });
        return;
      }
      var dayRegLimit = form.minDayRegLimit + "," + form.maxDayRegLimit + "," + form.dayRegProbability + ","
      form.dayRegLimit = dayRegLimit;
      var dayFirstDepositLimit = form.minDayFirstDepositLimit + "," + form.maxDayFirstDepositLimit + "," + form.dayFirstDepositProbability + ","
      form.dayFirstDepositLimit = dayFirstDepositLimit;
      await updateMemberInviteLimit(form)
      uiControl.dialogVisible = false
      await loadMemberInviteLimitRecords()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeLimit(limit) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (limit) {
      await deleteMemberInviteLimit([limit.id])
    } else {
      await deleteMemberInviteLimit(chooseMember.map(u => u.id))
    }
    await loadMemberInviteLimitRecords()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

const regLimitData = reactive({
  regCount: "",
  regLimit: ""
})
const checkInviteLimit = async (user) => {
  // console.log(user);
  const apiResponse = await checkMemberInviteLimit({
    loginName: user.loginName
  });
  // debugger;
  console.log(apiResponse);
  regLimitData.regCount = apiResponse.data.regCount;
  regLimitData.regLimit = apiResponse.data.regLimit;
  uiControl.dialogVisible2 = true
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

// async function downloadTemplate() {
//   const exportGameList = [EXPORT_GAME_LIST_HEADER]
//   const maxLengthGameList = []
//   const wsGameList = XLSX.utils.aoa_to_sheet(exportGameList)
//   setWidth(exportGameList, maxLengthGameList)
//   const wsGameListCols = maxLengthGameList.map(w => {
//     return { width: w }
//   })
//   wsGameList['!cols'] = wsGameListCols

//   const { data: platformsMapping } = await getPlatformExcelMapping()
//   const { data: sitesMapping } = await getSiteExcelMapping()
//   const exportMapping = [EXPORT_MAPPING_PLATFORM_HEADER]
//   const maxLengthMapping = []
//   pushRecordToData(platformsMapping, exportMapping)
//   exportMapping.push([], [], EXPORT_MAPPING_SITE_HEADER)
//   pushRecordToData(sitesMapping, exportMapping)
//   const wsMapping = XLSX.utils.aoa_to_sheet(exportMapping)
//   setWidth(exportMapping, maxLengthMapping)
//   const wsMappingCols = maxLengthMapping.map(w => {
//     return { width: w }
//   })
//   wsMapping['!cols'] = wsMappingCols

//   const wb = XLSX.utils.book_new()
//   wb.SheetNames.push('Game_List')
//   wb.Sheets.Game_List = wsGameList
//   wb.SheetNames.push('Mapping')
//   wb.Sheets.Mapping = wsMapping
//   XLSX.writeFile(wb, 'game_list.xlsx')
// }

// function pushRecordToData(records, exportData) {
//   const data = records.map(record =>
//     Object.values(record).map(item => (!item || item === '' ? '-' : item))
//   )
//   exportData.push(...data)
// }

// function setWidth(exportData, maxLength) {
//   exportData.map(data => {
//     Object.keys(data).map(key => {
//       const value = data[key]

//       maxLength[key] =
//         typeof value === 'number'
//           ? maxLength[key] >= 10
//             ? maxLength[key]
//             : 10
//           : maxLength[key] >= value.length + 2
//             ? maxLength[key]
//             : value.length + 2
//     })
//   })
// }

// function chooseFile() {
//   document.getElementById('importFile').click()
// }

// function importToTable(file) {
//   importedPage.loading = true
//   importedPage.buttonLoading = false
//   const files = file.target.files[0]
//   const allowFileType = [
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'application/vnd.ms-excel',
//   ]
//   if (allowFileType.find(ftype => ftype.includes(files.type))) {
//     const fileReader = new FileReader()

//     fileReader.onload = event => {
//       const { result } = event.target
//       const workbook = XLSX.read(result, { type: 'binary' })
//       let data = []
//       for (const sheet in workbook.Sheets) {
//         data = data.concat(
//           XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
//             header: IMPORT_GAME_LIST_JSON,
//             range: 1,
//           })
//         )
//         break
//       }
//       importedPage.records = data
//       importedPage.pages = Math.ceil(
//         importedPage.records.length / importedPage.size
//       )
//     }
//     fileReader.readAsBinaryString(files)
//     document.getElementById('importFile').value = ''
//   } else {
//     ElMessage({ message: t('message.invalidFileType'), type: 'error' })
//   }
//   importedPage.loading = false
// }

// function changeImportedPage(page) {
//   importedPage.current = page
// }

// function clearImport() {
//   uiControl.importDialogVisible = false
//   importedPage.buttonLoading = false
//   importedPage.loading = false
//   importedPage.records = []
//   importedPage.pages = 0
//   importedPage.current = 1
// }

// async function confirmImport() {
//   importedPage.buttonLoading = true
//   const records = [...importedPage.records];
//   do {
//     if (records.length > 10000) {
//       await createBatchGame(records.slice(0, 10000));
//       records.splice(0, 10000);
//     } else {
//       await createBatchGame(records);
//       records.splice(0, records.length);
//     }
//   } while (records.length > 0)
//   importedPage.buttonLoading = false
//   ElMessage({ message: t('message.importSuccess'), type: 'success' })
//   clearImport()
//   loadMemberInviteLimitRecords()
// }

function handleChangeSite(value) {
  form.siteId = value
}

// function validateClick(ref) {
//   const fieldRequired = ['platformName', 'gameType']
//   Promise.all(
//     fieldRequired.map(field => {
//       return new Promise((resolve, reject) => {
//         limitForm.value.validateField(field, async valid => {
//           resolve(valid)
//         })
//       })
//     })
//   ).then(valids => {
//     const valid = valids.every(validMsg => {
//       return validMsg === ''
//     })
//     if (valid) {
//       ref.input.click()
//     }
//   })
// }

// async function requestExportExcel() {
//   request.requestBy = store.state.user.name;
//   request.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
//   const { data: ret } = await getExport(request);
//   if (ret) {
//     uiControl.messageVisible = true;
//   }
// }

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = sites.list[0].id;
  }
  form.siteId = request.siteId
  await loadMemberInviteLimitRecords();
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
.grid-container {
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  transition: transform 0.5s;
}

.grid-item .el-image:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.grid-item.selected {
  box-shadow: 0 4px 8px rgba(12, 20, 242, 0.12), 0 0 6px rgba(12, 20, 242, 0.12);
  border: 1px solid blue;
}

.image-info {
  margin: 10px;
}

.image-info .el-row {
  margin-top: 10px;
}

.preview {
  width: 200px;
  height: 200px;
}

.smallPreview {
  width: 100px;
  height: 100px;
}

.info-table{
  width:100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 18px;
}

</style>
<style lang="scss">
.info-table td{
  padding: 10px 5px;
}
</style>
