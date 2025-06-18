<template>
  <div class="p-3 chat-history-page">
    <div class="flex gap-3 mb-4 align-items-center">
      <label for="stream-select" class="font-bold">直播流:</label>
      <Dropdown
        id="stream-select"
        v-model="selectedStreamId"
        :options="streamList"
        optionLabel="titleWithId"
        optionValue="id"
        placeholder="選擇串流"
        :filter="true"
        class="w-full md:w-20rem"
        @change="loadChatHistory"
      />
    </div>

    <DataTable :value="chatList" :loading="loading" class="p-datatable-sm" style="margin-top: 20px">
      <Column field="name" :header="'名稱'" style="width: 200px;" />
      <Column field="content" :header="'內容'" />
      <Column :header="'操作'" style="width: 220px;">
        <template #body="slotProps">
          <div class="p-button-group">
            <Button
              v-if="!slotProps.data.blocked"
              label="封鎖"
              icon="pi pi-ban"
              severity="danger"
              size="small"
              @click="showBlockDialog(slotProps.data.name)"
            />
            <template v-else>
              <Button
                label="延長封鎖"
                icon="pi pi-clock"
                severity="info"
                size="small"
                @click="showBlockDialog(slotProps.data.name)"
              />
              <Button
                label="解除封鎖"
                icon="pi pi-check"
                severity="success"
                size="small"
                @click="unblockUser(slotProps.data.name)"
              />
            </template>
          </div>
        </template>
      </Column>
    </DataTable>

    <Paginator
      v-if="page.total > 0"
      :rows="page.size"
      :totalRecords="page.total"
      :first="(page.current - 1) * page.size"
      @page="onPageChange"
      template="PrevPageLink CurrentPageReport NextPageLink"
      currentPageReportTemplate="{currentPage} of {totalPages}"
      class="mt-4 pagination"
    />

    <Dialog
      v-model:visible="dialog.visible"
      modal
      :style="{ width: '400px' }"
      :header="' '"
    >
      <div class="p-fluid">
        <div class="field">
          <label for="loginName" class="font-bold"> 登录名</label>
          <InputText id="loginName" v-model="dialog.form.loginName" disabled />
        </div>
        <div class="field">
          <label for="blockDuration" class="font-bold">封锁时间</label>
          <div class="grid">
            <div class="col-6">
              <InputNumber
                id="blockDuration"
                v-model="dialog.form.duration"
                :min="1"
                :max="unitMaxMap[dialog.form.unit] || 60"
                :useGrouping="false"
              />
            </div>
            <div class="col-6">
              <Dropdown
                v-model="dialog.form.unit"
                :options="durationUnits"
                optionLabel="label"
                optionValue="value"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          text
          severity="danger"
          @click="dialog.visible = false"
        />
        <Button
          label="確認"
          icon="pi pi-check"
          severity="primary"
          @click="submitBlock"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

import { DashboardService } from '@/service/DashboardService'

// PrimeVue Components
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { useToast } from 'primevue/usetoast'; // For notifications

const { t } = useI18n();
const toast = useToast(); // Initialize PrimeVue Toast

const streamList = ref([]);
const chatList = ref([]);
const selectedStreamId = ref(null);
const loading = ref(false);

const page = reactive({
  total: 0,
  current: 1, // PrimeVue Paginator uses 0-based first, but our logic here uses 1-based current page for `getChatHistory`
  size: 20
});

const dialog = reactive({
  visible: false,
  form: {
    loginName: '',
    duration: 10,
    unit: 'minute'
  }
});

const unitMaxMap = {
  minute: 60,
  hour: 24,
  day: 30,
  week: 4,
  month: 6
};

// Dropdown options for block duration unit
const durationUnits = ref([
  { label: '分鐘', value: 'minute' },
  { label: '小時', value: 'hour' },
  { label: '天', value: 'day' },
  { label: '週', value: 'week' },
  { label: '月', value: 'month' }
]);

