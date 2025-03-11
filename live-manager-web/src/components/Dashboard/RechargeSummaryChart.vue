<template>
  <div class="card">
    <DataTable :value="summary" tableStyle="min-width: 50rem">
      <Column field="channel" header="通道类别"></Column>
      <Column field="amount" header="笔数"></Column>
      <Column field="percentage" header="占比"></Column>
      <Column field="fund" header="资金量"></Column>
      <Column field="fundPercentage" header="占比"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DashboardService } from '@/service/DashboardService'

onMounted(() => {
  DashboardService.getRechargeSummary().then((data) => (summary.value = data))
})

const summary = ref()
</script>
