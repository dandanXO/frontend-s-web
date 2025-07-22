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
          style="width: 250px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />

        <!-- <el-select
            v-model="request.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 120px; margin-left: 5px"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select> -->
        <el-input
          v-model="request.gameName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.gameName')"
        />
        <!-- <el-form-item :label="t('fields.vipLevel')" prop="vipId">
            <el-select
              v-model="request.vipId"
              size="small"
              :placeholder="t('message.selectSiteFirst')"
              class="filter-item"
              style="width: 300px;"
              default-first-option
            >
              <el-option
                v-for="item in vipList.list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          :loading="page.loading"
          @click="loadVipReport()"
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
        <!-- <el-button
            size="mini"
            type="primary"
            v-permission="['sys:report:vip:report:export']"
            @click="requestExportExcel"
          >{{ t('fields.requestExportToExcel') }}
          </el-button> -->
      </div>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
      style="margin-top:20px;"
      :row-style="{width: '100px'}"
      height="450"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column prop="vipName" :label="t('fields.vipLevel')" />
      <el-table-column prop="gameName" :label="t('fields.gameName')">
        <template #default="scope">
          <span v-if="scope.row.gameName === null">-</span>
          <span v-if="scope.row.gameName !== null">
            {{ scope.row.gameName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="platform" :label="t('fields.platform')" />

      <el-table-column prop="bet" :label="t('fields.bet')">
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

      <el-table-column prop="betCount" :label="t('fields.summaryTotalBet')" />
      <el-table-column prop="payout" :label="t('fields.payout')">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.payout,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column prop="profit" :label="t('fields.profit')">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.profit,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column prop="ratio" :label="t('fields.return_ratio')">
        <template #default="scope">
          <span v-if="scope.row.ratio === null">0 %</span>
          <span v-if="scope.row.ratio !== null">
            {{ scope.row.ratio.toFixed(2) }} %
          </span>
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

    <div class="total-info-wrapper">
      <span>{{ t('fields.totalDepositAmount') }} :</span>
      <span style="margin-left: 10px">$</span>
      <span v-formatter="{data: totalBet, type: 'money'}" />

      <span style="margin-left: 10px">
        {{ t('fields.totalBetMemberCount') }} :
      </span>
      <span style="margin-left: 10px">{{ totalBetCount }}</span>

      <span style="margin-left: 10px">{{ t('fields.payoutTotal') }} :</span>
      <span style="margin-left: 10px">$</span>
      <span v-formatter="{data: totalPayout, type: 'money'}" />

      <span style="margin-left: 10px">{{ t('fields.profit') }} :</span>
      <span style="margin-left: 10px">$</span>
      <span v-formatter="{data: totalProfit, type: 'money'}" />

      <span style="margin-left: 10px">
        {{ t('fields.return_ratio_total') }} :
      </span>
      {{ page.records.length > 0 ? totalRatio.toFixed(2) + '%' : '--' }}
    </div>

    <el-dialog
      :title="t('fields.exportToExcel')"
      v-model="uiControl.messageVisible"
      append-to-body
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
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
import {
  // getTotalFinanceReport,
  // getFinanceReportExport,
  getVipReport,
} from '../../../api/report-centre'
import { getVipList } from '../../../api/vip'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { hasPermission } from '../../../utils/util'

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const totalBet = ref(0)
const totalPayout = ref(0)
const totalBetCount = ref(0)
const totalProfit = ref(0)

const uiControl = reactive({
  messageVisible: false,
})

const siteList = reactive({
  list: [],
})

const vipList = reactive({
  list: [],
})

const page = reactive({
  records: [],
  columns: [],
  loading: false,
})

const totalPage = reactive({
  records: [],
  columns: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  vipId: null,
  gameName: null,
})

const totalRatio = computed(() => {
  if (page.loading) {
    return 0
  } else {
    return (totalPayout.value / totalBet.value).toFixed(5) * 100
  }
})

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = store.state.user.siteId
  request.vipId = null
  request.gameName = null
}

async function loadVipReport() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  totalBet.value = 0
  totalPayout.value = 0
  totalBetCount.value = 0
  totalProfit.value = 0

  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
    query.random = Math.random()
  }
  const { data: ret } = await getVipReport(query)
  page.records = ret.records
  // page.columns = ret.data

  page.records = page.records.map(record => {
    totalBet.value += record.bet
    totalPayout.value += record.payout
    totalBetCount.value += record.betCount
    totalProfit.value += record.profit

    return {
      ...record,
      ratio: (record.payout / record.bet).toFixed(5) * 100,
    }
  })

  // const { data: ret1 } = await getTotalFinanceReport(query)
  // totalPage.records = ret1.financeReportItemVOS
  // totalPage.columns = ret1.financeReportColumnVOS
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const shortcuts = getShortcuts(t)
function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(5, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

// function checkQuery() {
//   const requestCopy = { ...request }
//   const query = {}
//   Object.entries(requestCopy).forEach(([key, value]) => {
//     if (value) {
//       query[key] = value
//     }
//   })
//   if (request.recordTime !== null) {
//     if (request.recordTime.length === 2) {
//       query.recordTime = request.recordTime.join(',')
//     }
//   }
//   return query
// }

// async function requestExportExcel() {
//   const query = checkQuery();
//   query.requestBy = store.state.user.name;
//   query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
//   const { data: ret } = await getFinanceReportExport(query);
//   if (ret) {
//     uiControl.messageVisible = true;
//   }
// }

function getSummaries(param) {
  if (hasPermission(['sys:report:vip:report:summary'])) {
    const { columns } = param
    var sums = []
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

    if (totalPage.records.length > 0) {
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = t('fields.total')
        } else {
          var prop = column.property
          sums[index] =
            '$' +
            parseFloat(
              totalPage.records[0].data[prop.replace('data.', '')]
            ).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        }
      })
    }
    console.log(sums)
    return sums
  } else {
    return '-'
  }
}
async function loadVips() {
  const { data: vip } = await getVipList()
  vipList.list = vip
}

onMounted(async () => {
  await loadSites()

  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadVips()
  await loadVipReport()
})
</script>

<style>
.el-table .cell {
  word-break: break-word;
  text-overflow: none;
}
.warning-row {
  color: #ff0000;
}
.total-info-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
