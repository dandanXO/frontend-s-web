<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">
            {{ $t('commissionInfo.commissionInfo') }}
          </span>
        </div>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane
          :label="t('commissionInfo.affiliateCommissionInfo')"
          name="commission-info"
        >
          <commissionInfo />
        </el-tab-pane>
        <el-tab-pane
          :label="t('commissionInfo.commissionCalculator')"
          name="commission-calculator"
        >
          <commissionCalculator />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import commissionInfo from './tab/commission-info.vue'
import commissionCalculator from './tab/commission-calculator.vue'

const { t } = useI18n()
const activeName = ref('commission-info')
</script>
