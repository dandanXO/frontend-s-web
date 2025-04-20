<template>
  <div class="roles-main">
    <div class="header-container" style="margin-bottom: 40px">
      <div class="search">
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 100px;"
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
        <el-input
          v-model="request.memberName"
          size="small"
          style="width: 150px;margin-left: 5px"
          :placeholder="t('fields.memberName')"
        />
        <el-input
          v-model="request.telephone"
          size="small"
          style="width: 150px;margin-left: 5px"
          :placeholder="t('fields.telephone')"
        />
        <el-select
          clearable
          v-model="request.freezeType"
          size="small"
          :placeholder="t('fields.freezeType')"
          class="filter-item"
          style="width: 150px;margin-left: 5px"
        >
          <el-option
            v-for="item in freezeType.list"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.createBy"
          size="small"
          style="width: 150px;margin-left: 5px"
          :placeholder="t('fields.operator')"
        />
        <el-date-picker
          style="margin-left: 5px"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          v-model="request.createTime"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadFreezeRecords"
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
          v-permission="['sys:member:freeze:import']"
          @click="uiControl.importDialogVisible = true"
        >
          {{ t('fields.massImport') }}
        </el-button>
        <el-button size="mini" type="primary" @click="requestExportExcel">
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      style="width: 100%;margin: 20px;"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="memberName"
        :label="t('fields.memberName')"
        width="250"
      />
      <el-table-column
        prop="freezeType"
        :label="t('fields.freezeType')"
        width="250"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.freezeType === 'NORMAL'"
            type="warning"
            size="mini"
          >
            {{ t('freeze.NORMAL') }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.freezeType === 'TEMPORARY'"
            type="danger"
            size="mini"
          >
            {{ t('freeze.TEMPORARY') }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.freezeType === 'PERMANENT'"
            type="danger"
            size="mini"
            effect="dark"
          >
            {{ t('freeze.PERMANENT') }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.freezeType === 'UNFREEZE'"
            type="success"
            size="mini"
          >
            {{ t('freeze.UNFREEZE') }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="reason" :label="t('fields.reason')" width="250" />
      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
        width="250"
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
      <el-table-column prop="remark" :label="t('fields.remark')" width="250" />
      <el-table-column prop="createBy" :label="t('fields.operator')" />
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
    :title="t('fields.massImport')"
    v-model="uiControl.importDialogVisible"
    append-to-body
    width="800px"
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
    <el-form
      ref="importRefForm"
      :model="importForm"
      :rules="importRules"
      :inline="true"
      size="small"
      label-width="150px"
      style="padding-top: 20px;"
    >
      <el-form-item :label="t('fields.site')" prop="siteId">
        <el-select
          v-model="importForm.siteId"
          :placeholder="t('fields.site')"
          style="width: 350px;"
          filterable
          default-first-option
          @change="loadFormImportSelect"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.freezeType')" prop="freezeType">
        <el-select
          v-model="importForm.freezeType"
          :placeholder="t('fields.freezeType')"
          style="width: 350px;"
        >
          <el-option
            v-for="item in uiControl.freezeType"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.reason')" prop="reason">
        <el-select
          v-model="importForm.reason"
          :placeholder="t('fields.reason')"
          style="width: 350px;"
        >
          <el-option
            v-for="item in uiControl.freezeReason"
            :key="item.key"
            :label="item.name"
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
      <el-table-column
        prop="memberId"
        :label="t('fields.memberId')"
        width="250"
      />
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        width="250"
      />
      <el-table-column prop="remark" :label="t('fields.remark')" width="250" />
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
    v-permission="['sys:member:freeze:export']"
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
import moment from 'moment'
import { onMounted, reactive, computed, ref } from 'vue'
import { getFreezeRecords, getExportMemberFreeze } from '../../../api/freeze'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../store'
import { getSiteListSimple } from '../../../api/site'
import { getShortcuts } from '@/utils/datetime'
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { TENANT } from '../../../store/modules/user/action-types'
// import { title } from '../../../config/vue.custom.config'
import * as XLSX from 'xlsx'
import { findIdByLoginName, freezeMemberBatchUpdate } from '../../../api/member'
import { ElMessage } from 'element-plus'
import { required } from '../../../utils/validate'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const shortcuts = getShortcuts(t)

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
let timeZone = null
const importRefForm = ref(null)

const request = reactive({
  size: 30,
  current: 1,
  memberName: null,
  freezeType: null,
  createBy: null,
  siteId: 0,
  createTime: [defaultStartDate, defaultEndDate],
})

const siteList = reactive({
  list: [],
})

const importRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  freezeType: [required(t('message.validateFreezeTypeRequired'))],
  reason: [required(t('message.validateReasonRequired'))],
  remark: [required(t('message.validateRemarkRequired'))],
})

const freezeType = reactive({
  list: [
    { key: 1, name: t('freeze.NORMAL'), value: 'NORMAL' },
    { key: 2, name: t('freeze.TEMPORARY'), value: 'TEMPORARY' },
    { key: 3, name: t('freeze.PERMANENT'), value: 'PERMANENT' },
    { key: 4, name: t('freeze.UNFREEZE'), value: 'UNFREEZE' },
  ],
})

const uiControl = reactive({
  importDialogVisible: false,
  freezeType: [
    { key: 1, name: t('types.NORMAL'), value: 'NORMAL' },
    { key: 2, name: t('types.TEMPORARY'), value: 'TEMPORARY' },
    { key: 3, name: t('types.PERMANENT'), value: 'PERMANENT' },
  ],
  freezeReason: [
    { key: 1, name: t('types.gameViolation'), value: 'Game Violation' },
    { key: 2, name: t('types.memberRequest'), value: 'Member Request' },
    { key: 3, name: t('types.others'), value: 'Others' },
  ],
})

const importForm = reactive({
  siteId: null,
  freezeType: null,
  reason: null,
  remark: null,
})

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

const IMPORT_FREEZE_LIST = ['loginName', 'remark']

function resetQuery() {
  request.memberName = null
  request.freezeType = null
  request.createBy = null
  request.createTime = []
  request.siteId = store.state.user.siteId
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

async function loadFreezeRecords() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
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
  const { data: ret } = await getFreezeRecords(query)
  page.pages = ret.pages
  page.records = ret.records
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
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
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
  const { data: ret } = await getExportMemberFreeze(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

function changePage(page) {
  request.current = page
  loadFreezeRecords()
}

async function downloadTemplate() {
  const exportAmountAdjust = [IMPORT_FREEZE_LIST]
  const maxLengthAdmountAdjust = []
  const mFreezeRecord = XLSX.utils.aoa_to_sheet(exportAmountAdjust)
  setWidth(exportAmountAdjust, maxLengthAdmountAdjust)
  const wsAdmountAdjustCols = maxLengthAdmountAdjust.map(w => {
    return { width: w }
  })
  mFreezeRecord['!cols'] = wsAdmountAdjustCols

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Member_Freeze_Record')
  wb.Sheets.Member_Freeze_Record = mFreezeRecord
  XLSX.writeFile(wb, 'member_freeze_template.xlsx')
}

/* eslint-disable */
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
            header: IMPORT_FREEZE_LIST,
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
  uiControl.importDialogVisible = false
  importForm.freezeType = null
  importForm.reason = null
  importRefForm.value = null
  importedPage.records = []
  importedPage.pages = 0
  importedPage.current = 1
  importedPage.size = 10
}

async function confirmImport() {
  importRefForm.value.validate(async valid => {
    if (valid) {
      importedPage.buttonLoading = true
      const recordCopy = { ...importedPage.records }
      const data = []
      Object.entries(recordCopy).forEach(([key, value]) => {
        const item = {}
        if (value) {
          item.site = importForm.siteId
          item.freezeType = importForm.freezeType
          item.reason = importForm.reason
          item.remark = importForm.remark
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
          await freezeMemberBatchUpdate(records.slice(0, 10000))
          records.splice(0, 10000)
        } else {
          await freezeMemberBatchUpdate(records)
          records.splice(0, records.length)
        }
      } while (records.length > 0)
      importedPage.buttonLoading = false
      ElMessage({ message: t('message.importSuccess'), type: 'success' })
      clearImport()
      loadFreezeRecords()
      importForm.freezeType = null
      importForm.reason = null
    }
  })
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  importForm.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
    importForm.siteId = site.value.id
  }
  loadFreezeRecords()
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
