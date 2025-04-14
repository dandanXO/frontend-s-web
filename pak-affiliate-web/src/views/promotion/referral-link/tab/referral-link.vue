<template>
  <div class="roles-main">
    <el-card style="margin-top: 20px;" shadow="none">
      <div class="card-container">
        <div class="card-panel-description">
          <span style="font-size: 20px; font-weight: normal;">
            {{ $t('referralLink.affiliateWebPlatformLink') }}
          </span>
          <a :href="page.webLongLink" target="_blank" style="color: #3F8CFF">
            {{ page.webLongLink }}
          </a>
        </div>

        <!-- <div class="btn-group">&nbsp;</div> -->
        <!-- <div class="btn-group">
            <el-button
              type="primary"
              @click="linkDiaglogControl.tagDialogVisible = false"
            >
              防溢出安卓包
            </el-button>
            <span style="font-size: 12px; color: #afb3c8">
              点击构建最新版本APK下载地址
            </span>
          </div> -->

        <div class="btn-group">
          <el-dropdown trigger="click">
            <el-button
              type="primary"
              size="normal"
              style="width:100%; box-shadow: 0px 6px 12px 0px #3F8CFF43;"
            >
              <span>{{ $t('fields.copy') }}</span>
              <el-icon class="el-icon--right"><arrow-down-bold /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu style="width: inherit">
                <el-dropdown-item @click="handleLinkSelection('WEB', 'WX')" v-if="store.state.user.siteCode !== 'VNM'">
                  {{ $t('referralLink.affiliateWXShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleLinkSelection('WEB', 'QQ')" v-if="store.state.user.siteCode !== 'VNM'">
                  {{ $t('referralLink.affiliateQQShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleLinkSelection('WEB', 'ZALO')" v-if="store.state.user.siteCode === 'VNM'">
                  {{ $t('referralLink.affiliateZALOShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="copy(page.webLongLink)">
                  {{ $t('referralLink.affiliateLongLink') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click">
            <el-button
              size="normal"
              style="margin-left: 0px; width: 100%; "
            >
              <span style="">{{ $t('fields.download') }}</span>
              <el-icon class="el-icon--right" style="color: #fff;">
                <arrow-down-bold />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu style="width: inherit">
                <el-dropdown-item @click="handleQrSelection('WEB', 'WX')" v-if="store.state.user.siteCode !== 'VNM'">
                  {{ $t('referralLink.affiliateWXQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection('WEB', 'QQ')" v-if="store.state.user.siteCode !== 'VNM'">
                  {{ $t('referralLink.affiliateQQQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection('WEB', 'ZALO')" v-if="store.state.user.siteCode === 'VNM'">
                  {{ $t('referralLink.affiliateZALOQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection('WEB', 'NORMAL')">
                  {{ $t('referralLink.affiliateLongQRLink') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px;">
      <div class="card-container">
        <div class="card-panel-description">
          <span style="font-size: 20px; font-weight: normal;">
            {{ $t('referralLink.affiliateH5PlatformLink') }}
          </span>
          <a :href="page.h5LongLink" target="_blank" style="color: #3F8CFF">
            {{ page.h5LongLink }}
          </a>
        </div>

        <!-- <div class="btn-group">&nbsp;</div> -->
        <!-- <div class="btn-group">
            <el-button
              type="primary"
              @click="linkDiaglogControl.tagDialogVisible = false"
            >
              防溢出安卓包
            </el-button>
            <span style="font-size: 12px; color: #afb3c8">
              点击构建最新版本APK下载地址
            </span>
          </div> -->

        <div class="btn-group">
          <el-dropdown trigger="click">
            <el-button size="normal" type="primary" style="width:100%">
              <span>{{ $t('fields.copy') }}</span>
              <el-icon class="el-icon--right"><arrow-down-bold /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu style="width: inherit">
                <el-dropdown-item @click="handleLinkSelection('H5', 'WX')" v-if="store.state.user.siteCode !== 'VNM'">
                  {{ $t('referralLink.affiliateWXShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleLinkSelection('H5', 'QQ')" v-if="store.state.user.siteCode !== 'VNM'">
                  {{ $t('referralLink.affiliateQQShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleLinkSelection('H5', 'ZALO')" v-if="store.state.user.siteCode === 'VNM'">
                  {{ $t('referralLink.affiliateZALOShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="copy(page.h5LongLink)">
                  {{ $t('referralLink.affiliateLongLink') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click">
            <el-button
              size="normal"
              style="margin-left: 0px; width: 100%; "
            >
              <span style="">{{ $t('fields.download') }}</span>
              <el-icon class="el-icon--right" style="color: #fff;">
                <arrow-down-bold />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleQrSelection('H5', 'WX')" v-if="store.state.user.siteCode !== 'VNM'">
                  {{ $t('referralLink.affiliateWXQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection('H5', 'QQ')" v-if="store.state.user.siteCode !== 'VNM'">
                  {{ $t('referralLink.affiliateQQQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection('H5', 'ZALO')" v-if="store.state.user.siteCode === 'VNM'">
                  {{ $t('referralLink.affiliateZALOQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection('H5', 'NORMAL')">
                  {{ $t('referralLink.affiliateLongQRLink') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-card>

    <el-dialog
      :title="linkDiaglogControl.dialogTitle"
      v-model="linkDiaglogControl.dialogVisible"
      width="450px"
    >
      <p style="text-align: center;">{{ linkDiaglogControl.dialogContent }}</p>
      <p style="text-align: center;">
        {{ linkDiaglogControl.dialogShortLink }}
      </p>
      <!-- Custom footer with a button -->
      <span style="display: flex; justify-content: center;">
        <el-button
          type="primary"
          @click="
            handleLinkSelection(
              linkDiaglogControl.dialogRegenerateLinkType,
              linkDiaglogControl.dialogRegenerateUrlType
            )
          "
        >
          {{ $t('fields.regenerate') }}
        </el-button>
        <el-button
          type="primary"
          @click="linkDiaglogControl.dialogVisible = false"
        >
          {{ $t('fields.cancel') }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="qrDialogControl.dialogTitle"
      v-model="qrDialogControl.dialogVisible"
      width="450px"
    >
      <p style="text-align: center;">{{ qrDialogControl.dialogContent }}</p>

      <div
        style="display: flex; justify-content: space-between; margin-left: 25px; margin-right: 25px;"
      >
        <div class="qrcode-container">
          <QrcodeVue
            :value="qrDialogControl.dialogQRLink1"
            size="160"
            id="qrcode"
          />
          <div class="icon-container">
            <img
              :src="qrDialogControl.dialogQRIcon1"
              alt="Icon"
              class="center-icon"
            >
          </div>
        </div>
        <div>
          <QrcodeVue :value="qrDialogControl.dialogQRLink2" size="160" />
        </div>
      </div>

      <div
        style="display: flex; justify-content: space-between; margin-left: 25px; margin-right: 25px; margin-top: 20px;"
      >
        <div>
          <button @click="download">
            {{ $t('referralLink.affiliateDownloadQRtoLocal') }}
          </button>
        </div>
        <div style="float: left;">
          {{ $t('referralLink.affiliateScanMe') }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { useStore } from '@/store'
import { nextTick, onMounted, reactive, computed } from '@vue/runtime-core'
import { getAffiliateInfo } from '../../../../api/affiliate'
import { getConfigs } from '../../../../api/system-config'
import { getShortLink } from '../../../../api/affiliate-short-link'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { ArrowDownBold } from '@element-plus/icons-vue'
import QrcodeVue from 'qrcode.vue'
import { generateRandomAlphaNumeric } from '@/utils/utils'

const store = useStore()
// eslint-disable-next-line
const { t } = useI18n()

const linkDiaglogControl = reactive({
  dialogVisible: false,
  dialogContent: '',
  dialogTitle: '',
  dialogShortLink: '',
  dialogRegenerateLinkType: '',
  dialogRegenerateUrlType: '',
})

const qrDialogControl = reactive({
  dialogVisible: false,
  dialogContent: '',
  dialogTitle: '',
  dialogQRLink1: '',
  dialogQRLink2: '',
  dialogQRIcon1: '',
})

const page = reactive({
  shortLinkPlatform: null,
  webLongLink: null,
  h5LongLink: null,
})

const affInfo = reactive({
  affiliateCode: null,
})

const request = reactive({
  siteId: null,
  affiliateId: null,
  linkType: null,
  urlType: null,
  longUrl: null,
  shortUrl: null,
})

async function loadAffiliateInfo() {
  const { data: aff } = await getAffiliateInfo(store.state.user.id)
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field]
  })
  await loadReferralLink()
}

async function loadReferralLink() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  query.siteId = store.state.user.siteId
  const { data: ret } = await getConfigs(query)

  const temWebLongLink = ret.find(obj => obj.code === 'affiliate_web_link')
    .value

  const tempH5LongLink = ret.find(obj => obj.code === 'affiliate_h5_link').value

  const tempShortLinkPlatform = ret.find(
    obj => obj.code === 'affiliate_short_url_platform'
  ).value

  page.webLongLink = temWebLongLink + 'agent/' + affInfo.affiliateCode
  page.h5LongLink = tempH5LongLink + 'agent/' + affInfo.affiliateCode
  page.shortLinkPlatform = tempShortLinkPlatform

  await nextTick()
}

function copy(text) {
  navigator.clipboard.writeText(text)
  ElMessage({ message: t('message.referralLinkCopied'), type: 'success' })
}

function download() {
  console.log(document.getElementById('qrcode'))
  const canvas = document.getElementById('qrcode').toDataURL('image/png')
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = function() {
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(xhr.response)
    a.download = 'Referral Link.png'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  xhr.open('GET', canvas)
  xhr.send()
}

function handleLinkSelection(linkType, urlType) {
  // save record into db
  request.siteId = store.state.user.siteId
  request.affiliateId = store.state.user.id
  request.linkType = linkType
  request.urlType = urlType

  let pageLongLink = ''
  let shortUrl = ''
  let dialogContent = ''
  const randomGenerateAlphaNumeric = generateRandomAlphaNumeric()
  if (linkType === 'WEB') {
    pageLongLink = page.webLongLink
    shortUrl = page.shortLinkPlatform + '/' + randomGenerateAlphaNumeric
  } else if (linkType === 'H5') {
    pageLongLink = page.h5LongLink
    shortUrl = page.shortLinkPlatform + '/' + randomGenerateAlphaNumeric
  }

  if (urlType === 'WX') {
    dialogContent = t('referralLink.copiedWXShortUrl')
  } else if (urlType === 'QQ') {
    dialogContent = t('referralLink.copiedQQShortUrl')
  } else if (urlType === 'ZALO') {
    dialogContent = t('referralLink.copiedZALOShortUrl')
  }

  request.longUrl = pageLongLink
  request.shortUrl = randomGenerateAlphaNumeric

  getShortLink(request)
  linkDiaglogControl.dialogTitle = t('referralLink.copiedLink')
  linkDiaglogControl.dialogContent = dialogContent
  linkDiaglogControl.dialogShortLink = shortUrl
  linkDiaglogControl.dialogVisible = true
  linkDiaglogControl.dialogRegenerateLinkType = linkType
  linkDiaglogControl.dialogRegenerateUrlType = urlType

  navigator.clipboard.writeText(shortUrl)
}

function handleQrSelection(linkType, urlType) {
  // save record to db
  request.siteId = store.state.user.siteId
  request.affiliateId = store.state.user.id
  request.linkType = linkType
  request.urlType = urlType

  let pageLongLink = ''
  let shortUrl = ''
  let qrImageLink1 = ''
  let qrImageLink2 = ''
  const randomGenerateAlphaNumeric = generateRandomAlphaNumeric()

  if (linkType === 'WEB') {
    pageLongLink = page.webLongLink

    if (urlType !== 'NORMAL') {
      shortUrl = page.shortLinkPlatform + '/' + randomGenerateAlphaNumeric
      request.shortUrl = randomGenerateAlphaNumeric

      qrImageLink1 = shortUrl
      qrImageLink2 = shortUrl
    }
  } else if (linkType === 'H5') {
    pageLongLink = page.h5LongLink

    if (urlType !== 'NORMAL') {
      shortUrl = page.shortLinkPlatform + '/' + randomGenerateAlphaNumeric
      request.shortUrl = randomGenerateAlphaNumeric

      qrImageLink1 = shortUrl
      qrImageLink2 = shortUrl
    }
  }

  request.longUrl = pageLongLink
  if (urlType !== 'NORMAL') {
    getShortLink(request)
  } else {
    qrImageLink1 = pageLongLink
    qrImageLink2 = pageLongLink
    console.log('urlType = NORMAL')
  }

  const faviconElement = document.querySelector('link[rel="icon"]')

  qrDialogControl.dialogTitle = t('referralLink.downloadQRCode')
  qrDialogControl.dialogVisible = true
  qrDialogControl.dialogQRIcon1 = faviconElement.href
  qrDialogControl.dialogQRLink1 = qrImageLink1
  qrDialogControl.dialogQRLink2 = qrImageLink2
}

const siteId = computed(() => {
  return store.state.user.siteId
})
console.log(siteId)

onMounted(() => {
  loadAffiliateInfo()
})
</script>

<style scoped>
.el-card {
  max-width: 430px;
}
.roles-main {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.el-card {
  background: #f4f9fd;
  border: 0;
}
.card-container {
  display: flex;
  gap: 20px;
}

.card-panel-description {
  /* width: 50%; */
  font-weight: 700;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 270px;
}

.card-panel-description a {
  width: auto;
  display: inline-block;
  white-space: normal;
  word-break: break-word;
}

.btn-group {
  /* width: 25%; */
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 130px;
  margin-left: auto;
}

/* Styles for the container and QR code */
.qrcode-container {
  position: relative;
  width: 160px; /* Adjust the width and height as needed */
  height: 160px;
}

.qrcode {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Styles for the icon container */
.icon-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Styles for the center icon */
.center-icon {
  width: 50px; /* Adjust the width and height as needed */
  height: 50px;
}

@media (max-width: 500px) {
  .card-container {
    flex-direction: column;
  }
  .btn-group {
    margin-left: 0;
  }
}
</style>
