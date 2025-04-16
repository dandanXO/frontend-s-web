<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Deposit') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName" style="margin:20px;">
        <el-tab-pane :label="t('fields.affiliateDeposit')" name="deposit">
          <DepositTab />
        </el-tab-pane>
        <el-tab-pane :label="t('fields.depositRecord')" name="deposit-record">
          <DepositRecordTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import DepositTab from "./tab/deposit.vue";
import DepositRecordTab from "./tab/deposit-record.vue";

const { t } = useI18n();
const activeName = ref('deposit');
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}
</style>
