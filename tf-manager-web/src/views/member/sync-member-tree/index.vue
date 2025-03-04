<template>
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
  <div class="btn-group">
    <el-select
      v-model="importSiteId"
      size="small"
      :placeholder="$t('fields.site')"
      class="filter-item"
      style="width: 150px;"
    >
      <el-option
        v-for="item in siteList.list"
        :key="item.id"
        :label="item.siteName"
        :value="item.id"
      />
    </el-select>
  </div>
  <el-table
    :data="importedPage.records.slice(
      importedPage.size * (importedPage.current - 1),
      importedPage.size * importedPage.current
    )"
    v-loading="importedPage.loading"
    ref="table"
    row-key="id"
    size="small"
    :empty-text="t('fields.noData')"
  >
    <el-table-column
      prop="loginName"
      :label="t('fields.loginName')"
      width="250"
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
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { importSyncTree } from '../../../api/sync-member-tree'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { ElMessage } from "element-plus";
import * as XLSX from 'xlsx'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  importDialogVisible: false
})

const importSiteId = ref(null)

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false
})

const IMPORT_LIST = ["loginName"]

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function downloadTemplate() {
  const exportSyncMemberTree = [IMPORT_LIST]
  const maxLengthSyncMemberTree = []
  const mSyncMemberTree = XLSX.utils.aoa_to_sheet(exportSyncMemberTree)
  setWidth(exportSyncMemberTree, maxLengthSyncMemberTree)
  const wsSyncMemberTreeCols = maxLengthSyncMemberTree.map(w => {
    return { width: w }
  })
  mSyncMemberTree['!cols'] = wsSyncMemberTreeCols

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Sync_Member_Tree')
  wb.Sheets.Sync_Member_Tree = mSyncMemberTree
  XLSX.writeFile(wb, 'sync_member_tree.xlsx')
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
            header: IMPORT_LIST,
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
  uiControl.importDialogVisible = false
  importedPage.records = []
  importedPage.pages = 0
  importedPage.current = 1
  importedPage.size = 10
}

async function confirmImport() {
  importedPage.buttonLoading = true
  const recordCopy = { ...importedPage.records }
  const data = []
  Object.entries(recordCopy).forEach(([key, value]) => {
    const item = {}
    if (value) {
      item.site = importSiteId.value
      Object.entries(value).forEach(([k, v]) => {
        item[k] = v
      })
    }
    data.push(item)
  })

  const records = [...data]
  do {
    if (records.length > 10000) {
      await importSyncTree(records.slice(0, 10000))
      records.splice(0, 10000)
    } else {
      await importSyncTree(records)
      records.splice(0, records.length)
    }
  } while (records.length > 0)
  importedPage.buttonLoading = false
  ElMessage({ message: t('message.importSuccess'), type: 'success' })
  clearImport()
}

onMounted(async () => {
  await loadSites()
  importSiteId.value = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    importSiteId.value = site.value.id
  }
  await loadMembers();
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
  justify-content: flex-start;
}

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

:deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.level-color {
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
