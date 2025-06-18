<template>
  <div class="roles-main">
    <ConfirmDialog></ConfirmDialog>

    <DataTable :value="page.records" :loading="page.loading" responsiveLayout="scroll">


     <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <Dropdown
            v-model="request.sportId"
            :options="uiControl.sport"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('fields.sportType')"
            :showClear="true"
            class="p-inputtext-sm"
          />
          <Dropdown
            v-model="request.liveStatus"
            :options="uiControl.liveStatus"
            optionLabel="display"
            optionValue="id"
            :placeholder="t('fields.tfEventStatusName')"
            :showClear="true"
            class="p-inputtext-sm"
          />
          <InputText
            v-model="request.title"
            :placeholder="t('fields.eventName')"
            class="p-inputtext-sm"
            style="width: 180px"
          />

          <DatePicker
            id="eventStartTime"
            v-model="uiControl.eventStartTime"
            showTime
            :showSeconds="true"
            hourFormat="24"
            dateFormat="yy-mm-dd"
            fluid
          />
          <DatePicker
            id="eventEndTime"
            v-model="uiControl.eventEndTime"
            showTime
            :showSeconds="true"
            hourFormat="24"
            dateFormat="yy-mm-dd"
            fluid
            placeholder="請選擇結束時間" />
          
          <Button
            :label="t('fields.search')"
            :size="'small'"
            severity="success"
            icon="pi pi-search"
            @click="loadList"
          />
          <Button
            :label="t('fields.reset')"
            :size="'small'"
            severity="warn"
            icon="pi pi-refresh"
            @click="resetQuery"
          />
          <Button
            :label="t('fields.add')"
            :size="'small'"
            severity="info"
            icon="pi pi-plus"
            @click="showDialog('CREATE')"
          />
        </div>
      </template>


      <Column field="id" :header="t('fields.platformMatchId')" />
      <Column field="sportId" :header="t('fields.sportType')" >
        <template #body="slotProps">
          {{ formatSportType(slotProps.data) }}
        </template>
      </Column>
      <Column field="title" :header="t('fields.title')" />
      <Column field="homeNameZh" :header="t('fields.homeTeam')" >
        <template #body="slotProps">
          <div style="display: flex; align-items: center">
            <img
              v-if="slotProps.data.homeIcon"
              :src="slotProps.data.homeIcon?.startsWith('http') ? slotProps.data.homeIcon : promoDir + slotProps.data.homeIcon"
              style="width: 20px; height: 20px; margin-right: 10px"
            />
            <span>{{ slotProps.data.homeNameZh || slotProps.data.homeName }}</span>
          </div>
        </template>
      </Column>
      <Column field="awayNameZh" :header="t('fields.awayTeam')" >
        <template #body="slotProps">
          <div style="display: flex; align-items: center">
            <img
              v-if="slotProps.data.awayIcon"
              :src="slotProps.data.awayIcon?.startsWith('http') ? slotProps.data.awayIcon : promoDir + slotProps.data.awayIcon"
              style="width: 20px; height: 20px; margin-right: 10px"
            />
            <span>{{ slotProps.data.awayNameZh || slotProps.data.awayName }}</span>
          </div>
        </template>
      </Column>
      <Column field="cover" :header="t('fields.cover')" >
        <template #body="slotProps">
          <div style="display: flex; align-items: center">
            <img
              v-if="slotProps.data.cover"
              :src="promoDir2 + slotProps.data.cover"
              style="width: 20px; height: 20px; margin-right: 10px"
            />
          </div>
        </template>
      </Column>
      <Column field="sort" :header="t('fields.sequence')" />
      <Column field="liveStatus" :header="t('fields.status')" >
        <template #body="slotProps">
          <Tag v-if="slotProps.data.liveStatus === 2" severity="success">{{ t('status.uefaMatch.ENDED') }}</Tag>
          <Tag v-else-if="slotProps.data.liveStatus === 1" severity="warning">{{ t('status.uefaMatch.ONGOING') }}</Tag>
          <Tag v-else-if="slotProps.data.liveStatus === 3" severity="danger">{{ t('status.uefaMatch.CANCEL') }}</Tag>
          <Tag v-else severity="info">{{ t('status.uefaMatch.PENDING') }}</Tag>
        </template>
      </Column>
      <Column field="eventStartTime" :header="t('fields.matchTime')" >
        <template #body="slotProps">
          <span v-if="!slotProps.data.eventStartTime">-</span>
          <span v-else>{{ formatTime(slotProps.data.eventStartTime) }}</span>
        </template>
      </Column>
      <Column field="eventEndTime" :header="t('fields.endTime')" >
        <template #body="slotProps">
          <span v-if="!slotProps.data.eventEndTime">-</span>
          <span v-else>{{ formatTime(slotProps.data.eventEndTime) }}</span>
        </template>
      </Column>
      <Column field="isTest" :header="t('fields.isTestEvent')" >
        <template #body="slotProps">
          <Tag :severity="slotProps.data.isTest ? 'success' : 'info'">
            {{ slotProps.data.isTest ? t('fields.yes') : t('fields.no') }}
          </Tag>
        </template>
      </Column>
      <Column field="isPopular" :header="t('fields.isPopularEvent')" >
        <template #body="slotProps">
          <Tag :severity="slotProps.data.isPopular ? 'success' : 'info'">
            {{ slotProps.data.isPopular ? t('fields.yes') : t('fields.no') }}
          </Tag>
        </template>
      </Column>
      <Column field="eventCode" :header="t('fields.eventCode')"  />
      <Column field="createTime" :header="t('fields.createTime')">
        <template #body="slotProps">
          <span v-if="!slotProps.data.createTime">-</span>
          <span v-else>{{ formatTime(slotProps.data.createTime) }}</span>
        </template>
      </Column>
      <Column field="createBy" :header="t('fields.createBy')"  />
      <Column field="updateTime" :header="t('fields.updateTime')">
        <template #body="slotProps">
          <span v-if="!slotProps.data.updateTime">-</span>
          <span v-else>{{ formatTime(slotProps.data.updateTime) }}</span>
        </template>
      </Column>
      <Column field="updateBy" :header="t('fields.updateBy')"  />
      <Column :header="t('fields.operate')">
        <template #body="slotProps">
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="confirmDelete(slotProps.data.id)">
            {{ t('fields.delete') }}
          </Button>
          <router-link
            :to="{
          path: '/live-sport/live-setting',
          query: { id: slotProps.data.id },
        }"
          >
            <Button icon="pi pi-video" class="p-button-text p-button-sm p-button-success">
              {{ t('fields.manageStream') }}
            </Button>
          </router-link>
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

    <Dialog
      :header="ui.dialogTitle"
      v-model:visible="ui.dialogVisible"
      modal
      class="p-dialog-md"
      appendTo="body"
    >
      <form @submit.prevent="submit" class="p-fluid">
        <!-- Sport Type -->
        <div class="p-field">
          <label :for="t('fields.sportType')">{{ t('fields.sportType') }}</label>
          <Dropdown
            v-model="form.sportId"
            :options="uiControl.sport"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('fields.sportType')"
            class="w-full"
            :class="{ 'p-invalid': validationErrors.sportId }"
            filter
          />
          <small class="p-error" v-if="validationErrors.sportId">{{ validationErrors.sportId }}</small>
        </div>

        <!-- Title -->
        <div class="p-field">
          <label :for="t('fields.title')">{{ t('fields.title') }}</label>
          <InputText
            id="title"
            v-model="form.title"
            :class="{ 'p-invalid': validationErrors.title }"
            maxlength="100"
          />
          <small class="p-error" v-if="validationErrors.title">{{ validationErrors.title }}</small>
        </div>

        <!-- Home Team -->
        <div class="p-field">
          <label :for="t('fields.homeTeam')">{{ t('fields.homeTeam') }}</label>
          <AutoComplete
            v-model="form.homeId"
            :suggestions="displayTeams"
            @complete="searchTeams"
            field="nameZh"
            :placeholder="t('fields.homeTeam')"
            :dropdown="true"
            :forceSelection="false"
            :allow-create="true"
            @item-select="val => { form.homeId = val.value.id; form.homeName = val.value.nameZh; afterTeamSelectorChanged(); }"
            @change="val => { if (typeof val.value === 'string') { form.homeId = null; form.homeName = val.value; } else if (val.value) { form.homeId = val.value.id; form.homeName = val.value.nameZh; } else { form.homeId = null; form.homeName = ''; } afterTeamSelectorChanged(); }"
            @focus="loadEventWithSite(form.sportId, 'home')"
            :class="{ 'p-invalid': validationErrors.homeId }"
          >
            <template #option="slotProps">
              <div style="display: flex; align-items: center">
                <img
                  :src="
                    slotProps.option.icon?.startsWith('http://') ||
                      slotProps.option.icon?.startsWith('https://')
                      ? slotProps.option.icon
                      : promoDir + slotProps.option.icon
                  "
                  style="width: 20px; height: 20px; margin-right: 10px"
                >
                <span>{{ slotProps.option.nameZh }}</span>
              </div>
            </template>
            <template #footer v-if="teamSelectorStatus === 'home'">
              <div ref="teamSelectorBottomRef" />
            </template>
          </AutoComplete>
          <small class="p-error" v-if="validationErrors.homeId">{{ validationErrors.homeId }}</small>
        </div>

        <!-- Away Team -->
        <div class="p-field">
          <label :for="t('fields.awayTeam')">{{ t('fields.awayTeam') }}</label>
          <AutoComplete
            v-model="form.awayId"
            :suggestions="displayTeams"
            @complete="searchTeams"
            field="nameZh"
            :placeholder="t('fields.awayTeam')"
            :dropdown="true"
            :forceSelection="false"
            :allow-create="true"
            @item-select="val => { form.awayId = val.value.id; form.awayName = val.value.nameZh; afterTeamSelectorChanged(); }"
            @change="val => { if (typeof val.value === 'string') { form.awayId = null; form.awayName = val.value; } else if (val.value) { form.awayId = val.value.id; form.awayName = val.value.nameZh; } else { form.awayId = null; form.awayName = ''; } afterTeamSelectorChanged(); }"
            @focus="loadEventWithSite(form.sportId, 'away')"
            :class="{ 'p-invalid': validationErrors.awayId }"
          >
            <template #option="slotProps">
              <div style="display: flex; align-items: center">
                <img
                  :src="
                    slotProps.option.icon?.startsWith('http://') ||
                      slotProps.option.icon?.startsWith('https://')
                      ? slotProps.option.icon
                      : promoDir + slotProps.option.icon
                  "
                  style="width: 20px; height: 20px; margin-right: 10px"
                >
                <span>{{ slotProps.option.nameZh }}</span>
              </div>
            </template>
            <template #footer v-if="teamSelectorStatus === 'away'">
              <div ref="teamSelectorBottomRef" />
            </template>
          </AutoComplete>
          <small class="p-error" v-if="validationErrors.awayId">{{ validationErrors.awayId }}</small>
        </div>

        <!-- Sequence -->
        <div class="p-field">
          <label :for="t('fields.sequence')">{{ t('fields.sequence') }}</label>
          <InputNumber
            id="sequence"
            v-model.number="form.sort"
            :min="0"
            mode="decimal"
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-secondary"
            incrementButtonClassName="p-button-secondary"
            :class="{ 'p-invalid': validationErrors.sort }"
            @keypress="restrictInput($event)"
          />
          <small class="p-error" v-if="validationErrors.sort">{{ validationErrors.sort }}</small>
        </div>

        <!-- Match Time -->
        <div class="p-field">
          <label :for="t('fields.matchTime')">{{ t('fields.matchTime') }}</label>
          <Calendar
            v-model="uiForm.eventStartTime"
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
            :showSeconds="true"
            :class="{ 'p-invalid': validationErrors.eventStartTime }"
          />
          <small class="p-error" v-if="validationErrors.eventStartTime">{{ validationErrors.eventStartTime }}</small>
        </div>

        <!-- End Time -->
        <div class="p-field">
          <label :for="t('fields.endTime')">{{ t('fields.endTime') }}</label>
          <Calendar
            v-model="uiForm.eventEndTime"
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
            :showSeconds="true"
            :class="{ 'p-invalid': validationErrors.eventEndTime }"
          />
          <small class="p-error" v-if="validationErrors.eventEndTime">{{ validationErrors.eventEndTime }}</small>
        </div>

        <!-- Status -->
        <div class="p-field">
          <label :for="t('fields.status')">{{ t('fields.status') }}</label>
          <Dropdown
            v-model="form.liveStatus"
            :options="uiControl.liveStatus"
            optionLabel="display"
            optionValue="id"
            :placeholder="t('fields.status')"
            class="w-full"
            :class="{ 'p-invalid': validationErrors.liveStatus }"
          />
          <small class="p-error" v-if="validationErrors.liveStatus">{{ validationErrors.liveStatus }}</small>
        </div>

        <!-- Is Test Event -->
        <div class="p-field flex align-items-center">
          <label :for="t('fields.isTestEvent')" class="mr-3">{{ t('fields.isTestEvent') }}</label>
          <InputSwitch v-model="form.isTest" />
          <span class="ml-2">{{ form.isTest ? t('fields.yes') : t('fields.no') }}</span>
          <small class="p-error" v-if="validationErrors.isTest">{{ validationErrors.isTest }}</small>
        </div>

        <!-- Is Popular Event -->
        <div class="p-field flex align-items-center">
          <label :for="t('fields.isPopularEvent')" class="mr-3">{{ t('fields.isPopularEvent') }}</label>
          <InputSwitch v-model="form.isPopular" />
          <span class="ml-2">{{ form.isPopular ? t('fields.yes') : t('fields.no') }}</span>
          <small class="p-error" v-if="validationErrors.isPopular">{{ validationErrors.isPopular }}</small>
        </div>

        <!-- Cover -->
        <div class="p-field">
          <label :for="t('fields.cover')">{{ t('fields.cover') }}</label>
          <div class="flex flex-column">
            <Image
              v-if="form.cover"
              :src="`${promoDir2}/live/event/${store.state.user.siteId}/` + form.cover"
              alt="Cover Image"
              width="150"
              preview
              class="border-1 border-round surface-border"
              style="max-width: 150px; max-height: 100px; object-fit: contain;"
            />
            <input
              type="file"
              accept="image/*"
              @change="attachImage"
              class="mt-3"
            >
          </div>
          <small class="p-error" v-if="validationErrors.cover">{{ validationErrors.cover }}</small>
        </div>

      </form>
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
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { liveSportTyps } from '@/utils/live.js';
import { DashboardService } from '@/service/DashboardService.js'
import dayjs from 'dayjs'
import { ref, reactive, onMounted, watch } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import DatePicker from 'primevue/datepicker';


