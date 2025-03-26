<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 320px;margin-right: 10px"
          :placeholder="t('fields.withdrawName')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadWithdrawPlatform"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:payment:withdraw:add']" @click="showDialog('CREATE')">{{ t('fields.add') }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="1100px"
    >
      <el-form
        ref="withdrawPlatformForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="190px"
      >
        <el-row>
          <el-form-item :label="t('fields.site')" prop="siteId">
            <el-select
              v-model="form.siteId"
              size="small"
              :placeholder="t('fields.site')"
              style="width: 320px;"
              default-first-option
              @focus="loadSites"
              @change="filterPayTypeByCurrency(form.siteId)"
            >
              <el-option
                v-for="item in siteList.list"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.withdrawPlatformName')" prop="name">
            <el-input v-model="form.name" style="width: 320px;" />
          </el-form-item>
          <el-form-item :label="t('fields.currencyName')" prop="currencyId">
            <el-select
              v-model="form.currencyId"
              value-key="id"
              :placeholder="t('fields.pleaseChoose')"
              style="width: 320px;"
              filterable
              @focus="loadCurrencyNames()"
            >
              <el-option
                v-for="item in currencyNames.list"
                :key="item.id"
                :label="item.currencyName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.mallName')" prop="mallName">
            <el-input v-model="form.mallName" style="width: 320px;" @blur="form.mallName = form.mallName.trim()" />
          </el-form-item>
          <el-form-item :label="t('fields.mallCode')" prop="mallCode">
            <el-input v-model="form.mallCode" style="width: 320px;" @blur="form.mallCode = form.mallCode.trim()" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.mallKey')" prop="mallKey">
            <el-input v-model="form.mallKey" :rows="2" type="textarea" style="width: 600px;" @blur="form.mallKey = form.mallKey.trim()" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.mallExtraKey')" prop="mallExtraKey">
            <el-input v-model="form.mallExtraKey" :rows="2" type="textarea" style="width: 600px;" @blur="form.mallExtraKey = form.mallExtraKey.trim()" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.extraParam')" prop="extraParam">
            <el-input v-model="form.extraParam" :rows="2" type="textarea" style="width: 600px;" @blur="form.extraParam = form.extraParam.trim()" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.className')" prop="className">
            <el-input v-model="form.className" style="width: 320px;" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.requestUrl')" prop="requestUrl">
            <el-input v-model="form.requestUrl" style="width: 600px;" @blur="form.requestUrl = form.requestUrl.trim()" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.callbackUrl')" prop="callbackUrl">
            <el-input v-model="form.callbackUrl" style="width: 600px;" @blur="form.callbackUrl = form.callbackUrl.trim()" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.balanceUrl')" prop="balanceUrl">
            <el-input v-model="form.balanceUrl" style="width: 600px;" @blur="form.balanceUrl = form.balanceUrl.trim()" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.paymentType')" prop="type">
            <el-select
              filterable
              clearable
              v-model="form.type"
              size="small"
              :placeholder="t('fields.pleaseChoose')"
              class="filter-item"
              style="width: 600px; margin-bottom: 16px"
            >
              <el-option
                v-for="item in list.filteredPayTypes"
                :key="item.id"
                :label="item.code"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.tips')" prop="tips">
            <el-input v-model="form.tips" style="width: 600px;" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.feeRate')" prop="fee">
            <el-input-number
              v-model="form.fee"
              :precision="3"
              :step="0.10"
              :min="0"
              :max="1"
              :controls="false"
              class="form-input"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.subtractAmount')" prop="subtractAmount">
            <el-input-number v-model="form.subtractAmount" class="form-input" :controls="false" />
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false" class="footer_btn">{{ t('fields.cancel') }}</el-button>
          <span v-if="uiControl.dialogType !== 'COPY'"><el-button type="primary" @click="submit" class="footer_btn">{{ t('fields.confirm') }}</el-button></span>
          <span v-if="uiControl.dialogType === 'COPY'"><el-button type="primary" @click="create()" class="footer_btn">{{ t('fields.copyWithdrawPlatform') }}</el-button></span>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
    >
      <el-table-column prop="name" :label="t('fields.withdrawName')" width="200" />
      <el-table-column prop="mallName" :label="t('fields.mallName')" width="200" />
      <el-table-column prop="mallCode" :label="t('fields.mallCode')" width="200" />
      <el-table-column prop="currencyName" :label="t('fields.currency')" width="200" />
      <el-table-column prop="type" :label="t('fields.paymentType')" width="170" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="180" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="180" />
      <el-table-column prop="status" :label="t('fields.status')" width="100" v-if="hasPermission(['sys:payment:withdraw:update:state'])">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeWithdrawPlatformStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="right">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit(scope.row)" v-if="hasPermission(['sys:payment:withdraw:update'])" />
          <el-button
            icon="el-icon-copy-document"
            size="mini"
            type="warning"
            @click="showCopyWithdraw(scope.row)"
            v-if="hasPermission(['sys:payment:withdraw:add'])"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogCopyVisible"
    append-to-body
    width="600px"
  >
    <el-form
      ref="copyWithdrawPlatformForm"
      v-loading="uiControl.dialogCopyLoading"
      :model="copyForm"
      :inline="true"
      size="small"
      label-width="160px"
    >
      <el-form-item :label="t('fields.name')" prop="name">
        <el-input v-model="copyForm.name" style="width: 350px" />
      </el-form-item>

      <el-form-item :label="t('fields.mallName')" prop="mall">
        <el-input v-model="copyForm.mallName" style="width: 350px" />
      </el-form-item>

      <div class="dialog-footer">
        <el-button @click="uiControl.dialogCopyVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="copySubmit">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { required } from "../../../../utils/validate";
