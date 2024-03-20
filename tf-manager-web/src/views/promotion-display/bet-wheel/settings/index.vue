<template>
  <el-select
    v-model="request.siteId"
    size="small"
    :placeholder="t('fields.site')"
    class="filter-item"
    style="width: 120px"
    default-first-option
    @focus="loadSites"
    @change="loadBetWheelConfig"
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
        <el-input v-if="hasPermission(['sys:bet-wheel:update'])" v-model="form.dailyMax" style="width: 350px;" />
        <span v-else>{{ form.dailyMax }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.sureWinBonus')" prop="sureWinBonus">
        <el-input v-if="hasPermission(['sys:bet-wheel:update'])" v-model="form.sureWinBonus" style="width: 350px;" />
        <span v-else>{{ form.sureWinBonus }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.sureWinMinSpin')" prop="sureWinMinSpin">
        <el-input v-if="hasPermission(['sys:bet-wheel:update'])" v-model="form.sureWinMinSpin" style="width: 350px;" />
        <span v-else>{{ form.sureWinMinSpin }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.allBonus')" prop="allBonus">
        <div v-for="(value, index) in allBonusParam" :key="index">
          <el-input v-if="hasPermission(['sys:bet-wheel:update'])" class="param-input" v-model="allBonusParam[index]" />
          <span v-else class="param-label">{{ value }}</span>

          <el-button v-if="index === allBonusParam.length - 1 && hasPermission(['sys:bet-wheel:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam('ALL_BONUS')" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="allBonusParam.length > 1 && hasPermission(['sys:bet-wheel:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam(index, 'ALL_BONUS')" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.oneTimeSpin')" prop="oneTimeSpin">
        <div v-for="(item, index) in oneTimeSpinParam" :key="index">
          <span class="param-label">{{ t('fields.validBet') }}:</span>
          <el-input v-if="hasPermission(['sys:bet-wheel:update'])" class="param-input" v-model="item.validBet" />
          <span v-else class="param-label">{{ item.validBet }}</span>

          <span class="param-label">{{ t('fields.bonus') }}:</span>
          <el-input v-if="hasPermission(['sys:bet-wheel:update'])" class="param-input" v-model="item.bonus" />
          <span v-else class="param-label">{{ item.bonus }}</span>

          <el-button v-if="index === oneTimeSpinParam.length - 1 && hasPermission(['sys:bet-wheel:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam('ONE_TIME_SPIN')" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="oneTimeSpinParam.length > 1 && hasPermission(['sys:bet-wheel:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam(index, 'ONE_TIME_SPIN')" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.validBetPerSpin')" prop="validBetPerSpin">
        <el-input v-if="hasPermission(['sys:bet-wheel:update'])" v-model="form.validBetPerSpin" style="width: 350px;" />
        <span v-else>{{ form.validBetPerSpin }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.bonus')" prop="bonus">
        <div v-for="(item, index) in bonusParam" :key="index">
          <span class="param-label">{{ t('fields.amount') }}:</span>
          <el-input v-if="hasPermission(['sys:bet-wheel:update'])" class="param-input" v-model="item.amount" />
          <span v-else class="param-label">{{ item.amount }}</span>

          <span class="param-label">{{ t('fields.probability') }}:</span>
          <el-input v-if="hasPermission(['sys:bet-wheel:update'])" class="param-input" v-model="item.probability" />
          <span v-else class="param-label">{{ item.probability }}</span>

          <el-button v-if="index === bonusParam.length - 1 && hasPermission(['sys:bet-wheel:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam('BONUS')" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="bonusParam.length > 1 && hasPermission(['sys:bet-wheel:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam(index, 'BONUS')" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <div class="dialog-footer">
      <el-button v-permission="['sys:bet-wheel:update']" type="primary" @click="edit">{{ t('fields.confirm') }}</el-button>
    </div>
  </el-form>
</template>

<script setup>

import { onMounted, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getBetWheelParam, getSiteWithPromo, updateBetWheelParam } from "@/api/bet-wheel";
import { useI18n } from "vue-i18n";
import { hasPermission } from '@/utils/util'
import { required } from "@/utils/validate";

const { t } = useI18n();
const siteList = reactive({
  list: []
});
const formRef = ref(null);
const allBonusParam = ref([]);
const oneTimeSpinParam = ref([]);
const bonusParam = ref([]);

const request = reactive({
  siteId: null
});
const form = reactive({
  dailyMax: null,
  sureWinBonus: null,
  sureWinMinSpin: null,
  allBonus: [],
  oneTimeSpin: [],
  validBetPerSpin: null,
  bonus: []
});

const validateAllBonus = (rule, value, callback) => {
  const param = JSON.parse(constructParam())
  if (param.allBonus.length === 0 || !param.allBonus[0]) {
    callback(new Error(t('message.validateAllBonusRequired')))
  }
  callback()
}

const validateOneTimeSpin = (rule, value, callback) => {
  const param = JSON.parse(constructParam())
  if (!param.oneTimeSpin[0].validBet && !param.oneTimeSpin[0].bonus) {
    callback(new Error(t('message.validateOneTimeSpinRequired')))
  }
  callback()
}

const validateBonus = (rule, value, callback) => {
  const param = JSON.parse(constructParam())
  if (!param.bonus[0].amount && !param.bonus[0].probability) {
    callback(new Error(t('message.validateBonusRequired')))
  }
  callback()
}

const formRules = reactive({
  dailyMax: [required(t('message.validateDailyMaxRequired'))],
  sureWinBonus: [required(t('message.validateSureWinBonusRequired'))],
  sureWinMinSpin: [required(t('message.validateSureWinMinSpinRequired'))],
  allBonus: [{ validator: validateAllBonus, trigger: 'blur' }],
  oneTimeSpin: [{ validator: validateOneTimeSpin, trigger: 'blur' }],
  validBetPerSpin: [required(t('message.validateValidBetPerSpinRequired'))],
  bonus: [{ validator: validateBonus, trigger: 'blur' }],
})

async function loadSites() {
  const { data: site } = await getSiteWithPromo();
  siteList.list = site;
}

async function loadBetWheelConfig() {
  allBonusParam.value = [];
  oneTimeSpinParam.value = [];
  bonusParam.value = [];
  formRef.value.resetFields();
  const { data: ret } = await getBetWheelParam(request.siteId);
  nextTick(() => {
    if (ret) {
      Object.entries(ret).forEach(([key, value]) => {
        if (Object.keys(form).find(k => k === key)) {
          form[key] = value;
        }
        if (key === 'allBonus') {
          allBonusParam.value = value;
        } else if (key === 'oneTimeSpin') {
          for (let i = 0; i < value.length; i++) {
            const json = {}
            Object.entries(value[i]).forEach(([ruleKey, ruleValue]) => {
              json[ruleKey] = ruleValue;
            })
            oneTimeSpinParam.value.push(json)
          }
        } else if (key === 'bonus') {
          for (let i = 0; i < value.length; i++) {
            const json = {}
            Object.entries(value[i]).forEach(([ruleKey, ruleValue]) => {
              json[ruleKey] = ruleValue;
            })
            bonusParam.value.push(json)
          }
        }
      })
    }

    if (allBonusParam.value.length === 0) {
      addParam('ALL_BONUS');
    }

    if (oneTimeSpinParam.value.length === 0) {
      addParam('ONE_TIME_SPIN');
    }

    if (bonusParam.value.length === 0) {
      addParam('BONUS');
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const params = constructParam();
      await updateBetWheelParam(request.siteId, params);
      await loadBetWheelConfig();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function addParam(type) {
  if (type === 'ALL_BONUS') {
    allBonusParam.value.push(null)
  } else if (type === 'ONE_TIME_SPIN') {
    oneTimeSpinParam.value.push({
      validBet: null,
      bonus: null
    })
  } else if (type === 'BONUS') {
    bonusParam.value.push({
      amount: null,
      probability: null
    })
  }
}

function delParam(index, type) {
  if (type === 'ALL_BONUS') {
    allBonusParam.value.splice(index, 1);
  } else if (type === 'ONE_TIME_SPIN') {
    oneTimeSpinParam.value.splice(index, 1);
  } else if (type === 'BONUS') {
    bonusParam.value.splice(index, 1);
  }
}

function constructParam() {
  const json = {};
  Object.entries(form).forEach(([key, value]) => {
    if (key !== 'oneTimeSpin' && key !== 'bonus' && key !== 'allBonus') {
      json[key] = value;
    }
  })

  const oneTimeSpinJson = [];
  Object.values(oneTimeSpinParam.value).forEach((item) => {
    if (item) {
      oneTimeSpinJson.push(item);
    }
  });

  const bonusJson = [];
  Object.values(bonusParam.value).forEach((item) => {
    if (item) {
      bonusJson.push(item);
    }
  });

  json.allBonus = allBonusParam.value;
  json.oneTimeSpin = oneTimeSpinJson;
  json.bonus = bonusJson;
  return JSON.stringify(json);
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id;
  await loadBetWheelConfig();
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
