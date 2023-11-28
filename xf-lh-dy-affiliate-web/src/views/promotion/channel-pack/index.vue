<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Channel Pack') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName" style="margin-left: 20px">
        <el-tab-pane label="APP" name="app-channel">
          <AppChannelTan />
        </el-tab-pane>
        <el-tab-pane :label="t('fields.packHistory')" name="pack-history">
          <PackHistoryTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppChannelTan from './tab/app-channel.vue'
import PackHistoryTab from './tab/pack-history.vue'

const { t } = useI18n()
const activeName = ref('app-channel')
</script>
