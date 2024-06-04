<template>
  <div class="roles-main">
    <el-card
      style="margin-top: 20px;"
      shadow="none"
      v-for="item in affInfo.domains"
      :key="item.id"
    >
      <div class="card-container">
        <div class="card-panel-description">
          <span style="font-size: 20px; font-weight: normal;">
            {{
              item.way === 'PC'
                ? $t('referralLink.affiliateShortLink')
                : $t('referralLink.affiliateShortLink')
            }}
          </span>
          <a :href="item.domain" target="_blank" style="color: #3F8CFF">
            {{ item.domain }}
          </a>
        </div>

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
                <el-dropdown-item @click="handleLinkSelection(item, 'WX')">
                  {{ $t('referralLink.affiliateWXShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleLinkSelection(item, 'QQ')">
                  {{ $t('referralLink.affiliateQQShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleLinkSelection(item, 'ZALO')">
                  {{ $t('referralLink.affiliateZALOShortLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="copy(item.domain)">
                  {{ $t('referralLink.affiliateLongLink') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click">
            <el-button
              size="normal"
              style="margin-left: 0px; width: 100%; border-color: #409eff"
            >
              <span style="color: #409eff;">{{ $t('fields.download') }}</span>
              <el-icon class="el-icon--right" style="color: #409eff;">
                <arrow-down-bold />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu style="width: inherit">
                <el-dropdown-item @click="handleQrSelection(item, 'WX')">
                  {{ $t('referralLink.affiliateWXQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection(item, 'QQ')">
                  {{ $t('referralLink.affiliateQQQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection(item, 'ZALO')">
                  {{ $t('referralLink.affiliateZALOQRLink') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleQrSelection(item, 'NORMAL')">
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
import { onMounted, reactive } from '@vue/runtime-core'
import { getAffiliateDomain } from '../../../../api/affiliate-domain'
import { getShortLink } from '../../../../api/affiliate-short-link'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { ArrowDownBold } from '@element-plus/icons-vue'
import QrcodeVue from 'qrcode.vue'
import { generateRandomAlphaNumeric } from '@/utils/utils'
import { getConfigs } from '../../../../api/system-config'

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
  domains: [],
})

const request = reactive({
  siteId: null,
  affiliateId: null,
  linkType: null,
  urlType: null,
  longUrl: null,
  shortUrl: null,
})

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

function handleLinkSelection(item, urlType) {
  // save record into db
  request.siteId = store.state.user.siteId
  request.affiliateId = store.state.user.id
  request.linkType = item.way === 'PC' ? 'WEB' : 'H5'
  request.urlType = urlType

  let dialogContent = ''
  const randomGenerateAlphaNumeric = generateRandomAlphaNumeric()
  const shortUrl = page.shortLinkPlatform + '/' + randomGenerateAlphaNumeric

  if (urlType === 'WX') {
    dialogContent = t('referralLink.copiedWXShortUrl')
  } else if (urlType === 'QQ') {
    dialogContent = t('referralLink.copiedQQShortUrl')
  } else if (urlType === 'ZALO') {
    dialogContent = t('referralLink.copiedZALOShortUrl')
  }

  request.longUrl = item.domain
  request.shortUrl = randomGenerateAlphaNumeric

  getShortLink(request)
  linkDiaglogControl.dialogTitle = t('referralLink.copiedLink')
  linkDiaglogControl.dialogContent = dialogContent
  linkDiaglogControl.dialogShortLink = shortUrl
  linkDiaglogControl.dialogVisible = true
  linkDiaglogControl.dialogRegenerateLinkType = request.linkType
  linkDiaglogControl.dialogRegenerateUrlType = urlType

  navigator.clipboard.writeText(shortUrl)
}

function handleQrSelection(item, urlType) {
  // save record to db
  request.siteId = store.state.user.siteId
  request.affiliateId = store.state.user.id
  request.linkType = item.way === 'PC' ? 'WEB' : 'H5'
  request.urlType = urlType

  let shortUrl = ''
  let qrImageLink1 = ''
  let qrImageLink2 = ''
  const randomGenerateAlphaNumeric = generateRandomAlphaNumeric()

  if (urlType !== 'NORMAL') {
    shortUrl = page.shortLinkPlatform + '/' + randomGenerateAlphaNumeric
    request.shortUrl = randomGenerateAlphaNumeric

    qrImageLink1 = shortUrl
    qrImageLink2 = shortUrl
  }

  request.longUrl = item.domain
  if (urlType !== 'NORMAL') {
    getShortLink(request)
  } else {
    qrImageLink1 = item.domain
    qrImageLink2 = item.domain
  }

  const faviconElement = document.querySelector('link[rel="icon"]')

  qrDialogControl.dialogTitle = t('referralLink.downloadQRCode')
  qrDialogControl.dialogVisible = true
  qrDialogControl.dialogQRIcon1 = faviconElement.href
  qrDialogControl.dialogQRLink1 = qrImageLink1
  qrDialogControl.dialogQRLink2 = qrImageLink2
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

  const tempShortLinkPlatform = ret.find(
    obj => obj.code === 'affiliate_short_url_platform'
  ).value

  page.shortLinkPlatform = tempShortLinkPlatform
}

async function loadAffiliateDomain() {
  const { data: domain } = await getAffiliateDomain(store.state.user.id)
  affInfo.domains = domain
}

onMounted(() => {
  loadAffiliateDomain()
  loadReferralLink()
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
