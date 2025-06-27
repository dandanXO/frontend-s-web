<template>
  <div :class="{'submitting-overlay': isSubmitting}">
    <el-row style="margin: 0 0 40px 10px">
      <el-col>
        <el-dropdown trigger="click" @visible-change="handleDropdownVisibilityChange">
          <span class="el-dropdown-link">
            <el-button>
              开通配置
            </el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-if="currentConfigurableTypeArr.length === 0">
                <el-dropdown-item disabled>无可开通配置</el-dropdown-item>
              </template>
              <template v-else>
                <el-dropdown-item
                  v-for="item in currentConfigurableTypeArr"
                  :key="item"
                  @click="openDialog(item, 'create')"
                >
                  {{ $t(`monitorTitle.${item}`) }}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col
        :span="8"
        v-for="(settings, title) in titleMatchSettings"
        :key="title"
        style="margin-bottom: 20px"
      >
        <el-card shadow="hover">
          <div class="card-content">
            <el-row justify="space-around" class="card-header">
              <el-col :span="12" class="card-title">
                {{ $t(`monitorTitle.${title}`) }}
              </el-col>
              <el-col :span="12">
                <el-row justify="end">
                  <el-switch
                    v-model="statusSwitchByTitle[title]"
                    @change="(newValue) => toggleSettingStatus(newValue, title)"
                  />
                </el-row>
              </el-col>
            </el-row>
            <el-button @click="openDialog(title, 'update')" class="card-button">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div id="setting-dialog-wrapper">
      <el-dialog v-model="dialogVisible" :title="currentDialogTitle" width="60%">
        <div class="dialog-content-wrapper">
          <component
            :is="currentComponent"
            :key="componentKey"
            :currentItem="currentItem"
            :mode="currentMode"
            @submitting="handleSubmitting"
            @submitSuccess="handleSubmitSuccess"
            @submitFailed="handleSubmitFailed"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, shallowRef } from 'vue';
import { getAllConfigurable, getAllSettingBySiteId, updateNotificationSettingAndMonitorSetting } from "@/api/monitor-notification";
import { cloneDeep } from 'lodash';
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import MemberStatisticComponent from './dialog-custom-content/memberStatistic.vue';
import DepositFluctuationComponent from './dialog-custom-content/depositFluctuation.vue';
import WithdrawFluctuationComponent from './dialog-custom-content/withdrawFluctuation.vue';
import BonusFluctuationComponent from './dialog-custom-content/bonusFluctuation.vue';
import MQTopicLastConsumeTimeCheckComponent from './dialog-custom-content/mqTopicLastConsumeTimeCheck.vue';
import DomainValidComponent from './dialog-custom-content/domainValid.vue';
import WithdrawErrorComponent from './dialog-custom-content/withdrawError.vue';
import GameBetRecordFetchJobIdleCheck from './dialog-custom-content/gameBetRecordFetchJobIdleCheck.vue';
import DepositErrorComponent from './dialog-custom-content/depositError.vue';
import OtpFailComponent from './dialog-custom-content/otpFail.vue';
import FirstDepositFluctuation from './dialog-custom-content/firstDepositFluctuation.vue';
import WithdrawAlertComponent from './dialog-custom-content/withdrawAlert.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const store = useStore();
const allConfigurableTypeName = ref([]);
const currentComponent = shallowRef(null);
const currentDialogTitle = ref("");
const componentKey = ref(0); // 新增的 key，用于强制重新渲染组件

const allSettingOrganized = ref({
  other: { // monitorSetting和NotificationSetting没有成对的title，那些数据就放在这里面
    monitorSettings: [],
    notificationSettings: []
  }
});

const titleMatchSettings = computed(() => {
  const settings = {};
  for (const key in allSettingOrganized.value) {
    if (key !== 'other') { // 先撇除monitorSetting和notification可能不匹配的问题，先都做1对1的配置
      settings[key] = allSettingOrganized.value[key];
    }
  }
  return settings;
});

const dialogVisible = ref(false);
const isSubmitting = ref(false);

// 当前dialog展开的监控/通知配置
const currentItem = ref({
  monitorSetting: null,
  notificationSetting: null,
});

// 当前dialog展开的模式
const currentMode = ref('')

const handleSubmitting = () => {
  isSubmitting.value = true;
}

const handleSubmitSuccess = async () => {
  await loadAllConfigurableTypeName()
  await loadAllSetting()
  dialogVisible.value = false;
  isSubmitting.value = false;
  ElMessage.success('设置提交成功');
}

const handleSubmitFailed = () => {
  isSubmitting.value = false;
  ElMessage.error('设置提交失败');
}

const openDialog = (title, mode) => {
  currentDialogTitle.value = t(`monitorTitle.${title}`)

  if (mode === 'create') {
    if (title === 'other') {
      // other走其他逻辑，之后功能扩充再说，目前监控与通知配置都是一对的
      return;
    }
    currentItem.value.monitorSetting = null;
    currentItem.value.notificationSetting = null;
    currentMode.value = mode
    currentComponent.value = componentMapping[title] ? componentMapping[title] : ''
    dialogVisible.value = true;
  } else if (mode === 'update') {
    if (title === 'other') {
      // other走其他逻辑，之后功能扩充再说，目前监控与通知配置都是一对的
      return;
    }
    const current = allSettingOrganized.value[title];
    if (current) {
      currentItem.value.monitorSetting = current.monitorSetting;
      currentItem.value.notificationSetting = current.notificationSetting;
      currentMode.value = mode
      // 更改 key 值，强制重新渲染
      componentKey.value++; // 使 key 每次变化
      currentComponent.value = componentMapping[title] ? componentMapping[title] : ''
      dialogVisible.value = true;
    }
  }
};

