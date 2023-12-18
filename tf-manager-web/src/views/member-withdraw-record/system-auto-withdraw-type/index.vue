<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @change="loadAutoPaymentType()"
        >
          <el-option
            v-for="item in list.sites"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:systemautowithdraw:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-close"
          size="mini"
          type="danger"
          v-permission="['sys:systemautowithdraw:update']"
          @click="disableAll()"
        >
          {{ t('fields.disableAll') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="600px"
    >
      <el-form
        ref="autoPaymentForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.payTypeName')" prop="paymentTypeCode" required>
          <el-select
            filterable
            clearable
            v-model="form.paymentTypeCode"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px; margin-bottom: 16px"
          >
            <el-option
              v-for="item in list.filteredPayTypes"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.minWithdrawAmount')" prop="withdrawAmountMin">
          <el-input-number v-model="form.withdrawAmountMin" :min="0" class="form-input" :controls="false" />
        </el-form-item>
        <el-form-item :label="t('fields.maxWithdrawAmount')" prop="withdrawAmountMax">
          <el-input-number
            v-model="form.withdrawAmountMax"
            :min="form.withdrawAmountMin"
            class="form-input"
            :controls="false"
          />
        </el-form-item>
        <el-form-item :label="t('fields.minBalance')" prop="memberBalanceMin">
          <el-input-number v-model="form.memberBalanceMin" :min="0" class="form-input" :controls="false" />
        </el-form-item>
        <el-form-item :label="t('fields.maxBalance')" prop="memberBalanceMax">
          <el-input-number
            v-model="form.memberBalanceMax"
            :min="form.memberBalanceMin"
            class="form-input"
            :controls="false"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="uiControl.platformDialogTitle"
      v-model="uiControl.platformDialogVisible"
      append-to-body
      width="600px"
    >
      <el-form
        ref="platformForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.payTypeName')" prop="withdrawPlatformId" required>
          <el-select
            filterable
            clearable
            v-model="form.withdrawPlatformId"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px; margin-bottom: 16px"
          >
            <el-option
              v-for="item in list.withdrawPlatformByPayType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.minWithdrawAmount')" prop="withdrawAmountMin">
          <el-input-number v-model="form.withdrawAmountMin" :min="0" class="form-input" :controls="false" />
        </el-form-item>
        <el-form-item :label="t('fields.maxWithdrawAmount')" prop="withdrawAmountMax">
          <el-input-number
            v-model="form.withdrawAmountMax"
            :min="form.withdrawAmountMin"
            class="form-input"
            :controls="false"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submitPlatform()">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div class="clearfix">
            <span style="margin-left: 60px; font-size: small;font-weight:bold">{{ t('fields.withdrawPlatform') }}</span>
          </div>
          <el-table :data="props.row.systemAutoWithdrawPlatfromVO" ref="table" size="small" style="margin-left: 60px; width: 50%;">
            <el-table-column :label="t('fields.withdrawPlatformName')" prop="withdrawPlatformName" />
            <el-table-column :label="t('fields.minWithdrawAmount')" prop="withdrawAmountMin" />
            <el-table-column :label="t('fields.maxWithdrawAmount')" prop="withdrawAmountMax" />
            <el-table-column :label="t('fields.operate')" v-if="hasPermission(['sys:systemautowithdraw:add'])">
              <template #default="scope">
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="success"
                  @click="deletePlatform(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="paymentTypeCode" :label="t('fields.payTypeName')" width="200" />
      <el-table-column prop="withdrawAmountMin" :label="t('fields.minWithdrawAmount')" width="200" />
      <el-table-column prop="withdrawAmountMax" :label="t('fields.maxWithdrawAmount')" width="200" />
      <el-table-column prop="memberBalanceMin" :label="t('fields.minBalance')" width="200" />
      <el-table-column prop="memberBalanceMax" :label="t('fields.maxBalance')" width="200" />
      <el-table-column prop="status" :label="t('fields.status')" width="200" v-if="hasPermission(['sys:systemautowithdraw:update'])">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeStatus(scope.row, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:systemautowithdraw:update'])">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="warning"
            @click="showPlatfromDialog('CREATE', scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { getSiteListSimple } from '../../../api/site'
import { getActivePaymentTypes } from '../../../api/payment-type'
import { getCurrencyNames } from '../../../api/currency'
import { getSystemAutoPaymentTypeList, createSystemAutoPaymentType, createSystemAutoPaymentPlaltform, updateystemAutoPaymentType, deleteSystemAutoPaymentPlaltform } from '../../../api/system-auto-withdraw-type'
import { getWithdrawPlatforms } from "../../../api/withdraw-platform";
import { getSiteWithdrawPlatform } from "../../../api/site-withdraw-platform";
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";
import { TENANT } from '../../../store/modules/user/action-types'
import { hasPermission } from '../../../utils/util'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const autoPaymentForm = ref(null)
const platformForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  platformDialogVisible: false,
  platformDialogTitle: '',
  platformDialogType: 'CREATE',
  removeBtn: true,
  dialogLoading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
})
const list = reactive({
  sites: [],
  currencies: [],
  payTypes: [],
  filteredPayTypes: [],
  siteCurrencyIds: [],
  withdrawPlatform: [],
  filteredwithdrawPlatform: [],
  withdrawPlatformByPayType: [],
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const form = reactive({
  id: null,
  name: null,
  code: null,
  status: true,
  paymentTypeCode: null,
  withdrawAmountMax: 0,
  withdrawAmountMin: 0,
  memberBalanceMax: 0,
  memberBalanceMin: 0,
})
const formRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
  icon: [required(t('message.validateIconRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  currencyId: [required(t('message.validateCurrencyRequired'))],
})

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  list.sites = ret
}

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes()
  list.payTypes = payType
  filterPayTypeByCurrency()
}

async function loadCurrency() {
  const { data: ret } = await getCurrencyNames()
  list.currencies = ret
}

async function loadAutoPaymentType() {
  loadSiteWithdrawPlatform(request.siteId)
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const { data: ret } = await getSystemAutoPaymentTypeList(query)
  page.records = ret
  loadWithdrawName()
  loadPayTypes()
}

function loadWithdrawName() {
  list.withdrawPlatformByPayType = []
  list.filteredwithdrawPlatform.forEach(platform => {
    list.withdrawPlatform.forEach(item => {
      if (item.id === platform.withdrawPlatformId) {
        platform.name = item.name
        platform.id = item.id
        platform.type = item.type
        list.withdrawPlatformByPayType.push(platform)
      }
    })
  })

  page.records.forEach(item => {
    if (item.systemAutoWithdrawPlatfromVO) {
      item.systemAutoWithdrawPlatfromVO.forEach(platfrom => {
        const matchingPlatform = list.withdrawPlatform.find(itemz => itemz.id === platfrom.withdrawPlatformId);
        if (matchingPlatform) {
          platfrom.withdrawPlatformName = matchingPlatform.name;
        }
      });
    }
  });
}

async function loadSiteWithdrawPlatform(siteId) {
  const { data: ret } = await getSiteWithdrawPlatform(siteId);
  list.filteredwithdrawPlatform = ret;
}

async function loadWithdrawPlatform() {
  const { data: ret } = await getWithdrawPlatforms();
  list.withdrawPlatform = ret.records
  loadWithdrawName()
}

function filterPayTypeByCurrency() {
  const currentSite = list.sites.find(s => s.id === request.siteId)
  const currencyCodeList = currentSite.currency.split(',').map(currencyName => currencyName)
  list.siteCurrencyIds = [
    ...currencyCodeList.map(currencyName => {
      const currency = list.currencies.find(c => c.currencyCode.toUpperCase() === currencyName.toUpperCase())
      return currency ? currency.id : null;
    }).filter(Boolean)
  ]
  list.filteredPayTypes = list.payTypes.filter(payTypeByCurrencyID)
  payTypeByExistingPayType()
}

function payTypeByCurrencyID (record) {
  if (record.currencyIds) {
    const currencyIdsList = record.currencyIds.split(',')
    return currencyIdsList.filter(currencyId => list.siteCurrencyIds.includes(parseInt(currencyId))).length > 0
  }
}

function payTypeByExistingPayType() {
  list.filteredPayTypes = list.filteredPayTypes.filter(payType => {
    return !page.records.some(record => record.paymentTypeCode === payType.code);
  });
}

function disableAll() {
  page.records.forEach(record => {
    record.status = false
    updateystemAutoPaymentType(record)
  })
}

function changeStatus(data, status) {
  data.status = status
  updateystemAutoPaymentType(data)
}

function showEdit(data) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in data) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = data[key]
      }
    }
  })
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (autoPaymentForm.value) {
      autoPaymentForm.value.resetFields()
    }
    form.id = null
    uiControl.dialogTitle = t('fields.addPayType')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editPayType')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showPlatfromDialog(type, data) {
  loadWithdrawName()
  list.withdrawPlatformByPayType = []
  list.filteredwithdrawPlatform.forEach(item => {
    if (item.type === data.paymentTypeCode) {
      list.withdrawPlatformByPayType.push(item)
    }
  })

  if (type === 'CREATE') {
    if (platformForm.value) {
      form.withdrawAmountMax = 0
      form.withdrawAmountMin = 0
      platformForm.value.resetFields()
    }
    form.autoWithdrawTypeId = data.id
    uiControl.platformDialogTitle = t('fields.addPayType')
  } else if (type === 'EDIT') {
    uiControl.platformDialogTitle = t('fields.editPayType')
  }
  uiControl.platformDialogType = type
  uiControl.platformDialogVisible = true
}

