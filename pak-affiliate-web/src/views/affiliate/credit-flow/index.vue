<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.creditFlow') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane
          :label="t('fields.commissionWallet')"
          name="commission-wallet"
        >
          <commissionWalletTab />
        </el-tab-pane>
        <el-tab-pane :label="t('fields.depositWallet')" name="deposit-wallet">
          <depositWalletTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import commissionWalletTab from './tab/commission-wallet.vue'
import depositWalletTab from './tab/deposit-wallet.vue'
console.log('')
const { t } = useI18n()
const activeName = ref('commission-wallet')
</script>
