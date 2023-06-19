<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.withdrawDate"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
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
    </div>

    <div class="btn-group">
      <el-button
        size="mini"
        type="primary"
        :disabled="uiControl.toPayBtn"
        @click="toPay()"
      >
        {{ t('fields.toPaymentOnGoing') }}
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
          prop="site"
          :label="t('fields.site')"
          align="center"
          min-width="80"
        />
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
          prop="vip"
          :label="t('fields.vipLevel')"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="financial"
          :label="t('fields.financialLevel')"
          align="center"
          min-width="110"
        />
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
          prop="paymentCard"
          :label="t('fields.paymentCard')"
          align="center"
          min-width="120"
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
        />
        <!-- <el-table-column
          :label="t('fields.operate')"
          align="center"
          min-width="200"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="danger"
              @click="showDialog('FAIL', scope.row)"
            >
              {{ t('fields.fail') }}
            </el-button>
          </template>
        </el-table-column> -->
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
      v-if="uiControl.dialogType !== 'SEARCH'"
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        v-if="uiControl.dialogType === 'FAIL'"
        ref="toFailForm"
        :model="failForm"
        :rules="failFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.reasonType')" prop="reasonType">
          <el-select
            v-model="failForm.reasonType"
            size="small"
            :placeholder="t('fields.reasonType')"
            class="filter-item"
            style="width: 300px;"
            default-first-option
            @focus="loadReasonTypes"
          >
            <el-option
              v-for="item in reasonTypeList.list"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.reasonTemplate')" prop="reasonTemplate">
          <el-select
            v-model="failForm.reasonTemplate"
            size="small"
            :placeholder="t('fields.reasonTemplate')"
            class="filter-item"
            style="width: 300px;"
            default-first-option
            @focus="loadReasonTemplates"
            @change="populateFailReason($event)"
          >
            <el-option
              v-for="item in reasonTemplateList.list"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.failReason')" prop="failReason">
          <el-input
            type="textarea"
            v-model="failForm.failReason"
            :rows="6"
            style="width: 300px;"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button :disabled="clickedFail" type="primary" @click="fail">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      v-if="uiControl.dialogType === 'SEARCH'"
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
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { required } from '../../../../utils/validate'
import { getVipList } from '../../../../api/vip'
import { getFinancialLevels } from '../../../../api/financial-level'
import { getBankInfoListSimple } from '../../../../api/bank-info'
import {
  getMemberWithdrawRecordAutopay,
  getTotalWithdrawAmountByStatus,
  fromAutopayToPay,
  fromAutopayToFail,
} from '../../../../api/member-withdraw-record'
import { getConfigList } from '../../../../api/config'
import { getSiteListSimple } from '../../../../api/site'
import { hasPermission } from '../../../../utils/util'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const searchForm = ref(null)
const toFailForm = ref(null)
const site = ref(null)
const clickedFail = ref(null)
const vipList = reactive({
  list: [],
})
const financialList = reactive({
  list: [],
})
const bankList = reactive({
  list: [],
})
const reasonTypeList = reactive({
  list: [],
})
const reasonTemplateList = reactive({
  list: [],
})
const siteList = reactive({
  list: [],
})

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
          .startOf('week')
          .format('x')
      )
      return [start, end]
    },
  },
]

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'SEARCH',
  toPayBtn: true,
})

let chooseRecord = []

const failForm = reactive({
  id: null,
  reasonType: [],
  reasonTemplate: [],
  failReason: null,
  withdrawDate: null,
})

const failFormRules = reactive({
  reasonType: [required(t('message.validateReasonTypeRequired'))],
  failReason: [required(t('message.validateFailReasonRequired'))],
})

const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDateToStart(startDate);
const defaultEndDate = convertDateToEnd(new Date());
function convertDateToStart(date) {
  var m = moment(date)
  m.set({ hour: 0, minute: 0, second: 0 })
  return m.format('YYYY-MM-DD HH:mm:ss');
}

function convertDateToEnd(date) {
  var m = moment(date)
  m.set({ hour: 23, minute: 59, second: 59 })
  return m.format('YYYY-MM-DD HH:mm:ss');
}

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
})

function disabledDate(time) {
  return (
    time.getTime() <=
      moment(new Date())
        .subtract(1, 'weeks')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

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
    uiControl.toPayBtn = true
  } else {
    uiControl.toPayBtn = false
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
  query.memberType = "NORMAL,TEST,OUTSIDE";
  const { data: ret } = await getMemberWithdrawRecordAutopay(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    query.status = 'AUTOPAY, SENDING, WAITING_CALLBACK'
    const { data: autoPayAmount } = await getTotalWithdrawAmountByStatus(query)
    page.totalAmount = autoPayAmount
  } else {
    page.totalAmount = 0
  }
  page.loading = false
}

async function loadReasonTypes() {
  const { data: reasonType } = await getConfigList(
    'cancel_type',
    site.value ? site.value.id : null
  )
  reasonTypeList.list = reasonType
}

async function loadReasonTemplates() {
  const { data: reasonTemplate } = await getConfigList(
    'cancel_cause',
    site.value ? site.value.id : null
  )
  reasonTemplateList.list = reasonTemplate
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function toPay() {
  await fromAutopayToPay(chooseRecord.map(a => ({ id: a.id, withdrawDate: a.withdrawDate })))
  await loadRecord()
  ElMessage({ message: t('message.updateToPaySuccess'), type: 'success' })
}

async function showDialog(type, memberWithdrawRecord) {
  if (type === 'SEARCH') {
    uiControl.dialogTitle = t('fields.advancedSearch')
  } else if (type === 'FAIL') {
    if (toFailForm.value) {
      toFailForm.value.resetFields()
    }
    failForm.id = memberWithdrawRecord.id
    failForm.withdrawDate = memberWithdrawRecord.withdrawDate
    site.value = siteList.list.find(
      s => s.siteName === memberWithdrawRecord.site
    )
    await loadReasonTypes()
    failForm.reasonType = reasonTypeList.list[0].value
    uiControl.dialogTitle = t('fields.failReason')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function fail() {
  toFailForm.value.validate(async valid => {
    if (valid) {
      clickedFail.value = true
      await fromAutopayToFail(
        failForm.id,
        failForm.reasonType,
        failForm.failReason,
        failForm.withdrawDate,
      )
      uiControl.dialogVisible = false
      clickedFail.value = false
      await loadRecord()
      ElMessage({ message: t('message.updateToFailSuccess'), type: 'success' })
    }
  })
}

function populateFailReason(evt) {
  reasonTemplateList.list.forEach(reasonTemplate => {
    if (evt === reasonTemplate.id) {
      failForm.failReason = reasonTemplate.value
    }
  })
}

onMounted(() => {
  loadSites()
  loadVips()
  loadFinancialLevels()
  loadBanks()
  loadRecord()
  loadReasonTypes()
  loadReasonTemplates()
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
