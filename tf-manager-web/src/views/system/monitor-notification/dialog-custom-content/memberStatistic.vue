<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="150px" class="combined-form">
      <h2>监控设置</h2>
      <el-form-item v-if="false" label="标题">
        <el-input v-model="formData.monitorSetting.title" />
      </el-form-item>
      <el-form-item label="通知生成人数阈值" prop="monitorSetting.setting.notificationGenerationUserNumberThreshold">
        <el-input-number :min="0" v-model="formData.monitorSetting.setting.notificationGenerationUserNumberThreshold" />
      </el-form-item>
      <el-form-item label="状态" prop="monitorSetting.status">
        <el-switch
          :value="formData.monitorSetting.status === 1"
          active-text="启用"
          inactive-text="禁用"
          @change="toggleStatus"
        />
      </el-form-item>

      <h2>通知设置</h2>
      <el-form-item label="通知内文" prop="notificationSetting.content">
        <el-input
          type="textarea"
          v-model="formData.notificationSetting.content"
          rows="4"
          placeholder="请输入通知内容"
        />
      </el-form-item>
      <el-form-item label="发送频率(分钟)" prop="notificationSetting.setting.backgroundNoticeIntervalMinutes">
        <el-input-number :min="0" v-model="formData.notificationSetting.setting.backgroundNoticeIntervalMinutes" />
      </el-form-item>
      <el-form-item label="指定角色">
        <el-select
          v-model="selectedRoleNameArr"
          size="small"
          class="filter-item"
          style="width: 350px"
          multiple
          filterable
          @visible-change="handleRoleSelectorVisibleChange"
          @remove-tag="handleRoleRemoved"
        >
          <el-option
            v-for="item in simpleRoleArrBySite"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排除用户">
        <el-select
          v-model="excludedUserNameArr"
          size="small"
          class="filter-item"
          style="width: 350px"
          multiple
          filterable
        >
          <el-option
            v-for="item in simpleUserArrBySelectedRoles"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
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
      <el-row justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="submitForm" style="width: 100%">送出</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { ElMessage } from "element-plus";
import { getSimpleRoles, getSimpleUsersByRoles } from "@/api/roles";
import { useStore } from "@/store";
import { cloneDeep } from 'lodash';
import { createMonitorSetting, updateMonitorSetting, createNotificationSetting, updateNotificationSetting } from "@/api/monitor-notification";

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
      title: 'MEMBER_STATISTICS',
      siteId: store.state.user.siteId,
      setting: { notificationGenerationUserNumberThreshold: 100 },
      status: 1,
    },
    notificationSetting: {
      title: 'MEMBER_STATISTICS',
      siteId: store.state.user.siteId,
      content: '',
      setting: {
        systemRoleIdListToSendNotification: [],
        systemUserIdListToExclude: [],
        backgroundNoticeIntervalMinutes: 30,
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

const simpleRoleArrBySite = ref([]);
const simpleUserArrBySelectedRoles = ref([]);

const selectedRoleNameArr = ref([]);
const excludedUserNameArr = ref([]);

const rules = {
  monitorSetting: {
    setting: {
      notificationGenerationUserNumberThreshold: [
        { required: true, message: '请填写通知生成人数阈值', trigger: 'blur' },
        { type: 'number', min: 20, message: '最小值为20', trigger: 'blur' }
      ]
    },
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ]
  },
  notificationSetting: {
    content: [
      { required: true, message: '请填写通知内容', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ],
    setting: {
      backgroundNoticeIntervalMinutes: [
        { required: true, message: '请填写发送频率(分钟)', trigger: 'blur' },
        { type: 'number', min: 30, message: '最小值为30', trigger: 'blur' }
      ]
    }
  }
};

const submitForm = async () => {
  emit('submitting'); // 通知父元件

  await formRef.value.validate();
  formData.value.notificationSetting.setting.systemRoleIdListToSendNotification = getRoleIdsByNames(selectedRoleNameArr.value, simpleRoleArrBySite.value)
  formData.value.notificationSetting.setting.systemUserIdListToExclude = getUserIdsByNames(excludedUserNameArr.value, simpleUserArrBySelectedRoles.value)

  const submitMonitor = props.mode === 'create' ? createMonitorSetting : updateMonitorSetting;
  const submitNotification = props.mode === 'create' ? createNotificationSetting : updateNotificationSetting;

  try {
    const monitorResponse = await submitMonitor(formData.value.monitorSetting);
    if (monitorResponse.code !== 0) {
      throw new Error('监控设置提交失败');
    }
    const notificationResponse = await submitNotification(formData.value.notificationSetting);
    if (notificationResponse.code !== 0) {
      throw new Error('通知设置提交失败');
    }

    ElMessage.success('设置已成功提交!');
    emit('submitSuccess'); // 通知父元件
  } catch (error) {
    ElMessage.error(error.message);
  } finally {
    emit('submitFailed'); // 通知父元件
  }
};

const handleRoleSelectorVisibleChange = (isVisible) => {
  if (!isVisible) {
    loadExcludedUserBySelectedRoles()
  }
};

const handleRoleRemoved = () => {
  loadExcludedUserBySelectedRoles()
}

const toggleStatus = (value) => {
  formData.value.monitorSetting.status = value ? 1 : 0;
  formData.value.notificationSetting.status = value ? 1 : 0;
};

onMounted(async () => {
  await loadSimpleRoleBySite();

  selectedRoleNameArr.value = getRoleNamesByIds(formData.value.notificationSetting.setting.systemRoleIdListToSendNotification, simpleRoleArrBySite.value)
  await loadExcludedUserBySelectedRoles()
});

async function loadSimpleRoleBySite() {
  const res = await getSimpleRoles(store.state.user.siteId);
  if (res.code !== 0) {
    ElMessage({
      message: 'Failed to get simple roles.',
      type: 'error',
    })
    return;
  }
  simpleRoleArrBySite.value = res.data;
}

async function loadExcludedUserBySelectedRoles() {
  if (selectedRoleNameArr.value.length === 0) {
    simpleUserArrBySelectedRoles.value = [];
    excludedUserNameArr.value = [];
    return;
  }
  const res = await getSimpleUsersByRoles(getRoleIdsByNames(selectedRoleNameArr.value, simpleRoleArrBySite.value));
  if (res.code !== 0) {
    ElMessage({
      message: 'Failed to get simple user by roles.',
      type: 'error',
    })
    return;
  }

  simpleUserArrBySelectedRoles.value = res.data;
  excludedUserNameArr.value = getUserNamesByIds(formData.value.notificationSetting.setting.systemUserIdListToExclude, simpleUserArrBySelectedRoles.value)
}

const getRoleIdsByNames = (roleNames, simpleRoleList) => {
  return simpleRoleList
    .filter(role => roleNames.includes(role.name))
    .map(role => role.id);
};

function getRoleNamesByIds(roleIds, simpleRoleList) {
  return roleIds.map(id => {
    const role = simpleRoleList.find(role => role.id === id);
    return role ? role.name : undefined;
  }).filter(name => name !== undefined);
}

const getUserNamesByIds = (userIds, simpleUsers) => {
  return simpleUsers
    .filter(simpleUser => userIds.includes(simpleUser.id))
    .map(simpleUser => simpleUser.name);
};

const getUserIdsByNames = (userNames, simpleUsers) => {
  return simpleUsers
    .filter(simpleUser => userNames.includes(simpleUser.name))
    .map(simpleUser => simpleUser.id);
};
</script>

<style scoped lang="scss">

</style>
