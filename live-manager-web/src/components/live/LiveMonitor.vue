<!--TODO-->
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
      :globalFilterFields="['title']"
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
      <div style="display: flex; gap: 8px; align-items: center">
        <span>日期区间：</span>
        <Calendar
          v-model="filters.startDate"
          placeholder="开始日期"
          :showIcon="true"
          dateFormat="yy-mm-dd"
        />
        <span></span>
        <Calendar
          v-model="filters.endDate"
          placeholder="结束日期"
          :showIcon="true"
          dateFormat="yy-mm-dd"
        />
      </div>
      <Button
        :size="'small'"
        type="button"
        icon="pi pi-refresh"
        label="重新载入"
        severity="info"
        @click="fetchStreams"
        :loading="loading"
      />
    </div>

      </template>
        <Column field="title" header="标题" sortable>
          <template #body="slotProps">
            {{ slotProps.data.title }}
          </template>
        </Column>

        <Column field="eventStartTime" header="赛事时间" sortable>
          <template #body="slotProps">
            {{ formatTime(slotProps.data.eventStartTime) }}
          </template>
        </Column>

        <Column field="sportId" header="体育项目" sortable>
          <template #body="slotProps">
            {{ getSportDisplayName(slotProps.data.sportId) }}
          </template>
        </Column>

        <Column field="liveStatus" header="状态" sortable>
          <template #body="slotProps">
            {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
          </template>
        </Column>


      <!--      <Column header="操作">-->
<!--        <template #body="slotProps">-->
<!--          <Button-->
<!--            icon="pi pi-eye"-->
<!--            class="p-button-rounded p-button-info mr-2"-->
<!--            @click="viewStream(slotProps.data)"-->
<!--            :disabled="!canPreview(slotProps.data.eventStatus)"-->
<!--            :tooltip="getPreviewTooltip(slotProps.data.eventStatus)"-->
<!--          />-->
<!--        </template>-->
<!--      </Column>-->
    </DataTable>
  </div>

<!--  <Dialog-->
<!--    v-model:visible="editDialogVisible"-->
<!--    header="修改聊天室名称"-->
<!--    :style="{ width: '400px' }"-->
<!--    :modal="true"-->
<!--  >-->
<!--    <div class="p-fluid">-->
<!--      <div class="p-field">-->
<!--        <label for="title">新名称</label>-->
<!--        <InputText id="title" v-model="editedTitle" />-->
<!--      </div>-->
<!--  </div>-->
<!--    <template #footer>-->
<!--      <Button-->
<!--        label="取消"-->
<!--        icon="pi pi-times"-->
<!--        class="p-button-text"-->
<!--        @click="editDialogVisible = false"-->
<!--      />-->
<!--      <Button label="確認" icon="pi pi-check" class="p-button-text" @click="submitRoomTitleEdit" />-->
<!--    </template>-->
<!--  </Dialog>-->

<!--  <StreamPlayer-->
<!--    :visible="showPlayer"-->
<!--    :stream="selectedStream"-->
<!--    @update:visible="(val) => (showPlayer = val)"-->
<!--    @reload="fetchStreams"-->
<!--  />-->

<!--  <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="確認" :modal="true">-->
<!--    <div class="confirmation-content">-->
<!--      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />-->
<!--      <span>確定要刪除這個直播嗎？</span>-->
<!--    </div>-->
<!--    <template #footer>-->
<!--      <Button label="取消" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />-->
<!--      <Button label="確定" icon="pi pi-check" class="p-button-danger" @click="confirmDelete" />-->
<!--    </template>-->
<!--  </Dialog>-->
</template>

<script>

import { reactive, computed } from 'vue';
import { DashboardService } from '@/service/DashboardService'
import { useI18n } from "vue-i18n";
import { liveSportTyps } from '@/utils/live.js';

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
//TODO filter date
// 獲取直播列表
const fetchStreams = async () => {
  console.log('fetchStreams')
  try {
    clearData()
    loading.value = true
    const request = {
      eventTime: [filters.value.startDate || defaultStartDate, filters.value.endDate || defaultEndDate],
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
</style>
