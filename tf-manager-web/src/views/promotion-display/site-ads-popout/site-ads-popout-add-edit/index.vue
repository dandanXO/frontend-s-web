<template>
  <el-form
    ref="adsPopoutForm"
    :model="form"
    :rules="formRules"
    :inline="true"
    size="small"
    label-width="120px"
  >
    <el-row>
      <el-form-item :label="t('fields.title')" prop="title">
        <el-col :span="24">
          <el-input v-model="form.title" class="form-input" />
        </el-col>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.site')" prop="siteId">
        <!-- eslint-disable -->
        <el-select
          v-model="form.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 260px"
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
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.type')" prop="type">
        <el-select
          v-model="form.type"
          size="small"
          :placeholder="t('fields.frequency')"
          class="filter-item"
          style="width: 260px"
        >
          <el-option
            v-for="item in uiControl.type"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.redirect')" prop="path">
        <el-input v-model="form.path" class="form-input" />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.frequency')" prop="frequency">
        <el-select
          v-model="form.frequency"
          size="small"
          :placeholder="t('fields.frequency')"
          class="filter-item"
          style="width: 260px"
        >
          <el-option
            v-for="item in uiControl.frequency"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item
        :label="t('fields.desktopImage')"
        prop="desktopImgUrl"
        v-if="form.type === 'IMG'"
      >
        <el-row :gutter="5">
          <el-col v-if="form.desktopImgUrl" :span="18" style="width: 250px">
            <el-image
              v-if="form.desktopImgUrl"
              :src="promoDir + form.desktopImgUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.desktopImgUrl]"
            />
          </el-col>
          <el-col :span="6">
            <el-button
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="browseImage('DESKTOP')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item
        :label="t('fields.mobileImage')"
        prop="mobileImgUrl"
        v-if="form.type === 'IMG'"
      >
        <el-row :gutter="5">
          <el-col v-if="form.mobileImgUrl" :span="18" style="width: 250px">
            <el-image
              v-if="form.mobileImgUrl"
              :src="promoDir + form.mobileImgUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.mobileImgUrl]"
            />
          </el-col>
          <el-col :span="6">
            <el-button
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="browseImage('MOBILE')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item
        :label="t('fields.content')"
        prop="content"
        v-if="form.type === 'TEXT'"
      >
        <!-- editor here -->
        <Editor v-model:value="form.content" @input="getInput"></Editor>
      </el-form-item>
    </el-row>
    <div class="form-footer">
      <el-button type="primary" @click="submit">
        {{ t('fields.confirm') }}
      </el-button>
      <el-button @click="back">{{ t('fields.cancel') }}</el-button>
    </div>
  </el-form>
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
          :src="promoDir + item.path"
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
            :src="promoDir + selectedImage.path"
            fit="contain"
            class="smallPreview"
            :preview-src-list="[promoDir + selectedImage.path]"
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
import { computed, nextTick, reactive, ref, onMounted, watch } from 'vue'
import { required } from '../../../../utils/validate'
import Editor from '../../../../components/editor/index.vue'
import {
  createAdsPopout,
  updateAdsPopout,
  getAdsPopOutById,
} from '../../../../api/site-ads-popout'
import { ElMessage } from 'element-plus'
// import { uploadImage } from '../../../../api/image'
import { useRoute, useRouter } from 'vue-router'
import { getSiteImage } from '../../../../api/site-image'
import { getSiteListSimple } from '../../../../api/site'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'

const { t } = useI18n()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const route = useRoute()
const store = useStore()
const site = ref(null)
const promoDir = process.env.VUE_APP_IMAGE + '/promo/'

const adsPopoutForm = ref(null)

const form = reactive({
  id: null,
  title: null,
  desktopImgUrl: null,
  mobileImgUrl: null,
  path: null,
  sequence: null,
  frequency: null,
  siteId: null,
  type: null,
  content: null,
  status: false,
})

