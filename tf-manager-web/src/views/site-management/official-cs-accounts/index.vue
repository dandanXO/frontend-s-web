<template>
  <div class="roles-main" style="max-width: 600px; margin: auto; padding: 2px;">

    <!-- Input for adding new values -->
    <el-input v-model="newValue" :placeholder="t('fields.account')" clearable />
    <el-button type="primary" @click="addValue" style="margin-top: 10px;"> {{ t('fields.add') }}</el-button>

    <!-- Config List -->
    <el-table :data="configValues" border style="margin-top: 20px;" height="600">
      <el-table-column type="index" width="50" />
      <el-table-column prop="value" :label="t('fields.account')" />
      <el-table-column :label="t('fields.action')" width="100">
        <template #default="{$index}">
          <el-button type="danger" size="small" @click="removeValue($index)"> {{ t('fields.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Save Button (Enabled only if changes are made) -->
    <el-button type="success" @click="updateConfig" :disabled="!isChanged" style="margin-top: 20px;">
      {{ t('fields.save') }}
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { getCsAccounts, updateAccounts } from "../../../api/official-cs-accounts";
import { useI18n } from "vue-i18n";
import { useStore } from '../../../store';

const { t } = useI18n();
const store = useStore();
const configValues = ref([]); // List of current config values
const originalConfigValues = ref([]); // Store original values for change tracking
const newValue = ref(""); // New value input

// Fetch config values from GET API
const fetchConfig = async () => {
  try {
    const response = await getCsAccounts(store.state.user.siteId);
    configValues.value = response.data.map((value) => ({ value }));
    originalConfigValues.value = JSON.parse(JSON.stringify(configValues.value));
  } catch (error) {
    console.error("Error fetching config:", error);
  }
};

const isChanged = computed(() => {
  return JSON.stringify(configValues.value) !== JSON.stringify(originalConfigValues.value);
});

// Add new value to the list
const addValue = () => {
  if (newValue.value.trim()) {
    configValues.value.push({ value: newValue.value });
    newValue.value = "";
  }
};

// Remove value from the list
const removeValue = (index) => {
  configValues.value.splice(index, 1);
};

// Send updated list to PUT API
const updateConfig = async () => {
  try {
    await updateAccounts(store.state.user.siteId, configValues.value.map((item) => item.value).join(","))
    ElMessage({ message: t('message.updateSuccess'), type: "success" });
    originalConfigValues.value = JSON.parse(JSON.stringify(configValues.value));
  } catch (error) {
    console.error("Error updating config:", error);
    ElMessage({ message: t('message.fail'), type: "error" });
  }
};

onMounted(fetchConfig);
</script>
