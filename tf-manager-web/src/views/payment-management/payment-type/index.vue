<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.name')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadPaymentType"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:payment:type:add']"
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
        ref="payTypeForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="160px"
      >
        <el-form-item :label="t('fields.payTypeName')" prop="name">
          <el-input v-model="form.name" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.payTypeCode')" prop="code">
          <el-input v-model="form.code" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.webMessage')" prop="tipsWeb">
          <el-input
            v-model="form.tipsWeb"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item :label="t('fields.mobileMessage')" prop="tipsMobile">
          <el-input
            v-model="form.tipsMobile"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            style="width: 350px"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
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
      <el-table-column prop="name" :label="t('fields.payTypeName')" width="200" />
      <el-table-column prop="code" :label="t('fields.payTypeCode')" width="200" />
      <el-table-column prop="tipsWeb" :label="t('fields.webMessage')" width="200" />
      <el-table-column prop="tipsMobile" :label="t('fields.mobileMessage')" width="200" />
      <el-table-column prop="status" :label="t('fields.status')" width="200" v-if="hasPermission(['sys:payment:type:update:state'])">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changePaymentTypeStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="right" v-if="hasPermission(['sys:payment:type:update'])">
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
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { required, isAlphaNumeric } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  createPaymentType,
  getPaymentTypes,
  updatePaymentType,
  updatePaymentTypeStatus,
} from '../../../api/payment-type'
import { hasPermission } from '../../../utils/util'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const payTypeForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  removeBtn: true,
  dialogLoading: false,
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  name: null,
})
const form = reactive({
  id: null,
  name: null,
  code: null,
  tipsWeb: null,
  tipsMobile: null,
  status: true,
})
const validateAlphaNumeric = (rule, value, callback) => {
  if (!isAlphaNumeric(value)) {
    callback(new Error(t('message.validateAlphaNumericOnly')))
  } else {
    callback()
  }
}
const validateSameValueWithPayTypeName = (rule, value, callback) => {
  if (value === form.name) {
    callback(new Error(t('message.validatePayTypeNameCodeDifferent')))
  } else {
    callback()
  }
}
const validateSameValueWithPayTypeCode = (rule, value, callback) => {
  if (value === form.payType) {
    callback(new Error(t('message.validatePayTypeNameCodeDifferent')))
  } else {
    callback()
  }
}
const formRules = reactive({
  name: [
    required(t('message.validatePayTypeNameRequired')),
    { validator: validateSameValueWithPayTypeCode, trigger: 'blur' },
  ],
  code: [
    required(t('message.validatePayTypeCodeRequired')),
    { validator: validateAlphaNumeric, trigger: 'blur' },
    { validator: validateSameValueWithPayTypeName, trigger: 'blur' },
  ],
  tipsWeb: [required(t('message.validateWebMessageRequired'))],
  tipsMobile: [required(t('message.validateMobileMessageRequired'))],
})

function resetQuery() {
  request.name = null
}

async function loadPaymentType() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const { data: ret } = await getPaymentTypes(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  request.current = page
  loadPaymentType()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (payTypeForm.value) {
      payTypeForm.value.resetFields()
    }
    form.id = null
    uiControl.dialogTitle = t('fields.addPayType')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editPayType')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(paymentType) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in paymentType) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = paymentType[key]
      }
    }
  })
}

function create() {
  payTypeForm.value.validate(async valid => {
    if (valid) {
      await createPaymentType(form)
      uiControl.dialogVisible = false
      await loadPaymentType()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  payTypeForm.value.validate(async valid => {
    if (valid) {
      await updatePaymentType(form)
      uiControl.dialogVisible = false
      await loadPaymentType()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function changePaymentTypeStatus(id, status) {
  await updatePaymentTypeStatus(id, status)
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

onMounted(() => {
  loadPaymentType()
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
</style>
