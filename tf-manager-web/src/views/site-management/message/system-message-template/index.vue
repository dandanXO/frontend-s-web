<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.sendTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 250px"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSystemMessageTemplate"
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
          v-permission="['sys:message:add']"
          @click="showDialog()"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:message:del']"
          @click="removeSystemMessage()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="success"
          v-permission="['sys:message:import']"
          @click="uiControl.importDialogVisible = true"
        >
          {{ t('fields.massImport') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="t('fields.addSystemMessage')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-select
          v-model="selected.site"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 540px; margin-bottom: 16px"
          @change="handleSiteChange()"
        >
          <el-option
            v-for="item in list.sites"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-form-item :placeholder="t('fields.receiveType')" prop="receiveType">
          <el-radio-group
            v-model="form.receiveType"
            @change="handleRadioChangeLabel"
            class="form-input"
            style="width: 540px"
          >
            <el-radio
              v-for="r in uiControl.receiveType"
              :label="r.value"
              :key="r.value"
            >
              {{ r.typeName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <div
          v-if="form.receiveType === 'MULTIPLE'"
          class="el-input-tag input-tag-wrapper"
          :class="[uiControl.size ? 'el-input-tag--' + uiControl.size : '']"
          @click="foucusTagInput"
        >
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-autocomplete
            v-model="inputValue"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            class="inline-input"
            :placeholder="t('fields.addRecipient')"
            style="outline: none; border: none"
            :disabled="false"
            @select="handleSelect"
          />
        </div>
        <!-- <el-form-item prop="recipient" v-if="form.receiveType === 'MULTIPLE'" /> -->
        <el-form-item prop="vip" v-if="form.receiveType === 'VIP'">
          <el-select
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            v-model="selected.vips"
            size="small"
            placeholder="VIP"
            class="filter-item"
            style="width: 540px; margin-bottom: 16px"
            @change="handleChangeVips()"
          >
            <el-option
              v-for="item in dropdownList.vip"
              :key="item.id"
              :label="item.name"
              :value="item.level"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="title">
          <el-input
            style="width: 540px"
            v-model="form.title"
            :placeholder="t('fields.subject')"
          />
        </el-form-item>
        <el-form-item prop="content">
          <el-input
            v-model="form.content"
            :rows="8"
            type="textarea"
            :placeholder="t('fields.message')"
            style="width: 540px"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="t('fields.massImport')"
      v-model="uiControl.importDialogVisible"
      append-to-body
      width="1000px"
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
              v-for="item in list.sites"
              :key="item.key"
              :label="item.displayName"
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
        <el-table-column prop="title" :label="t('fields.title')" width="300" />
        <el-table-column prop="content" :label="t('fields.content')" width="330" />
        <el-table-column prop="receiveType" :label="t('fields.receiveType')" width="330" />
        <el-table-column prop="receiveRange" :label="t('fields.recipient')" width="330" />
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

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" v-if="!hasRole(['SUB_TENANT'])" />
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column prop="content" :label="t('fields.content')" />
      <el-table-column prop="receiveType" :label="t('fields.receiveType')" />
      <el-table-column prop="sendTime" :label="t('fields.sendTime')">
        <template #default="scope">
          <span v-if="scope.row.sendTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.sendTime !== null"
            v-formatter="{
              data: scope.row.sendTime,
              timeZone: scope.row.siteTimeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination
    class="pagination"
    @current-change="changePage"
    layout="prev, pager, next"
    :page-size="request.size"
    :page-count="page.pages"
    :current-page="request.current"
  />
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import * as XLSX from 'xlsx';
import { getMemberNameList } from '../../../../api/member'
import { getSiteListSimple } from '../../../../api/site'
import {
  createSystemMessageTemplate,
  deleteMessageTemplate,
  getSystemMessageTemplate,
  createBatchMessageTemplate
} from '../../../../api/system-message-template'
import { findLevelByVipName, getVipList } from '../../../../api/vip'
import { required } from '../../../../utils/validate'
import { hasRole } from '../../../../utils/util'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const dialogForm = ref(null)
const importRefForm = ref(null);

const EXPORT_MESSAGE_LIST_HEADER = [
  '标题',
  '内容',
  '领取模式（参照Mapping表）',
  '收件人（以逗号来区分）'
]

const EXPORT_MAPPING_HEADER = [
  '领取模式',
  '详情'
]

const IMPORT_MESSAGE_LIST_JSON = [
  'title',
  'content',
  'receiveType',
  'receiveRange'
]

const uiControl = reactive({
  dialogVisible: false,
  removeBtn: true,
  receiptInputVisible: false,
  receiveType: [
    { typeName: 'All', value: 'ALL' },
    { typeName: 'Specific Recipient', value: 'MULTIPLE' },
    { typeName: 'Specific VIP', value: 'VIP' },
  ],
  size: null,
  importDialogVisible: false
})

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

const importForm = reactive({
  siteId: null
});

const importRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))]
});

