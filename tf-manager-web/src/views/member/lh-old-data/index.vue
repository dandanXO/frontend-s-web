<template>
  <div class="header-container" style="margin-bottom: 40px">
    <div class="search">
      <el-input
        type="text"
        v-model="request.loginName"
        :rows="4"
        style="width: 400px; margin-top: 5px;"
        :placeholder="t('fields.loginName')"
      />
      <span style="margin-top: 20px">
        {{ t('fields.oldBetAmount') }} : {{ request.betAmount }}
      </span>
      <div class="btn-group">
        <el-button
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="search()"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { queryOldData } from '../../../api/lh-old-data'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const request = reactive({
  loginName: null,
  betAmount: 0,
})

async function search() {
  const { data: ret } = await queryOldData(request.loginName)
  request.betAmount = ret
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: grid;
  justify-content: flex-start;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.btn-group {
  margin-top: 15px;
}
</style>
