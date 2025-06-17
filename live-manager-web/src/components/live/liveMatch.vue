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
      v-model:selection="selectedRows"
    >
      <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <Select
            v-model="request.sportId"
            :options="uiControl.sport"
            optionLabel="name"
            placeholder="体育项目"
            :size="'small'"
          />
          <Select
            v-model="request.liveStatus"
            :options="uiControl.liveStatus"
            optionLabel="display"
            placeholder="状态"
            :size="'small'"
          />
          <InputText
            type="text"
            v-model="request.title"
            optionLabel="赛事标题"
            placeholder="赛事标题"
          />
          <Button label="搜索" :size="'small'" severity="success" icon="pi pi-search" />
          <Button
            label="重置"
            :size="'small'"
            severity="warn"
            icon="pi pi-refresh"
            @click="resetQuery"
          />
          <Button label="删除" :size="'small'" icon="pi pi-times" severity="danger" />
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="title" header="ID" sortable>
        <template #body="slotProps">
          {{ slotProps.data.title }}
        </template>
      </Column>

      <Column field="eventStartTime" header="体育项目" sortable>
        <template #body="slotProps">
          {{ formatTime(slotProps.data.eventStartTime) }}
        </template>
      </Column>

      <Column field="sportId" header="赛事名称(中文)" sortable>
        <template #body="slotProps">
          {{ getSportDisplayName(slotProps.data.sportId) }}
        </template>
      </Column>

      <Column field="liveStatus" header="赛事名称(英文)" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>

      <Column field="liveStatus" header="主队" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>
      <Column field="liveStatus" header="客队" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>
      <Column field="liveStatus" header="赛事时间" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>
      <Column field="liveStatus" header="是否生产推留地址(是/否)" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>
      <Column field="liveStatus" header="状态" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>
      <Column field="liveStatus" header="操作" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { defineComponent, reactive, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { liveSportTyps } from '@/utils/live'
import { DashboardService } from '@/service/DashboardService'
const { getSportLiveMatch } = DashboardService
const { t } = useI18n()

const uiControl = reactive({
  sport: liveSportTyps,
  // 0:比赛异常, 说明：暂未判断具体原因的异常比赛，建议隐藏处理, 1:未开赛, 2:进行中, 3:完场, 11:中断, 12:取消, 13:延期, 14:腰斩, 15:待定
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
})
const request = reactive({
  size: 30,
  current: 1,
  sportId: null,
  liveStatus: null,
  title: null,
})

function resetQuery() {
  request.sportId = null
  request.title = null
  request.liveStatus = null
}

async function loadMatch() {
  // page.loading = true
  const params = new URLSearchParams({
    sportId: request.sportId,
    status: request.liveStatus,
    title: request.title,
    page: request.current,
    limit: request.size,
  }).toString()

  console.log(params)
  const res = await getSportLiveMatch(params)
  console.log(res)

  // page.records = res.data.records || []
  // page.total = res.data.total || 0
  // page.pages = res.data.pages || 0
  // page.current = res.data.current || 1
  // page.loading = false
}

onMounted(() => {
  loadMatch()
})
</script>

<script>
import { defineComponent, onMounted, reactive, ref, computed } from 'vue'
// import { useI18n } from "vue-i18n";
// import { getSportLiveMatch, copySportLiveMatch, batchDeleteSportLiveMatch } from "@/api/sport-live-match";
// import { ElMessage, ElMessageBox } from "element-plus";
// import { liveSportTyps } from "@/utils/live"

// const selectedRows = ref([])
// const request = reactive({
//   size: 30,
//   current: 1,
//   sportId: null,
//   liveStatus: null,
//   title: null,
// })

export default defineComponent({
  setup() {
    const { t } = useI18n()
    // const uiControl = reactive({
    //   sport: liveSportTyps,
    //   // 0:比赛异常, 说明：暂未判断具体原因的异常比赛，建议隐藏处理, 1:未开赛, 2:进行中, 3:完场, 11:中断, 12:取消, 13:延期, 14:腰斩, 15:待定
    //   liveStatus: [
    //     { name: '0', display: t('status.namiMatch.GAME_EXCEPTION'), id: 0 },
    //     { name: '1', display: t('status.namiMatch.NOT_STARTED'), id: 1 },
    //     { name: '2', display: t('status.namiMatch.ONGOING'), id: 2 },
    //     { name: '3', display: t('status.namiMatch.ENDED'), id: 3 },
    //     { name: '11', display: t('status.namiMatch.INTERRUPTED'), id: 11 },
    //     { name: '12', display: t('status.namiMatch.CANCEL'), id: 12 },
    //     { name: '13', display: t('status.namiMatch.DELAYED'), id: 13 },
    //     { name: '14', display: t('status.namiMatch.ABANDONED'), id: 14 },
    //     { name: '15', display: t('status.namiMatch.PENDING'), id: 15 },
    //   ],
    // })
    const page = reactive({
      pages: 0,
      records: [],
      total: 0,
      current: 1,
      loading: false,
    })
    // const request = reactive({
    //   size: 30,
    //   current: 1,
    //   sportId: null,
    //   liveStatus: null,
    //   title: null,
    // })
    const dialogVisible = ref(false)
    const currentRow = ref(null)
    // const selectedRows = ref([])

    const canCopy = computed(() => {
      return currentRow.value && currentRow.value.streamId
    })

    function formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts)
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }

    function resetQuery() {
      request.sportId = null
      request.title = null
      request.liveStatus = null
    }

    async function loadMatch() {
      page.loading = true
      const res = await getSportLiveMatch({
        sportId: request.sportId,
        status: request.liveStatus,
        title: request.title,
        page: request.current,
        limit: request.size,
      })
      console.log(res.data.records)

      page.records = res.data.records || []
      page.total = res.data.total || 0
      page.pages = res.data.pages || 0
      page.current = res.data.current || 1
      page.loading = false
    }

    function changePage(pageNum) {
      request.current = pageNum
      loadMatch()
    }

    function showDialog(row) {
      currentRow.value = row
      dialogVisible.value = true
    }

    async function handleCopy() {
      // 調用 API
      const res = await copySportLiveMatch({ matchId: currentRow.value.matchId })
      if (res.code === 0) {
        ElMessage.success(t('fields.copySuccess'))
        dialogVisible.value = false
      } else {
        ElMessage.error(t('fields.copyFailed'))
      }
    }

    function handleSelectionChange(val) {
      selectedRows.value = val
    }

    async function handleDelete() {
      if (!selectedRows.value.length) {
        ElMessage.warning(t('fields.pleaseSelectMatch'))
        return
      }
      try {
        await ElMessageBox.confirm(`${t('fields.confirmDelete')}`, t('fields.tips'), {
          confirmButtonText: t('fields.confirm'),
          cancelButtonText: t('fields.cancel'),
          type: 'warning',
        })
      } catch {
        return
      }
      // 批量刪除
      const matchIds = selectedRows.value.map((row) => row.matchId)
      const res = await batchDeleteSportLiveMatch({ matchIds })
      if (res.code === 0) {
        ElMessage.success(t('fields.deleteSuccess'))
      } else {
        ElMessage.error(res.msg || t('fields.deleteFailed'))
      }
      loadMatch()
    }

    // 根據 sportId 取得運動 display 名稱
    function getSportDisplayName(sportId) {
      const found = uiControl.sport.find((item) => item.id === sportId)
      return found ? found.display : sportId
    }

    function getLiveStatusDisplayName(statusId) {
      const found = uiControl.liveStatus.find((item) => item.id === statusId)
      return found ? found.display : statusId
    }

    function hasStreamId(row) {
      // 判斷 streamId 是否有值且非空
      return !!(row && row.streamId)
    }

    onMounted(() => {
      loadMatch()
    })

    return {
      t,
      uiControl,
      page,
      request,
      formatTime,
      loadMatch,
      resetQuery,
      changePage,
      dialogVisible,
      currentRow,
      showDialog,
      handleCopy,
      handleDelete,
      getSportDisplayName,
      getLiveStatusDisplayName,
      canCopy,
      hasStreamId,
      selectedRows,
      handleSelectionChange,
    }
  },
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