const request = reactive({
  size: 30,
  current: 1,
  sendTime: [],
})

function resetQuery() {
  request.sendTime = []
}

const form = reactive({
  receiveType: null,
  recipient: [],
  vip: null,
  title: null,
  content: null,
  siteId: null,
})

const selected = reactive({
  receiveTypeRadio: ref(),
  site: ref(),
  vips: [],
})

const list = reactive({
  vips: [],
  members: [],
  sites: [],
})

const selectionList = reactive({
  members: [],
})

const dropdownList = reactive({
  vip: [],
})

let chooseMessage = []

const inputValue = ref('')
const dynamicTags = ref([])

const handleClose = tag => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  const selectionArr = [...selectionList.members]
  selectionArr.forEach(element => {
    if (element.value === tag) {
      list.members.splice(1, 0, element)
      list.members.sort(function (a, b) {
        return a.id - b.id
      })
      selectionList.members.splice(selectionList.members.indexOf(element), 1)
    }
  })
  inputValue.value = ''
}

const querySearch = (queryString, cb) => {
  const results = queryString
    ? list.members.filter(createFilter(queryString))
    : list.members
  // call callback function to return suggestions
  cb(results)
}
const createFilter = queryString => {
  return item => {
    return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const handleSelect = item => {
  if (item) {
    dynamicTags.value.push(item.value)
    const removed = list.members.splice(list.members.indexOf(item), 1)
    const removedArr = [...removed]
    selectionList.members.push(removedArr[0])
  }
  inputValue.value = ''
}

const formRules = reactive({
  recipient: [required('Recipient is require')],
  vip: [required('vip')],
  title: [required('Subject is require')],
  content: [required('Message is require')],
})

function showDialog() {
  if (dialogForm.value) {
    dialogForm.value.resetFields()
  }
  form.receiveType = 'MULTIPLE'
  handleVipFilter()
  uiControl.dialogVisible = true
}

function handleRadioChangeLabel() {
  dynamicTags.value = []
  selectionList.members = []
  form.recipient = []
  form.title = null
  form.content = null

  if (selected.site !== undefined) {
    // reset the member name list (recipient input)
    loadMemberNameList()
  }
}

function handleSiteChange() {
  loadMemberNameList()
  handleVipFilter()
  selected.vip = null
}

function handleVipFilter() {
  dropdownList.vip = list.vips
  const newRecord = dropdownList.vip.filter(element => {
    return element.siteId === selected.site
  })
  dropdownList.vip = newRecord
}

function submit() {
  dialogForm.value.validate(async valid => {
    if (valid) {
      if (form.receiveType === 'MULTIPLE') {
        form.recipient = dynamicTags.value
      } else if (form.receiveType === 'VIP') {
        form.recipient.push(form.vip)
      }
      form.siteId = selected.site
      await createSystemMessageTemplate(form)
      uiControl.dialogVisible = false
      await loadSystemMessageTemplate()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function handleSelectionChange(val) {
  chooseMessage = val
  if (chooseMessage.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseMessage.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function handleChangeVips() {
  form.vip = selected.vips.join(',')
}

async function removeSystemMessage(systemMessage) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (systemMessage) {
      await deleteMessageTemplate([systemMessage.id])
    } else {
      await deleteMessageTemplate(chooseMessage.map(u => u.id))
    }
    await loadSystemMessageTemplate()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

const page = reactive({
  pages: 0,
  records: [],
})

async function loadSystemMessageTemplate() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.sendTime.length === 2) {
    query.sendTime = request.sendTime.join(',')
  }
  const { data: ret } = await getSystemMessageTemplate(query)
  page.pages = ret.pages
  page.records = ret.records
}

async function loadVipNameList() {
  const { data: ret } = await getVipList()
  // ret.forEach(function (entry) {
  //   var singleObj = {};
  //   singleObj.key = entry.id;
  //   singleObj.displayName = entry.name
  //   singleObj.value = entry.name;
  //   list.vips.push(singleObj);
  // });
  list.vips = ret
}

async function loadMemberNameList() {
  list.members = []
  const { data: ret } = await getMemberNameList(selected.site)
  ret.forEach(function (entry) {
    var singleObj = {}
    singleObj.id = entry.id
    singleObj.value = entry.value
    list.members.push(singleObj)
  })
}

async function loadSites() {
  list.sites = []
  const { data: ret } = await getSiteListSimple()
  ret.forEach(function (entry) {
    var singleObj = {}
    singleObj.key = entry.id
    singleObj.displayName = entry.siteName
    singleObj.value = entry.id
    list.sites.push(singleObj)
  })
}

async function downloadTemplate() {
  const exportMessage = [EXPORT_MESSAGE_LIST_HEADER];
  const maxLengthMessage = [];
  const wsMessage = XLSX.utils.aoa_to_sheet(exportMessage);
  setWidth(exportMessage, maxLengthMessage);
  const wsMessageCols = maxLengthMessage.map(w => {
    return { width: w };
  });
  wsMessage['!cols'] = wsMessageCols;

  const exportMapping = [EXPORT_MAPPING_HEADER];
  const maxLengthMapping = [];
  const mapping = [
    { receiveType: 'ALL', description: 'Everyone' },
    { receiveType: 'MULTIPLE', description: 'Specific Recipient' },
    { receiveType: 'VIP', description: 'Specific VIP' }
  ];
  pushRecordToData(mapping, exportMapping);
  const wsMapping = XLSX.utils.aoa_to_sheet(exportMapping);
  setWidth(exportMapping, maxLengthMapping);
  const wsMappingCols = maxLengthMapping.map(w => {
    return { width: w }
  });
  wsMapping['!cols'] = wsMappingCols;

  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Message');
  wb.Sheets.Message = wsMessage;
  wb.SheetNames.push('Mapping');
  wb.Sheets.Mapping = wsMapping;
  XLSX.writeFile(wb, 'message.xlsx');
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
  if (!importForm.siteId) {
    ElMessage({ message: t('message.selectSiteFirst'), type: 'error' });
    document.getElementById('importFile').value = '';
  } else {
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
              header: IMPORT_MESSAGE_LIST_JSON,
              range: 1,
            })
          );
          for (const d of data) {
            if (d.receiveType === 'MULTIPLE') {
              const recipientArr = d.receiveRange.split(',');
              d.recipient = recipientArr;
            } else if (d.receiveType === 'VIP') {
              const arr = d.receiveRange.split(',');
              const recipientArr = [];
              for (const v of arr) {
                const { data: id } = await findLevelByVipName(v, importForm.siteId);
                recipientArr.push(id);
              }
              d.recipient = recipientArr;
            }
          }
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
  importForm.siteId = null;
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
          item.siteId = importForm.siteId;
          Object.entries(value).forEach(([k, v]) => {
            if (k !== "receiveRange") {
              item[k] = v;
            }
          });
        }
        data.push(item);
      });

      const records = [...data];
      do {
        if (records.length > 10000) {
          await createBatchMessageTemplate(records.slice(0, 10000));
          records.splice(0, 10000);
        } else {
          await createBatchMessageTemplate(records);
          records.splice(0, records.length);
        }
      } while (records.length > 0)
      importedPage.buttonLoading = false;
      ElMessage({ message: t('message.importSuccess'), type: 'success' });
      clearImport();
      loadSystemMessageTemplate();
      importForm.siteId = null;
    }
  });
}

onMounted(() => {
  loadSystemMessageTemplate()
  loadVipNameList()
  loadSites()
})

function changePage(page) {
  request.current = page
  loadSystemMessageTemplate()
}
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
.input-tag-wrapper {
  position: relative;
  font-size: 14px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  outline: none;
  padding: 0 10px 0 5px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  margin-bottom: 16px;
}

.el-tag {
  margin-right: 4px;
}

.tag-input {
  background: transparent;
  border: none !important;
  font-size: 14px;
  height: 40px;
  outline: none;
  padding-left: 0;
  width: 100px;
}

.el-input-tag--mini .tag-input {
  height: 28px;
  line-height: 28px;
}

.el-input-tag--small .tag-input {
  height: 32px;
  line-height: 32px;
}

.el-input-tag--medium .tag-input {
  height: 36px;
  line-height: 36px;
}

::v-deep .el-autocomplete input {
  /* input { */
  /* background-color: red!important;  调试用的样式 */
  outline: none !important;
  border: none !important;
}
</style>
