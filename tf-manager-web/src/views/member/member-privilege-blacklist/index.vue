<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          clearable
          v-model="request.privilegeId"
          size="small"
          :placeholder="t('fields.privilege')"
          class="filter-item"
          style="width: 400px; margin-left: 10px"
        >
          <el-option
            v-for="item in requestPriviList.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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

        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadBlacklist()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
        <el-button size="mini" type="primary" @click="requestExportExcel">
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:member:privilege-blacklist:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          v-permission="['sys:member:privilege-blacklist:import']"
          @click="showDialog('IMPORT')"
        >
          {{ t('fields.massImport') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          @click="removeBlacklist()"
          :disabled="uiControl.removeBtn"
          v-permission="['sys:member:privilege-blacklist:del']"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">
            {{ t('fields.memberPrivilegeBlacklist') }}
          </span>
        </div>
      </template>

      <el-table
        :data="page.records"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        @selection-change="handleSelectionChange"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          min-width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.loginName === null">-</span>
            <span v-if="scope.row.loginName !== null">
              {{ scope.row.loginName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="privilegeName"
          :label="t('fields.privilegeName')"
          min-width="150"
        >
          <template #default="scope">
            <span
              v-if="
                scope.row.privilegeName === null && scope.row.privilegeId !== -1
              "
            >
              -
            </span>
            <span
              v-if="
                scope.row.privilegeName === null && scope.row.privilegeId === -1
              "
            >
              {{ t('fields.allPrivilege') }}
            </span>
            <span v-if="scope.row.privilegeName !== null">
              {{ scope.row.privilegeName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="t('fields.createTime')"
          min-width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span
              v-if="scope.row.createTime !== null"
              v-formatter="{
                data: scope.row.createTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          :label="t('fields.createBy')"
          min-width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.createBy === null">-</span>
            <span v-if="scope.row.createBy !== null">
              {{ scope.row.createBy }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="right"
          fixed="right"
          v-if="
            !hasRole(['SUB_TENANT']) &&
              hasPermission(['sys:member:privilege-blacklist:del'])
          "
        >
          <template #default="scope">
            <el-button
              icon="el-icon-remove"
              size="mini"
              type="danger"
              v-permission="['sys:member:privilege-blacklist:del']"
              @click="removeBlacklist(scope.row)"
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
        <el-form-item :label="t('fields.loginName')" prop="memberId">
          <el-input style="width: 350px" v-model="form.loginName" />
        </el-form-item>
        <el-form-item :label="t('fields.privilege')" prop="privilegeId">
          <el-select
            v-model="form.privilegeId"
            :placeholder="t('fields.privilege')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadPrivilegeNamesBySiteId"
            :disabled="!form.siteId"
          >
            <el-option key="-1" :label="t('fields.allPrivilege')" value="-1" />
            <el-option
              v-for="item in privilegeInfoList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="create">
            {{ t('fields.confirm') }}
          </el-button>
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
            width="330"
          />
          <el-table-column
            prop="privilegeId"
            :label="t('fields.privilegeId')"
            width="330"
          />
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

    <el-dialog
      v-permission="['sys:member:privilege-blacklist:export']"
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import * as XLSX from 'xlsx'
import { hasRole, hasPermission } from '../../../utils/util'
import {
  createBatchBlacklist,
  createBlacklist,
  deleteBlacklist,
  getBlacklist,
  getExportMemberPrivilegeBlacklist,
} from '../../../api/member-privilege-blacklist'
import {
  getActivePrivilegeInfo,
  getActivePrivilegeInfoBySiteId,
  getPrivilegeExcelMapping,
} from '../../../api/privilege-info'
import { useStore } from '../../../store'
import { getSiteListSimple } from '../../../api/site'
import { findIdByLoginName } from '../../../api/member'
import { TENANT } from '../../../store/modules/user/action-types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { required } from '../../../utils/validate'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)

const EXPORT_LIST_HEADER = ['Login Name', 'Privilege ID (Refer Mapping Sheet)']

const EXPORT_MAPPING_PRIVI_HEADER = [
  'Privilege ID',
  'Privilege Name',
  'Privilege Code',
]

const IMPORT_LIST_HEADER = ['loginName', 'privilegeId']

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  removeBtn: true,
})
const site = ref(null)
const blacklistForm = ref(null)
const dialogWidth = ref('580px')

let timeZone = null
const siteList = reactive({
  list: [],
})
const privilegeInfoList = reactive({
  list: [],
})
const requestPriviList = reactive({
  list: [],
})

let chooseBlacklist = []

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  privilegeId: null,
  siteId: null,
})

const form = reactive({
  id: null,
  siteId: null,
  memberId: null,
  privilegeId: null,
})

const importForm = reactive({
  siteId: null,
})

const importRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
})

function resetQuery() {
  request.loginName = null
  request.privilegeId = null
  request.siteId = store.state.user.siteId
}

async function loadBlacklist() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const { data: ret } = await getBlacklist(query)
  page.pages = ret.pages
  page.records = ret.records
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  page.loading = false
}

async function requestExportExcel() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const { data: ret } = await getExportMemberPrivilegeBlacklist(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadBlacklist()
  }
}

