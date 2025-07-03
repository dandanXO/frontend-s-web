<template>
  <div class="card">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="streams"
      :paginator="true"
      :rows="10"
      :loading="loading"
      dataKey="eventId"
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['title']"
      responsiveLayout="scroll"
    >
      <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <Calendar
            id="eventTime"
            v-model="request.eventTime"
            selectionMode="range"
            hourFormat="24"
            dateFormat="yy-mm-dd"
            fluid
          />
          <Button
            :label="t('fields.search')"
            :size="'small'"
            severity="success"
            icon="pi pi-search"
            @click="fetchStreams"
          />
          <Button
            :label="t('fields.reset')"
            :size="'small'"
            severity="warn"
            icon="pi pi-refresh"
            @click="resetQuery"
          />
        </div>
      </template>

      <Column :expander="true" headerStyle="width: 3rem" />

      <Column field="title" :header="t('fields.title')" sortable>
        <template #body="slotProps">
          {{ slotProps.data.title }}
        </template>
      </Column>

      <Column field="eventStartTime" :header="t('fields.matchTime')" sortable>
        <template #body="slotProps">
          {{ formatTime(slotProps.data.eventStartTime) }}
        </template>
      </Column>

      <Column field="sportId" :header="t('fields.sportType')" sortable>
        <template #body="slotProps">
          {{ getSportDisplayName(slotProps.data.sportId) }}
        </template>
      </Column>

      <Column field="liveStatus" :header="t('fields.status')" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="p-3">
          <DataTable :value="slotProps.data.monitors" :showGridlines="true" class="p-datatable-sm">
            <Column :header="t('fields.streamTag')" style="width: 120px;">
              <template #body="{data}">
                {{ tagMap[data.tag] || data.tag || '-' }}
              </template>
            </Column>
            <Column :header="t('fields.streamScore')" style="width: 120px;">
              <template #body="{ data }">
                <div class="signal-bars">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="bar"
                    :class="{ active: n <= data.score }"
                  />
                </div>
              </template>
            </Column>
            <Column :header="t('fields.mediaUrl')" style="width: 350px;">
              <template #body="{ data }">
                <span style="word-break: break-all;">
                  {{ data.tag === 'streamer' ? data.streamerUrl : data.supplierUrl }}
                </span>
              </template>
            </Column>
            <Column field="name" :header="t('fields.name')" style="width: 100px;" />
            <Column :header="t('fields.createTime')" style="width: 180px;">
              <template #body="{ data }">
                {{ formatDate(data.createdAt) }}
              </template>
            </Column>
            <Column :header="t('fields.screenShot')">
              <template #body="{ data }">
                <Image
                  v-if="data.screenShot"
                  :src="data.screenShot.startsWith('http') ? data.screenShot : promoDir + data.screenShot"
                  :alt="t('fields.screenshot')"
                  style="height: 50px; aspect-ratio: 1/1; cursor: pointer; object-fit: contain;"
                  preview
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- <Dialog v-model:visible="imagePreviewDialogVisible" :modal="true" :style="{ width: '50vw' }">
          <template #header><h3>截圖預覽</h3></template>
          <img :src="currentImagePreviewUrl" alt="截圖預覽" style="width: 100%; display: block;" />
        </Dialog> -->
      </template>
      
      </DataTable>
  </div>

  </template>

<script>
import { reactive, computed } from 'vue';
import { DashboardService } from '@/service/DashboardService'
import { useI18n } from "vue-i18n";
import { liveSportTyps } from '@/utils/live.js';
import dayjs from 'dayjs';