function deletePlatform(data) {
  deleteSystemAutoPaymentPlaltform(data)
  loadAutoPaymentType()
}

function create() {
  autoPaymentForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      await createSystemAutoPaymentType(form)
      uiControl.dialogVisible = false
      await loadAutoPaymentType()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function createPlatform() {
  platformForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.id = null
      await createSystemAutoPaymentPlaltform(form)
      uiControl.platformDialogVisible = false
      await loadAutoPaymentType()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  autoPaymentForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      await updateystemAutoPaymentType(form)
      uiControl.dialogVisible = false
      await loadAutoPaymentType()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
    payTypeByExistingPayType()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function submitPlatform() {
  if (uiControl.platformDialogType === 'CREATE') {
    createPlatform()
  }
}

onMounted(async() => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = list.sites.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    site.value = list.sites[0];
    request.siteId = site.value.id;
  }
  loadWithdrawPlatform()
  loadSiteWithdrawPlatform(request.siteId)
  loadCurrency()
  loadPayTypes()
  loadAutoPaymentType()
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
  margin-right: 18px;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

:deep(.el-radio__input) {
  display: none !important;
}

:deep(.el-radio.is-bordered.is-checked) {
  background-color: var(--el-color-primary);
}

:deep(.is-checked .el-radio__label) {
  color: white;
}

.el-radio {
  margin-right: 10px;
  margin-bottom: 5px;
}

.el-radio.is-bordered+.el-radio.is-bordered {
  margin-left: 0;
}

.form-border {
  border-color: #dcdfe6;
  border-style: solid;
  border-width: 1px
}

.form-header {
  color: white;
  background-color: var(--el-color-primary);
  padding: 10px;
}

.form-body {
  padding: 10px;
}

.el-icon-caret-top {
  color: red;
}

.el-icon-caret-bottom {
  color: green;
}
</style>
