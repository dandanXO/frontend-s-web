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
          @change="loadSearchPlatforms"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          filterable
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.gameType"
          size="small"
          :placeholder="t('fields.gameType')"
          style="width: 120px; margin-left: 5px"
          @focus="loadGameTypes"
        >
          <el-option
            v-for="item in gameTypes.list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.gameName')"
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
          v-permission="['sys:game:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:game:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:game:del']"
          @click="removeGame()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
        <el-button
          icon="el-icon-upload"
          size="mini"
          type="primary"
          v-permission="['sys:game:add']"
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
    </el-dialog>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="gameForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.gameName')" prop="name">
          <el-input v-model="form.name" style="width: 350px"/>
        </el-form-item>
        <el-form-item :label="t('fields.gameCode')" prop="code">
          <el-input v-model="form.code" style="width: 350px"/>
        </el-form-item>

        <el-form-item :label="t('fields.icon')" prop="icon">
          <el-row :gutter="10">
            <el-col :span="22">
              <el-input :readonly="true" v-model="form.icon"/>
            </el-col>
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="input"
                style="display: none"
                accept="image/*"
                @change="attachPhoto"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="validateClick($refs)"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
          <!-- <el-input v-model="form.icon" style="width: 350px;" /> -->
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
        <el-form-item :label="t('fields.platform')" prop="platformName">
          <el-select
            v-model="form.platformName"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @change="handleChangePlatform"
          >
            <el-option
              v-for="item in dialogPlats.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group
            v-model="form.status"
            size="mini"
            style="width: 300px"
          >
            <el-radio-button label="OPEN">Open</el-radio-button>
            <el-radio-button label="CLOSE">Close</el-radio-button>
            <el-radio-button label="TEST">Test</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.gameType')" prop="gameType">
          <el-select
            v-model="form.gameType"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="loadGameTypes"
          >
            <el-option
              v-for="item in gameTypes.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
<<<<<<< HEAD
        <el-form-item :label="t('fields.label')" prop="gameLabel">
          <el-select
            filterable
            clearable
            multiple
            v-model="selected.gameLabels"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            @change="handleChangeLabel()"
          >
            <el-option
              v-for="item in gameLabel.list"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
=======
>>>>>>> 60d4cc97321fec28cbc5932222e71555e67dd34b
        <el-form-item :label="t('fields.device')" prop="device">
          <el-radio-group v-model="form.device">
            <el-radio
              v-for="c in devices.list"
              :label="c.displayName"
              :key="c.key"
              v-model="form.status"
            >
              {{ c.value }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            type="number"
            v-model.number="form.sequence"
            :min="0"
            style="width: 350px"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
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
      <el-table-column prop="name" :label="t('fields.gameName')" min-width="150"/>
      <el-table-column prop="code" :label="t('fields.gameCode')" min-width="180"/>
      <el-table-column prop="platformName" :label="t('fields.platform')" width="150"/>
      <el-table-column prop="gameType" :label="t('fields.gameType')" width="120"/>
      <el-table-column prop="siteName" :label="t('fields.site')" width="150"/>
      <el-table-column prop="status" :label="t('fields.status')" width="150"/>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150"/>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150"/>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:game:update']) || hasPermission(['sys:game:del']) )"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:game:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:game:del']"
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
  getGameTypes,
  createBatchGame,
} from '../../../api/game'
import {
  getPlatformExcelMapping, getPlatformsBySite,
} from '../../../api/platform'
import { getSiteListSimple, getSiteExcelMapping } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { uploadImage } from '../../../api/image'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const gameForm = ref(null)

const EXPORT_GAME_LIST_HEADER = [
  'Game Name',
  'Game Code',
  'Icon',
  'Platform ID (Refer Mapping Sheet)',
  'Site ID (Refer Mapping Sheet)',
  'Status',
  'Game Type',
  'Device',
  'Sequence',
]

const IMPORT_GAME_LIST_JSON = [
  'name',
  'code',
  'icon',
  'platformId',
  'siteId',
  'status',
  'gameType',
  'device',
  'sequence',
]

const EXPORT_MAPPING_PLATFORM_HEADER = [
  'Platform ID',
  'Platform Code',
  'Game Type',
]

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
  gameType: null
})

const form = reactive({
  id: null,
  name: null,
  code: null,
  status: null,
  gameType: null,
  icon: null,
  platformId: null,
  platformName: null,
  siteName: null,
  siteId: null,
  gameLabel: null,
  device: 'WEB',
  sequence: null,
})

