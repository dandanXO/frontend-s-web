<template>
  <el-form
    :model="form"
    label-width="200px"
    label-position="left"
    class="config_form"
  >
    <div style="margin-bottom: 20px">
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
        v-for="(config, index) in configs"
        :title="config.platformName"
        :name="config.platformName"
        :key="index"
      >
        <template #title>
          <span>{{ config.platformName }}</span>
          <span
            style="margin-left: 10px"
          >
            <el-icon color="#409efc">
              <Plus />
            </el-icon>
          </span>
        </template>
        <div
          v-for="(item, itemIndex) in config.setting"
          border-color="#dcdcdc"
          border-style="dashed"
          label=""
          size="mini"
          :key="itemIndex"
          class="setting-item"
        >
          <div class="setting-header">
            <span class="setting-key">{{ item.key }}</span>
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              style="margin-left: 20px"
              @click="showEdit(item, config)"
              plain
            >
              {{ t('fields.edit') }}
            </el-button>
          </div>
          <div class="setting-content">
            <div v-for="(dataItem, dataIndex) in item.data" :key="dataIndex" class="setting-data-item">
              <span class="data-key">{{ t(`fields.${dataItem.key}`) }}：</span>
              <el-input
                class="data-value"
                type="text"
                v-model="dataItem.value"
                :disabled="true"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-form>
  <el-dialog
    :title="`${configDialog[0]?.settingKey || ''} ${uiControl.dialogTitle}`"
    v-model="uiControl.dialogVisible"
    append-to-body
  >
    <el-form
      ref="configForm"
      :model="form"
      :rules="formRules"
      label-position="left"
      @submit.prevent
      class="dialog-content"
    >
      <el-table
        :data="configDialog"
        style="width: 100%;"
      >
        <el-table-column prop="key" label="Setting Name">
          <template #default="scope">
            <span
              :placeholder="t(`fields.${scope.row.key}`) || scope.row.key"
              :disabled="true"
            >
              {{ t(`fields.${scope.row.key}`) || scope.row.key }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="Value">
          <template #default="scope">
            <el-input
              v-model="scope.row.value"
              :placeholder="scope.row.value"
            />
          </template>
        </el-table-column>
      </el-table>
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
import { getSportAppSetting, updateSportAppSetting } from '@/api/sport-app-setting'
import { useI18n } from 'vue-i18n'
import { required } from '../../../utils/validate'
import { Plus } from "@element-plus/icons-vue";
import bus from "@/utils/bus";

const { t } = useI18n()
const originalConfigs = ref([]);
const configs = ref([])
const uiControl = reactive({
  dialogTitle: '',
  dialogVisible: false,
  activeGroups: [],
})

const configDialog = ref([])
const configForm = ref(null)

const form = reactive({
  id: null,
  platformId: null,
  setting: null,
})

const searchTerm = ref('');

const formRules = reactive({
  configGroup: [required(t('message.validateConfigGroupRequired'))],
})

const platformEnum = (platformId) => {
  const platforms = {
    1: 'IM',
  };
  return platforms[platformId] || 'Unknown';
};

async function loadDefaultConfigs() {
  const { data: ret } = await getSportAppSetting();
  originalConfigs.value = ret;
  configs.value = ret.map(item => ({
    id: item.id,
    platformId: item.platformId,
    platformName: platformEnum(item.platformId),
    setting: item.setting
  })).sort((a, b) => a.platformId - b.platformId).map(item => {
    return {
      ...item,
      setting: Object.entries(item.setting).map(([key, value]) => ({
        key,
        data: Object.entries(value).map(([key, value]) => ({
          key,
          value
        }))
      }))
    }
  });
}

function showEdit(item, config) {
  showDialog('EDIT');

  // 將 item.data 轉換成陣列物件
  const transformedData = item.data.map(dataItem => ({
    platform: config.platformName,
    platformId: config.platformId,
    settingKey: item.key,
    key: dataItem.key,
    value: dataItem.value
  }));

  // 將轉換後的資料儲存到 configDialog
  configDialog.value = transformedData;

  showDialog('EDIT', configDialog);

  nextTick(() => {
    // 這裡可以執行其他需要的操作
  });
}

function showDialog(type) {
  if (type === 'CREATE') {
    // 清空 configDialog 並初始化 form
    configDialog.value = [{ key: '', data: [] }];
    form.data = []; // 初始化 form 的 data

    uiControl.dialogTitle = t('fields.createConfig');
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editConfig');
  }
  uiControl.dialogVisible = true;
}

async function fetchAndFilterSettings(platformId) {
  try {
    // 獲取所有平台的設定
    const allSettings = originalConfigs.value;

    // 檢查 allSettings 是否為陣列
    if (!Array.isArray(allSettings)) {
      throw new TypeError('Expected an array but got ' + typeof allSettings);
    }

    // 過濾並提取 setting
    const uniqueSettings = allSettings
      .filter(setting => setting.platformId === platformId)
      .map(item => item.setting);

    return uniqueSettings[0];
  } catch (error) {
    console.error('Error fetching settings:', error);
    return [];
  }
}

async function submit() {
  // 整理 configs 資料, 只取當下選擇的 platformId 的 setting
  const platformId = configDialog.value[0]?.platformId;

  // 獲取當下選擇的 platformId 的設定
  const filteredSettings = await fetchAndFilterSettings(platformId);

  const settingJson = {};
  // 遍歷 filteredSettings 中的所有屬性
  Object.entries(filteredSettings).forEach(([sectionKey, sectionValue]) => {
    settingJson[sectionKey] = {};
    // 確保 sectionValue 是一個物件
    if (typeof sectionValue === 'object' && sectionValue !== null) {
      Object.entries(sectionValue).forEach(([key, value]) => {
        const config = configDialog.value.find(item => item.key === key);
        if (config) {
          settingJson[sectionKey][key] = config.value;
        } else {
          settingJson[sectionKey][key] = value;
        }
      });
    }
  });

  configForm.value.validate(async valid => {
    if (valid) {
      const formData = {
        id: platformId,
        platformId: platformId,
        setting: settingJson,
      }
      await updateSportAppSetting(formData)
      await loadDefaultConfigs()
      uiControl.dialogVisible = false
    }
  })
}

onMounted(async () => {
  await loadDefaultConfigs()
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

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.disable-input {
  pointer-events: none;
}

.setting-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px dashed #dcdcdc;
  border-radius: 4px;
}

.setting-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.setting-key {
  font-weight: bold;
  font-size: 14px;
}

.setting-content {
  padding-left: 20px;
}

.setting-data-item {
  margin-bottom: 8px;
}

.data-key {
  width: 250px;
  color: #606266;
}

.data-value {
  width: 120px;
}
</style>
