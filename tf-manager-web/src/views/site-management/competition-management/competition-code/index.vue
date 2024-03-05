<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          clearable
          v-model="request.platformId"
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
          v-model="request.gameName"
          size="small"
          :placeholder="t('fields.gameName')"
          style="width: 150px; margin-left: 5px"
        >
          <el-option
            v-for="item in gameName.list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadCompetitionCode"
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
          v-permission="['sys:platform-competition-code:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:platform-competition-code:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:platform-competition-code:del']"
          @click="removeCompetitionCode()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
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
        ref="competitionCodeForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.platform')" prop="platformId">
          <el-select
            v-model="form.platformId"
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
        <el-form-item
          :label="t('fields.gameName')"
          prop="gameName"
        >
          <el-input v-model="form.gameName" style="width: 350px" />
        </el-form-item>
        <el-form-item
          :label="t('fields.code')"
          prop="code"
        >
          <el-input v-model="form.code" style="width: 350px" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submit">
            {{ t('fields.confirm') }}
          </el-button>
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
      <el-table-column prop="platformName" :label="t('fields.platformName')" />
      <el-table-column prop="gameName" :label="t('fields.gameName')" />
      <el-table-column prop="code" :label="t('fields.code')" />
      <el-table-column
        :label="t('fields.operate')"
        v-if="
          !hasRole(['SUB_TENANT']) &&
            (hasPermission(['sys:platform-competition-code:update']) ||
              hasPermission(['sys:platform-competition-code:del']))
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:platform-competition-code:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:platform-competition-code:del']"
            @click="removeCompetitionCode(scope.row)"
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
import { nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPlatformsBySite } from '../../../../api/platform'
import { getSiteListSimple } from '../../../../api/site'
import { hasRole, hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store'
import { useI18n } from 'vue-i18n'
import {
  getCompetitionsCode,
  createCompetitionCode,
  updateCompetitionCode,
  deleteCompetitionCode,
  getCompetitionGameList
} from '../../../../api/platform-competition'

const { t } = useI18n()
const store = useStore()
const site = ref(null)
const competitionCodeForm = ref(null)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  messageVisible: false,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  platformId: null,
  siteId: null,
  gameName: null,
})

const form = reactive({
  id: null,
  siteId: site.value,
  platformId: null,
  gameName: null,
  code: null,
})

const formRules = reactive({
  platformId: [required(t('message.validatePlatformRequired'))],
  gameName: [required(t('message.validateGameNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
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

const gameName = reactive({
  list: [],
})

let chooseCompetitionCode = []

const platformCode = ref('')

function resetQuery() {
  request.platformId = null
  request.siteId = site.value ? site.value.id : null
  request.gameName = null
}

function handleSelectionChange(val) {
  chooseCompetitionCode = val
  if (chooseCompetitionCode.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseCompetitionCode.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadCompetitionCode() {
  page.loading = true
  const { data: ret } = await getCompetitionsCode(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.siteName === data.siteName) !==
      undefined
        ? store.state.user.sites.find(e => e.siteName === data.siteName)
          .timeZone
        : null
  })
  page.records = ret.records
  loadGameList()
  page.loading = false
}

async function loadSearchPlatforms() {
  const { data: ret } = await getPlatformsBySite(request.siteId)
  platforms.list = ret.filter(s => s.gameType === 'SPORT' || s.gameType === 'ESPORT')
  dialogPlats.list = ret.filter(s => s.gameType === 'SPORT' || s.gameType === 'ESPORT')
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadGameList() {
  const { data: ret } = await getCompetitionGameList()
  gameName.list = ret
}

function changePage(page) {
  request.current = page
  loadCompetitionCode()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (competitionCodeForm.value) {
      competitionCodeForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addCompetitionCode')
    form.id = null
    form.platformName = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editCompetitionCode')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(competitionCode) {
  if (!competitionCode) {
    competitionCode = chooseCompetitionCode[0]
  }
  const selectedPlatform = platforms.list.find(
    item => item.id === competitionCode.platformId
  )
  platformCode.value = selectedPlatform.code

  showDialog('EDIT')

  nextTick(() => {
    for (const key in competitionCode) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = competitionCode[key]
      form.siteId = selectedPlatform.siteId
    }
    loadSearchPlatforms()
  })
}

function create() {
  competitionCodeForm.value.validate(async valid => {
    if (valid) {
      await createCompetitionCode(form)
      uiControl.dialogVisible = false
      await loadCompetitionCode()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  competitionCodeForm.value.validate(async valid => {
    if (valid) {
      await updateCompetitionCode(form)
      uiControl.dialogVisible = false
      await loadCompetitionCode()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeCompetitionCode(competition) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (competition) {
      await deleteCompetitionCode([competition.id])
    } else {
      await deleteCompetitionCode(chooseCompetitionCode.map(u => u.id))
    }
    await loadCompetitionCode()
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

function handleChangePlatform(value) {
  const selectedPlatform = dialogPlats.list.find(item => item.id === value)
  form.platformId = value
  platformCode.value = selectedPlatform.code
}

onMounted(async () => {
  await loadSites()
  site.value = sites.list.find(s => s.siteCode === 'LH1')
  request.siteId = site.value.id
  form.siteId = site.value.id
  await loadGameList()
  await loadSearchPlatforms()
  await loadCompetitionCode()
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
