<template>
  <el-select
    v-model="request.siteId"
    size="small"
    :placeholder="t('fields.site')"
    class="filter-item"
    style="width: 120px"
    default-first-option
    @focus="loadSites"
    @change="loadFishRedPacketConfig"
  >
    <el-option
      v-for="item in siteList.list"
      :key="item.id"
      :label="item.siteName"
      :value="item.id"
    />
  </el-select>
  <el-form v-if="request.siteId" ref="formRef" :model="form" :rules="formRules" :inline="true" size="small" label-width="200px" style="margin-top: 10px;">
    <el-form-item :label="t('fields.rules')" prop="rules">
      <div v-for="(item, index) in rulesParam" :key="index">
        <span class="param-label">{{ t('fields.validBet') }}:</span>
        <el-input v-if="hasPermission(['sys:fish-red-packet:update'])" class="param-input" v-model="item.validBet" />
        <span v-else class="param-label">{{ item.validBet }}</span>

        <span class="param-label">{{ t('fields.minBonus') }}:</span>
        <el-input v-if="hasPermission(['sys:fish-red-packet:update'])" class="param-input" v-model="item.minBonus" />
        <span v-else class="param-label">{{ item.minBonus }}</span>

        <span class="param-label">{{ t('fields.maxBonus') }}:</span>
        <el-input v-if="hasPermission(['sys:fish-red-packet:update'])" class="param-input" v-model="item.maxBonus" />
        <span v-else class="param-label">{{ item.maxBonus }}</span>

        <el-button v-if="index === rulesParam.length - 1 && hasPermission(['sys:fish-red-packet:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                   @click="addParam()" plain
        >{{ t('fields.add') }}
        </el-button>
        <el-button v-if="rulesParam.length > 1 && hasPermission(['sys:fish-red-packet:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                   @click="delParam(index)" plain
        >{{ t('fields.delete') }}
        </el-button>
      </div>
    </el-form-item>
    <div class="dialog-footer">
      <el-button v-permission="['sys:fish-red-packet:update']" type="primary" @click="edit">{{ t('fields.confirm') }}</el-button>
    </div>
  </el-form>
</template>

<script setup>

import { onMounted, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getFishRedPacketParam, getSiteWithPromo, updateFishRedPacketParam } from "@/api/fish-red-packet";
import { useI18n } from "vue-i18n";
import { hasPermission } from '@/utils/util'

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
  rules: []
});

const validateRules = (rule, value, callback) => {
  const param = JSON.parse(constructParam())
  if (!param.rules[0].validBet && !param.rules[0].minBonus && !param.rules[0].maxBonus) {
    callback(new Error(t('message.validateRulesRequired')))
  }
  callback()
}

const formRules = reactive({
  rules: [{ validator: validateRules, trigger: 'blur' }]
})

async function loadSites() {
  const { data: site } = await getSiteWithPromo();
  siteList.list = site;
}

async function loadFishRedPacketConfig() {
  rulesParam.value = [];
  if (formRef.value) {
    formRef.value.resetFields();
  }
  const { data: ret } = await getFishRedPacketParam(request.siteId);
  console.log(ret)
  nextTick(() => {
    if (ret) {
      Object.entries(ret).forEach(([key, value]) => {
        if (Object.keys(form).find(k => k === key)) {
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
      await updateFishRedPacketParam(request.siteId, params);
      await loadFishRedPacketConfig();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function addParam() {
  rulesParam.value.push({
    validBet: null,
    minBonus: null,
    maxBonus: null
  })
}

function delParam(index) {
  rulesParam.value.splice(index, 1);
}

function constructParam() {
  const json = {};
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
  await loadFishRedPacketConfig();
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
