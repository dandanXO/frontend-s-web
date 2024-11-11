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
          v-permission="['sys:affannou:add']"
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
          v-permission="['sys:affannou:update']"
          :disabled="uiControl.editBtn"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:affannou:del']"
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
        <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            v-model="form.type"
            :placeholder="t('fields.announcementType')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadAffActiveAnnouncementType"
          >
            <el-option
              v-for="item in announcementTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.sendType')" prop="sendType">
          <el-radio v-model="form.sendType" label="ALL"> {{ t('fields.all') }}</el-radio>
          <el-radio v-model="form.sendType" label="SPECIFIC"> {{ t('fields.specificAffiliate') }}</el-radio>
        </el-form-item>
        <el-form-item :label="t('fields.recipient')" v-if="form.sendType === 'SPECIFIC'">
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-autocomplete
            v-model="inputValue"
            :fetch-suggestions="debouncedFetchSuggestions"
            :trigger-on-focus="false"
            class="inline-input"
            :placeholder="t('fields.addRecipient')"
            style="outline: none; border: none"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.hasPopUp')"
          prop="hasPopUp"
        >
          <el-radio v-model="form.hasPopUp" :label="true">{{ t('fields.yes') }}</el-radio>
          <el-radio v-model="form.hasPopUp" :label="false">{{ t('fields.no') }}</el-radio>
        </el-form-item>
        <el-form-item :label="t('fields.image')" prop="popUpImage" v-if="form.hasPopUp">
          <el-row :gutter="10">
            <el-col v-if="form.popUpImage" style="width: 250px">
              <el-image
                v-if="form.popUpImage"
                :src="announcementDir + form.popUpImage"
                fit="contain"
                class="preview"
                :preview-src-list="[announcementDir + form.popUpImage]"
              />
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="primary"
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
        <el-form-item
          v-if="uiControl.dialogType === 'CREATE'"
          :label="t('fields.state')"
          prop="status"
        >
          <el-radio v-model="form.status" label="true">active</el-radio>
          <el-radio v-model="form.status" label="false">disable</el-radio>
        </el-form-item>
        <el-form-item :label="t('fields.content')" prop="content">
          <el-input
            type="textarea"
            v-model="form.content"
            :rows="10"
            style="width: 350px;"
            maxlength="5000"
            show-word-limit
          />
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
        prop="affiliateAnnouncementType"
        :label="t('fields.announcementType')"
        width="200"
      />
      <el-table-column prop="site" :label="t('fields.site')" width="200" />
      <el-table-column
        prop="sequence"
        :label="t('fields.sequence')"
        width="200"
      />
      <el-table-column
        prop="status"
        :label="t('fields.state')"
        width="150"
        v-if="hasPermission(['sys:affannou:update:state'])"
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
            (hasPermission(['sys:affannou:update']) ||
              hasPermission(['sys:affannou:del']))
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:affannou:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:affannou:del']"
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
        <el-button @click="uiControl.imageDialogVisible = false">
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
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { required } from '../../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  updateAffAnnouncementState,
  updateAffAnnouncement,
  getAffAnnouncement,
  createAffAnnouncement,
  deleteAffAnnouncement,
  getAffiliateLoginNameList
} from '../../../../api/affiliate-announcement'
import { getSiteListSimple } from '../../../../api/site'
import { getActiveAffAnnouncementType } from '../../../../api/affiliate-announcement-type'
import { hasRole, hasPermission } from '../../../../utils/util'
import { useI18n } from 'vue-i18n'
import { store } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { debounce } from "lodash";
import { createSiteImage, getSiteImage } from '../../../../api/site-image'
import { uploadImage } from '../../../../api/image'
import { useSessionStorage } from "@vueuse/core";

