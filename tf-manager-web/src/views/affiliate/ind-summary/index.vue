<template>
  <el-tabs v-model="activeName" :tab-change="checkTab(activeName)">
    <el-tab-pane :label="t('fields.dailyDetail')" name="daily-detail">
      <DailyDetailTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.dailySummary')" name="daily-summary">
      <DailySummaryTab ref="summaryTab" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.officialWebData')" name="official-web-data">
      <OfficialWebDataTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.packageWebData')" name="package-web-data">
      <PackageWebDataTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from 'vue'
import DailyDetailTab from './daily-detail/index.vue'
import DailySummaryTab from './daily-summary/index.vue'
import OfficialWebDataTab from './official-web-data/index.vue'
import PackageWebDataTab from './package-web-data/index.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeName = ref('daily-detail')
const summaryTab = ref()

function checkTab(val) {
  if (val === 'daily-summary') {
    console.log(summaryTab)
    summaryTab.value.loadSites()
    summaryTab.value.loadSummaryRecord()
  }
}
</script>
