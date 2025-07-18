<template>
  <div class="p-3 vip-status-main">
    <div class="flex mb-3 justify-content-start">
      <Button
        :label="t('fields.refresh')"
        icon="pi pi-refresh"
        severity="primary"
        @click="loadVipStatus"
        size="small"
      />
    </div>

    <DataTable
      :value="vipStatusList"
      :loading="loading"
      dataKey="id"
      class="p-datatable-sm"
    >
      <Column field="name" :header="t('fields.name')" />
      <Column :header="t('fields.status')" style="width: 100px; text-align: center;">
        <template #body="slotProps">
          <InputSwitch
            v-model="slotProps.data.status"
            :trueValue="1"
            :falseValue="0"
            @change="() => toggleStatus(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // 引入 Vue 3 響應式和生命週期功能
import { useI18n } from 'vue-i18n'; // 引入多國語系工具

// 引入 PrimeVue 元件
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch'; // PrimeVue 的開關按鈕元件
import { useToast } from 'primevue/usetoast'; // PrimeVue 的訊息提示工具

// 引入和後端溝通的 API 函式
// import { getChatVipStatus, updateChatVipStatus } from '@/api/sport-live-chat';
import { DashboardService } from '@/service/DashboardService'

const { t } = useI18n(); // 啟用多國語系翻譯
const toast = useToast(); // 初始化 PrimeVue 訊息提示功能

const vipStatusList = ref([]); // 儲存 VIP 狀態列表的資料
const loading = ref(false); // 控制表格載入狀態，決定是否顯示載入動畫

/**
 * 載入 VIP 狀態列表。
 * 會顯示載入動畫，並處理 API 呼叫的成功與失敗。
 */
async function loadVipStatus() {
  loading.value = true; // 設定載入中為 true，顯示載入動畫
  try {
    // 呼叫 API 取得 VIP 狀態資料
    // 假設 getChatVipStatus 會直接返回資料陣列，如果不是請調整
    const res = await DashboardService.getChatVipStatus({});
    vipStatusList.value = res || [];
  } catch (error) {
    console.error('載入 VIP 狀態失敗:', error); // 在控制台印出錯誤
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: t('message.failedToLoad'), // 顯示多國語系的載入失敗訊息
      life: 3000 // 訊息顯示 3 秒
    });
  } finally {
    loading.value = false; // 無論成功或失敗，都關閉載入動畫
  }
}

/**
 * 切換單個 VIP 的狀態。
 * 會呼叫更新 API，並在成功或失敗後給予提示。
 * 如果更新失敗，會將開關狀態恢復。
 * @param {object} row - 當前被操作的 VIP 資料行
 */
async function toggleStatus(row) {
  try {
    // 呼叫 API 更新 VIP 狀態，傳入整行資料
    await DashboardService.updateChatVipStatus(row);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: t('message.updateSuccess'), // 顯示多國語系的更新成功訊息
      life: 3000
    });
  } catch (error) {
    console.error('更新 VIP 狀態失敗:', error);
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: t('message.updateFailed'), // 顯示多國語系的更新失敗訊息
      life: 3000
    });
    // 如果更新失敗，將開關狀態恢復到操作前的值
    row.status = row.status === 1 ? 0 : 1;
  }
}

// 頁面元件掛載後，立即載入 VIP 狀態列表
onMounted(() => {
  loadVipStatus();
});
</script>

---

<style scoped>
/* 使用 PrimeFlex 樣式來簡化排版 */
.flex {
  display: flex; /* 讓內容水平排列 */
}
.justify-content-start {
  justify-content: flex-start; /* 讓內容靠左對齊 */
}
.mb-3 {
  margin-bottom: 1rem; /* 讓下方有 1rem 的間距 */
}
</style>