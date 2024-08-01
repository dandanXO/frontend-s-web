<template>
  <div class="roles-main">
    <div class="search">
      <el-row>
        <input
          id="importFile"
          type="file"
          accept=".xlsx, .xls"
          @change="importToTable"
          hidden
        >
      </el-row>

      <el-row style="margin-top: 10px;">
        <el-form
          ref="sendSmsForm"
          :model="smsForm"
          :inline="true"
          size="small"
          label-width="150px"
          style="float: right;"
        >
          <el-form-item :label="t('fields.smsType')" prop="param">
            <el-radio-group
              v-model="smsForm.param"
              size="mini"
              style="width: 450px"
            >
              <el-radio-button label="1">
                {{ t('smsSend.template1') }}
              </el-radio-button>
              <el-radio-button label="2">
                {{ t('smsSend.template2') }}
              </el-radio-button>
              <el-radio-button label="3">
                {{ t('smsSend.template3') }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-row>

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

      <el-button
        type="primary"
        size="mini"
        :disabled="importedPage.records.length === 0"
        @click="confirmImport"
        :loading="importedPage.buttonLoading"
      >
        {{ t('fields.confirmAndSend') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { sendGroupSms } from '../../../api/send-sms'
import * as XLSX from 'xlsx'

const { t } = useI18n()

const sendSmsForm = ref(null)

const smsForm = reactive({
  param: '1',
  telephone: null,
})

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

const IMPORT_TELEPHONE_IMPORT_LIST_JSON = ['telephone']

const EXPORT_BET_RECORD_IMPORT_LIST_HEADER = [
  'Telephone',
  'Start With 0',
]

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
            header: IMPORT_TELEPHONE_IMPORT_LIST_JSON,
            range: 1,
          })
        )
        break
      }
      console.log(data)
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

async function confirmImport() {
  importedPage.buttonLoading = true
  const recordCopy = { ...importedPage.records }
  const data = []
  Object.entries(recordCopy).forEach(([key, value]) => {
    data.push(value.telephone)
  })

  smsForm.telephone = JSON.stringify(data)
    .replace('[', '')
    .replace(']', '')
  await sendGroupSms(smsForm)
  importedPage.buttonLoading = false
  ElMessage({ message: t('message.importSuccess'), type: 'success' })
  clearImport()
}

function clearImport() {
  importedPage.buttonLoading = false
  importedPage.loading = false
  importedPage.records = []
  importedPage.pages = 0
  importedPage.current = 1
  smsForm.param = '1'
}

async function downloadTemplate() {
  const exportBetRecordImport = [EXPORT_BET_RECORD_IMPORT_LIST_HEADER];
  const maxLengthBetRecordImport = [];
  const wsBetRecordImport = XLSX.utils.aoa_to_sheet(exportBetRecordImport);
  setWidth(exportBetRecordImport, maxLengthBetRecordImport);
  const wsBetRecordImportCols = maxLengthBetRecordImport.map(w => {
    return { width: w };
  });
  wsBetRecordImport['!cols'] = wsBetRecordImportCols;

  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Telephone_Import');
  wb.Sheets.Telephone_Import = wsBetRecordImport;
  XLSX.writeFile(wb, 'telephone_import.xlsx');
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
</script>
