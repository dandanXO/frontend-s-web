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
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <h5>
        {{ t('fields.mqLogProcessTopic') }} : {{ item.topic }}
      </h5>
      <el-button
        icon="el-icon-delete"
        size="mini"
        type="delete"
        @click="handleDeleteMqLog(item.topic)"
      />
    </div>
    <el-table
      :data="item.list"
      v-loading="page.loading"
      :row-class-name="tableRowClassName"
      style="padding-bottom: 50px;"
    >
      <el-table-column prop="siteName" :label="t('fields.siteName')" />
      <el-table-column :label="t('fields.mqLogProcessTimestamp')">
        <template #default="scope">
          {{ scope.row.systemTimestamp }}
          <span style="padding-left: 20px;">
            "{{ formatTimeDifference(scope.row.currentSystemTimeDifferent) }}"
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="siteTimestamp"
        :label="t('fields.mqLogTimestampWithTimezone')"
      />
    </el-table>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { getMQLog, deleteMqLog } from '../../../api/mq-log'
import { useI18n } from 'vue-i18n'
import { ElMessage } from "element-plus"

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

function formatTimeDifference(seconds) {
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  let finalString = '- '
  if (d > 0) {
    finalString += d + 'd '
  }
  if (h > 0) {
    finalString += h + 'h '
  }
  if (m > 0) {
    finalString += m + 'm '
  }
  if (s > 0) {
    finalString += s + 's '
  }
  return finalString.trim()
}

function tableRowClassName({ row }) {
  const seconds = row.currentSystemTimeDifferent
  if (seconds < 60) {
    return 'green-row'
  } else if (seconds < 600) {
    return 'yellow-row'
  } else if (seconds > 86400) {
    return 'grey-row'
  } else {
    return 'red-row'
  }
}

async function handleDeleteMqLog(topic) {
  await deleteMqLog(topic);
  await loadMQLog();
  ElMessage.success(t('message.deleteSuccess'));
}

onMounted(() => {
  loadMQLog()
})
</script>
<style rel="stylesheet/scss" lang="scss">
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

.green-row {
  background-color: #d4edda !important;
}

.yellow-row {
  background-color: #fff3cd !important;
}

.red-row {
  background-color: #f8d7da !important;
}

.grey-row {
  background-color: #e2e3e5 !important;
}
</style>
