<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
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
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          v-model="request.fromPlatform"
          size="small"
          :placeholder="t('fields.fromPlatform')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="handleFromPlatformChange"
        >
          <el-option
            v-for="item in fromPlatform.list"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.fromGameCode"
          size="small"
          :placeholder="t('fields.fromGameCode')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in selectedPlatformGameCode.list"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.gameCode"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.toGameCode')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadGame"
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
          v-permission="['sys:site:tfgmap:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:site:tfgmap:del']"
          @click="removeGame()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="primary"
          v-permission="['sys:site:tfgmap:add']"
          @click="uiControl.importDialogVisible = true"
        >
          {{ t('fields.massImport') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:site:tfgmap:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
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
        <el-table-column prop="siteId" :label="t('fields.site')" width="100"/>
        <el-table-column prop="loginName" :label="t('fields.loginName')" width="150"/>
        <el-table-column prop="fromPlatform" :label="t('fields.fromPlatform')" width="150"/>
        <el-table-column prop="fromGameCode" :label="t('fields.fromGameCode')" width="150"/>
        <el-table-column prop="gameCode" :label="t('fields.toGameCode')" width="150"/>
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
      :close-on-press-escape="false"
    >
      <el-form
        ref="gameForm"
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
            @change="handleChangeSite"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px" :disabled="uiControl.dialogType === 'EDIT'"/>
        </el-form-item>
        <el-form-item :label="t('fields.fromPlatform')" prop="fromPlatform">
          <el-select
            v-model="form.fromPlatform"
            size="small"
            :placeholder="t('fields.fromPlatform')"
            class="filter-item"
            style="width: 350px"
            @change="handleFromPlatformChange"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in fromPlatform.list"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.fromGameCode')" prop="fromGameCode">
          <el-select
            v-model="form.fromGameCode"
            size="small"
            :placeholder="t('fields.fromGameCode')"
            class="filter-item"
            style="width: 350px"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in selectedPlatformGameCode.list"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.toGameCode')" prop="gameCode">
          <el-input v-model="form.gameCode" style="width: 350px"/>
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
      <el-table-column prop="siteName" :label="t('fields.site')" width="150"/>
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="150"/>
      <el-table-column prop="fromPlatform" :label="t('fields.fromPlatform')" min-width="180"/>
      <el-table-column prop="fromGameCode" :label="t('fields.fromGameCode')" min-width="180"/>
      <el-table-column prop="gameCode" :label="t('fields.toGameCode')" min-width="180"/>
      <el-table-column prop="diffDepositWithdraw" :label="t('fields.totalDeposit') + '-' + t('fields.totalWithdraw')" min-width="180">
        <template #default="scope">
            <span
              v-if="scope.row.diffDepositWithdraw < 0"
              style="color:red"
            >
              $
              <span
                v-formatter="{
                  data: scope.row.diffDepositWithdraw,
                  type: 'money',
                }"
              />
            </span>
          <span v-else>
              $
              <span
                v-formatter="{
                  data: scope.row.diffDepositWithdraw,
                  type: 'money',
                }"
              />
            </span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" :label="t('fields.balance')" min-width="180">
        <template #default="scope">
          $
          <span
            v-formatter="{
                data: scope.row.balance,
                type: 'money',
              }"
          />
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
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150"/>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:site:tfgmap:update']) || hasPermission(['sys:site:tfgmap:del']) )"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:site:tfgmap:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:site:tfgmap:del']"
            @click="removeGame(scope.row)"
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
    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
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
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import * as XLSX from 'xlsx'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createGame,
  deleteGame,
  getGames,
  updateGame,
  createBatchGame,
  getExport,
  preCheckForCreate,
} from '../../../api/tfg-member-game-map'
import { getSiteListSimple, getSiteExcelMapping } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from 'moment'
import { getConfigList } from "@/api/tf-gaming-config";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const gameForm = ref(null)

const EXPORT_GAME_LIST_HEADER = [
  'Site ID (Refer Mapping Sheet)',
  'Login Name',
  'From Platform (Refer Mapping Sheet)',
  'From Game Code (Refer Mapping Sheet)',
  'To Game Code',
]

const IMPORT_GAME_LIST_JSON = [
  'siteId',
  'loginName',
  'fromPlatform',
  'fromGameCode',
  'gameCode',
]

const EXPORT_MAPPING_SITE_HEADER = [
  'Site ID',
  'Site Name',
  'Site Code',
  'Currency',
]

const EXPORT_MAPPING_FROM_PLATFORM_HEADER = [
  'From Platform',
  'From Game Code',
  'Game Name',
]

let chooseGame = []

const fromPlatform = reactive({
  list: [],
})

const selectedPlatformGameCode = reactive({
  list: [],
})

const configList = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  imageDialogVisible: false,
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  imageSelectionVisible: false,
  messageVisible: false,
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
  loginName: null,
  fromPlatform: null,
  fromGameCode: null,
  gameCode: null,
  siteId: null,
  requestBy: null,
  requestTime: null,
})
const form = reactive({
  id: null,
  siteId: null,
  siteName: null,
  loginName: null,
  fromPlatform: null,
  fromGameCode: null,
  gameCode: null,
})

const formRules = reactive({
  loginName: [required(t('message.validateLoginNameRequired'))],
  fromPlatform: [required(t('message.validateGameCodeRequired'))],
  fromGameCode: [required(t('message.validateGameCodeRequired'))],
  gameCode: [required(t('message.validateGameCodeRequired'))],
})

const sites = reactive({
  list: [],
})