const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();

const getStartOfDayDate = (date) => {
  return dayjs(date).startOf('day').toDate();
};
const getEndOfDayDate = (date) => {
  return dayjs(date).endOf('day').toDate();
};
const formatToStartOfDayString = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};
const uiControl = reactive({
  //dialogVisible: false,
  //dialogTitle: '',
  //dialogType: 'CREATE',
  //removeBtn: true,
  //dialogLoading: false,
  eventStartTime:  getStartOfDayDate(new Date()),
  eventEndTime: getEndOfDayDate(new Date()),
  sport: liveSportTyps,
  liveStatus: [
    {
      name: '1',
      display: t('status.uefaMatch.PENDING'),
      id: 0,
    },
    {
      name: '2',
      display: t('status.uefaMatch.ONGOING'),
      id: 1,
    },
    {
      name: '3',
      display: t('status.uefaMatch.ENDED'),
      id: 2,
    },
    {
      name: '4',
      display: t('status.uefaMatch.CANCEL'),
      id: 3,
    },
  ],
})

const request = reactive({
  size: 30,
  current: 1,
  sportId: null,
  liveStatus: null,
  title: null,
  eventStartTime: [],
});

const page = reactive({
  total: 0,
  records: [],
  loading: false
});

function formatSportType(row) {
  switch (row.sportId) {
    case 1:
      return t('fields.football')
    case 2:
      return t('fields.basketball')
    default: {
      const item = liveSportTyps.find(item => item.id === row.sportId)
      return item ? item.display : '-'
    }
  }
}
const form = reactive({
  id: null,
  homeId: null,
  homeNameZh: null,
  awayId: null,
  awayNameZh: null,
  sportId: null,
  liveStatus: null,
  sort: null,
  title: null,
  eventStartTime: null,
  eventEndTime: null,
  homeName: '',
  awayName: '',
  isTest: false,
  cover: '',
  isPopular: false,
});

