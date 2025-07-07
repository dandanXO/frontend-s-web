<template>
  <div class="card">
    <div>
      <label for="loginName" style="margin-right: 10px;">{{ t('fields.loginName') }}</label>
      <InputText v-model="form.loginName" :placeholder="t('fields.loginName')" style="margin-right: 10px;" />

      <label style="margin-right: 10px;">{{ t('fields.blockDuration') }}</label>
      <InputNumber v-model="form.duration" :min="1" :max="unitMaxMap[form.unit] || 60" inputStyle="width: 100px;" style="margin-right: 10px;" />
      <Dropdown
            v-model="form.unit"
            :options="durationUnits"
            optionLabel="label"
            optionValue="value"
            style="width: 100px; margin-right: 10px;"
        />

      <Button icon="pi pi-lock" :label="t('fields.block')" @click="blockUser" style="margin-right: 10px;" />
      <Button icon="pi pi-refresh" :label="t('fields.refresh')" severity="warn" @click="loadBlockList" />
    </div>

    <DataTable
        :value="blockList"
        :loading="loading"
        dataKey="loginName"
        responsiveLayout="scroll"
    >
      <Column field="loginName" :header="t('fields.loginName')" />
      <Column field="blockDuration" :header="t('fields.blockDuration')">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.blockTime) }}
        </template>
      </Column>
      <Column :header="t('fields.operate')">
        <template #body="slotProps">
          <Button
              icon="pi pi-unlock"
              class="p-button-danger p-button-sm"
              :label="t('fields.unblock')"
              @click="unblockUser(slotProps.data.loginName)"
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import dayjs from 'dayjs'; // 處理日期的函式庫
import { useI18n } from 'vue-i18n'; // 多國語系工具

// 從 PrimeVue 載入我們需要的元件
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import { useToast } from 'primevue/usetoast'; // 用來顯示成功或失敗訊息


import { DashboardService } from '@/service/DashboardService'

const { t } = useI18n(); // 啟用多國語系翻譯
const toast = useToast(); // 初始化 PrimeVue 的訊息提示功能

const request = reactive({
  size: 30,
  current: 1,
})

// 用來輸入封鎖資訊的表單資料
const form = reactive({
  loginName: '',   // 要封鎖的用戶名稱
  duration: 10,    // 封鎖時長，預設 10
  unit: 'minute'   // 封鎖單位，預設分鐘
});

// 不同封鎖單位對應的最大時長
const unitMaxMap = {
  minute: 60,
  hour: 24,
  day: 30,
  week: 4,
  month: 6
};

// 封鎖單位下拉選單的選項
const durationUnits = ref([
  { label: '分鐘', value: 'minute' },
  { label: '小時', value: 'hour' },
  { label: '天', value: 'day' },
  { label: '週', value: 'week' },
  { label: '月', value: 'month' }
]);

// 被封鎖用戶的列表資料
const blockList = ref([]);
// 控制表格是否顯示載入中動畫
const loading = ref(false);

// 分頁器的相關資訊
const page = reactive({
  total: 0,     // 總共有多少筆資料
  current: 1,   // 目前在第幾頁 (從 1 開始)
  size: 30      // 每頁顯示幾筆資料
});

// 格式化日期時間的函式
function formatDate(date) {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

// 載入被封鎖用戶列表的函式
async function loadBlockList() {
  loading.value = true; // 開始載入，顯示轉圈圈

  try {
    // 準備好傳給後端的查詢參數
    const query = new URLSearchParams({
      current: request.current,
      size: request.size
    });

    // 呼叫 API 取得封鎖列表資料
    const res = await DashboardService.getBlockList(`?${query.toString()}`);
    blockList.value = res.data.records; // 把資料存起來
    console.log('dan', blockList.value, res.data)
    page.total = res.data.total;       // 更新總筆數
  } catch (error) {
    console.error('載入封鎖列表失敗:', error);
    toast.add({ severity: 'error', summary: 'error', detail: t('fields.unableLoadBlockList'), life: 3000 });
  } finally {
    loading.value = false; // 載入結束，關閉轉圈圈
  }
}

// 封鎖用戶的函式
async function blockUser() {
  // 檢查用戶名稱、時長、單位有沒有填
  if (!form.loginName || !form.duration || !form.unit) {
    toast.add({ severity: 'warn', summary: 'warn', detail: t('message.validateBlockReasonRequired'), life: 3000 });
    return;
  }

  // 計算封鎖結束時間
  const blockTime = dayjs().add(form.duration, form.unit).format('YYYY-MM-DD HH:mm:ss');

  try {
    // 呼叫 API 封鎖用戶
    await DashboardService.blockUserApiV1({ loginName: form.loginName, blockTime });
    toast.add({ severity: 'success', summary: 'success', detail: t('fields.blockSuccess'), life: 3000 });
    form.loginName = ''; // 封鎖成功後清空用戶名稱輸入框
    loadBlockList();     // 重新載入封鎖列表，顯示最新狀態
  } catch (error) {
    console.error('封鎖用戶失敗:', error);
    toast.add({ severity: 'error', summary: 'error', detail: t('fields.blockFailed'), life: 3000 });
  }
}

// 解除封鎖用戶的函式
async function unblockUser(loginName) {
  try {
    // 呼叫 API 解除封鎖
    await DashboardService.unblockUserApi({ loginName });
    toast.add({ severity: 'success', summary: 'success', detail: t('fields.unblockSuccess'), life: 3000 });
    loadBlockList(); // 重新載入封鎖列表，顯示最新狀態
  } catch (error) {
    console.error('解除封鎖用戶失敗:', error);
    toast.add({ severity: 'error', summary: 'error', detail: t('fields.unblockFailed'), life: 3000 });
  }
}

function changePage(event) {
  request.current = event.page + 1;
  request.size = event.rows;
  loadBlockList();
}

// 頁面載入時，自動執行這個函式
onMounted(() => {
  loadBlockList(); // 一進頁面就載入封鎖列表
});
</script>

<style scoped>

</style>
