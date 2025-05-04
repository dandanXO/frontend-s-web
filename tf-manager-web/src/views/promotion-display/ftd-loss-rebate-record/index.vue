<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          style="width: 120px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 380px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          style="margin-left: 5px; width: 200px;"
          size="small"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          multiple
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="margin-left: 5px; width: 220px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('distributeStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadLossRebateRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <div class="btn-group">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:promo:ftd-loss-rebate-record:rebate']" @click="distributeRebate()">
            {{ t('fields.distributeRebate') }}
          </el-button>
          <el-button
            icon="el-icon-download"
            size="mini"
            type="warning"
            v-permission="['sys:ftd-loss-rebate-record:export']"
            @click="exportExcel"
          >{{ t('fields.exportToExcel') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.ftdLossRebateRecord') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
                @sort-change="sort"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="120">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="loss" :label="t('fields.lossAmount')" align="center" min-width="100" sortable>
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.loss,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="rebateBase" :label="t('fields.rebateBase')" align="center" min-width="100" sortable>
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.rebateBase,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="rebatePercentage" :label="t('fields.rebatePercentage')" align="center" min-width="100" sortable>
          <template #default="scope">
            {{ Number(scope.row.rebatePercentage).toFixed(2) }} %
          </template>
        </el-table-column>
        <el-table-column prop="rebate" :label="t('fields.rebateAmount')" align="center" min-width="100" sortable>
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.rebate,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'DISTRIBUTED'" size="mini" type="success">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else size="mini" type="warning">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" :label="t('fields.rebateDistributeTime')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{data: scope.row.recordTime, formatter: 'YYYY-MM-DD', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="distributeBy" :label="t('fields.distributeBy')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.distributeBy === null">-</span>
            <span v-else>{{ scope.row.distributeBy }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distributeTime" :label="t('fields.distributeTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.distributeTime === null">-</span>
            <span
              v-if="scope.row.distributeTime !== null"
              v-formatter="{data: scope.row.distributeTime, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="updateBy" :label="t('fields.updateBy')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.updateBy === null">-</span>
            <span v-else>{{ scope.row.updateBy }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="t('fields.updateTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.updateTime === null">-</span>
            <span
              v-if="scope.row.updateTime !== null"
              v-formatter="{data: scope.row.updateTime, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="220"
          v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:promo:ftd-loss-rebate-record:update'])"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="mini"
              type="success"
              v-permission="['sys:promo:ftd-loss-rebate-record:update']"
              @click="showEdit(scope.row)"
            >
              {{ t('fields.adjustAmount') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:10px;">
        <span>{{ t('fields.totalRebateAmount') }}: $ <span v-formatter="{data: page.totalRebateAmount,type: 'money'}" /></span>
      </div>
      <el-pagination
        class="pagination"
        :total="page.total"
        :page-sizes="[20, 50, 100, 150, 200]"
        @current-change="changepage"
        layout="total,sizes,prev, pager, next"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @size-change="loadLossRebateRecords()"
      />
    </el-card>
  </div>

  <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.progressBarVisible" append-to-body width="500px"
             :close-on-click-modal="false" :close-on-press-escape="false"
  >
    <el-progress :text-inside="true" :stroke-width="26" :percentage="exportPercentage"
                 :color="uiControl.colors" v-if="exportPercentage !== 100"
    />
    <el-result
      icon="success"
      :title="t('fields.successfullyExport')"
      v-if="exportPercentage === 100"
    />
    <div class="dialog-footer">
      <el-button type="primary" :disabled="exportPercentage !== 100"
                 @click="uiControl.progressBarVisible = false"
      >{{ t('fields.done') }}
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    :width="uiControl.dialogWidth"
  >
    <el-form
      v-if="uiControl.dialogType === 'ADJUST'"
      ref="adjustForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item
        :label="t('fields.adjustAmount')"
        prop="amount"
        @keypress="restrictDecimalInput($event)"
      >
        <el-input v-model="form.amount" style="width: 350px;" />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="adjust">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { hasRole, hasPermission } from '../../../utils/util'
import * as XLSX from 'xlsx';
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '../../../api/site';
import { useStore } from '../../../store';
import { TENANT } from '../../../store/modules/user/action-types';
import { adjustAmount, distribute, getTotal, getLossRebateRecord } from '../../../api/ftd-loss-rebate-record';
import { required } from '../../../utils/validate';
import { ElMessage, ElMessageBox } from 'element-plus';

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const adjustForm = ref(null)
const site = ref(null)
const siteList = reactive({
  list: []
});
let timeZone = null
const exportPercentage = ref(0);
const uiControl = reactive({
  dialogTitle: "",
  dialogType: "",
  dialogVisible: false,
  dialogWidth: '580px',
  progressBarVisible: false,
  status: [
    { key: 1, displayName: "PENDING", value: "PENDING" },
    { key: 2, displayName: "DISTRIBUTED", value: "DISTRIBUTED" }
  ]
});

const EXPORT_HEADER = [t('fields.loginName'), t('fields.site'), t('fields.lossAmount'), t('fields.amount'),
  t('fields.status'), t('fields.rebateDistributeTime'), t('fields.distributeBy'), t('fields.distributeTime'),
  t('fields.updateBy'), t('fields.updateTime')];

const form = reactive({
  id: null,
  amount: null
})

const defaultDate = convertDate(new Date());

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultDate, defaultDate],
  siteId: null,
  loginName: null,
  status: ["PENDING", "DISTRIBUTED"]
});

function resetQuery() {
  request.recordTime = [defaultDate, defaultDate];
  request.siteId = store.state.user.siteId
  request.loginName = null;
  request.status = ["PENDING", "DISTRIBUTED"];
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  totalRebateAmount: 0
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    form.amount !== null &&
    form.amount.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
  }
}

const formRules = reactive({
  amount: [required(t('message.validateAmountRequired'))]
})

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
  request.siteId = siteList.list[0].id;
};

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(",");
    }
  }
  if (request.status !== null) {
    if (request.status.length === 1) {
      query.status = request.status[0];
    } else {
      query.status = request.status.join(",");
    }
  }
  return query;
}

