<template>
  <el-select
    v-model="request.siteId"
    size="small"
    :placeholder="t('fields.site')"
    class="filter-item"
    style="width: 120px"
    default-first-option
    @focus="loadSites"
    @change="loadOneTimeBonusSetting"
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
      <el-row>
        <el-form-item :label="t('fields.minReferCount')" prop="minReferCount">
          <el-input-number
            v-model="form.minReferCount"
            style="width: 145px"
            :min="1"
            :max="999999"
            :controls="false"
            @keypress="restrictInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.maxReferCount')" prop="maxReferCount">
          <el-input-number
            v-model="form.maxReferCount"
            style="width: 145px"
            :min="1"
            :max="999999"
            :controls="false"
            @keypress="restrictInput($event)"
          />
        </el-form-item>
      </el-row>
      <el-form-item :label="t('fields.rules')" prop="bonusAmountRules">
        <div v-for="(item, index) in bonusRuleList" :key="index">
          <el-row>
            <span class="param-label">{{ t('fields.referDistance') }}</span>
            <el-input-number
              v-model="item.referDistance"
              style="width: 50px"
              :min="1"
              :max="10"
              :controls="false"
              @keypress="restrictInput($event)"
            />
            <span class="param-label">{{ t('fields.bonusAmount') }}:</span>
            <el-input-number
              v-model="item.bonusAmount"
              style="width: 145px"
              :min="0"
              :max="99999"
              :controls="false"
              @keypress="restrictDecimalInput($event)"
            />
            <span class="param-label">{{ t('fields.rollover') }}:</span>
            <el-input-number
              v-model="item.rollover"
              style="width: 50px"
              :min="0"
              :max="100"
              :controls="false"
              @keypress="restrictInput($event)"
            />
            <el-button v-if="index === bonusRuleList.length - 1 && hasPermission(['sys:refer-rebate:setting:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                       @click="addRule" plain
            >{{ t('fields.add') }}
            </el-button>
            <el-button v-if="bonusRuleList.length > 1 && hasPermission(['sys:refer-rebate:setting:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                       @click="delRule(index)" plain
            >{{ t('fields.delete') }}
            </el-button>
          </el-row>
        </div>
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
    <el-table-column prop="minReferCount" :label="t('fields.minReferCount')" width="180" />
    <el-table-column prop="maxReferCount" :label="t('fields.maxReferCount')" width="180" />
    <el-table-column prop="bonusAmountRules" :label="t('fields.bonusAmountRules')" width="400">
      <template #default="scope">
        <div v-for="(item, index) in formatRules(scope.row.bonusAmountRules)" :key="index">
          <el-button style="margin-top:10px;">
            <span>{{ t('fields.referDistance') }}: {{ item.referDistance }}</span>
            <span>{{ t('fields.bonusAmount') }}: {{ item.bonusAmount }}  </span>
            <span>{{ t('fields.rollover') }}: {{ item.rollover }}  </span>
          </el-button>
        </div>
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
import { getSiteWithPromo, getOneTimeBonusSetting, createOneTimeBonusSetting, updateOneTimeBonusSetting, updateSettingStatus } from "@/api/refer-rebate";
import { useI18n } from "vue-i18n";
import { hasPermission } from "@/utils/util";

const { t } = useI18n();
const siteList = reactive({
  list: []
});
const bonusRuleList = ref([]);

const formRef = ref(null);
const request = reactive({
  siteId: null,
  settingStatus: false
});
const form = reactive({
  minReferCount: 0,
  maxReferCount: 0,
  gameType: null,
  bonusAmountRules: null
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

async function loadOneTimeBonusSetting() {
  page.loading = true;
  const { data: ret } = await getOneTimeBonusSetting(request.siteId);
  page.records = ret.settings;
  request.settingStatus = ret.bonusStatus;
  page.loading = false;
  uiControl.loaded = true;
}

async function showCreate() {
  // formRef.value.resetFields();
  form.id = null;
  if (bonusRuleList.value.length > 0) {
    bonusRuleList.value = [];
  }
  addRule()
  showDialog('CREATE')
}

async function showEdit(setting) {
  showDialog('EDIT')
  bonusRuleList.value = [];
  await nextTick(() => {
    for (const key in setting) {
      if (key === 'bonusAmountRules') {
        const val = JSON.parse(setting[key]);
        for (let i = 0; i < val.length; i++) {
          bonusRuleList.value.push(val[i])
        }
      } else {
        form[key] = setting[key]
      }
    }
    if (bonusRuleList.value.length === 0) {
      addRule();
    }
  })
}

function addRule() {
  bonusRuleList.value.push({
    referDistance: 1,
    bonusAmount: 0,
    rollover: 1
  })
}

function delRule(index) {
  bonusRuleList.value.splice(index, 1);
}

function formatRules(rules) {
  const array = JSON.parse(rules);
  return array.map(item => {
    return {
      referDistance: item.referDistance,
      bonusAmount: item.bonusAmount,
      rollover: item.rollover
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
    await updateSettingStatus(request.siteId, state, "oneTime");
    await loadOneTimeBonusSetting()
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
      form.bonusAmountRules = JSON.stringify(bonusRuleList.value)
      await updateOneTimeBonusSetting(form);
      uiControl.dialogVisible = false
      await loadOneTimeBonusSetting();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.bonusAmountRules = JSON.stringify(bonusRuleList.value)
      await createOneTimeBonusSetting(request.siteId, form);
      uiControl.dialogVisible = false
      await loadOneTimeBonusSetting();
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
  await loadOneTimeBonusSetting();
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