function handleSelectionChange(val) {
  chooseBlacklist = val
  if (chooseBlacklist.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseBlacklist.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function loadPrivilegeInfos(siteId) {
  if (siteId) {
    const { data: privilegeInfo } = await getActivePrivilegeInfoBySiteId(siteId)
    requestPriviList.list = privilegeInfo
  } else {
    const { data: privilegeInfo } = await getActivePrivilegeInfo()
    requestPriviList.list = privilegeInfo
  }
}

async function loadFormSelect() {
  form.memberId = null
  form.privilegeId = null
  await loadPrivilegeNamesBySiteId()
}

async function loadPrivilegeNamesBySiteId() {
  if (form.siteId) {
    const { data: privilegeInfo } = await getActivePrivilegeInfoBySiteId(
      form.siteId
    )
    privilegeInfoList.list = privilegeInfo
  }
}

async function showDialog(type) {
  if (type === 'CREATE') {
    dialogWidth.value = '580px'
    if (blacklistForm.value) {
      blacklistForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addMemberPrivilegeBlacklist')
    form.siteId = siteList.list[0].id
    await loadFormSelect()
  } else if (type === 'IMPORT') {
    dialogWidth.value = '900px'
    uiControl.dialogTitle = t('fields.massImport')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function create() {
  blacklistForm.value.validate(async valid => {
    form.id = null
    if (valid) {
      await createBlacklist(form)
      uiControl.dialogVisible = false
      await loadBlacklist()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

async function removeBlacklist(blacklist) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (blacklist) {
      await deleteBlacklist([blacklist.id])
    } else {
      await deleteBlacklist(chooseBlacklist.map(a => a.id))
    }
    await loadBlacklist()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function downloadTemplate() {
  const exportBlacklist = [EXPORT_LIST_HEADER]
  const maxLengthBlacklist = []
  const wsBlacklist = XLSX.utils.aoa_to_sheet(exportBlacklist)
  setWidth(exportBlacklist, maxLengthBlacklist)
  const wsBlacklistCols = maxLengthBlacklist.map(w => {
    return { width: w }
  })
  wsBlacklist['!cols'] = wsBlacklistCols
  let privilegeMapping = {}

  if (site.value && site.value.id) {
    const { data: ret } = await getPrivilegeExcelMapping(site.value.id)
    privilegeMapping = ret
  } else {
    const { data: ret } = await getPrivilegeExcelMapping()
    privilegeMapping = ret
  }
  const exportMapping = [EXPORT_MAPPING_PRIVI_HEADER]
  const maxLengthMapping = []
  pushRecordToData(privilegeMapping, exportMapping)
  const wsMapping = XLSX.utils.aoa_to_sheet(exportMapping)
  setWidth(exportMapping, maxLengthMapping)
  const wsMappingCols = maxLengthMapping.map(w => {
    return { width: w }
  })
  wsMapping['!cols'] = wsMappingCols

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Member_Privilege_Blacklist')
  wb.Sheets.Member_Privilege_Blacklist = wsBlacklist
  wb.SheetNames.push('Mapping')
  wb.Sheets.Mapping = wsMapping
  XLSX.writeFile(wb, 'member_privilege_blacklist.xlsx')
}

function pushRecordToData(records, exportData) {
  const data = records.map(record =>
    Object.values(record).map(item => (!item || item === '' ? '-' : item))
  )
  exportData.push(...data)
}

function setWidth(exportData, maxLength) {
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key]

      maxLength[key] =
        typeof value === 'number'
          ? maxLength[key] >= 10
            ? maxLength[key]
            : 10
          : maxLength[key] >= value.length + 2
            ? maxLength[key]
            : value.length + 2
    })
  })
}

function chooseFile() {
  document.getElementById('importFile').click()
}

function importToTable(file) {
  importedPage.loading = true
  importedPage.buttonLoading = false
  const files = file.target.files[0]
  const allowFileType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]
  if (allowFileType.find(ftype => ftype.includes(files.type))) {
    const fileReader = new FileReader()

    fileReader.onload = async event => {
      const { result } = event.target
      const workbook = XLSX.read(result, { type: 'binary' })
      let data = []
      for (const sheet in workbook.Sheets) {
        data = data.concat(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: IMPORT_LIST_HEADER,
            range: 1,
          })
        )
        for (const d of data) {
          const { data: id } = await findIdByLoginName(
            d.loginName,
            importForm.siteId
          )
          d.memberId = id
        }
        break
      }
      importedPage.records = data
      importedPage.pages = Math.ceil(
        importedPage.records.length / importedPage.size
      )
    }
    fileReader.readAsBinaryString(files)
    document.getElementById('importFile').value = ''
  } else {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  }
  importedPage.loading = false
}

function changeImportedPage(page) {
  importedPage.current = page
}

function clearImport() {
  uiControl.dialogVisible = false
  importedPage.buttonLoading = false
  importedPage.loading = false
  importedPage.records = []
  importedPage.pages = 0
  importedPage.current = 1
}

async function confirmImport() {
  importedPage.buttonLoading = true
  const recordCopy = { ...importedPage.records }
  const data = []
  Object.entries(recordCopy).forEach(([key, value]) => {
    const item = {}
    if (value) {
      Object.entries(value).forEach(([k, v]) => {
        if (k !== 'loginName') {
          item[k] = v
        }
      })
    }
    data.push(item)
  })

  const records = [...data]
  do {
    if (records.length > 10000) {
      await createBatchBlacklist(records.slice(0, 10000))
      records.splice(0, 10000)
    } else {
      await createBatchBlacklist(records)
      records.splice(0, records.length)
    }
  } while (records.length > 0)
  importedPage.buttonLoading = false
  ElMessage({ message: t('message.importSuccess'), type: 'success' })
  clearImport()
  loadBlacklist()
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }

  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    await loadPrivilegeInfos(site.value.id)
  } else {
    await loadPrivilegeInfos(store.state.user.siteId)
  }
  await loadBlacklist()
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}
</style>
