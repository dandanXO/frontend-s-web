<template>
  <el-form
    ref="promoForm"
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
      <el-form-item :label="t('fields.desktopImage')" prop="desktopImgUrl">
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
              @click="browseImage('DESKTOP_IMAGE')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.mobileImage')" prop="mobileImgUrl">
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
              @click="browseImage('MOBILE_IMAGE')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.desktopBanner')" prop="desktopBannerUrl">
        <el-row :gutter="5">
          <el-col v-if="form.desktopBannerUrl" :span="18" style="width: 250px">
            <el-image
              v-if="form.desktopBannerUrl"
              :src="promoDir + form.desktopBannerUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.desktopBannerUrl]"
            />
          </el-col>
          <el-col :span="6">
            <el-button
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="browseImage('DESKTOP_BANNER')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.mobileBanner')" prop="mobileBannerUrl">
        <el-row :gutter="5">
          <el-col v-if="form.mobileBannerUrl" :span="18" style="width: 250px">
            <el-image
              v-if="form.mobileBannerUrl"
              :src="promoDir + form.mobileBannerUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.mobileBannerUrl]"
            />
          </el-col>
          <el-col :span="6">
            <el-button
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="browseImage('MOBILE_BANNER')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.redirect')" prop="redirectUrl">
        <el-input v-model="form.redirectUrl" class="form-input" />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.site')" prop="siteId">
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
      <el-form-item :label="t('fields.label')" prop="labelType">
        <el-radio-group v-model="form.labelType">
          <el-radio
            v-for="c in labelType.list"
            :label="c.value"
            :key="c.key"
            v-model="form.labelType"
          >
            {{ c.displayName }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.promoType')" prop="promoType">
        <el-col :span="12">
          <el-checkbox-group
            v-model="selected.promoTypeChecked"
            @change="handleCheckedChangePromoType"
            class="form-input"
          >
            <el-checkbox
              v-for="p in promoTypes"
              :label="p.typeName"
              :key="p.value"
            >
              {{ p.typeName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-form-item>

      <el-col :span="12">
        <el-form-item :label="t('fields.hasPromo')" prop="hasPromo">
          <el-switch
            v-model="form.hasPromo"
            active-color="#409EFF"
            inactive-color="#F56C6C"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-form-item :label="t('fields.sequence')" prop="sequence">
        <el-col :span="7">
          <el-input-number
            v-model="form.sequence"
            :min="1"
            controls-position="right"
          />
        </el-col>
      </el-form-item>

      <el-col :span="17">
        <el-form-item :label="t('fields.promoCode')" prop="promoCode">
          <el-input
            v-model="form.promoCode"
            size="small"
            style="width: 260px"
            :placeholder="t('fields.promoCode')"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item :label="t('fields.content')" prop="pageContent">
      <!-- editor here -->
      <Editor v-model:value="form.pageContent" @input="getInput" />
    </el-form-item>
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
        @click="loadSiteImage(uiControl.imageSelectionType)"
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
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../../utils/validate'
import Editor from '../../../../components/editor/index.vue'
import {
  createPromoPages,
  getPromoPageById,
  updatePromoPages,
} from '../../../../api/promoPages'
import { getSiteImage } from '../../../../api/site-image'
import { ElMessage } from 'element-plus'
// import { uploadImage } from '../../../../api/image'
import { useRoute, useRouter } from 'vue-router'
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const route = useRoute()
const store = useStore()
const site = ref(null)
const promoDir = process.env.VUE_APP_IMAGE + '/promo/'
const promoForm = ref(null)

const form = reactive({
  id: null,
  title: null,
  imgUrl: null,
  desktopImgUrl: null,
  mobileImgUrl: null,
  desktopBannerUrl: null,
  mobileBannerUrl: null,
  backgroundImgUrl: null,
  redirectUrl: null,
  siteId: null,
  labelType: 0,
  promoType: null,
  sequence: 0,
  promoCode: null,
  pageContent: null,
  status: true,
  createTime: null,
  createBy: null,
  hasPromo: false,
})

const uiControl = reactive({
  titleDisable: false,
  promoState: [
    { key: 1, displayName: 'active', value: true },
    { key: 2, displayName: 'disable', value: false },
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false,
})

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
})

const selected = reactive({
  promoTypeChecked: [],
  labelRadio: ref(),
})

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  desktopImgUrl: [required(t('message.validateDesktopImageRequired'))],
  mobileImgUrl: [required(t('message.validateMobileImageRequired'))],
  desktopBannerUrl: [required(t('message.validateDesktopBannerRequired'))],
  mobileBannerUrl: [required(t('message.validateMobileBannerRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  labelType: [required(t('message.validateLabelRequired'))],
  promoType: [required(t('message.validatePromoTypeRequired'))],
  promoCode: [required(t('message.validatePromoCodeRequired'))],
  pageContent: [required(t('message.validateContentRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
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

const labelType = reactive({
  list: [
    { key: 1, displayName: 'New', value: 0 },
    { key: 2, displayName: 'Hot', value: 1 },
    { key: 3, displayName: 'Normal', value: 2 },
  ],
})
const promoTypes = [
  { typeName: 'WELCOME', value: 1 },
  { typeName: 'SPORT', value: 2 },
  { typeName: 'ESPORT', value: 3 },
  { typeName: 'FISH', value: 4 },
  { typeName: 'LIVE CASINO', value: 5 },
  { typeName: 'SLOT GAME', value: 6 },
  { typeName: 'POKER', value: 7 },
]

function handleCheckedChangePromoType() {
  form.promoType = selected.promoTypeChecked.join(',')
}

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
  loadSiteImage(type)
  switch (type) {
    case 'DESKTOP_IMAGE':
      uiControl.imageSelectionTitle = t('fields.desktopImage')
      break
    case 'MOBILE_IMAGE':
      uiControl.imageSelectionTitle = t('fields.mobileImage')
      break
    case 'DESKTOP_BANNER':
      uiControl.imageSelectionTitle = t('fields.desktopBanner')
      break
    case 'MOBILE_BANNER':
      uiControl.imageSelectionTitle = t('fields.mobileBanner')
      break
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
}

// function handleRadioChangeLabel() {
//   form.labelType = selected.labelRadio;
// }

// is bind to the onchange event in the editor
function getInput(value) {
  form.pageContent = value
}

function create() {
  promoForm.value.validate(async valid => {
    if (valid) {
      await createPromoPages(form)
      // redirect to promotion pages
      back()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  promoForm.value.validate(async valid => {
    if (valid) {
      await updatePromoPages(form)
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
    name: 'Promotion pages',
    query: { current: route.query.current },
  })
}

async function loadForm(id, siteId) {
  const { data: ret } = await getPromoPageById(id, siteId)

  nextTick(() => {
    for (const key in ret) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = ret[key]
      }
    }

    form.siteId = ret.siteId
    // checked promoType checkboxes
    // const promoArr = form.promoType.split(",").map(Number)
    const promoArr = form.promoType.split(',')
    promoArr.forEach(element => {
      selected.promoTypeChecked.push(element)
    })
  })
}

async function loadSiteImage(type) {
  selectedImage.id = 0
  imageRequest.promoType = type
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
//   const dir = 'promo'

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

// async function attachDesktopBanner(event) {
//   const data = await attachPhoto(event)
//   if (data.code === 0) {
//     form.desktopBannerUrl = data.data
//   } else {
//     ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//   }
// }

// async function attachMobileBanner(event) {
//   const data = await attachPhoto(event)
//   if (data.code === 0) {
//     form.mobileBannerUrl = data.data
//   } else {
//     ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//   }
// }

function submitImage() {
  switch (uiControl.imageSelectionType) {
    case 'DESKTOP_IMAGE':
      form.desktopImgUrl = selectedImage.path
      break
    case 'MOBILE_IMAGE':
      form.mobileImgUrl = selectedImage.path
      break
    case 'DESKTOP_BANNER':
      form.desktopBannerUrl = selectedImage.path
      break
    case 'MOBILE_BANNER':
      form.mobileBannerUrl = selectedImage.path
      break
  }
  uiControl.imageSelectionVisible = false
}

onMounted(() => {
  console.log('new page ')
  loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    imageRequest.siteId = store.state.user.siteId
  }
  if (route.name.includes('Edit')) {
    uiControl.titleDisable = true
    loadForm(route.params.id, route.params.siteId)
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
