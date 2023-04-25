<template>
  <div class="roles-main">
    <div class="header-container" style="margin-bottom: 40px">
      <div class="search">
        <el-input v-model="request.memberName" size="small" style="width: 150px;" :placeholder="t('fields.memberName')" />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 150px;margin-left: 5px"
        >
          <el-option
            v-for="item in status.list"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.platformCode"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 150px;margin-left: 5px"
          @focus="loadPlatformNames"
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="request.amount" size="small" style="width: 150px;margin-left: 5px" :placeholder="t('fields.amount')" />
        <el-select
          clearable
          v-model="request.type"
          size="small"
          :placeholder="t('fields.transferType')"
          class="filter-item"
          style="width: 150px;margin-left: 5px"
        >
          <el-option
            v-for="item in transferTypes.list"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          style="margin-left: 5px"
          v-model="request.times"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadTransferRecords">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="transferForm" v-loading="uiControl.dialogLoading" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.memberName')" prop="memberName">
          <el-input disabled v-model="form.memberName" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.transferId')" prop="serialNumber">
          <el-input disabled v-model="form.serialNumber" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group v-model="form.status" size="mini" style="width: 300px">
            <el-radio-button label="SUCCESS">Success</el-radio-button>
            <el-radio-button label="FAIL">Fail</el-radio-button>
            <el-radio-button label="CANCEL">Cancel</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input v-model="form.remark" type="textarea" style="width: 350px;" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row>
      <el-table-column prop="memberName" :label="t('fields.memberName')" width="150" />
      <el-table-column prop="serialNumber" :label="t('fields.transferId')" width="250" />
      <el-table-column prop="transferDate" :label="t('fields.transferTime')" width="150" />
      <el-table-column prop="type" :label="t('fields.transferType')" width="100" />
      <el-table-column prop="amount" :label="t('fields.amount')" width="100" />
      <el-table-column prop="platformName" :label="t('fields.platform')" width="100" />
      <el-table-column prop="status" :label="t('fields.status')" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'SENDING'">{{ scope.row.status }}</el-tag>
          <el-tag v-if="scope.row.status === 'SUCCESS'" type="success">{{ scope.row.status }}</el-tag>
          <el-tag v-if="scope.row.status === 'FAIL'" type="danger">{{ scope.row.status }}</el-tag>
          <el-tag v-if="scope.row.status === 'CANCEL'" type="warning">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="100" />
      <el-table-column :label="t('fields.operate')">
        <template #default="scope">
          <el-button v-if="scope.row.status === 'SENDING'" icon="el-icon-edit" size="mini" type="success" @click="showValidate(scope.row)" />
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
import { required } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import { getTransferRecords, update } from "../../../api/transfer";
import { getPlatformNames } from "../../../api/platform";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const transferForm = ref(null);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogLoading: false
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});
const request = reactive({
  size: 30,
  current: 1,
  memberName: null,
  status: null,
  platformCode: null,
  amount: null,
  type: null,
  startTime: null,
  endTime: null,
  times: []
});

const form = reactive({
  id: null,
  memberName: null,
  serialNumber: null,
  status: null,
  remark: null
});

const formRules = reactive({
  status: [required(t('message.validateStatusRequired'))],
  remark: [required(t('message.validateRemarkRequired'))]
});

const status = reactive({
  list: [
    { key: 1, name: "SENDING", value: "SENDING" },
    { key: 2, name: "SUCCESS", value: "SUCCESS" },
    { key: 3, name: "FAIL", value: "FAIL" },
    { key: 4, name: "CANCEL", value: "CANCEL" },
  ]
})

const platforms = reactive({
  list: []
})

const transferTypes = reactive({
  list: [
    { key: 1, name: "DEPOSIT", value: "DEPOSIT" },
    { key: 2, name: "WITHDRAW", value: "WITHDRAW" }
  ]
})

function resetQuery() {
  request.memberName = null;
  request.status = null;
  request.platformCode = null;
  request.amount = null;
  request.type = null;
  request.startTime = null;
  request.endTime = null;
}

async function loadTransferRecords() {
  page.loading = true;
  if (request.times !== null) {
    request.startTime = request.times[0];
    request.endTime = request.times[1];
  }
  request.times = null;
  const { data: ret } = await getTransferRecords(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

async function loadPlatformNames() {
  const { data: ret } = await getPlatformNames();
  platforms.list = ret;
}

function changePage(page) {
  request.current = page;
  loadTransferRecords();
}

function showDialog() {
  uiControl.dialogTitle = t('fields.validate');
  uiControl.dialogVisible = true;
}

function showValidate(transfer) {
  showDialog();
  nextTick(() => {
    for (const key in transfer) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = transfer[key];
        form.status = null;
        form.remark = null;
      }
    }
  });
}

function validate() {
  transferForm.value.validate(async (valid) => {
    if (valid) {
      await update(form);
      uiControl.dialogLoading = false;
      uiControl.dialogVisible = false;
      await loadTransferRecords();
      ElMessage({ message: t('message.validateSuccess'), type: "success" });
    }
    uiControl.dialogLoading = false;
  });
}

function submit() {
  uiControl.dialogLoading = true;
  validate();
}

onMounted(() => {
  loadTransferRecords();
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

</style>
