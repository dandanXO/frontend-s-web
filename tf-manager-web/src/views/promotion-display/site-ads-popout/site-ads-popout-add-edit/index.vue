<template>
  <el-form ref="adsPopoutForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="120px">
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
        <el-select v-model="form.siteId" size="small" :placeholder="t('fields.site')" class="filter-item"
          style="width: 260px" default-first-option @focus="loadSites">
          <el-option v-for="item in siteList.list" :key="item.id" :label="item.siteName" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.type')" prop="type">
        <el-select v-model="form.type" size="small" :placeholder="t('fields.frequency')" class="filter-item"
          style="width: 260px">
          <el-option v-for="item in uiControl.type" :key="item.key" :label="item.displayName" :value="item.value" />
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
        <el-select v-model="form.frequency" size="small" :placeholder="t('fields.frequency')" class="filter-item"
          style="width: 260px">
          <el-option v-for="item in uiControl.frequency" :key="item.key" :label="item.displayName" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.desktopImage')" prop="desktopImgUrl" v-if="form.type === 'IMG'">
        <el-row :gutter="5">
          <el-col :span="20">
            <el-input :readonly="true" v-model="form.desktopImgUrl" class="image-input" />
          </el-col>
          <el-col :span="2">
            <!-- eslint-disable -->
            <input id="uploadDesktopFile" type="file" ref="inputDesktop" style="display: none" accept="image/*"
              @change="attachDesktopImg" />
            <el-button icon="el-icon-upload" size="mini" type="success" @click="$refs.inputDesktop.click()">
              {{ t('fields.upload') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.mobileImage')" prop="mobileImgUrl" v-if="form.type === 'IMG'">
        <el-row :gutter="5">
          <el-col :span="20">
            <el-input :readonly="true" v-model="form.mobileImgUrl" class="image-input" />
          </el-col>
          <el-col :span="2">
            <!-- eslint-disable -->
            <input id="uploadMobileFile" type="file" ref="inputMobile" style="display: none" accept="image/*"
              @change="attachMobileImg" />
            <el-button icon="el-icon-upload" size="mini" type="success" @click="$refs.inputMobile.click()">
              {{ t('fields.upload') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.content')" prop="content" v-if="form.type === 'TEXT'">
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
</template>
<script setup>
import { nextTick, reactive, ref, onMounted, watch } from 'vue'
import { required } from '../../../../utils/validate'
import Editor from '../../../../components/editor/index.vue'
import {
  createAdsPopout,
  updateAdsPopout,
  getAdsPopOutById
} from '../../../../api/site-ads-popout'
import { ElMessage } from 'element-plus'
import { uploadImage } from '../../../../api/image'
import { useRoute, useRouter } from 'vue-router'
import { getSiteListSimple } from '../../../../api/site'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

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
    { key: 1, displayName: '文字', value: 'TEXT' },
    { key: 2, displayName: '图片', value: 'IMG' },
  ],
  frequency: [
    { key: 1, displayName: '每次', value: 'EVERYTIME' },
    { key: 2, displayName: '每天', value: 'EVERYDAY' },
    { key: 3, displayName: '每时域', value: 'SESSION' },
  ]
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

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  const dir = 'adspopout'

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
  const data = await attachPhoto(event)
  if (data.code === 0) {
    form.desktopImgUrl = data.data
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function attachMobileImg(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    form.mobileImgUrl = data.data
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}
watch(() => route.name, () => {
  if (route.name.includes('Edit')) {
    uiControl.titleDisable = true
    loadForm(route.params.id, route.params.siteId)
  } else {
    adsPopoutForm.value.resetFields()
    form.type = uiControl.type[0].value;
  }
});
onMounted(() => {
  if (route.name.includes('Edit')) {
    uiControl.titleDisable = true
    loadForm(route.params.id, route.params.siteId)
  } else {
    form.type = uiControl.type[0].value;
  }
  // loadSites()
  // if (route.name.includes('Edit')) {
  //   uiControl.titleDisable = true
  //   loadForm(route.params.id, route.params.siteId)
  // } else {
  //   form.type = uiControl.type[0].value;
  // }
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
</style>
