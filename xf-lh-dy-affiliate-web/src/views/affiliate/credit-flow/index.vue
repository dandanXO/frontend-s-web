<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.creditFlow') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName" style="margin-left: 20px">
        <el-tab-pane
          :label="t('fields.comissionWallet')"
          name="comission-wallet"
        >
          <comissionWalletTab />
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
import comissionWalletTab from './tab/comission-wallet.vue'
import depositWalletTab from './tab/deposit-wallet.vue'

const { t } = useI18n()
const activeName = ref('comission-wallet')
</script>
