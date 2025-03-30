<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.betTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 380px"
          @change="checkDateValue"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberBetRecords()"
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

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">
            {{ t('fields.memberBetRecordByPlatform') }}
          </span>
        </div>
      </template>
      <el-table
        :data="page.records"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="platform"
          :label="t('fields.platform')"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="totalBetCount"
          :label="t('fields.totalBetCount')"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="totalBet"
          :label="t('fields.totalBet')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.totalBet, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalValidBet"
          :label="t('fields.totalValidBet')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.totalValidBet, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalPayout"
          :label="t('fields.totalPayout')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.totalPayout, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalCompanyProfit"
          :label="t('fields.totalCompanyProfit')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <span
              v-if="scope.row.totalCompanyProfit < 0"
              style="color:red"
            >
              $
              <span
                v-formatter="{
                  data: scope.row.totalCompanyProfit,
                  type: 'money',
                }"
              />
            </span>
            <span v-else>
              $
              <span
                v-formatter="{
                  data: scope.row.totalCompanyProfit,
                  type: 'money',
                }"
              />
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <span style="margin-left: 30px">{{ t('fields.totalBetCount') }}</span>
        <span style="margin-left: 10px">{{ total.totalBetCount }}</span>

        <span style="margin-left: 30px">{{ t('fields.totalBet') }}</span>
        <span style="margin-left: 10px">$</span>
        <span v-formatter="{data: total.totalBet, type: 'money'}" />

        <span style="margin-left: 30px">
          {{ t('dashboard.totalValidBet') }}
        </span>
        <span style="margin-left: 10px">$</span>
        <span v-formatter="{data: total.totalValidBet, type: 'money'}" />

        <span style="margin-left: 30px">{{ t('fields.totalPayout') }}</span>
        <span style="margin-left: 10px">$</span>
        <span v-formatter="{data: total.totalPayout, type: 'money'}" />

        <span style="margin-left: 30px">
          {{ t('fields.totalCompanyProfit') }}
        </span>
        <span
          v-if="total.totalCompanyProfit < 0"
          style="color:red"
        ><span style="margin-left: 10px">$</span><span v-formatter="{data: total.totalCompanyProfit, type: 'money'}" /></span>
        <span v-else><span style="margin-left: 10px">$</span><span v-formatter="{data: total.totalCompanyProfit, type: 'money'}" /></span>
      </div>
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150, 200]"
        @current-change="changepage"
        layout="total,sizes,prev, pager, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadMemberBetRecords(true)"
      />
    </el-card>

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
import { defineProps, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  getMemberBetRecordByPlatformListTiDB,
  getMemberBetRecordByPlatformListTotalTiDB,
} from '../../../../../api/member-bet-record'
import { getMemberDetails } from '../../../../../api/member'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { ElMessage } from "element-plus";

const { t } = useI18n()
const shortcuts = getShortcuts(t);

const props = defineProps({
  mbrId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const site = reactive({
  id: route.query.site,
})

const uiControl = reactive({
  messageVisible: false,
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 },
  ],
})

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]

const memberDetail = ref(null)

const date = new Date()
const defaultStartDate = convertStartDate(date)
const defaultEndDate = convertDate(date)

const request = reactive({
  size: 20,
  current: 1,
  betTime: [defaultStartDate, defaultEndDate],
  memberId: props.mbrId,
})

const total = reactive({
  // totalRecord: 0,
  totalBet: 0,
  totalBetCount: 0,
  totalValidBet: 0,
  totalPayout: 0,
  totalCompanyProfit: 0,
})

function resetQuery() {
  request.betTime = [defaultStartDate, defaultEndDate]
  page.pagingState = null
}

const page = reactive({
  pages: 0,
  records: [],
  pagingState: '',
  loading: false,
})

const checkDateValue = (date) => {
  const [startCheck, endCheck] = date;
  const distract = moment(endCheck).diff(startCheck, 'days');
  if (distract >= 93) {
    ElMessage({
      message: t('message.startenddatemore3months'),
      type: "error"
    });
    request.betTime = [defaultStartDate, defaultEndDate];
  }
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD') + ' 23:59:59'
}

function convertStartDate(date) {
  return moment(date)
    .startOf('day')
    .format('YYYY-MM-DD HH:mm:ss')
}

// function disabledDate(time) {
//   return (
//     time.getTime() <
//       moment(new Date())
//         .subtract(24, 'months')
//         .startOf('month')
//         .format('x') || time.getTime() > new Date().getTime()
//   )
// }

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.betTime !== null) {
    if (request.betTime.length === 2) {
      query.betTime = JSON.parse(JSON.stringify(request.betTime))
      query.betTime[0] = formatInputTimeZone(query.betTime[0], props.timeZone)
      query.betTime[1] = formatInputTimeZone(query.betTime[1], props.timeZone)
      query.betTime = query.betTime.join(',')
    }
  }
  query.memberId = props.mbrId
  query.siteId = site.id
  return query
}

async function loadMemberBetRecords(frombutton) {
  if (frombutton === true) {
    request.current = 1
    page.pagingState = null
  }
  page.loading = true
  const query = checkQuery()
  query.pagingState = page.pagingState

  const { data: ret } = await getMemberBetRecordByPlatformListTiDB(query)
  ret.records.forEach(rec => {
    rec.totalCompanyProfit = rec.totalPayout - rec.totalBet;
  });

  const { data: ret1 } = await getMemberBetRecordByPlatformListTotalTiDB(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total

  total.data = ret1
  if (ret1) {
    total.totalBet = ret1.totalBet
    total.totalValidBet = ret1.totalValidBet
    total.totalBetCount = ret1.totalBetCount
    total.totalPayout = ret1.totalPayout
    total.totalCompanyProfit = ret1.totalPayout - ret1.totalBet
  } else {
    total.totalBet = 0
    total.totalValidBet = 0
    total.totalBetCount = 0
    total.totalPayout = 0
    total.totalCompanyProfit = 0
  }

  page.loading = false
}

function changepage(page) {
  request.current = page
  loadMemberBetRecords()
}

onMounted(async () => {
  const { data: ret } = await getMemberDetails(props.mbrId, site.id)
  memberDetail.value = ret
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

.btn-group {
  margin-top: 15px;
}
</style>
