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
          :shortcuts="shortcuts"
          @change="checkDateValue"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberBetMoneyChange()"
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
      <div class="btn-group">
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:member:detail']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.betMoneyChange') }}</span>
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
        :row-class-name="setRowClass"
      >
        <el-table-column
          prop="betId"
          :label="t('fields.betId')"
          align="center"
          min-width="250"
        />
        <el-table-column
          prop="transactionId"
          :label="t('fields.transactionId')"
          align="center"
          min-width="250"
        />
        <el-table-column
          prop="platform"
          :label="t('fields.platform')"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="gameName"
          :label="t('fields.gameName')"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="bet"
          :label="t('fields.bet')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.bet, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="validBet"
          :label="t('fields.validBet')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.validBet, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="payout"
          :label="t('fields.payout')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.payout, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="beforeBalance"
          :label="t('fields.beforeBalance')"
          align="center"
          min-width="140"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.beforeBalance, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="afterBalance"
          :label="t('fields.afterBalance')"
          align="center"
          min-width="140"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.afterBalance, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="betTime"
          :label="t('fields.betTime')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.betTime === null">-</span>
            <span
              v-if="scope.row.betTime !== null"
              v-formatter="{
                data: scope.row.betTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="settleTime"
          :label="t('fields.settleTime')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span
              v-if="
                scope.row.settleTime === null ||
                  scope.row.betStatus === 'UNSETTLED'
              "
            >
              -
            </span>
            <span
              v-if="
                scope.row.settleTime !== null &&
                  scope.row.betStatus !== 'UNSETTLED'
              "
              v-formatter="{
                data: scope.row.settleTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="result"
          :label="t('fields.result')"
          align="center"
          min-width="140"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.result === 'WIN'"
              size="mini"
              type="success"
            >
              {{ t('result.win') }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.result === 'LOSS'"
              size="mini"
              type="danger"
            >
              {{ t('result.loss') }}
            </el-tag>
            <el-tag v-else size="mini" type="warning">
              {{ t('result.draw') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="betStatus"
          :label="t('fields.betStatus')"
          align="center"
          min-width="140"
        >
          <template #default="scope">
            <el-tag
              v-if="
                scope.row.betStatus === 'SETTLE' ||
                  scope.row.betStatus === 'PATCH' ||
                  scope.row.betStatus === 'BET_N_SETTLE'
              "
              size="mini"
              type="success"
            >
              {{ t('betStatus.SETTLED') }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.betStatus === 'GIVEREWARD'"
              size="mini"
              type="secondary"
            >
              {{ t('betStatus.GIVEREWARD') }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.betStatus === 'BET'"
              size="mini"
              type="secondary"
            >
              {{ t('betStatus.BET') }}
            </el-tag>
            <el-tag
              v-else-if="
                scope.row.betStatus === 'CANCEL' ||
                  scope.row.betStatus === 'ROLLBACK'
              "
              size="mini"
              type="danger"
            >
              {{ t('betStatus.CANCEL') }}
            </el-tag>
            <el-tag v-else size="mini" type="warning">
              {{ t('betStatus.UNSETTLED') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="gameType"
          :label="t('fields.gameType')"
          align="center"
          min-width="140"
        >
          <template #default="scope">
            {{ t('gameType.' + scope.row.gameType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          :label="t('fields.currency')"
          align="center"
          min-width="120"
        />
        <el-table-column>
          <template #default="scope">
            <el-button
              type="info"
              size="mini"
              style="float: right;"
              v-permission="['sys:member:detail:updateBetStatus']"
              @click="showDialog(scope.row.transactionId, scope.row.betTime)"
              v-if="scope.row.betStatus === 'BET'"
            >
              {{ t('fields.update') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer" v-if="site.id === '3'">
        <span>{{ t('fields.totalBetRecords') }}</span>
        <span style="margin-left: 10px">{{ total.totalRecord }}</span>
        <span>{{ t('fields.totalBet') }}</span>
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
      </div>
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150, 200]"
        @current-change="changepage"
        layout="sizes,prev, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadMemberBetMoneyChange(true)"
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

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="550px"
    >
      <el-form
        ref="updateBetStatusForm"
        :model="betStatusTypeForm"
        :rules="betStatusTypeFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.transactionId')" prop="transactionId">
          <el-input
            v-model="betStatusTypeForm.transactionId"
            type="input"
            style="width: 350px;"
            maxlength="11"
            disabled
          />
        </el-form-item>
        <el-form-item :label="t('fields.betStatus')" prop="betStatus">
          <el-select
            v-model="betStatusTypeForm.betStatus"
            size="small"
            :placeholder="t('fields.betStatus')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in betStatusType.list"
              :key="item.key"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="editBetStatusType">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import {
  getBetMoneyChange,
  getBetMoneyChangeTotal,
  requestBetMoneyChangeExport, updateBetStatusType,
} from '../../../../../api/member-bet-record'
import { getMemberDetails } from '../../../../../api/member'
import { getPlatformsBySite } from '../../../../../api/platform'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getShortcuts } from '@/utils/datetime'
import { useStore } from '@/store'
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { ElMessage } from 'element-plus'
import { required } from "../../../../../utils/validate";

const store = useStore()
const { t } = useI18n()
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

let duplicateTransactionIds = reactive([])

const updateBetStatusForm = ref(null)
const betStatusTypeForm = reactive({
  transactionId: null,
  betStatus: null,
  betTime: null
})

const uiControl = reactive({
  dialogVisible: false,
  messageVisible: false,
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 },
  ],
  gameType: [
    { key: 1, displayName: 'SLOT', value: 'SLOT' },
    { key: 2, displayName: 'LIVE', value: 'LIVE' },
    { key: 3, displayName: 'FISH', value: 'FISH' },
    { key: 4, displayName: 'SPORT', value: 'SPORT' },
    { key: 5, displayName: 'ESPORT', value: 'ESPORT' },
    { key: 6, displayName: 'POKER', value: 'POKER' },
    { key: 7, displayName: 'LOTTERY', value: 'LOTTERY' },
    { key: 8, displayName: 'CASUAL', value: 'CASUAL' },
  ],
  result: [
    { key: 1, displayName: 'WIN', value: 'WIN' },
    { key: 2, displayName: 'LOSS', value: 'LOSS' },
    { key: 3, displayName: 'DRAW', value: 'DRAW' },
  ],
})

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]
const shortcuts = getShortcuts(t)
const memberDetail = ref(null)
const platform = reactive({
  list: null,
})

const date = new Date()
const defaultStartDate = convertStartDate(date)
const defaultEndDate = convertDate(date)

const request = reactive({
  size: 20,
  current: 1,
  betTime: [defaultStartDate, defaultEndDate],
  // platform: null,
  // bet: null,
  // gameType: [],
  // result: ["WIN", "LOSS", "DRAW"]
})

const total = reactive({
  totalBet: 0,
  totalValidBet: 0,
  totalPayout: 0,
})

function resetQuery() {
  request.betTime = [defaultStartDate, defaultEndDate]
  page.pagingState = null
  // request.platform = null;
  // request.result = ["WIN", "LOSS", "DRAW"];
  // request.bet = null;
  // request.gameType = [];
}

const page = reactive({
  pages: 0,
  records: [],
  pagingState: '',
  loading: false,
})

const betStatusType = reactive({
  list: [
    // { key: 1, name: 'BET', value: 'BET' },
    { key: 2, name: 'SETTLE', value: 'SETTLE' },
    // { key: 3, name: 'BET_N_SETTLE', value: 'BET_N_SETTLE' },
    { key: 4, name: 'CANCEL', value: 'CANCEL' },
  ],
})

const betStatusTypeFormRules = reactive({
  transactionId: [required(t('message.validateTransactionIdRequired'))],
  betStatus: [required(t('message.validateTypeRequired'))],
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD') + ' 23:59:59'
}

function convertStartDate(date) {
  return moment(date)
    .startOf('day')
    .format('YYYY-MM-DD HH:mm:ss')
}

const checkDateValue = date => {
  const [startCheck, endCheck] = date
  const distract = moment(endCheck).diff(startCheck, 'days')
  if (distract >= 93) {
    ElMessage({
      message: t('message.startenddatemore3months'),
      type: 'error',
    })
    request.betTime = [defaultStartDate, defaultEndDate]
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
  if (request.betTime !== null) {
    if (request.betTime.length === 2) {
      query.betTime = JSON.parse(JSON.stringify(request.betTime))
      query.betTime[0] = formatInputTimeZone(query.betTime[0], props.timeZone)
      query.betTime[1] = formatInputTimeZone(query.betTime[1], props.timeZone)
      query.betTime = query.betTime.join(',')
    }
  }
  // if (request.result !== null) {
  //   if (request.result.length === 1) {
  //     query.result = request.result[0];
  //   } else {
  //     query.result = request.result.join(",");
  //   }
  // }
  query.memberId = props.mbrId
  query.siteId = site.id
  return query
}

async function loadMemberBetMoneyChange(frombutton) {
  if (frombutton === true) {
    request.current = 1
    page.pagingState = null
  }
  page.loading = true
  const query = checkQuery()
  query.pagingState = page.pagingState
  const { data: ret } = await getBetMoneyChange(query)
  page.pages = ret.pages
  page.records = ret.records
  page.pagingState = ret.pagingState

  // Only for Thailand
  if (site.id === '3') {
    const { data: t } = await getBetMoneyChangeTotal(query)
    total.totalBet = t.totalBet
    total.totalValidBet = t.totalValidBet
    total.totalPayout = t.totalPayout
  }

  page.loading = false
}

function changepage(page) {
  if (request.current >= 1) {
    request.current = page
    loadMemberBetMoneyChange()
  }
}

async function loadPlatform() {
  const { data: ret } = await getPlatformsBySite(memberDetail.value.siteId)
  platform.list = ret
}

// function restrictInput(event) {
//   var charCode = event.which ? event.which : event.keyCode
//   if (
//     (charCode < 48 || charCode > 57) && charCode !== 46
//   ) {
//     event.preventDefault();
//   }

//   if (
//     request.bet !== null &&
//     request.bet.toString().indexOf('.') > -1
//   ) {
//     if (charCode === 46) {
//       event.preventDefault();
//     }
//   }
// }

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await requestBetMoneyChangeExport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

function findDuplicateTransactionIds() {
  const transactionIds = page.records.map(record => record.transactionId)
  duplicateTransactionIds = transactionIds.filter(
    (id, index, array) => array.indexOf(id) !== index
  )
}

function setRowClass({ row }) {
  return duplicateTransactionIds.includes(row.transactionId)
    ? 'duplicate-row'
    : ''
}

const showDialog = async (transactionId, betTime) => {
  betStatusTypeForm.transactionId = transactionId
  betStatusTypeForm.betStatus = betStatusType.list[0].value
  betStatusTypeForm.betTime = betTime
  uiControl.dialogTitle = t('fields.betStatus')
  uiControl.dialogVisible = true
}

async function editBetStatusType() {
  const query = checkQuery();
  query.transactionId = betStatusTypeForm.transactionId;
  query.betStatus = betStatusTypeForm.betStatus;
  query.transactionBetTime = betStatusTypeForm.betTime;
  await updateBetStatusType(query);
  uiControl.dialogVisible = false

  ElMessage({
    message: t('message.updateSuccess'),
    type: 'success',
  })
  await loadMemberBetMoneyChange();
}

onMounted(async () => {
  const { data: ret } = await getMemberDetails(props.mbrId, site.id)
  memberDetail.value = ret
  await loadPlatform()
})

watch(
  () => page.records,
  () => {
    findDuplicateTransactionIds()
  },
  { immediate: true }
)
</script>

<style rel="stylesheet/scss" lang="scss">
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

.duplicate-row {
  background-color: #fff0db !important; /* Customize the color */
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
