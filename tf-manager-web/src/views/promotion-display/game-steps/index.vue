<template>
  <el-select
    v-model="request.siteId"
    size="small"
    :placeholder="t('fields.site')"
    class="filter-item"
    style="width: 120px"
    default-first-option
    @focus="loadSites"
    @change="loadGameStepsConfig"
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
      <el-form-item :label="t('fields.dailyFree')" prop="dailyFree">
        <el-input v-if="hasPermission(['sys:game-steps:update'])" v-model="form.dailyFree" style="width: 350px;" />
        <span v-else>{{ form.dailyFree }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.dailyMax')" prop="dailyMax">
        <el-input v-if="hasPermission(['sys:game-steps:update'])" v-model="form.dailyMax" style="width: 350px;" />
        <span v-else>{{ form.dailyMax }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.depositPerSpin')" prop="depositPerSpin">
        <el-input v-if="hasPermission(['sys:game-steps:update'])" v-model="form.depositPerSpin" style="width: 350px;" />
        <span v-else>{{ form.dailyMax }}</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.steps')" prop="steps">
        <!-- <el-input v-model="form.params" style="width: 350px;" /> -->
        <div v-for="(item, index) in stepsParam" :key="index">
          <span class="param-label">{{ t('fields.number') }}:</span><el-input v-if="hasPermission(['sys:game-steps:update'])" class="param-input" v-model="item.number" /><span v-else class="param-label">{{ item.number }}</span>
          <span class="param-label">{{ t('fields.rate') }}:</span><el-input v-if="hasPermission(['sys:game-steps:update'])" class="param-input" v-model="item.rate" /><span v-else class="param-label">{{ item.rate }}</span>
          <el-button v-if="index === stepsParam.length - 1 && hasPermission(['sys:game-steps:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam('STEPS')" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="hasPermission(['sys:game-steps:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam('STEPS', index)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.stepBonus')" prop="stepBonus">
        <!-- <el-input v-model="form.params" style="width: 350px;" /> -->
        <div v-for="(item, index) in bonusParam" :key="index">
          <span class="param-label">{{ t('fields.place') }}:</span><el-input v-if="hasPermission(['sys:game-steps:update'])" class="param-input" v-model="item.place" /><span v-else class="param-label">{{ item.place }}</span>
          <span class="param-label">{{ t('fields.bonus') }}:</span><el-input v-if="hasPermission(['sys:game-steps:update'])" class="param-input" v-model="item.bonus" /><span v-else class="param-label">{{ item.bonus }}</span>
          <el-button v-if="index === bonusParam.length - 1 && hasPermission(['sys:game-steps:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam('BONUS')" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="hasPermission(['sys:game-steps:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam('BONUS', index)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <div class="dialog-footer">
      <el-button v-permission="['sys:game-steps:update']" type="primary" @click="edit">{{ t('fields.confirm') }}</el-button>
    </div>
  </el-form>
</template>

<script setup>

import { onMounted, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getGameStepsParam, getSiteWithPromo, updateGameStepsParam } from "../../../api/game-steps";
import { useI18n } from "vue-i18n";
import { hasPermission } from '../../../utils/util'

const { t } = useI18n();
const siteList = reactive({
  list: []
});
const formRef = ref(null);
const stepsParam = ref([]);
const bonusParam = ref([]);

const request = reactive({
  siteId: null
});
const form = reactive({
  dailyFree: null,
  dailyMax: null,
  depositPerSpin: null,
  steps: null,
  stepBonus: null
});

async function loadSites() {
  const { data: site } = await getSiteWithPromo();
  siteList.list = site;
}

async function loadGameStepsConfig() {
  const { data: ret } = await getGameStepsParam(request.siteId);
  stepsParam.value = [];
  bonusParam.value = [];
  nextTick(() => {
    Object.entries(JSON.parse(ret)).forEach(([key, value]) => {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = value;
      }
      if (key === 'steps') {
        for (let i = 0; i < value.length; i++) {
          const json = {};
          Object.entries(value[i]).forEach(([stepKey, stepValue]) => {
            if (stepKey === 'number') {
              json.number = stepValue;
            } else if (stepKey === 'rate') {
              json.rate = stepValue;
            }
          })
          stepsParam.value.push(json);
        }
      } else if (key === 'stepBonus') {
        for (let i = 0; i < value.length; i++) {
          const json = {};
          Object.entries(value[i]).forEach(([bonusKey, bonusValue]) => {
            if (bonusKey === 'place') {
              json.place = bonusValue;
            } else if (bonusKey === 'bonus') {
              json.bonus = bonusValue;
            }
          })
          bonusParam.value.push(json);
        }
      }
    })
    addParam();
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const params = constructParam();
      console.log(params)
      await updateGameStepsParam(request.siteId, params);
      await loadGameStepsConfig();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function addParam(type) {
  if (type === 'STEPS') {
    stepsParam.value.push({
      number: "",
      rate: ""
    })
  } else if (type === 'BONUS') {
    bonusParam.value.push({
      place: "",
      bonus: ""
    })
  }
}

function delParam(type, index) {
  if (type === 'STEPS') {
    stepsParam.value.splice(index, 1);
  } else if (type === 'BONUS') {
    bonusParam.value.splice(index, 1);
  }
}

function constructParam() {
  const json = {};
  Object.entries(form).forEach(([key, value]) => {
    if (key !== 'steps' || key !== 'stepBonus') {
      json[key] = value;
    }
  })

  const stepsParamJson = [];
  const bonusParamJson = [];
  Object.values(stepsParam.value).forEach((item) => {
    if (item) {
      stepsParamJson.push(item);
    }
  });

  Object.values(bonusParam.value).forEach((item) => {
    if (item) {
      bonusParamJson.push(item);
    }
  });

  json.steps = stepsParamJson;
  json.stepBonus = bonusParamJson;
  return JSON.stringify(json);
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id;
  await loadGameStepsConfig();
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
</style>
