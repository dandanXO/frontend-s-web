<template>
  <el-select
    v-model="request.siteId"
    size="small"
    :placeholder="t('fields.site')"
    class="filter-item"
    style="width: 120px"
    default-first-option
    @focus="loadSites"
    @change="loadPiggyBankSettings"
  >
    <el-option
      v-for="item in siteList.list"
      :key="item.id"
      :label="item.siteName"
      :value="item.id"
    />
  </el-select>
  <el-form ref="formRef" :model="form" :rules="formRules" :inline="true" size="small" label-width="200px" style="margin-top: 10px;">
    <el-row>
      <el-form-item :label="t('fields.minWithdrawAmount')" prop="minWithdrawAmount">
        <el-input v-if="hasPermission(['sys:piggy-bank:update'])" v-model="form.minWithdrawAmount" style="width: 350px;" />
        <span v-else>{{ form.minWithdrawAmount }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.rules')" prop="rules">
        <div v-for="(item, index) in rulesParam" :key="index">
          <span class="param-label">{{ t('fields.minDeposit') }}:</span>
          <el-input v-if="hasPermission(['sys:piggy-bank:update'])" class="param-input" v-model="item.minDeposit" />
          <span v-else class="param-label">{{ item.minDeposit }}</span>

          <span class="param-label">{{ t('fields.bonus') }}:</span>
          <el-input v-if="hasPermission(['sys:piggy-bank:update'])" class="param-input" v-model="item.bonus" />
          <span v-else class="param-label">{{ item.bonus }}</span>

          <el-button v-if="index === rulesParam.length - 1 && hasPermission(['sys:piggy-bank:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam('BONUS')" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="rulesParam.length > 1 && hasPermission(['sys:piggy-bank:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam(index, 'BONUS')" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <div class="dialog-footer">
      <el-button v-permission="['sys:piggy-bank:update']" type="primary" @click="edit">{{ t('fields.confirm') }}</el-button>
    </div>
  </el-form>
</template>

<script setup>

import { onMounted, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getPiggyBankSettings, getSiteWithPromo, updatePiggyBankSettings } from "@/api/piggy-bank";
import { useI18n } from "vue-i18n";
import { hasPermission } from '@/utils/util'
import { required } from "@/utils/validate";

const { t } = useI18n();
const siteList = reactive({
  list: []
});
const formRef = ref(null);
const rulesParam = ref([]);

const request = reactive({
  siteId: null
});
const form = reactive({
  minWithdrawAmount: null,
  rules: []
});

const validateRules = (rule, value, callback) => {
  const param = JSON.parse(constructParam())
  if (!param.rules[0].minDeposit && !param.rules[0].bonus) {
    callback(new Error(t('message.validateRulesRequired')))
  }
  callback()
}

const formRules = reactive({
  minWithdrawAmount: [required(t('message.validateMinWithdrawRequired'))],
  rules: [{ validator: validateRules, trigger: 'blur' }],
})

async function loadSites() {
  const { data: site } = await getSiteWithPromo();
  siteList.list = site;
}

async function loadPiggyBankSettings() {
  rulesParam.value = [];
  formRef.value.resetFields();
  const { data: ret } = await getPiggyBankSettings(request.siteId);
  nextTick(() => {
    if (ret) {
      Object.entries(ret).forEach(([key, value]) => {
        if (Object.keys(form).find(k => k === key)) {
          form[key] = value;
        }
        if (key === 'rules') {
          for (let i = 0; i < value.length; i++) {
            const json = {}
            Object.entries(value[i]).forEach(([ruleKey, ruleValue]) => {
              json[ruleKey] = ruleValue;
            })
            rulesParam.value.push(json)
          }
        }
      })
    }

    if (rulesParam.value.length === 0) {
      addParam();
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const params = constructParam();
      await updatePiggyBankSettings(request.siteId, params);
      await loadPiggyBankSettings();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function addParam() {
  rulesParam.value.push({
    minDeposit: null,
    bonus: null
  })
}

function delParam(index) {
  rulesParam.value.splice(index, 1);
}

function constructParam() {
  const json = {};
  Object.entries(form).forEach(([key, value]) => {
    if (key !== 'rules') {
      json[key] = value;
    }
  })

  const rulesJson = [];
  Object.values(rulesParam.value).forEach((item) => {
    if (item) {
      rulesJson.push(item);
    }
  });

  json.rules = rulesJson;
  return JSON.stringify(json);
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id;
  await loadPiggyBankSettings();
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