export default {
  props: {
    fetchDataMethod: {
      type: Function,
      default: () => DashboardService.getLiveSportMonitorList,
    },
  },
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
//import StreamPlayer from './StreamPlayer.vue'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useStorage } from '@vueuse/core'
const promoDir = useStorage('IMAGE_CDN', '', sessionStorage).value
//const toast = useToast()

const route = useRoute()

const streams = ref([])
const loading = ref(false)
//const showPlayer = ref(false)
const selectedStream = ref(null)
const deleteDialog = ref(false)
const streamToDelete = ref(null)
//const editDialogVisible = ref(false)
//const editedTitle = ref('')
//const editingStreamId = ref(null)

// [新增] 定義 expandedRows 以追蹤展開的行
const expandedRows = ref([]);

//const openEditDialog = (stream) => {
//  editingStreamId.value = stream.streamerStreamId
//  editedTitle.value = stream.roomTitle || ''
//  editDialogVisible.value = true
//}
//
//const submitRoomTitleEdit = async () => {
//  if (!editingStreamId.value || !editedTitle.value) return
//
//  try {
//    const res = await DashboardService.updateRoomTitle(editingStreamId.value, editedTitle.value)
//
//    if (res) {
//      toast.add({ severity: 'success', summary: '成功', detail: '标题已更新', life: 3000 })
//      editDialogVisible.value = false
//      await fetchStreams()
//    } else {
//      toast.add({
//        severity: 'error',
//        summary: '错误',
//        detail: response?.message || '更新失败',
//        life: 3000,
//      })
//    }
//  } catch (err) {
//    console.error('更新标题错误:', err)
//    toast.add({ severity: 'error', summary: '错误', detail: '无法更新标题', life: 3000 })
//  }
//}


const { t } = useI18n();

const uiControl = reactive({
  sport: liveSportTyps,
  liveStatus: [
    { name: '0', display: t('status.namiMatch.GAME_EXCEPTION'), id: 0 },
    { name: '1', display: t('status.namiMatch.NOT_STARTED'), id: 1 },
    { name: '2', display: t('status.namiMatch.ONGOING'), id: 2 },
    { name: '3', display: t('status.namiMatch.ENDED'), id: 3 },
    { name: '11', display: t('status.namiMatch.INTERRUPTED'), id: 11 },
    { name: '12', display: t('status.namiMatch.CANCEL'), id: 12 },
    { name: '13', display: t('status.namiMatch.DELAYED'), id: 13 },
    { name: '14', display: t('status.namiMatch.ABANDONED'), id: 14 },
    { name: '15', display: t('status.namiMatch.PENDING'), id: 15 },
  ],
});

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}
const formatTime = (ts) => {
  if (!ts) return '-';
  const d = new Date(ts);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const getSportDisplayName = (sportId) => {
  const found = uiControl.sport.find(item => item.id === sportId);
  return found ? found.display : sportId;
};

const getLiveStatusDisplayName = (statusId) => {
  const found = uiControl.liveStatus.find(item => item.id === statusId);
  return found ? found.display : statusId;
};

// TODO 取當天00:00:00~23:59:5

const defaultStartDate = `2025-06-17 00:00:00`
const defaultEndDate = `2025-06-17 23:59:59`
const filters = ref({
  startDate: defaultStartDate,
  endDate: defaultEndDate,
})

// 清除數據
const clearData = () => {
  streams.value = []
  loading.value = false
  //showPlayer.value = false
  selectedStream.value = null
  deleteDialog.value = false
  streamToDelete.value = null
  clearFilter()
}

// 清除過濾器
const clearFilter = () => {
  filters.value = {
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  }
}

const request = reactive({
  eventTime: [new Date(), new Date()]
})

function resetQuery() {
  request.eventTime = [new Date(), new Date()]
}

//TODO filter date
// 獲取直播列表
const fetchStreams = async () => {
  console.log('fetchStreams')
  try {
    // clearData()
    loading.value = true
    // const request = {
    //   eventTime: [formatDate(filters.value.startDate) || defaultStartDate, formatDate(filters.value.endDate) || defaultEndDate],
    // }

    if (request.eventTime && request.eventTime.length === 2) {
      const [startTime, endTime] = request.eventTime;
      const formattedRange = [
      dayjs(startTime).format('YYYY-MM-DD 00:00:00'),
      dayjs(endTime).format('YYYY-MM-DD 23:59:59'),
      ];
      request.eventTime = formattedRange
    }
  
    const dataMethod = DashboardService.getLiveSportMonitorList
    const response = await dataMethod(request)
    streams.value = response
  } catch (error) {
    console.error('獲取直播列表失敗:', error)
  } finally {
    loading.value = false
  }
}
const tagMap = {
  streamer: '主播流',
  source: '原厂流',
  cdn: '原厂cdn流'
};
const sportMap = {
  1: '足球',
  2: '篮球',
  3: 'LOL',
  4: 'CSGO',
  5: 'DOTA2'
};

const liveStatusMap = {
  0: '未開始',
  1: '進行中',
  2: '已結束',
  3: '失敗'
};
// 監聽路由變化，重新獲取數據
watch(
  () => route.path,
  () => {
    fetchStreams()
  },
)

// 格式化日期時間
const formatDateTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString('zh-TW')
}

