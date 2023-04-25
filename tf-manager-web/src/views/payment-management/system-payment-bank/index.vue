<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.paymentName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.paymentName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadPaymentBankList"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:payment-bank:add']"
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
        ref="paymentBankForm"
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
        <el-form-item :label="t('fields.paymentName')" prop="paymentId">
          <el-select
            clearable
            v-model="form.paymentId"
            size="small"
            :placeholder="t('fields.paymentName')"
            class="filter-item"
            style="width: 490px; margin-bottom: 10px"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
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
      <el-table-column prop="paymentName" :label="t('fields.paymentName')" />
      <el-table-column prop="bankName" :label="t('fields.bankName')" />
      <el-table-column prop="bankCode" :label="t('fields.bankCode')" />
      <el-table-column label="" align="left">
        <template #default="scope">
          <el-button icon="el-icon-delete"
                     size="mini"
                     type="danger"
                     v-permission="['sys:payment-bank:del']"
                     @click="removePaymentBank(scope.row)"
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
import { onMounted, reactive, ref } from 'vue'
import {
  getPaymentBankList,
  createPaymentBank,
  deletePaymentBank,
} from '../../../api/system-payment-bank'
import { getBankInfoListSimple } from '../../../api/bank-info'
import { getAllPayments } from "../../../api/payment-display";
import { required } from '../../../utils/validate'
// import { hasRole, hasPermission } from '../../../utils/util'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const bankForm = ref(null)

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
  paymentId: null,
  bankId: null,
  bankCode: null,
})

const formRules = reactive({
  paymentId: [required(t('message.validatePaymentNameRequired'))],
  bankId: [required(t('message.validateBankRequired'))],
  bankCode: [required(t('message.validateBankCodeRequired'))],
})

const page = reactive({
  pages: 0,
  records: [],
})

const list = reactive({
  bankInfo: [],
  paymentInfo: [],
})

function changePage(page) {
  request.current = page
  loadPaymentBankList()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bankForm.value) {
      bankForm.value.resetFields()
      form.id = null
    }
    uiControl.dialogTitle = t('fields.addBankToPayment')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function loadPaymentBankList() {
  const { data: ret } = await getPaymentBankList(request)
  page.pages = ret.pages
  page.records = ret.records
}

async function create() {
  await createPaymentBank(form)
  uiControl.dialogVisible = false
  await loadPaymentBankList()
  ElMessage({ message: t('message.addSuccess'), type: 'success' })
}

async function loadBank() {
  const { data: ret } = await getBankInfoListSimple(request)
  list.bankInfo = ret
}

async function loadPayment() {
  const { data: ret } = await getAllPayments(request)
  list.paymentInfo = ret
}

function removePaymentBank(bankPayment) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await deletePaymentBank(bankPayment.id);
    await loadPaymentBankList();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  }).catch(() => {});
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  }
}
onMounted(() => {
  loadPaymentBankList()
  loadBank()
  loadPayment()
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
