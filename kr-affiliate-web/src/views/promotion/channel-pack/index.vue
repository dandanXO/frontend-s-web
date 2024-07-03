<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Channel Pack') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName" :tab-change="checkHistory(activeName)">
        <el-tab-pane label="APP" name="app-channel">
          <AppChannelTab />
        </el-tab-pane>
        <el-tab-pane :label="t('fields.packHistory')" name="pack-history">
          <PackHistoryTab ref="packTab" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppChannelTab from './tab/app-channel.vue'
import PackHistoryTab from './tab/pack-history.vue'

const { t } = useI18n()
const activeName = ref('app-channel')
const packTab = ref()
function checkHistory(val) {
  if (val === 'pack-history') {
    packTab.value.loadHistory()
  }
}
</script>