async function loadLossRebateRecords() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getLossRebateRecord(query);
  page.pages = ret.pages;
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  page.records = ret.records;
  page.total = ret.total;
  const { data: total } = await getTotal(query);
  page.totalRebateAmount = total;
  page.loading = false;
}

function changepage(page) {
  request.current = page;
  loadLossRebateRecords();
}

function showEdit(adjust) {
  if (adjustForm.value) {
    adjustForm.value.resetFields()
  }
  form.id = adjust.id
  uiControl.dialogTitle = t('fields.adjustAmount')
  uiControl.dialogType = 'ADJUST'
  uiControl.dialogWidth = '580px'
  uiControl.dialogVisible = true
}

async function adjust() {
  adjustForm.value.validate(async valid => {
    if (valid) {
      await adjustAmount(form.id, form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.adjustSuccess'), type: 'success' })
      await loadLossRebateRecords()
    }
  });
}

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getLossRebateRecord(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getLossRebateRecord(query);
    pushRecordToData(ret.records, exportData);
    exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  }
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key];

      maxLength[key] = typeof value === 'number'
        ? (maxLength[key] >= 10 ? maxLength[key] : 10)
        : (maxLength[key] >= value.length + 2 ? maxLength[key] : value.length + 2);
    });
  });
  const wsCols = maxLength.map(w => { return { width: w } });
  ws['!cols'] = wsCols;
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Loss_Rebate_Record');
  wb.Sheets.Loss_Rebate_Record = ws;
  XLSX.writeFile(wb, "loss_rebate_record.xlsx");
  exportPercentage.value = 100;
}

function pushRecordToData(records, exportData) {
  records.forEach(item => {
    delete item.id;
    delete item.memberId;
    delete item.siteId;
  })
  const data = records.map(record => {
    record.status = t('distributeStatus.' + record.status);
    return Object.values(record).map(item => !item || item === '' ? '-' : item)
  });
  exportData.push(...data);
}

function distributeRebate() {
  ElMessageBox.confirm(
    t('message.confirmRebate'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(() => {
    const query = checkQuery();
    distribute(query);
    ElMessage({ message: t('message.rebateSuccess'), type: "success" });
  });
}

const sort = (column) => {
  request.orderBy = column.prop;
  if (column.order === "descending") {
    request.sortType = "DESC";
  } else {
    request.sortType = "ASC";
  }
  loadLossRebateRecords();
};

onMounted(async() => {
  await loadSites();
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
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
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
