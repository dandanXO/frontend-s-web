<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <div>
          <el-select
            v-if="hasRole(['ADMIN'])"
            v-model="request.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 120px;margin-left: 5px"
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
            v-model="request.affiliateName"
            size="small"
            style="width: 200px;margin-left: 20px"
            :placeholder="t('fields.loginName')"
          />
          <el-button
            style="margin-left: 20px"
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="loadSettlement()"
          >
            {{ t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="resetQuery()">
            {{ t('fields.reset') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="adjustForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.adjustType')" prop="adjustType">
          <el-select
            v-model="form.adjustType"
            size="small"
            :placeholder="t('fields.adjustType')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.adjustType"
              :key="item.key"
              :label="t('fields.' + item.value.toLowerCase())"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="t('fields.adjustAmount')"
          prop="adjustAmount"
          @keypress="restrictDecimalInput($event)"
        >
          <el-input v-model="form.adjustAmount" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.adjustReason')" prop="adjustReason">
          <el-input
            type="textarea"
            v-model="form.adjustReason"
            :rows="3"
            style="width: 350px;"
            max-length="255"
            show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="adjust">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="uiControl1.dialogTitle"
      v-model="uiControl1.dialogVisible"
      append-to-body
      width="1200px"
    >
      <el-table
        size="mini"
        :resizable="true"
        :data="page1.records"
        row-key="id"
        v-loading="page1.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.affiliateInfo')"
          align="left"
          min-width="100"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <span style="display: inline-block">
              {{ t('fields.account') }}:
              <router-link
                :to="
                  `/affiliate/details/${scope.row.affiliateId}?site=${request.siteId}`
                "
              >
                <el-link type="primary">{{ scope.row.loginName }}</el-link>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recordTime"
          :label="t('fields.recordTime')"
          align="left"
          min-width="100"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:member:detail'])"
          >
            <span style="display: inline-block">
              {{ t('fields.month') }}: {{ scope.row.recordTime }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.depositBettingAmount')"
          align="left"
          min-width="160"
        >
          <template #default="scope">
            <div>
              {{ t('fields.deposit') }}: $
              <span
                v-formatter="{data: scope.row.depositAmount, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.bet') }}: $
              <span v-formatter="{data: scope.row.bet, type: 'money'}" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.withdrawPayoutBonus')"
          align="left"
          min-width="170"
        >
          <template #default="scope">
            <div>
              {{ t('fields.withdraw') }}: $
              <span
                v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.payout') }}: $
              <span v-formatter="{data: scope.row.payout, type: 'money'}" />
            </div>
            <div>
              {{ t('fields.bonus') }}: $
              <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
            </div>
            <div>
              {{ t('fields.adjust') }}: $
              <span
                v-formatter="{data: scope.row.adjustment, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.memberInfo')"
          align="left"
          min-width="150"
        >
          <template #default="scope">
            <div>
              {{ t('fields.activePlayer') }}: {{ scope.row.activePlayer }}
            </div>
            <div>{{ t('fields.ftd') }}: {{ scope.row.ftdMember }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.memberProfitDownlineProfitUnsettleCommission')"
          align="left"
          min-width="150"
        >
          <template #default="scope">
            <div>
              {{ t('fields.profit') }}: $
              <span
                v-formatter="{data: scope.row.memberProfit, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.downlineProfit') }}: $
              <span
                v-formatter="{data: scope.row.downlineProfit, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.unsettleCommission') }}: $
              <span
                v-formatter="{
                  data: scope.row.unsettleCommission,
                  type: 'money',
                }"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        size="mini"
        :resizable="true"
        :data="page.records"
        row-key="id"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="month"
          :label="t('fields.recordTime')"
          align="left"
          min-width="120"
        >
          <template #default="scope">
            {{ scope.row.recordTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="left"
          min-width="120"
        />
        <el-table-column
          prop="upperName"
          :label="t('fields.upperName')"
          align="left"
          min-width="120"
        />
        <el-table-column
          :label="t('fields.totalCommissionProfit')"
          align="left"
          min-width="140"
        >
          <template #default="scope">
            <div>
              $
              <span
                v-formatter="{
                  data: scope.row.totalCommissionProfit,
                  type: 'money',
                }"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="commissionRate"
          :label="t('fields.commissionRate')"
          align="left"
          min-width="140"
        />
        <el-table-column
          :label="t('fields.finalSum')"
          align="left"
          min-width="140"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="最终佣金 = 佣金 - 调整"
            >
              <div>
                $
                <span
                  v-formatter="{
                    data: scope.row.finalProfit,
                    type: 'money',
                  }"
                />
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.adjustAmount')"
          align="left"
          min-width="140"
        >
          <template #default="scope">
            <div>
              $
              <span
                v-formatter="{data: scope.row.adjustAmount, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.adjustReason')"
          align="left"
          min-width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.adjustReason === null">-</span>
            <span v-else>{{ scope.row.adjustReason }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="230"
          v-if="
            !hasRole(['SUB_TENANT']) &&
              (hasPermission(['sys:affiliate:settle:view']) ||
                hasPermission(['sys:affiliate:settle:pay']) ||
                hasPermission(['sys:affiliate:settle:edit']))
          "
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="warning"
              v-permission="['sys:affiliate:settle:view']"
              @click="showView(scope.row)"
            >
              {{ t('fields.settleView') }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              v-permission="['sys:affiliate:settle:pay']"
              @click="confirmPay(scope.row)"
              v-if="scope.row.totalCommissionProfit > 0"
            >
              {{ t('fields.settlePay') }}
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-permission="['sys:affiliate:settle:edit']"
              @click="showEdit(scope.row)"
              v-if="scope.row.adjustAmount === null"
            >
              {{ t('fields.settleEdit') }}
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
        @current-change="loadSettlement"
        @size-change="loadSettlement"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { hasRole, hasPermission } from '../../../utils/util'
import {
  adjustAmount,
  getAffiliateSettlementChecking,
  pay,
  getAffiliateCommisionReport,
} from '../../../api/affiliate-settlement'
import { getSiteListSimple } from '../../../api/site'
import { ElMessage, ElMessageBox } from 'element-plus'
import { required } from '../../../utils/validate'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const adjustForm = ref(null)
const siteList = reactive({
  list: [],
})
const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: '',
  adjustType: [
    { key: 1, value: 'ADD' },
    { key: 2, value: 'DEDUCT' },
  ],
})

const uiControl1 = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: '',
})
const site = ref(null)

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  affiliateName: null,
})

const form = reactive({
  id: null,
  adjustType: null,
  adjustAmount: null,
  adjustReason: null,
})

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    form.adjustAmount !== null &&
    form.adjustAmount.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
  }
}

