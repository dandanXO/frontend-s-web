<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;"
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
      </div>
    </div>
    <el-card style="margin-top: 10px;">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
        style="margin-top: 10px;"
      >
        <el-form-item :label="t('fields.dailyMin')" prop="dailyMinSpin">
          <el-input v-model="form.dailyMinSpin" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.dailyMax')" prop="dailyMaxSpin">
          <el-input v-model="form.dailyMaxSpin" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.depositPerSpin')" prop="depositPerSpin">
          <el-input v-model="form.depositPerSpin" style="width: 350px;" />
        </el-form-item>
        <div class="form-footer">
          <el-button v-permission="['sys:game-steps:update']" type="primary" @click="updateParam">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px;">
      <el-button size="small" type="primary" @click="showDialog('CREATE')">{{ t('fields.addStage') }}</el-button>
      <el-tabs v-if="stages.length > 0" type="card" style="margin-top: 10px;" v-model="activeTab">
        <el-tab-pane
          v-for="stg in stages"
          :key="stg.id"
          :label="t('fields.stage') + stg.stage"
          :name="stg.stage"
        >
          <template #label>
            <span>{{ t('fields.stage') + stg.stage }}</span>
            <el-button v-permission="['sys:game-steps:update']" icon="el-icon-edit" size="mini" type="success" style="margin-left: 10px" @click="showEdit(stg)" />
            <el-button v-permission="['sys:game-steps:del']" icon="el-icon-delete" size="mini" type="danger" style="margin-left: 10px" @click="removeSetting(stg.id)" />
          </template>
          <el-space style="align-items: stretch;">
            <el-card>
              <template #header>
                <span class="param-label">{{ t('fields.steps') }}</span>
              </template>
              <div v-for="(item, index) in JSON.parse(stg.steps)" :key="index">
                <span class="param-label">{{ t('fields.number') }}:</span><span class="param-input">{{ item.number }} </span>
                <span class="param-label">{{ t('fields.rate') }}:</span><span class="param-input">{{ item.rate }}</span>
              </div>
            </el-card>
            <el-card>
              <template #header>
                <span class="param-label">{{ t('fields.stepBonus') }}</span>
              </template>
              <div v-for="(item, index) in JSON.parse(stg.stepBonus)" :key="index">
                <span class="param-label">{{ t('fields.place') }}:</span><span class="param-input">{{ item.place }} </span>
                <span class="param-label">{{ t('fields.bonus') }}:</span><span class="param-input">{{ item.bonus }}</span>
              </div>
            </el-card>
          </el-space>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="1080px"
  >
    <el-form
      ref="settingFormRef"
      :model="settingForm"
      :rules="settingFormRules"
      :inline="true"
      size="small"
      label-width="200px"
      style="margin-top: 10px;"
    >
      <el-form-item :label="t('fields.stage')" prop="stage">
        <el-input v-model="settingForm.stage" style="width: 350px;" @keypress="restrictInput($event)" />
      </el-form-item>
      <el-form-item :label="t('fields.steps')" prop="steps">
        <!-- <el-input v-model="form.params" style="width: 350px;" /> -->
        <div v-for="(item, index) in stepsParam" :key="index">
          <span class="param-label">{{ t('fields.number') }}:</span><el-input class="param-input" v-model="item.number" />
          <span class="param-label">{{ t('fields.rate') }}:</span><el-input class="param-input" v-model="item.rate" />
          <el-button v-if="index === stepsParam.length - 1" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam('STEPS')" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam('STEPS', index)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="t('fields.stepBonus')" prop="stepBonus">
        <!-- <el-input v-model="form.params" style="width: 350px;" /> -->
        <div v-for="(item, index) in bonusParam" :key="index">
          <span class="param-label">{{ t('fields.place') }}:</span><el-input class="param-input" v-model="item.place" />
          <span class="param-label">{{ t('fields.bonus') }}:</span><el-input class="param-input" v-model="item.bonus" />
          <el-button v-if="index === bonusParam.length - 1" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam('BONUS')" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam('BONUS', index)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getGameStepsSettings, getGameStepsStages, createGameStepsSettings, updateGameStepsParam,
  updateGameStepsSettings, getSiteWithPromo, getNextLevel, deleteGameStepsSettings
} from "@/api/game-steps";
import { useI18n } from "vue-i18n";
import { useStore } from '@/store'
import { TENANT } from "@/store/modules/user/action-types";
import { required } from "@/utils/validate";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const siteList = reactive({
  list: []
});
const formRef = ref(null);
const settingFormRef = ref(null);
const stepsParam = ref([]);
const bonusParam = ref([]);
const stages = ref([]);
const activeTab = ref(1)

const request = reactive({
  siteId: null
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE'
})

const form = reactive({
  dailyMinSpin: null,
  dailyMaxSpin: null,
  depositPerSpin: null
});

const settingForm = reactive({
  siteId: null,
  stage: null,
  steps: null,
  stepBonus: null
})

