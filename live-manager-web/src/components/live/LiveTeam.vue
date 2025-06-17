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
          <Select
            v-model="request.sportType"
            :options="uiControl.sport"
            optionLabel="name"
            placeholder="体育项目"
            :size="'small'"
          />
          <InputText
            type="text"
            v-model="request.nameZh"
            optionLabel="队伍名称(英文)"
            placeholder="队伍名称(英文)"
          />
          <InputText
            type="text"
            v-model="request.nameEn"
            optionLabel="队伍名称(中文)"
            placeholder="队伍名称(中文)"
          />
          <Button label="搜索" :size="'small'" severity="success" icon="pi pi-search" />
          <Button
            label="重置"
            :size="'small'"
            severity="warn"
            icon="pi pi-refresh"
            @click="resetQuery"
          />
          <Button
            label="新增"
            :size="'small'"
            severity="info"
            icon="pi pi-plus"
            @click="resetQuery"
          />
        </div>
      </template>
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

      <Column field="liveStatus" header="赛事名称(英文)" sortable>
        <template #body="slotProps">
          {{ getLiveStatusDisplayName(slotProps.data.liveStatus) }}
        </template>
      </Column>

      
      <Column field="sportId" header="赛事名称(中文)" sortable>
        <template #body="slotProps">
          {{ getSportDisplayName(slotProps.data.sportId) }}
        </template>
      </Column>

      <Column field="liveStatus" header="队伍图标" sortable>
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
const { getSportLiveTeam } = DashboardService
const { t } = useI18n()

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  dialogLoading: false,
  sport: liveSportTyps,
  eventStatus: computed(() => [
    { name: '1', display: t('fields.active') },
    { name: '2', display: t('fields.inactive') },
  ]),
});
const request = reactive({
  size: 30,
  current: 1,
  sportType: null,
  nameZh: null,
  nameEn: null,
});

function resetQuery() {
  request.sportType = null;
  request.nameEn = null;
  request.nameZh = null;
}

async function loadTeam() {
  const params = new URLSearchParams(request).toString()

  console.log(params)
  const res = await getSportLiveTeam(params)
  console.log(res)
}


onMounted(() => {
  loadTeam()
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
