<template>
  <el-form
    :model="form"
    label-width="200px"
    label-position="left"
    class="config_form"
  >
    <el-form-item
      :label="t('fields.site')"
      size="mini"
      v-if="hasRole(['MANAGER', 'ADMIN'])"
    >
      <el-select
        v-model="siteId"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
      >
        <el-option
          v-for="item in sites.list"
          :key="item.id"
          :label="item.siteName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('fields.defaultVip')" size="mini">
      <el-select
        v-model="defaultVip"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadVip"
      >
        <el-option
          v-for="item in vips"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('fields.defaultAgentVip')" size="mini">
      <el-select
        v-model="defaultAgentVip"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadVip"
      >
        <el-option
          v-for="item in vips"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('fields.defaultFinancialLevel')" size="mini">
      <el-select
        v-model="defaultFinancial"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadFinancialLevelInfos"
      >
        <el-option
          v-for="item in financialLevel"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('fields.defaultAgentFinancialLevel')" size="mini">
      <el-select
        v-model="defaultAgentFinancial"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadFinancialLevelInfos"
      >
        <el-option
          v-for="item in financialLevel"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('fields.defaultRiskLevel')" size="mini">
      <el-select
        v-model="defaultRisk"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadRiskLevels"
      >
        <el-option
          v-for="item in risks"
          :key="item.id"
          :label="item.levelName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('fields.defaultAgentRiskLevel')" size="mini">
      <el-select
        v-model="defaultAgentRisk"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadRiskLevels"
      >
        <el-option
          v-for="item in risks"
          :key="item.id"
          :label="item.levelName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-divider />
    <el-form-item :label="t('fields.withdrawalFailureType')" size="mini">
      <div class="withdrawal_failure_type">
        <div v-for="(item, index) in withdrawFailType" :key="index">
          <el-input style="width: 400px " v-model="item.value" />
          <el-button
            v-if="index === 0"
            icon="el-icon-plus"
            size="mini"
            type="primary"
            style="margin-left: 20px"
            @click="addWithdrawFailType()"
            plain
          >
            {{ t('fields.add') }}
          </el-button>
          <el-button
            v-else
            icon="el-icon-remove"
            size="mini"
            type="danger"
            style="margin-left: 20px"
            @click="delConfig(item.id)"
            plain
          >
            {{ t('fields.delete') }}
          </el-button>
        </div>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.withdrawalFailureCause')" size="mini">
      <div
        style="margin-bottom: 5px"
        v-for="(item, index) in withdrawFailCause"
        :key="index"
      >
        <el-input style="width: 70% " v-model="item.value" />
        <el-button
          v-if="index === 0"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          style="margin-left: 20px"
          @click="addWithdrawFailCause()"
          plain
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          v-else
          icon="el-icon-remove"
          size="mini"
          type="danger"
          style="margin-left: 20px"
          @click="delConfig(item.id)"
          plain
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </el-form-item>
    <el-divider />
    <el-form-item :label="t('fields.adjustmentType')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          class="adjust_type"
          style="margin-bottom: 5px"
          v-for="(item, index) in adjustType"
          :key="index"
        >
          <el-input v-model="item.value" />
          <el-button
            v-if="index === 0"
            icon="el-icon-plus"
            type="primary"
            style="margin-left: 20px"
            @click="addAdjustType()"
            plain
          >
            {{ t('fields.add') }}
          </el-button>
          <el-button
            v-else
            icon="el-icon-remove"
            type="danger"
            style="margin-left: 20px"
            @click="delConfig(item.id)"
            plain
          >
            {{ t('fields.delete') }}
          </el-button>
        </div>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.feedbackType')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          class="adjust_type"
          style="margin-bottom: 5px"
          v-for="(item, index) in feedbackType"
          :key="index"
        >
          <el-input v-model="item.value" />
          <el-button
            v-if="index === 0"
            icon="el-icon-plus"
            type="primary"
            style="margin-left: 20px"
            @click="addFeedbackType()"
            plain
          >
            {{ t('fields.add') }}
          </el-button>
          <el-button
            v-else
            icon="el-icon-remove"
            type="danger"
            style="margin-left: 20px"
            @click="delConfig(item.id)"
            plain
          >
            {{ t('fields.delete') }}
          </el-button>
        </div>
      </div>
    </el-form-item>
    <el-divider />
    <el-form-item :label="t('fields.platformFee')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in platformFee"
          :key="index"
        >
          <el-input
            v-model="item.value"
            style="width: 150px"
            :placeholder="t('fields.platformFee')"
          />
        </div>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.paymentFee')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in paymentFee"
          :key="index"
        >
          <el-input
            v-model="item.value"
            style="width: 150px"
            :placeholder="t('fields.paymentFee')"
          />
        </div>
      </div>
    </el-form-item>

    <el-divider />
    <el-form-item :label="t('fields.affiliateShortUrlPlatform')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in affiliateShortUrlPlatform"
          :key="index"
        >
          <el-input
            v-model="item.value"
            style="width: 400px"
            :placeholder="t('fields.affiliateShortUrlPlatform')"
          />
        </div>
      </div>
    </el-form-item>

    <el-form-item :label="t('fields.affiliateWebLink')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in affiliateWebLink"
          :key="index"
        >
          <el-input
            v-model="item.value"
            style="width: 400px"
            :placeholder="t('fields.affiliateWebLink')"
          />
        </div>
      </div>
    </el-form-item>

    <el-form-item :label="t('fields.affiliateH5Link')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in affiliateH5Link"
          :key="index"
        >
          <el-input
            v-model="item.value"
            style="width: 400px"
            :placeholder="t('fields.affiliateH5Link')"
          />
        </div>
      </div>
    </el-form-item>

    <el-form-item :label="t('fields.s3Url')" size="mini">
      <div style="margin-bottom: 5px">
        <el-input
          v-model="s3Url"
          :placeholder="t('fields.s3Url')"
          style="width: 400px"
        />
      </div>
    </el-form-item>
    <el-divider />
    <el-form-item :label="t('fields.customerSupportAddress')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in csAddress"
          :key="index"
        >
          <JsonEditor
            class="editor"
            v-model="editorValue"
            currentMode="code"
            :modeList="[]"
            @update:modelValue="updataModel"
          />
          <el-input
            v-model="item.value"
            type="hidden"
            :rows="10"
            style="width: 350px; white-space: pre-line"
            placeholder="{'abc':'xyz'}"
          />
        </div>
      </div>
    </el-form-item>
    <el-collapse v-model="uiControl.activeGroups">
      <el-collapse-item
        v-for="groupConfig in configs.customGroup"
        :title="groupConfig.group"
        :name="groupConfig.group"
        :key="groupConfig.group"
      >
        <template #title>
          <span>{{ groupConfig.group }}</span>
          <span
            style="margin-left: 10px"
            @click="addGroupConfig(groupConfig.group)"
          >
            <el-icon color="#409efc">
              <Plus />
            </el-icon>
          </span>
        </template>
        <el-form-item
          v-for="item in groupConfig.items"
          border-color="#dcdcdc"
          border-style="dashed"
          label=""
          size="mini"
          :key="item.orderIndex"
        >
          <el-input data-highlight-target class="disable-input" v-model="item.code" style="width: 200px;" />
          -
          <el-input data-highlight-target class="disable-input" v-model="item.value" style="width: 700px;" />
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            style="margin-left: 20px"
            @click="item.siteId === 0 ? showOverrideDefaultConfig(item) : showEdit(item)"
            plain
          >
            {{ t('fields.edit') }}
          </el-button>
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            style="margin-left: 20px"
            @click="delConfig(item.id)"
            plain
            v-if="item.siteId !== 0"
          >
            {{ t('fields.delete') }}
          </el-button>
          <el-button
            circle
            icon="el-icon-arrow-up"
            size="mini"
            type="primary"
            style="margin-left: 20px"
            plain
            @click="moveUp(item, groupConfig)"
            v-if="item.siteId !== 0"
            :disabled="!canClickMoveUpButton(item, groupConfig)"
          />
          <el-button
            circle
            icon="el-icon-arrow-down"
            size="mini"
            type="primary"
            style="margin-left: 20px"
            plain
            @click="moveDown(item, groupConfig)"
            v-if="item.siteId !== 0"
            :disabled="!canClickMoveDownButton(item, groupConfig)"
          />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
    <el-form-item size="mini" style="margin-top: 20px;">
      <el-button type="primary" @click="updateConfigs">
        {{ t('fields.confirm') }}
      </el-button>
      <el-button
        size="mini"
        type="success"
        icon="el-icon-circle-plus"
        @click="showDialog('CREATE')"
      >
        {{ t('fields.createConfig') }}
      </el-button>
    </el-form-item>
  </el-form>
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    :before-close="closeDialog"
  >
    <el-form
      ref="configForm"
      :model="form"
      :rules="formRules"
      label-width="150px"
      label-position="left"
      @submit.prevent
    >
      <el-form-item :label="t('fields.configGroup')" prop="configGroup">
        <el-autocomplete
          v-model="form.configGroup"
          :fetch-suggestions="fetchSuggestion"
          :trigger-on-focus="false"
          class="inline-input"
          :placeholder="t('fields.configGroup')"
          style="outline: none; border: none"
          @select="handleSelect"
          :disabled="dialogMode === 'OVERRIDE_DEFAULT'"
        />
      </el-form-item>
      <el-form-item :label="t('fields.configCode')" prop="code">
        <el-input v-model="form.code" :placeholder="t('fields.configCode')" :disabled="dialogMode === 'OVERRIDE_DEFAULT'" />
      </el-form-item>
      <el-form-item :label="t('fields.valueType')" prop="rulesId">
        <el-select
          v-model="form.rulesId"
          size="small"
          :placeholder="t('fields.type')"
          class="filter-item"
          style="width: 300px;"
          default-first-option
          @change="handleValueTypeChange"
        >
          <el-option
            v-for="item in valueRules"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.configValue')" prop="value">
        <div v-if="selectedRule === null">
          <el-input v-model="form.value" :placeholder="t('fields.configValue')" />
        </div>
        <div v-else>
          <el-radio-group v-if="selectedRule.type === 'RADIO'" size="small" style="width: 300px" v-model="form.value">
            <el-radio-button :value-key="rule.value" v-for="rule in JSON.parse(selectedRule.value)" :label="rule.value" :key="rule.key">{{ rule.label }}</el-radio-button>
          </el-radio-group>
          <el-select
            v-if="selectedRule.type === 'SELECT'"
            v-model="form.value"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 250px;margin-left: 5px"
          >
            <el-option
              v-for="rule in JSON.parse(selectedRule.value)"
              :key="rule.key"
              :label="rule.label"
              :value="rule.value"
            />
          </el-select>
          <el-switch
            v-if="selectedRule.type === 'SWITCH'"
            v-model="form.value"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            size="small"
            :active-text="switchText(selectedRule.value, 'ACTIVE')"
            :inactive-text="switchText(selectedRule.value, 'INACTIVE')"
          />
          <el-checkbox
            v-if="selectedRule.type === 'CHECKBOX'"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            Check all
          </el-checkbox>
          <el-checkbox-group v-if="selectedRule.type === 'CHECKBOX'" v-model="checkedSelection" @change="handleCheckedSelectionChange">
            <el-checkbox v-for="rule in JSON.parse(selectedRule.value)" :label="rule.label" :key="rule.value" :value="rule.value" />
          </el-checkbox-group>
          <el-input v-if="selectedRule.type === 'INPUT'" v-model="form.value" :placeholder="t('fields.configValue')" />
        </div>
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button @click="closeDialog">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="submit()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { getSiteListSimple } from '../../../../api/site'
import uuidv1 from 'uuid/v1'
import { getVipList } from '../../../../api/vip'
import { getFinancialLevels } from '../../../../api/financial-level'
import { selectList } from '../../../../api/risk-level'
import {
  deleteById,
  getConfigs,
  updateConfig,
  updateBatch,
  createConfig,
  updateOrderBatch,
} from '../../../../api/config'
import { hasRole } from '../../../../utils/util'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { required } from '../../../../utils/validate'
import JsonEditor from 'json-editor-vue3'
import { getValueRulesList } from '../../../../api/value-rules'
import { Plus } from "@element-plus/icons-vue";
import bus from '../../../../utils/bus'