import { ElMessage } from "element-plus";
import { createWithdrawPlatform, getWithdrawPlatforms, updateWithdrawPlatform, updateWithdrawPlatformStatus, copyWithdrawPlatform } from "../../../../api/withdraw-platform";
import { getCurrencyNames } from "../../../../api/currency";
import { hasPermission } from '../../../../utils/util'
import { useStore } from '@/store';
import { TENANT, ADMIN } from "@/store/modules/user/action-types";
import { getSiteListSimple } from "../../../../api/site";
import { getActivePaymentTypes } from '../../../../api/payment-type'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const copyWithdrawPlatformForm = ref(null)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);

const site = ref(null);
const withdrawPlatformForm = ref(null);

const siteList = reactive({
  list: []
});
const uiControl = reactive({
  dialogVisible: false,
  dialogCopyVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  dialogLoading: false,
  dialogCopyLoading: false,
  status: [
    { key: 1, displayName: "Open", value: true },
    { key: 2, displayName: "Close", value: false }
  ]
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});
const request = reactive({
  size: 30,
  current: 1,
  name: null,
  status: null,
  siteId: null,
});
const copyForm = reactive({
  name: null,
  mall: null,
  id: null,
  paymentName: null
})
const form = reactive({
  id: null,
  siteId: null,
  name: null,
  currencyId: null,
  mallName: null,
  mallCode: null,
  mallKey: null,
  mallExtraKey: null,
  extraParam: null,
  className: null,
  requestUrl: null,
  callbackUrl: null,
  balanceUrl: null,
  type: "",
  subtractAmount: 0,
  fee: 0,
  tips: "",
  status: true
});
const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  name: [required(t('message.validateWithdrawPlatformNameRequired'))],
  currencyId: [required(t('message.validateCurrencyRequired'))],
  mallName: [required(t('message.validateMallNameRequired'))],
  mallCode: [required(t('message.validateMallCodeRequired'))],
  mallKey: [required(t('message.validateMallKeyRequired'))],
  className: [required(t('message.validateClassNameRequired'))],
  requestUrl: [required(t('message.validateRequestUrlRequired'))],
  type: [required(t('message.validatePaymentTypeRequired'))],
});

const currencyNames = reactive({
  list: []
})

const list = reactive({
  payTypes: [],
  filteredPayTypes: [],
  siteCurrencyIds: [],
})

function resetQuery() {
  request.name = null;
  request.status = null;
}

