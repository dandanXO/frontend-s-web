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
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:affiliate-financial-config:add']"
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
        ref="affiliateFinancialConfigForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode" required>
          <el-input v-model="form.affiliateCode" style="width: 350px;" maxlength="11" />
        </el-form-item>
        <el-form-item :label="t('fields.paymentName')" prop="paymentId" required>
          <el-select
            clearable
            v-model="form.paymentId"
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
        <el-form-item :label="t('fields.withdrawPlatform')" prop="withdrawPlatformId" required>
          <el-select
            filterable
            clearable
            v-model="form.withdrawPlatformId"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.siteWithdrawPlatform"
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
          <span class="role-span">{{ t('fields.affiliateFinancialManagement') }}</span>
        </div>
      </template>
      <el-table
        :data="page.records"
        v-loading="page.loading"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :empty-text="t('fields.noData')"
        style="width: 100%;"
      >
        <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" width="150">
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">{{ scope.row.affiliateCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentName" :label="t('fields.paymentName')" />
        <el-table-column :label="t('fields.withdrawPlatformName')" prop="withdrawPlatformName" />
        <el-table-column prop="status" :label="t('fields.status')" v-if="hasPermission(['sys:affiliate-financial-config:update'])">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeStatus(scope.row, scope.row.status)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:affiliate-financial-config:update'])">
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
import { getAffiliateFinancialConfigList, createAffiliateFinancialConfig, updateAffiliateFinancialConfig } from '../../../api/affiliate-financial-config'
import { getWithdrawPlatforms } from "../../../api/withdraw-platform";
import { getSiteWithdrawPlatform } from "../../../api/site-withdraw-platform";
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";
import { TENANT } from '../../../store/modules/user/action-types'
import { hasPermission } from '../../../utils/util'
import { getAllPayments } from "../../../api/payment-display";

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const affiliateFinancialConfigForm = ref(null)
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
  withdrawPlatform: [],
  siteWithdrawPlatform: [],
  paymentInfo: [],
})
const page = reactive({
  pages: 1,
  records: [],
  loading: false,
})
const form = reactive({
  id: null,
  affiliateCode: null,
  paymentId: null,
  status: true,
  withdrawPlatformId: null,
})
const formRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
})

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  list.sites = ret
}

async function loadPayment() {
  const { data: ret } = await getAllPayments(request)
  list.paymentInfo = ret
}

async function loadAffiliateFinancialConfig() {
  const { data: ret } = await getAffiliateFinancialConfigList(request)
  page.records = ret.records
  page.pages = ret.pages
}

async function loadSiteWithdrawPlatform(siteId) {
  const { data: ret } = await getSiteWithdrawPlatform(siteId);
  list.siteWithdrawPlatform = ret;
  list.siteWithdrawPlatform.forEach(platform => {
    const matchingItem = list.withdrawPlatform.find(item => item.id === platform.withdrawPlatformId);
    if (matchingItem) {
      platform.name = matchingItem.name;
      platform.id = matchingItem.id;
      platform.type = matchingItem.type;
    }
  });
}

async function loadWithdrawPlatform() {
  const { data: ret } = await getWithdrawPlatforms();
  list.withdrawPlatform = ret.records
}

async function handleChangeSite() {
  await loadAffiliateFinancialConfig()
  await loadPayment()
  await loadSiteWithdrawPlatform(request.siteId)
}

function changeStatus(data, status) {
  data.status = status
  updateAffiliateFinancialConfig(data)
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
    if (affiliateFinancialConfigForm.value) {
      affiliateFinancialConfigForm.value.resetFields()
    }
    form.id = null
    uiControl.dialogTitle = t('fields.addAffiliateFinancialConfig')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editAffiliateFinancialConfig')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function create() {
  affiliateFinancialConfigForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.status = true
      await createAffiliateFinancialConfig(form)
      uiControl.dialogVisible = false
      await loadAffiliateFinancialConfig()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  affiliateFinancialConfigForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.status = true
      await updateAffiliateFinancialConfig(form)
      uiControl.dialogVisible = false
      await loadAffiliateFinancialConfig()
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
    loadAffiliateFinancialConfig()
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
  await loadWithdrawPlatform()
  await loadSiteWithdrawPlatform(request.siteId)
  await loadPayment()
  await loadAffiliateFinancialConfig()
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
