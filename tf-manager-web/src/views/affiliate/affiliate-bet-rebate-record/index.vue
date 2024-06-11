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
          style="margin-left: 5px; width: 250px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          style="margin-left: 5px; width: 150px;"
          size="small"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          v-model="request.gameType"
          size="small"
          :placeholder="t('fields.gameType')"
          class="filter-item"
          style="margin-left: 5px; width: 120px;"
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
            :label="t('distributeStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadAffiliateBetRebateRecords()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        <div class="btn-group">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:affiliate-bet-rebate-record:rebate']" @click="distributeRebate()">
            {{ t('fields.distributeRebate') }}
          </el-button>
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:affiliate-bet-rebate-record:rebate']" @click="batchDistributeRebate()" :disabled="uiControl.batchDistributeBtn">
            {{ t('fields.batchDistributeRebate') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateBetRebateRecord') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
                sortable
                @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="loginName" :label="t('fields.affiliateName')" align="center" min-width="120">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/affiliate/details/${scope.row.affiliateId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="betAmount" :label="t('fields.betAmount')" align="center" min-width="100" sortable>
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.betAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="rebateAmount" :label="t('fields.rebateAmount')" align="center" min-width="100" sortable>
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.rebateAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'DISTRIBUTED'" size="mini" type="success">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else-if="scope.row.status === 'IN_PROGRESS'" size="mini" type="warning">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else-if="scope.row.status === 'PENDING'" size="mini" type="primary">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-else size="mini" type="danger">{{ t('distributeStatus.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gameType" :label="t('fields.gameType')" align="center" min-width="100">
          <template #default="scope">
            {{ t('gameType.' + scope.row.gameType) }}
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
          width="200"
          v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:affiliate-bet-rebate-record:update']) || hasPermission(['sys:affiliate-bet-rebate-record:update-bet']) || hasPermission(['sys:affiliate-bet-rebate-record:detail']))"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="warning"
              v-permission="['sys:affiliate-bet-rebate-record:detail']"
              @click="showDetails(scope.row)"
            >
              {{ t('fields.view') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="mini"
              type="success"
              v-permission="['sys:affiliate-bet-rebate-record:update']"
              @click="showEdit('AMOUNT', scope.row)"
            >
              {{ t('fields.adjustAmount') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="mini"
              type="success"
              v-permission="['sys:affiliate-bet-rebate-record:update-bet']"
              @click="showEdit('BET_AMOUNT', scope.row)"
            >
              {{ t('fields.adjustBetAmount') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="mini"
              type="success"
              v-permission="['sys:affiliate-bet-rebate-record:rebate']"
              @click="batchDistributeRebate(scope.row.id)"
            >
              {{ t('fields.distribute') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:10px;">
        <span>{{ t('fields.totalValidBet') }}: $ <span v-formatter="{data: page.totalValidBet,type: 'money'}" /></span>
        <span style="margin-left:20px;">{{ t('fields.totalRebateAmount') }}: $ <span v-formatter="{data: page.totalRebateAmount,type: 'money'}" /></span>
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
        @size-change="loadAffiliateBetRebateRecords()"
      />
    </el-card>
  </div>

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
        :label="t('fields.adjustRebateAmount')"
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
    <el-form
      v-else-if="uiControl.dialogType === 'ADJUST_BET'"
      ref="adjustForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item
        :label="t('fields.adjustBetAmount')"
        prop="betAmount"
        @keypress="restrictDecimalInput($event)"
      >
        <el-input v-model="form.betAmount" style="width: 350px;" />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="adjustBet">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
    <el-table
      v-else
      size="small"
      :data="recordDetails"
      row-key="id"
      v-loading="page.detailsLoading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="120">
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="betAmount" :label="t('fields.betAmount')" align="center" min-width="100">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.betAmount,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="rebateAmount" :label="t('fields.rebateAmount')" align="center" min-width="100">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.rebateAmount,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="rebatePercentage" :label="t('fields.rebatePercentage')" align="center" min-width="120">
        <template #default="scope">
          {{ (scope.row.rebatePercentage*100).toFixed(2) }} %
        </template>
      </el-table-column>
      <el-table-column prop="gameType" :label="t('fields.gameType')" align="center" min-width="100">
        <template #default="scope">
          {{ t('gameType.' + scope.row.gameType) }}
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
    </el-table>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { hasRole, hasPermission } from '../../../utils/util'
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from '../../../api/site';
import { useStore } from '../../../store';
import { TENANT } from '../../../store/modules/user/action-types';
import { getAffiliateBetRebateRecord, adjustRebateAmount, adjustBetAmount, distribute, getTotal, batchDistribute } from '../../../api/affiliate-bet-rebate-record';
import { required } from '../../../utils/validate';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAffiliateBetRebateRecordDetail } from '../../../api/affiliate-bet-rebate-record-detail';

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const adjustForm = ref(null)
const recordDetails = ref([])
const site = ref(null)
const siteList = reactive({
  list: []
});
let timeZone = null;
const uiControl = reactive({
  dialogTitle: "",
  dialogType: "",
  dialogVisible: false,
  dialogWidth: '580px',
  messageVisible: false,
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
    { key: 1, displayName: "PENDING", value: "PENDING" },
    { key: 2, displayName: "IN_PROGRESS", value: "IN_PROGRESS" },
    { key: 3, displayName: "DISTRIBUTED", value: "DISTRIBUTED" },
    { key: 4, displayName: "CANCEL", value: "CANCEL" }
  ],
  importDialogVisible: false,
  batchDistributeBtn: true,
});

const form = reactive({
  id: null,
  amount: null,
  betAmount: null
})

const defaultDate = convertDate(new Date());

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultDate, defaultDate],
  siteId: null,
  loginName: null,
  gameType: [],
  status: ["PENDING", "IN_PROGRESS", "DISTRIBUTED", "CANCEL"]
});

let chooseRecords = [];

function resetQuery() {
  request.recordTime = [defaultDate, defaultDate];
  request.siteId = siteList.list[0].id;
  request.loginName = null;
  request.gameType = [];
  request.status = ["PENDING", "IN_PROGRESS", "DISTRIBUTED", "CANCEL"];
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  detailsLoading: false,
  totalRebateAmount: 0,
  totalValidBet: 0
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
  amount: [required(t('message.validateAmountRequired'))],
  betAmount: [required(t('message.validateBetAmountRequired'))],
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

async function loadAffiliateBetRebateRecords() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getAffiliateBetRebateRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  const { data: total } = await getTotal(query);
  page.totalRebateAmount = total.totalRebate;
  page.totalValidBet = total.totalValidBet;

  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  chooseRecords = []
  page.loading = false;
}

function changepage(page) {
  request.current = page;
  loadAffiliateBetRebateRecords();
}

function showEdit(type, adjust) {
  if (adjustForm.value) {
    adjustForm.value.resetFields()
  }
  form.id = adjust.id
  if (type === 'AMOUNT') {
    uiControl.dialogTitle = t('fields.adjustRebateAmount')
    uiControl.dialogType = 'ADJUST'
  } else if (type === 'BET_AMOUNT') {
    uiControl.dialogTitle = t('fields.adjustBetAmount')
    uiControl.dialogType = 'ADJUST_BET'
  }
  uiControl.dialogWidth = '580px'
  uiControl.dialogVisible = true
}

async function showDetails(record) {
  uiControl.dialogTitle = t('fields.affiliateBetRebateDetails')
  uiControl.dialogType = 'DETAILS'
  uiControl.dialogWidth = '1000px'
  uiControl.dialogVisible = true

  const query = {};
  query.siteId = request.siteId;
  query.affiliateId = record.affiliateId;
  query.recordTime = record.recordTime;
  query.gameType = record.gameType;

  page.detailsLoading = true;
  const { data: ret } = await getAffiliateBetRebateRecordDetail(query);
  recordDetails.value = ret;
  page.detailsLoading = false;
}

async function adjust() {
  adjustForm.value.validate(async valid => {
    if (valid) {
      await adjustRebateAmount(form.id, form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.adjustSuccess'), type: 'success' })
      await loadAffiliateBetRebateRecords()
    }
  });
}

async function adjustBet() {
  adjustForm.value.validate(async valid => {
    if (valid) {
      await adjustBetAmount(form.id, form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.adjustSuccess'), type: 'success' })
      await loadAffiliateBetRebateRecords()
    }
  });
}

async function distributeRebate() {
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
    loadAffiliateBetRebateRecords()
  });
}

function batchDistributeRebate(id) {
  ElMessageBox.confirm(
    id ? t('message.confirmSingleRebate') : t('message.confirmBatchRebate'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(() => {
    if (id) {
      batchDistribute(id);
    } else {
      const idsList = chooseRecords.map(r => r.id).join(',');
      batchDistribute(idsList);
    }
    ElMessage({ message: t('message.rebateSuccess'), type: "success" });
    loadAffiliateBetRebateRecords()
  });
}

function handleSelectionChange(val) {
  chooseRecords = val;
  if (chooseRecords.length === 0) {
    uiControl.batchDistributeBtn = true;
  } else {
    uiControl.batchDistributeBtn = false;
  }
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

  .el-button {
    margin-top: 5px;
  }
  </style>