const { t } = useI18n()
const siteId = ref()

const sites = reactive({
  list: [],
})

const vips = ref([])

const financialLevel = ref([])

const risks = ref([])

const configs = reactive({
  value: [],
  customList: [],
  customGroup: [],
})

const uiControl = reactive({
  dialogTitle: '',
  dialogVisible: false,
  activeGroups: [],
})

const configForm = ref(null)

const dialogMode = ref(null)
const closeDialog = () => {
  dialogMode.value = null;
  uiControl.dialogVisible = false
}

/* 值类型规则 */
const valueRules = ref([]);
const selectedRule = ref(null)
/* 多选框 */
const checkedSelection = ref([])
const checkBoxSelections = reactive([])
const checkAll = ref(false)
const isIndeterminate = ref(true)

const form = reactive({
  id: null,
  siteId: '',
  configGroup: null,
  code: null,
  value: null,
  rulesId: null,
})

const formRules = reactive({
  configGroup: [required(t('message.validateConfigGroupRequired'))],
  code: [required(t('message.validateConfigCodeRequired'))],
  value: [required(t('message.validateConfigValueRequired'))],
  rulesId: [required(t('message.validateConfigTypeRequired'))],
})

const fetchSuggestion = (queryString, cb) => {
  const results = configs.customGroup.filter(item => item.group.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    .map(item => ({
      value: item.group,
      id: item.group
    }))
  // call callback function to return suggestions
  cb(results)
}

const handleSelect = item => {
  if (item) {
    form.configGroup = item.value;
  }
}

watch(
  () => configs.value,
  () => {
    defaultVip.value = Number(getter('default_vip', false).value)
    defaultAgentVip.value = Number(getter('default_agent_vip', false).value)
    defaultFinancial.value = Number(getter('default_financial', false).value)
    defaultAgentFinancial.value = Number(
      getter('default_agent_financial', false).value
    )
    defaultRisk.value = Number(getter('default_risk', false).value)
    defaultAgentRisk.value = Number(getter('default_agent_risk', false).value)
    s3Url.value = getter('s3_url', false).value
  },
  { deep: true }
)

watch(
  () => siteId.value,
  async () => {
    configs.value.splice(0, configs.value.length)
    await loadConfigs()
    await loadVip()
    await loadFinancialLevelInfos()
    await loadRiskLevels()
    await loadValueRules()
  }
)

const defaultVip = computed({
  get: () => Number(getter('default_vip', false).value),
  set: newVla =>
    (configs.value.find(item => item.code === 'default_vip').value = newVla),
})

const defaultAgentVip = computed({
  get: () => Number(getter('default_agent_vip', false).value),
  set: newVla =>
    (configs.value.find(
      item => item.code === 'default_agent_vip'
    ).value = newVla),
})

const defaultFinancial = computed({
  get: () => Number(getter('default_financial', false).value),
  set: newVla =>
    (configs.value.find(
      item => item.code === 'default_financial'
    ).value = newVla),
})

const defaultAgentFinancial = computed({
  get: () => Number(getter('default_agent_financial', false).value),
  set: newVla =>
    (configs.value.find(
      item => item.code === 'default_agent_financial'
    ).value = newVla),
})

const defaultRisk = computed({
  get: () => Number(getter('default_risk', false).value),
  set: newVla =>
    (configs.value.find(item => item.code === 'default_risk').value = newVla),
})

const defaultAgentRisk = computed({
  get: () => Number(getter('default_agent_risk', false).value),
  set: newVla =>
    (configs.value.find(
      item => item.code === 'default_agent_risk'
    ).value = newVla),
})

const withdrawFailType = computed(() => getter('cancel_type'))

const withdrawFailCause = computed(() => getter('cancel_cause'))

const adjustType = computed(() => getter('adjust_type'))

const feedbackType = computed(() => getter('feedback_type'))

const platformFee = computed(() => getter('platform_fee'))

const paymentFee = computed(() => getter('payment_fee'))

const csAddress = computed(() => getter('cs_address'))

const affiliateWebLink = computed(() => getter('affiliate_web_link'))

const affiliateH5Link = computed(() => getter('affiliate_h5_link'))

const affiliateShortUrlPlatform = computed(() =>
  getter('affiliate_short_url_platform')
)

const s3Url = computed({
  get: () => getter('s3_url', false).value,
  set: newVla =>
    (configs.value.find(item => item.code === 's3_url').value = newVla),
})

const canClickMoveUpButton = (item, groupConfig) => {
  const index = groupConfig.items.findIndex(config => config.id === item.id)
  if (index === 0) {
    return false;
  }

  if (groupConfig.items[index - 1].siteId === 0) {
    return false;
  }
  return true;
}

const canClickMoveDownButton = (item, groupConfig) => {
  const index = groupConfig.items.findIndex(config => config.id === item.id)
  if (index === groupConfig.items.length - 1) {
    return false;
  }
  return true;
}

function getter(code, isArray = true) {
  let subArray = configs.value.filter(config => config.code === code)
  if (subArray.length === 0) {
    addConfigs(code)
    subArray = configs.value.filter(config => config.code === code)
  }
  if (isArray) {
    return subArray
  } else {
    return subArray[0]
  }
}

function addWithdrawFailType() {
  addConfigs('cancel_type')
}

function addWithdrawFailCause() {
  addConfigs('cancel_cause')
}

function addAdjustType() {
  addConfigs('adjust_type')
}

function addFeedbackType() {
  addConfigs('feedback_type')
}

function addConfigs(code) {
  configs.value.push({
    id: uuidv1(),
    siteId: siteId.value,
    name: null,
    code: code,
    value: null,
  })
}

async function delConfig(id) {
  for (let index = 0; index < configs.value.length; index++) {
    if (configs.value[index].id === id) {
      configs.value.splice(index, 1)
      if (typeof id === 'number') {
        ElMessageBox.confirm(t('message.confirmDelete'), {
          confirmButtonText: t('fields.confirm'),
          cancelButtonText: t('fields.cancel'),
          type: 'warning',
        }).then(async () => {
          await deleteById(id)
          ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
          loadConfigs()
        })
      }
      break
    }
  }
}

async function addGroupConfig(group) {
  form.configGroup = group
  showDialog('CREATE')
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
  siteId.value = ret[0].id
}

async function loadVip() {
  const { data: ret } = await getVipList({ siteId: siteId.value })
  vips.value = ret
}

async function loadFinancialLevelInfos() {
  const { data: ret } = await getFinancialLevels({ siteId: siteId.value })
  financialLevel.value = ret
}

async function loadRiskLevels() {
  const { data: risk } = await selectList({ siteId: siteId.value })
  risks.value = risk
}

async function loadConfigs() {
  const { data: ret } = await getConfigs({ siteId: siteId.value })
  configs.value = ret

  const csAddressConfig = configs.value.find(item => item.code === 'cs_address')

  if (csAddressConfig) {
    editorValue = JSON.parse(csAddressConfig.value)
  }

  configs.customList = configs.value.filter(
    config =>
      config.code !== 'adjust_type' &&
      config.code !== 'affiliate_h5_link' &&
      config.code !== 'affiliate_short_url_platform' &&
      config.code !== 'affiliate_web_link' &&
      config.code !== 'cancel_cause' &&
      config.code !== 'cancel_type' &&
      config.code !== 'cs_address' &&
      config.code !== 'default_agent_financial' &&
      config.code !== 'default_agent_risk' &&
      config.code !== 'default_agent_vip' &&
      config.code !== 'default_financial' &&
      config.code !== 'default_risk' &&
      config.code !== 'default_vip' &&
      config.code !== 'feedback_type' &&
      config.code !== 'payment_fee' &&
      config.code !== 'platform_fee' &&
      config.code !== 's3_url' &&
      config.code !== 'withdraw_tips'
  )

  configs.customList = configs.customList.sort((a, b) => {
    if (a.configGroup < b.configGroup) {
      return -1
    } else if (a.configGroup > b.configGroup) {
      return 1
    } else {
      if (a.code < b.code) {
        return -1
      } else if (a.code > b.code) {
        return 1
      }
    }
  })

  // group customList items by configGroup and store in customGroup as {group: configGroup, items: [customList]}
  configs.customGroup = []
  let group = null
  let items = []
  for (let index = 0; index < configs.customList.length; index++) {
    if (group !== configs.customList[index].configGroup) {
      if (group !== null) {
        configs.customGroup.push({ group, items })
      }
      group = configs.customList[index].configGroup
      items = []
    }
    items.push(configs.customList[index])
    // handle last group
    if (index === configs.customList.length - 1) {
      configs.customGroup.push({ group, items })
    }
  }

  // sort configs.customGroup.items by siteId and order index
  for (let index = 0; index < configs.customGroup.length; index++) {
    configs.customGroup[index].items = configs.customGroup[index].items.sort(
      (a, b) => {
        if (a.siteId !== b.siteId) {
          return a.siteId - b.siteId;
        } else {
          return a.orderIndex - b.orderIndex;
        }
      }
    )
    // set item.orderIndex = item index
    for (let i = 0; i < configs.customGroup[index].items.length; i++) {
      configs.customGroup[index].items[i].orderIndex = i
    }
  }

  removeJsonEditorElement()
}

function loadConfig(customConfig) {
  nextTick(() => {
    for (const key in customConfig) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = customConfig[key]
      }
    }
    if (form.rulesId !== null) {
      const valueType = valueRules.value.find(r => r.id === form.rulesId);
      selectedRule.value = valueType;
      if (selectedRule.value.type === 'CHECKBOX') {
        const selectionArr = JSON.parse(selectedRule.value.value);
        selectionArr.forEach(element => {
          checkBoxSelections.push(element)
        });
        const selectedValue = form.value.split(",")
        const selectedOption = selectedValue.map(value => {
          return checkBoxSelections.find(select => select.value === value)
        });
        const mergedLabels = selectedOption.map(rule => rule.label);
        checkedSelection.value = mergedLabels;
        const checkedCount = checkedSelection.value.length
        checkAll.value = checkedCount === checkBoxSelections.length
        isIndeterminate.value = checkedCount > 0 && checkedCount < checkBoxSelections.length
      } else if (selectedRule.value.type === 'SWITCH') {
        form.value = form.value.toLowerCase() === 'true';
      }
    }
  })
}

