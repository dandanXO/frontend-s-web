<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Transfer') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName" style="margin-left: 20px">
        <el-tab-pane :label="t('fields.transfer')" name="transfer">
          <TransferTab />
        </el-tab-pane>
        <el-tab-pane :label="t('fields.transferRecord')" name="transfer-record">
          <TransferRecordTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import TransferTab from "./tab/transfer.vue";
import TransferRecordTab from "./tab/transfer-record.vue";

const { t } = useI18n();
const activeName = ref('transfer');
</script>

<style rel="stylesheet/scss" lang="scss">
.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}
</style>
