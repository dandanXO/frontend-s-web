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
        :class="form.appType === appType.type ? 'tick' : ''"
        plain
        size="normal"
        style="min-width: 100px; padding-left: 10px;"
        @click="onAppTypeChange(index)"
      >
        {{ $t(`appType.${appType.type}`) }}
      </el-button>
    </el-form-item>
    <el-form-item :label="t('fields.affiliateCode')">
      <div v-loading="affCodeLoading" style="width:fit-content">
        <span>{{ affInfo.affiliateCode }}</span>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.selectSystem')">
      <span>{{ form.os === 'ANDROID' ? $t('osType.ANDROID') : $t('osType.IOS') }}</span>
    </el-form-item>
    <el-form-item :label="t('fields.apkType')">
      <el-button
        size="normal"
        style="min-width: 100px; padding-left: 10px;"
        :class="form.apkType === 'NORMAL' ? 'tick' : ''"
        @click="onApkTypeChange(1)"
      >
        {{ $t('fields.normal') }}
      </el-button>
      <el-button
        size="normal"
        style="min-width: 100px; padding-left: 10px;"
        :class="form.apkType !== 'NORMAL' ? 'tick' : ''"
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
      <el-row>
        <el-col :xl="3" :lg="5" :md="5" :sm="8">
          <el-input size="normal" v-model="form.name" />
        </el-col>
      </el-row>
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
      <el-icon :class="uploadedImage.url ? 'uploaded' : ''" class="avatar-uploader-icon" @click="$refs.inputImage.click()">
        <img src="../../../../assets/images/imgicon.svg">
      </el-icon>
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
// import { required } from '../../../../utils/validate'
import { getAffiliateInfo } from '../../../../api/affiliate'

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
  name: null,
  icon: null,
})
const inputImage = ref(null)
const versionLoading = ref(true)
const affCodeLoading = ref(true)
const appTypeList = [
  { type: 'ALL_SITE', display: t('appType.ALL_SITE') },
  // { type: 'SPORT', display: t('appType.SPORT') },
  // { type: 'ESPORT', display: t('appType.ESPORT') },
]

const affInfo = reactive({
  affiliateCode: null,
})

const uploadedImage = reactive({
  url: null,
})

const formRules = reactive({})

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
      if (form.name === null || form.name === '') {
        form.name = form.appType.replace("_", " ") + ' ' + affInfo.affiliateCode
      }
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
  form.icon = null
  uploadedImage.url = ''
  loadVersion()
}

async function loadVersion() {
  versionLoading.value = true
  const { data: ret } = await getVersion(form)
  form.version = ret
  versionLoading.value = false
}

async function loadAffiliateInfo() {
  const { data: aff } = await getAffiliateInfo(store.state.user.id)
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field]
  })
  affCodeLoading.value = false
}

onMounted(() => {
  loadVersion()
  loadAffiliateInfo()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#preview {
  display: flex;
  justify-content: left;
}

#preview .el-image {
  width: 75px;
  height: 75px;
}
.tick {
  position: relative;
  border: 1px solid#409eff;
  background: #ecf5ff;
  overflow: hidden;
  &:before {
    content: "✔";
    position: absolute;
    color: #ffffff;
    padding: 0px;
    right: 3px;
    bottom: 3px;
    width: 8px;
    height: 8px;
    font-size: 10px;
    background-size: contain;
    z-index: 1;
  }
  &:after {
    content: "";
    background: #409eff;
    position: absolute;
    bottom: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    transform: rotateZ(45deg);
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 75px;
  height: 75px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #458BFF;
  background: #F4F9FD;
  &.uploaded {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
</style>
