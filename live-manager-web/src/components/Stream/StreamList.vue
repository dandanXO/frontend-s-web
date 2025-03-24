<template>
  <div class="card">
    <DataTable
      style="font-size: small"
      :size="'small'"
      v-model:filters="filters"
      :value="streams"
      paginator
      showGridlines
      :rows="10"
      dataKey="id"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['title', 'status', 'streamStatus']"
    >
      <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <Button
            :size="'small'"
            type="button"
            icon="pi pi-filter-slash"
            label="清除"
            outlined
            @click="clearFilter()"
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="關鍵詞搜索" :size="'small'" />
          </IconField>
        </div>
      </template>
      <template #empty> 暫無數據 </template>
      <template #loading> 正在加載數據，請稍候... </template>

      <Column field="title" header="標題" style="min-width: 20rem">
        <template #body="{ data }">
          {{ data.title }}
        </template>
      </Column>

      <Column field="streamStatus" header="直播狀態" style="min-width: 8rem">
        <template #body="{ data }">
          <Tag :value="getStreamStatusText(data.streamStatus)" :severity="getStreamStatusSeverity(data.streamStatus)" />
        </template>
      </Column>

      <Column field="startTime" header="開始時間" style="min-width: 12rem">
        <template #body="{ data }">
          {{ formatDateTime(data.startTime) }}
        </template>
      </Column>

      <Column field="sort" header="排序" style="min-width: 6rem">
        <template #body="{ data }">
          {{ data.sort }}
        </template>
      </Column>

      <Column field="streamId" header="串流ID" style="min-width: 8rem">
        <template #body="{ data }">
          {{ data.streamId }}
        </template>
      </Column>

      <Column field="createBy" header="創建者" style="min-width: 8rem">
        <template #body="{ data }">
          {{ data.createBy }}
        </template>
      </Column>

      <Column field="updateTime" header="更新時間" style="min-width: 12rem">
        <template #body="{ data }">
          {{ formatDateTime(data.updateTime) }}
        </template>
      </Column>

      <Column field="operations" header="操作" style="min-width: 8rem">
        <template #body="{ data }">
          <Button
            icon="pi pi-video"
            :size="'small'"
            severity="info"
            text
            @click="viewStream(data)"
            v-tooltip.top="'查看直播'"
          />
        </template>
      </Column>
    </DataTable>

    <StreamPlayer
      :visible="showPlayer"
      :stream-data="selectedStream"
      @update:visible="(val) => showPlayer = val"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DashboardService } from '@/service/DashboardService'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import StreamPlayer from './StreamPlayer.vue'

const streams = ref([])
const filters = ref()
const loading = ref(false)
const showPlayer = ref(false)
const selectedStream = ref(null)

onMounted(() => {
  loading.value = true
  DashboardService.getStreamList()
    .then((data) => {
      streams.value = data
    })
    .finally(() => {
      loading.value = false
    })
})

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const getStreamStatusText = (status) => {
  switch (status) {
    case 0:
      return '初始化'
    case 1:
      return '準備'
    case 2:
      return '開始啟動'
    case 3:
      return '啟動完成'
    case 4:
      return '進行中'
    case 5:
      return '異常'
    case 6:
      return '停止'
    case 7:
      return '結束'
    default:
      return '未知狀態'
  }
}

const getStreamStatusSeverity = (status) => {
  switch (status) {
    case 1:
      return 'warning'
    case 2:
      return 'success'
    case 3:
      return 'info'
    case 4:
      return 'danger'
    default:
      return null
  }
}

const viewStream = (stream) => {
  selectedStream.value = stream
  showPlayer.value = true
}
</script>

<style scoped>
.p-button.p-button-icon-only {
  width: 2rem;
  padding: 0.5rem 0;
}
</style>
