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
        <el-select
          v-model="request.apkType"
          size="small"
          :placeholder="t('siteAppVersion.apkType')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.apkType"
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
          v-permission="['sys:site:appversion:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:site:appversion:del']"
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
        <el-form-item :label="t('siteAppVersion.os')" prop="os">
          <el-select
            v-model="form.os"
            size="small"
            :placeholder="t('siteAppVersion.os')"
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

        <el-form-item
          :label="t('siteAppVersion.apkType')"
          prop="apkType"
          v-if="form.os === 'ANDROID'"
        >
          <el-select
            v-model="form.apkType"
            size="small"
            :placeholder="t('siteAppVersion.apkType')"
            class="filter-item"
            style="width: 350px"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.apkType"
              :key="item.name"
              :label="item.display"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('siteAppVersion.version')" prop="version">
          <el-input v-model="form.version" style="width: 350px" />
        </el-form-item>

        <el-form-item :label="t('siteAppVersion.publishStatus')" prop="status">
          <el-radio-group v-model="form.publishStatus">
            <el-radio label="PENDING">{{ t('siteAppVersion.PENDING') }}</el-radio>
            <el-radio label="PUBLISHED">{{ t('siteAppVersion.PUBLISHED') }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="t('siteAppVersion.appUpload')" prop="filePath">
          <el-row :gutter="10">
            <el-col :span="9">
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
                :disabled="isFormDataFilled()"
                @click="$refs.inputApp.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
            <el-col :span="1">
              <el-button icon="el-icon-files" v-if="uploadedApp.filePath">
                {{ t('siteAppVersion.fileUploadedSuccessfully') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('siteAppVersion.logoUpload')" prop="logoFilePath">
          <el-row :gutter="10">
            <el-col :span="9">
              <!-- eslint-disable -->
              <input
                id="uploadLogo"
                type="file"
                ref="inputLogo"
                style="display: none"
                accept=".png"
                @change="attachLogo"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                :disabled="isFormDataFilled()"
                @click="$refs.inputLogo.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
            <el-col :span="1">
              <el-button icon="el-icon-files" v-if="uploadedApp.logoFilePath">
                {{ t('siteAppVersion.logoUploadedSuccessfully') }}
              </el-button>
            </el-col>
          </el-row>
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
      :resizable="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="site" :label="t('fields.site')" width="150" />
      <el-table-column prop="os" :label="t('siteAppVersion.os')" width="150">
        <template #default="scope">
          <span>{{ t(`siteAppVersion.${scope.row.os}`) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="appType" :label="t('siteAppVersion.appType')" width="150">
        <template #default="scope">
          <span>{{ t(`siteAppVersion.${scope.row.appType}`) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="apkType" :label="t('siteAppVersion.apkType')" width="150">
        <template #default="scope">
          <span>{{ t(`siteAppVersion.${scope.row.apkType}`) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="t('siteAppVersion.version')" width="150" />
      <el-table-column prop="publishStatus" :label="t('siteAppVersion.publishStatus')" width="150">
        <!-- <template #default="scope">
          <span>{{ t(`siteAppVersion.${scope.row.publishStatus}`) }}</span>
        </template> -->
        <template #default="scope">
          <el-switch
            v-model="scope.row.publishStatus"
            active-value="PUBLISHED"
            inactive-value="PENDING"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changesPublishtatus(scope.row.id, scope.row.publishStatus)"
          />
          <!-- <span style="margin-left: 8px">
            {{ t(`siteAppVersion.${scope.row.publishStatus}`) }}
          </span> -->
        </template>
      </el-table-column>
      <el-table-column prop="packageName" :label="t('siteAppVersion.packageName')" />
      <el-table-column prop="lastBuildTime" :label="t('siteAppVersion.lastBuildTime')" />
      <el-table-column type="title" :label="t('fields.action')" :flex-grow="1">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:site:appversion:edit']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:site:appversion:del']"
            @click="removeApp(scope.row)"
          />
          <el-button
              size="mini"
              type="success"
              v-if="scope.row.displayPath !== null"
              @click="downloadFile(scope.row.displayPath)"
            >
              {{ t('fields.download') }}
            </el-button>
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.displayPath !== null"
              @click="downloadQRCode(scope.row.displayPath)"
            >
              {{ t('fields.downloadQRCode') }}
            </el-button>
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
import { onMounted, reactive, ref, computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getSiteAppVersion,
  createSiteAppVersion,
  updateSiteAppVersion,
  deleteSiteAppVersion,
  uploadApp,
  uploadLogo,
  updateAppVersionState
} from '../../../api/site-app-version'
import { nextTick } from 'process'
import { ElMessage, ElMessageBox } from 'element-plus'
import { required } from '../../../utils/validate'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { getSiteListSimple } from '../../../api/site'
import QRCode from 'qrcode'
import { useSessionStorage } from "@vueuse/core";

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const appDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value

let chooseImage = []

const page = reactive({
  pages: 0,
  records: [],
})

const request = reactive({
  size: 30,
  current: 1,
  version: null,
  status: false,
  siteId: null,
  os: null,
  appType: null,
  apkType: null,
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
    // { name: 'SPORT', display: t('siteAppVersion.SPORT') },
    // { name: 'ESPORT', display: t('siteAppVersion.ESPORT') },
  ],
  apkType: [
    { name: 'NORMAL', display: t('siteAppVersion.NORMAL') },
    { name: 'NEW_KEY', display: t('siteAppVersion.NEW_KEY') },
  ],
})

const form = reactive({
  id: null,
  siteId: null,
  os: null,
  appType: null,
  apkType: null,
  version: null,
  filePath: null,
  logoFilePath: null,
  publishStatus: 'PENDING',
})

const appUpload = reactive({
  formData: null,
  extension: null,
})

const logoUpload = reactive({
  formData: null,
  extension: null,
})

const formRules = reactive({
  os: [required(t('message.validateOsRequired'))],
  appType: [required(t('message.validateAppTypeRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  filePath: [required(t('message.validateFileRequired'))],
})

const inputApp = ref(null)
const inputLogo = ref(null)

const appForm = ref(null)

const siteList = reactive({
  list: [],
})

const uploadedApp = reactive({
  filePath: null,
  logoFilePath: null,
  isAndroid: null,
  isIOS: null,
})

function resetQuery() {
  request.version = null
  request.os = null
  request.appType = null
  request.apkType = null
  request.siteId = store.state.user.siteId
  loadAppVersion()
}

function isFormDataFilled() {
  if (form.os && form.siteId && form.appType) {
    return false
  } else {
    return true
  }
}

function changePage(page) {
  request.current = page
  loadAppVersion()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (appForm.value) {
      appForm.value.resetFields()
      uploadedApp.filePath = null
      uploadedApp.logoFilePath = null
      form.filePath = null
      form.logoFilePath = null
      form.id = null
    }
    // Clear the input file value when opening the dialog
    if (inputApp.value) {
      inputApp.value.value = ''
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
  uploadedApp.filePath = app.filePath
  uploadedApp.logoFilePath = app.logoFilePath
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

function create() {
  appForm.value.validate(async valid => {
    if (valid) {
      if (form.os === 'IOS') {
        form.apkType = 'NORMAL'
      }
      var create = false
      if (appUpload.formData != null) {
        const getUploadApp = await uploadApp(
          appUpload.formData,
          appUpload.extension
        )
        if (getUploadApp.code === 0) {
          form.filePath = getUploadApp.data
          create = true
        }
      }
      if (logoUpload.formData != null) {
        const getUploadLogo = await uploadLogo(
          logoUpload.formData,
          logoUpload.extension
        )
        console.log('getUploadLogo', getUploadLogo)
        if (getUploadLogo.code === 0) {
          form.logoFilePath = getUploadLogo.data
          create = true
        }
        console.log('form.logoFilePath', form.logoFilePath)
      }

      if (create) {
        await createSiteAppVersion(form)
        uiControl.dialogVisible = false
        await loadAppVersion()
        appUpload.formData = null
        appUpload.extension = null
        ElMessage({ message: t('message.addSuccess'), type: 'success' })
      }
    }
  })
}

function edit() {
  appForm.value.validate(async valid => {
    if (valid) {
      if (form.os === 'IOS') {
        form.apkType = 'NORMAL'
      }
      var update = false
      if (appUpload.formData != null) {
        const getUploadApp = await uploadApp(
          appUpload.formData,
          appUpload.extension
        )
        if (getUploadApp.code === 0) {
          form.filePath = getUploadApp.data
          update = true
        }
      } else {
        update = true
      }

      if (update) {
        await updateSiteAppVersion(form)
        uiControl.dialogVisible = false
        await loadAppVersion()
        appUpload.formData = null
        appUpload.extension = null
        ElMessage({ message: t('message.editSuccess'), type: 'success' })
      }
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
    uploadedApp.filePath = URL.createObjectURL(files)
    form.filePath = URL.createObjectURL(files)
    appUpload.formData = formData
    appUpload.extension = fileExtension
  }
}

async function attachLogo(event) {
  const files = event.target.files[0]

  // Extract file extension
  const fileNameParts = files.name.split('.')
  const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase()

  const allowFileType = ['image/png']
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
    uploadedApp.logoFilePath = URL.createObjectURL(files)
    form.logoFilePath = URL.createObjectURL(files)
    logoUpload.formData = formData
    logoUpload.extension = fileExtension
  }
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  siteList.list = ret
}

async function loadAppVersion() {
  const { data: ret } = await getSiteAppVersion(request)

  ret.records.forEach(e => {
    e.displayPath = ""
    if (e.filePath) {
      e.displayPath = appDir + '/' + e.filePath
    }
  })
  page.pages = ret.pages
  page.records = ret.records
}

const downloadFile = (url) => {
  if (url) {
    window.open(url, '_blank');
  } else {
    console.error('Download URL is empty');
  }
};

const downloadQRCode = async (url) => {
  if (url) {
    try {
      // 生成二维码数据URL
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2
      })

      // 显示二维码弹窗
      ElMessageBox({
        title: t('fields.downloadQRCode'),
        message: h('img', { src: qrDataUrl, style: 'display: block; margin: 0 auto;' }),
        customClass: 'qrcode-dialog',
        showConfirmButton: false,
        closeOnClickModal: true
      })
    } catch (error) {
      console.error('生成二维码失败:', error)
      ElMessage.error(t('message.qrCodeGenerateFailed'))
    }
  } else {
    console.error('下载URL为空')
    ElMessage.error(t('message.downloadUrlEmpty'))
  }
}

async function changesPublishtatus(id, state) {
  await updateAppVersionState(id, state);
  ElMessage({ message: t('message.editSuccess'), type: "success" });
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  form.siteId = store.state.user.siteId
  form.os = 'ANDROID'
  form.appType = 'ALL_SITE'
  form.apkType = 'NORMAL'
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadAppVersion()
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

.qrcode-dialog {
  .el-message-box__content {
    padding: 20px;
  }
}
</style>
