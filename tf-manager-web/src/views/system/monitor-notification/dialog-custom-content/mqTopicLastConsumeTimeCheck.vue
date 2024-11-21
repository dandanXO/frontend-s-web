<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="rules" class="combined-form" label-width="auto">
      <h2>监控设置</h2>
      <el-form-item v-if="false" label="标题">
        <el-input v-model="formData.monitorSetting.title" />
      </el-form-item>
      <el-form-item label="允许主题闲置时间(分钟)" prop="monitorSetting.setting.consumptionGapMinutesThreshold">
        <el-input-number :min="1" :step="1" v-model="formData.monitorSetting.setting.consumptionGapMinutesThreshold" />
      </el-form-item>
      <el-form-item label="排除监控主题列表">
        <el-input
          type="textarea"
          v-model="excludeTopicNamesStr"
          rows="4"
          placeholder="请输入欲排除监控的主题名称，用','分隔"
        />
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
        :isRoleAndExcludeEnabled="false"
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
          <TestTriggerButton title="MQ_LAST_CONSUME_TIME_CHECK" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { useStore } from "@/store";
import { cloneDeep } from 'lodash';
import { createMonitorSetting, updateMonitorSetting, createNotificationSetting, updateNotificationSetting } from "@/api/monitor-notification";
import TestTriggerButton from "@/views/system/monitor-notification/dialog-custom-content/component/testTriggerButton.vue";
import UserTypeCheckbox from "@/views/system/monitor-notification/dialog-custom-content/component/userTypeCheckbox.vue";
import RoleUserSelector from "@/views/system/monitor-notification/dialog-custom-content/component/roleUserSelector.vue";

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
      title: 'MQ_LAST_CONSUME_TIME_CHECK',
      siteId: store.state.user.siteId,
      setting: {
        consumptionGapMinutesThreshold: 3,
        excludeTopicNames: [""],
      },
      status: 1,
    },
    notificationSetting: {
      title: 'MQ_LAST_CONSUME_TIME_CHECK',
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
const excludeTopicNamesStr = ref('');

onMounted(() => {
  if (formData.value.monitorSetting.setting.excludeTopicNames) {
    excludeTopicNamesStr.value = formData.value.monitorSetting.setting.excludeTopicNames.join(',');
  }
});

const rules = {
  monitorSetting: {
    setting: {
      consumptionGapMinutesThreshold: [
        { required: true, message: '请填写最后消费时间差距(分钟)', trigger: 'blur' },
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

  const cloneMonitorToSubmit = cloneDeep(formData.value.monitorSetting);
  cloneMonitorToSubmit.setting.excludeTopicNames = excludeTopicNamesStr.value.split(',').map(item => item.trim());

  const submitMonitorFn = props.mode === 'create' ? createMonitorSetting : updateMonitorSetting;
  const submitNotificationFn = props.mode === 'create' ? createNotificationSetting : updateNotificationSetting;

  try {
    const monitorResponse = await submitMonitorFn(cloneMonitorToSubmit);
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