function handleFromPlatformChange(val) {
  const finalList = [];
  configList.list.forEach(data => {
    if (data.platform === val) {
      finalList.push({ key: data.key, name: data.gameName, value: data.gameCode })
    }
  });
  request.fromGameCode = null;
  form.fromGameCode = null;
  selectedPlatformGameCode.list = finalList;
}

function resetQuery() {
  request.siteId = site.value ? site.value.id : sites.list[0].id;
  request.loginName = null
  request.fromPlatform = null;
  request.fromGameCode = null;
  request.gameCode = null;
}

const memberForm = reactive({
  loginName: null,
  siteId: null,
})

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

function changePage(page) {
  request.current = page
  loadGame()
}

async function loadConfigList() {
  const { data: ret } = await getConfigList(request.siteId)
  const finalList = [];
  const finalPlatformList = [];
  ret.forEach(data => {
    if (data.status === "OPEN") {
      const arr = data.code.split("_");
      if (arr.length > 1) {
        finalList.push({ key: data.id, platform: arr[0], gameCode: arr[1], gameName: data.gameName });
        finalPlatformList.push({ key: data.id, name: arr[0], value: arr[0] })
      } else {
        finalList.push({ key: data.id, platform: 'spribe', gameCode: arr[0], gameName: data.gameName });
        finalPlatformList.push({ key: data.id, name: 'spribe', value: 'spribe' })
      }
    }
  })
  configList.list = finalList;

  fromPlatform.list = finalPlatformList.reduce((platform, current) => {
    if (!platform.some(plat => plat.name === current.name)) {
      platform.push(current);
    }
    return platform;
  }, []);
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (gameForm.value) {
      gameForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addGame')
    form.id = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editGame')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(game) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in game) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = game[key]
    }
  })
}

function handleSelectionChange(val) {
  chooseGame = val
  if (chooseGame.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseGame.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadGame() {
  page.loading = true
  const { data: ret } = await getGames(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    console.log(sites.list);
    data.siteName = sites.list[0].siteName;
    data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
      ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
      : null
  });
  page.records = ret.records
  page.loading = false
}

function create() {
  gameForm.value.validate(async valid => {
    if (valid) {
      await createGame(form)
      uiControl.dialogVisible = false
      await loadGame()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  gameForm.value.validate(async valid => {
    if (valid) {
      await updateGame(form)
      uiControl.dialogVisible = false
      await loadGame()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeGame(game) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (game) {
      const data = [{ loginName: game.loginName, fromPlatform: game.fromPlatform, fromGameCode: game.fromGameCode }]
      await deleteGame(game.siteId, data)
    } else {
      const data = []
      chooseGame.forEach(d => data.push({ loginName: d.loginName, fromPlatform: d.fromPlatform, fromGameCode: d.fromGameCode }))
      await deleteGame(request.siteId, data)
    }
    await loadGame()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function submit() {
  memberForm.siteId = form.siteId;
  memberForm.loginName = form.loginName;

  const { data: ret } = await preCheckForCreate(memberForm)
  if (ret.loginName === form.loginName) {
    if (uiControl.dialogType === 'CREATE') {
      create()
    } else if (uiControl.dialogType === 'EDIT') {
      edit()
    }
  }
}

async function downloadTemplate() {
  const exportGameList = [EXPORT_GAME_LIST_HEADER]
  const maxLengthGameList = []
  const wsGameList = XLSX.utils.aoa_to_sheet(exportGameList)
  setWidth(exportGameList, maxLengthGameList)
  const wsGameListCols = maxLengthGameList.map(w => {
    return { width: w }
  })
  wsGameList['!cols'] = wsGameListCols

  const maxLengthMapping = []

  const { data: sitesMapping } = await getSiteExcelMapping()
  const exportMapping = [EXPORT_MAPPING_SITE_HEADER]
  pushRecordToData(sitesMapping, exportMapping)

  exportMapping.push([], [], EXPORT_MAPPING_FROM_PLATFORM_HEADER)
  const paltformGameList = [];
  configList.list.forEach(data => {
    const code = data.code;
    const gameCode = data.gameName;
    if (code.includes("aviator")) {
      paltformGameList.push({ platform: 'spribe', gamecode: 'aviator', gamename: 'Aviator' })
    } else {
      const parts = code.split("_");
      paltformGameList.push({ platform: parts[0], gamecode: parts[1], gamename: gameCode })
    }
  });
  pushRecordToData(paltformGameList, exportMapping)

  const wsMapping = XLSX.utils.aoa_to_sheet(exportMapping)
  setWidth(exportMapping, maxLengthMapping)
  const wsMappingCols = maxLengthMapping.map(w => {
    return { width: w }
  })
  wsMapping['!cols'] = wsMappingCols

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('TFG_Member_Game_Map')
  wb.Sheets.TFG_Member_Game_Map = wsGameList
  wb.SheetNames.push('Mapping')
  wb.Sheets.Mapping = wsMapping
  XLSX.writeFile(wb, 'TFG_Member_Game_Map.xlsx')
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
            header: IMPORT_GAME_LIST_JSON,
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
  importedPage.buttonLoading = true
  const records = [...importedPage.records];
  do {
    if (records.length > 10000) {
      await createBatchGame(records.slice(0, 10000));
      records.splice(0, 10000);
    } else {
      await createBatchGame(records);
      records.splice(0, records.length);
    }
  } while (records.length > 0)
  importedPage.buttonLoading = false
  ElMessage({ message: t('message.importSuccess'), type: 'success' })
  clearImport()
  loadGame()
}

function handleChangeSite(value) {
  form.siteId = value
}

async function requestExportExcel() {
  request.requestBy = store.state.user.name;
  request.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getExport(request);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = sites.list[0].id;
  }
  form.siteId = request.siteId
  await loadConfigList();
  await loadGame();
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
</style>
