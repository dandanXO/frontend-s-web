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
            <el-select v-model="request.status" size="normal">
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
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="normal"
      highlight-current-row
    >
      <template #empty>
        <emptyComp />
      </template>
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="50">
        <template #default="scope">
          {{ (request.current - 1) * 10 + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="appType" :label="t('fields.packType')" />
      <el-table-column prop="osType" :label="t('fields.osType')" />
      <el-table-column prop="appName" :label="t('fields.appName')" />
      <el-table-column prop="appIcon" :label="t('fields.appIcon')">
        <template #default="scope">
          <div class="preview">
            <el-image :src="imageDir + scope.row.appIcon" fit="contain" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.buildStatus')">
        <template #default="scope">
          {{ filterStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="downloadCount" :label="t('fields.download')" />
      <el-table-column prop="finishTime" :label="t('fields.packDate')">
        <template #default="scope">
          <span v-if="scope.row.finishTime === null">-</span>
          <span
            v-if="scope.row.finishTime !== null"
            v-formatter="{
              data: scope.row.finishTime,
              formatter: 'YYYY/MM/DD HH:mm:ss',
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column type="title" :label="t('fields.operate')">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'SUCCESS'"
            icon="el-icon-view"
            size="normal"
            type="success"
            @click="viewDetail(scope.row)"
          >
            {{ $t('fields.detail') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'IN_QUEUE'"
            icon="el-icon-remove"
            size="normal"
            type="danger"
            @click="cancelPack(scope.row.id)"
          >
            {{ $t('fields.cancel') }}
          </el-button>
          <span v-if="scope.row.status === 'CANCEL'">
            -
          </span>
        </template>
      </el-table-column>
    </el-table>
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
  <el-dialog :title="t('fields.detail')" v-model="showDialog" width="800px">
    <div class="scrollable-container">
      <div class="info-container">
        <el-form label-suffix=" : " label-width="110px">
          <div class="info-row-container">
            <el-form-item :label="t('fields.packType')">
              {{ channelPackInfo.appType }}
            </el-form-item>
            <el-form-item :label="t('fields.buildStatus')">
              {{ filterStatus(channelPackInfo.status) }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.appName')">
              {{ channelPackInfo.appName }}
            </el-form-item>
            <el-form-item :label="t('fields.osType')">
              {{ channelPackInfo.osType }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.appVersion')">
              {{ channelPackInfo.version }}
            </el-form-item>
            <el-form-item :label="t('fields.packSize')">
              {{ channelPackInfo.size }}
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
              <div class="preview">
                <el-image
                  :src="imageDir + channelPackInfo.appIcon"
                  fit="contain"
                />
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
                  style="width:200px"
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
                  style="width:200px"
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
  { type: 'IN_QUEUE', display: t('packStatus.inQueue') },
  { type: 'IN_PROGRESS', display: t('packStatus.inProgress') },
  { type: 'SUCCESS', display: t('packStatus.success') },
  { type: 'FAIL', display: t('packStatus.fail') },
  { type: 'CANCEL', display: t('packStatus.cancel') },
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
  size: '100M',
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

function filterStatus(status) {
  return statusList
    .filter(function(obj) {
      return obj.type === status
    })
    .map(function(obj) {
      return obj.display
    })[0]
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
}

@media (max-width: 768px) {
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
