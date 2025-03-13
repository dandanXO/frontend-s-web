<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="rules" class="combined-form" label-width="auto">
      <h2>监控设置</h2>
      <el-form-item v-if="false" label="标题">
        <el-input v-model="formData.monitorSetting.title" />
      </el-form-item>
      <el-form-item label="首存浮动通知阀值(%)" prop="monitorSetting.setting.firstDepositChangeAlertThreshold">
        <el-input-number :min="0.1" :step="0.1" v-model="formData.monitorSetting.setting.firstDepositChangeAlertThreshold" />
      </el-form-item>
      <el-form-item label="监控频率(分钟)" prop="monitorSetting.setting.executeIntervalMinutes">
        <el-input-number :min="30" :step="30" v-model="formData.monitorSetting.setting.executeIntervalMinutes" />
      </el-form-item>
      <el-form-item label="监控模式" prop="monitorSetting.setting.scanMode">
        <el-radio-group v-model="formData.monitorSetting.setting.scanMode">
          <el-radio label="TOTAL_TODAY">单日累积</el-radio>
          <el-radio label="LAST_HOURS">时段回推(小时)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="回推时段(小时)" prop="monitorSetting.setting.totalFirstDepositLastHours">
        <el-input-number :min="1" :step="1" v-model="formData.monitorSetting.setting.totalFirstDepositLastHours" :disabled="formData.monitorSetting.setting.scanMode !== 'LAST_HOURS'" />
      </el-form-item>
      <el-form-item v-if="false" label="状态" prop="monitorSetting.status">
        <el-switch
          :value="formData.monitorSetting.status === 1"
          active-text="启用"
          inactive-text="禁用"
          @change="toggleStatus"
        />
      </el-form-item>

      <h2>通知设置</h2>
      <el-form-item label="通知内文" prop="notificationSetting.template">
        <el-input
          type="textarea"
          v-model="formData.notificationSetting.template"
          rows="4"
          placeholder="请输入通知内容"
        />
      </el-form-item>
      <UserTypeCheckbox
        ref="userTypeCheckboxRef"
        :systemUserTypeListToSendNotification="formData.notificationSetting.setting.systemUserTypeListToSendNotification"
      />
      <RoleUserSelector
        ref="roleUserSelectorRef"
        :siteId="store.state.user.siteId"
        :systemRoleIdListToSendNotification="formData.notificationSetting.setting.systemRoleIdListToSendNotification"
        :systemUserIdListToExclude="formData.notificationSetting.setting.systemUserIdListToExclude"
        :telegramUserIdToSendNotification="formData.notificationSetting.setting.telegramUserIdToSendNotification"
        :isRoleAndExcludeEnabled="true"
      />
      <el-form-item label="跳转页面路径" prop="notificationSetting.redirectionPath">
        <el-input v-model="formData.notificationSetting.redirectionPath" />
      </el-form-item>
      <el-form-item label="状态" prop="notificationSetting.status">
        <el-switch
          :value="formData.notificationSetting.status === 1"
          @change="toggleStatus"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
      <el-row justify="center" :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="submitForm" style="width: 100%">送出</el-button>
        </el-col>
        <el-col v-if="props.mode === 'update'" :span="6">
          <TestTriggerButton title="FIRST_DEPOSIT_FLUCTUATION" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useStore } from "@/store";
import { cloneDeep } from 'lodash';
import { createMonitorSetting, updateMonitorSetting, createNotificationSetting, updateNotificationSetting } from "@/api/monitor-notification";
import RoleUserSelector from "@/views/system/monitor-notification/dialog-custom-content/component/roleUserSelector.vue";
import TestTriggerButton from "@/views/system/monitor-notification/dialog-custom-content/component/testTriggerButton.vue";
import UserTypeCheckbox from "@/views/system/monitor-notification/dialog-custom-content/component/userTypeCheckbox.vue";

const roleUserSelectorRef = ref(null);
const userTypeCheckboxRef = ref(null);
const store = useStore();
const emit = defineEmits(['submitting', 'submitSuccess', 'submitFailed']);
const props = defineProps({
  currentItem: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  }
});

