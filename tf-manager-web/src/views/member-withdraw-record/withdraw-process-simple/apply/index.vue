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
          :disabled-date="disabledDate"
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
          @change="filterPayTypeByCurrency(request.siteId)"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-select
          filterable
          clearable
          v-model="request.withdrawCode"
          size="small"
          :placeholder="t('fields.paymentType')"
          class="filter-item"
          style="width: 150px;margin-left:10px"
        >
          <el-option
            v-for="item in list.filteredPayTypes"
            :key="item.id"
            :label="item.code"
            :value="item.code"
          />
        </el-select>
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
        v-permission="['sys:withdraw:simple:approve']"
        ref="checkBtnRef"
        size="mini"
        type="primary"
        :disabled="uiControl.toApproveBtn"
        @click="toCheck()"
        @keydown.enter.prevent
      >
        {{ t('fields.bulkApprove') }}
      </el-button>
      <el-button
        v-if="hasPermission(['sys:withdraw:simple:bulk-withdraw'])"
        ref="checkBtnRef"
        size="mini"
        type="primary"
        :disabled="uiControl.toApproveBtn"
        @click="showDialog('AUTOPAY')"
        @keydown.enter.prevent
      >
        {{ t('fields.bulkWithdraw') }}
      </el-button>
      <el-button
        v-if="hasPermission(['sys:withdraw:simple:pending'])"
        ref="suspendBtnRef"
        size="mini"
        type="danger"
        :disabled="uiControl.toApproveBtn"
        @click="toPending()"
        @keydown.enter.prevent
      >
        {{ t('fields.toSuspend') }}
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
          prop="afterBalance"
          :label="t('fields.balance')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.afterBalance, type: 'money'}"
            />
          </template>
        </el-table-column>
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
          prop="status"
          :label="t('fields.status')"
          align="center"
          width="160"
        >
          <el-tag>{{ t('withdrawStatus.APPLY') }}</el-tag>
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
          prop="cardAddress"
          :label="t('fields.cardAddress')"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="riskLevel"
          :label="t('fields.riskLevel')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span :style="{color: scope.row.riskLevelColor}">{{ scope.row.riskLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="walletType"
          :label="t('fields.walletType')"
          align="center"
          min-width="120"
        />
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          min-width="300"
          fixed="right"
        >
          <template #default="scope">
            <el-button ref="checkBtnsRef" size="mini" type="primary" @click="toCheck(scope.row)" @keydown.enter.prevent v-permission="['sys:withdraw:simple:approve']">
              {{ t('fields.approve') }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="toFail(scope.row)" @keydown.enter.prevent
              v-permission="['sys:withdraw:simple:fail']"
            >
              {{ t('fields.fail') }}
            </el-button>
            <el-button v-if="hasPermission(['sys:withdraw:simple:pending'])" ref="suspendBtnsRef" size="mini" type="danger" @click="toPending(scope.row)" @keydown.enter.prevent>
              {{ t('fields.toSuspend') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[50, 100, 150]"
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
      <el-form
        v-if="uiControl.dialogType === 'AUTOPAY'"
        ref="toFailForm"
        :model="autopayForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item
          :label="t('fields.withdrawPlatform')"
          prop="withdrawPlatformId"
          required
        >
          <el-select
            v-model="autopayForm.withdrawPlatformId"
            size="small"
            :placeholder="t('fields.withdrawPlatform')"
            class="filter-item"
            style="width: 300px;"
          >
            <el-option
              v-for="item in withdrawPlatformList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="toAutoPay" :disabled="uiControl.clickedAutoPay">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { getVipList } from '../../../../api/vip'
import { getFinancialLevels } from '../../../../api/financial-level'
import { getBankInfoListSimple } from '../../../../api/bank-info'
import {
  autoWithdrawToFail,
  fromApplyToAutopay,
  fromApplyToAutopayBatch,
  fromApplyToPending,
  getMemberWithdrawRecordApplySimple
} from '../../../../api/member-withdraw-record'
import { getSiteListSimple } from "@/api/site"
import { ElMessage } from 'element-plus'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store';
import { useI18n } from "vue-i18n";
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { getConfigList } from '../../../../api/config'
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { isPak } from '@/utils/site'
import { getWithdrawPlatformsSimpleBySiteId } from "../../../../api/withdraw-platform";
import { getActivePaymentTypes } from "../../../../api/payment-type";
import { getCurrencyNames } from "../../../../api/currency";

const checkBtnRef = ref();
const checkBtnsRef = ref();
const suspendBtnRef = ref();
const suspendBtnsRef = ref();
const store = useStore();
const { t } = useI18n();
const searchForm = ref(null)
const toFailForm = ref(null)
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
const withdrawPlatformList = reactive({
  list: [],
})

let timeZone = null;

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'SEARCH',
  toApproveBtn: true,
  clickedAutoPay: false,
})

let chooseRecord = []

const startDate = new Date()
startDate.setDate(startDate.getDate() - 7)
const defaultStartDate = convertDateToStart(startDate);
const defaultEndDate = convertDateToEnd(new Date());
const siteList = reactive({
  list: [],
});

const request = reactive({
  size: 50,
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
  doris: false,
  withdrawCode: null,
  notEqualRiskId: null,
})
const failForm = reactive({
  id: null,
  reasonType: [],
  reasonTemplate: [],
  failReason: null,
  withdrawDate: ''
})
const autopayForm = reactive({
  withdrawPlatformId: null,
})
const reasonTypeList = reactive({
  list: [],
})
const reasonTemplateList = reactive({
  list: [],
})
const list = reactive({
  payTypes: [],
  filteredPayTypes: [],
  siteCurrencyIds: [],
})
const currencyNames = reactive({
  list: []
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
  if (chooseRecord.length > 50) {
    uiControl.toApproveBtn = true
    ElMessage.warning("最多只能选择五十条记录");
  } else uiControl.toApproveBtn = chooseRecord.length === 0;
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

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
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

async function loadReasonTypes() {
  const { data: reasonType } = await getConfigList(
    'cancel_type',
    request.siteId ? request.siteId : null
  )
  reasonTypeList.list = reasonType
}

async function loadReasonTemplates() {
  const { data: reasonTemplate } = await getConfigList(
    'cancel_cause',
    request.siteId ? request.siteId : null
  )
  reasonTemplateList.list = reasonTemplate
}

async function loadWithdrawPlatform() {
  const { data: ret } = await getWithdrawPlatformsSimpleBySiteId(request.siteId);
  withdrawPlatformList.list = ret
}

async function loadCurrencyNames() {
  const { data: ret } = await getCurrencyNames();
  currencyNames.list = ret;
}

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes()
  list.payTypes = payType
}

function filterPayTypeByCurrency(siteId) {
  const currentSite = siteList.list.find(s => s.id === siteId)
  const currencyCodeList = currentSite.currency.split(',').map(currencyName => currencyName)
  console.log(currencyCodeList)
  list.siteCurrencyIds = [
    ...currencyCodeList.map(currencyName => {
      const currency = currencyNames.list.find(c => c.currencyCode.toUpperCase() === currencyName.toUpperCase())
      return currency ? currency.id : null;
    }).filter(Boolean)
  ]
  console.log(list.siteCurrencyIds)
  list.filteredPayTypes = list.payTypes.filter(payTypeByCurrencyID)
  console.log(list.filteredPayTypes)
}

function payTypeByCurrencyID (record) {
  if (record.currencyIds) {
    const currencyIdsList = record.currencyIds.split(',')
    return currencyIdsList.filter(currencyId => list.siteCurrencyIds.includes(parseInt(currencyId))).length > 0
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
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  if (request.withdrawDate !== null) {
    if (request.withdrawDate.length === 2) {
      query.withdrawDate = JSON.parse(JSON.stringify(request.withdrawDate));
      query.withdrawDate[0] = formatInputTimeZone(query.withdrawDate[0], timeZone);
      query.withdrawDate[1] = formatInputTimeZone(query.withdrawDate[1], timeZone);
      query.withdrawDate = query.withdrawDate.join(',')
    }
  }
  query.memberType = "NORMAL,TEST,OUTSIDE,PROMO_TEST";
  const { data: ret } = await getMemberWithdrawRecordApplySimple(query)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    page.totalAmount = ret.sums.withdrawAmount
  } else {
    page.totalAmount = 0
  }
  request.doris = ret.sums.useDoris;
  page.loading = false
}

async function toCheck(memberWithdrawRecord) {
  page.loading = true
  if (memberWithdrawRecord) {
    await fromApplyToAutopay(memberWithdrawRecord.id, 0, memberWithdrawRecord.withdrawDate, memberWithdrawRecord.siteId)
  } else {
    await Promise.all(chooseRecord.map(async (a) => {
      await fromApplyToAutopay(a.id, 0, a.withdrawDate, a.siteId);
    }));
    uiControl.toApproveBtn = true
  }
  await loadRecord()
  page.loading = false
  ElMessage({ message: t('message.updateWithdraw'), type: 'success' })
  checkBtnRef.value.blur();
  checkBtnsRef.value.blur();
}

async function toAutoPay() {
  toFailForm.value.validate(async valid => {
    if (valid) {
      uiControl.clickedAutoPay = true
      await fromApplyToAutopayBatch(
        chooseRecord.map(a => ({
          id: a.id,
          withdrawPlatformId: autopayForm.withdrawPlatformId,
          withdrawDate: a.withdrawDate,
          siteId: request.siteId
        }))
      )
      uiControl.toApproveBtn = true
      await loadRecord()
      ElMessage({ message: t('message.updateWithdraw'), type: 'success' })
    }
  })
}

async function toFail(memberWithdrawRecord) {
  if (isPak(request.siteId)) {
    showDialog('FAIL', memberWithdrawRecord)
  } else {
    await autoWithdrawToFail(memberWithdrawRecord.id, 'Auto Withdraw Fail', 'Auto Withdraw Fail', memberWithdrawRecord.withdrawDate, memberWithdrawRecord.siteId)
    await loadRecord()
    ElMessage({ message: t('message.updateToFailSuccess'), type: 'success' })
  }
}

async function toPending(memberWithdrawRecord) {
  page.loading = true
  if (memberWithdrawRecord) {
    await fromApplyToPending([{ id: memberWithdrawRecord.id, withdrawDate: memberWithdrawRecord.withdrawDate, siteId: memberWithdrawRecord.siteId }])
  } else {
    await fromApplyToPending(chooseRecord.map(a => ({ id: a.id, withdrawDate: a.withdrawDate, siteId: a.siteId })))
  }
  page.loading = false
  await loadRecord()
  ElMessage({ message: t('message.updateToSuspendSuccess'), type: 'success' })
  suspendBtnRef.value.blur();
  suspendBtnsRef.value.blur();
}

async function showDialog(type, memberWithdrawRecord) {
  if (type === 'FAIL') {
    if (toFailForm.value) {
      toFailForm.value.resetFields()
    }
    failForm.id = memberWithdrawRecord.id
    failForm.withdrawDate = memberWithdrawRecord.withdrawDate
    await loadReasonTypes()
    failForm.reasonType = reasonTypeList.list[0].value
    uiControl.dialogTitle = t('fields.failReason')
  } else if (type === "AUTOPAY") {
    uiControl.clickedAutoPay = false
    if (toFailForm.value) {
      toFailForm.value.resetFields()
    }
    await loadWithdrawPlatform()
    uiControl.dialogTitle = t('fields.autopay')
  } else if (type === 'SEARCH') {
    uiControl.dialogTitle = t('fields.advancedSearch')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function fail() {
  toFailForm.value.validate(async valid => {
    if (valid) {
      clickedFail.value = true
      await autoWithdrawToFail(
        failForm.id,
        failForm.reasonType,
        failForm.failReason,
        failForm.withdrawDate,
        request.siteId
      )
      uiControl.dialogVisible = false
      clickedFail.value = false
      await loadRecord()
      ElMessage({ message: t('message.updateToFailSuccess'), type: 'success' })
    }
  })
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  const { data: config } = await getConfigList("withdraw_risk_apply", request.siteId);
  if (config.length !== 0) {
    request.notEqualRiskId = config[0].value
  }
  loadVips()
  loadFinancialLevels()
  loadBanks()
  loadRecord()
  await loadCurrencyNames();
  await loadPayTypes();
  filterPayTypeByCurrency(request.siteId)
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
