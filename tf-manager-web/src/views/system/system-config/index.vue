<template>
  <el-form
    :model="form"
    label-width="200px"
    label-position="left"
    class="config_form"
  >
    <div style="margin-bottom: 20px">
      <el-input
        v-model="searchTerm"
        :placeholder="`${t('fields.defaultConfigSearchBarHint')}${t('fields.configGroup')}`"
        :size="'mini'"
        style="margin-right: 20px;"
      />
      <el-button
        size="mini"
        type="success"
        icon="el-icon-circle-plus"
        @click="showDialog('CREATE')"
      >
        {{ t('fields.createConfig') }}
      </el-button>
    </div>
    <el-table :data="filteredData" style="width: 100%">
      <el-table-column prop="configGroup" :label="t('fields.configGroup')" />
      <el-table-column prop="code" :label="t('fields.configCode')" />
      <el-table-column prop="value" :label="t('fields.configValue')" />
      <el-table-column prop="describes" :label="t('fields.configDescribes')" width="200" />
      <el-table-column>
        <template #default="{row}">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showEdit(row)"
            plain
          >
            {{ t('fields.edit') }}
          </el-button>
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            @click="delConfig(row.id)"
            plain
          >
            {{ t('fields.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
      <el-form-item :label="t('fields.configValue')" prop="value">
        <el-input v-model="form.value" :placeholder="t('fields.configValue')" />
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
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import {
  createConfig,
  deleteById,
  getDefaultConfigs,
  updateConfig,
} from '../../../api/config'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { required } from '../../../utils/validate'

const { t } = useI18n()

const defaultConfigs = reactive({
  value: [],
  customGroup: [],
  mergeItems: [],
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
  value: null,
  describes: "",
})

const searchTerm = ref('');

const filteredData = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return defaultConfigs.mergeItems.filter(item =>
    item.configGroup.toLowerCase().includes(term)
  );
});

const formRules = reactive({
  configGroup: [required(t('message.validateConfigGroupRequired'))],
  code: [required(t('message.validateConfigCodeRequired'))],
  value: [required(t('message.validateConfigValueRequired'))],
})

async function delConfig(id) {
  for (let index = 0; index < defaultConfigs.value.length; index++) {
    if (defaultConfigs.value[index].id === id) {
      defaultConfigs.value.splice(index, 1)
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
  defaultConfigs.value = ret
  defaultConfigs.value = defaultConfigs.value.sort((a, b) => {
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
  defaultConfigs.customGroup = []
  let group = null
  let items = []
  for (let index = 0; index < defaultConfigs.value.length; index++) {
    if (group !== defaultConfigs.value[index].configGroup) {
      if (group !== null) {
        defaultConfigs.customGroup.push({ group, items })
      }
      group = defaultConfigs.value[index].configGroup
      items = []
    }
    items.push(defaultConfigs.value[index])
    // handle last group
    if (index === defaultConfigs.value.length - 1) {
      defaultConfigs.customGroup.push({ group, items })
    }
  }

  // sort configs.customGroup.items by order index
  for (let index = 0; index < defaultConfigs.customGroup.length; index++) {
    defaultConfigs.customGroup[index].items = defaultConfigs.customGroup[index].items.sort(
      (a, b) => a.orderIndex - b.orderIndex
    )
    // set item.orderIndex = item index
    for (let i = 0; i < defaultConfigs.customGroup[index].items.length; i++) {
      defaultConfigs.customGroup[index].items[i].orderIndex = i
    }
  }
  defaultConfigs.mergeItems = defaultConfigs.customGroup.flatMap(group => group.items);
}

function showEdit(customConfig) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in customConfig) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = customConfig[key]
      }
    }
  })
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (configForm.value) {
      form.id = null
      configForm.value.resetFields()
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

onMounted(async () => {
  await loadDefaultConfigs()
})

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.config_form {
  padding: 10px;

  ::v-deep .withdrawal_failure_type {
    display: grid;
    grid-template-columns: repeat(2, 500px);
    grid-row-gap: 5px;
    grid-column-gap: 40px;
  }

  ::v-deep .adjust_type {
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

  ::v-deep label {
    font-weight: 900;
  }

  ::v-deep .el-input {
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
