<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          default-first-option
          @focus="loadSites"
          @change="selectRequestSite"
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
          v-model="request.platformId"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
          filterable
          @change="selectRequestPlatform"
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
          v-model="request.competitionType"
          size="small"
          :placeholder="t('fields.competitionType')"
          style="width: 200px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.competitionType"
            :key="item"
            :label="item.display"
            :value="item.name"
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
        <el-input
          v-model="request.competitionName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.competitionName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadCompetition"
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
          v-permission="['sys:platform-competition:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:platform-competition:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:platform-competition:del']"
          @click="removeCompetition()"
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
        ref="competitionForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            default-first-option
            @focus="loadSites"
            @change="selectFormSite"
            style="width: 350px"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
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
        <el-form-item :label="t('fields.competitionType')" prop="competitionType">
          <el-select
            v-model="form.competitionType"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in uiControl.competitionType"
              :key="item.name"
              :label="item.display"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.gameName')" prop="gameName">
          <el-select
            v-model="form.gameName"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in dialogGameName.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="t('fields.competitionName')"
          prop="competitionName"
        >
          <el-input v-model="form.competitionName" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.competitionTime')" prop="competitionTime">
          <el-date-picker
            v-model="form.competitionTime"
            format="DD/MM/YYYY HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="small"
            type="datetime"
            range-separator=":"
            :placeholder="t('fields.competitionTime')"
            style="width: 250px"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.teamOne')"
          prop="teamOneName"
        >
          <el-input v-model="form.teamOneName" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.teamOneIcon')" prop="teamOneLogo">
          <el-row :gutter="10">
            <el-col v-if="form.teamOneLogo" :span="18" style="width: 250px">
              <el-image
                v-if="form.teamOneLogo"
                :src="gameDir + form.teamOneLogo"
                fit="contain"
                class="preview"
                :preview-src-list="[gameDir + form.teamOneLogo]"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('TEAM_ONE')"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          :label="t('fields.teamTwo')"
          prop="teamTwoName"
        >
          <el-input v-model="form.teamTwoName" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.teamTwoIcon')" prop="teamTwoLogo">
          <el-row :gutter="10">
            <el-col v-if="form.teamTwoLogo" :span="18" style="width: 250px">
              <el-image
                v-if="form.teamTwoLogo"
                :src="gameDir + form.teamTwoLogo"
                fit="contain"
                class="preview"
                :preview-src-list="[gameDir + form.teamTwoLogo]"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('TEAM_TWO')"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
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
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group
            v-model="form.status"
            size="mini"
            style="width: 300px"
          >
            <el-radio-button label="OPEN">{{ t('common.status.OPEN') }}</el-radio-button>
            <el-radio-button label="CLOSE">{{ t('common.status.CLOSE') }}</el-radio-button>
            <el-radio-button label="TEST">{{ t('common.status.TEST') }}</el-radio-button>
          </el-radio-group>
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

    <el-dialog
      :title="uiControl.imageSelectionTitle"
      v-model="uiControl.imageSelectionVisible"
      append-to-body
      width="50%"
      :close-on-press-escape="false"
    >
      <div class="search">
        <el-input
          v-model="imageRequest.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.imageName')"
        />
        <el-select
          v-model="imageRequest.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          default-first-option
          @focus="loadSites"
          style="margin-left: 20px"
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
          ref="searchImage"
          @click="loadSiteImage"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetImageQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="grid-container">
        <div
          v-for="item in imageList.list"
          :key="item"
          class="grid-item"
          :class="item.id === selectedImage.id ? 'selected' : ''"
        >
          <el-image
            :src="gameDir + item.path"
            fit="contain"
            style="aspect-ratio: 1/1"
            @click="selectImage(item)"
          />
        </div>
      </div>
      <el-pagination
        class="pagination"
        @current-change="changeImagePage"
        layout="prev, pager, next"
        :page-size="imageRequest.size"
        :page-count="imageList.pages"
        :current-page="imageRequest.current"
      />
      <div class="image-info" v-if="selectedImage.id !== 0">
        <el-row>
          <el-col :span="4">
            <h3>{{ t('fields.selectedImage') }}</h3>
          </el-col>
          <el-col :span="20">
            <el-image
              :src="gameDir + selectedImage.path"
              fit="contain"
              class="smallPreview"
              :preview-src-list="[gameDir + selectedImage.path]"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageSite') }} :</el-col>
          <el-col :span="20">{{ selectedImage.siteName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageName') }} :</el-col>
          <el-col :span="20">{{ selectedImage.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageRemark') }} :</el-col>
          <el-col :span="20">{{ selectedImage.remark }}</el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.imageSelectionVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitImage">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </div>
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
      <el-table-column prop="competitionType" :label="t('fields.competitionType')" />
      <el-table-column prop="gameName" :label="t('fields.gameName')" />
      <el-table-column prop="competitionName" :label="t('fields.competitionName')" />
      <el-table-column prop="competitionTime" :label="t('fields.competitionTime')" />
      <el-table-column prop="teamOneName" :label="t('fields.teamOne')" />
      <el-table-column prop="teamTwoName" :label="t('fields.teamTwo')" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" />
      <el-table-column prop="status" :label="t('fields.status')" />
      <el-table-column
        :label="t('fields.operate')"
        v-if="
          !hasRole(['SUB_TENANT']) &&
            (hasPermission(['sys:platform-competition:update']) ||
              hasPermission(['sys:platform-competition:del']))
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:platform-competition:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:platform-competition:del']"
            @click="removeCompetition(scope.row)"
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
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { required } from '../../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPlatformsBySite } from '../../../../api/platform'
import { getSiteImage } from '../../../../api/site-image'
import { getSiteListSimple } from '../../../../api/site'
import { hasRole, hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store'
import { useI18n } from 'vue-i18n'
import {
  getCompetitions,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  getCompetitionGameList
} from '../../../../api/platform-competition'
import { TENANT } from "../../../../store/modules/user/action-types";

const { t } = useI18n()
const store = useStore()
const site = ref(null)
const competitionForm = ref(null)
const gameDir = process.env.VUE_APP_IMAGE + '/promo/'
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  imageSelectionType: '',
  imageSelectionTitle: '',
  imageSelectionVisible: false,
  messageVisible: false,
  competitionType: [
    { name: 'Football', display: t('fields.football') },
    { name: 'Basketball', display: t('fields.basketball') },
    { name: 'ESport', display: t('fields.esport') },
  ],
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
  competitionType: null,
  gameName: null,
  competitionName: null,
})

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: site.value ? site.value.id : null,
  category: 'PROMO',
  promoType: 'TEAM_ICON',
})

const form = reactive({
  id: null,
  siteId: null,
  platformId: null,
  gameName: null,
  competitionType: null,
  competitionName: null,
  competitionTime: null,
  teamOneName: null,
  teamOneLogo: null,
  teamTwoName: null,
  teamTwoLogo: null,
  sequence: null,
  status: null,
})

const imageList = reactive({
  dataList: [],
  pages: 0,
})

const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  platformId: [required(t('message.validatePlatformRequired'))],
  competitionType: [required(t('message.validateCompetitionTypeRequired'))],
  gameName: [required(t('message.validateGameNameRequired'))],
  competitionName: [required(t('message.validateCompetitionNameRequired'))],
  competitionTime: [required(t('message.validateCompetitionTimeRequired'))],
  teamOneName: [required(t('message.validateTeamOneRequired'))],
  teamOneLogo: [required(t('message.validateTeamOneIconRequired'))],
  teamTwoName: [required(t('message.validateTeamTwoRequired'))],
  teamTwoLogo: [required(t('message.validateTeamTwoIconRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  status: [required(t('message.validateStatusRequired'))],
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

const dialogGameName = reactive({
  list: [],
})

let chooseCompetition = []

const platformCode = ref('')

function resetQuery() {
  request.platformId = null
  request.competitionType = null
  request.siteId = site.value ? site.value.id : sites.list[0].id
  request.gameName = null
  request.competitionName = null
}

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = site.value ? site.value.id : sites.list[0].id
}

function handleSelectionChange(val) {
  chooseCompetition = val
  if (chooseCompetition.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseCompetition.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadCompetition() {
  page.loading = true
  const { data: ret } = await getCompetitions(request)
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
  page.loading = false
}

async function selectRequestSite() {
  await loadSearchPlatforms(request.siteId)
}

async function selectFormSite() {
  form.platformId = null
  await loadPlatformsForForm(form.siteId)
}

async function selectRequestPlatform() {
  loadGameList()
}

async function selectFormPlatform() {
  form.gameName = null
  const { data: ret } = await getCompetitionGameList(form.platformId)
  dialogGameName.list = ret
}

async function loadSearchPlatforms(id) {
  const { data: ret } = await getPlatformsBySite(id)
  platforms.list = ret.filter(s => s.gameType === 'SPORT' || s.gameType === 'ESPORT')
}

async function loadPlatformsForForm(id) {
  const { data: ret } = await getPlatformsBySite(id)
  dialogPlats.list = ret.filter(s => s.gameType === 'SPORT' || s.gameType === 'ESPORT')
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadGameList() {
  const { data: ret } = await getCompetitionGameList(request.platformId)
  gameName.list = ret
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function changePage(page) {
  request.current = page
  loadCompetition()
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (competitionForm.value) {
      competitionForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addCompetition')
    form.id = null
    form.status = 'OPEN'
    form.platformName = null
    form.siteName = null
    form.gameName = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editCompetition')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(competition) {
  if (!competition) {
    competition = chooseCompetition[0]
  }
  const selectedPlatform = platforms.list.find(
    item => item.id === competition.platformId
  )
  platformCode.value = selectedPlatform.code

  showDialog('EDIT')

  nextTick(() => {
    for (const key in competition) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = competition[key]
      form.siteId = selectedPlatform.siteId
    }
    loadPlatformsForForm(form.siteId)
    loadGameListForForm(form.platformId)
  })
}

async function loadGameListForForm(platformId) {
  const { data: ret } = await getCompetitionGameList(platformId)
  dialogGameName.list = ret
}

function create() {
  competitionForm.value.validate(async valid => {
    if (valid) {
      await createCompetition(form)
      uiControl.dialogVisible = false
      await loadCompetition()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  competitionForm.value.validate(async valid => {
    if (valid) {
      await updateCompetition(form)
      uiControl.dialogVisible = false
      await loadCompetition()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeCompetition(competition) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (competition) {
      await deleteCompetition([competition.id])
    } else {
      await deleteCompetition(chooseCompetition.map(u => u.id))
    }
    await loadCompetition()
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

function submitImage() {
  if (uiControl.imageSelectionType === 'TEAM_ONE') {
    form.teamOneLogo = selectedImage.path
  } else {
    form.teamTwoLogo = selectedImage.path
  }
  uiControl.imageSelectionVisible = false
}

function handleChangePlatform(value) {
  const selectedPlatform = dialogPlats.list.find(item => item.id === value)
  form.platformId = value
  platformCode.value = selectedPlatform.code
  selectFormPlatform()
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

async function browseImage(type) {
  loadSiteImage()
  switch (type) {
    case 'TEAM_ONE':
      uiControl.imageSelectionTitle = t('fields.teamOneIcon')
      break
    case 'TEAM_TWO':
      uiControl.imageSelectionTitle = t('fields.teamTwoIcon')
      break
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
}

onMounted(async () => {
  await loadSites()
  request.siteId = sites.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadSearchPlatforms(request.siteId)
  await loadGameList()
  await loadCompetition()
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
