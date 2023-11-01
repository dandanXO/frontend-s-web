<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.imageName')"
        />
        <el-select
          v-model="request.category"
          size="small"
          :placeholder="t('fields.category')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.category"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

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
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSiteImage"
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
          v-permission="['sys:siteimage:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:siteimage:del']"
          @click="removeImage()"
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
    >
      <el-form
        ref="imageForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <div id="preview">
          <el-image
            v-if="uploadedImage.url"
            :src="uploadedImage.url"
            :fit="contain"
          />
        </div>
        <el-form-item :label="t('fields.image')" prop="path">
          <el-row :gutter="10">
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="inputImage"
                style="display: none"
                accept="image/*"
                @change="attachImage"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputImage.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
            <el-col :span="1" />
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.imageName')" prop="name">
          <el-input v-model="form.name" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.category')" prop="category">
          <el-select
            v-model="form.category"
            size="small"
            :placeholder="t('fields.category')"
            class="filter-item"
            style="width: 350px"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.category"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            style="width: 350px"
          />
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
      <el-table-column prop="displayPath" :label="t('fields.image')">
        <template #default="scope">
          <el-image
            :src="scope.row.displayPath"
            :preview-src-list="[scope.row.displayPath]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="t('fields.imageName')" />
      <el-table-column prop="category" :label="t('fields.category')" />
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" />
      <el-table-column
        type="title"
        :label="t('fields.action')"
        v-if="
          hasPermission(['sys:siteimage:update']) ||
            hasPermission(['sys:siteimage:del'])
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:siteimage:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:siteimage:del']"
            @click="removeImage(scope.row)"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  getSiteImage,
  createSiteImage,
  updateSiteImage,
  deleteSiteImage,
} from '../../../api/site-image'
import { uploadImage } from '../../../api/image'
import { getSiteListSimple } from '../../../api/site'
import { required } from '../../../utils/validate'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const inputImage = ref(null)
const imageForm = ref(null)
const siteList = reactive({
  list: [],
})

const uploadedImage = reactive({
  url: null,
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  category: ['PROMO', 'GAME', 'PAYMENT'],
})

let chooseImage = []

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  siteId: null,
  category: null,
})

const form = reactive({
  id: null,
  name: null,
  path: null,
  displayPath: null,
  category: null,
  siteId: null,
  remark: null,
})

const page = reactive({
  pages: 0,
  records: [],
})

const formRules = reactive({
  path: [required(t('message.validateImageRequired'))],
  name: [required(t('message.validateImageNameRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
})

function resetQuery() {
  request.name = null
  request.siteId = site.value ? site.value.id : null
}

function changePage(page) {
  request.current = page
  loadSiteImage()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (imageForm.value) {
      imageForm.value.resetFields()
      uploadedImage.url = null
      form.id = null
    }
    uiControl.dialogTitle = t('fields.addImage')
  } else {
    uiControl.dialogTitle = t('fields.editImage')
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

function showEdit(image) {
  showDialog('EDIT')
  uploadedImage.url = image.displayPath
  nextTick(() => {
    for (const key in image) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = image[key]
      }
    }
    siteList.list.forEach(element => {
      if (element.siteName === image.siteName) {
        form.siteId = element.id
      }
    })
    form.path = image.path.substring(image.path.lastIndexOf('/') + 1)
  })
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  const dir = 'temp'
  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', dir)
    formData.append('overwrite', false)
    uploadedImage.url = URL.createObjectURL(files)
    return await uploadImage(formData)
  }
}

async function attachImage(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    form.path = data.data
    inputImage.value.value = ''
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function loadSiteImage() {
  const { data: ret } = await getSiteImage(request)
  ret.records.forEach(e => (e.displayPath = e.path))
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.siteName === data.siteName) !==
      undefined
        ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
        : null
  })
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function removeImage(image) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (image) {
      await deleteSiteImage([image.id])
    } else {
      await deleteSiteImage(chooseImage.map(u => u.id))
    }
    await loadSiteImage()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function create() {
  imageForm.value.validate(async valid => {
    if (valid) {
      await createSiteImage(form)
      uiControl.dialogVisible = false
      await loadSiteImage()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  imageForm.value.validate(async valid => {
    if (valid) {
      await updateSiteImage(form)
      uiControl.dialogVisible = false
      await loadSiteImage()
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

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadSiteImage()
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