const ui = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  eventStartTime:  getStartOfDayDate(new Date()),
  eventEndTime: getEndOfDayDate(new Date()),
});

const uiForm = reactive({
  eventStartTime: null,
  eventEndTime: null,
});

const validationErrors = reactive({
  title: null
});
async function loadList() {
  page.loading = true;
  try {
    const res = await DashboardService.getSportLiveEvents({ ...request });
    console.log(res)
    page.records = res.data.records || [];
    page.total = res.data.total || 0;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('message.loadFailed'), life: 3000 });
  } finally {
    page.loading = false;
  }
}

function resetQuery() {
  request.sportId = null
  request.nameEn = null
  request.title = null
}

function showDialog(type, row = null) {
  ui.dialogType = type;
  ui.dialogVisible = true;
  validationErrors.title = null;
  if (type === 'EDIT' && row) {
    ui.dialogTitle = t('fields.editEvent');
    Object.assign(form, row);
  } else {
    ui.dialogTitle = t('fields.addCompetition');
    Object.keys(form).forEach(key => form[key] = (typeof form[key] === 'boolean' ? false : null));
  }
}

async function submit() {
  validationErrors.title = null;
  if (!form.title) {
    validationErrors.title = t('message.validateTeamNameRequired');
    return;
  }
  try {
    if (ui.dialogType === 'EDIT') {
      await DashboardService.updateSportLiveEvent(form);
      toast.add({ severity: 'success', summary: 'Success', detail: t('message.updateSuccess'), life: 3000 });
    } else {
      await DashboardService.createSportLiveEvent(form);
      toast.add({ severity: 'success', summary: 'Success', detail: t('message.addSuccess'), life: 3000 });
    }
    ui.dialogVisible = false;
    await loadList();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('message.operationFailed'), life: 3000 });
  }
}

function formatTime(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

function confirmDelete(id) {
  confirm.require({
    message: t('message.confirmDelete'),
    header: t('fields.deleteConfirmation'),
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await DashboardService.deleteSportLiveEvent(id);
        toast.add({ severity: 'success', summary: 'Success', detail: t('message.deleteSuccess'), life: 3000 });
        await loadList();
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: t('message.deleteFailed'), life: 3000 });
      }
    }
  });
}

function changePage(event) {
  request.current = event.page + 1;
  request.size = event.rows;
  loadList();
}

watch(() => uiControl.eventStartTime, (newValue) => {
  request.eventStartTime[0] = formatToStartOfDayString(newValue);
}, { immediate: true });

watch(() => uiControl.eventEndTime, (newValue) => {
  request.eventStartTime[1] = formatToStartOfDayString(newValue);
}, { immediate: true });

watch(() => uiForm.eventStartTime, (newValue) => {
  form.eventStartTime = formatToStartOfDayString(newValue);
}, { immediate: true });

watch(() => uiForm.eventEndTime, (newValue) => {
  form.eventStartTime = formatToStartOfDayString(newValue);
}, { immediate: true });


onMounted(loadList);
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
