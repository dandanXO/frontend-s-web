<template>
  <div class="roles-main">
    <el-row>
      <el-col :span="4">
        <el-card style="width: 180px; margin-right: 20px">
          <div class="clearfix">
            <span>{{ t('fields.siteName') }}</span>
          </div>
          <el-radio-group v-model="request.siteId" @change="handleSiteNameCheckedChange">
            <el-radio v-for="c in sites.list" :label="c.id" :key="c.id">{{ c.siteName }}</el-radio>
          </el-radio-group>
        </el-card>
      </el-col>
      <el-col :span="20">
        <div class="header-container" v-if="!hasRole(['SUB_TENANT'])">
          <div class="btn-group">
            <el-button
              :disabled="request.siteId === null"
              icon="el-icon-plus"
              size="mini"
              type="primary"
              v-permission="['sys:withdraw:set:add']"
              @click="showDialog('CREATE')"
            >{{ t('fields.add') }}</el-button>
          </div>
        </div>
        <el-table
          :data="page.records"
          v-loading="page.loading"
          ref="table"
          row-key="id"
          size="small"
          highlight-current-row
          :empty-text="t('fields.noData')"
        >
          <el-table-column prop="financialLevelName" :label="t('fields.financialLevel')" width="150" />
          <el-table-column prop="currencyName" :label="t('fields.currency')" width="100" />
          <el-table-column prop="way" :label="t('fields.way')" width="100" />
          <el-table-column prop="withdrawMin" :label="t('fields.minWithdrawAmount')" width="200">
            <template #default="scope">
              $
              <!--eslint-disable-next-line -->
              <span v-formatter="{ data: scope.row.withdrawMin, type: 'money' }" />
            </template>
          </el-table-column>
          <el-table-column prop="withdrawMax" :label="t('fields.maxWithdrawAmount')" width="200">
            <template #default="scope">
              $
              <!--eslint-disable-next-line -->
              <span v-formatter="{ data: scope.row.withdrawMax, type: 'money' }" />
            </template>
          </el-table-column>
          <el-table-column
            prop="withdrawMaxTimes"
            :label="t('fields.maxDailyWithdrawTimes')"
            width="250"
          />
          <el-table-column
            prop="withdrawMaxAmount"
            :label="t('fields.maxDailyWithdraw')"
            width="250"
          >
            <template #default="scope">
              $
              <span
                v-formatter="{
                  data: scope.row.withdrawMaxAmount,
                  type: 'money',
                }"
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="t('fields.operate')"
            align="right"
            fixed="right"
            v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw:set:update'])"
          >
            <template #default="scope">
              <el-button
                icon="el-icon-edit"
                size="mini"
                type="success"
                @click="showEdit(scope.row)"
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
      </el-col>
    </el-row>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="730px"
    >
      <el-form
        ref="withdrawSettingForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="270px"
      >
        <el-form-item :label="t('fields.siteName')" prop="siteId">
          <el-select
            disabled
            v-model="form.siteId"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 400px"
            filterable
            @focus="loadSites"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.financialLevel')" prop="financialLevel">
          <el-select
            v-model="form.financialLevel"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 400px"
            filterable
            @focus="loadFormFinancialLevelInfos"
          >
            <el-option
              v-for="item in financialLevel.list"
              :key="item.id"
              :label="item.name"
              :value="item.level"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.currency')" prop="currencyId">
          <el-select
            v-model="form.currencyId"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 400px"
            filterable
          >
            <el-option
              v-for="item in currencies.list"
              :key="item.id"
              :label="item.currencyName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.device')" prop="way">
          <el-radio-group v-model="form.way">
            <el-radio v-for="c in devices.list" :label="c.displayName" :key="c.key">{{ c.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.minWithdrawAmount')" prop="withdrawMin">
          <el-input v-model="form.withdrawMin" style="width: 400px" />
        </el-form-item>
        <el-form-item :label="t('fields.maxWithdrawAmount')" prop="withdrawMax">
          <el-input v-model="form.withdrawMax" style="width: 400px" />
        </el-form-item>
        <el-form-item :label="t('fields.maxDailyWithdrawTimes')" prop="withdrawMaxTimes">
          <el-input v-model="form.withdrawMaxTimes" style="width: 400px" clearable />
        </el-form-item>
        <el-form-item :label="t('fields.maxDailyWithdraw')" prop="withdrawMaxAmount">
          <el-input v-model="form.withdrawMaxAmount" style="width: 400px" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { numericOnly, required, isNumeric } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  getWithdrawSettings,
  createWithdrawSetting,
  updateWithdrawSetting,
} from '../../../api/withdraw-setting'
import { getSiteListSimple } from '../../../api/site'
import { getFinancialLevels } from '../../../api/financial-level'
import { getCurrencyNames } from '../../../api/currency'
import { hasRole, hasPermission } from "../../../utils/util";
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)
const siteId = ref(null);
const withdrawSettingForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
})