const formRules = reactive({
  adjustType: [required(t('message.validateAdjustTypeRequired'))],
  adjustAmount: [required(t('message.validateAdjustAmountRequired'))],
  adjustReason: [required(t('message.validateAdjustReasonRequired'))],
})

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function resetQuery() {
  request.affiliateName = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})

const page1 = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  return query
}

async function loadCommisionReport(row) {
  uiControl.dialogVisible = false
  page1.loading = true
  const { data: ret } = await getAffiliateCommisionReport(
    row.recordTime,
    row.affiliateId
  )
  page1.records = ret
  page1.loading = false
}

async function loadSettlement() {
  uiControl.dialogVisible = false
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getAffiliateSettlementChecking(query)
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

function showEdit(adjust) {
  if (adjustForm.value) {
    adjustForm.value.resetFields()
  }
  form.id = adjust.id
  uiControl.dialogTitle = t('fields.adjust')
  uiControl.dialogVisible = true
}

function showView(row) {
  console.log(row)
  uiControl1.dialogTitle =
    t('fields.affiliate') +
    ':   ' +
    row.loginName +
    '  的' +
    t('fields.commissionReport')
  uiControl1.dialogVisible = true
  loadCommisionReport(row)
}

async function confirmPay(check) {
  ElMessageBox.confirm(t('message.confirmToPay'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await pay(check.id)
    await loadSettlement()
    ElMessage({ message: t('message.commissionPaySuccess'), type: 'success' })
  })
}

async function adjust() {
  ElMessageBox.confirm(t('message.confirmToAdjust'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    adjustForm.value.validate(async valid => {
      if (valid) {
        await adjustAmount(form.id, form)
        uiControl.dialogVisible = false
        ElMessage({ message: t('message.adjustSuccess'), type: 'success' })
        await loadSettlement()
      }
    })
  })
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadSettlement()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.btn-group {
  margin-top: 15px;
  display: inline-flex;
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
