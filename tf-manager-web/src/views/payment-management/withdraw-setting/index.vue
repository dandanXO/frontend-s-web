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
        <el-radio-group v-model="form.currencyId">
          <el-radio
            v-for="c in currencies.list"
            :key="c.id"
            :label="c.id"
            size="small"
            border
            @change="loadWithdrawSetting"
          >{{ c.currencyName }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-row>
      <el-col :span="4">
        <div class="form-border">
          <div class="form-header">{{ t('fields.web') }}</div>
          <div class="form-body">
            <el-form
              ref="webWithdrawSettingForm"
              :model="form.web"
              :rules="webFormRules"
              :inline="true"
              size="small"
              label-width="150px"
              label-position="top"
            >
              <el-form-item :label="t('fields.minWithdrawAmount')" prop="withdrawMin">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" v-model="form.web.withdrawMin" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.web.withdrawMin" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
              <el-form-item :label="t('fields.maxWithdrawAmount')" prop="withdrawMax">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" v-model="form.web.withdrawMax" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.web.withdrawMax" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
              <el-form-item :label="t('fields.maxDailyWithdrawTimes')" prop="withdrawMaxTimes">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" v-model="form.web.withdrawMaxTimes" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.web.withdrawMaxTimes" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
              <el-form-item :label="t('fields.maxDailyWithdraw')" prop="withdrawMaxAmount">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" v-model="form.web.withdrawMaxAmount" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.web.withdrawMaxAmount" style="width: 200px" maxlength="10" disabled />
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
              ref="mobileWithdrawSettingForm"
              :model="form.mobile"
              :rules="mobileFormRules"
              :inline="true"
              size="small"
              label-width="150px"
              label-position="top"
            >
              <el-form-item :label="t('fields.minWithdrawAmount')" prop="withdrawMin">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" v-model="form.mobile.withdrawMin" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.mobile.withdrawMin" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
              <el-form-item :label="t('fields.maxWithdrawAmount')" prop="withdrawMax">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" v-model="form.mobile.withdrawMax" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.mobile.withdrawMax" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
              <el-form-item :label="t('fields.maxDailyWithdrawTimes')" prop="withdrawMaxTimes">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" v-model="form.mobile.withdrawMaxTimes" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.mobile.withdrawMaxTimes" style="width: 200px" maxlength="10" disabled />
              </el-form-item>
              <el-form-item :label="t('fields.maxDailyWithdraw')" prop="withdrawMaxAmount">
                <el-input v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" v-model="form.mobile.withdrawMaxAmount" style="width: 200px" maxlength="10" />
                <el-input v-else v-model="form.mobile.withdrawMaxAmount" style="width: 200px" maxlength="10" disabled />
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
                <span class="withdraw-class">
                  <i class="el-icon-caret-top" />: <span v-formatter="{data: getWithdraw(f, 'WEB', 'max'),type: 'money'}" /> <i class="el-icon-caret-bottom" />: <span v-formatter="{data: getWithdraw(f, 'WEB', 'min'),type: 'money'}" /> <i class="el-icon-stopwatch" />: {{ getWithdraw(f, 'WEB', 'maxTimes') }} <i class="el-icon-wallet" />: <span v-formatter="{data: getWithdraw(f, 'WEB', 'maxAmount'),type: 'money'}" />
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
                <span class="withdraw-class">
                  <i class="el-icon-caret-top" />: <span v-formatter="{data: getWithdraw(f, 'MOBILE', 'max'),type: 'money'}" /> <i class="el-icon-caret-bottom" />: <span v-formatter="{data: getWithdraw(f, 'MOBILE', 'min'),type: 'money'}" /> <i class="el-icon-stopwatch" />: {{ getWithdraw(f, 'MOBILE', 'maxTimes') }} <i class="el-icon-wallet" />: <span v-formatter="{data: getWithdraw(f, 'MOBILE', 'maxAmount'),type: 'money'}" />
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-col>
      <el-col :span="1" style="margin-left: 10px;">
        <el-button v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])" type="primary" @click="submit">{{ t('fields.update') }}</el-button>
        <el-button v-else type="primary" @click="submit" disabled>{{ t('fields.update') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { isNumericNonRequired, numericOnlyNonRequired } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { getWithdrawSettingList, insertOrUpdate } from '../../../api/withdraw-setting'
import { getSiteListSimple } from '../../../api/site'
import { getFinancialLevels } from '../../../api/financial-level'
import { getCurrencyNames } from '../../../api/currency'
import { hasRole, hasPermission } from "../../../utils/util";
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";
import { TENANT } from '../../../store/modules/user/action-types'

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const webWithdrawSettingForm = ref(null)
const mobileWithdrawSettingForm = ref(null)
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
const currencies = reactive({
  list: []
});

const page = reactive({
  records: [],
  loading: false,
})

const form = reactive({
  id: null,
  siteId: null,
  currencyId: null,
  web: {
    withdrawMin: null,
    withdrawMax: null,
    withdrawMaxTimes: null,
    withdrawMaxAmount: null,
    financialLevels: []
  },
  mobile: {
    withdrawMin: null,
    withdrawMax: null,
    withdrawMaxTimes: null,
    withdrawMaxAmount: null,
    financialLevels: []
  }
})

const validateWebWithdrawMin = (rule, value, callback) => {
  if (value) {
    if (value < 1) {
      callback(new Error(t('message.validateMinWithdrawNumber')));
    } else if (value - form.web.withdrawMax > 0) {
      callback(new Error(t('message.validateMinWithdrawLesser')));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateWebWithdrawMax = (rule, value, callback) => {
  if (value) {
    if (value < 1) {
      callback(new Error(t('message.validateMaxWithdrawAmountNumber')));
    } else if (value - form.web.withdrawMin < 0) {
      callback(new Error(t('message.validateMaxWithdrawAmountGreater')));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateWithdrawMaxTime = (rule, value, callback) => {
  if (value && value < 1) {
    callback(new Error(t('message.validateMaxDailyWithdrawTimesNumber')));
  } else {
    callback();
  }
};

const validateWebWithdrawMaxAmountDaily = (rule, value, callback) => {
  if (value) {
    if (value < 1) {
      callback(new Error(t('message.validateMaxDailyWithdrawNumber')));
    } else if (value - form.web.withdrawMax < 0) {
      callback(new Error(t('message.validateMaxDailyWithdrawGreater')));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateMobileWithdrawMin = (rule, value, callback) => {
  if (value) {
    if (value < 1) {
      callback(new Error(t('message.validateMinWithdrawNumber')));
    } else if (value - form.mobile.withdrawMax > 0) {
      callback(new Error(t('message.validateMinWithdrawLesser')));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateMobileWithdrawMax = (rule, value, callback) => {
  if (value) {
    if (value < 1) {
      callback(new Error(t('message.validateMaxWithdrawAmountNumber')));
    } else if (value - form.mobile.withdrawMin < 0) {
      callback(new Error(t('message.validateMaxWithdrawAmountGreater')));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateMobileWithdrawMaxAmountDaily = (rule, value, callback) => {
  if (value) {
    if (value < 1) {
      callback(new Error(t('message.validateMaxDailyWithdrawNumber')));
    } else if (value - form.mobile.withdrawMax < 0) {
      callback(new Error(t('message.validateMaxDailyWithdrawGreater')));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateNumeric = (rule, value, callback) => {
  if (value && !isNumericNonRequired(value)) {
    callback(new Error(t('message.validateNumberOnly')))
  } else {
    callback()
  }
}

const validateNumericOnly = (rule, value, callback) => {
  if (value && !numericOnlyNonRequired(value)) {
    callback(new Error(t('message.validateWholeNumberOnly')))
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
  withdrawMin: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateWebWithdrawMin, trigger: "blur" }],
  withdrawMax: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateWebWithdrawMax, trigger: "blur" }],
  withdrawMaxTimes: [{ validator: validateNumericOnly, trigger: "blur" }, { validator: validateWithdrawMaxTime, trigger: "blur" }],
  withdrawMaxAmount: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateWebWithdrawMaxAmountDaily, trigger: "blur" }],
})

const mobileFormRules = reactive({
  withdrawMin: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateMobileWithdrawMin, trigger: "blur" }],
  withdrawMax: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateMobileWithdrawMax, trigger: "blur" }],
  withdrawMaxTimes: [{ validator: validateNumericOnly, trigger: "blur" }, { validator: validateWithdrawMaxTime, trigger: "blur" }],
  withdrawMaxAmount: [{ validator: validateNumeric, trigger: "blur" }, { validator: validateMobileWithdrawMaxAmountDaily, trigger: "blur" }],
})

async function handleSiteNameCheckedChange() {
  const site = siteList.list.filter(s => s.id === form.siteId)[0]
  await loadCurrencies(site.currency)
  form.currencyId = currencies.list[0].id;
  await loadFinancialLevels()
  await loadWithdrawSetting()
}

async function loadWithdrawSetting() {
  page.loading = true
  const query = {};
  query.siteId = form.siteId;
  query.currencyId = form.currencyId;
  const { data: ret } = await getWithdrawSettingList(query)
  page.records = ret
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  siteList.list = ret
}

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels({ siteId: form.siteId });
  financialList.list = financial;
};

async function loadCurrencies(siteCurrencies) {
  const { data: ret } = await getCurrencyNames()
  currencies.list = ret.filter(c => siteCurrencies.includes(c.currencyCode))
}

async function submit() {
  const withdrawSetting = [];
  if (webWithdrawSettingForm.value) {
    webWithdrawSettingForm.value.validate((valid) => {
      if (valid && form.web.withdrawMin && form.web.withdrawMax && form.web.withdrawMaxTimes && form.web.withdrawMaxAmount) {
        form.web.financialLevels.forEach(f => {
          const record = {};
          record.financialLevel = f.level;
          record.siteId = form.siteId;
          record.currencyId = form.currencyId;
          record.way = 'WEB';
          record.withdrawMin = form.web.withdrawMin;
          record.withdrawMax = form.web.withdrawMax;
          record.withdrawMaxTimes = form.web.withdrawMaxTimes;
          record.withdrawMaxAmount = form.web.withdrawMaxAmount;
          withdrawSetting.push(record);
        })
      }
    })
  }
  if (mobileWithdrawSettingForm.value) {
    mobileWithdrawSettingForm.value.validate((valid) => {
      if (valid && form.mobile.withdrawMin && form.mobile.withdrawMax && form.mobile.withdrawMaxTimes && form.mobile.withdrawMaxAmount) {
        form.mobile.financialLevels.forEach(f => {
          const record = {};
          record.financialLevel = f.level;
          record.siteId = form.siteId;
          record.currencyId = form.currencyId;
          record.way = 'MOBILE';
          record.withdrawMin = form.mobile.withdrawMin;
          record.withdrawMax = form.mobile.withdrawMax;
          record.withdrawMaxTimes = form.mobile.withdrawMaxTimes;
          record.withdrawMaxAmount = form.mobile.withdrawMaxAmount;
          withdrawSetting.push(record);
        })
      }
    })
  }
  if (withdrawSetting.length > 0) {
    await insertOrUpdate(withdrawSetting);
    clearForm();
    ElMessage({ message: t('message.updateSuccess'), type: 'success' });
    await loadWithdrawSetting();
  }
}

function clearForm() {
  form.web.withdrawMin = null;
  form.web.withdrawMax = null;
  form.web.withdrawMaxTimes = null;
  form.web.withdrawMaxAmount = null;
  form.web.financialLevels = [];
  form.mobile.withdrawMin = null;
  form.mobile.withdrawMax = null;
  form.mobile.withdrawMaxTimes = null;
  form.mobile.withdrawMaxAmount = null;
  form.mobile.financialLevels = [];
  isIndeterminate.value = false;
  checkAll.value = false;
  mobileIsIndeterminate.value = false;
  checkAllMobile.value = false;
}

function getWithdraw(financial, way, withdraw) {
  const record = page.records.find((item) => item.way === way && item.financialLevel === financial.level);
  if (withdraw === 'min') {
    return record ? record.withdrawMin : 0;
  } else if (withdraw === 'max') {
    return record ? record.withdrawMax : 0;
  } else if (withdraw === 'maxTimes') {
    return record ? record.withdrawMaxTimes : 0;
  } else if (withdraw === 'maxAmount') {
    return record ? record.withdrawMaxAmount : 0;
  }
}

onMounted(async() => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    form.siteId = site.value.id;
  } else {
    site.value = siteList.list[0];
    form.siteId = site.value.id;
  }
  await handleSiteNameCheckedChange();
})
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
  margin-right: 18px;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
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
</style>
