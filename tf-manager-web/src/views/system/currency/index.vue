<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input v-model="request.name" size="small" style="width: 200px;" :placeholder="t('fields.currencyName')" />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadCurrency">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="currencyForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.currencyName')" prop="currencyName">
          <el-input v-model="form.currencyName" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.currencyCode')" prop="currencyCode">
          <el-input v-model="form.currencyCode" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.exchangeRate')" prop="exchangeRate" style="display:none">
          <el-input v-model="form.exchangeRate" style="width: 350px;" oninput="value=value.replace(/[^\d.]/g,'')" />
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
      stripe ref="table"
      row-key="id"
      size="small"
      style="width: 70%"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="currencyName" :label="t('fields.currencyName')" width="200" />
      <el-table-column prop="currencyCode" :label="t('fields.currencyCode')" width="200" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="200" />
      <el-table-column :label="t('fields.operate')" align="right" width="100">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination"
                   @current-change="changePage"
                   layout="prev, pager, next"
                   :page-size="request.size"
                   :page-count="page.pages"
                   :current-page="request.current"
    />
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { isNumeric, required } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import { createCurrency, getCurrencies, updateCurrency } from "../../../api/currency";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currencyForm = ref(null);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});
const request = reactive({
  size: 30,
  current: 1,
  name: null
});

const form = reactive({
  id: null,
  currencyName: null,
  currencyCode: null,
  exchangeRate: 1
});

const formRules = reactive({
  currencyName: [required(t('message.validateCurrencyNameRequired'))],
  currencyCode: [required(t('message.validateCurrencyCodeRequired'))],
  exchangeRate: [required(t('message.validateExchangeRateRequired')), isNumeric(t('message.validateNumberFourDecimalOnly'))]
});

function resetQuery() {
  request.name = null;
}

async function loadCurrency() {
  page.loading = true;
  const { data: ret } = await getCurrencies(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}
function changePage(page) {
  request.current = page;
  loadCurrency();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (currencyForm.value) {
      currencyForm.value.resetFields();
    }
    form.id = null;
    uiControl.dialogTitle = t('fields.addCurrency');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editCurrency');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(currency) {
  showDialog("EDIT");
  nextTick(() => {
    for (const key in currency) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = currency[key];
      }
    }
  });
}

function create() {
  currencyForm.value.validate(async (valid) => {
    if (valid) {
      await createCurrency(form);
      uiControl.dialogVisible = false;
      await loadCurrency();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  currencyForm.value.validate(async (valid) => {
    if (valid) {
      await updateCurrency(form);
      uiControl.dialogVisible = false;
      await loadCurrency();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else if (uiControl.dialogType === "EDIT") {
    edit();
  }
}

onMounted(() => {
  loadCurrency();
});

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
