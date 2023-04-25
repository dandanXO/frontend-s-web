<template>
  <div class="roles-main">
    <el-table :data="page.records" v-loading="page.loading" stripe ref="table" row-key="id" size="small"
              style="width: 100%" highlight-current-row :empty-text="t('fields.noData')"
    >
      <el-table-column prop="mallName" :label="t('fields.mallName')" width="300" />
      <el-table-column prop="balance" :label="t('fields.balance')" width="200" />
    </el-table>

  </div>
</template>

<script setup>

import { onMounted, reactive } from "vue";
import { getBalance } from '../../../api/balance'
import { useI18n } from "vue-i18n";

// eslint-disable-next-line
const { t } = useI18n();
const page = reactive({
  records: [],
  loading: false
});

async function loadBalance() {
  page.loading = true;
  const { data: ret } = await getBalance();
  page.records = ret;
  page.loading = false;
}

onMounted(() => {
  loadBalance();
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
margin-bottom: 10px;
}

.search {
display: flex;
justify-content: flex-start;
}

.btn-group {
margin-top: 15px;
}

.dialog-footer {
display: flex;
justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
padding: 4px 0;
}
</style>
