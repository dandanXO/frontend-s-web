<template>
  <div class="roles-main">
    <ConfirmDialog></ConfirmDialog>
    <div class="header-container">
      <div class="search">
        <Button
          :label="t('fields.search')"
          icon="pi pi-search"
          class="p-button-sm"
          @click="loadList()"
        />
        <Button
          :label="t('fields.add')"
          icon="pi pi-plus"
          class="p-button-sm p-button-primary"
          @click="showDialog('CREATE')"
        />
      </div>
    </div>

    <Dialog
      :header="ui.dialogTitle"
      v-model:visible="ui.dialogVisible"
      modal
      class="p-dialog-md"
      appendTo="body"
    >
      <template #default>
        <form @submit.prevent="submit" class="p-fluid">
          <div class="p-field">
            <label for="sensitiveWord">{{ t('fields.sensitiveWord') }}</label>
            <InputText
              id="sensitiveWord"
              v-model="form.word"
              :class="{ 'p-invalid': validationErrors.word }"
              maxlength="255"
              show-word-limit
            />
            <small class="p-error" v-if="validationErrors.word">{{ validationErrors.word }}</small>
          </div>
        </form>
      </template>
      <template #footer>
        <Button
          :label="t('fields.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="ui.dialogVisible = false"
        />
        <Button
          :label="t('fields.confirm')"
          icon="pi pi-check"
          autofocus
          @click="submit"
        />
      </template>
    </Dialog>

    <DataTable
      :value="page.records"
      :loading="page.loading"
      stripedRows
      responsiveLayout="scroll"
      class="p-datatable-sm p-mt-2"
    >
      <Column field="id" header="ID" style="width: 100px" />
      <Column field="word" :header="t('fields.sensitiveWord')" />
      <Column field="createTime" :header="t('fields.createTime')" style="width: 180px">
        <template #body="slotProps">
          <span v-if="slotProps.data.createTime === null">-</span>
          <span v-else>
            {{ new Date(slotProps.data.createTime).toLocaleString() }}
          </span>
        </template>
      </Column>
      <Column field="createBy" :header="t('fields.createBy')" style="width: 120px" />
      <Column :header="t('fields.operate')" style="width: 200px; text-align: right">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-sm p-button-warning p-mr-2"
            :label="t('fields.edit')"
            @click="showDialog('EDIT', slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-sm p-button-danger"
            :label="t('fields.delete')"
            @click="confirmDelete(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>

    <Paginator
      :rows="request.size"
      :totalRecords="page.total"
      :rowsPerPageOptions="[10, 20, 50]"
      v-model:first="request.current"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      @page="changePage"
      class="p-mt-2"
    />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref, reactive, onMounted } from 'vue';
// import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

// PrimeVue Components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import Toast from 'primevue/toast'; // You'll need to include ToastService in your main.js

// import { getSensitiveWord, addSensitiveWord, updateSensitiveWord, deleteSensitiveWord } from '@/api/sport-live-sensitive-word';
import { DashboardService } from '@/service/DashboardService.js'

const { t } = useI18n();
// const store = useStore();
const confirm = useConfirm();
const toast = useToast();

const request = reactive({
  siteId: '',
  size: 10,
  current: 0 // PrimeVue Paginator uses 0-based index for 'first'
});

const page = reactive({
  total: 0,
  records: [],
  loading: false
});

const form = reactive({
  id: null,
  word: ''
});

const ui = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE'
});

const validationErrors = reactive({
  word: null
});

async function loadList() {
  page.loading = true;
  request.siteId = 7; // Assuming siteId 0 for initial load
  try {
    const res = await DashboardService.getSensitiveWordNew({ siteId: request.siteId, size: request.size, current: request.current + 1 }); // Adjust for 1-based API
    page.records = res.data.records;
    page.total = res.data.total;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('message.loadFailed'), life: 3000 });
  } finally {
    page.loading = false;
  }
}

onMounted(async () => {
  await loadList();
});

function showDialog(type, row = null) {
  ui.dialogType = type;
  ui.dialogVisible = true;
  validationErrors.word = null; // Clear previous validation errors

  if (type === 'EDIT' && row) {
    ui.dialogTitle = t('fields.editSensitiveWord'); // Assuming you have this translation
    form.id = row.id;
    form.word = row.word;
  } else {
    ui.dialogTitle = t('fields.addSensitiveWord'); // Assuming you have this translation
    form.id = null;
    form.word = '';
  }
}

async function submit() {
  // Manual validation for the word field
  validationErrors.word = null;
  if (!form.word) {
    validationErrors.word = t('message.inputSensitiveWords');
    return;
  }

  const payload = { siteId: 7, word: form.word };
  try {
    if (ui.dialogType === 'EDIT') {
      payload.id = form.id;
      await DashboardService.updateSensitiveWordNew(payload);
      toast.add({ severity: 'success', summary: 'Success', detail: t('message.updateSuccess'), life: 3000 });
    } else {
      await DashboardService.addSensitiveWordNew(payload);
      toast.add({ severity: 'success', summary: 'Success', detail: t('message.addSuccess'), life: 3000 });
    }
    ui.dialogVisible = false;
    await loadList();
  } catch (error) {
    console.log(error)
    toast.add({ severity: 'error', summary: 'Error', detail: t('message.operationFailed'), life: 3000 });
  }
}

function confirmDelete(id) {
  confirm.require({
    message: t('message.confirmDelete'),
    header: t('fields.deleteConfirmation'), // Assuming you have this translation
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await DashboardService.deleteSensitiveWordNew({ siteId: 7, id: id });
        toast.add({ severity: 'success', summary: 'Success', detail: t('message.deleteSuccess'), life: 3000 });
        await loadList();
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: t('message.deleteFailed'), life: 3000 });
      }
    },
    reject: () => {
      // Callback to execute when user rejects the confirmation
    }
  });
}

function changePage(event) {
  request.current = event.first; // PrimeVue Paginator returns 'first' which is the 0-based index of the first row
  request.size = event.rows;
  loadList();
}
</script>

<style scoped>
.roles-main {
  padding: 20px;
}

.header-container {
  display: flex;
  justify-content: flex-end; /* Align to right for search and add buttons */
  margin-bottom: 10px;
}

.search .p-button {
  margin-left: 10px; /* Spacing between buttons */
}

/* PrimeVue P-field for form items */
.p-field {
  margin-bottom: 1rem;
}

.p-dialog-md {
  width: 700px; /* Equivalent to Element Plus width */
}
</style>