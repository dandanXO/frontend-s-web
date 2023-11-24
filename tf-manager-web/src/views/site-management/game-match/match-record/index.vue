<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;"
          @focus="loadSites"
          @change="siteChanged"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.transactionId"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.transactionId')"
        />
        <el-select
          v-model="request.vipId"
          size="small"
          :placeholder="t('fields.vipLevel')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
          @focus="loadVips"
        >
          <el-option
            v-for="item in vipList.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="btn-group">
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.gameMatchRecord.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.gameType"
          size="small"
          :placeholder="t('fields.gameType')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
        >
          <el-option
            v-for="item in uiControl.gameType"
            :key="item.key"
            :label="t('gameType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadGameMatchRecord">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
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
        ref="recordForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item v-if="uiControl.dialogType === 'SETTLE'" :label="t('fields.amount')" prop="amount">
          <el-input v-model="form.amount" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CANCEL'" :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="6" style="width: 350px;" maxlength="500" show-word-limit />
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
      v-loading="page.loading"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="siteName" :label="t('fields.site')" width="120" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="150" />
      <el-table-column prop="vipName" :label="t('fields.vipLevel')" width="120" />
      <el-table-column prop="matchTitle" :label="t('fields.matchTitle')" width="280" />
      <el-table-column prop="gameType" :label="t('fields.gameType')" width="140">
        <template #default="scope">
          <span>{{ t('gameType.' + scope.row.gameType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transactionId" :label="t('fields.transactionId')" width="180" />
      <el-table-column prop="status" :label="t('fields.status')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'PENDING_MATCH'" size="mini">{{ t('status.gameMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'PENDING_SETTLE'" type="warning" size="mini">{{ t('status.gameMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'SETTLED'" type="success" size="mini">{{ t('status.gameMatchRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CANCEL'" type="danger" size="mini">{{ t('status.gameMatchRecord.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" :label="t('fields.matchTime')" width="200" />
      <el-table-column prop="amount" :label="t('fields.amount')" width="140">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.amount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="t('fields.remark')" width="150">
        <template #default="scope">
          <span v-if="scope.row.remark === null">-</span>
          <span v-else>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateBy === null">-</span>
          <span v-else>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="200">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span v-else>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:game-match-record:update'])"
        :label="t('fields.operate')"
        align="center"
        fixed="right"
        width="200"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'PENDING_SETTLE'"
            size="small"
            type="success"
            v-permission="['sys:game-match-record:update']"
            @click="showDialog('SETTLE', scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.settle') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'PENDING_SETTLE'"
            size="small"
            type="danger"
            v-permission="['sys:game-match-record:update']"
            @click="showDialog('CANCEL', scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.cancel') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadGameMatchRecord"
      @size-change="loadGameMatchRecord"
    />
  </div>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage } from "element-plus";
import { getSiteListSimple } from "@/api/site";
import { getGameMatchRecord, settleRecord, cancelRecord } from "@/api/game-match";
import { hasRole, hasPermission } from "@/utils/util";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { getShortcuts } from "@/utils/datetime";
import { getVipList } from "../../../../api/vip";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const shortcuts = getShortcuts(t);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  transactionId: null,
  status: null,
  createTime: [convertDate(new Date()), convertDate(new Date())],
  gameType: null,
  vipId: null
});

const recordForm = ref(null);
const sites = reactive({
  list: []
});
const vipList = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true,
  status: [
    { key: 1, displayName: 'PENDING_MATCH', value: 'PENDING_MATCH' },
    { key: 2, displayName: 'PENDING_SETTLE', value: 'PENDING_SETTLE' },
    { key: 3, displayName: 'SETTLED', value: 'SETTLED' },
    { key: 4, displayName: 'CANCEL', value: 'CANCEL' }
  ],
  gameType: [
    { key: 1, displayName: 'SPORT', value: 'SPORT' },
    { key: 2, displayName: 'ESPORT', value: 'ESPORT' },
  ]
});
const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const form = reactive({
  id: null,
  amount: null,
  remark: null
});

const formRules = reactive({
  amount: [required(t('message.validateAmountRequired'))],
  remark: [required(t('message.validateRemarkRequired'))]
});

async function loadGameMatchRecord() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = request.createTime.join(",");
    }
  }
  const { data: ret } = await getGameMatchRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

function showDialog(type, id) {
  if (recordForm.value) {
    recordForm.value.resetFields();
  }
  if (type === 'SETTLE') {
    uiControl.dialogTitle = t('fields.settleGameMatch');
  } else if (type === 'CANCEL') {
    uiControl.dialogTitle = t('fields.cancelGameMatch');
  }
  form.id = id;
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function submit() {
  if (uiControl.dialogType === 'SETTLE') {
    settle()
  }
  if (uiControl.dialogType === 'CANCEL') {
    cancel()
  }
}

function settle() {
  console.log('settle')
  recordForm.value.validate(async(valid) => {
    if (valid) {
      await settleRecord(form);
      uiControl.dialogVisible = false;
      await loadGameMatchRecord();
      ElMessage({ message: t('message.gameMatchEnded'), type: "success" });
    }
  })
}

function cancel() {
  console.log('cancel')
  recordForm.value.validate(async (valid) => {
    if (valid) {
      await cancelRecord(form);
      uiControl.dialogVisible = false;
      await loadGameMatchRecord();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

async function loadVips() {
  const { data: vip } = await getVipList({ siteId: request.siteId });
  vipList.list = vip;
};

async function siteChanged() {
  request.vipId = null;
  await loadVips();
}

function resetQuery() {
  request.siteId = site.value.id;
  request.loginName = null;
  request.transactionId = null;
  request.status = null;
  request.createTime = [convertDate(new Date()), convertDate(new Date())];
  request.gameType = null;
  request.vipId = null;
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadVips();
  await loadGameMatchRecord();
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

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}
</style>
