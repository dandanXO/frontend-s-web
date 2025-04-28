<template>
  <div class="card">
    <DataTable
      :value="streams"
      :paginator="true"
      :rows="10"
      :loading="loading"
      dataKey="eventId"
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['eventTitle', 'streamStatus']"
      responsiveLayout="scroll"
    >
      <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <div style="display: flex; gap: 8px">
            <Button
              :size="'small'"
              type="button"
              icon="pi pi-filter-slash"
              label="清除"
              outlined
              @click="clearFilter()"
            />
          </div>
          <!-- 搜尋框 -->
          <IconField class="search-container">
            <InputIcon>
              <i class="pi pi-search search-icon" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="關鍵詞搜索" :size="'small'" class="search-input" />
          </IconField>
          <!-- 重新載入按鈕 -->
          <Button
              :size="'small'"
              type="button"
              icon="pi pi-refresh"
              label="重新載入"
              severity="info"
              @click="fetchStreams"
              :loading="loading"
            />
        </div>
      </template>

      <Column field="eventTitle" header="標題" sortable>
        <template #body="slotProps">
          {{ slotProps.data.eventTitle }}
        </template>
      </Column>

      <Column field="streamStatus" header="源流狀態" sortable>
        <template #body="slotProps">
          <Tag :severity="getStatusSeverity(slotProps.data.streamStatus)" :value="getStatusLabel(slotProps.data.streamStatus)" />
        </template>
      </Column>

      <Column field="createTime" header="創建時間" sortable>
        <template #body="slotProps">
          {{ formatDateTime(slotProps.data.createTime) }}
        </template>
      </Column>

      <Column field="updateTime" header="更新時間" sortable>
        <template #body="slotProps">
          {{ formatDateTime(slotProps.data.updateTime) }}
        </template>
      </Column>

      <Column field="streamerName" header="主播" sortable>
        <template #body="slotProps">
          {{ slotProps.data.streamerName || '未分配' }}
        </template>
      </Column>

      <Column field="supplierStreamId" header="供應商串流ID" sortable>
        <template #body="slotProps">
          {{ slotProps.data.supplierStreamId }}
        </template>
      </Column>

      <Column field="streamerStreamId" header="主播串流ID" sortable>
        <template #body="slotProps">
          {{ slotProps.data.streamerStreamId }}
        </template>
      </Column>
      <Column field="streamerStatus" header="直播主狀態" sortable>
        <template #body="slotProps">
          <Tag :severity="getStreamerStatusSeverity(slotProps.data.streamerStatus)" :value="getStreamerStatusLabel(slotProps.data.streamerStatus)" />
        </template>
      </Column>
      <Column header="操作">
        <template #body="slotProps">
          <Button 
            icon="pi pi-eye" 
            class="p-button-rounded p-button-info mr-2" 
            @click="viewStream(slotProps.data)"
            :disabled="!canPreview(slotProps.data.streamStatus)"
            :tooltip="getPreviewTooltip(slotProps.data.streamStatus)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <StreamPlayer
    :visible="showPlayer"
    :stream="selectedStream"
    @update:visible="(val) => showPlayer = val"
    @reload="fetchStreams"
  />

  <Dialog
    v-model:visible="deleteDialog"
    :style="{ width: '450px' }"
    header="確認"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>確定要刪除這個直播嗎？</span>
    </div>
    <template #footer>
      <Button label="取消" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
      <Button label="確定" icon="pi pi-check" class="p-button-danger" @click="confirmDelete" />
    </template>
  </Dialog>
</template>

<script>
// 根據路由判斷獲取數據的方法
import { DashboardService } from '@/service/DashboardService';

export default {
  props: {
    fetchDataMethod: {
      type: Function,
      default: () => DashboardService.getStreamList
    }
  }
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import StreamPlayer from './StreamPlayer.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';

const route = useRoute();

const streams = ref([]);
const loading = ref(false);
const showPlayer = ref(false);
const selectedStream = ref(null);
const deleteDialog = ref(false);
const streamToDelete = ref(null);

const filters = ref({
  global: { value: null, matchMode: 'contains' }
});

// 清除數據
const clearData = () => {
  streams.value = [];
  loading.value = false;
  showPlayer.value = false;
  selectedStream.value = null;
  deleteDialog.value = false;
  streamToDelete.value = null;
  filters.value = {
    global: { value: null, matchMode: 'contains' }
  };
};

// 清除過濾器
const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' }
  };
};

