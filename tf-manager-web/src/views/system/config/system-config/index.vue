<template>
  <el-form
    :model="form"
    label-width="200px"
    label-position="left"
    class="config_form"
  >
    <div style="margin-bottom: 20px">
      <el-button
        size="mini"
        type="success"
        icon="el-icon-circle-plus"
        @click="showDialog('CREATE')"
      >
        {{ t('fields.createConfig') }}
      </el-button>
      <el-input
        :hidden="true"
        v-model="searchTerm"
        :placeholder="`${t('fields.defaultConfigSearchBarHint')}${t('fields.configGroup')}`"
        :size="'mini'"
        style="margin-right: 20px;"
      />
    </div>
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
          <el-input data-highlight-target class="disable-input" v-model="item.code" />
          -
          <el-input data-highlight-target class="disable-input" v-model="item.value" />
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            style="margin-left: 20px"
            @click="showEdit(item)"
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
          >
            {{ t('fields.delete') }}
          </el-button>
          <el-button
            :hidden="true"
            circle
            icon="el-icon-arrow-up"
            size="mini"
            type="primary"
            style="margin-left: 20px"
            plain
            @click="moveUp(item, groupConfig)"
            :disabled="!canClickMoveUpButton(item, groupConfig)"
          />
          <el-button
            :hidden="true"
            circle
            icon="el-icon-arrow-down"
            size="mini"
            type="primary"
            style="margin-left: 20px"
            plain
            @click="moveDown(item, groupConfig)"
            :disabled="!canClickMoveDownButton(item, groupConfig)"
          />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </el-form>
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
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
        <el-input
          v-model="form.configGroup"
          :placeholder="t('fields.configGroup')"
        />
      </el-form-item>
      <el-form-item :label="t('fields.configCode')" prop="code">
        <el-input v-model="form.code" :placeholder="t('fields.configCode')" />
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
      <el-form-item :label="t('fields.configDescribes')" prop="describes">
        <el-input v-model="form.describes" :placeholder="t('fields.configDescribes')" type="textarea" :rows="5" />
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button @click="uiControl.dialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="submit()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  createConfig,
  deleteById,
  getDefaultConfigs,
  updateConfig,
} from '../../../../api/config'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { required } from '../../../../utils/validate'
import { getValueRulesList } from '../../../../api/value-rules'
import { Plus } from "@element-plus/icons-vue";
import bus from "@/utils/bus";

const { t } = useI18n()

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

const form = reactive({
  id: null,
  siteId: '',
  configGroup: null,
  code: null,
  rulesId: null,
  value: null,
  describes: "",
})

const searchTerm = ref('');
/* 值类型规则 */
const valueRules = ref([]);
const selectedRule = ref(null)
/* 多选框 */
const checkedSelection = ref([])
const checkBoxSelections = reactive([])
const checkAll = ref(false)
const isIndeterminate = ref(true)

// const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
//   if (columnIndex === 0) {
//     const prevRow = filteredData.value[rowIndex - 1];
//     const nextRow = filteredData.value[rowIndex + 1];

//     if (prevRow && row.configGroup === prevRow.configGroup) {
//       return [0, 0];
//     }
//     if (nextRow && row.configGroup === nextRow.configGroup) {
//       return [1, 1];
//     }
//   }
// };

const formRules = reactive({
  configGroup: [required(t('message.validateConfigGroupRequired'))],
  code: [required(t('message.validateConfigCodeRequired'))],
  value: [required(t('message.validateConfigValueRequired'))],
  rulesId: [required(t('message.validateConfigTypeRequired'))],
})

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
          loadDefaultConfigs()
        })
      }
      break
    }
  }
}

async function loadDefaultConfigs() {
  const { data: ret } = await getDefaultConfigs({})
  configs.value = ret
  configs.customList = configs.value

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
}

function showEdit(customConfig) {
  showDialog('EDIT')
  selectedRule.value = valueRules.value[0];
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
        }
        );
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

function showDialog(type) {
  // 清除多选项数据值
  checkBoxSelections.splice(0, checkBoxSelections.length);
  checkedSelection.value = []
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
  }
  uiControl.dialogVisible = true
}

async function submit() {
  configForm.value.validate(async valid => {
    if (valid) {
      form.configGroup = form.configGroup.trim();
      form.code = form.code.trim();
      form.value = form.value + "".trim();
      if (uiControl.dialogTitle === t('fields.createConfig')) {
        form.siteId = 0; // siteId=0为默认资料
        await createConfig(form)
        ElMessage({ message: t('message.addSuccess'), type: 'success' })
      } else if (uiControl.dialogTitle === t('fields.editConfig')) {
        await updateConfig(form)
        ElMessage({ message: t('message.updateSuccess'), type: 'success' })
      }
      await loadDefaultConfigs()
      uiControl.dialogVisible = false
    }
  })
}

async function addGroupConfig(group) {
  form.configGroup = group
  showDialog('CREATE')
}

/* 加载值类型规则列表 */
async function loadValueRules() {
  const { data: rules } = await getValueRulesList()
  valueRules.value = rules
  selectedRule.value = valueRules.value[0];
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

onMounted(async () => {
  await loadDefaultConfigs()
  await loadValueRules()
  bus.on('search', searchCode)
  bus.on('add', () => showDialog('CREATE'))
})

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.config_form {
  padding: 10px;

  :deep( .withdrawal_failure_type) {
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

  :deep(label){
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
</style>
