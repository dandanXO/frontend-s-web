<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.version"
          size="small"
          style="width: 200px"
          :placeholder="t('siteAppVersion.version')"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.os"
          size="small"
          :placeholder="t('siteAppVersion.os')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.os"
            :key="item.name"
            :label="item.display"
            :value="item.name"
          />
        </el-select>
        <el-select
          v-model="request.appType"
          size="small"
          :placeholder="t('siteAppVersion.appType')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.appType"
            :key="item.name"
            :label="item.display"
            :value="item.name"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAppVersion"
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
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:appversion:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:appversion:del']"
          @click="removeApp()"
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
      width="600px"
      :close-on-press-escape="false"
    >
      <el-form
        ref="appForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <!-- <div id="preview" icon="el-icon-android" @focus="handleFilePreview">
          <el-button type="primary" class="common-btn" icon="el-icon-android">
            {{ $t('google.android_download') }}
          </el-button>
          123
        </div> -->
        <el-form-item :label="t('fields.image')" prop="path">
          <el-row :gutter="10">
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="inputApp"
                style="display: none"
                accept=".ipa, .apk, application/vnd.android.package-archive, application/octet-stream, application/x-ios-app"
                @change="attachApp"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputApp.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
            <el-col :span="1" />
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px"
            default-first-option
            @focus="loadSites"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.os')" prop="os">
          <el-select
            v-model="form.os"
            size="small"
            :placeholder="t('fields.os')"
            class="filter-item"
            style="width: 350px"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.os"
              :key="item.name"
              :label="item.display"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('siteAppVersion.appType')" prop="appType">
          <el-select
            v-model="form.appType"
            size="small"
            :placeholder="t('siteAppVersion.appType')"
            class="filter-item"
            style="width: 350px"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.appType"
              :key="item.name"
              :label="item.display"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('siteAppVersion.version')" prop="version">
          <el-input v-model="form.version" style="width: 350px" />
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
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column prop="site" :label="t('fields.site')" />
      <el-table-column prop="os" :label="t('fields.os')" />
      <el-table-column prop="appType" :label="t('fields.appType')" />
      <el-table-column prop="version" :label="t('fields.version')" />
      <el-table-column prop="status" :label="t('fields.status')" />
      <el-table-column type="title" :label="t('fields.action')">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:appversion:edit']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:appversion:del']"
            @click="removeApp(scope.row)"
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
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../store'
import {
  getSiteAppVersion,
  getSiteList,
  createSiteAppVersion,
  updateSiteAppVersion,
  deleteSiteAppVersion,
  uploadApp,
} from '../../../api/site-app-version'
import { nextTick } from 'process'
import { ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n()
const store = useStore()
const site = ref(null)

let chooseImage = []

const page = reactive({
  pages: 0,
  records: [],
})

const request = reactive({
  size: 30,
  current: 1,
  version: null,
  siteId: null,
  os: null,
  appType: null,
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  os: [
    { name: 'IOS', display: t('siteAppVersion.IOS') },
    { name: 'ANDROID', display: t('siteAppVersion.ANDROID') },
  ],
  appType: [
    { name: 'ALL_SITE', display: t('siteAppVersion.ALL_SITE') },
    { name: 'SPORT', display: t('siteAppVersion.SPORT') },
    { name: 'ESPORT', display: t('siteAppVersion.ESPORT') },
  ],
})

const form = reactive({
  id: null,
  siteId: null,
  os: null,
  appType: null,
  version: null,
  filePath: null,
})

const inputApp = ref(null)

const appForm = ref(null)

const formRules = reactive({
  // path: [required(t('message.validateImageRequired'))],
  // name: [required(t('message.validateImageNameRequired'))],
  // category: [required(t('message.validateCategoryRequired'))],
  // siteId: [required(t('message.validateSiteRequired'))],
  // platform: null,
  // posterType: null,
})

const siteList = reactive({
  list: [],
})

const uploadedApp = reactive({
  url: null,
  isAndroid: null,
  isIOS: null,
})

function resetQuery() {
  request.version = null
  request.os = null
  request.appType = null
  request.siteId = site.value ? site.value.id : null
  loadAppVersion()
}

function changePage(page) {
  request.current = page
  loadAppVersion()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (appForm.value) {
      appForm.value.resetFields()
      uploadedApp.url = null
      form.id = null
      // platform.list = []
    }
    uiControl.dialogTitle = t('siteAppVersion.appUpload')
  } else {
    uiControl.dialogTitle = t('siteAppVersion.editAppUpload')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function handleSelectionChange(val) {
  chooseImage = val
  if (chooseImage.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseImage.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function showEdit(app) {
  showDialog('EDIT')
  uploadedApp.url = app.filePath
  nextTick(() => {
    for (const key in app) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = app[key]
      }
    }
    siteList.list.forEach(element => {
      if (element.siteId === app.siteId) {
        form.siteId = element.id
      }
    })
  })
}

// function handleFilePreview() {}

function create() {
  appForm.value.validate(async valid => {
    if (valid) {
      await createSiteAppVersion(form)
      uiControl.dialogVisible = false
      await loadAppVersion()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  appForm.value.validate(async valid => {
    if (valid) {
      await updateSiteAppVersion(form)
      uiControl.dialogVisible = false
      await loadAppVersion()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else {
    edit()
  }
}

function removeApp(app) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (app) {
      await deleteSiteAppVersion([app.id])
    } else {
      await deleteSiteAppVersion(chooseImage.map(u => u.id))
    }
    await loadAppVersion()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function attachApp(event) {
  const data = await attachFile(event)
  if (data.code === 0) {
    form.filePath = data.data
    inputApp.value.value = ''
  } else {
    ElMessage({ message: t('message.failedToUploadApp'), type: 'error' })
  }
  console.log('data : ', data)
}

async function attachFile(event) {
  const files = event.target.files[0]

  // Extract file extension
  const fileNameParts = files.name.split('.')
  const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase()

  const allowFileType = [
    'application/vnd.android.package-archive',
    'application/octet-stream',
    'application/x-ios-app',
  ]
  const dir = 'temp'
  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', dir)
    formData.append('overwrite', false)
    formData.append('siteId', form.siteId)
    formData.append('os', form.os)
    formData.append('appType', form.appType)
    formData.append('extension', fileExtension)
    uploadedApp.url = URL.createObjectURL(files)
    return await uploadApp(formData, fileExtension)
  }
}

async function loadSites() {
  const { data: ret } = await getSiteList()
  siteList.list = ret
  console.log('ret : ', ret)
}

async function loadAppVersion() {
  const { data: ret } = await getSiteAppVersion(request)

  page.pages = ret.pages
  page.records = ret.records
  console.log('ret : ', ret)
  console.log('store.state.user : ', store.state.user)
}

onMounted(async () => {
  await loadAppVersion()
  await loadSites()
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

#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview .el-image {
  width: 60%;
  height: 60%;
}

td.el-table__cell img {
  width: 100px;
  height: 100px;
}
</style>
