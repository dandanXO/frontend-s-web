<template>
  <div class="roles-main">
    <div class="header-container" style="margin-bottom: 40px">
      <div class="search">
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
          @change="loadPlatformNames"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-input v-model="request.memberName" size="small" style="width: 180px; margin-left: 5px" :placeholder="t('fields.loginName')" />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
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
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.type"
          size="small"
          :placeholder="t('fields.transferType')"
          class="filter-item"
          style="width: 150px; margin-left: 5px"
        >
          <el-option
            v-for="item in transferTypes.list"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="request.times"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px; margin-left: 5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
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
        <el-form-item :label="t('fields.loginName')" prop="memberName">
          <el-input disabled v-model="form.memberName" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.transferId')" prop="serialNumber">
          <el-input disabled v-model="form.serialNumber" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group v-model="form.status" size="mini" style="width: 300px">
            <el-radio-button label="SUCCESS">{{ t('transfer.status.success') }}</el-radio-button>
            <el-radio-button label="FAIL">{{ t('transfer.status.fail') }}</el-radio-button>
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
      <el-table-column prop="site" :label="t('fields.site')" width="120" />
      <el-table-column prop="memberName" :label="t('fields.loginName')" width="150" />
      <el-table-column prop="serialNumber" :label="t('fields.transferId')" width="250" />
      <el-table-column prop="transferDate" :label="t('fields.transferTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.transferDate === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.transferDate !== null"
            v-formatter="{
              data: scope.row.transferDate,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="t('fields.transferType')" width="100" />
      <el-table-column prop="amount" :label="t('fields.amount')" width="100" />
      <el-table-column prop="platformName" :label="t('fields.platform')" width="100" />
      <el-table-column prop="status" :label="t('fields.status')" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'SENDING'">{{ t('transfer.status.sending') }}</el-tag>
          <el-tag v-if="scope.row.status === 'SUCCESS'" type="success">{{ t('transfer.status.success') }}</el-tag>
          <el-tag v-if="scope.row.status === 'FAIL'" type="danger">{{ t('transfer.status.fail') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="100">
        <template #default="scope">
          <span v-if="scope.row.updateBy === null">-</span>
          <span v-else>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:member:transfer:update'])"
      >
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

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { hasRole, hasPermission } from "../../../utils/util";
import { required } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import { getTransferRecords, update } from "../../../api/transfer";
import { getPlatformNames } from "../../../api/platform";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { getSiteListSimple } from "../../../api/site";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const transferForm = ref(null);
const siteList = reactive({
  list: []
});

const shortcuts = getShortcuts(t);
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

const startDate = new Date();
startDate.setDate(startDate.getDate() - 2);
const defaultStartDate = convertDate(startDate);
const defaultEndDate = convertDate(new Date());

const request = reactive({
  size: 30,
  current: 1,
  memberName: null,
  status: null,
  platformCode: null,
  type: null,
  times: [defaultStartDate, defaultEndDate],
  siteId: null
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

const form = reactive({
  id: null,
  memberName: null,
  serialNumber: null,
  status: null,
  remark: null,
  date: null
});

const formRules = reactive({
  status: [required(t('message.validateStatusRequired'))],
  remark: [required(t('message.validateRemarkRequired'))]
});

const status = reactive({
  list: [
    { key: 1, name: t('transfer.status.sending'), value: "SENDING" },
    { key: 2, name: t('transfer.status.success'), value: "SUCCESS" },
    { key: 3, name: t('transfer.status.fail'), value: "FAIL" },
  ]
})

const platforms = reactive({
  list: []
})

const transferTypes = reactive({
  list: [
    { key: 1, name: t('transfer.type.deposit'), value: "DEPOSIT" },
    { key: 2, name: t('transfer.type.withdraw'), value: "WITHDRAW" }
  ]
})

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function resetQuery() {
  request.memberName = null;
  request.status = null;
  request.platformCode = null;
  request.type = null;
  request.times = [defaultStartDate, defaultEndDate];
  request.siteId = store.state.user.siteId
  loadPlatformNames()
}

async function loadTransferRecords() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
    if (request.siteId === null) {
      const siteIdList = siteList.list.map(s => s.id);
      query.siteId = siteIdList.join(',');
    }
    if (request.times && request.times.length === 2) {
      let timeZone = null
      if (request.siteId) {
        timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
      }
      query.times = JSON.parse(JSON.stringify(request.times));
      query.times[0] = formatInputTimeZone(query.times[0], timeZone, 'start');
      query.times[1] = formatInputTimeZone(query.times[1], timeZone, 'end');
      query.times = query.times.join(',')
    }
  });
  const { data: ret } = await getTransferRecords(query);
  page.pages = ret.pages;
  ret.records.forEach(data => {
    data.timeZone = siteList.list.find(e => e.siteName === data.site) !== undefined
      ? siteList.list.find(e => e.siteName === data.site).timeZone
      : null
  });
  page.records = ret.records;
  page.loading = false;
}

async function loadPlatformNames() {
  const { data: ret } = await getPlatformNames(request.siteId);
  platforms.list = ret;
}

function changePage(page) {
  request.current = page;
  loadTransferRecords();
}

function showDialog() {
  uiControl.dialogTitle = t('fields.supplement');
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
      if (request.times && request.times.length === 2) {
        const query = {};
        let timeZone = null
        if (request.siteId) {
          timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
        }
        query.times = JSON.parse(JSON.stringify(request.times));
        query.times[0] = formatInputTimeZone(query.times[0], timeZone, 'start', 'YYYY-MM-DD');
        query.times[1] = formatInputTimeZone(query.times[1], timeZone, 'end', 'YYYY-MM-DD');
        query.times = query.times.join(',')
        form.date = query.times;
      }

      try {
        await update(form);
        uiControl.dialogLoading = false;
        uiControl.dialogVisible = false;
        await loadTransferRecords();
        ElMessage({ message: t('message.validateSuccess'), type: "success" });
      } catch (error) {
      } finally {
        uiControl.dialogLoading = false;
      }
    }
    uiControl.dialogLoading = false;
  });
}

function submit() {
  uiControl.dialogLoading = true;
  validate();
}

onMounted(async() => {
  await loadSites();
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  loadPlatformNames();
  await loadTransferRecords();
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
