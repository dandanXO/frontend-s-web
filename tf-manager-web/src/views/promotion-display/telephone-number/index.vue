<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.telephone"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.telephone')"
        />
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
          @click="loadTelephones"
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
          v-permission="['sys:telephone:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:telephone:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:telephone:del']"
          @click="removeTelephone()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="primary"
          v-permission="['sys:telephone:add']"
          @click="uiControl.importDialogVisible = true"
        >
          {{ t('fields.massImport') }}
        </el-button>
      </div>
    </div>

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
          prop="telephone"
          :label="t('fields.telephone')"
          width="150"
        />
        <el-table-column prop="siteId" :label="t('fields.site')" width="100" />
        <el-table-column prop="bonusAmount" :label="t('fields.bonusAmount')" width="150">
          <template #default="scope">
            $
            <!-- eslint-disable -->
            <span
              v-formatter="{ data: scope.row.bonusAmount, type: 'money' }"
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

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="telephoneForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="160px"
      >
        <el-form-item :label="t('fields.telephone')" prop="telephone">
          <el-input v-model="form.telephone" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteName"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @change="handleChangeSite"
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
         <el-form-item :label="t('fields.bonusAmount')" prop="bonusAmount">
              <span >
                $
                <el-input-number
                  v-model="form.bonusAmount"
                  style="width: 135px"
                  :min="1"
                  :max="999999999999999"
                  :controls="false"
                  @keypress="restrictInput($event)"
                />
              </span>
             
            </el-form-item>
        <el-form-item :label="t('fields.privilegeRedeemed')" prop="privilegeStatus" v-if="uiControl.dialogType !== 'CREATE'">
          <el-radio-group
            v-model="form.privilegeStatus"
            size="mini"
            style="width: 300px"
          >
            <el-radio-button label="0">YES</el-radio-button>
            <el-radio-button label="1">NO</el-radio-button>
          </el-radio-group>
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
      <el-table-column
        prop="telephone"
        :label="t('fields.telephone')"
        min-width="150"
      />
      <el-table-column prop="siteName" :label="t('fields.site')" width="150" />
      <el-table-column prop="bonusAmount" :label="t('fields.bonusAmount')" width="150">
        <template #default="scope">
          $
          <!-- eslint-disable -->
          <span v-formatter="{ data: scope.row.bonusAmount, type: 'money' }" />
        </template>
      </el-table-column>
      <el-table-column prop="privilegeStatus" :label="t('fields.status')" width="150">
        <template #default="scope">
          <el-tag
            v-if="scope.row.privilegeStatus === 1"
            type="success"
            size="mini"
          >
            NO REDEEM
          </el-tag>
          <el-tag
            v-if="scope.row.privilegeStatus === 0"
            type="danger"
            size="mini"
          >
            REDEEMED
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="redeemedBy" :label="t('fields.redeemedBy')" min-width="150">
        <template #default="scope">
          <span v-if="scope.row.redeemedBy === null">-</span>
          <span v-if="scope.row.redeemedBy !== null">{{ scope.row.redeemedBy }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="
          !hasRole(['SUB_TENANT']) &&
          (hasPermission(['sys:telephone:update']) ||
            hasPermission(['sys:telephone:del']))
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:telephone:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:telephone:del']"
            @click="removeTelephone(scope.row)"
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
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import * as XLSX from 'xlsx'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createBatchTelephone,
  createTelephone,
  deleteTelephone,
  getTelephones,
  updateTelephone,
} from '../../../api/site-telephone-number'
import { getSiteListSimple, getSiteExcelMapping } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const telephoneForm = ref(null)

const EXPORT_TELEPHONE_LIST_HEADER = [
  'Telephone Number',
  'Site ID (Refer Mapping Sheet)',
  'Bonus Amount',
]

const IMPORT_TELEPHONE_LIST_JSON = ['telephone', 'siteId', 'bonusAmount']

const EXPORT_MAPPING_SITE_HEADER = [
  'Site ID',
  'Site Name',
  'Site Code',
  'Currency',
]

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
})
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
  name: null,
  platform: null,
  siteId: null,
})

