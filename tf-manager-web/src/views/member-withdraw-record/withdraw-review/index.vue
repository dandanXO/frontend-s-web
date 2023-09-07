<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 250px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />

        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.memberName')"
        />

        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="loadDetail"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.sort"
          size="small"
          :placeholder="t('fields.sorting')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in sortList.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="request.financialLevel"
          size="small"
          :placeholder="t('fields.financialLevel')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in financialLevelList.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <el-select
          v-model="request.vip"
          size="small"
          :placeholder="t('fields.vipLevel')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in vipList.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="header-container" style="margin-top: 10px;">
        <el-select
          v-model="request.profit"
          size="small"
          :placeholder="t('fields.profit')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in profitList.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="request.reviewStatus"
          size="small"
          :placeholder="t('fields.reviewstatus')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in reviewStatusList.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-input
          v-model="request.reviewby"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.reviewby')"
        />

        <el-input
          v-model="request.min"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.min')"
        />

        <el-input
          v-model="request.max"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.max')"
        />

        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberRecord()"
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
          v-permission="['sys:report:summary:review:export']"
          @click="requestExportExcel"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="totalwithdraw.records"
      ref="table"
      v-loading="page.loading"
      height="120"
      border
      :header-cell-style="{background: 'lightgray'}"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="deposit" :label="t('fields.totalDeposit')" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.deposit,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="depositCount"
        :label="t('fields.totalDepositCount')"
        width="120"
      />
      <el-table-column
        prop="withdraw"
        :label="t('fields.totalWithdraw')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.withdraw,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawCount"
        :label="t('fields.totalWithdrawCount')"
        width="130"
      />
      <el-table-column
        prop="totalBet"
        :label="t('fields.totalBet')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.totalBet,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPayout"
        :label="t('fields.totalPayout')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.totalPayout,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="transferIn"
        :label="t('fields.totalTransferIn')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.transferIn,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="transferOut"
        :label="t('fields.totalTransferOut')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.transferOut,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="promo" :label="t('fields.totalPromo')" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.promo,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="adjustment"
        :label="t('fields.totalAdjustment')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.adjustment,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column prop="profit" :label="t('fields.totalProfit')" width="120">
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
    </el-table>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      height="500"
      :header-cell-style="{background: 'lightgray'}"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="member"
        :label="t('fields.member')"
        align="center"
        min-width="100"
      >
        <template
          #default="scope"
          v-if="hasPermission(['sys:member:detail'])"
        >
          <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
            <el-link type="primary">{{ scope.row.member }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="source"
        :label="t('fields.sourceType')"
        width="120"
      />
      <el-table-column prop="deposit" :label="t('fields.deposit')" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.deposit,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="depositCount"
        :label="t('fields.depositCount')"
        width="120"
      />
      <el-table-column
        prop="withdraw"
        :label="t('fields.withdraw')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.withdraw,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawCount"
        :label="t('fields.withdrawCount')"
        width="130"
      />
      <el-table-column
        prop="companyProfit"
        :label="t('fields.companyProfit')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.companyProfit,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalBet"
        :label="t('fields.totalBet')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.totalBet,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPayout"
        :label="t('fields.totalPayout')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.totalPayout,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="transferIn"
        :label="t('fields.transferIn')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.transferIn,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="transferOut"
        :label="t('fields.transferOut')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.transferOut,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="promo" :label="t('fields.promo')" width="120">
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.promo,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="adjustment"
        :label="t('fields.adjustment')"
        width="120"
      >
        <template #default="scope1">
          $
          <span
            v-formatter="{
              data: scope1.row.adjustment,
              type: 'money',
            }"
          />
        </template>
      </el-table-column>

      <el-table-column prop="profit" :label="t('fields.profit')" width="120">
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
        prop="reviewby"
        :label="t('fields.reviewby')"
        width="120"
      />

      <el-table-column prop="remark" :label="t('fields.remark')" width="120" />

      <el-table-column
        prop="review"
        :label="t('fields.review')"
        width="120"
        fixed="right"
      >
        <template #default="scope1">
          <label v-if="scope1.row.review !== '未复核'">
            {{ scope1.row.review }}
          </label>

          <el-button
            v-if="scope1.row.review === '未复核'"
            size="mini"
            type="primary"
            @click="showDialog(scope1.row)"
          >
            {{ t('fields.review') }}
          </el-button>
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

    <el-dialog
      :title="t('fields.toreview')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-footer">
        <el-form
          ref="reviewForm"
          :model="form"
          :inline="true"
          size="small"
          label-width="150px"
        >
          <el-form-item :label="t('fields.review')" prop="review">
            <el-select
              v-model="form.review"
              class="filter-item"
              style="width: 120px; margin-left: 5px"
            >
              <el-option
                v-for="item in reviewList.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('fields.remark')" prop="remark">
            <el-input
              v-model="form.remark"
              style="width: 350px;"
              :rows="7"
              type="textarea"
            />
          </el-form-item>

          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="submit">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.Download Manager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { getMemberReport, addReview, getTotalWithdrawReview, getExportWithdrawalReviewReport } from '../../../api/report-summary'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { getVipList } from '../../../api/vip'
import { getFinancialLevels } from '../../../api/financial-level';
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDateToStart(startDate);
const defaultEndDate = convertDateToEnd(new Date());
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const siteList = reactive({
  list: [],
})
const vipList = reactive({
  list: [],
})
const financialLevelList = reactive({
  list: [],
})

