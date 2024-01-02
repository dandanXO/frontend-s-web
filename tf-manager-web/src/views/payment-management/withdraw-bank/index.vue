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
          @change="handleSiteChange()"
        >
          <el-option
            v-for="item in list.sites"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.withdrawName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.withdrawPlatformName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadWithdrawBankList"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:withdraw-bank:add']"
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
      width="800px"
    >
      <el-form
        ref="withdrawBankForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.bankName')" prop="bankId">
          <el-select
            clearable
            filterable
            v-model="form.bankId"
            size="small"
            :placeholder="t('fields.bankName')"
            class="filter-item"
            style="width: 490px; margin-bottom: 10px"
          >
            <el-option
              v-for="item in list.bankInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.withdrawPlatformName')" prop="withdrawId">
          <el-select
            clearable
            v-model="form.withdrawId"
            size="small"
            :placeholder="t('fields.withdrawPlatformName')"
            class="filter-item"
            style="width: 490px; margin-bottom: 10px"
          >
            <el-option
              v-for="item in list.withdrawInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.bankCode')" prop="bankCode">
          <span>
            <el-input
              v-model="form.bankCode"
              style="width: 200px"
            />
          </span>
        </el-form-item>

        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="withdrawName" :label="t('fields.withdrawName')" />
      <el-table-column prop="bankName" :label="t('fields.bankName')" />
      <el-table-column prop="bankCode" :label="t('fields.bankCode')" />
      <el-table-column label="" align="left">
        <template #default="scope">
          <el-button icon="el-icon-delete"
                     size="mini"
                     type="danger"
                     v-permission="['sys:withdraw-bank:del']"
                     @click="removeWithdrawBank(scope.row)"
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
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref, computed } from 'vue'
import { getSiteListSimple } from '../../../api/site'
import {
  getWithdrawBankList,
  createWithdrawBank,
  deleteWithdrawBank,
} from '../../../api/system-withdraw-bank'
import { getWithdrawBanks } from '../../../api/bank-info'
import { getWithdrawPlatforms } from "../../../api/withdraw-platform";
import { required } from '../../../utils/validate'
// import { hasRole, hasPermission } from '../../../utils/util'
import { useI18n } from "vue-i18n";
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'

const { t } = useI18n()
const store = useStore()
const bankForm = ref(null)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  code: null,
  siteId: null,
})

const form = reactive({
  id: null,
  withdrawId: null,
  bankId: null,
  bankCode: null,
})

const formRules = reactive({
  withdrawId: [required(t('message.validateWithdrawPlatformNameRequired'))],
  bankId: [required(t('message.validateBankRequired'))],
  bankCode: [required(t('message.validateBankCodeRequired'))],
})

const page = reactive({
  pages: 0,
  records: [],
})

const list = reactive({
  sites: [],
  bankInfo: [],
  withdrawInfo: [],
})

function changePage(page) {
  request.current = page
  loadWithdrawBankList()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bankForm.value) {
      bankForm.value.resetFields()
      form.id = null
    }
    uiControl.dialogTitle = t('fields.addBankToWithdrawPlatform')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function handleSiteChange() {
  loadWithdrawBankList()
  loadWithdraw()
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  list.sites = ret
}

async function loadWithdrawBankList() {
  const { data: ret } = await getWithdrawBankList(request)
  page.pages = ret.pages
  page.records = ret.records
}

async function create() {
  await createWithdrawBank(form)
  uiControl.dialogVisible = false
  await loadWithdrawBankList()
  ElMessage({ message: t('message.addSuccess'), type: 'success' })
}

async function loadBank() {
  const { data: ret } = await getWithdrawBanks(request)
  list.bankInfo = ret
}

async function loadWithdraw() {
  const { data: ret } = await getWithdrawPlatforms(request)
  list.withdrawInfo = ret.records
}

function removeWithdrawBank(withdrawBank) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await deleteWithdrawBank(withdrawBank.id);
    await loadWithdrawBankList();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  }).catch(() => {});
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  }
}
onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = list.sites.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    site.value = list.sites[0];
    request.siteId = site.value.id;
  }
  loadWithdrawBankList()
  loadBank()
  loadWithdraw()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

i.el-icon-circle-check {
  color: green;
  margin-left: 5px;
}

i.el-icon-circle-close {
  color: red;
  margin-left: 5px;
}
</style>
