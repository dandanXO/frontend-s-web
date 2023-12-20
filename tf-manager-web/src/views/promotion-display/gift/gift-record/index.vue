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
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.code')"
        />
        <el-select
          v-model="request.type"
          size="small"
          :placeholder="t('fields.type')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
        >
          <el-option
            v-for="item in uiControl.type"
            :key="item.key"
            :label="t('giftType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.giftOrderRecord.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadGiftRecord">
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
        <el-form-item v-if="uiControl.dialogType === 'DELIVER'" :label="t('fields.orderTrackingNo')" prop="orderTrackingNo">
          <el-input v-model="form.orderTrackingNo" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'DELIVER'" :label="t('fields.expressCompany')" prop="expressCompany">
          <el-input v-model="form.expressCompany" style="width: 350px;" maxlength="50" />
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
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="150" />
      <el-table-column prop="giftCode" :label="t('fields.giftCode')" width="150" />
      <el-table-column prop="giftName" :label="t('fields.giftName')" width="150" />
      <el-table-column prop="giftType" :label="t('fields.type')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.giftType === 'ENTITY'" size="mini">{{ t('giftType.' + scope.row.giftType) }}</el-tag>
          <el-tag v-if="scope.row.giftType === 'VIRTUAL'" type="warning" size="mini">{{ t('giftType.' + scope.row.giftType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="recipient" :label="t('fields.recipient')" width="150" />
      <el-table-column prop="address" :label="t('fields.address')" width="150" />
      <el-table-column prop="recipientTelephone" :label="t('fields.recipientTelephone')" width="150" />
      <el-table-column prop="status" :label="t('fields.status')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'PROCESSING'" size="mini">{{ t('status.giftOrderRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'DELIVERING'" type="warning" size="mini">{{ t('status.giftOrderRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CASH' || scope.row.status === 'DELIVERED'" type="success" size="mini">{{ t('status.giftOrderRecord.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CANCEL'" type="danger" size="mini">{{ t('status.giftOrderRecord.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="redeemPoints" :label="t('fields.redeemPoints')" width="140">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.redeemPoints, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="t('fields.remark')" width="200" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateBy === null">-</span>
          <span v-else>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="200">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:gift-record:cancel']) || hasPermission(['sys:gift-record:redeem-cash']) || hasPermission(['sys:gift-record:deliver']))"
        :label="t('fields.operate')"
        align="center"
        fixed="right"
        width="300"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'PROCESSING'"
            size="small"
            type="success"
            v-permission="['sys:gift-record:redeem-cash']"
            @click="showMessageBox('REDEEM', scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.redeemCash') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'PROCESSING'"
            size="small"
            type="warning"
            v-permission="['sys:gift-record:deliver']"
            @click="showDialog('DELIVER', scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.deliver') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'PROCESSING'"
            size="small"
            type="danger"
            v-permission="['sys:gift-record:cancel']"
            @click="showDialog('CANCEL', scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.cancel') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'DELIVERING'"
            size="small"
            type="success"
            v-permission="['sys:gift-record:deliver']"
            @click="showMessageBox('DELIVERED', scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.delivered') }}
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
      @current-change="loadGiftRecord"
      @size-change="loadGiftRecord"
    />
  </div>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSiteListSimple } from "@/api/site";
import { getGiftRecord, redeemGiftRecordCash, cancelGiftRecord, deliverGift, giftDelivered } from "@/api/gift";
import { hasRole, hasPermission } from "@/utils/util";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  transactionId: null,
  status: null,
  type: null
});

const recordForm = ref(null);
const sites = reactive({
  list: []
});
let timeZone = null

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "REDEEM",
  removeBtn: true,
  status: [
    { key: 1, displayName: 'PENDING', value: 'PENDING' },
    { key: 2, displayName: 'PROCESSING', value: 'PROCESSING' },
    { key: 3, displayName: 'COMPLETE', value: 'COMPLETE' },
    { key: 4, displayName: 'EXPIRED', value: 'EXPIRED' },
    { key: 5, displayName: 'FAILED', value: 'FAILED' }
  ],
  type: [
    { key: 1, displayName: 'ENTITY', value: 'ENTITY' },
    { key: 2, displayName: 'VIRTUAL', value: 'VIRTUAL' }
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
  remark: null,
  orderTrackingNo: null,
  expressCompany: null
});

const formRules = reactive({
  remark: [required(t('message.validateRemarkRequired'))],
  orderTrackingNo: [required(t('message.validateOrderTrackingNoRequired'))],
  expressCompany: [required(t('message.validateExpressCompanyRequired'))]
});

async function loadGiftRecord() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getGiftRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  timeZone = sites.list.find(e => e.id === request.siteId).timeZone
  page.loading = false;
}

function showMessageBox(type, id) {
  if (type === 'REDEEM') {
    ElMessageBox.confirm(
      t('message.confirmRedeem'),
      {
        confirmButtonText: t('fields.confirm'),
        cancelButtonText: t('fields.cancel'),
        type: "warning"
      }
    ).then(async () => {
      await redeemGiftRecordCash(id);
      await loadGiftRecord();
      ElMessage({ message: t('message.redeemCashSuccess'), type: "success" });
    });
  } else if (type === 'DELIVERED') {
    ElMessageBox.confirm(
      t('message.confirmDelivered'),
      {
        confirmButtonText: t('fields.confirm'),
        cancelButtonText: t('fields.cancel'),
        type: "warning"
      }
    ).then(async () => {
      await giftDelivered(id);
      await loadGiftRecord();
      ElMessage({ message: t('message.giftDelivered'), type: "success" });
    });
  }
}

function showDialog(type, row) {
  if (recordForm.value) {
    recordForm.value.resetFields();
  }
  if (type === 'CANCEL') {
    uiControl.dialogTitle = t('fields.cancelGift');
  } else if (type === 'DELIVER') {
    uiControl.dialogTitle = t('fields.deliverGift');
  }
  form.id = row.id;
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function submit() {
  if (uiControl.dialogType === 'DELIVER') {
    deliver()
  }
  if (uiControl.dialogType === 'CANCEL') {
    cancel()
  }
}

function deliver() {
  recordForm.value.validate(async (valid) => {
    if (valid) {
      await deliverGift(form);
      uiControl.dialogVisible = false;
      await loadGiftRecord();
      ElMessage({ message: t('message.giftOutForDelivery'), type: "success" });
    }
  });
}

function cancel() {
  recordForm.value.validate(async (valid) => {
    if (valid) {
      await cancelGiftRecord(form);
      uiControl.dialogVisible = false;
      await loadGiftRecord();
      ElMessage({ message: t('message.cancelSuccess'), type: "success" });
    }
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.loginName = null;
  request.transactionId = null;
  request.status = null;
  request.type = null;
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadGiftRecord();
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
