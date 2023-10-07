<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="loadSearchPlatforms"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          filterable
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadReport(false)"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:report:game:export']"
          @click="requestExportExcel"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="gamePlatform"
      :expand-row-keys="expandrowkey"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      @expand-change="loadDaily"
      :empty-text="t('fields.noData')"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <!-- v-slot:[slotname]="data"> -->
          <el-table
            :data="scope.row.ruleItemData"
            border
            stripe
            style="width: 100%"
            size="small"
          >
            <el-table-column
              prop="recordTime"
              :label="t('fields.date')"
              width="120"
            />
            <el-table-column
              prop="gamePlatform"
              :label="t('reportGame.gamePlatform')"
              width="120"
            />
            <el-table-column
              prop="betMemberCount"
              :label="t('reportGame.gameMemberCount')"
            />
            <el-table-column
              prop="betCount"
              :label="t('reportGame.gameBetCount')"
            />
            <el-table-column prop="bet" :label="t('reportGame.gameBetAmount')">
              <template #default="scope1">
                $
                <span
                  v-formatter="{
                    data: scope1.row.bet,
                    type: 'money',
                  }"
                />
              </template>
            </el-table-column>
            <el-table-column prop="win" :label="t('reportGame.gameWinLoss')">
              <template #default="scope1">
                $
                <span
                  v-formatter="{
                    data: scope1.row.win,
                    type: 'money',
                  }"
                />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="siteName"
        :label="t('fields.siteName')"
        width="100"
      />
      <el-table-column
        prop="gamePlatform"
        :label="t('reportGame.gamePlatform')"
        width="120"
      />
      <el-table-column
        prop="totalBetMemberCount"
        :label="t('reportGame.gameMemberCountTotal')"
      />
      <el-table-column
        prop="totalBetCount"
        :label="t('reportGame.gameBetCountTotal')"
      />
      <el-table-column
        prop="totalBet"
        :label="t('reportGame.gameBetAmountTotal')"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{
              data: scope.row.totalBet,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalWin"
        :label="t('reportGame.gameWinLossTotal')"
      >
        <template #default="scope">
          $
          <span
            v-formatter="{
              data: scope.row.totalWin,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getPlatformsBySite } from '@/api/platform'
import {
  getPlatformGameReport,
  getDailyReport,
  getExportReport,
} from '@/api/report-platform-game'
import { hasPermission } from '../../../utils/util'

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const uiControl = reactive({
  messageVisible: false,
})

const siteList = reactive({
  list: [],
})

const platforms = reactive({
  list: [],
})

async function loadSearchPlatforms() {
  if (request.siteId !== null) {
    const { data: ret } = await getPlatformsBySite(request.siteId)
    platforms.list = ret
  } else {
    platforms.list = []
  }
}

var expandrowkey = []

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  platform: null,
})

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('day')
          .format('x')
      )
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
          .startOf('day')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .endOf('day')
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
  {
    text: t('fields.last3Months'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(2, 'months')
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.last6Months'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(5, 'months')
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

async function loadDaily(row, expandedRows) {
  // 该处是用于判断是展开还是收起行，只有展开的时候做请求，避免多次请求！
  // 展开的时候expandedRows有值，收起的时候为空.
  if (expandedRows.length > 0) {
    const dailyquery = {}
    const requestCopy = { ...request }
    Object.entries(requestCopy).forEach(([key, value]) => {
      if (value) {
        dailyquery[key] = value
      }
    })
    if (request.recordTime !== null) {
      if (request.recordTime.length === 2) {
        dailyquery.recordTime = request.recordTime.join(',')
      }
    }

    dailyquery.siteId = request.siteId
    dailyquery.platform = row.gamePlatform

    const { data: ret } = await getDailyReport(dailyquery)
    page.records.forEach((temp, index) => {
      // 找到当前点击的行，把动态获取到的数据赋值进去
      if (temp.gamePlatform === row.gamePlatform) {
        page.records[index].ruleItemData = ret.records
        console.log(page.records)
      }
    })
  }
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(5, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.name = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : null
  request.platform = null
  platforms.list = []
}

async function loadReport(first) {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }

  const { data: ret } = await getPlatformGameReport(query)

  if (first === true) {
    // 给每行数据强制追加一个数据项, 以便注入每日数据
    ret.records.map(item => {
      item.ruleItemData = []
    })
  }
  expandrowkey = [] // 收起所有展开项
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadReport(false)
}

onMounted(async () => {
  await loadSites()

  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = 1
  }
  await loadSearchPlatforms()
  await loadReport(true)
})

function getSummaries(param) {
  if (hasPermission(['sys:report:platform:game:report:summary'])) {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = t('dashboard.total')
      } else if (index === 1 || index === 2) {
        // Text Ignore
      } else {
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = 0
        }
        if (index === 5 || index === 6) {
          sums[index] =
            '$ ' +
            sums[index].toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        }
      }
    })

    return sums
  } else {
    return '-'
  }
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  return query
}

async function requestExportExcel() {
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getExportReport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-input-number:deep .el-input__inner {
  text-align: left;
}
</style>
