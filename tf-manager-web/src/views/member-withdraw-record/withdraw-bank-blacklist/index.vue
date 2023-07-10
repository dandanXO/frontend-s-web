<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.bankCardNumber"
          style="width: 300px"
          size="small"
          maxlength="50"
          :placeholder="t('fields.bankCardNumber')"
        />
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left: 5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadWithdrawalBankBlacklist">
          {{ t('fields.search') }}
        </el-button>
        <el-button style="margin-left: 20px" icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:withdrawal-bank-blacklist:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:withdrawal-bank-blacklist:del']"
          @click="removeWithdrawalBankBlacklist()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="680px"
    >
      <el-form
        ref="blacklistForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.bankCardNumber')" prop="bankCardNumber">
          <el-input v-model="form.bankCardNumber" style="width: 350px;" maxlength="50" />
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
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" v-if="!hasRole(['SUB_TENANT'])" />
      <el-table-column prop="bankCardNumber" :label="t('fields.bankCardNumber')" width="500" />
      <el-table-column prop="operator" :label="t('fields.operator')" width="250" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="250" />
      <el-table-column :label="t('fields.action')" align="right" v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdrawal-bank-blacklist:del'])">
        <template #default="scope">
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:withdrawal-bank-blacklist:del']" @click="removeWithdrawalBankBlacklist(scope.row)" />
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
      @current-change="loadWithdrawalBankBlacklist"
      @size-change="loadWithdrawalBankBlacklist"
    />
  </div>
</template>

<script setup>

import { reactive, ref } from "vue";
import moment from 'moment';
import { required } from "../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  createWithdrawalBankBlacklist, deleteWithdrawalBankBlacklist, getWithdrawalBankBlacklist
} from "../../../api/withdrawal-bank-blacklist";
import { hasRole, hasPermission } from "../../../utils/util";
import { onMounted } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('day')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'months')
          .startOf('month')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'months')
          .endOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.last3Months'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(2, 'months')
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

const blacklistForm = ref(null);

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true
});
const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const form = reactive({
  id: null,
  bankCardNumber: null
});

const formRules = reactive({
  bankCardNumber: [required(t('message.validateBankCardNumberRequired'))]
});

let chooseBankCard = [];

const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

const request = reactive({
  size: 20,
  current: 1,
  bankCardNumber: null,
  createTime: [defaultStartDate, defaultEndDate]
});

function handleSelectionChange(val) {
  chooseBankCard = val;
  if (chooseBankCard.length === 0) {
    uiControl.removeBtn = true;
  } else if (chooseBankCard.length === 1) {
    uiControl.removeBtn = false;
  } else {
    uiControl.removeBtn = false;
  }
}

function resetQuery() {
  request.bankCardNumber = null
  request.createTime = [defaultStartDate, defaultEndDate]
}

async function loadWithdrawalBankBlacklist() {
  page.loading = true;
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = request.createTime.join(',')
    }
  }
  const { data: ret } = await getWithdrawalBankBlacklist(query);
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false;
}

function showDialog(type) {
  if (blacklistForm.value) {
    blacklistForm.value.resetFields();
  }
  if (type === "CREATE") {
    form.id = null;
    uiControl.dialogTitle = t('fields.addWithdrawalBankBlacklist');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function create() {
  if (form.bankCardNumber !== null) {
    form.bankCardNumber = form.bankCardNumber.trim();
  }
  blacklistForm.value.validate(async (valid) => {
    if (valid) {
      await createWithdrawalBankBlacklist(form);
      uiControl.dialogVisible = false;
      await loadWithdrawalBankBlacklist();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

async function removeWithdrawalBankBlacklist(financial) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (financial) {
      await deleteWithdrawalBankBlacklist([financial.id]);
    } else {
      await deleteWithdrawalBankBlacklist(chooseBankCard.map(a => a.id));
    }
    await loadWithdrawalBankBlacklist();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  }
}

onMounted(() => {
  loadWithdrawalBankBlacklist();
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

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}

.level-color {
  width: 30px;
  height: 30px;
}
</style>