function showEdit(customConfig) {
  showDialog('EDIT')
  loadConfig(customConfig)
}

function showOverrideDefaultConfig(customConfig) {
  showDialog('OVERRIDE_DEFAULT')
  loadConfig(customConfig)
}

async function updateConfigs() {
  const sub = configs.value.filter(item => item.value === null)
  if (sub.length > 0) {
    ElMessage({ message: t('message.validateNoNullValue'), type: 'error' })
    return
  }
  for (let index = 0; index < configs.value.length; index++) {
    if (typeof configs.value[index].id !== 'number') {
      delete configs.value[index].id
    }
    if (configs.value[index].code === 'platform_fee') {
      if (configs.value[index].value < 0 || configs.value[index].value > 1) {
        ElMessage({
          message: t('message.validatePlatformFeeFormat'),
          type: 'error',
        })
        return
      }
    }
    if (configs.value[index].code === 'payment_fee') {
      if (configs.value[index].value < 0 || configs.value[index].value > 1) {
        ElMessage({
          message: t('message.validatePaymentFeeFormat'),
          type: 'error',
        })
        return
      }
    }
    if (configs.value[index].code === 'cs_address') {
      try {
        JSON.parse(configs.value[index].value)
      } catch (e) {
        ElMessage({
          message: t('message.validateCustomerSupportAddressFormat'),
          type: 'error',
        })
        return
      }
    }
  }
  const configsWithoutDefaultData = configs.value.filter(item => item.siteId !== 0);
  await updateBatch(configsWithoutDefaultData)
  const orderUpdate = []
  for (let index = 0; index < configs.customGroup.length; index++) {
    for (let i = 0; i < configs.customGroup[index].items.length; i++) {
      const item = configs.customGroup[index].items[i];

      if (item.siteId === 0) {
        continue;
      }

      orderUpdate.push({
        id: item.id,
        orderIndex: i,
      })
    }
  }
  await updateOrderBatch(orderUpdate)
  await loadConfigs()
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
}

