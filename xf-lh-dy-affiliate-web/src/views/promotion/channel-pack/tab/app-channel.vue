<template>
  <el-form
    ref="requestForm"
    :model="form"
    :rules="formRules"
    label-width="150px"
    label-suffix=" :"
  >
    <el-form-item :label="t('fields.packType')">
      <el-button
        v-for="(appType, index) in appTypeList"
        :key="appType.type"
        :class="form.appType === appType.type ? 'el-button--primary' : ''"
        @click="onAppTypeChange(index)"
      >
        {{ appType.display }}
      </el-button>
    </el-form-item>
    <el-form-item :label="t('fields.affiliateCode')">
      <span>{{ form.affId }}</span>
    </el-form-item>
    <el-form-item :label="t('fields.selectSystem')">
      <span>{{ form.os }}</span>
    </el-form-item>
    <el-form-item :label="t('fields.apkType')">
      <el-button
        :class="form.apkType === 'NORMAL' ? 'el-button--primary' : ''"
        @click="onApkTypeChange(1)"
      >
        {{ $t('fields.normal') }}
      </el-button>
      <el-button
        :class="form.apkType !== 'NORMAL' ? 'el-button--primary' : ''"
        @click="onApkTypeChange(2)"
      >
        {{ $t('fields.newKey') }}
      </el-button>
    </el-form-item>
    <el-form-item :label="t('fields.appVersion')">
      <div v-loading="versionLoading" style="width:fit-content">
        <span>{{ form.version === undefined ? '-' : form.version }}</span>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.appName')" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item :label="t('fields.appIcon')" prop="icon">
      <div id="preview">
        <el-image
          v-if="uploadedImage.url"
          :src="uploadedImage.url"
          :fit="contain"
        />
      </div>
      <input
        id="uploadFile"
        type="file"
        ref="inputImage"
        style="display: none"
        accept="image/*"
        @change="attachImage"
      >
      <el-button
        icon="el-icon-upload"
        size="mini"
        type="success"
        @click="$refs.inputImage.click()"
      >
        {{ t('fields.upload') }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :disabled="form.version === undefined"
        @click="submitCreatePack()"
      >
        {{ $t('fields.packNow') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  uploadImage,
  createChannelPack,
  getVersion,
} from '../../../../api/channel-pack'
import { useStore } from '../../../../store'
import { required } from '../../../../utils/validate'

const { t } = useI18n()
const store = useStore()
// do not use same name with ref
const requestForm = ref(null)
const form = reactive({
  appType: 'ALL_SITE',
  siteId: store.state.user.siteId,
  affId: store.state.user.id,
  os: 'ANDROID',
  apkType: 'NORMAL',
  version: '1.1.1',
  name: '',
  icon: '',
})
const inputImage = ref(null)
const versionLoading = ref(true)

const appTypeList = [
  { type: 'ALL_SITE', display: t('appType.allSite') },
  { type: 'SPORT', display: t('appType.sport') },
  { type: 'ESPORT', display: t('appType.esport') },
]

const uploadedImage = reactive({
  url: null,
})

const formRules = reactive({
  name: [required(t('message.validateAppNameRequired'))],
  icon: [required(t('message.validateAppIconRequired'))],
})

async function attachImage(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    form.icon = data.data
    inputImage.value.value = ''
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
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

function onApkTypeChange(val) {
  if (val === 1) {
    form.apkType = 'NORMAL'
  } else {
    form.apkType = 'NEW_KEY'
  }
  loadVersion()
}

function onAppTypeChange(val) {
  form.appType = appTypeList[val].type
  loadVersion()
}

async function submitCreatePack() {
  requestForm.value.validate(async valid => {
    if (valid) {
      await createChannelPack(form)
      resetForm()
      ElMessage({ message: t('message.packRequestInQueue'), type: 'success' })
    }
  })
}

function resetForm() {
  form.appType = 'ALL_SITE'
  form.os = 'ANDROID'
  form.apkType = 'NORMAL'
  form.name = ''
  form.icon = ''
  uploadedImage.url = ''
  loadVersion()
}

async function loadVersion() {
  versionLoading.value = true
  const { data: ret } = await getVersion(form)
  form.version = ret
  versionLoading.value = false
}

onMounted(() => {
  loadVersion()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#preview {
  display: flex;
  justify-content: left;
}

#preview .el-image {
  width: 60px;
  height: 60px;
}
</style>
