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

        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px;margin-left:5px"
          :placeholder="t('fields.name')"
        />

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
          @click="loadPrivilegeReport(false)"
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
      </div>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      :expand-row-keys="expandrowkey"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      @expand-change="loadDaily"
      :empty-text="t('fields.noData')"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column type="expand">
        <template #default="scope">
          <!-- v-slot:[slotname]="data"> -->
          <el-table
            :data="scope.row.ruleItemData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column prop="date" :label="t('fields.date')" />
            <el-table-column
              prop="totalAmount"
              :label="t('fields.dailyTotalAmount')"
            >
              <template #default="scope1">
                $
                <span
                  v-formatter="{
                    data: scope1.row.totalAmount,
                    type: 'money',
                  }"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="totalCount"
              :label="t('fields.dailyTotalRedeem')"
            />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" v-if="false" prod="id" />
      <el-table-column
        prop="name"
        :label="t('fields.privilegeName')"
        width="400"
      />
      <el-table-column prop="site" :label="t('fields.siteName')" width="200" />
      <el-table-column
        prop="totalAmount"
        :label="t('fields.totalPrivilegeAmount')"
        width="200"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.totalAmount,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalCount"
        :label="t('fields.totalRedeem')"
        width="120"
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  getPrivilegeReport,
  getDailyReport,
  getTotalPrivilegeAmount,
} from '../../../api/report-privilege'
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
const siteList = reactive({
  list: [],
})

var expandrowkey = []

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  totalAmount: 0,
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
})

const shortcuts = getShortcuts(t)
async function loadDaily(row, expandedRows) {
  // 该处是用于判断是展开还是收起行，只有展开的时候做请求，避免多次请求！
  // 展开的时候expandedRows有值，收起的时候为空.
  console.log(row)
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

    dailyquery.id = row.privilegeId
    dailyquery.siteId = row.siteId

    const { data: ret } = await getDailyReport(dailyquery)
    page.records.forEach((temp, index) => {
      // 找到当前点击的行，把动态获取到的数据赋值进去
      if (temp.id === row.id) {
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
}

async function loadPrivilegeReport(first) {
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

  const { data: ret } = await getPrivilegeReport(query)

  if (first === true) {
    // 给每行数据强制追加一个数据项, 以便注入每日数据
    ret.records.map(item => {
      item.ruleItemData = []
    })
  }
  expandrowkey = [] // 收起所有展开项
  page.pages = ret.pages
  page.records = ret.records
  if (page.records.length !== 0) {
    const { data: amount } = await getTotalPrivilegeAmount(query)
    page.totalAmount = amount
  } else {
    page.totalAmount = 0
  }
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadPrivilegeReport(false)
}

function getSummaries(param) {
  if (hasPermission(['sys:report:privilege:report:summary'])) {
    const { columns } = param
    var sums = []

    columns.forEach((column, index) => {
      if (index === 1) {
        sums[index] = sums[index] =
          t('fields.totalPrivilegeClaimAmount') +
          '   $' +
          page.totalAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      }
    })

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
  await loadPrivilegeReport(true)
})
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
