<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <div>
          <el-select
            v-if="hasRole(['ADMIN'])"
            v-model="request.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 120px;margin-left: 5px"
            @focus="loadSites"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
          <el-date-picker
            v-model="request.month"
            format="MM/YYYY"
            value-format="YYYY-MM"
            size="small"
            type="month"
            style="width: 200px; margin-left: 10px"
            :editable="false"
            :clearable="false"
            :disabled-date="disabledDate"
            :placeholder="t('fields.month')"
          />
          <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadSettlement()">
            {{ t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        </div>
      </div>
    </div>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="adjustForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.adjustType')" prop="adjustType">
          <el-select
            v-model="form.adjustType"
            size="small"
            :placeholder="t('fields.adjustType')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.adjustType"
              :key="item.key"
              :label="t('fields.' + item.value.toLowerCase())"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="t('fields.adjustAmount')"
          prop="adjustAmount"
          @keypress="restrictDecimalInput($event)"
        >
          <el-input v-model="form.adjustAmount" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.adjustReason')" prop="adjustReason">
          <el-input type="textarea" v-model="form.adjustReason" :rows="3" style="width: 350px;" max-length="255" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="adjust">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        size="mini"
        :resizable="true"
        :data="page.records"
        row-key="id"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="month" :label="t('fields.month')" align="left" min-width="120">
          <template #default="scope">
            {{ convertDateMinusOneMonth(scope.row.recordTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="left" min-width="120" />
        <el-table-column :label="t('fields.totalCommission')" align="left" min-width="140">
          <template #default="scope">
            <div>$
              <span
                v-formatter="{data: scope.row.totalCommissionProfit, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.adjustBy')" align="left" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.adjustBy === null">-</span>
            <span v-else>{{ scope.row.adjustBy }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.adjustAmount')" align="left" min-width="140">
          <template #default="scope">
            <div>$
              <span
                v-formatter="{data: scope.row.adjustAmount, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.adjustReason')" align="left" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.adjustReason === null">-</span>
            <span v-else>{{ scope.row.adjustReason }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.adjustTime')" align="left" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.adjustTime === null">-</span>
            <span v-else>{{ scope.row.adjustTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.finalSum')" align="left" min-width="140">
          <template #default="scope">
            <div>$
              <span
                v-formatter="{data: scope.row.finalSum, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="350"
          v-if="!hasRole(['SUB_TENANT']) && (
            hasPermission(['sys:affiliate:settle:check-adjust']) ||
            hasPermission(['sys:affiliate:settle:check-to-pay']) ||
            hasPermission(['sys:affiliate:settle:check-remove']))"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="warning"
              v-permission="['sys:affiliate:settle:check-adjust']"
              @click="showDialog('ADJUST', scope.row)"
            >
              {{ t('fields.adjust') }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              v-permission="['sys:affiliate:settle:check-remove']"
              @click="removeSettlementCheck(scope.row)"
            >
              {{ t('fields.remove') }}
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-permission="['sys:affiliate:settle:check-to-pay']"
              @click="toPay(scope.row)"
            >
              {{ t('fields.toPay') }}
            </el-button>
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
        @current-change="loadSettlement"
        @size-change="loadSettlement"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { hasRole, hasPermission } from "../../../utils/util";
import moment from 'moment';
import { adjustAmount, deleteSettlementChecking, getAffiliateSettlementChecking, updatetoPay } from '../../../api/affiliate-settlement';
import { getSiteListSimple } from "../../../api/site";
import { ElMessage, ElMessageBox } from 'element-plus';
import { required } from '../../../utils/validate';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const adjustForm = ref(null);
const siteList = reactive({
  list: []
});
const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: "",
  dialogType: "ADJUST",
  adjustType: [
    { key: 1, value: "ADD" },
    { key: 2, value: "DEDUCT" }
  ]
});
const site = ref(null);
const defaultQueryMonth = convertDate(moment(new Date()).subtract(1, 'months'));

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  month: defaultQueryMonth
});

const form = reactive({
  id: null,
  adjustType: null,
  adjustAmount: null,
  adjustReason: null
});

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) && charCode !== 46
  ) {
    event.preventDefault();
  }

  if (
    form.adjustAmount !== null &&
    form.adjustAmount.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault();
    }
  }
}

const formRules = reactive({
  adjustType: [required(t('message.validateAdjustTypeRequired'))],
  adjustAmount: [required(t('message.validateAdjustAmountRequired'))],
  adjustReason: [required(t('message.validateAdjustReasonRequired'))]
});

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function convertDate(date) {
  return moment(date).format('YYYY-MM');
}

function convertDateMinusOneMonth(date) {
  return moment(date).subtract(1, 'months').format('YYYY-MM');
}

function disabledDate(time) {
  return time.getTime() >= moment(new Date()).startOf('month').format('x');
}

function resetQuery() {
  request.month = null;
  request.siteId = site.value ? site.value.id : null;
};

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  return query;
}

async function loadSettlement() {
  uiControl.dialogVisible = false;
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getAffiliateSettlementChecking(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
};

function showDialog(type, adjust) {
  if (adjustForm.value) {
    adjustForm.value.resetFields();
  }
  if (type === "ADJUST") {
    form.id = adjust.id;
    uiControl.dialogTitle = t('fields.adjust');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

async function removeSettlementCheck(check) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await deleteSettlementChecking(check.id);
    await loadSettlement();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

async function toPay(check) {
  ElMessageBox.confirm(
    t('message.confirmToPay'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await updatetoPay(check.id);
    await loadSettlement();
    ElMessage({ message: t('message.settlementToPay'), type: "success" });
  });
}

async function adjust() {
  adjustForm.value.validate(async (valid) => {
    if (valid) {
      await adjustAmount(form.id, form);
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.adjustSuccess'), type: "success" });
      await loadSettlement();
    }
  });
}

onMounted(() => {
  loadSites();
  loadSettlement();
});

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.btn-group {
  margin-top: 15px;
  display: inline-flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