function showDialog(type) {
  dialogMode.value = type;
  // 清除多选项数据值
  checkBoxSelections.splice(0, checkBoxSelections.length);
  checkedSelection.value = []
  selectedRule.value = null
  if (type === 'CREATE') {
    if (configForm.value) {
      form.id = null
      form.rulesId = null
      form.code = null
      form.value = null
    }
    uiControl.dialogTitle = t('fields.createConfig')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editConfig')
  } else if (type === 'OVERRIDE_DEFAULT') {
    uiControl.dialogTitle = t('fields.editConfig')
  }
  uiControl.dialogVisible = true
}

async function submit() {
  configForm.value.validate(async valid => {
    if (valid) {
      form.configGroup = form.configGroup.trim();
      form.code = form.code.trim();
      form.value = form.value + "".trim();
      if (dialogMode.value === 'CREATE') {
        form.siteId = siteId.value
        await createConfig(form)
        ElMessage({ message: t('message.addSuccess'), type: 'success' })
      } else if (dialogMode.value === 'EDIT') {
        await updateConfig(form)
        ElMessage({ message: t('message.updateSuccess'), type: 'success' })
      } else if (dialogMode.value === 'OVERRIDE_DEFAULT') {
        form.siteId = siteId.value;
        form.id = null
        await createConfig(form)
        ElMessage({ message: t('message.updateSuccess'), type: 'success' })
      }

      await loadConfigs()
      closeDialog()
    }
  })
}

