<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Referral Material') }}</span>
        </div>
      </template>
      <el-form @submit.prevent>
        <div class="inputs-wrap">
          <el-form-item :label="t('fields.imageTitle') + ' :'">
            <el-input v-model="request.imageTitle" />
          </el-form-item>
          <el-form-item :label="t('fields.uploadTime') + ' :'">
            <el-date-picker
              v-model="request.uploadTime"
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
              <el-option key="1" value="-1" :label="t('fields.all')">
                {{ t('fields.all') }}
              </el-option>
              <el-option key="2" value="1" :label="t('fields.yes')">
                {{ t('fields.yes') }}
              </el-option>
              <el-option key="3" value="0" :label="t('fields.no')">
                {{ t('fields.no') }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.imageType')">
            <el-select v-model="request.imageType">
              <el-option key="1" value="-1" :label="t('fields.all')">
                {{ t('fields.all') }}
              </el-option>
              <el-option key="2" value="1" :label="t('fields.yes')">
                {{ t('fields.yes') }}
              </el-option>
              <el-option key="3" value="0" :label="t('fields.no')">
                {{ t('fields.no') }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="loadAffiliateMembers()"
            size="mini"
          >
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="resetQuery()">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </el-form>
      <el-card v-if="!page.records">
        {{ t('fields.noData') }}
      </el-card>
      <el-card v-if="page.records">
        <div class="data-container">
          <div class="image-container">
            <el-image
              src="https://dummyimage.com/600x400/000/fff&text=test"
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
                TESTING ONLY
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                {{ t('fields.imageType') }}
              </el-col>
              <el-col :span="12">
                RANDOM
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                {{ t('fields.uploadTime') }}
              </el-col>
              <el-col :span="12">
                2023-11-20 20:27:41
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                {{ t('fields.imageSize') }}
              </el-col>
              <el-col :span="12">
                100 * 200
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                {{ t('fields.downloadTime') }}
              </el-col>
              <el-col :span="12">
                200
              </el-col>
            </el-row>
            <div>
              <el-button type="primary" style="margin-top: 20px; width:100%" @click="generateQR()">
                {{ t('fields.generateQR') }}
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
      <el-pagination
        v-if="page.records"
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
// import { useStore } from '@/store'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
// import { ElMessage } from 'element-plus'

// const store = useStore()
const { t } = useI18n()
const router = useRouter()

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
  regTime: null,
  recordTime: [],
  loginName: null,
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
  request.recordTime = []
  request.loginName = null
  request.realName = null
}

function loadAffiliateMembers() {
  // const { data: ret } = await loadMemberSummary(store.state.user.id, query)
  // page.pages = ret.pages
  // page.records = ret.records
  // page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateMembers()
  }
}

function generateQR() {
  router.push("/promotion/referral-material/poster")
}

onMounted(() => {
  loadAffiliateMembers()
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
