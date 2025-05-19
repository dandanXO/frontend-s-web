<template>
  <div class="vip-status-main">
    <div class="header-container">
      <el-button type="primary" icon="el-icon-refresh" @click="loadVipStatus">
        {{ t('fields.refresh') }}
      </el-button>
    </div>

    <el-table :data="vipStatusList" size="small" v-loading="loading" row-key="id">
      <el-table-column prop="name" :label="t('fields.name')" />
      <el-table-column :label="t('fields.status')" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="(value) => toggleStatus(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getChatVipStatus, updateChatVipStatus } from '@/api/sport-live-chat'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const vipStatusList = ref([])
const loading = ref(false)

async function loadVipStatus() {
  loading.value = true
  try {
    const { data } = await getChatVipStatus({})
    vipStatusList.value = data || []
  } catch (error) {
    ElMessage.error(t('message.failedToLoad'))
  } finally {
    loading.value = false
  }
}

async function toggleStatus(row) {
  try {
    await updateChatVipStatus(row)
    ElMessage.success(t('message.updateSuccess'))
  } catch (error) {
    ElMessage.error(t('message.updateFailed'))
    row.status = row.status === 1 ? 0 : 1
  }
}

loadVipStatus()
</script>

<style scoped>
.header-container {
  margin-bottom: 10px;
}
</style>
