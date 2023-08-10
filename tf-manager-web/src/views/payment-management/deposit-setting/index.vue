<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="form.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
          @change="handleSiteNameCheckedChange"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="btn-group">
        <el-radio-group v-model="form.payType">
          <el-radio
            v-for="p in payTypeList.list"
            :key="p.id"
            :label="p.code"
            size="small"
            border
            @change="loadDepositSetting"
          >{{ p.code }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-row>
      <el-col :span="4">
        <div class="form-border">
          <div class="form-header">{{ t('fields.web') }}</div>
          <div class="form-body">
            <el-form
              ref="webDepositSettingForm"
              :model="form.web"
              :rules="webFormRules"
              :inline="true"
              size="small"
              label-width="150px"
              label-position="top"
            >
              <el-form-item :label="t('fields.minDeposit')" prop="depositMin">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:set:deposit:update'])" v-model="form.web.depositMin" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.web.depositMin" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
              <el-form-item :label="t('fields.maxDeposit')" prop="depositMax">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:set:deposit:update'])" v-model="form.web.depositMax" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.web.depositMax" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col :span="4" style="margin-left: 10px;">
        <div class="form-border">
          <div class="form-header">{{ t('fields.mobile') }}</div>
          <div class="form-body">
            <el-form
              ref="mobileDepositSettingForm"
              :model="form.mobile"
              :rules="mobileFormRules"
              :inline="true"
              size="small"
              label-width="150px"
              label-position="top"
            >
              <el-form-item :label="t('fields.minDeposit')" prop="depositMin">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:set:deposit:update'])" v-model="form.mobile.depositMin" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.mobile.depositMin" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
              <el-form-item :label="t('fields.maxDeposit')" prop="depositMax">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:set:deposit:update'])" v-model="form.mobile.depositMax" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.mobile.depositMax" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col :span="7" style="margin-left: 10px;">
        <div class="form-border">
          <div class="form-header">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" />
            {{ t('fields.web') }}
          </div>
          <div class="form-body">
            <el-checkbox-group v-model="form.web.financialLevels" @change="handleCheckedFinancialChange">
              <el-checkbox :value-key="f.id" v-for="f in financialList.list" :label="f" :key="f.id" style="display: block; margin: 5px 0;">
                {{ f.name }}
                <span class="deposit-class">
                  <i class="el-icon-caret-top" />: <span v-formatter="{data: getDeposit(f, 'WEB', 'max'),type: 'money'}" /> <i class="el-icon-caret-bottom" />: <span v-formatter="{data: getDeposit(f, 'WEB', 'min'),type: 'money'}" />
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-col>
      <el-col :span="7" style="margin-left: 10px;">
        <div class="form-border">
          <div class="form-header">
            <el-checkbox :indeterminate="mobileIsIndeterminate" v-model="checkAllMobile" @change="handleMobileCheckAllChange" />
            {{ t('fields.mobile') }}
          </div>
          <div class="form-body">
            <el-checkbox-group v-model="form.mobile.financialLevels" @change="handleMobileCheckedFinancialChange">
              <el-checkbox :value-key="f.id" v-for="f in financialList.list" :label="f" :key="f.id" style="display: block; margin: 5px 0;">
                {{ f.name }}
                <span class="deposit-class">
                  <i class="el-icon-caret-top" />: <span v-formatter="{data: getDeposit(f, 'MOBILE', 'max'),type: 'money'}" /> <i class="el-icon-caret-bottom" />: <span v-formatter="{data: getDeposit(f, 'MOBILE', 'min'),type: 'money'}" />
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-col>
      <el-col :span="1" style="margin-left: 10px;">
        <el-button v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:set:deposit:update'])" type="primary" @click="submit">{{ t('fields.update') }}</el-button>
        <el-button v-else type="primary" @click="submit" disabled>{{ t('fields.update') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import { hasRole, hasPermission } from "../../../utils/util";
import { getDepositSetting, insertOrUpdate } from "../../../api/deposit-setting";
import { getFinancialLevels } from "../../../api/financial-level";
import { getSiteListSimple } from "../../../api/site";
import { getActivePaymentTypes } from "../../../api/payment-type";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { isNumericNonRequired } from "../../../utils/validate";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const webDepositSettingForm = ref(null);
const mobileDepositSettingForm = ref(null);
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkAllMobile = ref(false)
const mobileIsIndeterminate = ref(false)
const siteList = reactive({
  list: []
});
const financialList = reactive({
  list: []
});
const payTypeList = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const form = reactive({
  siteId: null,
  payType: null,
  web: {
    depositMin: null,
    depositMax: null,
    financialLevels: []
  },
  mobile: {
    depositMin: null,
    depositMax: null,
    financialLevels: []
  }
});

const validateWebDepositAmount = (rule, value, callback) => {
  if (form.web.depositMax !== null && form.web.depositMax - form.web.depositMin < 0) {
    callback(new Error(t('message.validateMaxDepositGreater')));
  }
  callback();
};

const validateMobileDepositAmount = (rule, value, callback) => {
  if (form.mobile.depositMax !== null && form.mobile.depositMax - form.mobile.depositMin < 0) {
    callback(new Error(t('message.validateMaxDepositGreater')));
  }
  callback();
};

const validateNumeric = (rule, value, callback) => {
  if (value && !isNumericNonRequired(value)) {
    callback(new Error(t('message.validateNumberOnly')))
  } else {
    callback()
  }
}

const handleCheckAllChange = (val) => {
  if (val) {
    form.web.financialLevels = financialList.list;
  } else {
    form.web.financialLevels = [];
  }

  isIndeterminate.value = false;
}

const handleCheckedFinancialChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === financialList.list.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < financialList.list.length
}

const handleMobileCheckAllChange = (val) => {
  if (val) {
    form.mobile.financialLevels = financialList.list;
  } else {
    form.mobile.financialLevels = [];
  }

  mobileIsIndeterminate.value = false;
}

const handleMobileCheckedFinancialChange = (value) => {
  const checkedCount = value.length
  checkAllMobile.value = checkedCount === financialList.list.map(element => element.name).length
  mobileIsIndeterminate.value = checkedCount > 0 && checkedCount < financialList.list.length
}

const webFormRules = reactive({
  depositMin: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateWebDepositAmount, trigger: "blur" }],
  depositMax: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateWebDepositAmount, trigger: "blur" }]
});

