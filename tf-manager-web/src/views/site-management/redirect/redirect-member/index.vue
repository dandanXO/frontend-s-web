<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.loginName')"
        />

        <el-input
          v-model="request.title"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.title')"
        />

        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRedirectMember()"
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
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          v-permission="['sys:site:redirect:member:import']"
          @click="openDialog()"
        >
          {{ t('fields.massImport') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:site:redirect:member:export']"
          @click="requestExportExcel"
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
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="title" :label="t('fields.title')" width="200" />
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        width="200"
      />

      <el-table-column
        prop="createBy"
        :label="t('fields.createBy')"
        width="200"
      />

      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
        width="200"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
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
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        width="200"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:site:redirect:member:del']"
            @click="removeRedirectMember(scope.row.id)"
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
  </div>

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="900px"
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
        width="230"
      />
      <el-table-column
        prop="redirectId"
        :label="t('fields.redirectId')"
        width="200"
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
      <el-button @click="clearImport();uiControl.dialogVisible = false;">
        {{ t('fields.cancel') }}
      </el-button>
    </div>
  </el-dialog>
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
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import * as XLSX from 'xlsx'
import moment from 'moment'
import {
  getRedirectMember,
  importRedirectMember,
  exportRedirectMember,
  getRedirectExcelMapping,
  deleteRedirectMember,
} from '@/api/redirect'
import { getSiteListSimple } from '@/api/site'
import { useStore } from '@/store'
import { TENANT } from '@/store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatInputTimeZone } from '@/utils/format-timeZone'

const { t } = useI18n()
let timeZone = null

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})

const EXPORT_REDIRECT_MEMBER_LIST_HEADER = ['Login Name', 'Redirect ID']

const EXPORT_MAPPING_REDIRECT_HEADER = ['Redirect ID', 'Redirect Title']

const IMPORT_REDIRECT_MEMBER_LIST_JSON = ['loginName', 'redirectId']

const uiControl = reactive({
  dialogTitle: null,
  dialogVisible: false,
  messageVisible: false,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalAmount: 0,
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
  title: null,
})

function resetQuery() {
  request.loginName = null
  request.title = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  query.createTime = formatInputTimeZone(query.recordTime, timeZone)
  return query
}

async function loadRedirectMember() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getRedirectMember(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadRedirectMember()
}

function openDialog() {
  uiControl.dialogTitle = t('fields.massImport')
  uiControl.dialogVisible = true
  clearImport()
}

async function downloadTemplate() {
  const exportRedirectMember = [EXPORT_REDIRECT_MEMBER_LIST_HEADER]
  const maxLengthRedirectMember = []
  const wsRedirectMember = XLSX.utils.aoa_to_sheet(exportRedirectMember)
  setWidth(exportRedirectMember, maxLengthRedirectMember)
  const wsRedirectMemberCols = maxLengthRedirectMember.map(w => {
    return { width: w }
  })
  wsRedirectMember['!cols'] = wsRedirectMemberCols

  let redirectMapping = {}
  const { data: ret } = await getRedirectExcelMapping(request.siteId)
  redirectMapping = ret

  const exportMapping = [EXPORT_MAPPING_REDIRECT_HEADER]
  const maxLengthMapping = []
  pushRecordToData(redirectMapping, exportMapping)
  const wsMapping = XLSX.utils.aoa_to_sheet(exportMapping)
  setWidth(exportMapping, maxLengthMapping)
  const wsMappingCols = maxLengthMapping.map(w => {
    return { width: w }
  })
  wsMapping['!cols'] = wsMappingCols

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Redirect_Member')
  wb.Sheets.Redirect_Member = wsRedirectMember
  wb.SheetNames.push('Mapping')
  wb.Sheets.Mapping = wsMapping
  XLSX.writeFile(wb, 'redirect_member.xlsx')
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
            header: IMPORT_REDIRECT_MEMBER_LIST_JSON,
            range: 1,
          })
        )
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
      item.siteId = request.siteId
      Object.entries(value).forEach(([k, v]) => {
        item[k] = v
      })
    }
    data.push(item)
  })

  const records = [...data]
  do {
    if (records.length > 10000) {
      await importRedirectMember(records.slice(0, 10000))
      records.splice(0, 10000)
    } else {
      await importRedirectMember(records)
      records.splice(0, records.length)
    }
  } while (records.length > 0)
  importedPage.buttonLoading = false
  uiControl.dialogVisible = false
  ElMessage({ message: t('message.importSuccess'), type: 'success' })
  clearImport()
  loadRedirectMember()
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await exportRedirectMember(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

async function removeRedirectMember(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteRedirectMember(id)
    await loadRedirectMember()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = store.state.user.siteId
  }
  await loadRedirectMember()
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-input-number:deep(.el-input__inner) {
  text-align: left;
}
</style>
