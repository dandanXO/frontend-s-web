<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="rules" class="combined-form" label-width="auto">
      <!--      <h2>监控设置</h2>-->
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
          <TestTriggerButton title="WITHDRAW_ERROR" />
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
      title: 'WITHDRAW_ALERT',
      siteId: store.state.user.siteId,
      setting: {},
      status: 1,
    },
    notificationSetting: {
      title: 'WITHDRAW_ALERT',
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
    setting: {},
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

onMounted(() => {
})

</script>

<style scoped lang="scss">

</style>
