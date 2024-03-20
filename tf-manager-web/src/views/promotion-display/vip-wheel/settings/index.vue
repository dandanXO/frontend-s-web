<template>
  <el-select
    v-model="request.siteId"
    size="small"
    :placeholder="t('fields.site')"
    class="filter-item"
    style="width: 120px"
    default-first-option
    @focus="loadSites"
    @change="loadVipWheelConfig"
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
      <el-form-item :label="t('fields.dailyMax')" prop="dailyMax">
        <el-input v-if="hasPermission(['sys:vip-wheel:update'])" v-model="form.dailyMax" style="width: 350px;" />
        <span v-else>{{ form.dailyMax }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.depositPerSpin')" prop="depositPerSpin">
        <el-input v-if="hasPermission(['sys:vip-wheel:update'])" v-model="form.depositPerSpin" style="width: 350px;" />
        <span v-else>{{ form.depositPerSpin }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.defaultBonus')" prop="defaultBonus">
        <el-input v-if="hasPermission(['sys:vip-wheel:update'])" v-model="form.defaultBonus" style="width: 350px;" />
        <span v-else>{{ form.defaultBonus }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.sureWinBonus')" prop="sureWinBonus">
        <el-input v-if="hasPermission(['sys:vip-wheel:update'])" v-model="form.sureWinBonus" style="width: 350px;" />
        <span v-else>{{ form.sureWinBonus }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.sureWinMinSpin')" prop="sureWinMinSpin">
        <el-input v-if="hasPermission(['sys:vip-wheel:update'])" v-model="form.sureWinMinSpin" style="width: 350px;" />
        <span v-else>{{ form.sureWinMinSpin }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.rules')" prop="rules">
        <!-- <el-input v-model="form.params" style="width: 350px;" /> -->
        <div v-for="(item, index) in param" :key="index">
          <span class="param-label">{{ t('fields.bonus') }}:</span>
          <el-input v-if="hasPermission(['sys:vip-wheel:update'])" class="param-input" v-model="item.bonus" />
          <span v-else class="param-label">{{ item.bonus }}</span>

          <span class="param-label">{{ t('fields.vipLevel') }}:</span>
          <el-select
            v-if="hasPermission(['sys:vip-wheel:update'])"
            v-model="item.vipLevel"
            multiple
            collapse-tags
            size="small"
            class="param-select"
            :placeholder="t('fields.vipLevel')"
            @focus="loadVips"
            @change="sortVips(item)"
          >
            <el-option
              v-for="vip in vips.list"
              :key="vip.level"
              :label="vip.name"
              :value="vip.level"
            />
          </el-select>
          <span v-else class="param-label">{{ item.vipLevel }}</span>

          <span class="param-label">{{ t('fields.probability') }}:</span>
          <el-input v-if="hasPermission(['sys:vip-wheel:update'])" class="param-input" v-model="item.probability" />
          <span v-else class="param-label">{{ item.probability }}</span>
          <el-button v-if="index === param.length - 1 && hasPermission(['sys:vip-wheel:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam()" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="param.length > 1 && hasPermission(['sys:vip-wheel:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam(index)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <div class="dialog-footer">
      <el-button v-permission="['sys:vip-wheel:update']" type="primary" @click="edit">{{ t('fields.confirm') }}</el-button>
    </div>
  </el-form>
</template>

<script setup>

import { onMounted, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getVipWheelParam, getSiteWithPromo, updateVipWheelParam } from "@/api/vip-wheel";
import { useI18n } from "vue-i18n";
import { hasPermission } from '@/utils/util'
import { getVipList } from "@/api/vip";
import { required } from "@/utils/validate";

const { t } = useI18n();
const siteList = reactive({
  list: []
});
const vips = reactive({
  list: []
});
const formRef = ref(null);
const param = ref([]);

const request = reactive({
  siteId: null
});
const form = reactive({
  dailyMax: null,
  depositPerSpin: null,
  defaultBonus: null,
  sureWinBonus: null,
  sureWinMinSpin: null,
  rules: [],
});

const formRules = reactive({
  dailyMax: [required(t('message.validateDailyMaxRequired'))],
  depositPerSpin: [required(t('message.validateDepositPerSpinRequired'))],
  defaultBonus: [required(t('message.validateDefaultBonusRequired'))],
  sureWinBonus: [required(t('message.validateSureWinBonusRequired'))],
  sureWinMinSpin: [required(t('message.validateSureWinMinSpinRequired'))]
})

async function loadSites() {
  const { data: site } = await getSiteWithPromo();
  siteList.list = site;
}

async function loadVips() {
  const { data: vip } = await getVipList({ siteId: request.siteId });
  vips.list = vip;
}

async function sortVips(item) {
  item.vipLevel = item.vipLevel.sort((a, b) => a - b)
}

async function loadVipWheelConfig() {
  await loadVips();
  const { data: ret } = await getVipWheelParam(request.siteId);
  param.value = [];
  nextTick(() => {
    Object.entries(JSON.parse(ret)).forEach(([key, value]) => {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = value;
      }
      if (key === 'rules') {
        for (let i = 0; i < value.length; i++) {
          const json = {};
          Object.entries(value[i]).forEach(([ruleKey, ruleValue]) => {
            if (ruleKey === 'bonus') {
              json.bonus = ruleValue;
            } else if (ruleKey === 'vipLevel') {
              json.vipLevel = ruleValue;
            } else if (ruleKey === 'probability') {
              json.probability = ruleValue;
            }
          })
          param.value.push(json);
        }
      }
    })
    if (param.value.length === 0) {
      addParam();
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const params = constructParam();
      await updateVipWheelParam(request.siteId, params);
      await loadVipWheelConfig();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function addParam() {
  param.value.push({
    bonus: null,
    vipLevel: [],
    probability: null
  })
}

function delParam(index) {
  param.value.splice(index, 1);
}

function constructParam() {
  const json = {};
  Object.entries(form).forEach(([key, value]) => {
    if (key !== 'rules') {
      json[key] = value;
    }
  })

  const paramJson = [];
  Object.values(param.value).forEach((item) => {
    if (item) {
      paramJson.push(item);
    }
  });

  json.rules = paramJson;
  return JSON.stringify(json);
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id;
  await loadVipWheelConfig();
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
