<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="handleChangeSite()"
        >
          <el-option
            v-for="item in list.sites"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          filterable
          clearable
          v-model="request.affiliateId"
          size="small"
          :placeholder="t('fields.affiliate')"
          class="filter-item"
          style="width: 200px; margin-left: 5px;"
        >
          <el-option
            v-for="item in list.affiliates"
            :key="item.affiliateId"
            :label="item.loginName"
            :value="item.affiliateId"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAffiliateDepositDisplay()"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:affiliate-deposit-display:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
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
        ref="affiliateFinancialDepositDisplayForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.affiliate')" prop="affiliateId">
          <el-select
            filterable
            clearable
            v-model="form.affiliateId"
            size="small"
            :placeholder="t('fields.affiliate')"
            class="filter-item"
            style="width: 350px; margin-bottom: 10px"
          >
            <el-option
              v-for="item in list.affiliates"
              :key="item.affiliateId"
              :label="item.loginName"
              :value="item.affiliateId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.paymentName') + 1" prop="paymentId1">
          <el-select
            filterable
            clearable
            v-model="form.paymentId1"
            size="small"
            :placeholder="t('fields.paymentName')"
            class="filter-item"
            style="width: 350px; margin-bottom: 10px"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.paymentName') + 2" prop="paymentId2">
          <el-select
            filterable
            clearable
            v-model="form.paymentId2"
            size="small"
            :placeholder="t('fields.paymentName')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.paymentName') + 3" prop="paymentId3">
          <el-select
            filterable
            clearable
            v-model="form.paymentId3"
            size="small"
            :placeholder="t('fields.paymentName')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.paymentName') + 4" prop="paymentId4">
          <el-select
            filterable
            clearable
            v-model="form.paymentId4"
            size="small"
            :placeholder="t('fields.paymentName')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName') + 4" prop="privilegeId">
          <el-select
            filterable
            clearable
            v-model="form.privilegeId"
            size="small"
            :placeholder="t('fields.privilegeName')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.privileges"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateDepositDisplay') }}</span>
        </div>
      </template>
      <el-table
        :data="page.records"
        v-loading="page.loading"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        :empty-text="t('fields.noData')"
        style="width: 100%"
      >
        <el-table-column prop="loginName" :label="t('fields.affiliateName')" width="150">
          <template
            #default="scope"
            v-if="hasPermission(['sys:affiliate:detail'])"
          >
            <router-link :to="`details/${scope.row.affiliateId}?site=${scope.row.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" width="150">
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">{{ scope.row.affiliateCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentName1" :label="t('fields.paymentName') + 1" />
        <el-table-column prop="paymentName2" :label="t('fields.paymentName') + 2" />
        <el-table-column prop="paymentName3" :label="t('fields.paymentName') + 3" />
        <el-table-column prop="paymentName4" :label="t('fields.paymentName') + 4" />
        <el-table-column :label="t('fields.privilegeName')" prop="privilegeName" />
        <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
          <template #default="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              @click="showEdit(scope.row)"
            />
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
    </el-card>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { getSiteListSimple } from '../../../api/site'
import { getAffiliateDepositDisplayList, createAffiliateDepositDisplay, updateAffiliateDepositDisplay } from '../../../api/affiliate-deposit-display'
import { getAffiliateList } from '../../../api/affiliate-record'
import { getActivePrivilegeInfoBySiteId } from '../../../api/privilege-info'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";
import { TENANT } from '../../../store/modules/user/action-types'
import { hasPermission } from '../../../utils/util'
import { getPaymentsSimpleBySiteId } from "../../../api/payment-display";

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const affiliateFinancialDepositDisplayForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  dialogLoading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
})
const list = reactive({
  sites: [],
  paymentInfo: [],
  affiliates: [],
  privileges: [],
})
const page = reactive({
  pages: 1,
  records: [],
  loading: false,
})
const form = reactive({
  id: null,
  affiliateCode: null,
  paymentId1: null,
  paymentId2: null,
  paymentId3: null,
  paymentId4: null,
  affiliateId: null,
  privilegeId: null,
})
const formRules = reactive({
  affiliateId: [required(t('message.validateAffiliateNameRequired'))],
  paymentId1: [required(t('message.validatePaymentNameRequired'))],
  paymentId2: [required(t('message.validatePaymentNameRequired'))],
  paymentId3: [required(t('message.validatePaymentNameRequired'))],
  paymentId4: [required(t('message.validatePaymentNameRequired'))],
})
const selected = reactive({ paymentId: [] })

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  list.sites = ret
}

async function loadPayment() {
  const { data: ret } = await getPaymentsSimpleBySiteId(request.siteId)
  list.paymentInfo = ret
}

async function loadAffiliateDepositDisplay() {
  const { data: ret } = await getAffiliateDepositDisplayList(request)
  page.records = ret.records.filter(item => item.affiliateId !== "9999")
  page.pages = ret.pages
}

async function loadAffiliates() {
  const { data: ret } = await getAffiliateList(request.siteId);
  list.affiliates = ret
}

async function loadPrivilege() {
  const { data: ret } = await getActivePrivilegeInfoBySiteId(request.siteId);
  list.privileges = ret
}

async function handleChangeSite() {
  await loadAffiliateDepositDisplay()
  await loadPayment()
  await loadAffiliates()
  await loadPrivilege()
}

function showEdit(data) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in data) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = data[key]
      }
    }
    console.log(form)
    console.log(data)
    selected.paymentId = []
  })
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (affiliateFinancialDepositDisplayForm.value) {
      affiliateFinancialDepositDisplayForm.value.resetFields()
    }
    form.id = null
    selected.paymentId = []
    uiControl.dialogTitle = t('fields.addAffiliateFinancialConfig')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editAffiliateFinancialConfig')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function create() {
  affiliateFinancialDepositDisplayForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.status = true
      await createAffiliateDepositDisplay(form)
      uiControl.dialogVisible = false
      await loadAffiliateDepositDisplay()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  affiliateFinancialDepositDisplayForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.status = true
      await updateAffiliateDepositDisplay(form)
      uiControl.dialogVisible = false
      await loadAffiliateDepositDisplay()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  uiControl.dialogLoading = true
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
  uiControl.dialogLoading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateDepositDisplay()
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
  await loadAffiliates()
  await loadPrivilege()
  await loadPayment()
  await loadAffiliateDepositDisplay()
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

.line-break {
  white-space: pre;
}
</style>
