<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.withdrawDate"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left:10px"
          default-first-option
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-input
          v-model="request.serialNumber"
          style="width: 300px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.serialNo')"
        />
        <el-input
          v-model="request.loginName"
          style="width: 200px; margin-left: 10px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.loginName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRecord()"
          :disabled="page.loading"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <el-button
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="showDialog('SEARCH')"
          hidden="true"
        >
          {{ t('fields.advancedSearch') }}
        </el-button>
      </div>
      <div style="margin-top:20px;">
        <span style="font-size: small;margin-top: 10px;margin-right:10px">
          {{ t('fields.historyRecord') }}
        </span>
        <el-switch
          v-model="request.doris"
        />
      </div>
    </div>

    <div class="btn-group">
      <el-button
        size="mini"
        type="primary"
        :disabled="uiControl.toApplyBtn"
        @click="reconfirmToApply()"
        @keydown.enter.prevent
      >
        {{ t('fields.toApplying') }}
      </el-button>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="page.records"
        @selection-change="handleSelectionChange"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="withdrawType"
          :label="t('fields.withdrawType')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span>{{ t('withdrawType.' + scope.row.withdrawType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawReviewType"
          :label="t('fields.withdrawReviewType')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span>{{ t('withdrawReviewType.' + scope.row.withdrawReviewType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          :label="t('fields.serialNo')"
          align="center"
          min-width="210"
        />
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="center"
          min-width="120"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <router-link :to="`/member/details/${scope.row.memberId}?site=${scope.row.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="realName"
          :label="t('fields.realName')"
          align="center"
          min-width="110"
        />
        <el-table-column
          prop="financial"
          :label="t('fields.financialLevel')"
          align="center"
          min-width="110"
        >
          <template #default="scope">
            <span :style="{color: scope.row.financialColor}">{{ scope.row.financial }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardAccount"
          :label="t('fields.accountHolder')"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="bankName"
          :label="t('fields.bankName')"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="cardNumber"
          :label="t('fields.accountNumber')"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="currencyCode"
          :label="t('fields.currency')"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="currencyRate"
          :label="t('fields.currencyRate')"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="withdrawName"
          :label="t('fields.withdrawName')"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="withdrawCode"
          :label="t('fields.withdrawCode')"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="withdrawAmount"
          :label="t('fields.withdrawAmount')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="localCurrencyAmount"
          :label="t('fields.localCurrencyAmount')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{
                data: scope.row.localCurrencyAmount,
                type: 'money',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawDate"
          :label="t('fields.withdrawDate')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.withdrawDate === null">-</span>
            <span
              v-if="scope.row.withdrawDate !== null"
              v-formatter="{data: scope.row.withdrawDate, timeZone: scope.row.timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="vip"
          :label="t('fields.vipLevel')"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="walletType"
          :label="t('fields.walletType')"
          align="center"
          min-width="120"
        />
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          min-width="180"
          fixed="right"
        >
          <template #default="scope">
            <el-button size="mini" type="primary" @click="reconfirmToApply(scope.row)" @keydown.enter.prevent>
              {{ t('fields.toApplying') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadRecord"
        @size-change="loadRecord"
      />
      <div class="table-footer">
        <span>{{ t('fields.noOfWithdrawTimes') }}</span>
        <span style="margin-left: 10px">{{ page.total }}</span>
        <span style="margin-left: 30px">{{ t('fields.totalWithdrawAmount') }}</span>
        <span style="margin-left: 10px">$</span>
        <span v-formatter="{data: page.totalAmount, type: 'money'}" />
      </div>
    </el-card>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="900px"
    >
      <el-form
        v-if="uiControl.dialogType === 'SEARCH'"
        ref="searchForm"
        :model="request"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.withdrawDate')" prop="withdrawDate">
          <el-date-picker
            v-model="request.withdrawDate"
            format="DD/MM/YYYY HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="small"
            type="datetimerange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 250px"
            :shortcuts="shortcuts"
            :editable="false"
            :clearable="false"
            :default-time="defaultTime"
          />
        </el-form-item>
        <el-form-item :label="t('fields.serialNo')" prop="serialNumber">
          <el-input
            v-model="request.serialNumber"
            style="width: 250px"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input
            v-model="request.loginName"
            style="width: 250px"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item :label="t('fields.financialLevel')" prop="financialId">
          <el-select
            v-model="request.financialId"
            size="small"
            :placeholder="t('fields.financialLevel')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadFinancialLevels"
          >
            <el-option
              v-for="item in financialList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.accountHolder')" prop="cardAccount">
          <el-input
            v-model="request.cardAccount"
            style="width: 250px"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="t('fields.bankName')" prop="bankName">
          <el-select
            v-model="request.bankName"
            size="small"
            :placeholder="t('fields.bankName')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadBanks"
          >
            <el-option
              v-for="item in bankList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.withdrawAmount')" prop="withdrawAmount">
          <el-input
            v-model="request.minWithdrawAmount"
            style="width: 110px; margin-right: 10px;"
            maxlength="10"
          />
          -
          <el-input
            v-model="request.maxWithdrawAmount"
            style="width: 110px; margin-left: 10px;"
            maxlength="10"
          />
        </el-form-item>
        <el-form-item :label="t('fields.vipLevel')" prop="vipId">
          <el-select
            v-model="request.vipId"
            size="small"
            :placeholder="t('fields.vipLevel')"
            class="filter-item"
            style="width: 250px;"
            default-first-option
            @focus="loadVips"
          >
            <el-option
              v-for="item in vipList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="resetQuery()">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="loadRecord()">{{ t('fields.search') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
/* import moment from 'moment' */
import { getVipList } from '../../../../api/vip'
import { getFinancialLevels } from '../../../../api/financial-level'
import { getBankInfoListSimple } from '../../../../api/bank-info'
import {
  getMemberWithdrawRecordPending,
  fromPendingToApply,
} from '../../../../api/member-withdraw-record'
import { ElMessage } from 'element-plus'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store';
import { useI18n } from "vue-i18n";
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { getSiteListSimple } from "@/api/site";
import { useReconfirm } from '@/hook/reconfirm'
const store = useStore();
const { t } = useI18n();
const searchForm = ref(null)
const vipList = reactive({
  list: [],
})
const financialList = reactive({
  list: [],
})
const bankList = reactive({
  list: [],
})
const siteList = reactive({
  list: [],
})
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'SEARCH',
  toApplyBtn: true,
})

let chooseRecord = []

const startDate = new Date()
startDate.setDate(startDate.getDate() - 7)
const defaultStartDate = convertDateToStart(startDate);
const defaultEndDate = convertDateToEnd(new Date());
const request = reactive({
  size: 20,
  current: 1,
  withdrawDate: [defaultStartDate, defaultEndDate],
  serialNumber: null,
  loginName: null,
  financialId: null,
  cardAccount: null,
  bankName: null,
  minWithdrawAmount: null,
  maxWithdrawAmount: null,
  vipId: null,
  siteId: null,
  doris: false
})

/* function disabledDate(time) {
  return (
    time.getTime() <=
      moment(new Date())
        .subtract(1, 'weeks')
        .format('x') || time.getTime() > new Date().getTime()
  )
} */

function resetQuery() {
  request.withdrawDate = [defaultStartDate, defaultEndDate]
  request.serialNumber = null
  request.loginName = null
  request.financialId = financialList.list[0].id
  request.cardAccount = null
  request.bankName = bankList.list[0].id
  request.minWithdrawAmount = null
  request.maxWithdrawAmount = null
  request.vipId = vipList.list[0].id
  uiControl.dialogVisible = false
}

function handleSelectionChange(val) {
  chooseRecord = val
  if (chooseRecord.length === 0) {
    uiControl.toApplyBtn = true
  } else {
    uiControl.toApplyBtn = false
  }
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalAmount: 0,
})

