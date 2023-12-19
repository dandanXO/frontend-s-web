<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.selectedDateType"
          size="small"
          :placeholder="t('fields.dateType')"
          class="filter-item"
          style="width: 180px"
          @change="updateDateType"
        >
          <el-option
            v-for="item in uiControl.selectedDateType"
            :key="item.key"
            :label="t('dateType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-if="request.selectedDateType === 0"
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 250px; margin-left: 5px;"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-date-picker
          v-else
          v-model="request.regTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 250px; margin-left: 5px;"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.memberName')"
        />
        <el-input
          v-model="request.affiliateName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.affiliateName')"
        />
        <el-select
          v-model="request.isDeposit"
          size="small"
          :placeholder="t('fields.isDeposit')"
          class="filter-item"
          style="width: 140px; margin-left: 5px"
        >
          <el-option
            v-for="item in deposit.isDeposit"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
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
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSiteMemberReport()"
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
          v-permission="['sys:report:site:member:report:export']"
          @click="requestExportExcel"
          style="float: right;"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
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
      height="450"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column
        prop="loginName"
        :label="t('fields.loginName')"
        width="200"
      />
      <el-table-column
        prop="regTime"
        :label="t('fields.registerTime')"
        width="200"
      />
      <el-table-column prop="balance" :label="t('fields.balance')" width="200">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.balance,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="depositCount"
        :label="t('fields.depositCount')"
        width="200"
      />
      <el-table-column
        prop="depositAmount"
        :label="t('fields.depositAmount')"
        width="200"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.depositAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawCount"
        :label="t('fields.withdrawCount')"
        width="200"
      />
      <el-table-column
        prop="withdrawAmount"
        :label="t('fields.withdrawAmount')"
        width="200"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.withdrawAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="validBet"
        :label="t('fields.validBet')"
        width="200"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.validBet,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="adjust" :label="t('fields.adjust')" width="200">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.adjust,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="bonus" :label="t('fields.bonus')" width="200">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.bonus,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="profit" :label="t('fields.profit')" width="200">
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
      <el-table-column
        prop="affiliate"
        :label="t('fields.affiliate')"
        width="200"
      />
      <el-table-column prop="way" :label="t('fields.way')" width="200" />
      <el-table-column prop="vip" :label="t('fields.vipLevel')" width="200" />
      <el-table-column
        prop="firstDeposit"
        :label="t('fields.ftdAmount')"
        width="200"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.firstDeposit,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        :label="t('fields.lastLoginTime')"
        width="200"
      />
      <el-table-column
        prop="lastLoginIp"
        :label="t('fields.lastLoginIp')"
        width="200"
      />
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
import {
  getSiteMemberReport,
  getTotalSiteMemberReport,
  getSiteMemberReportExport,
} from '../../../api/report-centre'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
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
  selectedDateType: [
    { key: 0, displayName: 'recordTime', value: 0 },
    { key: 1, displayName: 'regTime', value: 1 },
  ],
});

const siteList = reactive({
  list: [],
})

const deposit = reactive({
  isDeposit: [{ id: 1, name: t('fields.showAll') }, { id: 2, name: t('fields.onlyDeposit') }],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const totalPage = reactive({
  records: [],
  loading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  isDeposit: 1,
  loginName: null,
  affiliateName: null,
  selectedDateType: uiControl.selectedDateType[0].value,
  recordTime: [defaultStartDate, defaultEndDate],
  regTime: []

})

function resetQuery() {
  request.selectedDateType = uiControl.selectedDateType[0].value
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.regTime = []
  request.siteId = site.value ? site.value.id : 1
  request.loginName = null
  request.affiliateName = null
  request.isDeposit = 1
}

function changePage(page) {
  request.current = page
  loadSiteMemberReport()
}

function updateDateType() {
  if (request.selectedDateType === 0) {
    request.recordTime = [defaultStartDate, defaultEndDate]
    request.regTime = []
  } else {
    request.regTime = [defaultStartDate, defaultEndDate]
    request.recordTime = []
  }
}

async function loadSiteMemberReport() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getSiteMemberReport(query)
  const { data: ret1 } = await getTotalSiteMemberReport(query)
  totalPage.records = ret1.records
  page.records = ret.records
  page.pages = ret.pages
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

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

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(5, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
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
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime = request.regTime.join(',')
    }
  }
  return query;
}

async function requestExportExcel() {
  const query = checkQuery();
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getSiteMemberReportExport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

function getSummaries(param) {
  if (hasPermission(['sys:report:site:member:report:summary'])) {
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
          if (
            index !== 1 &&
            index !== 11 &&
            index !== 12 &&
            index !== 13 &&
            index !== 14 &&
            index !== 15 &&
            index !== 16 &&
            index !== 2
          ) {
            var prop = column.property
            if (index === 3 || index === 5) {
              sums[index] = totalPage.records[0][prop]
            } else {
              sums[index] =
                '$' +
                parseFloat(totalPage.records[0][prop]).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
            }
          }
        }
      })
    }
    console.log(sums)
    return sums
  } else {
    return '-'
  }
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
  await loadSiteMemberReport()
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
</style>