const uiControl = reactive({
  titleDisable: false,
  adsStatus: [
    { key: 1, displayName: '开', value: true },
    { key: 2, displayName: '关', value: false },
  ],
  type: [
    // { key: 1, displayName: '文字', value: 'TEXT' },
    { key: 2, displayName: '图片', value: 'IMG' },
  ],
  frequency: [
    { key: 1, displayName: '每次', value: 'EVERYTIME' },
    { key: 2, displayName: '每天', value: 'EVERYDAY' },
    { key: 3, displayName: '每时域', value: 'SESSION' },
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false,
})

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  // desktopImgUrl: [required(t('message.validateDesktopImageRequired'))],
  // mobileImgUrl: [required(t('message.validateMobileImageRequired'))],
  path: [required(t('message.validateRedirectRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  frequency: [required(t('message.validateFrequencyRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  type: [required(t('message.validateAdsTypeRequired'))],
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
const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
})

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = site.value ? site.value.id : null
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

function browseImage(type) {
  loadSiteImage()
  if (type === 'DESKTOP') {
    uiControl.imageSelectionTitle = t('fields.desktopImage')
  } else {
    uiControl.imageSelectionTitle = t('fields.mobileImage')
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
}

// is bind to the onchange event in the editor
function getInput(value) {
  form.content = value
}

function create() {
  adsPopoutForm.value.validate(async valid => {
    if (valid) {
      await createAdsPopout(form)
      // redirect to promotion pages
      back()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  adsPopoutForm.value.validate(async valid => {
    if (valid) {
      await updateAdsPopout(form)
      // redirect to promotion pages
      back()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (route.name.includes('Add')) {
    create()
  } else {
    edit()
  }
}

const router = useRouter()

function back() {
  // router.push({ path: `list` })
  router.push({
    name: 'Ads Popout',
    query: { current: route.query.current },
  })
}

async function loadForm(id, siteId) {
  const { data: adspopout } = await getAdsPopOutById(id, siteId)

  nextTick(() => {
    for (const key in adspopout) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = adspopout[key]
      }
    }
    siteList.list.forEach(element => {
      if (element.siteName === adspopout.siteName) {
        form.siteId = element.id
      }
    })
  })
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

// async function attachPhoto(event) {
//   const files = event.target.files[0]
//   const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
//   const dir = 'adspopout'

//   if (!allowFileType.find(ftype => ftype.includes(files.type))) {
//     ElMessage({ message: t('message.invalidFileType'), type: 'error' })
//   } else {
//     var formData = new FormData()
//     formData.append('files', files)
//     formData.append('dir', dir)
//     formData.append('overwrite', false)
//     return await uploadImage(formData)
//   }
// }

// async function attachDesktopImg(event) {
//   const data = await attachPhoto(event)
//   if (data.code === 0) {
//     form.desktopImgUrl = data.data
//   } else {
//     ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//   }
// }

// async function attachMobileImg(event) {
//   const data = await attachPhoto(event)
//   if (data.code === 0) {
//     form.mobileImgUrl = data.data
//   } else {
//     ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//   }
// }

function submitImage() {
  if (uiControl.imageSelectionType === 'DESKTOP') {
    form.desktopImgUrl = selectedImage.path
  } else {
    form.mobileImgUrl = selectedImage.path
  }
  uiControl.imageSelectionVisible = false
}

watch(
  () => route.name,
  () => {
    if (route.name.includes('Edit')) {
      uiControl.titleDisable = true
      loadForm(route.params.id, route.params.siteId)
    } else {
      adsPopoutForm.value.resetFields()
      form.type = uiControl.type[0].value
    }
  }
)
onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    imageRequest.siteId = store.state.user.siteId
  }
  if (route.name.includes('Edit')) {
    uiControl.titleDisable = true
    loadForm(route.params.id, route.params.siteId)
  } else {
    form.type = uiControl.type[0].value
  }
})
</script>

<style scoped>
.form-footer {
  display: flex;
  margin-left: 7.5em;
  justify-content: flex-start;
}

.form-input {
  width: 520px;
}

.image-input {
  width: 420px;
}
</style>

<style lang="scss">
.w-e-toolbar {
  z-index: 7 !important;
}

.w-e-menu {
  z-index: 2 !important;
}

.w-e-text-container {
  z-index: 1 !important;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
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
