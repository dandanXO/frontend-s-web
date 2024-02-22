<template>
  <div class="roles-main">
    <el-form @submit.prevent :inline="true" label-suffix=":">
      <el-row style="align-items: center;">
        <el-col :xl="4" :lg="8" :md="8">
          <el-form-item :label="t('fields.packDate')">
            <el-date-picker
              v-model="request.finishTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="normal"
              class="input-small"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="8" :md="8">
          <el-form-item :label="t('fields.osType')">
            <el-select v-model="request.status" size="normal" :placeholder="t('fields.select')">
              <el-option :label="t('fields.all')" key="0" value="" />
              <el-option
                v-for="status in statusList"
                :key="status.type"
                :label="status.display"
                :value="status.type"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="8" :md="8">
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="loadHistory()"
            size="normal"
          >
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="normal" type="primary" plain @click="resetQuery()">
            {{ $t('fields.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <table class="custom-table" cellpadding="0" cellspacing="0" border="0">
      <thead>
        <tr>
          <th scope="col">{{ t('fields.sequence') }}</th>
          <th scope="col">{{ t('fields.packType') }}</th>
          <th scope="col">{{ t('fields.osType') }}</th>
          <th scope="col">{{ t('fields.appName') }}</th>
          <th scope="col">{{ t('fields.appIcon') }}</th>
          <th scope="col">{{ t('fields.buildStatus') }}</th>
          <th scope="col">{{ t('fields.download') }}</th>
          <th scope="col">{{ t('fields.packDate') }}</th>
          <th scope="col">{{ t('fields.operate') }}</th>
        </tr>
      </thead>
      <tbody v-if="page.records.length > 0">
        <tr v-for="(item, index) in page.records" :key="item.id">
          <td :data-label="t('fields.sequence')">{{ (request.current - 1) * 10 + index + 1 }}</td>
          <td :data-label="t('fields.packType')">
            {{ $t(`appType.${item.appType}`) }}
          </td>
          <td :data-label="t('fields.osType')">
            {{ $t(`osType.${item.osType}`) }}
          </td>
          <td :data-label="t('fields.appName')">{{ item.appName }}</td>
          <td :data-label="t('fields.appIcon')">
            <div v-if="item.appIcon !== null" class="preview">
              <img :src="imageDir + item.appIcon" alt="app-icon">
            </div>
            <div v-else>
              {{ $t('fields.unchanged') }}
            </div>
          </td>
          <td :data-label="t('fields.buildStatus')">
            {{ $t(`packStatus.${item.status}`) }}
          </td>
          <td :data-label="t('fields.download')">{{ item.downloadCount }}</td>
          <td :data-label="t('fields.packDate')">
            <span v-if="item.finishTime === null">-</span>
            <span v-else>{{ moment(item.finishTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
          </td>
          <td :data-label="t('fields.operate')">
            <el-button
              v-if="item.status === 'SUCCESS'"
              class="success-btn"
              type="primary"
              @click="viewDetail(item)"
            >
              {{ $t('fields.detail') }}
            </el-button>
            <el-button
              v-if="item.status === 'IN_QUEUE'"
              class="danger-btn"
              @click="cancelPack(item.id)"
            >
              {{ $t('fields.cancel') }}
            </el-button>
            <span v-if="item.status === 'CANCEL'">-</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="page.records.length === 0">
      <emptyComp />
    </div>
    <el-pagination
      v-if="page.records.length !== 0"
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
  <el-dialog :title="t('fields.detail')" v-model="showDialog" width="90%" style="margin: 0 auto;" modal-class="dialog900">
    <div class="scrollable-container">
      <div class="info-container">
        <el-form label-suffix=" : " label-width="110px">
          <div class="info-row-container">
            <el-form-item :label="t('fields.packType')">
              {{ $t(`appType.${channelPackInfo.appType}`) }}
            </el-form-item>
            <el-form-item :label="t('fields.buildStatus')">
              {{ $t(`packStatus.${channelPackInfo.status}`) }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.appName')">
              {{ channelPackInfo.appName }}
            </el-form-item>
            <el-form-item :label="t('fields.osType')">
              {{ $t(`osType.${channelPackInfo.osType}`) }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.appVersion')">
              {{ channelPackInfo.version }}
            </el-form-item>
            <el-form-item :label="t('fields.packSize')">
              <span v-if="channelPackInfo.fileSize === ''">-</span>
              <span v-else>
                {{ channelPackInfo.fileSize }} MB
              </span>
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.download')">
              {{ channelPackInfo.downloadCount }}
            </el-form-item>
            <el-form-item :label="t('fields.packDate')">
              <span v-if="channelPackInfo.finishTime === null">-</span>
              <span
                v-if="channelPackInfo.finishTime !== null"
                v-formatter="{
                  data: channelPackInfo.finishTime,
                  formatter: 'YYYY/MM/DD HH:mm:ss',
                  type: 'date',
                }"
              />
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.appIcon')">
              <div v-if="channelPackInfo.appIcon !== ''" class="preview">
                <el-image
                  :src="imageDir + channelPackInfo.appIcon"
                  fit="contain"
                />
              </div>
              <div v-else>
                {{ $t('fields.unchanged') }}
              </div>
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.packDownloadUrl')">
              <el-link
                :underline="false"
                :href="channelPackInfo.downloadUrl"
                type="primary"
                id="download-url"
              >
                {{ channelPackInfo.downloadUrl }}
              </el-link>
              <qrcode-vue
                id="qrcode"
                :value="channelPackInfo.downloadUrl"
                margin="2"
              />
              <qrcode-vue
                id="hiddenQrCode"
                :value="channelPackInfo.hiddenDownloadUrl"
                style="display: none;"
                margin="2"
              />
              <div class="btn-group">
                <!-- <el-dropdown trigger="click"> -->
                <el-button
                  type="primary"
                  @click="copy(channelPackInfo.downloadUrl)"
                >
                  <span>{{ $t('fields.copy') }}</span>
                  <!-- <el-icon class="el-icon--right">
                    <arrow-down-bold />
                  </el-icon> -->
                </el-button>
                <!-- <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleLinkSelection('WX')">
                        {{ $t('referralLink.affiliateWXShortLink') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleLinkSelection('QQ')">
                        {{ $t('referralLink.affiliateQQShortLink') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="copy(channelPackInfo.downloadUrl)"
                      >
                        {{ $t('referralLink.affiliateLongLink') }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown> -->

                <!-- <el-dropdown trigger="click"> -->
                <el-button
                  type="primary"
                  @click="download()"
                >
                  <span>{{ $t('fields.download') }}</span>
                  <!-- <el-icon class="el-icon--right">
                      <arrow-down-bold />
                    </el-icon> -->
                </el-button>
                <!-- <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleQrSelection('WX')">
                        {{ $t('referralLink.affiliateWXQRLink') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleQrSelection('QQ')">
                        {{ $t('referralLink.affiliateQQQRLink') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click="download()">
                        {{ $t('referralLink.affiliateLongQRLink') }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown> -->
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, defineExpose } from 'vue'
import { useStore } from '@/store'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import {
  loadChannelPackHistory,
  cancelChannelPack,
} from '../../../../api/channel-pack'
import { ElMessage } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
// import { ArrowDownBold } from '@element-plus/icons-vue'
import { getConfigs } from '../../../../api/system-config'
// import { getShortLink } from '../../../../api/affiliate-short-link'
// import { generateRandomAlphaNumeric } from '@/utils/utils'
import emptyComp from '@/components/empty'

defineExpose({
  loadHistory,
})

const store = useStore()
const { t } = useI18n()
const showDialog = ref(false)
const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'months')
          .startOf('month')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'months')
          .endOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

const statusList = [
  { type: 'IN_QUEUE', display: t('packStatus.IN_QUEUE') },
  { type: 'IN_PROGRESS', display: t('packStatus.IN_PROGRESS') },
  { type: 'SUCCESS', display: t('packStatus.SUCCESS') },
  { type: 'FAIL', display: t('packStatus.FAIL') },
  { type: 'CANCEL', display: t('packStatus.CANCEL') },
]

const imageDir = process.env.VUE_APP_IMAGE_CDN + '/'

const config = reactive({
  shortLinkPlatform: '',
})

const request = reactive({
  affId: store.state.user.id,
  status: null,
  finishTime: [],
  size: 20,
  current: 1,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

// const shortLinkRequest = reactive({
//   siteId: null,
//   affiliateId: null,
//   linkType: 'H5',
//   urlType: null,
//   longUrl: null,
//   shortUrl: null,
// })

const channelPackInfo = reactive({
  channelValue: '',
  affiliateId: '',
  appName: '',
  osType: '',
  version: '',
  size: '',
  downloadCount: '',
  finishTime: '',
  appIcon: '',
  downloadUrl: '',
  downloadQr: '',
  hiddenDownloadUrl: '',
})

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

function resetQuery() {
  request.status = null
  request.finishTime = []
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadHistory()
  }
}

async function loadHistory() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.finishTime !== null) {
    if (request.finishTime.length === 2) {
      query.finishTime = request.finishTime.join(',')
    }
  } else {
    query.finishTime = null
  }
  const { data: ret } = await loadChannelPackHistory(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function cancelPack(id) {
  await cancelChannelPack(id)
  ElMessage({ message: t('message.channelPackCancelSuccess'), type: 'success' })
  loadHistory()
}

function viewDetail(item) {
  Object.entries(channelPackInfo).forEach(([key]) => {
    channelPackInfo[key] = ''
  })
  showDialog.value = true
  Object.entries(item).forEach(([key, value]) => {
    if (value || value === 0) {
      channelPackInfo[key] = value
    }
  })
}

function copy(text) {
  navigator.clipboard.writeText(text)
  ElMessage({ message: t('message.referralLinkCopied'), type: 'success' })
}

function download() {
  const canvas = document.getElementById('qrcode').toDataURL('image/png')
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = function() {
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(xhr.response)
    a.download = `${t('fields.packDownloadUrl')}` + '.png'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  xhr.open('GET', canvas)
  xhr.send()
}

async function loadConfig() {
  const query = { siteId: store.state.user.siteId }
  const { data: ret } = await getConfigs(query)

  config.shortLinkPlatform = ret.find(
    obj => obj.code === 'affiliate_short_url_platform'
  ).value
}

// async function handleLinkSelection(urlType) {
//   shortLinkRequest.siteId = store.state.user.siteId
//   shortLinkRequest.affiliateId = store.state.user.id
//   shortLinkRequest.urlType = urlType
//   const randomGenerateAlphaNumeric = generateRandomAlphaNumeric()
//   shortLinkRequest.shortUrl = randomGenerateAlphaNumeric
//   shortLinkRequest.longUrl = channelPackInfo.downloadUrl

//   await getShortLink(shortLinkRequest)
//   copy(config.shortLinkPlatform + '/' + randomGenerateAlphaNumeric)
// }

// async function handleQrSelection(urlType) {
//   shortLinkRequest.siteId = store.state.user.siteId
//   shortLinkRequest.affiliateId = store.state.user.id
//   shortLinkRequest.urlType = urlType
//   const randomGenerateAlphaNumeric = generateRandomAlphaNumeric()
//   shortLinkRequest.shortUrl = randomGenerateAlphaNumeric
//   shortLinkRequest.longUrl = channelPackInfo.downloadUrl
//   channelPackInfo.hiddenDownloadUrl =
//     config.shortLinkPlatform + '/' + randomGenerateAlphaNumeric

//   await getShortLink(shortLinkRequest)

//   const canvas = document.getElementById('hiddenQrCode').toDataURL('image/png')
//   const xhr = new XMLHttpRequest()
//   xhr.responseType = 'blob'
//   xhr.onload = function() {
//     const a = document.createElement('a')
//     a.href = window.URL.createObjectURL(xhr.response)
//     a.download = `${t('fields.packDownloadUrl')}` + '.png'
//     a.style.display = 'none'
//     document.body.appendChild(a)
//     a.click()
//     a.remove()
//   }
//   xhr.open('GET', canvas)
//   xhr.send()
// }

onMounted(() => {
  loadHistory()
  loadConfig()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.inputs-wrap {
  margin: 0px 20px;
  display: flex;
  align-items: baseline;
  gap: 10px;
  .input-small {
    width: 100%;
    max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      height: 40px;
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
  .el-row .el-col {
    display: flex;
  }
}

.data-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;

  .image-container {
    width: 70%;
  }

  .content-container {
    width: 30%;
    .el-col {
      word-break: break-word;
      margin-bottom: 10px;
    }
  }
}

.preview .el-image {
  width: 100px;
  height: 100px;
}

.preview img{
  width: 100px;
  height: 100px;
}

.info-row-container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-form-item {
    flex: 1;
    margin-bottom: 0;
  }
}
.btn-group {
  width: 100%;
  display: flex;
  gap: 15px;
}

#download-url {
  line-height: 20px;
  vertical-align: baseline;
  width: 100%;
  justify-content: left;
  word-break: break-word;
}

@media (max-width: 768px) {
  .info-row-container {
    flex-direction: column;
    align-items: flex-start;
  }
  :deep(.dialog900 .el-dialog) {
    max-width: 900px;
    .el-form-item {
      flex-direction: unset;
      align-items: flex-start;
      flex-wrap: wrap;
      line-height: 40px;
      &__label {
        color: #7D8592;
      }
      &__content {
        flex: unset;
      }
    }
  }
  // .inputs-wrap {
  //   flex-direction: column;
  //   gap: 10px;
  //   .el-input--small {
  //     width: 100% !important;
  //     max-width: unset !important;
  //     margin: 0 !important;
  //     .el-button {
  //       margin: 0 !important;
  //     }
  //   }
  //   .input-small {
  //     max-width: unset;
  //     width: 100%;
  //     &.el-range-editor--small.el-input__inner {
  //       max-width: unset;
  //     }
  //   }
  // }
}
</style>
<style lang="scss">
  .dialog900 .el-dialog {
    max-width: 900px;
    .el-form-item {
      &__label {
        color: #7D8592;
      }
      &__content {
        flex: unset;
      }
    }
  }
</style>