function moveUp(item, groupConfig) {
  const index = groupConfig.items.findIndex(config => config.id === item.id)
  if (index > 0) {
    const temp = groupConfig.items[index]

    groupConfig.items[index] = groupConfig.items[index - 1]
    groupConfig.items[index].orderIndex = index
    groupConfig.items[index - 1] = temp
    groupConfig.items[index - 1].code = temp.code
    groupConfig.items[index - 1].orderIndex = index - 1
  }
}

function moveDown(item, groupConfig) {
  const index = groupConfig.items.findIndex(config => config.id === item.id)
  if (index < groupConfig.items.length - 1) {
    const temp = groupConfig.items[index]

    groupConfig.items[index] = groupConfig.items[index + 1]
    groupConfig.items[index].orderIndex = index
    groupConfig.items[index + 1] = temp
    groupConfig.items[index + 1].code = temp.code
    groupConfig.items[index + 1].orderIndex = index + 1
  }
}

let editorValue = ref({})

const updataModel = val => {
  const config = configs.value.find(item => item.code === 'cs_address')
  if (config) {
    config.value = JSON.stringify(val)
  }
}

function removeJsonEditorElement() {
  const classesToRemove = [
    'jsoneditor-poweredBy',
    'jsoneditor-sort',
    'jsoneditor-transform',
    'jsoneditor-undo',
    'jsoneditor-redo',
    'jsoneditor-repair',
  ]
  classesToRemove.forEach(className => {
    const elements = document.getElementsByClassName(className)
    Array.from(elements).forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
  })
}

