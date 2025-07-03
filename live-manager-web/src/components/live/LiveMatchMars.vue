<!--TODO-->
<template>
  <div class="card">
    <ConfirmDialog></ConfirmDialog>
    <DataTable 
      :value="page.records" 
      :loading="page.loading" 
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
            optionValue="key"
            :placeholder="t('fields.sportType')"
            :size="'small'"
          />
          <Select
            v-model="request.status"
            :options="uiControl.status"
            optionLabel="display"
            optionValue="key"
            :placeholder="t('fields.status')"
            :size="'small'"
          />
          <InputText
            type="text"
            v-model="request.matchName"
            :optionLabel="t('fields.matchTitle')"
            :placeholder="t('fields.name')"
          />
          <InputText
            type="text"
            v-model="request.matchId"
            optionLabel="ID"
            :placeholder="t('fields.id')"
          />
          <Select
            v-model="request.supplierStreamUrl"
            :options="uiControl.isSupplierStreamUrlExist"
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
            @click="loadMatchMars"
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
            @click="handleDelete()"
          />
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="min-width: 10px;"></Column>
      <Column field="ID" :header="t('fields.id')" sortable style="min-width: 100px;">
        <template #body="slotProps">
          {{ slotProps.data.matchId }}
        </template>
      </Column>
      <Column field="sportType" :header="t('fields.sportType')" sortable style="min-width: 150px">
        <template #body="slotProps">
          {{ getSportDisplayName(slotProps.data.sportId) }}
        </template>
      </Column>

      <Column
        field="nameZh"
        :header="t('fields.competitionNameZh')"
        sortable
        style="min-width: 250px"
      >
        <template #body="slotProps">
          {{ slotProps.data.nameZh }}
        </template>
      </Column>

      <Column
        field="nameEn"
        :header="t('fields.competitionNameEn')"
        sortable
        style="min-width: 250px"
      >
        <template #body="slotProps">
          {{ slotProps.data.nameEn }}
        </template>
      </Column>

      <Column field="homeTeam" :header="t('fields.homeTeam')" sortable style="min-width: 200px">
        <template #body="slotProps">
          <Image
            v-if="slotProps.data.homeTeamLogo"
            :src="slotProps.data.homeTeamLogo"
            style="width: 24px; height: 24px; margin-right: 8px"
            preview
          />
          {{ slotProps.data.homeTeamNameZh || slotProps.data.homeTeamNameEn }}
        </template>
      </Column>

      <Column field="awayTeam" :header="t('fields.awayTeam')" sortable style="min-width: 200px">
        <template #body="slotProps">
          <Image
            v-if="slotProps.data.awayTeamLogo"
            :src="slotProps.data.awayTeamLogo"
            style="width: 24px; height: 24px; margin-right: 8px"
            preview
          />
          {{ slotProps.data.awayTeamNameZh || slotProps.data.awayTeamNameEn }}
        </template>
      </Column>
      <Column field="matchTime" :header="t('fields.matchTime')" sortable style="min-width: 200px">
        <template #body="slotProps">
          {{ formatTime(slotProps.data.matchTime) }}
        </template>
      </Column>
      <Column
        field="supplierStreamUrl"
        :header="t('fields.isCreateLiveUrl')"
        sortable
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <Tag v-if="slotProps.data.supplierStreamUrl !== null" severity="success" :value="t('fields.yes')"></Tag>
          <Tag v-else severity="danger" :value="t('fields.no')"></Tag>
        </template>
      </Column>
      <Column field="status" :header="t('fields.status')" sortable style="min-width: 100px">
        <template #body="slotProps">
          <Tag
            v-if="slotProps.data.status === 'upcoming'"
            severity="warning"
            :value="t('status.namiMatch.NOT_STARTED')"
          />
          <Tag
            v-else-if="slotProps.data.status === 'live'"
            severity="success"
            :value="t('status.namiMatch.ONGOING')"
          />
          <Tag
            v-else-if="slotProps.data.status === 'past'"
            severity="danger"
            :value="t('status.namiMatch.ENDED')"
          />
          <Tag
            v-else-if="slotProps.data.status === 'delete'"
            severity="danger"
            :value="t('status.namiMatch.DELETE')"
          />
          <Tag
            v-else-if="slotProps.data.status === 'cancel'"
            severity="warning"
            :value="t('status.namiMatch.CANCEL')"
          />
          <Tag
            v-else-if="slotProps.data.status === 'delayed'"
            severity="danger"
            :value="t('status.namiMatch.DELAYED')"
          />
          <Tag
            v-else-if="slotProps.data.status === 'abandoned'"
            severity="danger"
            :value="t('status.namiMatch.ABANDONED')"
          />
          <Tag
            v-else-if="slotProps.data.status === 'pending'"
            severity="danger"
            :value="t('status.namiMatch.PENDING')"
          />
          <Tag v-else severity="default" :value="t('status.namiMatch.OTHER')" />
        </template>
      </Column>
      <Column field="status" :header="t('fields.operate')" sortable style="min-width: 300px; display: flex; justify-content: center;">
        <template #body="slotProps">
          <Button
            icon="pi pi-refresh"
            :size="'small'"
            type="button"
            @click="refreshLiveUrl(slotProps.data.id)"
            style="margin-right: 8px"
          />
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
        <span class="value">{{ currentRow.nameZh || currentRow.nameEn }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.homeTeam') }}：</span>
        <span class="value">{{ currentRow.homeTeamNameZh || currentRow.homeTeamNameEn }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.homeTeam') }}ID：</span>
        <span class="value">{{ currentRow.homeTeamId }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.awayTeam') }}：</span>
        <span class="value">{{ currentRow.awayTeamNameZh || currentRow.awayTeamNameEn }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.awayTeam') }}ID：</span>
        <span class="value">{{ currentRow.awayTeamId }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.matchTime') }}：</span>
        <span class="value">{{ formatTime(currentRow.matchTime) }}</span>
      </div>
      <div class="match-info-row">
        <span class="label">{{ t('fields.status') }}：</span>
        <el-tag v-if="currentRow.status === 'upcoming'" type="warning">{{ t('status.namiMatch.NOT_STARTED') }}</el-tag>
        <el-tag v-else-if="currentRow.status === 'live'" type="success">{{ t('status.namiMatch.ONGOING') }}</el-tag>
        <el-tag v-else-if="currentRow.status === 'past'" type="danger">{{ t('status.namiMatch.ENDED') }}</el-tag>
        <el-tag v-else-if="currentRow.status === 'cancel'	" type="warning">{{ t('status.namiMatch.CANCEL') }}</el-tag>
        <el-tag v-else-if="currentRow.status === 'delayed'" type="danger">{{ t('status.namiMatch.DELAYED') }}</el-tag>
        <el-tag v-else-if="currentRow.status === 'abandoned'" type="danger">{{ t('status.namiMatch.ABANDONED') }}</el-tag>
        <el-tag v-else-if="currentRow.status === 'pending'" type="danger">{{ t('status.namiMatch.PENDING') }}</el-tag>
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
    
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { DashboardService } from '@/service/DashboardService'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable';
import dayjs from 'dayjs'
const { getSportLiveMatchMars, copySportLiveMatchMars, deleteSportLiveMatchMars, refreshToGetLiveUrl } = DashboardService
const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()

const uiControl = reactive({
  sport: [{ key: 1, display: "FOOTBALL", name: 'FOOTBALL' }, { key: 2, display: 'BASKETBALL', name: 'BASKETBALL' }],
  status: [
      { key: 'upcoming', display: t('status.marsMatch.NOT_STARTED'), name: 'upcoming' },
      { key: 'live', display: t('status.marsMatch.ONGOING'), name: 'live' },
      { key: 'past', display: t('status.marsMatch.ENDED'), name: 'past' },
      { key: 'pending', display: t('status.marsMatch.PENDING'), name: 'pending' },
      { key: 'cancel', display: t('status.marsMatch.CANCEL'), name: 'cancel' },
      { key: 'delayed', display: t('status.marsMatch.DELAYED'), name: 'delayed' },
      { key: 'delete', display: t('status.marsMatch.DELETE'), name: 'delete' },
      { key: 'abandoned', display: t('status.marsMatch.ABANDONED'), name: 'abandoned' }
  ],
  isSupplierStreamUrlExist: [
      { key: "yes", display: t('fields.yes'), name: "yes" },
      { key: "no", display: t('fields.no'), name: "no" }
  ],
})
const request = reactive({
  size: 30,
  current: 1,
  sportId: null,
  status: null,
  matchName: null,
  matchId: null,
  supplierStreamUrl: null,
  matchId: null,
  supplierStreamUrl: null,
  matchTime: [new Date(), new Date()]
})

function resetQuery() {
  request.sportId = null
  request.matchName = null
  request.status = null
  request.matchId = null
  request.supplierStreamUrl = null
  request.matchTime = [new Date(), new Date()]
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  current: 1,
  loading: false,
})

const dialogVisible = ref(false)
const currentRow = ref(null)
const formLive = reactive({
  matchId: null,
  sportId: null,
  status: null,
  title: null,
})
const selectedRows = ref()

async function loadMatchMars() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
      if (value) {
      query[key] = value;
      }
  });
  if (request.supplierStreamUrl !== null) {
      if (request.supplierStreamUrl === "yes") {
          query.supplierStreamUrl = true
      } else {
          query.supplierStreamUrl = false
      }
  }

  if (request.matchTime && request.matchTime.length === 2) {
      const [startTime, endTime] = request.matchTime;
      const formattedRange = [
      dayjs(startTime).format('YYYY-MM-DD 00:00:00'),
      dayjs(endTime).format('YYYY-MM-DD 23:59:59'),
      ].join(',');
      query.matchTime = formattedRange
  }
  const params = new URLSearchParams(query).toString()
  
  const res = await getSportLiveMatchMars(params)

  page.records = res.records || []
  page.total = res.total || 0
  page.pages = res.pages || 0
  page.current = res.current || 1
  page.loading = false
}

function getSportDisplayName(sportId) {
  const found = uiControl.sport.find((item) => item.key === sportId)
  return found ? found.display : sportId
}

function changePage(event) {
  request.current = event.page + 1;
  request.size = event.rows;
  loadMatchMars();
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
  formLive.matchId = currentRow.value.matchId
  formLive.sportId = currentRow.value.sportId
  switch (currentRow.value.status) {
    case 'upcoming':
      formLive.status = 1;
      break;
    case 'live':
      formLive.status = 2;
      break;
    case 'past':
      formLive.status = 3;
      break;
    case 'pending':
      formLive.status = 15;
      break;
    case 'cancel':
      formLive.status = 12;
      break;
    default:
      formLive.status = 1;
      break;
  }
  formLive.title = currentRow.value.nameZh || currentRow.value.nameEn
  const res = await copySportLiveMatchMars(formLive)

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

async function refreshLiveUrl(id){
  console.log("id : ", id)
  const ret = await refreshToGetLiveUrl(id);

  if (ret.code === 0) {
    toast.add({
      severity: 'success',
      summary: t('fields.successGetUrl'),
      life: 3000,
    })
    dialogVisible.value = false
  } else {
    toast.add({
      severity: 'error',
      summary: t('fields.failedGetUrl'),
    })
  }
  loadMatchMars()
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
          console.log("selectedRows", selectedRows.value)
          const ids = selectedRows.value.map((row) => row.id)
          console.log("ids : ", ids)
          const res = await deleteSportLiveMatchMars(ids)
          console.log("res", res)
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
          loadMatchMars()
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
  loadMatchMars()
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
