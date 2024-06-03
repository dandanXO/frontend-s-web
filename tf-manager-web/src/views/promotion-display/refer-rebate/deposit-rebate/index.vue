<template>
  <el-select
    v-model="request.siteId"
    size="small"
    :placeholder="t('fields.site')"
    class="filter-item"
    style="width: 120px"
    default-first-option
    @focus="loadSites"
    @change="loadDepositRebateSetting"
  >
    <el-option
      v-for="item in siteList.list"
      :key="item.id"
      :label="item.siteName"
      :value="item.id"
    />
  </el-select>
  <el-switch
    v-model="request.settingStatus"
    :active-text="t('fields.open')"
    :inactive-text="t('fields.close')"
    active-value="true"
    inactive-value="false"
    @change="changeSettingStatus"
    style="margin-left:20px"
  />
  <div class="btn-group">
    <el-button
      icon="el-icon-plus"
      size="mini"
      type="primary"
      v-permission="['sys:refer-rebate:setting:update']"
      @click="showCreate"
    >
      {{ t('fields.add') }}
    </el-button>
  </div>
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="700px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item :label="t('fields.referDistance')" prop="referDistance">
        <el-input-number
          v-model="form.referDistance"
          style="width: 145px"
          :min="1"
          :max="10"
          :controls="false"
          @keypress="restrictInput($event)"
        />
      </el-form-item>
      <el-form-item :label="t('fields.depositRebateRate')" prop="rebateRate">
        <el-input
          v-model="form.rebateRate"
          style="width: 135px"
          :maxlength="uiControl.bonusAmountRatioMax"
          @keypress="restrictDecimalInput($event)"
        />
        %
      </el-form-item>
      <el-form-item :label="t('fields.rollover')" prop="bonusRollover">
        <el-input-number
          v-model="form.bonusRollover"
          style="width: 145px"
          :min="1"
          :max="100"
          :controls="false"
          @keypress="restrictInput($event)"
        />
      </el-form-item>
      <el-form-item :label="t('fields.maxTotalBonusAmount')" prop="maxTotalBonusAmount">
        $
        <el-input-number
          v-model="form.maxTotalBonusAmount"
          style="width: 135px"
          :min="1"
          :max="999999999999999"
          :controls="false"
          @keypress="restrictInput($event)"
        />
      </el-form-item>
      <el-form-item :label="t('fields.maxDailyBonusAmount')" prop="maxDailyBonusAmount">
        $
        <el-input-number
          v-model="form.maxDailyBonusAmount"
          style="width: 135px"
          :min="1"
          :max="999999999999999"
          :controls="false"
          @keypress="restrictInput($event)"
        />
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
    <el-table-column prop="referDistance" :label="t('fields.referDistance')" width="180" />
    <el-table-column prop="rebateRate" :label="t('fields.depositRebateRate')" width="150">
      <template #default="scope">
        {{ (scope.row.rebateRate * 100).toFixed(2) }} %
      </template>
    </el-table-column>
    <el-table-column prop="bonusRollover" :label="t('fields.rollover')" width="180" />
    <el-table-column prop="maxTotalBonusAmount" :label="t('fields.maxTotalBonusAmount')" width="180">
      <template #default="scope">
        $ <span v-formatter="{data: scope.row.maxTotalBonusAmount,type: 'money'}" />
      </template>
    </el-table-column>
    <el-table-column prop="maxDailyBonusAmount" :label="t('fields.maxDailyBonusAmount')" width="180">
      <template #default="scope">
        $ <span v-formatter="{data: scope.row.maxDailyBonusAmount,type: 'money'}" />
      </template>
    </el-table-column>
    <el-table-column
      :label="t('fields.operate')"
      align="right"
      v-if="hasPermission(['sys:refer-rebate:setting:update'])"
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
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSiteWithPromo, getDepositRebateSettings, createDepositRebateSettings, updateDepositRebateSettings, updateSettingStatus } from "@/api/refer-rebate";
import { useI18n } from "vue-i18n";
import { hasPermission } from "@/utils/util";

const { t } = useI18n();
const siteList = reactive({
  list: []
});

const formRef = ref(null);
const request = reactive({
  siteId: null,
  settingStatus: false
});
const form = reactive({
  id: null,
  rebateRate: 0,
  bonusRollover: 1,
  maxTotalBonusAmount: 0,
  maxDailyBonusAmount: 0,
  referDistance: 1
});

const page = reactive({
  records: [],
  loading: false
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  bonusAmountRatioMax: 15,
  loaded: false
})

const formRules = reactive({
})

async function loadSites() {
  const { data: site } = await getSiteWithPromo();
  siteList.list = site;
}

async function loadDepositRebateSetting() {
  page.loading = true;
  const { data: ret } = await getDepositRebateSettings(request.siteId);
  page.records = ret.settings;
  request.settingStatus = ret.bonusStatus;
  page.loading = false;
  uiControl.loaded = true;
}

async function showCreate() {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.id = null
  showDialog('CREATE')
}

async function showEdit(setting) {
  showDialog('EDIT')
  await nextTick(() => {
    for (const key in setting) {
      if (key === 'rebateRate') {
        form[key] = setting[key] * 100
      } else {
        form[key] = setting[key]
      }
    }
  })
}

async function changeSettingStatus(state) {
  if (!uiControl.loaded) {
    return;
  }
  ElMessageBox.confirm(t('message.confirm'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await updateSettingStatus(request.siteId, state, "depositRebate");
    await loadDepositRebateSetting()
    ElMessage({ message: t('message.success'), type: 'success' })
  })
}

function showDialog(type) {
  if (type === 'CREATE') {
    uiControl.dialogTitle = t('fields.add')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editPrivilegeInfo')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.rebateRate = form.rebateRate / 100
      await updateDepositRebateSettings(form);
      uiControl.dialogVisible = false
      await loadDepositRebateSetting();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.rebateRate = form.rebateRate / 100
      await createDepositRebateSettings(request.siteId, form);
      uiControl.dialogVisible = false
      await loadDepositRebateSetting();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) &&
    charCode !== 46 &&
    form.rebateRate.toString().indexOf('.') > -1
  ) {
    event.preventDefault()
  }

  if (
    form.rebateRate !== null &&
    form.rebateRate.toString().indexOf('.') > -1
  ) {
    if (form.rebateRate.split('.')[1].length > 1) {
      event.preventDefault()
    }
    uiControl.bonusAmountRatioMax = 16
  } else {
    uiControl.bonusAmountRatioMax = 15
  }
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id;
  await loadDepositRebateSetting();
});

</script>

<style scoped>

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-start;
}

.param-label {
  display: inline-block;
  width: 80px;
  margin-top: 5px;
  margin-left: 5px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}

.param-input {
  width: 170px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 15px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}

.param-select {
  margin-left: 5px;
  margin-right: 15px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>