/* 加载值类型规则列表 */
async function loadValueRules() {
  const { data: rules } = await getValueRulesList()
  valueRules.value = rules;
}

/* 值类型-选项处理 */
const handleValueTypeChange = () => {
  const valueType = valueRules.value.find(r => r.id === form.rulesId);
  selectedRule.value = valueType;
  form.value = "";
  if (selectedRule.value.type === 'CHECKBOX') {
    checkedSelection.value = [];
    const selectionArr = JSON.parse(selectedRule.value.value);
    selectionArr.forEach(element => {
      checkBoxSelections.push(element)
    });
  } else if (selectedRule.value.type === 'SWITCH') {
    form.value = false
  }
};

/* 多选框-全选处理 */
const handleCheckAllChange = (val) => {
  const mergedLabels = checkBoxSelections.map(rule => rule.label);
  checkedSelection.value = val ? mergedLabels : []
  isIndeterminate.value = false
  if (checkedSelection.value.length > 0) {
    const selectedSelection = checkedSelection.value.map(value => {
      return checkBoxSelections.find(select => select.label === value)
    }
    );
    const mergedValues = selectedSelection.map(rule => rule.value).join(',');
    form.value = mergedValues
  } else {
    form.value = ""
  }
}

/* 多选框-选项事件处理 */
const handleCheckedSelectionChange = (val) => {
  const checkedCount = checkedSelection.value.length
  checkAll.value = checkedCount === checkBoxSelections.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < checkBoxSelections.length
  if (checkedSelection.value.length > 0) {
    const selectedSelection = checkedSelection.value.map(value => {
      return checkBoxSelections.find(select => select.label === value)
    }
    );
    const mergedValues = selectedSelection.map(rule => rule.value).join(',');
    form.value = mergedValues
  } else {
    form.value = ""
  }
}

