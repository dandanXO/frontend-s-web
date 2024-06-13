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
          v-model="request.type"
          size="small"
          :placeholder="t('fields.gameType')"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in type.list"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
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
          size="mini"
          type="primary"
          v-permission="['sys:game:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

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
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            v-model="form.type"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @change="handleChangeType"
          >
            <el-option
              v-for="item in type.list"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
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
        <el-form-item v-if="uiControl.gameNameVisible" :label="t('fields.gameName')" prop="gameName">
          <el-select
            v-model="form.gameCode"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in platformGame.list"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.label')" prop="gameLabel">
          <el-select
            v-model="form.gameLabel"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in gameLabel.list"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
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
      <el-table-column prop="siteName" :label="t('fields.site')" width="150" />
      <el-table-column prop="type" :label="t('fields.type')" width="120" />
      <el-table-column prop="platformName" :label="t('fields.platform')" width="150" />
      <el-table-column prop="gameName" :label="t('fields.gameName')" min-width="150" />
      <el-table-column prop="gameLabel" :label="t('fields.label')" min-width="100" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" min-width="100" />
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
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createTagGames,
  deleteTagGame,
  getTagGames,
  updateTagGame,
  getExportTagGame,
  getGamesList,
} from '../../../api/game'
import {
  getPlatformsBySite,
} from '../../../api/platform'
import { getSiteListSimple } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from 'moment'

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const gameForm = ref(null)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  imageSelectionVisible: false,
  messageVisible: false,
  gameNameVisible: false,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  platform: null,
  type: null,
})

const requestGame = reactive({
  siteId: null,
  platform: null,
})

const form = reactive({
  id: null,
  gameName: null,
  gameCode: null,
  type: null,
  platformId: null,
  siteId: null,
  gameLabel: null,
  sequence: null,
})

const formRules = reactive({
  type: [required(t('message.validateGameTypeRequired'))],
  platformName: [required(t('message.validatePlatformRequired'))],
  gameLabel: [required(t('message.validateLabelRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
})

const platformGame = reactive({
  list: [],
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

const type = reactive({
  list: [
    { key: 1, displayName: 'PLATFORM', value: 'platform' },
    { key: 2, displayName: 'GAME', value: 'game' },
  ],
})

const gameLabel = reactive({
  list: [
    { key: 1, displayName: 'NEW', value: 'NEW' },
    { key: 2, displayName: 'HOT', value: 'HOT' },
    { key: 3, displayName: 'RECOMMEND', value: 'RECOMMEND' },
    { key: 4, displayName: 'LIST', value: 'LIST' },
    { key: 5, displayName: 'JACKPOT', value: 'JACKPOT' },
  ],
})

let chooseGame = []

const platformCode = ref('')

function resetQuery() {
  request.siteId = 1;
  request.platform = null
  request.type = null
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
  const { data: ret } = await getTagGames(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
      ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
      : null
  });
  page.records = ret.records
  page.loading = false
}

async function loadGameList(siteId, platformId) {
  requestGame.siteId = siteId;
  requestGame.platform = platformId;
  const { data: ret } = await getGamesList(requestGame)
  platformGame.list = ret;
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
    form.platformName = null
    form.siteName = null
    form.gameLabel = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editGame')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(game) {
  if (!game) {
    game = chooseGame[0]
  }

  const selectedSite = sites.list.find(item => item.siteName === game.siteName)

  if (game.type === 'game') {
    uiControl.gameNameVisible = true;
    loadGameList(selectedSite.id, game.platformId)
  } else {
    uiControl.gameNameVisible = false;
  }

  showDialog('EDIT')

  nextTick(() => {
    for (const key in game) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = game[key]
      form.siteId = selectedSite.id
    }
    loadPlatformNames()
  })
}

function create() {
  gameForm.value.validate(async valid => {
    if (valid) {
      await createTagGames(form)
      uiControl.dialogVisible = false
      await loadGame()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  gameForm.value.validate(async valid => {
    if (valid) {
      await updateTagGame(form)
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
      await deleteTagGame([game.id])
    } else {
      await deleteTagGame(chooseGame.map(u => u.id))
    }
    await loadGame()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function submit() {
  if (form.type === 'game' && form.gameCode === null) {
    alert("Game is required!");
    return;
  }
  if (form.gameCode !== null && form.gameCode.length > 0) {
    const selectedGame = platformGame.list.find(game => { return game.code === form.gameCode })
    form.gameName = selectedGame.name
  }

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

function handleChangePlatform(value) {
  const selectedPlatform = dialogPlats.list.find(item => item.id === value)
  form.platformId = value
  platformCode.value = selectedPlatform.code
  form.gameCode = null
  loadGameList(form.siteId, form.platformId)
}

function handleChangeType(value) {
  if (value === "game") {
    uiControl.gameNameVisible = true;
  } else {
    form.gameCode = null
    form.gameName = null
    uiControl.gameNameVisible = false;
  }
}

function handleChangeSite(value) {
  form.siteId = value
  loadPlatformNames()
}

async function requestExportExcel() {
  request.requestBy = store.state.user.name;
  request.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getExportTagGame(request);
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
  await loadSearchPlatforms()
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
