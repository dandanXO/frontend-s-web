<template>
  <el-form
    :model="form"
    label-width="200px"
    label-position="left"
    class="config_form"
  >
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
    <el-form-item :label="t('fields.settlementSetting')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in settlementSetting"
          :key="index"
        >
          <el-input
            v-model="item.value"
            style="width: 400px"
            :placeholder="t('fields.settlementSetting')"
          />
        </div>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.settlementBetRequired')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in settlementBetRequired"
          :key="index"
        >
          <el-input
            v-model="item.value"
            style="width: 150px"
            :placeholder="t('fields.settlementBetRequired')"
          />
        </div>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.settlementDepositRequired')" size="mini">
      <div class="withdrawal_failure_type">
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in settlementDepositRequired"
          :key="index"
        >
          <el-input
            v-model="item.value"
            style="width: 150px"
            :placeholder="t('fields.settlementDepositRequired')"
          />
        </div>
      </div>
    </el-form-item>
    <el-form-item size="mini" style="margin-top: 20px;">
      <el-button type="primary" @click="updateConfigs">
        {{ t('fields.confirm') }}
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
        <el-input
          v-model="form.code"
          :placeholder="t('fields.configCode')"
          :disabled="dialogMode === 'OVERRIDE_DEFAULT'"
        />
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
          <el-input
            v-model="form.value"
            :placeholder="t('fields.configValue')"
          />
        </div>
        <div v-else>
          <el-radio-group
            v-if="selectedRule.type === 'RADIO'"
            size="small"
            style="width: 300px"
            v-model="form.value"
          >
            <el-radio-button
              :value-key="rule.value"
              v-for="rule in JSON.parse(selectedRule.value)"
              :label="rule.value"
              :key="rule.key"
            >
              {{ rule.label }}
            </el-radio-button>
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
          <el-checkbox-group
            v-if="selectedRule.type === 'CHECKBOX'"
            v-model="checkedSelection"
            @change="handleCheckedSelectionChange"
          >
            <el-checkbox
              v-for="rule in JSON.parse(selectedRule.value)"
              :label="rule.label"
              :key="rule.value"
              :value="rule.value"
            />
          </el-checkbox-group>
          <el-input
            v-if="selectedRule.type === 'INPUT'"
            v-model="form.value"
            :placeholder="t('fields.configValue')"
          />
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
import { getSiteListSimple } from '../../../api/site'
import uuidv1 from 'uuid/v1'
import { getVipList } from '../../../api/vip'
import { getFinancialLevels } from '../../../api/financial-level'
import { selectList } from '../../../api/risk-level'
import {
  deleteById,
  getConfigs,
  updateConfig,
  updateBatch,
  createConfig,
  updateOrderBatch,
} from '../../../api/config'
import { hasRole } from '../../../utils/util'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { required } from '../../../utils/validate'
import JsonEditor from 'json-editor-vue3'
import { getValueRulesList } from '../../../api/value-rules'
import { Plus } from '@element-plus/icons-vue'
import bus from '../../../utils/bus'

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
  dialogMode.value = null
  uiControl.dialogVisible = false
}

/* 值类型规则 */
const valueRules = ref([])
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
  const results = configs.customGroup
    .filter(
      item => item.group.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
    .map(item => ({
      value: item.group,
      id: item.group,
    }))
  // call callback function to return suggestions
  cb(results)
}