const { t } = useI18n()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const announcementForm = ref(null)
const siteList = reactive({
  list: [],
})
const announcementDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/announcement/'
const inputImage = ref(null)
const imageFormRef = ref(null)
const uploadedImage = reactive({
  url: null,
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

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  announcementState: [
    { key: 1, displayName: 'active', value: true },
    { key: 2, displayName: 'disable', value: false },
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
  title: null,
  status: null,
  siteId: null
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
  siteId: null,
  type: null,
  status: 'true',
  content: null,
  sequence: null,
  sendType: "ALL",
  hasPopUp: true,
  popUpImage: null,
})

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  type: [required(t('message.validateAnnouncementTypeRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  content: [required(t('message.validateContentRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  sendType: [required(t('message.validateSendTypeRequired'))],
  hasPopUp: [required(t('message.validateHasPopUpRequired'))],
})

const imageFormRules = reactive({
  path: [required(t('message.validateImageRequired'))],
  name: [required(t('message.validateImageNameRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
})

let chooseAnnouncement = []
const list = reactive({
  members: [],
})
const selectionList = reactive({
  members: [],
})
const announcementTypeList = ref([])
const inputValue = ref('')
const dynamicTags = ref([])

const handleClose = tag => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  const selectionArr = [...selectionList.members]
  selectionArr.forEach(element => {
    if (element.value === tag) {
      list.members.splice(1, 0, element)
      list.members.sort(function (a, b) {
        return a.id - b.id
      })
      selectionList.members.splice(selectionList.members.indexOf(element), 1)
    }
  })
  inputValue.value = ''
}

const querySearch = async (queryString, callback) => {
  if (!queryString) {
    callback();
    return;
  } else if (queryString.length < 3) {
    callback();
    return;
  }

  try {
    const { data: ret } = await getAffiliateLoginNameList(request.siteId, queryString);

    const results = ret.map(item => ({
      value: item.value,
      id: item.id
    }));
    callback(results);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    callback();
  }
}

const debouncedFetchSuggestions = debounce((queryString, callback) => {
  if (!request.siteId) {
    ElMessage({ message: t('message.validateSiteRequired'), type: 'error' })
    return;
  }
  querySearch(queryString, callback);
}, 1500); // Adjust debounce time as needed

const handleSelect = item => {
  if (item) {
    if (dynamicTags.value.indexOf(item.value) === -1) {
      dynamicTags.value.push(item.value)
      const removed = list.members.splice(list.members.indexOf(item), 1)
      const removedArr = [...removed]
      selectionList.members.push(removedArr[0])
    }
  }
  inputValue.value = ''
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

function resetImageQuery() {
  imageRequest.name = null
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function submitImage() {
  form.popUpImage = selectedImage.path
  uiControl.imageSelectionVisible = false
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
  uiControl.imageSelectionTitle = t('fields.image')
  uiControl.imageSelectionVisible = true
}

function resetQuery() {
  request.title = null
  request.status = null
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
  const { data: ret } = await getAffAnnouncement(request)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadAffActiveAnnouncementType() {
  const { data: type } = await getActiveAffAnnouncementType(form.siteId)
  announcementTypeList.value = type
}

function changePage(page) {
  request.current = page
  loadAnnouncement()
}

function showDialog(type) {
  dynamicTags.value = []
  if (type === 'CREATE') {
    if (announcementForm.value) {
      announcementForm.value.resetFields()
      form.status = 'true'
    }
    form.sequence = page.records.length + 1
    uiControl.dialogTitle = t('fields.addAffiliateAnnouncement')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editAffiliateAnnouncement')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(announcement) {
  showDialog('EDIT')
  if (!announcement) {
    announcement = chooseAnnouncement[0]
  }
  nextTick(() => {
    for (const key in announcement) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'dueDate') {
          form[key] = String(announcement[key]).slice(0, 10)
        } else {
          form[key] = announcement[key]
        }
      }
    }
    if (announcement.recipients.length !== 0) {
      dynamicTags.value = announcement.recipients
    }
  })
}

/**
 * 新增公告
 */
function create() {
  announcementForm.value.validate(async valid => {
    form.id = null
    if (valid) {
      if (form.sendType === 'SPECIFIC') {
        form.recipients = dynamicTags.value;
        if (inputValue.value) {
          const members = inputValue.value.split(",");
          form.recipients.push(...members);
          inputValue.value = '';
        }
        if (form.recipients.length === 0) {
          ElMessage({ message: t('message.validateRecipientRequired'), type: 'error' })
          return
        }
      }
      await createAffAnnouncement(form)
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
      if (form.sendType === 'SPECIFIC') {
        form.recipients = dynamicTags.value;
        if (inputValue.value) {
          const members = inputValue.value.split(",");
          form.recipients.push(...members);
          inputValue.value = '';
        }
        if (form.recipients.length === 0) {
          ElMessage({ message: t('message.validateRecipientRequired'), type: 'error' })
          return
        }
      }
      await updateAffAnnouncement(form)
      uiControl.dialogVisible = false
      await loadAnnouncement()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function changeAnnouncementState(id, state) {
  await updateAffAnnouncementState(id, state)
}

async function removeAnnouncement(announcement) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (announcement) {
      await deleteAffAnnouncement([announcement.id])
    } else {
      await deleteAffAnnouncement(chooseAnnouncement.map(a => a.id))
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

function changeSite() {
  loadAffActiveAnnouncementType()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id;
    form.siteId = site.value.id;
    imageRequest.siteId = site.value.id;
    imageForm.siteId = site.value.id;
  } else {
    request.siteId = siteList.list[0].id;
    form.siteId = siteList.list[0].id;
    imageRequest.siteId = siteList.list[0].id;
    imageForm.siteId = siteList.list[0].id;
  }
  await loadAnnouncement()
  loadAffActiveAnnouncementType()
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
