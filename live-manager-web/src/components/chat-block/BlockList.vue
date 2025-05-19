<template>
  <div class="card">
    <Toast />
    <div class="p-grid" style="margin-bottom: 1rem; gap: 1rem; align-items: flex-end;">
      <div class="p-col" style="display: flex; gap: 0.5rem; align-items: center;">
        <label for="loginName">用戶名稱</label>
        <InputText v-model="form.loginName" placeholder="用戶名稱" />
        <label>禁言時長</label>
        <InputNumber v-model="form.duration" :min="1" :max="unitMaxMap[form.unit] || 60" inputStyle="width: 100px;" />
        <Dropdown
            v-model="form.unit"
            :options="unitOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="單位"
            style="width: 100px"
        />
      </div>

      <div class="p-col" style="display: flex; gap: 0.5rem;">
        <Button icon="pi pi-lock" label="禁言" @click="blockUser" />
        <Button icon="pi pi-refresh" label="重新整理" @click="loadBlockList" />
      </div>
    </div>

    <DataTable
        :value="blockList"
        :loading="loading"
        dataKey="loginName"
        :paginator="true"
        :rows="10"
        responsiveLayout="scroll"
    >
      <Column field="loginName" header="用戶名稱" />
      <Column field="blockTime" header="禁言至">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.blockTime) }}
        </template>
      </Column>
      <Column header="操作">
        <template #body="slotProps">
          <Button
              icon="pi pi-unlock"
              class="p-button-danger p-button-sm"
              label="解除禁言"
              @click="unblockUser(slotProps.data.loginName)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toast from 'primevue/toast';
import { DashboardService } from '@/service/DashboardService.js'

const { t } = useI18n();
const toast = useToast();

const form = reactive({
  loginName: '',
  duration: 10,
  unit: 'minute'
});

const unitOptions = [
  { label: '分', value: 'minute' },
  { label: '时', value: 'hour' },
  { label: '天', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' }
];

const unitMaxMap = {
  minute: 60,
  hour: 24,
  day: 30,
  week: 4,
  month: 6
};

const blockList = ref([]);
const loading = ref(false);

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

function loadBlockList() {
  loading.value = true;
  DashboardService.getBlockList().then(res => {
    blockList.value = res.data || [];
    loading.value = false;
  });
}

function blockUser() {
  if (!form.loginName || !form.duration || !form.unit) return;
  const blockTime = dayjs().add(form.duration, form.unit).format('YYYY-MM-DD HH:mm:ss');
  DashboardService.blockUserApi({ loginName: form.loginName, blockTime }).then(() => {
    toast.add({ severity: 'success', summary: '禁言成功', life: 3000 });
    loadBlockList();
  });
}

function unblockUser(loginName) {
  DashboardService.unblockUserApi({ loginName }).then(() => {
    toast.add({ severity: 'success', summary: '解除禁言成功', life: 3000 });
    loadBlockList();
  });
}

onMounted(() => {
  loadBlockList();
});
</script>

<style scoped>

</style>
