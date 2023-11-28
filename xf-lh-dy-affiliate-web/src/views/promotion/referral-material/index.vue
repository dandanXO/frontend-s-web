<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Referral Material') }}</span>
        </div>
      </template>
      <el-form @submit.prevent>
        <div class="inputs-wrap">
          <el-form-item :label="t('fields.imageTitle') + ' :'">
            <el-input v-model="request.name" />
          </el-form-item>
          <el-form-item :label="t('fields.uploadTime') + ' :'">
            <el-date-picker
              v-model="request.updateTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="small"
              class="input-small"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
        </div>
        <div class="inputs-wrap">
          <el-form-item :label="t('fields.imageSize')">
            <el-select v-model="request.imageSize">
              <el-option :label="t('fields.all')" key="0" value="" />
              <el-option
                v-for="size in sizeList"
                :key="size"
                :label="size"
                :value="size"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.imageType')">
            <el-select v-model="request.posterType">
              <el-option :label="t('fields.all')" key="0" value="" />
              <el-option
                v-for="poster in posterType"
                :key="poster.name"
                :label="poster.display"
                :value="poster.name"
              />
            </el-select>
          </el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="loadPosterList()"
            size="mini"
          >
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="resetQuery()">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </el-form>
      <el-card v-if="page.records.length === 0" style="text-align: center">
        {{ t('fields.noData') }}
      </el-card>
      <div v-if="page.records.length !== 0">
        <el-card
          v-for="(item, index) in page.records"
          :key="item.id"
          style="margin-bottom: 10px"
        >
          <div class="data-container">
            <div class="image-container">
              <el-image
                :src="posterDir + item.path"
                fit="contain"
                style="height: 300px"
              />
            </div>
            <div class="content-container">
              <el-row>
                <el-col :span="12">
                  {{ t('fields.imageTitle') }}
                </el-col>
                <el-col :span="12">
                  {{ item.name }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  {{ t('fields.imageType') }}
                </el-col>
                <el-col :span="12">
                  {{
                    posterType
                      .filter(e => e.name === item.category)
                      .map(o => o.display)[0]
                  }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  {{ t('fields.uploadTime') }}
                </el-col>
                <el-col :span="12">
                  {{ item.updateTime }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  {{ t('fields.imageSize') }}
                </el-col>
                <el-col :span="12">
                  {{ item.size }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  {{ t('fields.downloadTime') }}
                </el-col>
                <el-col :span="12">
                  {{ item.downloadNumber }}
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="downloadImage(item, index)"
                  >
                    <el-icon class="el-icon--right"><download /></el-icon>
                    {{ $t('fields.download') }}
                  </el-link>
                </el-col>
              </el-row>
              <div>
                <el-button
                  type="primary"
                  style="margin-top: 20px; width:100%"
                  @click="generateQR(item.id)"
                >
                  {{ t('fields.generateQR') }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
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
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useStore } from '@/store'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  loadSize,
  loadPoster,
  increaseDownloadCount,
} from '../../../api/poster'
import { Download } from '@element-plus/icons-vue'
// import { ElMessage } from 'element-plus'

const store = useStore()
const { t } = useI18n()
const router = useRouter()
let sizeList = []
const posterDir = process.env.VUE_APP_IMAGE_CDN + '/poster/'
const posterType = [
  { name: 'OVERALL', display: t('posterType.overall') },
  { name: 'APP', display: t('posterType.app') },
  { name: 'SPONSOR', display: t('posterType.sponsor') },
  { name: 'GIFT', display: t('posterType.gift') },
  { name: 'COMPETITION', display: t('posterType.competition') },
  { name: 'EVENT', display: t('posterType.event') },
  { name: 'CRYPTO', display: t('posterType.crypto') },
  { name: 'AFFILIATE', display: t('posterType.affiliate') },
]
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

const request = reactive({
  siteId: store.state.user.siteId,
  name: null,
  updateTime: [],
  imageSize: '',
  posterType: '',
  size: 20,
  current: 1,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

function resetQuery() {
  request.regTime = null
  request.updateTime = []
  request.loginName = null
  request.realName = null
}

async function loadPosterList() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.updateTime !== null) {
    if (request.updateTime.length === 2) {
      query.updateTime = request.updateTime.join(',')
    }
  }
  const { data: ret } = await loadPoster(query)
  page.records = ret.records
  page.pages = ret.pages
  page.loading = false
}

async function loadSizeList() {
  const { data: ret } = await loadSize(request.siteId)
  sizeList = ret
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadPoster()
  }
}

function generateQR(id) {
  router.push({
    path: '/promotion/referral-material/poster',
    query: { id: id },
  })
}

async function downloadImage(item, index) {
  page.records[index].downloadNumber += 1
  await increaseDownloadCount(item.id)
  const image = await loadImage(item)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  canvas.getContext('2d').drawImage(image, 0, 0)
  const dataURL = canvas.toDataURL('image/jpg')
  const a = document.createElement('a')
  a.href = dataURL
  a.download = item.name
  a.click()
}

async function loadImage(item) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = posterDir + item.path
    // image.src =
    //   'https://file.rd7etvkrgt.com/promo/c9974e9e-7aaf-4afc-b2b4-a55c7bbdbedd.jpg'
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      resolve(image)
    }
    image.onerror = error => {
      reject(error)
    }
  })
}

onMounted(() => {
  loadPosterList()
  loadSizeList()
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

@media (max-width: 768px) {
  .inputs-wrap {
    flex-direction: column;
    gap: 10px;
    .el-input--small {
      width: 100% !important;
      max-width: unset !important;
      margin: 0 !important;
      .el-button {
        margin: 0 !important;
      }
    }
    .input-small {
      max-width: unset;
      width: 100%;
      &.el-range-editor--small.el-input__inner {
        max-width: unset;
      }
    }
  }
}
</style>