const handleSelect = item => {
  if (item) {
    form.configGroup = item.value
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

const platformFee = computed(() => getter('platform_fee'))

const paymentFee = computed(() => getter('payment_fee'))

const settlementSetting = computed(() => getter('settlement_setting'))

const settlementBetRequired = computed(() => getter('settlement_bet_required'))

const settlementDepositRequired = computed(() => getter('settlement_deposit_required'))

const s3Url = computed({
  get: () => getter('s3_url', false).value,
  set: newVla =>
    (configs.value.find(item => item.code === 's3_url').value = newVla),
})

function getter(code) {
  const subArray = configs.value.filter(config => config.code === code)
  return subArray
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
          return a.siteId - b.siteId
        } else {
          return a.orderIndex - b.orderIndex
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
      const valueType = valueRules.value.find(r => r.id === form.rulesId)
      selectedRule.value = valueType
      if (selectedRule.value.type === 'CHECKBOX') {
        const selectionArr = JSON.parse(selectedRule.value.value)
        selectionArr.forEach(element => {
          checkBoxSelections.push(element)
        })
        const selectedValue = form.value.split(',')
        const selectedOption = selectedValue.map(value => {
          return checkBoxSelections.find(select => select.value === value)
        })
        const mergedLabels = selectedOption.map(rule => rule.label)
        checkedSelection.value = mergedLabels
        const checkedCount = checkedSelection.value.length
        checkAll.value = checkedCount === checkBoxSelections.length
        isIndeterminate.value =
          checkedCount > 0 && checkedCount < checkBoxSelections.length
      } else if (selectedRule.value.type === 'SWITCH') {
        form.value = form.value.toLowerCase() === 'true'
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
  const configsWithoutDefaultData = [platformFee.value[0], paymentFee.value[0],
    settlementSetting.value[0], settlementBetRequired.value[0], settlementDepositRequired.value[0]];

  console.log(configsWithoutDefaultData)
  await updateBatch(configsWithoutDefaultData)
  await loadConfigs()
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
}

function showDialog(type) {
  dialogMode.value = type
  // 清除多选项数据值
  checkBoxSelections.splice(0, checkBoxSelections.length)
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
      form.configGroup = form.configGroup.trim()
      form.code = form.code.trim()
      form.value = form.value + ''.trim()
      if (dialogMode.value === 'CREATE') {
        form.siteId = siteId.value
        await createConfig(form)
        ElMessage({ message: t('message.addSuccess'), type: 'success' })
      } else if (dialogMode.value === 'EDIT') {
        await updateConfig(form)
        ElMessage({ message: t('message.updateSuccess'), type: 'success' })
      } else if (dialogMode.value === 'OVERRIDE_DEFAULT') {
        form.siteId = siteId.value
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
  valueRules.value = rules
}

/* 值类型-选项处理 */
const handleValueTypeChange = () => {
  const valueType = valueRules.value.find(r => r.id === form.rulesId)
  selectedRule.value = valueType
  form.value = ''
  if (selectedRule.value.type === 'CHECKBOX') {
    checkedSelection.value = []
    const selectionArr = JSON.parse(selectedRule.value.value)
    selectionArr.forEach(element => {
      checkBoxSelections.push(element)
    })
  } else if (selectedRule.value.type === 'SWITCH') {
    form.value = false
  }
}

/* 多选框-全选处理 */
const handleCheckAllChange = val => {
  const mergedLabels = checkBoxSelections.map(rule => rule.label)
  checkedSelection.value = val ? mergedLabels : []
  isIndeterminate.value = false
  if (checkedSelection.value.length > 0) {
    const selectedSelection = checkedSelection.value.map(value => {
      return checkBoxSelections.find(select => select.label === value)
    })
    const mergedValues = selectedSelection.map(rule => rule.value).join(',')
    form.value = mergedValues
  } else {
    form.value = ''
  }
}

/* 多选框-选项事件处理 */
const handleCheckedSelectionChange = val => {
  const checkedCount = checkedSelection.value.length
  checkAll.value = checkedCount === checkBoxSelections.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < checkBoxSelections.length
  if (checkedSelection.value.length > 0) {
    const selectedSelection = checkedSelection.value.map(value => {
      return checkBoxSelections.find(select => select.label === value)
    })
    const mergedValues = selectedSelection.map(rule => rule.value).join(',')
    form.value = mergedValues
  } else {
    form.value = ''
  }
}

function switchText(val, type) {
  const valueArr = val.split(',')
  if (type === 'INACTIVE') {
    return valueArr[0]
  } else {
    return valueArr[1]
  }
}

function searchCode(searchTerm) {
  const contentElements = document.querySelectorAll('[data-highlight-target]')
  contentElements.forEach(el => {
    el.style.backgroundColor = '' // Clear existing highlights
  })

  const matchedElements = Array.from(contentElements).filter(el => {
    const content = el.value || el.textContent || ''
    return content.toLowerCase().includes(searchTerm.toLowerCase())
  })

  matchedElements.forEach(el => {
    el.style.backgroundColor = 'yellow'
  })

  const key = matchedElements[0].value || matchedElements[0].textContent || ''
  console.log(key)

  const groups = configs.customGroup
    .filter(group =>
      group.items.some(
        item =>
          item.code.includes(searchTerm) || item.value.includes(searchTerm)
      )
    )
    .filter(group => !uiControl.activeGroups.includes(group.group))

  uiControl.activeGroups = [
    ...new Set([
      ...uiControl.activeGroups,
      ...groups.map(group => group.group),
    ]),
  ]
  console.log(uiControl.activeGroups)

  nextTick(() => {
    matchedElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
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
