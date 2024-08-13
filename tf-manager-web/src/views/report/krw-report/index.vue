<template>
  <el-descriptions
    direction="vertical"
    :column="5"
    :size="size"
    border
  >
    <el-descriptions-item
      :label="t('fields.memberApplication')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.memberApplication }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.affiliateApplication')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.affiliateApplication }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.depositApplication')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.depositApplication }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.withdrawApplication')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.withdrawApplication }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.memberInbox')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.memberInquiry }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { getKoreaStatsReport } from '../../../api/report-centre'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const records = reactive({
  memberApplication: 0,
  depositApplication: 0,
  withdrawApplication: 0,
  affiliateApplication: 0,
  memberInquiry: 0,
})

async function loadReport() {
  const { data: ret } = await getKoreaStatsReport();
  Object.keys({ ...ret }).forEach(field => {
    records[field] = ret[field]
  })
}

onMounted(async () => {
  await loadReport()
})
</script>

<style scoped>
:deep(.el-descriptions__table) {
  border-collapse: separate !important;
  border-spacing: 10px 0px;
  table-layout: fixed;
}
</style>
