<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.title')"
        />
        <el-select
          clearable
          v-model="request.state"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.bannerState"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
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
          @click="loadHomebanner"
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
          v-permission="['sys:banner:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:banner:del']"
          @click="removeBanner()"
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
        ref="bannerForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input
            :disabled="uiControl.dialogType !== 'CREATE'"
            v-model="form.title"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item :label="t('fields.desktopImage')" prop="desktopImageUrl">
          <el-row :gutter="10">
            <el-col :span="22">
              <el-input :readonly="true" v-model="form.desktopImageUrl" />
            </el-col>
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadDesktopFile"
                type="file"
                ref="inputDesktop"
                style="display: none"
                accept="image/*"
                @change="attachDesktopImg"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputDesktop.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.mobileImage')" prop="mobileImageUrl">
          <el-row :gutter="10">
            <el-col :span="22">
              <el-input :readonly="true" v-model="form.mobileImageUrl" />
            </el-col>
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadMobileFile"
                type="file"
                ref="inputMobile"
                style="display: none"
                accept="image/*"
                @change="attachMobileImg"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputMobile.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.redirect')" prop="redirectUrl">
          <el-input v-model="form.redirectUrl" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            v-model="form.sequence"
            :min="1"
            controls-position="right"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item :label="t('fields.category')" prop="category">
          <el-select
            v-model="form.category"
            size="small"
            :placeholder="t('fields.category')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.category"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
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
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
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
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column prop="category" :label="t('fields.category')" />
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="state" :label="t('fields.state')">
        <template #default="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeBannerState(scope.row.id, scope.row.state)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column type="title" :label="t('fields.action')" v-if="hasPermission(['sys:banner:update'])|| hasPermission(['sys:banner:del'])">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:banner:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:banner:del']"
            @click="removeBanner(scope.row)"
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
  createHomeBanner,
  deleteHomeBanner,
  getHomeBannerList,
  updateBannerState,
  updateHomeBanner,
} from '../../../api/homeBanner'
import { uploadImage } from '../../../api/image'
import { getSiteListSimple } from '../../../api/site'
import { required } from '../../../utils/validate'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const inputDesktop = ref(null)
const inputMobile = ref(null)
const bannerForm = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  bannerState: [
    { key: 1, displayName: 'Open', value: true },
    { key: 2, displayName: 'Close', value: false },
  ],
  category: [
    { key: 1, displayName: 'HOME', value: 'HOME' },
    { key: 2, displayName: 'LIVE', value: 'LIVE' },
    { key: 3, displayName: 'SLOT', value: 'SLOT' },
    { key: 4, displayName: 'FISH', value: 'FISH' },
    { key: 5, displayName: 'POKER', value: 'POKER' },
    { key: 6, displayName: 'PROMO', value: 'PROMO' },
    { key: 7, displayName: 'HOMEPROMO', value: 'HOMEPROMO' },
    { key: 8, displayName: 'HOMEPOP', value: 'HOMEPOP' },
    { key: 9, displayName: 'CENTERPROMO', value: 'CENTERPROMO' }
  ]
})

let chooseBanner = []

const request = reactive({
  size: 30,
  current: 1,
  title: null,
  state: null,
  siteId: null,
})

const form = reactive({
  id: null,
  title: null,
  desktopImageUrl: null,
  mobileImageUrl: null,
  redirectUrl: null,
  sequence: null,
  category: null,
  siteId: null,
  remark: null,
  state: true,
})

const page = reactive({
  pages: 0,
  records: [],
})

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  desktopImageUrl: [required(t('message.validateDesktopImageRequired'))],
  mobileImageUrl: [required(t('message.validateMobileImageRequired'))],
  redirectUrl: [required(t('message.validateRedirectRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
})

function resetQuery() {
  request.title = null
  request.state = null
  request.siteId = site.value ? site.value.id : null;
}

function changePage(page) {
  request.current = page
  loadHomebanner()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bannerForm.value) {
      bannerForm.value.resetFields()
      form.id = null
    }
    uiControl.dialogTitle = t('fields.addBanner')
  } else {
    uiControl.dialogTitle = t('fields.editBanner')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function handleChange() {}

function handleSelectionChange(val) {
  chooseBanner = val
  if (chooseBanner.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseBanner.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function showEdit(banner) {
  showDialog('EDIT')
  if (!banner) {
    banner = chooseBanner[0]
  }
  nextTick(() => {
    for (const key in banner) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = banner[key]
      }
    }
    siteList.list.forEach(element => {
      if (element.siteName === banner.siteName) {
        form.siteId = element.id
      }
    })
  })
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  const dir = 'promo'
  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', dir)
    formData.append('overwrite', false)
    return await uploadImage(formData)
  }
}

async function attachDesktopImg(event) {
  const data = await attachPhoto(event);
  if (data.code === 0) {
    form.desktopImageUrl = data.data
    inputDesktop.value.value = ""
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function attachMobileImg(event) {
  const data = await attachPhoto(event);
  if (data.code === 0) {
    form.mobileImageUrl = data.data
    inputMobile.value.value = ""
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function loadHomebanner() {
  const { data: ret } = await getHomeBannerList(request)
  page.pages = ret.pages
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function removeBanner(banner) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (banner) {
      await deleteHomeBanner([banner.id])
    } else {
      await deleteHomeBanner(chooseBanner.map(u => u.id))
    }
    await loadHomebanner()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function changeBannerState(id, state) {
  await updateBannerState(id, state)
}

function create() {
  bannerForm.value.validate(async valid => {
    if (valid) {
      await createHomeBanner(form)
      uiControl.dialogVisible = false
      await loadHomebanner()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  bannerForm.value.validate(async valid => {
    if (valid) {
      await updateHomeBanner(form)
      uiControl.dialogVisible = false
      await loadHomebanner()
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

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadHomebanner();
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