const formRules = reactive({
  name: [required(t('message.validateGameNameRequired'))],
  code: [required(t('message.validateGameCodeRequired'))],
  status: [required(t('message.validateStatusRequired'))],
  gameType: [required(t('message.validateGameTypeRequired'))],
  icon: [required(t('message.validateIconRequired'))],
  platformName: [required(t('message.validatePlatformRequired'))],
  device: [required(t('message.validateDeviceRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
})

const platforms = reactive({
  list: [],
})

const dialogPlats = reactive({
  list: [],
})

const sites = reactive({
  list: [],
})

const gameTypes = reactive({
  list: [],
})

const devices = reactive({
  list: [
    { key: 1, displayName: 'ALL', value: 'ALL' },
    { key: 2, displayName: 'WEB', value: 'WEB' },
    { key: 3, displayName: 'MOBILE', value: 'MOBILE' },
    { key: 4, displayName: 'ANDROID', value: 'ANDROID' },
  ],
})

const gameLabel = reactive({
  list: [
    { key: 1, displayName: 'NEW', value: 'NEW' },
    { key: 2, displayName: 'HOT', value: 'HOT' },
  ],
})

let chooseGame = []

const platformCode = ref('')
const selected = reactive({ gameLabels: [] });

function resetQuery() {
  request.name = null
  request.platform = null
  request.siteId = site.value ? site.value.id : null;
  request.gameType = null
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
  page.records = ret.records
  page.loading = false
}
async function loadSearchPlatforms() {
  const { data: ret } = await getPlatformsBySite(request.siteId)
  platforms.list = ret
}
async function loadPlatformNames() {
  const { data: ret } = await getPlatformsBySite(form.siteId)
  dialogPlats.list = ret
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadGameTypes() {
  const { data: ret } = await getGameTypes()
  gameTypes.list = ret
}

function changePage(page) {
  request.current = page
  loadGame()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (gameForm.value) {
      gameForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addGame')
    form.id = null
    form.status = 'OPEN'
    form.platformName = null
    form.siteName = null
    selected.gameLabels = []
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editGame')
    selected.gameLabels = []
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(game) {
  if (!game) {
    game = chooseGame[0]
  }
  const selectedPlatform = platforms.list.find(item => item.id === game.platformId)
  platformCode.value = selectedPlatform.code

  showDialog('EDIT')

  nextTick(() => {
    for (const key in game) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = game[key]
      form.siteId = selectedPlatform.siteId
    }
    if (form.gameLabel !== null) {
      const arr = form.gameLabel.split(",")
      arr.forEach(element => {
        selected.gameLabels.push(element);
      })
    }
    loadPlatformNames()
  })
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
      await deleteGame([game.id])
    } else {
      await deleteGame(chooseGame.map(u => u.id))
    }
    await loadGame()
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

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
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

  const { data: platformsMapping } = await getPlatformExcelMapping()
  const { data: sitesMapping } = await getSiteExcelMapping()
  const exportMapping = [EXPORT_MAPPING_PLATFORM_HEADER]
  const maxLengthMapping = []
  pushRecordToData(platformsMapping, exportMapping)
  exportMapping.push([], [], EXPORT_MAPPING_SITE_HEADER)
  pushRecordToData(sitesMapping, exportMapping)
  const wsMapping = XLSX.utils.aoa_to_sheet(exportMapping)
  setWidth(exportMapping, maxLengthMapping)
  const wsMappingCols = maxLengthMapping.map(w => {
    return { width: w }
  })
  wsMapping['!cols'] = wsMappingCols

  const wb = XLSX.utils.book_new()
  wb.SheetNames.push('Game_List')
  wb.Sheets.Game_List = wsGameList
  wb.SheetNames.push('Mapping')
  wb.Sheets.Mapping = wsMapping
  XLSX.writeFile(wb, 'game_list.xlsx')
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

function handleChangePlatform(value) {
  const selectedPlatform = dialogPlats.list.find(item => item.id === value)
  form.platformId = value
  platformCode.value = selectedPlatform.code
}

function handleChangeSite(value) {
  form.siteId = value
  loadPlatformNames()
}

function validateClick(ref) {
  const fieldRequired = ['platformName', 'gameType']
  Promise.all(
    fieldRequired.map(field => {
      return new Promise((resolve, reject) => {
        gameForm.value.validateField(field, async valid => {
          resolve(valid)
        })
      })
    })
  ).then(valids => {
    const valid = valids.every(validMsg => {
      return validMsg === ''
    })
    if (valid) {
      ref.input.click()
    }
  })
}

function handleChangeLabel() {
  form.gameLabel = selected.gameLabels.join(",");
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']

  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', 'game/' + form.siteId + '/' + platformCode.value.toLowerCase());
    formData.append('overwrite', false)
    const data = await uploadImage(formData)
    if (data.code === 0) {
      const path = data.data;
      form.icon = path.substr(0, path.indexOf("."));
    } else {
      ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
    }
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
  await loadSearchPlatforms()
  await loadGameTypes()
  await loadGame();
  await loadPlatformNames()
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
