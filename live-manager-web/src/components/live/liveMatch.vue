<!--TODO-->
<template>
  <div class="card">
    <DataTable
      :value="page.records"
      :rows="30"
      :loading="loading"
      dataKey="matchId"
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['title']"
      v-model:selection="selectedRows"
      responsiveLayout="scroll"
      scrollable 
      scrollWidth="100%"
    >
      <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <Calendar
              id="matchTime"
              v-model="request.matchTime"
              selectionMode="range"
              hourFormat="24"
              dateFormat="yy-mm-dd"
              fluid
          />
          <Select
            v-model="request.sportId"
            :options="uiControl.sport"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('fields.sportType')"
            :size="'small'"
          />
          <Select
            v-model="request.liveStatus"
            :options="uiControl.liveStatus"
            optionLabel="display"
            :placeholder="t('fields.status')"
            :size="'small'"
          />
          <InputText
            type="text"
            v-model="request.title"
            :optionLabel="t('fields.matchTitle')"
            :placeholder="t('fields.matchTitle')"
          />
          <Select
              v-model="request.isStreamIdExist"
              :options="uiControl.isStreamIdExist"
              optionLabel="display"
              optionValue="key"
              :placeholder="t('fields.isLiveUrlExist')"
              :size="'small'"
            />
          <Button
            :label="t('fields.search')"
            :size="'small'"
            severity="success"
            icon="pi pi-search"
            @click="loadMatch"
          />
          <Button
            :label="t('fields.reset')"
            :size="'small'"
            severity="warn"
            icon="pi pi-refresh"
            @click="resetQuery"
          />
          <Button
            :label="t('fields.delete')"
            :size="'small'"
            icon="pi pi-times"
            severity="danger"
            @click="handleDelete"
          />
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="title" :header="t('fields.id')" sortable style="min-width: 100px">
        <template #body="slotProps">
          {{ slotProps.data.matchId }}
        </template>
      </Column>
      <Column field="liveStatus" :header="t('fields.sportType')" sortable style="min-width: 150px">
        <template #body="slotProps">
          {{ getSportDisplayName(slotProps.data.sportId) }}
        </template>
      </Column>

      <Column
        field="eventStartTime"
        :header="t('fields.competitionNameZh')"
        sortable
        style="min-width: 250px"
      >
        <template #body="slotProps">
          {{ slotProps.data.competitionNameZh }}
        </template>
      </Column>

      <Column
        field="sportId"
        :header="t('fields.competitionNameEn')"
        sortable
        style="min-width: 250px"
      >
        <template #body="slotProps">
          {{ slotProps.data.competitionNameEn }}
        </template>
      </Column>

      <Column field="liveStatus" :header="t('fields.homeTeam')" sortable style="min-width: 200px">
        <template #body="slotProps">
          <Image
            v-if="slotProps.data.home && slotProps.data.home.icon"
            :src="slotProps.data.home.icon"
            style="width: 24px; height: 24px; margin-right: 8px"
            preview
          />
          {{ slotProps.data.home?.nameZh || slotProps.data.home?.nameEn }}
        </template>
      </Column>

      <Column field="liveStatus" :header="t('fields.awayTeam')" sortable style="min-width: 200px">
        <template #body="slotProps">
          <Image
            v-if="slotProps.data.away && slotProps.data.away.icon"
            :src="slotProps.data.away.icon"
            style="width: 24px; height: 24px; margin-right: 8px"
            preview
          />
          {{ slotProps.data.away?.nameZh || slotProps.data.away?.nameEn }}
        </template>
      </Column>
      <Column field="liveStatus" :header="t('fields.matchTime')" sortable style="min-width: 200px">
        <template #body="slotProps">
          {{ formatTime(slotProps.data.matchTime) }}
        </template>
      </Column>
      <Column
        field="liveStatus"
        :header="t('fields.isCreateLiveUrl')"
        sortable
        style="min-width: 100px"
      >
        <template #body="slotProps">
          {{ slotProps.data.isCreateLiveUrl }}
          <Tag v-if="hasStreamId(slotProps.data)" severity="success" :value="t('fields.yes')"></Tag>
          <Tag v-else severity="danger" :value="t('fields.no')"></Tag>
        </template>
      </Column>
      <Column field="liveStatus" :header="t('fields.status')" sortable style="min-width: 100px">
        <template #body="slotProps">
          <Tag
            v-if="slotProps.data.statusId === 0"
            severity="danger"
            :value="t('status.namiMatch.GAME_EXCEPTION')"
          />
          <Tag
            v-else-if="slotProps.data.statusId === 1"
            severity="warn"
            :value="t('status.namiMatch.NOT_STARTED')"
          />
          <Tag
            v-else-if="slotProps.data.statusId === 2"
            severity="warn"
            :value="t('status.namiMatch.ONGOING')"
          />
          <Tag
            v-else-if="slotProps.data.statusId === 3"
            severity="danger"
            :value="t('status.namiMatch.ENDED')"
          />
          <Tag
            v-else-if="slotProps.data.statusId === 11"
            severity="danger"
            :value="t('status.namiMatch.INTERRUPTED')"
          />
          <Tag
            v-else-if="slotProps.data.statusId === 12"
            severity="warning"
            :value="t('status.namiMatch.CANCEL')"
          />
          <Tag
            v-else-if="slotProps.data.statusId === 13"
            severity="danger"
            :value="t('status.namiMatch.DELAYED')"
          />
          <Tag
            v-else-if="slotProps.data.statusId === 14"
            severity="danger"
            :value="t('status.namiMatch.ABANDONED')"
          />
          <Tag
            v-else-if="slotProps.data.statusId === 15"
            severity="danger"
            :value="t('status.namiMatch.PENDING')"
          />
          <Tag v-else severity="default" :value="t('status.namiMatch.OTHER')" />
        </template>
      </Column>
      <Column field="liveStatus" :header="t('fields.operate')" sortable style="min-width: 300px">
        <template #body="slotProps">
          <Button
            :label="t('fields.addToLive')"
            :size="'small'"
            icon="pi pi-pencil"
            severity="info"
            @click="showDialog(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
    <Paginator
        :rows="request.size"
        :totalRecords="page.total"
        :rowsPerPageOptions="[10, 20, 50]"
        :first="(request.current - 1) * request.size"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="changePage"
        class="p-mt-2"
        />
  </div>

  <Dialog
    v-model:visible="dialogVisible"
    :header="t('fields.addToLive')"
    modal
    :style="{ width: '400px' }"
  >
    <div v-if="currentRow" class="match-info-list">
      <div class="match-info-row">
        <span class="label">ID：</span>
        <span class="value">{{ currentRow.matchId }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.sportType') }}：</span>
        <span class="value">{{ getSportDisplayName(currentRow.sportId) }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.matchTitle') }}：</span>
        <span class="value">{{ currentRow.title || currentRow.competitionNameZh }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.homeTeam') }}：</span>
        <span class="value">{{ currentRow.home?.nameZh || currentRow.home?.nameEn }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.homeTeam') }}ID：</span>
        <span class="value">{{ currentRow.home?.namiId }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.awayTeam') }}：</span>
        <span class="value">{{ currentRow.away?.nameZh || currentRow.away?.nameEn }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.awayTeam') }}ID：</span>
        <span class="value">{{ currentRow.away?.namiId }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.matchTime') }}：</span>
        <span class="value">{{ formatTime(currentRow.matchTime) }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.status') }}：</span>
        <el-tag v-if="currentRow.statusId === 0" type="danger">{{
          t('status.namiMatch.GAME_EXCEPTION')
        }}</el-tag>
        <el-tag v-else-if="currentRow.statusId === 1" type="warning">{{
          t('status.namiMatch.NOT_STARTED')
        }}</el-tag>
        <el-tag v-else-if="currentRow.statusId === 2" type="warn">{{
          t('status.namiMatch.ONGOING')
        }}</el-tag>
        <el-tag v-else-if="currentRow.statusId === 3" type="danger">{{
          t('status.namiMatch.ENDED')
        }}</el-tag>
        <el-tag v-else-if="currentRow.statusId === 11" type="danger">{{
          t('status.namiMatch.INTERRUPTED')
        }}</el-tag>
        <el-tag v-else-if="currentRow.statusId === 12" type="warning">{{
          t('status.namiMatch.CANCEL')
        }}</el-tag>
        <el-tag v-else-if="currentRow.statusId === 13" type="danger">{{
          t('status.namiMatch.DELAYED')
        }}</el-tag>
        <el-tag v-else-if="currentRow.statusId === 14" type="danger">{{
          t('status.namiMatch.ABANDONED')
        }}</el-tag>
        <el-tag v-else-if="currentRow.statusId === 15" type="danger">{{
          t('status.namiMatch.PENDING')
        }}</el-tag>
        <el-tag v-else type="default">{{ t('status.namiMatch.OTHER') }}</el-tag>
      </div>
    </div>
    <div
      style="
        display: flex;
        gap: 8px;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        margin-bottom: 16px;
      "
    >
      <Button
        type="button"
        :label="t('fields.cancel')"
        severity="secondary"
        @click="dialogVisible = false"
      />
      <Button
        type="button"
        :label="t('fields.addToLive')"
        :loading="isSubmitting"
        @click="handleCopy"
      />
    </div>
  </Dialog>
    <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { defineComponent, reactive, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { liveSportTyps } from '@/utils/live'
import { useToast } from 'primevue/usetoast'
import { DashboardService } from '@/service/DashboardService'
import { useConfirm } from 'primevue/useconfirm'
  import dayjs from 'dayjs'
const { getSportLiveMatch, copySportLiveMatch, batchDeleteSportLiveMatch } = DashboardService
const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()

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
  isStreamIdExist: [
        { key: true, display: t('fields.yes'), value: true },
        { key: false, display: t('fields.no'), value: false }
  ],
})
const request = reactive({
  size: 30,
  current: 1,
  sportId: null,
  liveStatus: null,
  title: null,
  matchTime: [new Date(), new Date()],
  isStreamIdExist: null,
})

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  current: 1,
  loading: false,
})

const dialogVisible = ref(false)
const currentRow = ref(null)

const selectedRows = ref()

function resetQuery() {
  request.sportId = null
  request.title = null
  request.liveStatus = null
  request.matchTime = [new Date(), new Date()]
  request.isStreamIdExist = null
}

async function loadMatch() {
  
  const rawParams = {
    page: request.current,
    limit: request.size,
    sportId: request.sportId,
    title: request.title,
    status: request.liveStatus,
    matchTime: request.matchTime,
    isStreamIdExist: request.isStreamIdExist,
  }
  
  if (rawParams.status) {
    rawParams.status = rawParams.status.id
  }

  if (rawParams.matchTime && rawParams.matchTime.length === 2) {
        const [startTime, endTime] = request.matchTime;
        const formattedRange = [
        dayjs(startTime).format('YYYY-MM-DD 00:00:00'),
        dayjs(endTime).format('YYYY-MM-DD 23:59:59'),
        ].join(',');
        rawParams.matchTime = formattedRange
  }
  // 過濾掉 null 或 undefined 的參數
  const filteredParams = {}
  for (const key in rawParams) {
    if (rawParams[key] !== null && rawParams[key] !== undefined) {
      filteredParams[key] = rawParams[key]
    }
  }

  const params = new URLSearchParams(filteredParams).toString()
  

  const res = await getSportLiveMatch(params)
  

  page.records = res.records || []
  page.total = res.total || 0
  page.pages = res.pages || 0
  page.current = res.current || 1
  page.loading = false
}

function changePage(event) {
    request.current = event.page + 1;
    request.size = event.rows;
    loadMatch();
}

function getSportDisplayName(sportId) {
  const found = uiControl.sport.find((item) => item.id === sportId)
  return found ? found.display : sportId
}

function hasStreamId(row) {
  // 判斷 streamId 是否有值且非空
  return !!(row && row.streamId)
}

function showDialog(row) {
  currentRow.value = row
  dialogVisible.value = true
}

function formatTime(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

async function handleCopy() {
  // 調用 API
  const res = await copySportLiveMatch({ matchId: currentRow.value.matchId })

  if (res.code === 0) {
    toast.add({
      severity: 'success',
      summary: t('fields.copySuccess'),
      life: 3000,
    })
    dialogVisible.value = false
  } else {
    toast.add({
      severity: 'error',
      summary: t('fields.copyFailed'),
    })
  }
}

async function handleDelete() {
  console.log(selectedRows)

  if (!selectedRows.value.length) {
    toast.add({
      severity: 'error',
      summary: t('fields.pleaseSelectMatch'),
    })
    return
  }
  try {
    await confirm.require({
      message: t('message.confirmDelete'),
      icon: 'pi pi-info-circle',
      rejectLabel: t('fields.cancel'),
      rejectProps: {
        label: t('fields.cancel'),
        severity: 'secondary',
      },
      acceptLabel: t('fields.confirm'),
      acceptProps: {
        label: t('fields.confirm'),
        severity: 'danger',
      },
      accept: async () => {
        try {
          const matchIds = selectedRows.value.map((row) => row.matchId)
          const res = await batchDeleteSportLiveMatch({ matchIds: matchIds })
          if (res.code === 0) {
            toast.add({
              severity: 'success',
              summary: t('fields.deleteSuccess'),
              life: 3000,
            })
          } else {
            toast.add({
              severity: 'success',
              summary: t('fields.deleteFailed'),
              life: 3000,
            })
          }
          loadMatch()
        } catch (err) {
          toast.add({
            severity: 'error',
            summary: t('message.deleteFailed'),
            detail: err.message,
          })
        }
      },
    })
  } catch {
    return
  }
}

onMounted(() => {
  loadMatch()
})
</script>

<style scoped>
.roles-main {
  overflow-x: auto;
  width: 99%;
}

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

.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.match-info-list {
  margin-bottom: 10px;
}
.match-info-row {
  display: flex;
  margin-bottom: 4px;
}
.match-info-row .label {
  min-width: 90px;
  color: #888;
  text-align: right;
  flex-shrink: 0;
}
.match-info-row .value {
  flex: 1;
  padding-left: 8px;
  word-break: break-all;
}
</style>
