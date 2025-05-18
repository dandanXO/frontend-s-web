<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px;"
          :placeholder="t('fields.title')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.announcementState"
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
          @change="changeSiteSearch"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-if="uiControl.showSiteTypeSearch === true"
          v-model="request.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 120px;margin-left:5px"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAnnouncement"
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
          v-permission="['sys:site:annou:add']"
          @click="showDialog('CREATE')"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          @click="showEdit()"
          v-permission="['sys:site:annou:update']"
          :disabled="uiControl.editBtn"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:site:annou:del']"
          @click="removeAnnouncement()"
          :disabled="uiControl.removeBtn"
          v-if="!hasRole(['SUB_TENANT'])"
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
    >
      <el-form
        ref="announcementForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @change="changeSite"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.siteType')" prop="siteType" v-if="uiControl.showSiteType === true">
          <el-select
            v-model="form.siteType"
            size="small"
            class="filter-item"
            :placeholder="t('fields.siteType')"
            style="width: 350px"
            @change="loadActiveAnnouncementType"
          >
            <el-option
              v-for="item in siteType.list"
              :key="item.value"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            v-model="form.type"
            :placeholder="t('fields.announcementType')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadActiveAnnouncementType"
          >
            <el-option
              v-for="item in announcementTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="uiControl.dialogType === 'CREATE'"
          :label="t('fields.state')"
          prop="status"
        >
          <el-radio v-model="form.status" label="true">active</el-radio>
          <el-radio v-model="form.status" label="false">disable</el-radio>
        </el-form-item>
        <el-form-item :label="t('fields.endDate')" prop="dueDate">
          <el-date-picker
            type="date"
            value-format="YYYY-MM-DD"
            v-model="form.dueDate"
            style="width: 350px;"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <!-- <el-form-item :label="t('fields.content')" prop="content">
          <el-input
            type="textarea"
            v-model="form.content"
            :rows="10"
            style="width: 350px;"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item> -->
        <el-form-item :label="t('fields.content')" prop="content">
          <!-- editor here -->
          <Editor v-model:value="form.content" @input="getInput" />
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
        <el-form-item :label="t('fields.attachment')" prop="attachment">
          <el-row :gutter="10">
            <el-col v-if="form.attachment" style="width: 250px">
              <el-image
                v-if="form.attachment"
                :src="announcementDir + form.attachment"
                fit="contain"
                class="preview"
                :preview-src-list="[announcementDir + form.attachment]"
              />
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="primary"
              v-permission="['sys:site:image:add']"
              @click="showImageDialog()"
            >
              {{ t('fields.upload') }}
            </el-button>
            <el-button
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="browseImage()"
            >
              {{ t('fields.browse') }}
            </el-button>
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
      @selection-change="handleSelectionChange"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="!hasRole(['SUB_TENANT'])"
      />
      <el-table-column prop="title" :label="t('fields.title')" width="200" />
      <el-table-column
        prop="announcementType"
        :label="t('fields.announcementType')"
        width="200"
      />
      <el-table-column
        prop="sequence"
        :label="t('fields.sequence')"
        width="200"
      />
      <el-table-column
        prop="status"
        :label="t('fields.state')"
        width="150"
        v-if="hasPermission(['sys:site:annou:update:state'])"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeAnnouncementState(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column prop="dueDate" :label="t('fields.endDate')" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="
          !hasRole(['SUB_TENANT']) &&
            (hasPermission(['sys:site:annou:update']) ||
              hasPermission(['sys:site:annou:del']))
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:site:annou:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:site:annou:del']"
            @click="removeAnnouncement(scope.row)"
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
  <el-dialog
    :title="uiControl.imageDialogTitle"
    v-model="uiControl.imageDialogVisible"
    append-to-body
    width="600px"
    :close-on-press-escape="false"
  >
    <el-form
      ref="imageFormRef"
      :model="imageForm"
      :rules="imageFormRules"
      :inline="true"
      size="small"
      label-width="180px"
    >
      <div id="preview">
        <el-image
          v-if="uploadedImage.url"
          :src="uploadedImage.url"
          :fit="contain"
          :preview-src-list="[uploadedImage.url]"
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
        <el-input v-model="imageForm.name" style="width: 350px" />
      </el-form-item>
      <el-form-item :label="t('fields.category')" prop="category">
        <span style="width: 350px">{{ t('fields.announcement') }}</span>
      </el-form-item>
      <el-form-item :label="t('fields.site')" prop="siteId">
        <el-select
          v-model="imageForm.siteId"
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
          v-model="imageForm.remark"
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
        <el-button type="primary" @click="submitImageUpload">
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
        ref="searchImage"
        @click="loadSiteImage()"
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
          :src="announcementDir + item.path"
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
            :src="announcementDir + selectedImage.path"
            fit="contain"
            class="smallPreview"
            :preview-src-list="[announcementDir + selectedImage.path]"
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
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../../utils/validate'
import Editor from '../../../../components/editor/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createAnnouncement,
  updateAnnouncement,
  getAnnouncement,
  updateAnnouncementState,
  deleteAnnouncement,
} from '../../../../api/announcement'
import { getActiveAnnouncementType } from '../../../../api/announcement-type'
import { hasRole, hasPermission } from '../../../../utils/util'
import { useI18n } from 'vue-i18n'
import { createSiteImage, getSiteImage } from '../../../../api/site-image'
import { uploadImage } from '../../../../api/image'
import { getSiteListSimple } from '../../../../api/site'
import { store } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { isVnm } from '@/utils/site'
import { useSessionStorage } from "@vueuse/core";