const mobileFormRules = reactive({
  depositMin: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateMobileDepositAmount, trigger: "blur" }],
  depositMax: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateMobileDepositAmount, trigger: "blur" }]
});

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels({ siteId: form.siteId });
  financialList.list = financial;
};

async function handleSiteNameCheckedChange() {
  await loadPayTypes()
  form.payType = payTypeList.list[0].code;
  await loadFinancialLevels()
  await loadDepositSetting()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
};

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes();
  payTypeList.list = payType;
};

async function loadDepositSetting() {
  page.loading = true;
  const query = {};
  query.siteId = form.siteId;
  query.payType = form.payType;
  const { data: ret } = await getDepositSetting(query);
  page.records = ret;
  page.loading = false;
}

async function submit() {
  const depositSetting = [];
  if (webDepositSettingForm.value) {
    webDepositSettingForm.value.validate((valid) => {
      if (valid) {
        form.web.financialLevels.forEach(f => {
          const record = {};
          const current = page.records.find((item) => item.financialLevel === f.level && item.way === 'WEB');
          record.financialLevel = f.level;
          record.siteId = form.siteId;
          record.payType = form.payType;
          record.way = 'WEB';
          record.depositMin = form.web.depositMin ? form.web.depositMin : current.depositMin;
          record.depositMax = form.web.depositMax ? form.web.depositMax : current.depositMax;
          depositSetting.push(record);
        })
      }
    })
  }
  if (mobileDepositSettingForm.value) {
    mobileDepositSettingForm.value.validate((valid) => {
      if (valid) {
        form.mobile.financialLevels.forEach(f => {
          const record = {};
          const current = page.records.find((item) => item.financialLevel === f.level && item.way === 'MOBILE');
          record.financialLevel = f.level;
          record.siteId = form.siteId;
          record.payType = form.payType;
          record.way = 'MOBILE';
          record.depositMin = form.mobile.depositMin ? form.mobile.depositMin : current.depositMin;
          record.depositMax = form.mobile.depositMax ? form.mobile.depositMax : current.depositMax;
          depositSetting.push(record);
        })
      }
    })
  }
  if (depositSetting.length > 0) {
    await insertOrUpdate(depositSetting);
    clearForm();
    ElMessage({ message: t('message.updateSuccess'), type: 'success' });
    await loadDepositSetting();
  }
}

function clearForm() {
  form.web.depositMin = null;
  form.web.depositMax = null;
  form.web.financialLevels = [];
  form.mobile.depositMin = null;
  form.mobile.depositMax = null;
  form.mobile.financialLevels = [];
  isIndeterminate.value = false;
  checkAll.value = false;
  mobileIsIndeterminate.value = false;
  checkAllMobile.value = false;
}

function getDeposit(financial, way, deposit) {
  const record = page.records.find((item) => item.way === way && item.financialLevel === financial.level);
  if (deposit === 'min') {
    return record ? record.depositMin : 0;
  } else if (deposit === 'max') {
    return record ? record.depositMax : 0;
  }
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    form.siteId = site.value.id;
  } else {
    site.value = siteList.list[0];
    form.siteId = site.value.id;
  }
  await loadFinancialLevels();
  await loadPayTypes();
  form.payType = payTypeList.list[0].code;
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

:deep(.el-radio__input) {
  display: none !important;
}

:deep(.el-radio.is-bordered.is-checked) {
  background-color: var(--el-color-primary);
}

:deep(.is-checked .el-radio__label) {
  color: white;
}

.el-radio {
  margin-right: 10px;
  margin-bottom: 5px;
}

.el-radio.is-bordered+.el-radio.is-bordered {
  margin-left: 0;
}

.form-border {
  border-color: #dcdfe6;
  border-style: solid;
  border-width: 1px
}

.form-header {
  color: white;
  background-color: var(--el-color-primary);
  padding: 10px;
}

.form-body {
  padding: 10px;
}

.el-icon-caret-top {
  color: red;
}

.el-icon-caret-bottom {
  color: green;
}

.deposit-class {
  margin-left: 15px;
}
</style>
