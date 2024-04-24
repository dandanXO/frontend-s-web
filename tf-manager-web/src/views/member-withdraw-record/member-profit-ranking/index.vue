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
          v-model="request.riskLevel"
          size="small"
          :placeholder="t('fields.riskLevel')"
          class="filter-item"
          style="width: 130px; margin-left: 5px"
        >
          <el-option
            v-for="item in riskList.list"
            :key="item.id"
            :label="item.levelName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 130px; margin-left: 5px"
        >
          <el-option
            v-for="s in uiControl.memberState"
            :key="s.key"
            :label="s.displayName"
            :value="s.key"
          />
        </el-select>
        <el-select
          v-model="request.sort"
          size="small"
          :placeholder="t('fields.sorting')"
          class="filter-item"
          style="width: 130px; margin-left: 5px"
        >
          <el-option
            v-for="item in sortList.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberRecord()"
          :disabled="page.loading"
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
      size="small"
      highlight-current-row
      v-loading="page.loading"
      height="calc(100vh - 180px)"
      :header-cell-style="{background: 'lightgray'}"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="member"
        :label="t('fields.member')"
        align="center"
        min-width="120"
      >
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            :to="`/member/details/${scope.row.siteMemberId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.member }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="depositCount"
        :label="t('fields.depositCount')"
        width="120"
      />
      <el-table-column prop="deposit" :label="t('fields.deposit')" width="140">
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
        prop="withdrawCount"
        :label="t('fields.withdrawCount')"
        width="130"
      />
      <el-table-column
        prop="withdraw"
        :label="t('fields.withdraw')"
        width="140"
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
        prop="companyProfit"
        :label="t('fields.companyProfit')"
        width="140"
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
        prop="financialLevel"
        :label="t('fields.financialLevel')"
        width="150"
      />
      <el-table-column
        prop="riskLevel"
        :label="t('fields.riskLevel')"
        width="150"
      />
      <el-table-column prop="status" :label="t('fields.status')" width="150">
        <template #default="scope">
          <el-tag
            v-if="scope.row.status === 'NORMAL'"
            type="success"
            size="mini"
          >
            {{ scope.row.status }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'FROZEN'"
            type="danger"
            size="mini"
          >
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === null" type="info" size="mini">
            -
          </el-tag>
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
import { getMemberProfitRanking } from '../../../api/report-summary'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { getFinancialLevels } from '../../../api/financial-level'
import { selectList } from "../../../api/risk-level"
import {
  convertDateToEnd,
  convertDateToStart,
  getShortcuts,
} from '@/utils/datetime'
import { formatInputTimeZone } from "@/utils/format-timeZone"
const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDateToStart(startDate)
const defaultEndDate = convertDateToEnd(new Date())
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const siteList = reactive({
  list: [],
})
const financialLevelList = reactive({
  list: [],
})
const riskList = reactive({
  list: []
});
let timeZone = null;

const sortList = reactive({
  list: [
    { label: t('fields.byprofitasc'), value: '1' },
    { label: t('fields.byprofitdesc'), value: '2' },
    { label: t('fields.bydateasc'), value: '3' },
    { label: t('fields.bydatedesc'), value: '4' },
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 100,
  current: 1,
  name: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
  sort: null,
  financialLevel: null,
  profit: null,
  reviewStatus: null,
  min: null,
  max: null,
  reviewby: null,
  riskLevel: null,
  status: 1
})

const uiControl = reactive({
  messageVisible: false,
  dialogVisible: false,
  dialogTitle: '',
  memberState: [
    { key: 1, displayName: t('fields.allmembertype'), value: 1 },
    { key: 'NORMAL', displayName: t('status.member.NORMAL'), value: 'NORMAL' },
    { key: 'FROZEN', displayName: t('status.member.FROZEN'), value: 'FROZEN' },
  ],
})

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]
const shortcuts = getShortcuts(t)
function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.name = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : null
  request.sort = sortList.list[0].value
  request.financialLevel = financialLevelList.list[0].id
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

    timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
    if (request.recordTime !== null) {
      if (request.recordTime.length === 2) {
        query.recordTime = JSON.parse(JSON.stringify(request.recordTime));
        query.recordTime[0] = formatInputTimeZone(query.recordTime[0], timeZone);
        query.recordTime[1] = formatInputTimeZone(query.recordTime[1], timeZone);
        query.recordTime = query.recordTime.join(',')
      }
    }

    const { data: ret } = await getMemberProfitRanking(query)
    page.pages = ret.pages
    page.records = ret.records
    page.loading = false
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

const loadRiskLevels = async () => {
  var ret = []
  ret.push({ id: '1', levelName: t('fields.allrisklevel') })
  const { data: risk } = await selectList({ siteId: request.siteId });
  risk.forEach((item, index) => {
    ret.push(item)
  })
  console.log('ret', ret)
  riskList.list = ret;
  request.riskLevel = riskList.list[0].id
};

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
  loadFinancialLevelList()
  loadRiskLevels()
  await loadMemberRecord()
})

async function loadDetail() {
  loadFinancialLevelList()
  loadRiskLevels()
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
