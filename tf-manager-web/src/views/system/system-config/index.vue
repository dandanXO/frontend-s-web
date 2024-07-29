<template>
  <el-form
    :model="form"
    label-width="200px"
    label-position="left"
    class="config_form"
  >
    <el-collapse v-model="uiControl.activeGroups">
      <el-collapse-item v-for="groupConfig in defaultConfigs.customGroup" :title="groupConfig.group" :name="groupConfig.group" :key="groupConfig.group">
        <el-form-item
          v-for="item in groupConfig.items"
          border-color="#dcdcdc"
          border-style="dashed"
          label=""
          size="mini"
          :key="item.orderIndex"
        >
          <el-input class="disable-input" v-model="item.code" />
          -
          <el-input class="disable-input" v-model="item.value" />
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
  updateBatch, updateConfig,
  updateOrderBatch
} from '../../../api/config'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { required } from '../../../utils/validate'

const { t } = useI18n()

const defaultConfigs = reactive({
  value: [],
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
  value: null,
})

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

async function updateConfigs() {
  const sub = defaultConfigs.value.filter(item => item.value === null)
  if (sub.length > 0) {
    ElMessage({ message: t('message.validateNoNullValue'), type: 'error' })
    return
  }
  for (let index = 0; index < defaultConfigs.value.length; index++) {
    if (typeof defaultConfigs.value[index].id !== 'number') {
      delete defaultConfigs.value[index].id
    }
    if (defaultConfigs.value[index].code === 'platform_fee') {
      if (defaultConfigs.value[index].value < 0 || defaultConfigs.value[index].value > 1) {
        ElMessage({
          message: t('message.validatePlatformFeeFormat'),
          type: 'error',
        })
        return
      }
    }
    if (defaultConfigs.value[index].code === 'payment_fee') {
      if (defaultConfigs.value[index].value < 0 || defaultConfigs.value[index].value > 1) {
        ElMessage({
          message: t('message.validatePaymentFeeFormat'),
          type: 'error',
        })
        return
      }
    }
    if (defaultConfigs.value[index].code === 'cs_address') {
      try {
        JSON.parse(defaultConfigs.value[index].value)
      } catch (e) {
        ElMessage({
          message: t('message.validateCustomerSupportAddressFormat'),
          type: 'error',
        })
        return
      }
    }
  }
  await updateBatch(defaultConfigs.value)
  const orderUpdate = []
  for (let index = 0; index < defaultConfigs.customGroup.length; index++) {
    for (let i = 0; i < defaultConfigs.customGroup[index].items.length; i++) {
      orderUpdate.push({
        id: defaultConfigs.customGroup[index].items[i].id,
        orderIndex: i,
      })
    }
  }
  await updateOrderBatch(orderUpdate)
  await loadDefaultConfigs()
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
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
