<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
          @change="populateReqFinancialLevel"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.financialLevel"
          size="small"
          :placeholder="t('fields.financialLevel')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in reqFinancialList.list"
            :key="item.id"
            :label="item.name"
            :value="item.level"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.way"
          size="small"
          :placeholder="t('fields.way')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.way"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.payType"
          size="small"
          :placeholder="t('fields.payType')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadPayTypes"
        >
          <el-option
            v-for="item in payTypeList.list"
            :key="item.id"
            :label="item.code"
            :value="item.code"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadDepositSetting"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:set:deposit:add']"
          @click="showDialog('CREATE')"
          v-if="!hasRole(['SUB_TENANT'])"
        >{{ t('fields.add') }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="depositSettingForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.site')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadSites"
            @change="populateFinancialLevel"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.financialLevel')" prop="financialLevel">
          <el-select
            v-model="form.financialLevel"
            :placeholder="t('fields.financialLevel')"
            style="width: 350px;"
            filterable
            default-first-option
          >
            <el-option
              v-for="item in financialList.list"
              :key="item.id"
              :label="item.name"
              :value="item.level"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.payType')" prop="payType">
          <el-select
            v-model="form.payType"
            :placeholder="t('fields.payType')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadPayTypes"
          >
            <el-option
              v-for="item in payTypeList.list"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.way')" prop="way">
          <el-select
            v-model="form.way"
            :placeholder="t('fields.way')"
            style="width: 350px;"
            filterable
            default-first-option
          >
            <el-option
              v-for="item in uiControl.way"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.minDeposit')" prop="depositMin">
          <el-input v-model="form.depositMin" style="width: 350px" maxlength="10" />
        </el-form-item>
        <el-form-item :label="t('fields.maxDeposit')" prop="depositMax">
          <el-input v-model="form.depositMax" style="width: 350px" maxlength="10" />
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
      size="mini"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="financialLevelName" :label="t('fields.financialLevel')" min-width="150" />
      <el-table-column prop="site" :label="t('fields.site')" min-width="120" />
      <el-table-column prop="payType" :label="t('fields.payType')" min-width="150" />
      <el-table-column prop="way" :label="t('fields.way')" min-width="120" />
      <el-table-column prop="depositMin" :label="t('fields.minDeposit')" min-width="150" />
      <el-table-column prop="depositMax" :label="t('fields.maxDeposit')" min-width="150" />
      <el-table-column :label="t('fields.operate')" align="right" v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:set:deposit:update'])">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { required } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import { hasRole, hasPermission } from "../../../utils/util";
import { createDepositSetting, getDepositSetting, updateDepositSetting } from "../../../api/deposit-setting";
import { getFinancialLevels } from "../../../api/financial-level";
import { getSiteListSimple } from "../../../api/site";
import { getActivePaymentTypes } from "../../../api/payment-type";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const depositSettingForm = ref(null);
const siteList = reactive({
  list: []
});
const financialList = reactive({
  list: []
});
const reqFinancialList = reactive({
  list: []
});
const payTypeList = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  way: [
    { key: 1, displayName: "WEB", value: "WEB" },
    { key: 2, displayName: "MOBILE", value: "MOBILE" }
  ]
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 0,
  current: 1,
  siteId: null,
  financialLevel: null,
  way: null,
  payType: null
});

const form = reactive({
  id: null,
  siteId: null,
  financialLevel: null,
  payType: null,
  way: null,
  depositMin: null,
  depositMax: null
});

const validateDepositAmount = (rule, value, callback) => {
  if (form.depositMax !== null && form.depositMax - form.depositMin < 0) {
    callback(new Error(t('message.validateMaxDepositGreater')));
  }
  callback();
};

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  financialLevel: [required(t('message.validateFinancialLevelRequired'))],
  payType: [required(t('message.validatePayTypeRequired'))],
  way: [required(t('message.validateWayRequired'))],
  depositMin: [required(t('message.validateMinDepositRequired')), { validator: validateDepositAmount, trigger: "blur" }],
  depositMax: [required(t('message.validateMaxDepositRequired')), { validator: validateDepositAmount, trigger: "blur" }]
});

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels({ siteId: site.value.id });
  financialList.list = financial;
};

async function loadReqFinancialLevels() {
  const { data: financial } = await getFinancialLevels({ siteId: site.value.id });
  reqFinancialList.list = financial;
};

async function populateFinancialLevel() {
  site.value.id = form.siteId;
  await loadFinancialLevels();
}

async function populateReqFinancialLevel() {
  site.value.id = request.siteId;
  await loadReqFinancialLevels();
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
};

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes();
  payTypeList.list = payType;
};

function resetQuery() {
  request.siteId = site.value ? site.value.id : null;
  request.financialLevel = null;
  request.way = null;
  request.payType = null;
}

async function loadDepositSetting() {
  page.loading = true;
  const { data: ret } = await getDepositSetting(request);
  page.records = ret;
  page.loading = false;
}

async function showDialog(type) {
  if (type === "CREATE") {
    if (depositSettingForm.value) {
      depositSettingForm.value.resetFields();
    }
    form.siteId = siteList.list[0].id;
    site.value.id = form.siteId;
    await loadFinancialLevels();
    form.financialLevel = financialList.list[0].level;
    uiControl.dialogTitle = t('fields.addDepositSetting');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editDepositSetting');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function create() {
  depositSettingForm.value.validate(async (valid) => {
    form.id = null;
    if (valid) {
      await createDepositSetting(form);
      uiControl.dialogVisible = false;
      await loadDepositSetting();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  depositSettingForm.value.validate(async (valid) => {
    if (valid) {
      await updateDepositSetting(form);
      uiControl.dialogVisible = false;
      await loadDepositSetting();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function showEdit(depositSetting) {
  showDialog("EDIT");
  if (depositSettingForm.value) {
    depositSettingForm.value.resetFields();
  }
  await nextTick(() => {
    for (const key in depositSetting) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = depositSetting[key];
      }
    }
  });
  site.value.id = form.siteId;
  await loadFinancialLevels();
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else if (uiControl.dialogType === "EDIT") {
    edit();
  }
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    site.value = siteList.list[0];
    request.siteId = site.value.id;
  }
  await loadReqFinancialLevels();
  await loadPayTypes();
  await loadDepositSetting();
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