const validateSteps = (rule, value, callback) => {
  const param = JSON.parse(constructParam('STEPS_PARAM'))
  if (!param[0].number || !param[0].rate) {
    callback(new Error(t('message.validateStepsRequired')))
  }
  callback()
}

const validateStepBonus = (rule, value, callback) => {
  const param = JSON.parse(constructParam('BONUS_PARAM'))
  if (!param[0].place || !param[0].bonus) {
    callback(new Error(t('message.validateStepBonusRequired')))
  }
  callback()
}

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  dailyMinSpin: [required(t('message.validateDailyMinRequired'))],
  dailyMaxSpin: [required(t('message.validateDailyMaxRequired'))],
  depositPerSpin: [required(t('message.validateDepositPerSpinRequired'))]
});

const settingFormRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  stage: [required(t('message.validateStageRequired'))],
  steps: [{ validator: validateSteps, trigger: 'blur' }],
  stepBonus: [{ validator: validateStepBonus, trigger: 'blur' }]
});

async function loadSites() {
  const { data: site } = await getSiteWithPromo();
  siteList.list = site;
}

async function loadGameStepsConfig() {
  const { data: ret } = await getGameStepsSettings(request.siteId);
  stepsParam.value = [];
  bonusParam.value = [];
  nextTick(() => {
    Object.entries(JSON.parse(ret)).forEach(([key, value]) => {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = value;
      }
    })
  });
  const { data: stgs } = await getGameStepsStages(request.siteId);
  stages.value = stgs;
  activeTab.value = stages.value[0].stage
}

function showEdit(setting) {
  showDialog("EDIT");
  populateSelectedData(settingForm, setting)
}

function populateSelectedData(selectedForm, setting) {
  stepsParam.value = [];
  bonusParam.value = [];
  nextTick(() => {
    Object.entries(setting).forEach(([key, value]) => {
      if (Object.keys(selectedForm).find(k => k === key)) {
        selectedForm[key] = value;
      }
      if (key === 'steps') {
        const stepsJson = JSON.parse(value)
        for (let i = 0; i < stepsJson.length; i++) {
          const json = {};
          Object.entries(stepsJson[i]).forEach(([stepKey, stepValue]) => {
            if (stepKey === 'number') {
              json.number = stepValue;
            } else if (stepKey === 'rate') {
              json.rate = stepValue;
            }
          })
          stepsParam.value.push(json);
        }
      } else if (key === 'stepBonus') {
        const stepBonusJson = JSON.parse(value)
        for (let i = 0; i < stepBonusJson.length; i++) {
          const json = {};
          Object.entries(stepBonusJson[i]).forEach(([bonusKey, bonusValue]) => {
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
  });
}

async function resetForm() {
  settingForm.siteId = request.siteId
  const { data: nextLevel } = await getNextLevel(request.siteId)
  settingForm.stage = nextLevel
  stepsParam.value = []
  bonusParam.value = []
  addParam('STEPS')
  addParam('BONUS')
}

function showDialog(type) {
  if (type === "CREATE") {
    resetForm()
    uiControl.dialogTitle = t('fields.addStage');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editStage');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create();
  } else if (uiControl.dialogType === 'EDIT') {
    edit();
  }
}

async function create() {
  settingForm.siteId = request.siteId;
  settingForm.steps = constructParam('STEPS_PARAM');
  settingForm.stepBonus = constructParam('BONUS_PARAM');
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createGameStepsSettings(settingForm);
      uiControl.dialogVisible = false;
      await loadGameStepsConfig();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  settingForm.siteId = request.siteId;
  settingForm.steps = constructParam('STEPS_PARAM');
  settingForm.stepBonus = constructParam('BONUS_PARAM');
  formRef.value.validate(async (valid) => {
    if (valid) {
      await updateGameStepsSettings(settingForm);
      uiControl.dialogVisible = false;
      await loadGameStepsConfig();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function updateParam() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const params = JSON.stringify(form);
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

function constructParam(type) {
  if (type === 'STEPS_PARAM') {
    const stepsParamJson = [];
    Object.values(stepsParam.value).forEach((item) => {
      if (item) {
        stepsParamJson.push(item);
      }
    });

    return JSON.stringify(stepsParamJson);
  } else if (type === 'BONUS_PARAM') {
    const bonusParamJson = [];
    Object.values(bonusParam.value).forEach((item) => {
      if (item) {
        bonusParamJson.push(item);
      }
    });
    return JSON.stringify(bonusParamJson);
  }
}

async function removeSetting(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteGameStepsSettings(id)
    await loadGameStepsConfig()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    request.siteId = siteList.list.find(s => s.siteName === store.state.user.siteName).id;
  } else {
    request.siteId = siteList.list[0].id;
  }
  await loadGameStepsConfig();
});

</script>

<style scoped>

.btn-group {
  margin-top: 15px;
}

.form-footer {
  display: flex;
  justify-content: flex-start;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
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