// 用于获取体育项目名称和 Tag 颜色
const getSportName = (sportId) => {
  switch (sportId) {
    case 1: return '足球';
    case 2: return '篮球';
    case 3: return '网球';
    case 4: return '棒球';
    case 5: return '排球';
    case 6: return '羽毛球'; // 假设 6 是羽毛球，根据实际情况调整
    // ... 其他 sportId 及其对应名称
    default: return '未知项目';
  }
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
    7: '已結束',
  }
  return statusMap[status] || '未知狀態'
}

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
    7: 'danger',
  }
  return severityMap[status] || 'info'
}

// 獲取直播主狀態標籤
const getStreamerStatusLabel = (status) => {
  const statusMap = {
    0: '停止直播',
    1: '開始直播',
  }
  return statusMap[status] || '未知狀態'
}

// 獲取直播主狀態樣式
const getStreamerStatusSeverity = (status) => {
  const severityMap = {
    0: 'danger',
    1: 'success',
  }
  return severityMap[status] || 'info'
}
// 檢查是否可以預覽
const canPreview = (status) => {
  return [0, 1].includes(status)
}

// 獲取預覽按鈕提示
const getPreviewTooltip = (status) => {
  return canPreview(status) ? '點擊預覽' : '當前狀態無法預覽'
}

// 查看直播
//const viewStream = (stream) => {
//  if (!canPreview(stream.eventStatus)) {
//    return
//  }
//
//  if (stream.cdnPlayUrlsHls !== null) {
//    selectedStream.value = {
//      ...stream,
//      title: stream.eventTitle,
//      streamId: stream.streamerStreamId,
//      playUrls: {
//        hls: stream.cdnPlayUrlsHls,
//        flv: stream.cdnPlayUrlsFlv,
//      },
//    }
//  }
//  showPlayer.value = true
//}

const editRoomTitle = async (stream) => {
  try {
    const { value } = await ElMessageBox.prompt('請輸入新的房間標題', '修改房間標題', {
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      inputValue: stream.roomTitle,
    })
    const result = await DashboardService.updateRoomTitle(stream.streamerStreamId, value)
    if (result) {
      ElMessage.success('房間標題更新成功')
      fetchStreams()
    }
  } catch (err) {
    console.log('取消修改房間標題')
  }
}

onMounted(() => {
  fetchStreams()
})
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
  color: #3b82f6;
}

/* 搜索圖標樣式 */
:deep(.search-icon) {
  color: #6b7280; /* 深灰色圖標 */
  font-size: 0.7rem; /* 調整大小 */
  transition: color 0.3s ease; /* 平滑過渡 */
}

/* 當搜索框獲得焦點時的圖標樣式 */
:deep(.p-inputtext:focus ~ .p-input-icon-left i) {
  color: #3b82f6; /* 藍色高亮 */
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
  border-color: #3b82f6; /* 藍色邊框 */
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
.signal-bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 14px;
}
.bar {
  width: 4px;
  background: #ccc;
  transition: 0.3s;
}
.bar:nth-child(1) { height: 4px; }
.bar:nth-child(2) { height: 6px; }
.bar:nth-child(3) { height: 8px; }
.bar:nth-child(4) { height: 10px; }
.bar:nth-child(5) { height: 12px; }
.bar.active {
  background: #67C23A;
}
</style>