// 根据 mode 初始化 formData
const formData = ref(props.mode === 'create' ? initializeFormData() : assignFormData());

function initializeFormData() {
  return {
    monitorSetting: {
      title: 'FIRST_DEPOSIT_FLUCTUATION',
      siteId: store.state.user.siteId,
      setting: {
        firstDepositChangeAlertThreshold: 20.0,
        executeIntervalMinutes: 30,
        totalFirstDepositLastHours: 1,
        scanMode: 'TOTAL_TODAY'
      },
      status: 1,
    },
    notificationSetting: {
      title: 'FIRST_DEPOSIT_FLUCTUATION',
      siteId: store.state.user.siteId,
      setting: {
        systemRoleIdListToSendNotification: [],
        systemUserIdListToExclude: [],
        telegramUserIdToSendNotification: [],
        systemUserTypeListToSendNotification: [],
      },
      status: 1,
      tgSetting: null,
      lineSetting: null,
      smsSetting: null,
      redirectionPath: '',
    }
  };
}

function assignFormData() {
  return {
    monitorSetting: cloneDeep(props.currentItem.monitorSetting),
    notificationSetting: cloneDeep(props.currentItem.notificationSetting),
  }
}

const formRef = ref(null);

const rules = {
  monitorSetting: {
    setting: {
      firstDepositChangeAlertThreshold: [
        { required: true, message: '请填写存款浮动通知阀值(%)', trigger: 'blur' },
        { type: 'number', min: 0.1, message: '最小值为0.1', trigger: 'blur' }
      ],
      executeIntervalMinutes: [
        { required: true, message: '请填写监控频率(分钟)', trigger: 'blur' },
        { type: 'number', min: 30, message: '最小值为30', trigger: 'blur' }
      ],
      scanMode: [
        { required: true, message: '请选取监控模式', trigger: 'blur' },
      ],
      totalFirstDepositLastHours: [
        { required: true, message: '回推时段(小时)', trigger: 'blur' },
        { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' }
      ],
    },
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ]
  },
  notificationSetting: {
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ],
    template: [
      { required: true, message: '请填写通知内文', trigger: 'blur' },
    ],
  }
};

const submitForm = async () => {
  const valid = await formRef.value.validate();

  if (!valid) {
    return;
  }

  emit('submitting'); // 通知父元件
  // 整理资料
  const cloneNotificationToSubmit = cloneDeep(formData.value.notificationSetting);
  cloneNotificationToSubmit.setting.systemRoleIdListToSendNotification = roleUserSelectorRef.value.fetchSystemRoleIdListToSendNotification();
  cloneNotificationToSubmit.setting.systemUserIdListToExclude = roleUserSelectorRef.value.fetchSystemUserIdListToExclude();
  cloneNotificationToSubmit.setting.telegramUserIdToSendNotification = roleUserSelectorRef.value.fetchTelegramUserId();
  cloneNotificationToSubmit.setting.systemUserTypeListToSendNotification = userTypeCheckboxRef.value.fetchSystemUserTypeListToSendNotification();

  const submitMonitorFn = props.mode === 'create' ? createMonitorSetting : updateMonitorSetting;
  const submitNotificationFn = props.mode === 'create' ? createNotificationSetting : updateNotificationSetting;

  try {
    const monitorResponse = await submitMonitorFn(formData.value.monitorSetting);
    if (monitorResponse.code !== 0) {
      throw new Error(`监控设置提交失败, code: ${monitorResponse.code}`);
    }
    const notificationResponse = await submitNotificationFn(cloneNotificationToSubmit);
    if (notificationResponse.code !== 0) {
      throw new Error(`通知设置提交失败, code: ${notificationResponse.code}`);
    }

    emit('submitSuccess'); // 通知父元件
  } catch (error) {
    console.error(error.message)
    emit('submitFailed'); // 通知父元件
  }
};

const toggleStatus = (value) => {
  formData.value.monitorSetting.status = value ? 1 : 0;
  formData.value.notificationSetting.status = value ? 1 : 0;
};

</script>

<style scoped lang="scss">

</style>