const { t } = useI18n()
const announcementForm = ref(null)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const inputImage = ref(null)
const imageFormRef = ref(null)
const announcementDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/announcement/'
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  imageDialogVisible: false,
  imageDialogTitle: '',
  editBtn: true,
  removeBtn: true,
  announcementState: [
    { key: 1, displayName: 'active', value: true },
    { key: 2, displayName: 'disable', value: false },
  ],
  imageSelectionTitle: '',
  imageSelectionVisible: false,
  showSiteType: false,
  showSiteTypeSearch: false,
})

const siteType = reactive({
  list: [
    { displayName: t('siteType.main'), value: 'main' },
    { displayName: t('siteType.slot'), value: 'slot' },
  ],
})

const siteList = reactive({
  list: [],
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

const uploadedImage = reactive({
  url: null,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  title: null,
  status: null,
  siteType: null,
  siteId: null,
})

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'ANNOUNCEMENT',
})

const form = reactive({
  id: null,
  title: null,
  type: null,
  status: 'true',
  dueDate: null,
  content: null,
  sequence: null,
  attachment: null,
  siteType: null,
  siteId: null,
})

const imageForm = reactive({
  id: null,
  name: null,
  path: null,
  displayPath: null,
  category: null,
  siteId: null,
  remark: null,
  imageDimension: null,
})

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  type: [required(t('message.validateAnnouncementTypeRequired'))],
  dueDate: [required(t('message.validateEndDateRequired'))],
  content: [required(t('message.validateContentRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
})

const imageFormRules = reactive({
  path: [required(t('message.validateImageRequired'))],
  name: [required(t('message.validateImageNameRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
})

let chooseAnnouncement = []
const announcementTypeList = ref([])

function disabledDate(time) {
  return time.getTime() <= Date.now()
}

function resetQuery() {
  request.title = null
  request.status = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id;
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
  request.siteType = "main"
}

async function changeSiteSearch() {
  request.siteType = 'main'
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
}

async function changeSite() {
  form.siteType = 'main'
  if (isVnm(form.siteId)) {
    uiControl.showSiteType = true;
  } else {
    uiControl.showSiteType = false;
  }
}

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = site.value ? site.value.id : null
}

function handleSelectionChange(val) {
  chooseAnnouncement = val
  if (chooseAnnouncement.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseAnnouncement.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadAnnouncement() {
  page.loading = true
  const { data: ret } = await getAnnouncement(request)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadActiveAnnouncementType() {
  announcementTypeList.value = null;
  if (form.siteId !== null) {
    if (isVnm(form.siteId)) {
      if (form.siteType !== null) {
        const { data: type } = await getActiveAnnouncementType(form.siteId, form.siteType)
        announcementTypeList.value = type
      }
    } else {
      const { data: type } = await getActiveAnnouncementType(form.siteId, 'main')
      announcementTypeList.value = type
    }
  }
}

function changePage(page) {
  request.current = page
  loadAnnouncement()
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (announcementForm.value) {
      announcementForm.value.resetFields()
      form.status = 'true'
    }
    uiControl.dialogTitle = t('fields.addAnnouncement')
    form.id = null;
    form.siteId = siteList.list[0].id;
    form.siteType = "main"
    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true;
    } else {
      uiControl.showSiteType = false;
    }
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editAnnouncement')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(announcement) {
  showDialog('EDIT')
  if (!announcement) {
    announcement = chooseAnnouncement[0]
  }
  nextTick(async () => {
    for (const key in announcement) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'dueDate') {
          form[key] = String(announcement[key]).slice(0, 10)
        } else {
          form[key] = announcement[key]
        }
      }
    }

    await loadActiveAnnouncementType();

    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true;
    } else {
      uiControl.showSiteType = false;
    }
  })
}
function getInput(value) {
  form.content = value
}
/**
 * 新增公告
 */
function create() {
  announcementForm.value.validate(async valid => {
    form.id = null
    if (valid) {
      await createAnnouncement(form)
      uiControl.dialogVisible = false
      await loadAnnouncement()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

/**
 * 编辑公告
 */
function edit() {
  announcementForm.value.validate(async valid => {
    if (valid) {
      await updateAnnouncement(form)
      uiControl.dialogVisible = false
      await loadAnnouncement()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function changeAnnouncementState(id, state) {
  await updateAnnouncementState(id, state)
}

async function removeAnnouncement(announcement) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (announcement) {
      await deleteAnnouncement([announcement.id])
    } else {
      await deleteAnnouncement(chooseAnnouncement.map(a => a.id))
    }
    await loadAnnouncement()
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

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function submitImage() {
  form.attachment = selectedImage.path
  uiControl.imageSelectionVisible = false
}

function showImageDialog() {
  if (imageFormRef.value) {
    imageFormRef.value.resetFields()
    uploadedImage.url = null
    imageForm.id = null
  }
  imageForm.category = 'ANNOUNCEMENT'
  uiControl.imageDialogTitle = t('fields.addImage')
  uiControl.imageDialogVisible = true
}

async function attachImage(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    imageForm.path = data.data
    inputImage.value.value = ''
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function attachPhoto(event) {
  const files = event.target.files[0]

  // record file dimension
  var fr = new FileReader()
  fr.onload = function() {
    var img = new Image()
    img.onload = function() {
      imageForm.imageDimension = img.width + ' * ' + img.height
    }
    img.src = fr.result
  }
  fr.readAsDataURL(files)

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

function submitImageUpload() {
  imageFormRef.value.validate(async valid => {
    if (valid) {
      await createSiteImage(imageForm)
      uiControl.imageDialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

async function browseImage() {
  loadSiteImage()
  uiControl.imageSelectionTitle = t('fields.attachment')
  uiControl.imageSelectionVisible = true
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    imageRequest.siteId = site.value.id
    request.siteId = site.value.id
  } else {
    imageRequest.siteId = siteList.list[0].id
    request.siteId = siteList.list[0].id
  }

  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
  request.siteType = "main";
  await loadAnnouncement()
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