const sortList = reactive({
  list: [
    { label: t('fields.byprofitasc'), value: '1' },
    { label: t('fields.byprofitdesc'), value: '2' },
    { label: t('fields.bydateasc'), value: '3' },
    { label: t('fields.bydatedesc'), value: '4' },
  ],
})

const reviewList = reactive({
  list: [
    { label: t('fields.reviewno'), value: '1' },
    { label: t('fields.reviewsuccess'), value: '2' },
    { label: t('fields.reviewfail'), value: '3' },
  ],
})

const reviewStatusList = reactive({
  list: [
    { label: t('fields.allreviewstatus'), value: '1' },
    { label: t('fields.reviewno'), value: '未复核' },
    { label: t('fields.reviewsuccess'), value: '正确' },
    { label: t('fields.reviewfail'), value: '错误' },
  ],
})

const profitList = reactive({
  list: [
    { label: t('fields.allprofit'), value: '1' },
    { label: t('fields.profitpositive'), value: '2' },
    { label: t('fields.profitnegative'), value: '3' },
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const totalwithdraw = reactive({
  pages: 0,
  records: [],
})
const reviewForm = ref(null)
const form = reactive({
  id: null,
  review: null,
  remark: null,
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  sort: null,
  vip: null,
  financialLevel: null,
  profit: null,
  reviewStatus: null,
  min: null,
  max: null,
  reviewby: null,
})

const uiControl = reactive({
  messageVisible: false,
  dialogVisible: false,
  dialogTitle: '',
})

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);
function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function submit() {
  reviewForm.value.validate(async valid => {
    if (valid) {
      await addReview(form)
      uiControl.dialogVisible = false
      await loadMemberRecord()
    }
  })
}

function resetQuery() {
  request.name = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : null
  request.sort = sortList.list[0].value

  request.vip = vipList.list[0].id
  request.financialLevel = financialLevelList.list[0].id
  request.profit = profitList.list[0].value
  request.reviewStatus = reviewStatusList.list[0].value
  request.min = ''
  request.max = ''
  request.reviewby = ''
}

async function loadMemberRecord() {
  if (request.max !== null && request.min === null) {
    alert(t('fields.minno'))
  } else if (request.max === null && request.min !== null) {
    alert(t('fields.maxno'))
  } else {
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

    const { data: ret } = await getMemberReport(query)
    page.pages = ret.pages
    page.records = ret.records

    const { data: ret1 } = await getTotalWithdrawReview(query)
    totalwithdraw.records = ret1

    page.loading = false
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function loadVipList() {
  var ret = []
  ret.push({ id: '1', name: t('fields.allvip') })
  const { data: vList } = await getVipList({ siteId: request.siteId })
  vList.forEach((item, index) => {
    ret.push(item)
  })
  vipList.list = ret
  request.vip = vipList.list[0].id
}

async function loadFinancialLevelList() {
  var ret = []
  ret.push({ id: '1', name: t('fields.allfinanciallevel') })
  const { data: fList } = await getFinancialLevels({ siteId: request.siteId })
  fList.forEach((item, index) => {
    ret.push(item)
  })
  financialLevelList.list = ret
  request.financialLevel = financialLevelList.list[0].id
}

function changePage(page) {
  request.current = page
  loadMemberRecord()
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
  request.sort = sortList.list[0].value
  request.profit = profitList.list[0].value
  request.reviewStatus = reviewStatusList.list[0].value
  loadVipList()
  loadFinancialLevelList()
  await loadMemberRecord()
})

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
  const { data: ret } = await getExportWithdrawalReviewReport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

// function getSummaries(param) {
//   if (hasPermission(['sys:report:summary:total'])) {
//     const { columns, data } = param
//     var sums = []
//     columns.forEach((column, index) => {
//       if (index === 0) {
//         sums[index] = 'Total'
//         return
//       }
//       const values = data.map(item => Number(item[column.property]))

//       if (
//         !values.every(value => Number.isNaN(value)) &&
//         index !== 3 &&
//         index !== 5 &&
//         index !== 13 &&
//         index !== 14 &&
//         index !== 15
//       ) {
//         sums[index] = `$ ${values
//           .reduce((prev, curr) => {
//             const value = Number(curr)
//             if (!Number.isNaN(value)) {
//               return prev + curr
//             } else {
//               return prev
//             }
//           }, 0)
//           .toFixed(2)}`
//       } else if (
//         !values.every(value => Number.isNaN(value)) &&
//         (index === 3 || index === 5)
//       ) {
//         sums[index] = `${values.reduce((prev, curr) => {
//           const value = Number(curr)
//           if (!Number.isNaN(value)) {
//             return prev + curr
//           } else {
//             return prev
//           }
//         }, 0)}`
//       }
//     })

//     return sums
//   } else {
//     return '-'
//   }
// }

async function loadDetail() {
  loadVipList()
  loadFinancialLevelList()
}

async function showDialog(record) {
  if (hasPermission(['sys:report:summary:review'])) {
    if (record.review === '未复核') {
      form.review = '1'
    } else if (record.review === '') {
      form.review = '2'
    } else {
      form.review = '3'
    }
    form.id = record.id

    uiControl.dialogVisible = true
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