const form = reactive({
  id: null,
  telephone: null,
  privilegeStatus: null,
  siteName: null,
  siteId: null,
  bonusAmount: null,
})

const formRules = reactive({
  telephone: [required(t('message.validateTelephoneRequired'))],
  privilegeStatus: [required(t('message.validateStatusRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
})

const sites = reactive({
  list: [],
})

let chooseTelephone = []

function resetQuery() {
  request.telephone = null
  request.siteId = site.value ? site.value.id : null
}

function handleSelectionChange(val) {
  chooseTelephone = val
  if (chooseTelephone.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseTelephone.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadTelephones() {
  page.loading = true
  const { data: ret } = await getTelephones(request)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

function changePage(page) {
  request.current = page
  loadTelephones()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (telephoneForm.value) {
      telephoneForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addTelephone')
    form.id = null
    form.privilegeStatus = 1
    form.siteName = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editTelephone')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(telephone) {
  showDialog('EDIT')
  if (!telephone) {
    telephone = chooseTelephone[0]
  }
  nextTick(() => {
    for (const key in telephone) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = telephone[key]
    }
  })
}

function create() {
  telephoneForm.value.validate(async valid => {
    if (valid) {
      await createTelephone(form)
      uiControl.dialogVisible = false
      await loadTelephones()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  telephoneForm.value.validate(async valid => {
    if (valid) {
      await updateTelephone(form)
      uiControl.dialogVisible = false
      await loadTelephones()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeTelephone(telephone) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (telephone) {
      await deleteTelephone([telephone.id])
    } else {
      await deleteTelephone(chooseTelephone.map(u => u.id))
    }
    await loadTelephones()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

async function downloadTemplate() {
  const exportTelephoneList = [EXPORT_TELEPHONE_LIST_HEADER]
  const maxLengthTelephoneList = []
  const wsTelephoneList = XLSX.utils.aoa_to_sheet(exportTelephoneList)
  setWidth(exportTelephoneList, maxLengthTelephoneList)
  const wsTelephoneListCols = maxLengthTelephoneList.map(w => {
    return { width: w }
  })
  wsTelephoneList['!cols'] = wsTelephoneListCols

  const { data: sitesMapping } = await getSiteExcelMapping()
  const exportMapping = [EXPORT_MAPPING_SITE_HEADER]
  const maxLengthMapping = []
  pushRecordToData(sitesMapping, exportMapping)
  const wsMapping = XLSX.utils.aoa_to_sheet(exportMapping)
  setWidth(exportMapping, maxLengthMapping)
  const wsMappingCols = maxLengthMapping.map(w => {
    return { width: w }
  })
  wsMapping['!cols'] = wsMappingCols

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Telephone_List')
  wb.Sheets.Telephone_List = wsTelephoneList
  wb.SheetNames.push('Mapping')
  wb.Sheets.Mapping = wsMapping
  XLSX.writeFile(wb, 'telephone_list.xlsx')
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

    fileReader.onload = event => {
      const { result } = event.target
      const workbook = XLSX.read(result, { type: 'binary' })
      let data = []
      for (const sheet in workbook.Sheets) {
        data = data.concat(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: IMPORT_TELEPHONE_LIST_JSON,
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
  importedPage.buttonLoading = false
  importedPage.loading = false
  importedPage.records = []
  importedPage.pages = 0
  importedPage.current = 1
}

async function confirmImport() {
  importedPage.buttonLoading = true;
  const records = [...importedPage.records];
  do {
    if (records.length > 10000) {
      await createBatchTelephone(records.slice(0, 10000));
      records.splice(0, 10000);
    } else {
      await createBatchTelephone(records);
      records.splice(0, records.length);
    }
  } while (records.length > 0)
  importedPage.buttonLoading = false
  ElMessage({ message: t('message.importSuccess'), type: 'success' })
  clearImport()
  loadTelephones()
}

function handleChangeSite(value) {
  form.siteId = value
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName)
    request.siteId = site.value.id
  }
  await loadTelephones()
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
