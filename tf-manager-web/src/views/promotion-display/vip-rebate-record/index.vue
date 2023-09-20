<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
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
        </el-select>
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
          v-model="request.gameType"
          size="small"
          :placeholder="t('fields.gameType')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
          clearable
        >
          <el-option
            v-for="item in uiControl.gameType"
            :key="item.key"
            :label="t('gameType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          multiple
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="margin-left: 5px; width: 300px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadVipRebateRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <div class="btn-group">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:vip-rebate-record:rebate']" @click="distributeRebate()" :disabled="uiControl.rebateBtn">
            {{ t('fields.distributeRebate') }}
          </el-button>
          <el-button
            icon="el-icon-download"
            size="mini"
            type="warning"
            v-permission="['sys:vip-rebate-record:export']"
            @click="exportExcel"
          >{{ t('fields.exportToExcel') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.vipRebateRecord') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                @selection-change="handleSelectionChange"
                :empty-text="t('fields.noData')"
      >
        <el-table-column type="selection" width="55" :selectable="canSelectRow" />
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="120" />
        <el-table-column prop="vipName" :label="t('fields.vipLevel')" align="center" min-width="120" />
        <el-table-column prop="amount" :label="t('fields.amount')" align="center" min-width="100">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.amount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="140">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'CLAIMED'" size="mini" type="success">{{ t('vipRebateStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else size="mini" type="warning">{{ t('vipRebateStatus.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="platform" :label="t('fields.platform')" align="center" min-width="140">
          <template #default="scope">
            {{ scope.row.platform }}
          </template>
        </el-table-column>
        <el-table-column prop="gameType" :label="t('fields.gameType')" align="center" min-width="140">
          <template #default="scope">
            {{ t('gameType.' + scope.row.gameType) }}
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" :label="t('fields.rebateDistributeTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{data: scope.row.recordTime, formatter: 'YYYY-MM-DD', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="claimTime" :label="t('fields.claimTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.claimTime === null">-</span>
            <span
              v-if="scope.row.claimTime !== null"
              v-formatter="{data: scope.row.claimTime, formatter: 'YYYY-MM-DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="updateBy" :label="t('fields.updateBy')" align="center" min-width="140">
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
              v-formatter="{data: scope.row.updateTime, formatter: 'YYYY-MM-DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="230"
          v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:vip-rebate-record:update'])"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="mini"
              type="warning"
              v-permission="['sys:vip-rebate-record:update']"
              @click="showEdit(scope.row)"
            >
              {{ t('fields.adjustAmount') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="mini"
              type="success"
              v-permission="['sys:vip-rebate-record:rebate']"
              @click="distributeRebate(scope.row)"
            >
              {{ t('fields.distributeRebate') }}
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
        @size-change="loadVipRebateRecords()"
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
    :title="t('fields.adjustAmount')"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="580px"
  >
    <el-form
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
import { adjustAmount, distribute, getTotal, getVipRebateRecord } from '../../../api/vip-rebate-record';
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
const exportPercentage = ref(0);
let chooseRecords = [];
const uiControl = reactive({
  rebateBtn: true,
  dialogVisible: false,
  progressBarVisible: false,
  gameType: [
    { key: 1, displayName: "SLOT", value: "SLOT" },
    { key: 2, displayName: "LIVE", value: "LIVE" },
    { key: 3, displayName: "FISH", value: "FISH" },
    { key: 4, displayName: "SPORT", value: "SPORT" },
    { key: 5, displayName: "ESPORT", value: "ESPORT" },
    { key: 6, displayName: "POKER", value: "POKER" },
    { key: 7, displayName: "LOTTERY", value: "LOTTERY" }
  ],
  status: [
    { key: 1, displayName: t('vipRebateStatus.PENDING'), value: "PENDING" },
    { key: 2, displayName: t('vipRebateStatus.CLAIMED'), value: "CLAIMED" }
  ]
});

const EXPORT_HEADER = [t('fields.loginName'), t('fields.vipLevel'), t('fields.platform'), t('fields.gameType'), t('fields.amount'), t('fields.status'), t('fields.rebateDistributeTime'),
  t('fields.claimTime'), t('fields.updateBy'), t('fields.updateTime')];

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
  gameType: [],
  status: ["PENDING", "CLAIMED"]
});

function resetQuery() {
  request.recordTime = [defaultDate, defaultDate];
  request.siteId = siteList.list[0].id;
  request.loginName = null;
  request.gameType = [];
  request.status = ["PENDING", "CLAIMED"];
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

function handleSelectionChange(val) {
  chooseRecords = val;
  if (chooseRecords.length === 0) {
    uiControl.rebateBtn = true;
  } else {
    uiControl.rebateBtn = false;
  }
}

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

async function loadVipRebateRecords() {
  page.loading = true;
  const query = checkQuery();
  query.pagingState = page.pagingState
  const { data: ret } = await getVipRebateRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  const { data: total } = await getTotal(query);
  page.totalRebateAmount = total;
  page.loading = false;
}

function changepage(page) {
  request.current = page;
  loadVipRebateRecords();
}

function showEdit(adjust) {
  if (adjustForm.value) {
    adjustForm.value.resetFields()
  }
  form.id = adjust.id
  uiControl.dialogTitle = t('fields.adjust')
  uiControl.dialogVisible = true
}

function canSelectRow(row) {
  return row.status !== 'CLAIMED';
}

async function adjust() {
  adjustForm.value.validate(async valid => {
    if (valid) {
      await adjustAmount(form.id, form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.adjustSuccess'), type: 'success' })
      await loadVipRebateRecords()
    }
  });
}

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getVipRebateRecord(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getVipRebateRecord(query);
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
  wb.SheetNames.push('VIP_Rebate_Record');
  wb.Sheets.VIP_Rebate_Record = ws;
  XLSX.writeFile(wb, "vip_rebate_record.xlsx");
  exportPercentage.value = 100;
}

function pushRecordToData(records, exportData) {
  records.forEach(item => {
    delete item.id;
    delete item.memberId;
    delete item.vipId;
  })
  const data = records.map(record => Object.values(record).map(item => !item || item === '' ? '-' : item));
  exportData.push(...data);
}

function distributeRebate(row) {
  ElMessageBox.confirm(
    t('message.confirmRebate'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    const form = {};
    if (row) {
      form.ids = [row.id]
    } else {
      form.ids = chooseRecords.map(r => r.id).join(',');
    }
    form.siteId = request.siteId;
    await distribute(form);
    await loadVipRebateRecords();
    ElMessage({ message: t('message.rebateSuccess'), type: "success" });
  });
}

onMounted(async() => {
  await loadSites();
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
