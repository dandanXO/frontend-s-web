<template>
  <div>
    {{ t('fields.mqLogProcessWithTitle') }}
    <el-button
      style="margin-left: 20px"
      icon="el-icon-refresh"
      size="mini"
      type="success"
      @click="refresh()"
    />
  </div>
  <div v-for="item in page.records" :key="item.topic">
    <div>
      <h5>{{ t('fields.mqLogProcessTopic') }} : {{ item.topic }}</h5>
    </div>
    <el-table :data="item.list" v-loading="page.loading">
      <el-table-column prop="siteName" :label="t('fields.siteName')" />
      <el-table-column
        prop="systemTimestamp"
        :label="t('fields.mqLogProcessTimestamp')"
      />
      <el-table-column
        prop="siteTimestamp"
        :label="t('fields.mqLogTimestampWithTimezone')"
      />
    </el-table>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { getMQLog } from '../../../api/mq-log'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const page = reactive({
  records: [],
  loading: false,
})

async function loadMQLog() {
  page.loading = true
  const query = {}
  const { data: ret } = await getMQLog(query)

  page.records = ret

  page.loading = false
}

function refresh() {
  loadMQLog()
}

onMounted(() => {
  loadMQLog()
})
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
