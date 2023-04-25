<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.resultTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          :placeholder="t('fields.resultDate')"
          style="margin-left: 5px;width: 150px"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadResults()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:lottery:result:add']" @click="showDialog()">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.lotteryResultList') }}</span>
        </div>
      </template>

      <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
        <el-form ref="lotteryForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
          <el-form-item :label="t('fields.resultDate')" prop="resultTime">
            <el-date-picker
              v-model="form.resultTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="small"
              :placeholder="t('fields.resultDate')"
              style="margin-left: 5px;width: 150px"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item :label="t('fields.resultNumber')" prop="number">
            <el-input v-model="form.number" style="width: 350px;" @keypress="restrictInput" />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
            <el-button type="primary" @click="addResult">{{ t('fields.confirm') }}</el-button>
          </div>
        </el-form>
      </el-dialog>

      <el-table :data="page.records" ref="table"
                v-loading="page.loading"
                row-key="id"
                size="mini"
                :resizable="true"
                highlight-current-row
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="number" :label="t('fields.resultNumber')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.number === null">-</span>
            <span v-if="scope.row.number !== null">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="resultTime" :label="t('fields.resultDate')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.resultTime === null">-</span>
            <span v-if="scope.row.resultTime !== null">{{ scope.row.resultTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="winners" :label="t('fields.noOfWinners')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.winners === null">0</span>
            <span v-if="scope.row.winners !== null">{{ scope.row.winners }}</span>
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
    </el-card>
  </div>
</template>

<script setup>

import { onMounted, reactive, ref } from "vue";
import moment from 'moment';
import { ElMessage } from "element-plus";
import { required } from "../../../utils/validate";
import { getLotteryResults, lotteryResult } from "../../../api/privilege-lottery";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const lotteryForm = ref(null);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: t('fields.addLotteryResult')
});

const startDate = convertDate(new Date());
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  resultTime: null,
  affiliateCode: null,
  siteId: null
});

const form = reactive({
  resultTime: null,
  number: null
});

const formRules = reactive({
  resultTime: [required(t('message.validateResultDateRequired'))],
  number: [required(t('message.validateResultNumber'))]
});

function resetQuery() {
  request.resultTime = null;
}

async function loadResults() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getLotteryResults(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadResults();
  }
}

function showDialog(type) {
  if (lotteryForm.value) {
    lotteryForm.value.resetFields();
  }
  form.resultTime = startDate;
  uiControl.dialogVisible = true;
}

function addResult() {
  lotteryForm.value.validate(async (valid) => {
    if (valid) {
      await lotteryResult(form);
      uiControl.dialogVisible = false;
      await loadResults();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }

  if (form.number !== null && form.number.toString().length > 2) {
    event.preventDefault();
  }
}

onMounted(() => {
  loadResults();
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}
</style>
