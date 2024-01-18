<template>
  <el-tabs v-model="activeName" :tab-change="checkTab(activeName)">
    <el-tab-pane :label="t('fields.dailyDetail')" name="daily-detail">
      <DailyDetailTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.dailySummary')" name="daily-summary">
      <DailySummaryTab ref="summaryTab" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from 'vue'
import DailyDetailTab from './daily-detail/index.vue'
import DailySummaryTab from './daily-summary/index.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeName = ref('daily-detail')
const summaryTab = ref()

function checkTab(val) {}
</script>