async function loadVips() {
  const { data: vip } = await getVipList()
  vipList.list = vip
  vipList.list.unshift({
    id: 0,
    name: 'ALL',
  })

  if (!request.vipId) {
    request.vipId = vipList.list[0].id
  }
}

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels()
  financialList.list = financial
  financialList.list.unshift({
    id: 0,
    name: 'ALL',
  })

  if (!request.financialId) {
    request.financialId = financialList.list[0].id
  }
}

async function loadBanks() {
  const { data: bank } = await getBankInfoListSimple()
  bankList.list = bank
  bankList.list.unshift({
    id: 0,
    name: 'ALL',
  })

  if (!request.bankName) {
    request.bankName = bankList.list[0].id
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function loadRecord() {
  uiControl.dialogVisible = false
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.withdrawDate !== null) {
    if (request.withdrawDate.length === 2) {
      query.withdrawDate = request.withdrawDate.join(',')
    }
  }
  query.memberType = "NORMAL,TEST,OUTSIDE,PROMO_TEST";
  const { data: ret } = await getMemberWithdrawRecordPending(query)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    query.status = 'PENDING'
    page.totalAmount = ret.sums.withdrawAmount
  } else {
    page.totalAmount = 0
  }
  request.doris = ret.sums.useDoris;
  page.loading = false
}

const reconfirmToApply = useReconfirm(toApply)

async function toApply(memberWithdrawRecord) {
  if (memberWithdrawRecord) {
    await fromPendingToApply([{ id: memberWithdrawRecord.id, withdrawDate: memberWithdrawRecord.withdrawDate, siteId: memberWithdrawRecord.siteId }])
  } else {
    await fromPendingToApply(chooseRecord.map(a => ({ id: a.id, withdrawDate: a.withdrawDate, siteId: a.siteId })))
  }
  await loadRecord()
  ElMessage({ message: t('message.updateToApplySuccess'), type: 'success' })
}

async function showDialog(type) {
  if (type === 'SEARCH') {
    uiControl.dialogTitle = t('fields.advancedSearch')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

onMounted(async() => {
  await loadSites()
  request.siteId = store.state.user.siteId
  loadVips()
  loadFinancialLevels()
  loadBanks()
  loadRecord()
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

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}
</style>