async function loadStreams() {
  try {
    const res = await DashboardService.getStreamList();
    console.log(res)
    streamList.value = res.map(s => ({
      ...s,
      titleWithId: `${s.title} (${s.streamId})` // Create a combined label for the dropdown
    }));
    
  } catch (error) {
    console.error('Failed to load streams:', error);
    toast.add({ severity: 'error', summary: '錯誤', detail: '無法載入串流列表', life: 3000 });
  }
}

async function loadChatHistory() {
  if (!selectedStreamId.value) {
    chatList.value = [];
    page.total = 0;
    return;
  }
  loading.value = true;

  try {
    const query = new URLSearchParams({
      current: page.current,
      size: page.size
    });

    const res = await DashboardService.getChatHistory(`?${query.toString()}`, { streamId: selectedStreamId.value });
    console.log(res,'dan2')
    chatList.value = res.records;
    page.total = res.total;
  } catch (error) {
    console.error('Failed to load chat history:', error);
    toast.add({ severity: 'error', summary: '錯誤', detail: '無法載入聊天記錄', life: 3000 });
    chatList.value = [];
    page.total = 0;
  } finally {
    loading.value = false;
  }
}

// PrimeVue Paginator uses an event object with `page` and `rows`
function onPageChange(event) {
  // `event.page` is 0-based, convert to 1-based for your API
  page.current = event.page + 1;
  page.size = event.rows; // Update page size if it changed (though not directly used here)
  loadChatHistory();
}

function showBlockDialog(name) {
  dialog.form.loginName = name;
  dialog.form.duration = 10;
  dialog.form.unit = 'minute';
  dialog.visible = true;
}

async function submitBlock() {
  const blockTime = dayjs().add(dialog.form.duration, dialog.form.unit).format('YYYY-MM-DD HH:mm:ss');
  try {
    await DashboardService.blockUserApi({ loginName: dialog.form.loginName, blockTime });
    toast.add({ severity: 'success', summary: '成功', detail: t('成功'), life: 3000 });
    dialog.visible = false;
    loadChatHistory();
  } catch (error) {
    console.error('Block user failed:', error);
    toast.add({ severity: 'error', summary: '错误', detail: '封锁用户失败', life: 3000 });
  }
}

async function unblockUser(loginName) {
  try {
    await DashboardService.unblockUserApi({ loginName });
    toast.add({ severity: 'success', summary: '成功', detail: t('成功'), life: 3000 });
    loadChatHistory();
  } catch (error) {
    console.error('Unblock user failed:', error);
    toast.add({ severity: 'error', summary: '錯誤', detail: '解除封鎖失敗', life: 3000 });
  }
}

onMounted(() => {
  loadStreams();
});
</script>

<style scoped>
/* Basic styling for the page layout */
.chat-history-page {
  padding: 1rem;
}

/* Flex utilities from PrimeFlex (if you have it) */
.flex {
  display: flex;
}
.align-items-center {
  align-items: center;
}
.gap-3 {
  gap: 1rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
.w-full {
  width: 100%;
}
.md\:w-20rem {
  width: 20rem; /* Example width for medium screens */
}

/* PrimeVue specific overrides if needed (optional) */
/* .p-datatable-sm applies compact styling */
/* .p-button-group for grouping buttons */
/* .p-fluid for form field spacing within dialog */

/* Adjusting styles for the number input and dropdown within the grid */
.p-fluid .p-inputnumber,
.p-fluid .p-dropdown {
  width: 100%; /* Ensure they fill their column */
}

/* Adjust button group spacing */
.p-button-group .p-button {
  margin-right: 0.5rem; /* Small gap between buttons in the group */
}
.p-button-group .p-button:last-child {
  margin-right: 0;
}

/* Paginator alignment */
.pagination {
  display: flex;
  justify-content: flex-end; /* Align to the right */
}
</style>