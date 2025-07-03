<template>
  <div class="p-3 chat-block-page">
    <div class="flex gap-3 mb-4 align-items-end">
      <div class="p-field">
        <label for="loginName" class="font-bold">{{ t('fields.loginName') }}</label>
        <InputText id="loginName" v-model="form.loginName" :placeholder="t('fields.loginName')" />
      </div>

      <div class="flex p-field">
        <label for="blockDuration" class="mr-2 font-bold">{{ t('fields.blockDuration') }}</label>
        <div class="flex gap-2 flex-grow-1 align-items-center">
          <InputNumber
            id="blockDuration"
            v-model="form.duration"
            :min="1"
            :max="unitMaxMap[form.unit] || 60"
            :useGrouping="false"
            class="flex-grow-1"
            style="padding-right: 8px;"
          />
          <Dropdown
            v-model="form.unit"
            :options="durationUnits"
            optionLabel="label"
            optionValue="value"
            class="w-8rem"
          />
        </div>
      </div>

      <Button
        :label="t('fields.block')"
        icon="pi pi-lock"
        severity="primary"
        @click="blockUser"
        class="p-button-sm"
      />
      <Button
        :label="t('fields.refresh')"
        icon="pi pi-refresh"
        severity="secondary"
        @click="loadBlockList"
        class="p-button-sm"
      />
    </div>
    <DataTable :value="blockList" :loading="loading" class="mt-4 p-datatable-sm">
      <Column field="loginName" :header="t('fields.loginName')" style="width: 200px;" />
      <Column :header="t('fields.blockDuration')" style="width: 250px;">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.blockTime) }}
        </template>
      </Column>
      <Column :header="t('fields.operate')">
        <template #body="slotProps">
          <Button
            :label="t('fields.unblock')"
            icon="pi pi-unlock"
            severity="danger"
            size="small"
            @click="unblockUser(slotProps.data.loginName)"
          />
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
      currentPageReportTemplate="{currentPage} / {totalPages}"
      class="mt-4 pagination"
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
  size: 10      // 每頁顯示幾筆資料
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
      current: page.current,
      size: page.size
    });

    // 呼叫 API 取得封鎖列表資料
    const res = await DashboardService.getBlockList(`?${query.toString()}`);
    blockList.value = res.data.records; // 把資料存起來
    console.log('dan', blockList.value, res.data)
    page.total = res.data.total;       // 更新總筆數
  } catch (error) {
    console.error('載入封鎖列表失敗:', error);
    toast.add({ severity: 'error', summary: '錯誤', detail: '無法載入封鎖列表', life: 3000 });
  } finally {
    loading.value = false; // 載入結束，關閉轉圈圈
  }
}

// 封鎖用戶的函式
async function blockUser() {
  // 檢查用戶名稱、時長、單位有沒有填
  if (!form.loginName || !form.duration || !form.unit) {
    toast.add({ severity: 'warn', summary: '警告', detail: '請填寫完整的封鎖資訊', life: 3000 });
    return;
  }

  // 計算封鎖結束時間
  const blockTime = dayjs().add(form.duration, form.unit).format('YYYY-MM-DD HH:mm:ss');

  try {
    // 呼叫 API 封鎖用戶
    await DashboardService.blockUserApiV1({ loginName: form.loginName, blockTime });
    toast.add({ severity: 'success', summary: '成功', detail: t('封鎖成功'), life: 3000 });
    form.loginName = ''; // 封鎖成功後清空用戶名稱輸入框
    loadBlockList();     // 重新載入封鎖列表，顯示最新狀態
  } catch (error) {
    console.error('封鎖用戶失敗:', error);
    toast.add({ severity: 'error', summary: '錯誤', detail: '封鎖用戶失敗，請稍後再試', life: 3000 });
  }
}

// 解除封鎖用戶的函式
async function unblockUser(loginName) {
  try {
    // 呼叫 API 解除封鎖
    await DashboardService.unblockUserApi({ loginName });
    toast.add({ severity: 'success', summary: '成功', detail: t('封鎖成功'), life: 3000 });
    loadBlockList(); // 重新載入封鎖列表，顯示最新狀態
  } catch (error) {
    console.error('解除封鎖用戶失敗:', error);
    toast.add({ severity: 'error', summary: '錯誤', detail: '解除封鎖用戶失敗，請稍後再試', life: 3000 });
  }
}

// 分頁器頁碼改變時觸發的函式
function onPageChange(event) {
  // PrimeVue 的分頁器頁碼從 0 開始，我們需要轉換成 1 開始的頁碼給後端
  page.current = event.page + 1;
  page.size = event.rows; // 雖然這裡固定為 10，但養成習慣還是更新一下
  loadBlockList(); // 重新載入封鎖列表
}

// 頁面載入時，自動執行這個函式
onMounted(() => {
  loadBlockList(); // 一進頁面就載入封鎖列表
});
</script>

<style scoped>
/* 頁面頂部的表單排版，使用 PrimeFlex 的 flex 屬性 */
.flex {
  display: flex;
}
.align-items-end {
  align-items: flex-end; /* 讓表單項底部對齊 */
}
.gap-3 {
  gap: 1rem; /* 項目間的間距 */
}
.mb-4 {
  margin-bottom: 1.5rem; /* 表單下方留白 */
}

/* 確保輸入框和下拉選單能好好填滿空間 */
.p-field {
  display: flex;
  flex-direction: column; /* 讓 label 和輸入框垂直排列 */
  flex-grow: 1; /* 讓每個欄位能平均分配空間 */
}
.p-field .p-inputtext,
.p-field .p-inputnumber,
.p-field .p-dropdown {
  width: 100%; /* 讓輸入框填滿其父容器 */
}

/* 調整特定元件的寬度 */
.w-8rem {
  width: 8rem; /* 下拉選單固定寬度 */
}
.flex-grow-1 {
  flex-grow: 1; /* 讓元素在 flex 容器中盡可能佔用空間 */
}

/* 表格上方和分頁器上方的間距 */
.mt-4 {
  margin-top: 1.5rem;
}

/* 分頁器靠右對齊 */
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>