// 獲取直播列表
const fetchStreams = async () => {
  try {
    clearData();
    loading.value = true;
    // 根據當前路由設置數據獲取方法
    const dataMethod = route.path.includes('/my-streams') ? DashboardService.getMyStreams : DashboardService.getStreamList;
    const response = await dataMethod();
    streams.value = response;
  } catch (error) {
    console.error('獲取直播列表失敗:', error);
  } finally {
    loading.value = false;
  }
};

// 監聽路由變化，重新獲取數據
watch(
  () => route.path,
  () => {
    fetchStreams();
  }
);

// 格式化日期時間
const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString('zh-TW');
};

// 獲取狀態標籤
const getStatusLabel = (status) => {
  const statusMap = {
    0: '初始化',
    1: '準備中',
    2: '開始啟動',
    3: '啟動完成',
    4: '直播中',
    5: '已結束',
    6: '已停止',
    7: '已結束'
  };
  return statusMap[status] || '未知狀態';
};

// 獲取狀態樣式
const getStatusSeverity = (status) => {
  const severityMap = {
    0: 'info',
    1: 'info',
    2: 'warning',
    3: 'success',
    4: 'success',
    5: 'danger',
    6: 'danger',
    7: 'danger'
  };
  return severityMap[status] || 'info';
};


// 獲取直播主狀態標籤
const getStreamerStatusLabel = (status) => {
  const statusMap = {
    0: '停止直播',
    1: '開始直播',
  }
  return statusMap[status] || '未知狀態';
};

// 獲取直播主狀態樣式
const getStreamerStatusSeverity = (status) => {
  const severityMap = {
    0: 'danger',
    1: 'success',
  }
  return severityMap[status] || 'info';
};
// 檢查是否可以預覽
const canPreview = (status) => {
  return status >= 0 && status <= 4;
};

// 獲取預覽按鈕提示
const getPreviewTooltip = (status) => {
  return canPreview(status) ? '點擊預覽' : '當前狀態無法預覽';
};

// 查看直播
const viewStream = (stream) => {
  if (!canPreview(stream.streamStatus)) {
    return;
  }

  if (stream.cdnPlayUrlsHls !== null) {
    selectedStream.value = {
      ...stream,
      title: stream.eventTitle,
      playUrls: {
        hls: stream.cdnPlayUrlsHls,
        flv: stream.cdnPlayUrlsFlv
      }
    };
  }
  showPlayer.value = true;
};

onMounted(() => {
  fetchStreams();
});
</script>

<style scoped>
.p-button.p-button-icon-only {
  width: 2rem;
  padding: 0.5rem 0;
}

.search-container {
  width: 100%;
  max-width: 230px;
}

/* 自定義圖標樣式 */
:deep(.p-input-icon-left i) {
  color: #666; /* 修改圖標顏色 */
  font-size: 1.5rem; /* 修改圖標大小 */
}

/* 在懸停時改變圖標顏色 */
:deep(.p-input-icon-left:hover i) {
  color: #3B82F6;
}

/* 搜索圖標樣式 */
:deep(.search-icon) {
  color: #6B7280; /* 深灰色圖標 */
  font-size: 0.7rem; /* 調整大小 */
  transition: color 0.3s ease; /* 平滑過渡 */
}

/* 當搜索框獲得焦點時的圖標樣式 */
:deep(.p-inputtext:focus ~ .p-input-icon-left i) {
  color: #3B82F6; /* 藍色高亮 */
}

/* 搜索容器樣式 */
.search-container {
  min-width: 200px; /* 設置最小寬度 */
  position: relative;
}

/* 搜索輸入框樣式 */
:deep(.search-input) {
  transition: all 0.3s ease;
  border-radius: 4px; /* 圓角邊框 */
}

/* 搜索輸入框獲得焦點時的樣式 */
:deep(.search-input:focus) {
  border-color: #3B82F6; /* 藍色邊框 */
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25); /* 輕微發光效果 */
}

/* 如果需要調整圖標位置 */
:deep(.p-input-icon-left) {
  display: flex;
  align-items: center;
}

:deep(.p-input-icon-left i) {
  margin-left: 0.5rem; /* 調整左邊距 */
}
</style>
