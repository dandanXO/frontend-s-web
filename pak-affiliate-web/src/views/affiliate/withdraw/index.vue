<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.affiliateWithdraw') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName" style="margin:20px;">
        <!-- <el-tab-pane :label="t('menu.CommWithdraw')" name="withdraw">
          <WithdrawTab />
        </el-tab-pane> -->
        <el-tab-pane :label="t('menu.Withdraw')" name="withdraw-main">
          <MainWalletWithdrawTab />
        </el-tab-pane>
        <el-tab-pane
          :label="t('fields.affiliateWithdrawRecord')"
          name="withdraw-record"
        >
          <WithdrawRecordTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import WithdrawTab from './tab/withdraw.vue'
import MainWalletWithdrawTab from './tab/withdraw-main.vue'
import WithdrawRecordTab from './tab/withdraw-record.vue'

const { t } = useI18n()
const activeName = ref('withdraw-main')
</script>