const componentMapping = {
  MEMBER_STATISTICS: MemberStatisticComponent,
  DEPOSIT_FLUCTUATION: DepositFluctuationComponent,
  WITHDRAW_FLUCTUATION: WithdrawFluctuationComponent,
  BONUS_FLUCTUATION: BonusFluctuationComponent,
  MQ_LAST_CONSUME_TIME_CHECK: MQTopicLastConsumeTimeCheckComponent,
  DOMAIN_VALID: DomainValidComponent,
  WITHDRAW_ERROR: WithdrawErrorComponent,
  DEPOSIT_ERROR: DepositErrorComponent,
  JOB_IDLE_CHECK_GAME_BET_RECORD_FETCH_TASK: GameBetRecordFetchJobIdleCheck,
  OTP_FAIL: OtpFailComponent,
  FIRST_DEPOSIT_FLUCTUATION: FirstDepositFluctuation,
  WITHDRAW_ALERT: WithdrawAlertComponent,
};

async function loadAllConfigurableTypeName() {
  const res = await getAllConfigurable();
  if (res.code !== 0) {
    ElMessage({
      message: 'Failed to load all configurable typeName.',
      type: 'error',
    })
    return;
  }
  allConfigurableTypeName.value = res.data;
}

async function loadAllSetting() {
  const res = await getAllSettingBySiteId(store.state.user.siteId);
  if (res.code !== 0) {
    ElMessage({
      message: 'Failed to load all setting.',
      type: 'error',
    })
    return;
  }
  const resData = res.data;

  // 数据依照title进行分组，title一样的monitorSetting和notificationSetting分在同一组。
  const titleToMonitorSetting = new Map();
  resData.monitorSettings.forEach(monitorSetting => {
    titleToMonitorSetting.set(monitorSetting.title, monitorSetting);
  });
  resData.notificationSettings.forEach(notificationSetting => {
    const matchMonitorSetting = titleToMonitorSetting.get(notificationSetting.title);

    if (matchMonitorSetting) {
      // 如果在 monitorSettings 中找到了title匹配项，代表这个title有匹配的monitorSetting和notificationSetting，则分在同一组
      allSettingOrganized.value[notificationSetting.title] = {
        monitorSetting: matchMonitorSetting,
        notificationSetting: notificationSetting
      };

      titleToMonitorSetting.delete(notificationSetting.title);
    } else {
      // title没有匹配到monitorSetting的notificationSetting，添加到 other 中
      allSettingOrganized.value.other.notificationSettings.push(notificationSetting);
    }
  });

  // title没有匹配到notificationSetting的monitorSettings，添加到 other 中
  titleToMonitorSetting.forEach(monitor => {
    allSettingOrganized.value.other.monitorSettings.push(monitor);
  });

  loadStatusSwitchByOrganizedSettings();
}

const currentConfigurableTypeArr = ref([]);
const listConfigurableTypes = () => {
  // 被配置完的不要列出来
  currentConfigurableTypeArr.value = allConfigurableTypeName.value.filter(configurableTypeName => !(configurableTypeName in allSettingOrganized.value))
}

const handleDropdownVisibilityChange = (visible) => {
  if (visible) {
    listConfigurableTypes();
  }
}

const statusSwitchByTitle = ref({});

const toggleSettingStatus = async (newValue, title) => {
  const newStatus = newValue ? 1 : 0;
  statusSwitchByTitle.value[title] = newValue;

  const cloneMonitorSettingByTitle = cloneDeep(titleMatchSettings.value[title].monitorSetting);
  const cloneNotificationSettingByTitle = cloneDeep(titleMatchSettings.value[title].notificationSetting);

  cloneMonitorSettingByTitle.status = newStatus;
  cloneNotificationSettingByTitle.status = newStatus;

  try {
    const res = await updateNotificationSettingAndMonitorSetting(cloneNotificationSettingByTitle, cloneMonitorSettingByTitle);
    if (res.code === 0) {
      allSettingOrganized.value[title].monitorSetting = cloneMonitorSettingByTitle;
      allSettingOrganized.value[title].notificationSetting = cloneNotificationSettingByTitle;

      ElMessage({
        message: `切换成功-${t(`monitorTitle.${title}`)}`,
        type: 'success',
      })
    } else {
      statusSwitchByTitle.value[title] = !newValue;
      ElMessage({
        message: `切换失败-${t(`monitorTitle.${title}`)}`,
        type: 'error',
      })
    }
  } catch (error) {
    statusSwitchByTitle.value[title] = !newValue;
    ElMessage({
      message: `切换失败-${t(`monitorTitle.${title}`)}`,
      type: 'error',
    })
  }
};

const loadStatusSwitchByOrganizedSettings = () => {
  const statusSwitch = {};

  for (const key in allSettingOrganized.value) {
    if (key !== 'other') {
      statusSwitch[key] = allSettingOrganized.value[key].monitorSetting.status === 1 && allSettingOrganized.value[key].notificationSetting.status === 1;
    }
  }

  statusSwitchByTitle.value = statusSwitch;
}

onMounted(async () => {
  await loadAllConfigurableTypeName()
  await loadAllSetting()
})

</script>

<style scoped>
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  margin: 10px 0 20px 0;
}
.card-title {
  font-size: 20px;
  font-weight: bold;
}

.card-button {
  align-self: flex-end;
}

.dialog-content-wrapper {
  font-size: 16px;
  margin: 0 20px;
}

.submitting-overlay {
  position: relative;
  pointer-events: none;
  opacity: 0.7;
}
</style>