function switchText(val, type) {
  const valueArr = val.split(",");
  if (type === "INACTIVE") {
    return valueArr[0];
  } else {
    return valueArr[1];
  }
}

function searchCode(searchTerm) {
  const contentElements = document.querySelectorAll('[data-highlight-target]');
  contentElements.forEach((el) => {
    el.style.backgroundColor = ''; // Clear existing highlights
  });

  const matchedElements = Array.from(contentElements).filter((el) => {
    const content = el.value || el.textContent || '';
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  matchedElements.forEach((el) => {
    el.style.backgroundColor = 'yellow';
  });

  const key = matchedElements[0].value || matchedElements[0].textContent || '';
  console.log(key);

  const groups = configs.customGroup
    .filter(group => group.items.some(item => item.code.includes(searchTerm) || item.value.includes(searchTerm)))
    .filter(group => !uiControl.activeGroups.includes(group.group));

  uiControl.activeGroups = [...new Set([...uiControl.activeGroups, ...groups.map(group => group.group)])];
  console.log(uiControl.activeGroups);

  nextTick(() => {
    matchedElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

onMounted(() => {
  loadSites()
  loadFinancialLevelInfos()
  loadRiskLevels()
  loadValueRules()
  bus.on('search', searchCode)
  bus.on('add', () => showDialog('CREATE'))
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.config_form {
  padding: 10px;

  :deep(.withdrawal_failure_type) {
    display: grid;
    grid-template-columns: repeat(2, 500px);
    grid-row-gap: 5px;
    grid-column-gap: 40px;
  }

  :deep(.adjust_type) {
    display: flex;

    .el-input {
      &:nth-child(1) {
        margin-right: 10px;
        width: 300px;
      }

      &:nth-child(2) {
        width: 500px;
      }
    }
  }

  :deep(label) {
    font-weight: 900;
  }

  :deep(.el-input) {
    width: 200px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.disable-input {
  pointer-events: none;
}

.default-label {
  font-size: 12px;
  color: red;
  margin-left: 10px;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.full-screen {
  right: 20px !important;
}
</style>