const form = reactive({
  id: null,
  siteId: null,
  siteName: null,
  financialLevel: null,
  currencyId: null,
  way: null,
  withdrawMin: '',
  withdrawMax: '',
  withdrawMaxTimes: null,
  withdrawMaxAmount: '',
})

const validateWithdrawMin = (rule, value, callback) => {
  if (value < 1) {
    callback(new Error(t('message.validateMinWithdrawNumber')));
  } else if (value > form.withdrawMax) {
    callback(new Error(t('message.validateMinWithdrawLesser')));
  } else {
    callback();
  }
};

const validateWithdrawMax = (rule, value, callback) => {
  if (value < 1) {
    callback(new Error(t('message.validateMaxWithdrawAmountNumber')));
  } else if (value < form.withdrawMin) {
    callback(new Error(t('message.validateMaxWithdrawAmountGreater')));
  } else {
    callback();
  }
};

const validateWithdrawMaxTime = (rule, value, callback) => {
  if (value < 1) {
    callback(new Error(t('message.validateMaxDailyWithdrawTimesNumber')));
  } else {
    callback();
  }
};

const validateWithdrawMaxAmountDaily = (rule, value, callback) => {
  if (value < 1) {
    callback(new Error(t('message.validateMaxDailyWithdrawNumber')));
  } else if (value < form.withdrawMax) {
    callback(new Error(t('message.validateMaxDailyWithdrawGreater')));
  } else {
    callback();
  }
};

const formRules = reactive({
  financialLevel: [required(t('message.validateFinancialLevelRequired'))],
  currencyId: [required(t('message.validateCurrencyRequired'))],
  way: [required(t('message.validateDeviceRequired'))],
  withdrawMin: [required(t('message.validateMinWithdrawRequired')), isNumeric(t('message.validateNumberOnly')), { validator: validateWithdrawMin, trigger: "blur" }],
  withdrawMax: [required(t('message.validateMinWithdrawRequired')), isNumeric(t('message.validateNumberOnly')), { validator: validateWithdrawMax, trigger: "blur" }],
  withdrawMaxTimes: [required(t('message.validateMaxDailyWithdrawTimesRequired')), numericOnly(t('message.validateWholeNumberOnly')), { validator: validateWithdrawMaxTime, trigger: "blur" }],
  withdrawMaxAmount: [
    required(t('message.validateMaxWithdrawAmountRequired')), isNumeric(t('message.validateNumberOnly')), { validator: validateWithdrawMaxAmountDaily, trigger: "blur" }
  ],
})

const sites = reactive({
  list: [],
})

const financialLevelInfos = reactive({
  list: [],
})

const financialLevel = reactive({
  list: []
})

const currencies = reactive({
  list: [],
})

const devices = reactive({
  list: [
    { key: 1, displayName: 'WEB', value: 'WEB' },
    { key: 2, displayName: 'MOBILE', value: 'MOBILE' },
  ],
})

async function handleSiteNameCheckedChange() {
  const site = sites.list.filter(s => s.id === request.siteId)[0]
  await loadWithdrawSetting()
  await loadFinancialLevelInfos()
  loadCurrencies(site.currency)
}

async function loadWithdrawSetting() {
  page.loading = true
  const { data: ret } = await getWithdrawSettings(request)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadFinancialLevelInfos() {
  const { data: ret } = await getFinancialLevels({ siteId: request.siteId })
  financialLevelInfos.list = ret
}

async function loadFormFinancialLevelInfos() {
  const { data: ret } = await getFinancialLevels({ siteId: siteId.value })
  financialLevel.list = ret
}

async function loadCurrencies(siteCurrencies) {
  const { data: ret } = await getCurrencyNames()
  currencies.list = ret.filter(c => siteCurrencies.includes(c.currencyCode))
}

function changePage(page) {
  request.current = page
  loadWithdrawSetting()
}

async function showDialog(type) {
  if (type === 'CREATE') {
    if (withdrawSettingForm.value) {
      withdrawSettingForm.value.resetFields()
    }
    form.id = null
    form.siteId = request.siteId
    siteId.value = form.siteId;
    await loadFormFinancialLevelInfos();
    form.financialLevel = financialLevelInfos.list[0].level
    form.currencyId = currencies.list[0].id
    uiControl.dialogTitle = t('fields.addWithdrawSetting')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editWithdrawSetting')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function showEdit(withdrawSetting) {
  showDialog('EDIT')
  await nextTick(() => {
    for (const key in withdrawSetting) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = withdrawSetting[key]
      }
    }
  })
  siteId.value = form.siteId;
  await loadFormFinancialLevelInfos();
}

function create() {
  withdrawSettingForm.value.validate(async valid => {
    if (valid) {
      await createWithdrawSetting(form)
      uiControl.dialogVisible = false
      await loadWithdrawSetting()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  withdrawSettingForm.value.validate(async valid => {
    if (valid) {
      await updateWithdrawSetting(form)
      uiControl.dialogVisible = false
      await loadWithdrawSetting()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

onMounted(() => {
  loadSites()
  if (LOGIN_USER_SITEID.value != null) {
    siteId.value = LOGIN_USER_SITEID.value
  }
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
</style>