async function loadWithdrawPlatform() {
  page.loading = true;
  const { data: ret } = await getWithdrawPlatforms(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

async function loadCurrencyNames() {
  const { data: ret } = await getCurrencyNames();
  currencyNames.list = ret;
}

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes()
  list.payTypes = payType
}

function filterPayTypeByCurrency(siteId) {
  const currentSite = siteList.list.find(s => s.id === siteId)
  const currencyCodeList = currentSite.currency.split(',').map(currencyName => currencyName)
  list.siteCurrencyIds = [
    ...currencyCodeList.map(currencyName => {
      const currency = currencyNames.list.find(c => c.currencyCode.toUpperCase() === currencyName.toUpperCase())
      return currency ? currency.id : null;
    }).filter(Boolean)
  ]
  list.filteredPayTypes = list.payTypes.filter(payTypeByCurrencyID)
}

function payTypeByCurrencyID (record) {
  if (record.currencyIds) {
    const currencyIdsList = record.currencyIds.split(',')
    return currencyIdsList.filter(currencyId => list.siteCurrencyIds.includes(parseInt(currencyId))).length > 0
  }
}

function changePage(page) {
  request.current = page;
  loadWithdrawPlatform();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (withdrawPlatformForm.value) {
      withdrawPlatformForm.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.addWithdrawPlatform');
    form.id = null
    if (form.siteId) {
      filterPayTypeByCurrency(form.siteId)
    }
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editWithdrawPlatform');
  } else if (type === "COPY") {
    uiControl.dialogTitle = t('fields.copyWithdrawPlatform');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(withdrawPlatform) {
  showDialog("EDIT");
  nextTick(() => {
    for (const key in withdrawPlatform) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = withdrawPlatform[key];
      }
    }
  });
  filterPayTypeByCurrency(parseInt(withdrawPlatform.siteId))
}

function create() {
  withdrawPlatformForm.value.validate(async (valid) => {
    if (valid) {
      await createWithdrawPlatform(form);
      uiControl.dialogVisible = false;
      await loadWithdrawPlatform();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  withdrawPlatformForm.value.validate(async (valid) => {
    if (valid) {
      await updateWithdrawPlatform(form);
      uiControl.dialogVisible = false;
      await loadWithdrawPlatform();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function changeWithdrawPlatformStatus(id, status) {
  await updateWithdrawPlatformStatus(id, status);
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else if (uiControl.dialogType === "EDIT") {
    edit();
  }
}

async function loadSites() {
  if (LOGIN_USER_TYPE.value === ADMIN.value) {
    siteList.list = store.state.user.sites
  } else {
    const { data: site } = await getSiteListSimple();
    siteList.list = site;
  }
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    form.siteId = site.value.id;
    request.siteId = site.value.id
  } else {
    form.siteId = store.state.user.siteId;
    request.siteId = store.state.user.siteId;
  }
  await loadWithdrawPlatform();
  await loadCurrencyNames();
  await loadPayTypes();
});

// function showDialogCopy(withdrawPlatform) {
//   console.log(withdrawPlatform);
//   copyForm.id = withdrawPlatform.id;
//   copyForm.mallName = "";
//   copyForm.name = "";
//   uiControl.dialogTitle = t('fields.copyPayment') + " -  " + withdrawPlatform.name;
//   uiControl.dialogCopyVisible = true
// }

function showCopyWithdraw(withdrawPlatform) {
  showDialog("COPY");
  nextTick(() => {
    for (const key in withdrawPlatform) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = withdrawPlatform[key];
      }
    }
    form.name = form.name + "-1";
  });
  filterPayTypeByCurrency(parseInt(withdrawPlatform.siteId))
}

async function copySubmit() {
  if (copyForm.name === null || copyForm.name === "") {
    ElMessage({ message: t('message.validateWithdrawPlatformNameRequired'), type: 'error' });
  } else if (copyForm.mallName === null || copyForm.mallName === "") {
    ElMessage({ message: t('message.validateMallNameRequired'), type: 'error' });
  } else {
    uiControl.dialogCopyVisible = false;
    await copyWithdrawPlatform(copyForm);
    loadWithdrawPlatform();
    ElMessage({ message: t('message.copySuccess'), type: 'success' });
  }
}
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

.footer_btn {
  margin-right: 30px;
}
</style>
