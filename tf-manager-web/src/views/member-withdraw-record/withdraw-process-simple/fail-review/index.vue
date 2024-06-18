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
        <el-select
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
          <el-tag>{{ t('withdrawStatus.FAIL_REVIEW') }}</el-tag>
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
          :label="t('fields.operate')"
          align="center"
          min-width="300"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showDialog('LOG', scope.row)"
            >
              {{ t('fields.viewLog') }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="toFail(scope.row)" @keydown.enter.prevent
              v-permission="['sys:withdraw:simple:fail']"
            >
              {{ t('fields.fail') }}
            </el-button>
            <el-button
              v-permission="['sys:withdraw:simple:fail']"
              size="mini"
              type="success"
              @click="toSuccess(scope.row)"
            >
              {{ t('fields.success') }}
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
      v-if="uiControl.dialogType === 'SEARCH' || uiControl.dialogType === 'LOG'"
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="900px"
    >
      <el-table
        v-if="uiControl.dialogType === 'LOG'"
        height="400px"
        size="small"
        :resizable="true"
        :data="logPage.records"
        v-loading="logPage.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="operate"
          :label="t('fields.operate')"
          align="center"
          min-width="200"
        >
          <template #default="scope">
            <span v-if="scope.row.operate === 'UPGRADE_TO_CHECK'">
              UPGRADE_TO_UNDER_REVIEW
            </span>
            <span v-else-if="scope.row.operate === 'DOWNGRADE_TO_APPLY'">
              DOWNGRADE_TO_APPLYING
            </span>
            <span v-else-if="scope.row.operate === 'CHECK'">REVIEW</span>
            <span v-else-if="scope.row.operate === 'CHECK_FAIL'">
              REVIEW_FAIL
            </span>
            <span v-else-if="scope.row.operate === 'UPGRADE_TO_PAY'">
              UPGRADE_TO_PAYMENT_ON_GOING
            </span>
            <span v-else-if="scope.row.operate === 'DOWNGRADE_TO_WAIT_PAY'">
              WAIT_FPR_PAYMENT
            </span>
            <span v-else-if="scope.row.operate === 'AUTOPAY'">
              AUTOMATIC_PAYMENT
            </span>
            <span v-else-if="scope.row.operate === 'PENDING'">SUSPEND</span>
            <span v-else>{{ scope.row.operate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          :label="t('fields.operator')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="operateTime"
          :label="t('fields.operateTime')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.operateTime === null">-</span>
            <span
              v-if="scope.row.operateTime !== null"
              v-formatter="{
                data: scope.row.operateTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="cancelType"
          :label="t('fields.cancelType')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.cancelType === null">-</span>
            <span v-if="scope.row.cancelType !== null">
              {{ scope.row.cancelType }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="t('fields.remark')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.remark === null">-</span>
            <span v-if="scope.row.remark !== null">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <div class="log-dialog-footer">
          <el-button type="primary" @click="uiControl.dialogVisible = false">
            {{ t('fields.close') }}
          </el-button>
        </div>
      </el-table>
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
      v-if="uiControl.dialogType === 'FAIL'"
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
  getMemberWithdrawRecordFailReview,
  getTotalWithdrawAmountByStatus,
  autoWithdrawToSuccess
} from '../../../../api/member-withdraw-record'
import { getSiteListSimple } from "@/api/site"
import { ElMessage } from 'element-plus'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store';
import { useI18n } from "vue-i18n";
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { getConfigList } from '../../../../api/config'
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { getMemberWithdrawLog } from '../../../../api/member-withdraw-log'

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

const logPage = reactive({
  records: [],
  loading: false,
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
})
const failForm = reactive({
  id: null,
  reasonType: [],
  reasonTemplate: [],
  failReason: null,
  withdrawDate: ''
})
const reasonTypeList = reactive({
  list: [],
})
const reasonTemplateList = reactive({
  list: [],
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
  if (chooseRecord.length > 10) {
    uiControl.toApproveBtn = true
    ElMessage.warning("最多只能选择十条记录");
  } else {
    uiControl.toApproveBtn = false
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
  query.memberType = "NORMAL,TEST,OUTSIDE";
  const { data: ret } = await getMemberWithdrawRecordFailReview(query)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records
  page.total = ret.total
  if (page.records.length !== 0) {
    query.status = 'APPLY'
    const { data: amount } = await getTotalWithdrawAmountByStatus(query)
    page.totalAmount = amount
  } else {
    page.totalAmount = 0
  }
  page.loading = false
}

async function toFail(memberWithdrawRecord) {
  if (request.siteId === 11) {
    showDialog('FAIL', memberWithdrawRecord)
  } else {
    await autoWithdrawToFail(memberWithdrawRecord.id, 'Auto Withdraw Fail', 'Auto Withdraw Fail', memberWithdrawRecord.withdrawDate, memberWithdrawRecord.siteId)
    await loadRecord()
    ElMessage({ message: t('message.updateToFailSuccess'), type: 'success' })
  }
}

async function toSuccess(val) {
  page.loading = true
  await autoWithdrawToSuccess(val.id, val.withdrawDate, val.siteId)
  await loadRecord()
  page.loading = false
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
  } else if (type === 'LOG') {
    uiControl.dialogTitle = t('fields.memberWithdrawLog')
    logPage.loading = true
    const { data: ret } = await getMemberWithdrawLog(memberWithdrawRecord.id, memberWithdrawRecord.withdrawDate)
    logPage.records = ret
    logPage.loading = false
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
  request.siteId = siteList.list[0].id
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
